import { createApp } from 'vue'
import TalkWidget from './components/TalkWidget.vue'
import { createApp as createApp2 } from 'vue'
import NotificationCenter from './components/NotificationCenter.vue'
import { startTalkNotifications } from './services/TalkNotificationService'
// Guard: don’t mount widget or notifications inside Talk meeting iframes
const isInIframe = (window.self !== window.top)
const isTalkContext = () => {
    try {
        const p = (location.pathname || '').toLowerCase()
        return (p.includes('/apps/spreed') || p.includes('/call/'))
    } catch { return false }
}

const mountWidget = () => {
    if (isInIframe && isTalkContext()) return
	// Ensure toggle exists
	let toggle = document.getElementById('talk-widget-toggle')
	if (!toggle) {
		toggle = document.createElement('button')
		toggle.id = 'talk-widget-toggle'
		toggle.setAttribute('aria-label', 'Open chat')
		Object.assign(toggle.style, {
			position: 'fixed', right: '22px', bottom: '22px', width: '48px', height: '48px',
			borderRadius: '50%', border: '1px solid var(--color-border)',
			background: 'var(--color-primary)', color: 'var(--color-primary-text)',
			boxShadow: '0 8px 24px rgba(0,0,0,.2)', cursor: 'pointer', zIndex: 10000,
			display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
		})
		toggle.textContent = '💬'
		document.body.appendChild(toggle)
	}

	// Ensure mount exists
	let mount = document.getElementById('talk-widget-mount')
	if (!mount) {
		mount = document.createElement('div')
		mount.id = 'talk-widget-mount'
        Object.assign(mount.style, {
            position: 'fixed', right: '24px', bottom: '82px', zIndex: 9999,
            transform: 'translateY(120%)', opacity: '0', transition: 'transform .25s ease, opacity .25s ease, width .25s ease, height .25s ease'
        })
		document.body.appendChild(mount)
		createApp(TalkWidget).mount('#talk-widget-mount')
	}

    // Wire toggle behavior to mount
    const openPanel = () => { 
        mount.style.transform = 'translateY(0)'; 
        mount.style.opacity = '1'; 
        try { 
            window.SmartTalkOpen = true
            ;(window.SmartTalkBus || new EventTarget()).dispatchEvent(new CustomEvent('smartTalk:widgetOpen'))
        } catch {}
    }
    const closePanel = () => { 
        mount.style.transform = 'translateY(120%)'; 
        mount.style.opacity = '0'; 
        try { 
            window.SmartTalkOpen = false 
            ;(window.SmartTalkBus || new EventTarget()).dispatchEvent(new CustomEvent('smartTalk:widgetClose'))
        } catch {}
    }
	let opened = false
	toggle.onclick = () => { opened = !opened; opened ? openPanel() : closePanel() }
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mountWidget)
} else {
	mountWidget()
}

document.addEventListener('DOMContentLoaded', function() {
	console.log('My Nextcloud App loaded!')
    if (!(isInIframe && isTalkContext())) {
        // Mount global Notification Center once
        if (!document.getElementById('smart-talk-notifications')) {
            const el = document.createElement('div')
            el.id = 'smart-talk-notifications'
            Object.assign(el.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: 100000 })
            document.body.appendChild(el)
            const app = createApp2(NotificationCenter)
            app.mount('#smart-talk-notifications')
            if (!window.SmartTalkBus) window.SmartTalkBus = new EventTarget()
            // Ensure the layer is clickable for toasts without blocking rest of UI
            const stack = document.querySelector('#smart-talk-notifications .nc-toast-stack')
            if (stack) stack.style.pointerEvents = 'auto'
        }
        // Start global notification service hooked to real Talk data
        if (!window.__smartTalkServiceStarted) { startTalkNotifications(); window.__smartTalkServiceStarted = true }
    }
})




