<?php

declare(strict_types=1);

namespace OCA\DashboardTalk\Dashboard;

use OCP\Dashboard\IWidget;
use OCP\Dashboard\IWidgetManager;
use OCP\Dashboard\Model\IWidgetRequest;
use OCP\Dashboard\Model\WidgetItem;
use OCP\Dashboard\Model\WidgetItems;
use OCP\IL10N;

class DashboardProvider implements IWidgetManager {
	private IL10N $l10n;

	public function __construct(IL10N $l10n) {
		$this->l10n = $l10n;
	}

	public function getId(): string {
		return 'dashboardtalk_widget';
	}

	public function getName(): string {
		return $this->l10n->t('Talk Messages');
	}

	public function getOrder(): int {
		return 10;
	}

	public function getIconClass(): string {
		return 'icon-talk';
	}

	public function getUrl(): ?string {
		return null;
	}

	public function loadWidget(IWidgetRequest $request): IWidget {
		return new class($this->l10n) implements IWidget {
			private IL10N $l10n;

			public function __construct(IL10N $l10n) {
				$this->l10n = $l10n;
			}

			public function getId(): string {
				return 'dashboardtalk_widget';
			}

			public function getTitle(): string {
				return $this->l10n->t('Talk Messages');
			}

			public function getOrder(): int {
				return 10;
			}

			public function getIconClass(): string {
				return 'icon-talk';
			}

			public function getUrl(): ?string {
				return null;
			}

			public function load(): void {
			}

			public function getItems(string $userId, ?string $since = null, int $limit = 7): WidgetItems {
				return new WidgetItems([]);
			}

			public function getSearchResult(string $search, string $userId, int $limit = 7): WidgetItems {
				return new WidgetItems([]);
			}
		};
	}

	public function getScript(IWidget $widget): string {
		return 'dashboardtalk-dashboard';
	}
}
