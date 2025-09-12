<?php
namespace OCA\MyNextcloudApp\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\IAppContainer;
use OCP\IAppData;
use OCP\IL10N;
use OCP\IUserSession;
use OCA\MyNextcloudApp\Service\ChatService;
use OCA\MyNextcloudApp\Controller\ChatController;

class Application extends App {
	public const APP_ID = 'my-nextcloud-app';

	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);
		$container = $this->getContainer();

		$container->registerService(ChatService::class, function(IAppContainer $c) {
			return new ChatService(
				$c->query(IAppData::class),
				$c->query(IL10N::class),
			);
		});

		$container->registerService(ChatController::class, function(IAppContainer $c) {
			return new ChatController(
				self::APP_ID,
				$c->query('Request'),
				$c->query(ChatService::class),
				$c->query(IUserSession::class),
			);
		});
	}
}
