<?php
/**
 * Data Seeder Controller
 * Creates sample data for testing Nextcloud Talk integration
 */

namespace OCA\DashboardTalk\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IDBConnection;
use OCP\IUserSession;

class DataSeederController extends Controller {
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
     * Seed sample Nextcloud Talk data for testing
     */
    public function seedTalkData() {
        $user = $this->userSession->getUser();
        if (!$user) {
            return new DataResponse(['error' => 'Not authenticated'], 401);
        }

        try {
            $this->createSampleRooms();
            $this->createSampleParticipants();
            $this->createSampleMessages();
            
            return new DataResponse([
                'success' => true,
                'message' => 'Sample Nextcloud Talk data created successfully'
            ]);
        } catch (\Exception $e) {
            return new DataResponse([
                'success' => false,
                'error' => 'Failed to seed data: ' . $e->getMessage()
            ], 500);
        }
    }

    private function createSampleRooms() {
        $rooms = [
            [
                'token' => 'general_chat',
                'name' => 'General Chat',
                'display_name' => 'General Discussion',
                'type' => 2, // Group chat
                'active' => 1,
                'last_activity' => time(),
                'created_at' => time() - 86400
            ],
            [
                'token' => 'project_alpha',
                'name' => 'Project Alpha',
                'display_name' => 'Project Alpha Team',
                'type' => 2, // Group chat
                'active' => 1,
                'last_activity' => time() - 3600,
                'created_at' => time() - 172800
            ],
            [
                'token' => 'admin_direct',
                'name' => 'admin',
                'display_name' => 'admin',
                'type' => 1, // One-to-one
                'active' => 1,
                'last_activity' => time() - 1800,
                'created_at' => time() - 259200
            ]
        ];

        foreach ($rooms as $room) {
            $query = $this->db->getQueryBuilder();
            $query->insert('talk_rooms')
                ->values([
                    'token' => $query->createNamedParameter($room['token']),
                    'name' => $query->createNamedParameter($room['name']),
                    'display_name' => $query->createNamedParameter($room['display_name']),
                    'type' => $query->createNamedParameter($room['type']),
                    'active' => $query->createNamedParameter($room['active']),
                    'last_activity' => $query->createNamedParameter($room['last_activity']),
                    'created_at' => $query->createNamedParameter($room['created_at'])
                ]);
            $query->execute();
        }
    }

    private function createSampleParticipants() {
        $users = ['admin', 'aashu', 'adithya', 'dhanush'];
        $rooms = ['general_chat', 'project_alpha', 'admin_direct'];
        
        foreach ($rooms as $roomToken) {
            foreach ($users as $userId) {
                $query = $this->db->getQueryBuilder();
                $query->insert('talk_participants')
                    ->values([
                        'room_id' => $query->createNamedParameter($roomToken),
                        'actor_id' => $query->createNamedParameter($userId),
                        'participant_type' => $query->createNamedParameter('users'),
                        'unread_messages' => $query->createNamedParameter(rand(0, 5)),
                        'favorite' => $query->createNamedParameter(rand(0, 1)),
                        'last_read_message' => $query->createNamedParameter(rand(1, 10)),
                        'joined_at' => $query->createNamedParameter(time() - rand(0, 86400))
                    ]);
                $query->execute();
            }
        }
    }

    private function createSampleMessages() {
        $messages = [
            [
                'object_id' => 'general_chat',
                'actor_id' => 'admin',
                'actor_display_name' => 'admin',
                'actor_type' => 'users',
                'message' => 'Welcome to the general chat! This is where we discuss everything.',
                'message_type' => 'comment',
                'timestamp' => time() - 86400
            ],
            [
                'object_id' => 'general_chat',
                'actor_id' => 'aashu',
                'actor_display_name' => 'Aashu',
                'actor_type' => 'users',
                'message' => 'Thanks for setting this up! Looking forward to collaborating.',
                'message_type' => 'comment',
                'timestamp' => time() - 82800
            ],
            [
                'object_id' => 'project_alpha',
                'actor_id' => 'admin',
                'actor_display_name' => 'admin',
                'actor_type' => 'users',
                'message' => 'Project Alpha is our main focus. Let\'s discuss the roadmap.',
                'message_type' => 'comment',
                'timestamp' => time() - 172800
            ],
            [
                'object_id' => 'project_alpha',
                'actor_id' => 'adithya',
                'actor_display_name' => 'Adithya',
                'actor_type' => 'users',
                'message' => 'I\'ve completed the initial design mockups. Ready for review.',
                'message_type' => 'comment',
                'timestamp' => time() - 165600
            ],
            [
                'object_id' => 'admin_direct',
                'actor_id' => 'admin',
                'actor_display_name' => 'admin',
                'actor_type' => 'users',
                'message' => 'This is a direct message between admin and other users.',
                'message_type' => 'comment',
                'timestamp' => time() - 259200
            ]
        ];

        foreach ($messages as $message) {
            $query = $this->db->getQueryBuilder();
            $query->insert('talk_messages')
                ->values([
                    'object_id' => $query->createNamedParameter($message['object_id']),
                    'actor_id' => $query->createNamedParameter($message['actor_id']),
                    'actor_display_name' => $query->createNamedParameter($message['actor_display_name']),
                    'actor_type' => $query->createNamedParameter($message['actor_type']),
                    'message' => $query->createNamedParameter($message['message']),
                    'message_type' => $query->createNamedParameter($message['message_type']),
                    'timestamp' => $query->createNamedParameter($message['timestamp']),
                    'is_replyable' => $query->createNamedParameter(1),
                    'parent_id' => $query->createNamedParameter(null)
                ]);
            $query->execute();
        }
    }
}


