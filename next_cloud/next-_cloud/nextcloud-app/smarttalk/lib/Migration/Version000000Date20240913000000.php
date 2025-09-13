<?php
/**
 * Database migration for Smart Talk
 */

namespace OCA\DashboardTalk\Migration;

use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

class Version000000Date20240913000000 implements IRepairStep {
    private $connection;

    public function __construct(IDBConnection $connection) {
        $this->connection = $connection;
    }

    public function getName() {
        return 'Create Smart Talk database tables';
    }

    public function run(IOutput $output) {
        $this->createMessagesTable();
        $this->createGroupsTable();
        $output->info('Smart Talk database tables created successfully');
    }

    private function createMessagesTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `*PREFIX*smart_talk_messages` (
            `id` bigint(20) NOT NULL AUTO_INCREMENT,
            `user_id` varchar(64) NOT NULL,
            `conversation_id` varchar(128) NOT NULL DEFAULT 'general',
            `message` text NOT NULL,
            `timestamp` bigint(20) NOT NULL,
            `is_bot` tinyint(1) NOT NULL DEFAULT 0,
            PRIMARY KEY (`id`),
            KEY `conversation_id` (`conversation_id`),
            KEY `timestamp` (`timestamp`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->connection->executeStatement($sql);
    }

    private function createGroupsTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `*PREFIX*smart_talk_groups` (
            `id` varchar(128) NOT NULL,
            `name` varchar(255) NOT NULL,
            `created_by` varchar(64) NOT NULL,
            `created_at` bigint(20) NOT NULL,
            `members` text NOT NULL,
            PRIMARY KEY (`id`),
            KEY `created_by` (`created_by`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->connection->executeStatement($sql);
    }
}
