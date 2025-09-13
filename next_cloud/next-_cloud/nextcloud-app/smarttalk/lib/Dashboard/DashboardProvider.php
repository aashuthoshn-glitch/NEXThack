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
			public function getTitle(): string { return 'Smart Talk - AI Chat & Groups'; }
			public function getOrder(): int { return 10; }
			public function getIconClass(): string { return 'icon-talk'; }
			public function getUrl(): ?string { return null; }
			public function getContent(): string {
				return '<div id="smart-talk-widget" style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; color: #666;">
					<div style="text-align: center;">
						<h3 style="margin: 0 0 10px 0; color: #333;">🤖 Smart Talk</h3>
						<p style="margin: 0;">AI-powered chat widget is now available globally!</p>
						<p style="margin: 10px 0 0 0; font-size: 12px;">Look for the floating chat button in the bottom-right corner.</p>
					</div>
				</div>';
			}
		};
	}
}
