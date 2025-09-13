<?php

declare(strict_types=1);

namespace OCA\IOSWidget\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'ioswidget';

    public function __construct()
    {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void
    {
        // Register services
        $context->registerService('WidgetService', function () {
            return new \OCA\IOSWidget\Service\WidgetService();
        });
        
        $context->registerService('ChatbotService', function () {
            return new \OCA\IOSWidget\Service\ChatbotService();
        });
        
        $context->registerService('TalkApiService', function () {
            return new \OCA\IOSWidget\Service\TalkApiService();
        });
    }

    public function boot(IBootContext $context): void
    {
        // Inject widget into main Nextcloud interface
        $this->injectWidget();
    }

    private function injectWidget(): void
    {
        // Add widget to main Nextcloud dashboard
        \OCP\Util::addScript(self::APP_ID, 'ioswidget');
        \OCP\Util::addStyle(self::APP_ID, 'ioswidget');
        
        // Inject widget HTML into main template
        \OCP\Util::connectHook(
            'OCP\AppFramework\Http\BeforeTemplateRenderedEvent',
            'beforeRender',
            function ($event) {
                $this->injectWidgetHTML($event);
            }
        );
    }

    private function injectWidgetHTML($event): void
    {
        $widgetHTML = $this->getWidgetHTML();
        
        // Inject into main Nextcloud template
        $event->getTemplate()->assign('ioswidget_html', $widgetHTML);
    }

    private function getWidgetHTML(): string
    {
        return '
        <div id="nextcloud-ios-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
            <div id="floating-btn" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%); box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease;">
                <span style="font-size: 24px; color: white;">💬</span>
            </div>
            <div id="widget-panel" style="position: absolute; bottom: 80px; right: 20px; width: 400px; height: 600px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(40px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); transform: scale(0.1) translateY(100px); opacity: 0; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden; display: none;">
                <div style="padding: 20px; background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%); color: white;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">NextBot Assistant</h3>
                            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; opacity: 0.9; margin-top: 4px;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #34C759;"></span>
                                <span>Connected to Nextcloud</span>
                            </div>
                        </div>
                        <button id="close-btn" style="background: rgba(255, 255, 255, 0.2); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;">×</button>
                    </div>
                </div>
                <div style="display: flex; background: rgba(255, 255, 255, 0.8); border-bottom: 1px solid rgba(0, 0, 0, 0.1);">
                    <button class="tab-btn active" data-tab="chat" style="flex: 1; padding: 12px 8px; border: none; background: transparent; cursor: pointer; font-size: 12px; font-weight: 500; color: #007AFF; border-bottom: 2px solid #007AFF;">💬 Chat</button>
                    <button class="tab-btn" data-tab="conversations" style="flex: 1; padding: 12px 8px; border: none; background: transparent; cursor: pointer; font-size: 12px; font-weight: 500; color: #666; border-bottom: 2px solid transparent;">👥 Conversations</button>
                    <button class="tab-btn" data-tab="actions" style="flex: 1; padding: 12px 8px; border: none; background: transparent; cursor: pointer; font-size: 12px; font-weight: 500; color: #666; border-bottom: 2px solid transparent;">⚡ Actions</button>
                </div>
                <div id="widget-content" style="flex: 1; overflow: hidden; display: flex; flex-direction: column;">
                    <div id="tab-chat" class="tab-content active" style="display: flex; flex: 1; overflow: hidden; flex-direction: column;">
                        <div style="flex: 1; overflow-y: auto; padding: 16px 20px; background: rgba(248, 248, 248, 0.8);">
                            <div id="messages-container" style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="display: flex; gap: 12px; animation: slideInUp 0.3s ease;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #34C759; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; flex-shrink: 0;">🤖</div>
                                    <div style="flex: 1; background: white; border-radius: 16px; padding: 12px 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 280px;">
                                        <div style="font-size: 14px; line-height: 1.4; color: #333;">Hello! I\'m NextBot, integrated into your main Nextcloud dashboard. I can help you with Talk, Files, Calendar, and more!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 16px 20px; background: rgba(255, 255, 255, 0.9); border-top: 1px solid rgba(0, 0, 0, 0.1);">
                            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                                <input type="text" id="message-input" placeholder="Ask me about Nextcloud features..." style="flex: 1; padding: 12px 16px; border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 20px; font-size: 14px; outline: none; background: white;">
                                <button id="send-btn" style="width: 44px; height: 44px; border-radius: 50%; background: #007AFF; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;">📤</button>
                            </div>
                            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
                                <span class="suggestion-chip" data-suggestion="Show my conversations" style="background: rgba(0, 122, 255, 0.1); border: 1px solid rgba(0, 122, 255, 0.2); border-radius: 16px; padding: 6px 12px; font-size: 12px; color: #007AFF; cursor: pointer; white-space: nowrap; flex-shrink: 0;">Show my conversations</span>
                                <span class="suggestion-chip" data-suggestion="Create a new group" style="background: rgba(0, 122, 255, 0.1); border: 1px solid rgba(0, 122, 255, 0.2); border-radius: 16px; padding: 6px 12px; font-size: 12px; color: #007AFF; cursor: pointer; white-space: nowrap; flex-shrink: 0;">Create a new group</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ';
    }
}

