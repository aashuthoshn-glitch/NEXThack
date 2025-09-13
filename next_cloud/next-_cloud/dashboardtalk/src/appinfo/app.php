<?php

declare(strict_types=1);

use OCA\IOSWidget\AppInfo\Application;
use OCA\IOSWidget\Listener\BeforeLoginListener;
use OCA\IOSWidget\Listener\AfterLoginListener;
use OCA\IOSWidget\Listener\BeforeTemplateListener;

return [
    'id' => 'ioswidget',
    'name' => 'iOS Widget Integration',
    'description' => 'Integrates iOS-style floating widget into main Nextcloud dashboard',
    'author' => 'Nextcloud iOS Widget Team',
    'version' => '1.0.0',
    'category' => 'integration',
    'types' => ['filesystem'],
    'background-jobs' => [
        \OCA\IOSWidget\BackgroundJobs\WidgetUpdater::class,
    ],
    'listeners' => [
        [
            'name' => \OCP\AppFramework\Bootstrap\IBootContext::class,
            'listener' => function (\OCP\AppFramework\Bootstrap\IBootContext $context) {
                // Register widget injection
                $context->registerService('WidgetInjector', function () {
                    return new \OCA\IOSWidget\Service\WidgetInjector();
                });
            }
        ],
        [
            'name' => \OCP\AppFramework\Bootstrap\IRegistrationContext::class,
            'listener' => function (\OCP\AppFramework\Bootstrap\IRegistrationContext $context) {
                // Register event listeners
                $context->registerEventListener(
                    \OCP\User\Events\UserLoggedInEvent::class,
                    AfterLoginListener::class
                );
                $context->registerEventListener(
                    \OCP\AppFramework\Http\BeforeTemplateRenderedEvent::class,
                    BeforeTemplateListener::class
                );
            }
        ]
    ],
    'routes' => [
        [
            'name' => 'widget#index',
            'url' => '/widget',
            'verb' => 'GET'
        ],
        [
            'name' => 'widget#chat',
            'url' => '/chat',
            'verb' => 'POST'
        ],
        [
            'name' => 'widget#conversations',
            'url' => '/conversations',
            'verb' => 'GET'
        ]
    ],
    'resources' => [
        'ioswidget' => [
            'url' => '/apps/ioswidget',
            'root' => 'ioswidget'
        ]
    ]
];

