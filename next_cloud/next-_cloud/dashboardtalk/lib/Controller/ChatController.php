<?php
/**
 * Chat Controller for Smart Talk
 */

namespace OCA\DashboardTalk\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\IDBConnection;

class ChatController extends Controller {
    private $userSession;
    private $db;

    public function __construct(
        $AppName,
        IRequest $request,
        IUserSession $userSession,
        IDBConnection $db
    ) {
        parent::__construct($AppName, $request);
        $this->userSession = $userSession;
        $this->db = $db;
    }

    /**
     * Send a message
     */
    public function sendMessage() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        $message = $this->request->getParam('message', '');
        $conversationId = $this->request->getParam('conversationId', 'general');
        
        if (empty($message)) {
            return new DataResponse(['error' => 'Message cannot be empty'], 400);
        }

        // Store message in database
        $query = $this->db->getQueryBuilder();
        $query->insert('smart_talk_messages')
            ->values([
                'user_id' => $query->createNamedParameter($user->getUID()),
                'conversation_id' => $query->createNamedParameter($conversationId),
                'message' => $query->createNamedParameter($message),
                'timestamp' => $query->createNamedParameter(time()),
                'is_bot' => $query->createNamedParameter(0)
            ]);
        $query->execute();

        // Process with AI bot
        $botResponse = $this->processWithAI($message);

        // Store bot response
        if ($botResponse) {
            $query = $this->db->getQueryBuilder();
            $query->insert('smart_talk_messages')
                ->values([
                    'user_id' => $query->createNamedParameter('bot'),
                    'conversation_id' => $query->createNamedParameter($conversationId),
                    'message' => $query->createNamedParameter($botResponse),
                    'timestamp' => $query->createNamedParameter(time()),
                    'is_bot' => $query->createNamedParameter(1)
                ]);
            $query->execute();
        }

        return new DataResponse([
            'success' => true,
            'userMessage' => [
                'id' => time(),
                'message' => $message,
                'user' => $user->getDisplayName(),
                'timestamp' => time(),
                'isBot' => false
            ],
            'botResponse' => $botResponse ? [
                'id' => time() + 1,
                'message' => $botResponse,
                'user' => 'NextBot',
                'timestamp' => time() + 1,
                'isBot' => true
            ] : null
        ]);
    }

    /**
     * Get messages for a conversation
     */
    public function getMessages() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        $conversationId = $this->request->getParam('conversationId', 'general');
        $limit = $this->request->getParam('limit', 50);

        $query = $this->db->getQueryBuilder();
        $query->select('*')
            ->from('smart_talk_messages')
            ->where($query->expr()->eq('conversation_id', $query->createNamedParameter($conversationId)))
            ->orderBy('timestamp', 'DESC')
            ->setMaxResults($limit);

        $result = $query->execute();
        $messages = $result->fetchAll();

        // Format messages
        $formattedMessages = [];
        foreach ($messages as $message) {
            $formattedMessages[] = [
                'id' => $message['id'],
                'message' => $message['message'],
                'user' => $message['is_bot'] ? 'NextBot' : $message['user_id'],
                'timestamp' => (int)$message['timestamp'],
                'isBot' => (bool)$message['is_bot']
            ];
        }

        return new DataResponse([
            'messages' => array_reverse($formattedMessages),
            'conversationId' => $conversationId
        ]);
    }

    /**
     * Create a new group
     */
    public function createGroup() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        $groupName = $this->request->getParam('name', '');
        $members = $this->request->getParam('members', []);
        
        if (empty($groupName)) {
            return new DataResponse(['error' => 'Group name cannot be empty'], 400);
        }

        $groupId = 'group_' . time() . '_' . uniqid();

        // Store group in database
        $query = $this->db->getQueryBuilder();
        $query->insert('smart_talk_groups')
            ->values([
                'id' => $query->createNamedParameter($groupId),
                'name' => $query->createNamedParameter($groupName),
                'created_by' => $query->createNamedParameter($user->getUID()),
                'created_at' => $query->createNamedParameter(time()),
                'members' => $query->createNamedParameter(json_encode(array_merge([$user->getUID()], $members)))
            ]);
        $query->execute();

        return new DataResponse([
            'success' => true,
            'groupId' => $groupId,
            'groupName' => $groupName,
            'message' => "Group '{$groupName}' created successfully!"
        ]);
    }

    /**
     * Get user's groups
     */
    public function getGroups() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        $query = $this->db->getQueryBuilder();
        $query->select('*')
            ->from('smart_talk_groups')
            ->where($query->expr()->like('members', $query->createNamedParameter('%' . $user->getUID() . '%')))
            ->orderBy('created_at', 'DESC');

        $result = $query->execute();
        $groups = $result->fetchAll();

        $formattedGroups = [];
        foreach ($groups as $group) {
            $members = json_decode($group['members'], true);
            $formattedGroups[] = [
                'id' => $group['id'],
                'name' => $group['name'],
                'createdBy' => $group['created_by'],
                'createdAt' => (int)$group['created_at'],
                'memberCount' => count($members)
            ];
        }

        return new DataResponse(['groups' => $formattedGroups]);
    }

    /**
     * Process message with AI
     */
    private function processWithAI($message) {
        $lowerMessage = strtolower(trim($message));
        
        // Greeting responses
        if (preg_match('/\b(hello|hi|hey|greetings)\b/', $lowerMessage)) {
            $responses = [
                "Hello! I'm NextBot, your AI assistant. How can I help you today?",
                "Hi there! I'm here to assist you with Smart Talk features. What would you like to know?",
                "Greetings! I'm NextBot, ready to help you with group management and more!"
            ];
            return $responses[array_rand($responses)];
        }
        
        // Group creation
        if (preg_match('/\b(create|new|make).*group\b/', $lowerMessage)) {
            return "To create a new group, click the '+' button in the header or use the group creation feature. You can add multiple members and start group conversations!";
        }
        
        // Help requests
        if (preg_match('/\b(help|assist|support)\b/', $lowerMessage)) {
            return "I can help you with: 🤖 AI Chat, 👥 Group Management, 📞 Video/Audio Calls, 🔄 Real-time Status, 😊 Message Reactions, and 📱 Mobile Support! What would you like to know more about?";
        }
        
        // Feature questions
        if (preg_match('/\b(feature|features|what.*can|capabilities)\b/', $lowerMessage)) {
            return "Smart Talk features include: AI-powered chat assistance, group creation and management, video/audio calling, real-time online status, message reactions, and mobile-responsive design!";
        }
        
        // Call/video questions
        if (preg_match('/\b(call|video|audio|meeting)\b/', $lowerMessage)) {
            return "Video and audio calls are available in group chats! You can start conversations with your team members directly from the chat interface. Just click the call button next to any message!";
        }
        
        // Status questions
        if (preg_match('/\b(status|online|offline|who.*online)\b/', $lowerMessage)) {
            return "Real-time online/offline status is shown for all participants. Green indicators show online users, gray indicators show offline users. You can see this in group conversations!";
        }
        
        // Default responses
        $defaultResponses = [
            "I'm here to help! You can ask me about creating groups, making calls, using features, or anything else about Smart Talk.",
            "That's interesting! I can help you with group management, video calls, or any other Smart Talk features. What would you like to explore?",
            "I understand! Feel free to ask me about Smart Talk's features like group creation, video calling, or real-time messaging.",
            "Great question! I'm here to assist you with all Smart Talk features. What would you like to know more about?"
        ];
        
        return $defaultResponses[array_rand($defaultResponses)];
    }
}


