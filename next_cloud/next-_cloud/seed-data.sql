-- Seed sample data for Nextcloud Talk integration
-- Insert sample rooms
INSERT INTO oc_talk_rooms (token, name, display_name, type, active, last_activity, created_at) VALUES
('general_chat', 'General Chat', 'General Discussion', 2, 1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP() - 86400),
('project_alpha', 'Project Alpha', 'Project Alpha Team', 2, 1, UNIX_TIMESTAMP() - 3600, UNIX_TIMESTAMP() - 172800),
('admin_direct', 'admin', 'admin', 1, 1, UNIX_TIMESTAMP() - 1800, UNIX_TIMESTAMP() - 259200);

-- Insert sample participants
INSERT INTO oc_talk_participants (room_id, actor_id, participant_type, unread_messages, favorite, last_read_message, joined_at) VALUES
('general_chat', 'admin', 'users', 0, 1, 1, UNIX_TIMESTAMP() - 86400),
('general_chat', 'aashu', 'users', 2, 0, 1, UNIX_TIMESTAMP() - 82800),
('general_chat', 'adithya', 'users', 1, 0, 1, UNIX_TIMESTAMP() - 82800),
('general_chat', 'dhanush', 'users', 0, 0, 1, UNIX_TIMESTAMP() - 82800),
('project_alpha', 'admin', 'users', 0, 1, 1, UNIX_TIMESTAMP() - 172800),
('project_alpha', 'aashu', 'users', 1, 0, 1, UNIX_TIMESTAMP() - 165600),
('project_alpha', 'adithya', 'users', 0, 1, 1, UNIX_TIMESTAMP() - 165600),
('project_alpha', 'dhanush', 'users', 0, 0, 1, UNIX_TIMESTAMP() - 165600),
('admin_direct', 'admin', 'users', 0, 0, 1, UNIX_TIMESTAMP() - 259200),
('admin_direct', 'aashu', 'users', 0, 0, 1, UNIX_TIMESTAMP() - 259200),
('admin_direct', 'adithya', 'users', 0, 0, 1, UNIX_TIMESTAMP() - 259200),
('admin_direct', 'dhanush', 'users', 0, 0, 1, UNIX_TIMESTAMP() - 259200);

-- Insert sample messages
INSERT INTO oc_talk_messages (object_id, actor_id, actor_display_name, actor_type, message, message_type, timestamp, is_replyable, parent_id) VALUES
('general_chat', 'admin', 'admin', 'users', 'Welcome to the general chat! This is where we discuss everything.', 'comment', UNIX_TIMESTAMP() - 86400, 1, NULL),
('general_chat', 'aashu', 'Aashu', 'users', 'Thanks for setting this up! Looking forward to collaborating.', 'comment', UNIX_TIMESTAMP() - 82800, 1, NULL),
('general_chat', 'adithya', 'Adithya', 'users', 'This is great! I can see the integration is working.', 'comment', UNIX_TIMESTAMP() - 7200, 1, NULL),
('project_alpha', 'admin', 'admin', 'users', 'Project Alpha is our main focus. Let''s discuss the roadmap.', 'comment', UNIX_TIMESTAMP() - 172800, 1, NULL),
('project_alpha', 'adithya', 'Adithya', 'users', 'I''ve completed the initial design mockups. Ready for review.', 'comment', UNIX_TIMESTAMP() - 165600, 1, NULL),
('project_alpha', 'aashu', 'Aashu', 'users', 'The backend integration looks solid. Great work!', 'comment', UNIX_TIMESTAMP() - 14400, 1, NULL),
('admin_direct', 'admin', 'admin', 'users', 'This is a direct message between admin and other users.', 'comment', UNIX_TIMESTAMP() - 259200, 1, NULL),
('admin_direct', 'aashu', 'Aashu', 'users', 'Got it! The direct messaging is working perfectly.', 'comment', UNIX_TIMESTAMP() - 252000, 1, NULL);
