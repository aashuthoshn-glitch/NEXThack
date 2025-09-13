<?php
/**
 * Migration for Nextcloud Talk integration tables
 */

namespace OCA\DashboardTalk\Migration;

use OCP\Migration\ISchemaWrapper;
use OCP\Migration\MigrationStep;
use OCP\IDBConnection;

class Version000001Date20240913000001 extends MigrationStep {
    private IDBConnection $connection;

    public function __construct(IDBConnection $connection) {
        $this->connection = $connection;
    }

    public function changeSchema(ISchemaWrapper $schema, array $options): void {
        // Create talk_rooms table (simplified version for integration)
        if (!$schema->hasTable('talk_rooms')) {
            $table = $schema->createTable('talk_rooms');
            $table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true]);
            $table->addColumn('token', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('name', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('display_name', 'string', ['length' => 255, 'notnull' => false]);
            $table->addColumn('type', 'integer', ['notnull' => true, 'default' => 0]);
            $table->addColumn('active', 'integer', ['notnull' => true, 'default' => 1]);
            $table->addColumn('last_activity', 'integer', ['notnull' => true, 'default' => 0]);
            $table->addColumn('created_at', 'integer', ['notnull' => true, 'default' => 0]);
            $table->setPrimaryKey(['id']);
            $table->addIndex(['token'], 'talk_rooms_token_idx');
            $table->addIndex(['active'], 'talk_rooms_active_idx');
            $table->addIndex(['last_activity'], 'talk_rooms_activity_idx');
        }

        // Create talk_messages table
        if (!$schema->hasTable('talk_messages')) {
            $table = $schema->createTable('talk_messages');
            $table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true]);
            $table->addColumn('object_id', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('actor_id', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('actor_display_name', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('actor_type', 'string', ['length' => 50, 'notnull' => true]);
            $table->addColumn('message', 'text', ['notnull' => true]);
            $table->addColumn('message_type', 'string', ['length' => 50, 'notnull' => true, 'default' => 'comment']);
            $table->addColumn('timestamp', 'integer', ['notnull' => true]);
            $table->addColumn('is_replyable', 'integer', ['notnull' => true, 'default' => 1]);
            $table->addColumn('parent_id', 'bigint', ['notnull' => false]);
            $table->setPrimaryKey(['id']);
            $table->addIndex(['object_id'], 'talk_messages_object_idx');
            $table->addIndex(['actor_id'], 'talk_messages_actor_idx');
            $table->addIndex(['timestamp'], 'talk_messages_timestamp_idx');
        }

        // Create talk_participants table
        if (!$schema->hasTable('talk_participants')) {
            $table = $schema->createTable('talk_participants');
            $table->addColumn('id', 'bigint', ['autoincrement' => true, 'notnull' => true]);
            $table->addColumn('room_id', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('actor_id', 'string', ['length' => 255, 'notnull' => true]);
            $table->addColumn('participant_type', 'string', ['length' => 50, 'notnull' => true]);
            $table->addColumn('unread_messages', 'integer', ['notnull' => true, 'default' => 0]);
            $table->addColumn('favorite', 'integer', ['notnull' => true, 'default' => 0]);
            $table->addColumn('last_read_message', 'bigint', ['notnull' => false]);
            $table->addColumn('joined_at', 'integer', ['notnull' => true, 'default' => 0]);
            $table->setPrimaryKey(['id']);
            $table->addIndex(['room_id'], 'talk_participants_room_idx');
            $table->addIndex(['actor_id'], 'talk_participants_actor_idx');
            $table->addIndex(['participant_type'], 'talk_participants_type_idx');
        }
    }
}
