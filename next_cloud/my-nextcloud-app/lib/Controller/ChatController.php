<?php
namespace OCA\MyNextcloudApp\Controller;

use OCA\MyNextcloudApp\Service\ChatService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\AppFramework\Http; 
use OCP\IConfig;

class ChatController extends Controller {
    public function __construct(
        string $AppName,
        IRequest $request,
        private ChatService $chatService,
        private IUserSession $userSession,
    ) {
        parent::__construct($AppName, $request);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function list(string $room): DataResponse {
        $since = $this->request->getParam('since');
        $sinceTs = is_numeric($since) ? (int)$since : null;
        $data = $this->chatService->listMessages($room, $sinceTs);
        return new DataResponse(['ok' => true, 'messages' => $data]);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function send(string $room): DataResponse {
        $user = $this->userSession->getUser();
        $uid = $user ? $user->getUID() : 'guest';
        $text = (string)$this->request->getParam('text', '');
        $message = $this->chatService->sendMessage($room, $uid, $text);
        return new DataResponse(['ok' => true, 'message' => $message]);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function react(string $room): DataResponse {
        $user = $this->userSession->getUser();
        $uid = $user ? $user->getUID() : 'guest';
        $messageId = (string)$this->request->getParam('messageId', '');
        $emoji = (string)$this->request->getParam('emoji', '');
        $updated = $this->chatService->addReaction($room, $messageId, $uid, $emoji);
        return new DataResponse(['ok' => true, 'message' => $updated]);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function presenceSet(string $room): DataResponse {
        $user = $this->userSession->getUser();
        $uid = $user ? $user->getUID() : 'guest';
        $status = (string)$this->request->getParam('status', 'online');
        $info = $this->chatService->setPresence($room, $uid, $status);
        return new DataResponse(['ok' => true, 'presence' => $info]);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function presenceList(string $room): DataResponse {
        $list = $this->chatService->listPresence($room);
        return new DataResponse(['ok' => true, 'presence' => $list]);
    }

    /**
     * Proxy to Google Gemini API so the API key is never exposed to the browser.
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function gemini(): DataResponse {
        // Try ENV first, then app config value
        $apiKey = getenv('GEMINI_API_KEY') ?: (\OC::$server->getConfig()->getAppValue('my-nextcloud-app', 'gemini_key', ''));
        if ($apiKey === '') {
            return new DataResponse(['ok' => false, 'error' => 'missing_api_key'], Http::STATUS_BAD_REQUEST);
        }
        // Support JSON payloads (fetch with application/json)
        $prompt = '';
        $history = null;
        $contentType = (string)$this->request->getHeader('Content-Type');
        if (stripos($contentType, 'application/json') !== false) {
            $raw = file_get_contents('php://input') ?: '';
            $decoded = json_decode($raw, true) ?: [];
            $prompt = (string)($decoded['prompt'] ?? '');
            $history = $decoded['history'] ?? null;
        } else {
            $prompt = (string)$this->request->getParam('prompt', '');
            $history = $this->request->getParam('history');
        }
        $system = "You are a Nextcloud expert. Answer all Nextcloud-related questions accurately; otherwise, respond to general queries. Keep answers concise and helpful.";

        $historyText = '';
        if (is_array($history)) {
            foreach ($history as $turn) {
                $role = isset($turn['role']) ? (string)$turn['role'] : 'user';
                $parts = isset($turn['parts'][0]['text']) ? (string)$turn['parts'][0]['text'] : '';
                $historyText .= strtoupper($role) . ": " . $parts . "\n";
            }
        }

        $combined = $system . "\n\n" . "HISTORY:\n" . $historyText . "\n" . "QUESTION:\n" . $prompt;

        $payload = [
            'contents' => [
                [ 'role' => 'user', 'parts' => [ [ 'text' => $combined ] ] ],
            ],
        ];

        $opts = [
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'timeout' => 30,
            ],
        ];
        $ctx = stream_context_create($opts);
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . rawurlencode($apiKey);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            return new DataResponse(['ok' => false, 'error' => 'upstream_failed'], Http::STATUS_BAD_GATEWAY);
        }
        $json = json_decode($raw, true);
        if (!is_array($json)) {
            return new DataResponse(['ok' => false, 'error' => 'invalid_response'], Http::STATUS_BAD_GATEWAY);
        }
        if (isset($json['error'])) {
            return new DataResponse(['ok' => false, 'error' => $json['error']['message'] ?? 'gemini_error'], Http::STATUS_BAD_GATEWAY);
        }
        return new DataResponse(['ok' => true, 'data' => $json]);
    }
}


