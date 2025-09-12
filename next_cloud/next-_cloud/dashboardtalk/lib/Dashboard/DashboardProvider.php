<?php

declare(strict_types=1);

namespace OCA\DashboardTalk\Dashboard;

use OCP\Dashboard\IWidget;
use OCP\Dashboard\IWidgetProvider;
use OCP\IL10N;

class DashboardProvider implements IWidgetProvider {
	private IL10N $l10n;

	public function __construct(IL10N $l10n) {
		$this->l10n = $l10n;
	}

	public function getId(): string {
		return 'dashboardtalk_widget';
	}

	public function getName(): string {
		return (string) $this->l10n->t('Talk Messages');
	}

	public function getDescription(): string {
		return (string) $this->l10n->t('A dashboard widget to display recent Talk messages');
	}

	public function getIconClass(): string {
		return 'icon-talk';
	}

	public function isEnabled(): bool {
		return true;
	}

	public function getWidget(): IWidget {
		return new class implements IWidget {
			public function getId(): string { return 'dashboardtalk_widget'; }
			public function getTitle(): string { return 'Talk Messages'; }
			public function getOrder(): int { return 10; }
			public function getIconClass(): string { return 'icon-talk'; }
			public function getUrl(): ?string { return null; }
		};
	}
}
