<?php
/**
 * Talk Integration Controller
 * Handles integration between Smart Talk and Nextcloud Talk
 */

namespace OCA\DashboardTalk\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\IDBConnection;
use OCP\IURLGenerator;

class TalkIntegrationController extends Controller {
    private $userSession;
    private $db;
    private $urlGenerator;

    public function __construct(
        $AppName,
        IRequest $request,
        IUserSession $userSession,
        IDBConnection $db,
        IURLGenerator $urlGenerator
    ) {
        parent::__construct($AppName, $request);
        $this->userSession = $userSession;
        $this->db = $db;
        $this->urlGenerator = $urlGenerator;
    }

    /**
     * Get Nextcloud Talk conversations for the current user
     */
    public function getTalkConversations() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        try {
            // Get conversations from Nextcloud Talk
            $conversations = $this->fetchTalkConversations($user);
            
            return new DataResponse([
                'success' => true,
                'conversations' => $conversations
            ]);
        } catch (\Exception $e) {
            return new DataResponse([
                'success' => false,
                'error' => 'Failed to fetch conversations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get messages from a specific Nextcloud Talk conversation
     */
    public function getTalkMessages() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        $conversationToken = $this->request->getParam('conversationToken');
        $limit = $this->request->getParam('limit', 50);

        if (!$conversationToken) {
            return new DataResponse(['error' => 'Conversation token required'], 400);
        }

        try {
            $messages = $this->fetchTalkMessages($conversationToken, $limit);
            
            return new DataResponse([
                'success' => true,
                'messages' => $messages
            ]);
        } catch (\Exception $e) {
            return new DataResponse([
                'success' => false,
                'error' => 'Failed to fetch messages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message to a Nextcloud Talk conversation
     */
    public function sendTalkMessage() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        $conversationToken = $this->request->getParam('conversationToken');
        $message = $this->request->getParam('message');
        $replyTo = $this->request->getParam('replyTo');

        if (!$conversationToken || !$message) {
            return new DataResponse(['error' => 'Conversation token and message required'], 400);
        }

        try {
            $result = $this->sendMessageToTalk($conversationToken, $message, $replyTo);
            
            return new DataResponse([
                'success' => true,
                'message' => $result
            ]);
        } catch (\Exception $e) {
            return new DataResponse([
                'success' => false,
                'error' => 'Failed to send message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get WebSocket configuration for real-time updates
     */
    public function getWebSocketConfig() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        try {
            $config = $this->getTalkWebSocketConfig();
            
            return new DataResponse([
                'success' => true,
                'config' => $config
            ]);
        } catch (\Exception $e) {
            return new DataResponse([
                'success' => false,
                'error' => 'Failed to get WebSocket config: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Fetch conversations from Nextcloud Talk
     */
    private function fetchTalkConversations($user) {
        // This would typically make an internal API call to Nextcloud Talk
        // For now, we'll simulate the data structure
        
        $conversations = [];
        
        // Simulate fetching from Nextcloud Talk database
        $query = $this->db->getQueryBuilder();
        $query->select('*')
            ->from('talk_rooms')
            ->where($query->expr()->eq('active', $query->createNamedParameter(1)))
            ->orderBy('last_activity', 'DESC');

        $result = $query->execute();
        $rooms = $result->fetchAll();

        foreach ($rooms as $room) {
            $conversations[] = [
                'token' => $room['token'],
                'name' => $room['name'],
                'displayName' => $room['display_name'] ?: $room['name'],
                'type' => (int)$room['type'],
                'participantType' => $this->getParticipantType($room['token'], $user->getUID()),
                'lastActivity' => (int)$room['last_activity'],
                'unreadMessages' => $this->getUnreadCount($room['token'], $user->getUID()),
                'isFavorite' => $this->isFavorite($room['token'], $user->getUID())
            ];
        }

        return $conversations;
    }

    /**
     * Fetch messages from a specific conversation
     */
    private function fetchTalkMessages($conversationToken, $limit) {
        $query = $this->db->getQueryBuilder();
        $query->select('*')
            ->from('talk_messages')
            ->where($query->expr()->eq('object_id', $query->createNamedParameter($conversationToken)))
            ->orderBy('id', 'DESC')
            ->setMaxResults($limit);

        $result = $query->execute();
        $messages = $result->fetchAll();

        $formattedMessages = [];
        foreach ($messages as $message) {
            $formattedMessages[] = [
                'id' => (int)$message['id'],
                'message' => $message['message'],
                'actorId' => $message['actor_id'],
                'actorDisplayName' => $message['actor_display_name'],
                'actorType' => $message['actor_type'],
                'timestamp' => (int)$message['timestamp'],
                'messageType' => $message['message_type'],
                'isReplyable' => (bool)$message['is_replyable'],
                'parentId' => $message['parent_id'] ? (int)$message['parent_id'] : null
            ];
        }

        return array_reverse($formattedMessages);
    }

    /**
     * Send message to Nextcloud Talk
     */
    private function sendMessageToTalk($conversationToken, $message, $replyTo = null) {
        $user = $this->userSession->getUser();
        
        // Insert message into Nextcloud Talk database
        $query = $this->db->getQueryBuilder();
        $query->insert('talk_messages')
            ->values([
                'object_id' => $query->createNamedParameter($conversationToken),
                'actor_id' => $query->createNamedParameter($user->getUID()),
                'actor_display_name' => $query->createNamedParameter($user->getDisplayName()),
                'actor_type' => $query->createNamedParameter('users'),
                'message' => $query->createNamedParameter($message),
                'message_type' => $query->createNamedParameter('comment'),
                'timestamp' => $query->createNamedParameter(time()),
                'is_replyable' => $query->createNamedParameter(1),
                'parent_id' => $query->createNamedParameter($replyTo)
            ]);

        $query->execute();
        $messageId = $query->getLastInsertId();

        // Update room last activity
        $updateQuery = $this->db->getQueryBuilder();
        $updateQuery->update('talk_rooms')
            ->set('last_activity', $updateQuery->createNamedParameter(time()))
            ->where($updateQuery->expr()->eq('token', $updateQuery->createNamedParameter($conversationToken)));
        $updateQuery->execute();

        return [
            'id' => $messageId,
            'message' => $message,
            'actorId' => $user->getUID(),
            'actorDisplayName' => $user->getDisplayName(),
            'timestamp' => time()
        ];
    }

    /**
     * Get WebSocket configuration
     */
    private function getTalkWebSocketConfig() {
        // This would typically get the actual WebSocket configuration from Nextcloud
        return [
            'websocket' => 'ws://localhost:8080/ws',
            'fallback' => true,
            'pollingInterval' => 2000
        ];
    }

    /**
     * Get participant type for a room
     */
    private function getParticipantType($roomToken, $userId) {
        $query = $this->db->getQueryBuilder();
        $query->select('participant_type')
            ->from('talk_participants')
            ->where($query->expr()->eq('room_id', $query->createNamedParameter($roomToken)))
            ->andWhere($query->expr()->eq('actor_id', $query->createNamedParameter($userId)));

        $result = $query->execute();
        $participant = $result->fetch();

        return $participant ? $participant['participant_type'] : 'none';
    }

    /**
     * Get unread message count
     */
    private function getUnreadCount($roomToken, $userId) {
        $query = $this->db->getQueryBuilder();
        $query->select('unread_messages')
            ->from('talk_participants')
            ->where($query->expr()->eq('room_id', $query->createNamedParameter($roomToken)))
            ->andWhere($query->expr()->eq('actor_id', $query->createNamedParameter($userId)));

        $result = $query->execute();
        $participant = $result->fetch();

        return $participant ? (int)$participant['unread_messages'] : 0;
    }

    /**
     * Check if room is favorite
     */
    private function isFavorite($roomToken, $userId) {
        $query = $this->db->getQueryBuilder();
        $query->select('favorite')
            ->from('talk_participants')
            ->where($query->expr()->eq('room_id', $query->createNamedParameter($roomToken)))
            ->andWhere($query->expr()->eq('actor_id', $query->createNamedParameter($userId)));

        $result = $query->execute();
        $participant = $result->fetch();

        return $participant ? (bool)$participant['favorite'] : false;
    }
}
