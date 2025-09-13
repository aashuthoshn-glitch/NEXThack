<?php
/**
 * Routes for Smart Talk
 */

namespace OCA\DashboardTalk\AppInfo;

use OCP\Route\IRouter;

class Routes {
    public static function register(IRouter $router) {
        // Smart Talk API routes
        $router->create('smart_talk_send_message', '/apps/dashboardtalk/api/smart-talk/send')
            ->action('ChatController', 'sendMessage')
            ->method('POST');
            
        $router->create('smart_talk_get_messages', '/apps/dashboardtalk/api/smart-talk/messages')
            ->action('ChatController', 'getMessages')
            ->method('GET');
            
        $router->create('smart_talk_create_group', '/apps/dashboardtalk/api/smart-talk/groups')
            ->action('ChatController', 'createGroup')
            ->method('POST');
            
        $router->create('smart_talk_get_groups', '/apps/dashboardtalk/api/smart-talk/groups')
            ->action('ChatController', 'getGroups')
            ->method('GET');
            
        // Nextcloud Talk Integration routes
        $router->create('talk_get_conversations', '/apps/dashboardtalk/api/talk/conversations')
            ->action('TalkIntegrationController', 'getTalkConversations')
            ->method('GET');
            
        $router->create('talk_get_messages', '/apps/dashboardtalk/api/talk/messages')
            ->action('TalkIntegrationController', 'getTalkMessages')
            ->method('GET');
            
        $router->create('talk_send_message', '/apps/dashboardtalk/api/talk/messages')
            ->action('TalkIntegrationController', 'sendTalkMessage')
            ->method('POST');
            
        $router->create('talk_websocket_config', '/apps/dashboardtalk/api/talk/websocket')
            ->action('TalkIntegrationController', 'getWebSocketConfig')
            ->method('GET');
            
        // Data seeder route (for testing)
        $router->create('seed_talk_data', '/apps/dashboardtalk/api/talk/seed')
            ->action('DataSeederController', 'seedTalkData')
            ->method('POST');
    }
}
