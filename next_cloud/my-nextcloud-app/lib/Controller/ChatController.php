<?php
namespace OCA\MyNextcloudApp\Controller;

use OCA\MyNextcloudApp\Service\ChatService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IUserSession;

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
}


