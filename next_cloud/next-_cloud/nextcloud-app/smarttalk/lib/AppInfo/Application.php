<?php
/**
 * Smart Talk Application
 */

namespace OCA\DashboardTalk\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\IDBConnection;
use OCP\Migration\IRepairStep;
use OCA\DashboardTalk\Migration\Version000000Date20240913000000;
use OCA\DashboardTalk\Migration\Version000001Date20240913000001;

class Application extends App implements IBootstrap {
    public const APP_ID = 'dashboardtalk';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void {
        // Register routes
        Routes::register($context->getRouteContainer());
        
        // Register repair steps
        $context->registerRepairStep(Version000000Date20240913000000::class);
        $context->registerRepairStep(Version000001Date20240913000001::class);
    }

    public function boot(IBootContext $context): void {
        // Add global script to all pages
        $this->addGlobalScript();
        
        // Run database migrations
        $this->runMigrations();
    }

    private function addGlobalScript(): void {
        \OCP\Util::addScript(self::APP_ID, 'smart-talk-simple');
    }

    private function runMigrations(): void {
        $connection = $this->getContainer()->get(IDBConnection::class);
        
        // Run Smart Talk migration
        $migration1 = new Version000000Date20240913000000($connection);
        $migration1->run(new class implements \OCP\Migration\IOutput {
            public function info($message) { error_log($message); }
            public function warning($message) { error_log($message); }
            public function error($message) { error_log($message); }
        });
        
        // Run Nextcloud Talk integration migration
        $migration2 = new Version000001Date20240913000001($connection);
        $migration2->run(new class implements \OCP\Migration\IOutput {
            public function info($message) { error_log($message); }
            public function warning($message) { error_log($message); }
            public function error($message) { error_log($message); }
        });
    }
}