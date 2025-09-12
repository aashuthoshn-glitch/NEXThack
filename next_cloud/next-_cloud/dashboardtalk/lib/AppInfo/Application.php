<?php

declare(strict_types=1);

namespace OCA\DashboardTalk\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCA\DashboardTalk\Dashboard\DashboardProvider;

class Application extends App implements IBootstrap {
	public const APP_ID = 'dashboardtalk';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerDashboardProvider(DashboardProvider::class);
	}

	public function boot(IBootContext $context): void {
	}
}
