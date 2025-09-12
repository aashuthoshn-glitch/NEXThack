<template>
	<div class="chat-widget">
		<div class="header">
			<div class="title">
				<div class="header-icon">💬</div>
				<div class="header-text">
					<h2>At a Glance</h2>
					<p>{{ selectedRoomName || 'Quick access' }}</p>
				</div>
			</div>
			<div class="weather" :title="weatherTitle">
				<span v-if="weatherLoading">⛅ …</span>
				<span v-else>{{ weatherTemp }}° • {{ weatherIcon }}</span>
			</div>
		</div>

		<div class="shortcuts">
			<button class="shortcut" @click="goActivities" title="Open Activities">🗂️ Activities</button>
			<button class="shortcut" @click="goTalk" title="Open Talk">💬 Talk</button>
			<select v-if="activeView==='talk'" class="room-select" v-model="selectedRoomToken" @change="onSelectRoom" :title="'Select conversation'">
				<option disabled value="">Select a conversation…</option>
				<option v-for="r in rooms" :key="r.token" :value="r.token">{{ r.displayName }}</option>
			</select>
		</div>

		<!-- Talk view -->
		<div v-if="activeView==='talk'" class="messages-area" ref="messagesContainer">
			<div v-for="message in messages" :key="message.id" class="message-bubble" :class="{ self: isSelf(message) }">
				<div class="meta">
					<span class="user-name">{{ message.actorDisplayName }}</span>
					<span class="time">{{ formatTime(message.timestamp) }}</span>
				</div>
				<div class="message-text">{{ message.message }}</div>
			</div>
		</div>
		<div v-if="activeView==='talk'" class="message-input-area">
			<input v-model="newMessage" @keyup.enter="sendMessage" type="text" class="message-input" placeholder="Type your message here..." />
			<button class="send-button" @click="sendMessage">Send</button>
		</div>

		<!-- Activities view (compact list from OCS) -->
		<div v-if="activeView==='activities'" class="messages-area">
			<div class="message-bubble" v-for="a in activities" :key="a.id">{{ a.subject }}</div>
		</div>
	</div>
</template>
<script setup>
import { ref, nextTick, onMounted } from 'vue'
const messages = ref([])
const newMessage = ref('')
const selectedRoomName = ref('General')
const messagesContainer = ref(null)
const selectedRoomToken = ref(localStorage.getItem('talk_room_token') || '')
const rooms = ref([])
// Weather state
const weatherTemp = ref('--')
const weatherIcon = ref('⛅')
const weatherLoading = ref(true)
const weatherTitle = ref('Weather')
const DEFAULT_CITY = (localStorage.getItem('weather_city') || 'London')
const fetchWeather = async () => {
	try {
		weatherLoading.value = true
		// Prefer absolute Nextcloud URL helper when available
		// eslint-disable-next-line no-unused-vars
		// @ts-ignore
		const ncUrl = (window?.OC?.generateUrl ? window.OC.generateUrl('/apps/my-nextcloud-app/weather') : '/index.php/apps/my-nextcloud-app/weather')
		const url = `${ncUrl}?city=${encodeURIComponent(DEFAULT_CITY)}`
		const res = await fetch(url, { headers: { 'OCS-APIRequest': 'true' } })
		if (!res.ok) throw new Error('weather http ' + res.status)
		const data = await res.json()
		weatherTemp.value = Math.round(data?.main?.temp ?? 0)
		const main = (data?.weather?.[0]?.main || '').toLowerCase()
		weatherIcon.value = main.includes('rain') ? '🌧️' : main.includes('cloud') ? '☁️' : main.includes('snow') ? '❄️' : main.includes('storm') ? '⛈️' : '☀️'
		weatherTitle.value = `${data?.name ?? DEFAULT_CITY}: ${data?.weather?.[0]?.description ?? ''}`
	} catch (e) {
		weatherIcon.value = '⛅'
		weatherTitle.value = 'Weather unavailable'
	} finally {
		weatherLoading.value = false
	}
}
// sendMessage is defined later to go through Talk API
// Do not redirect; keep the user on the current page and open the in-widget views
const activeView = ref('talk') // 'talk' | 'activities'
const goActivities = () => { activeView.value = 'activities' }
const goTalk = () => { activeView.value = 'talk' }
onMounted(() => { fetchWeather(); setInterval(fetchWeather, 600000) })

// ===== Nextcloud OCS helpers =====
const getRequestToken = () => {
  // Works on Nextcloud pages
  if (window?.OC?.requestToken) return window.OC.requestToken
  const el = document.querySelector('head meta[name="requesttoken"]')
  return el?.getAttribute('content') || ''
}

const ocsHeaders = () => ({
  'OCS-APIRequest': 'true',
  'Accept': 'application/json',
  'requesttoken': getRequestToken(),
})

// ===== Talk integration (basic) =====
const talkRoomToken = ref(localStorage.getItem('talk_room_token') || '')
const talkMessages = ref([])
let lastMessageId = 0

const ensureRoom = async () => {
  // do not auto-create; rely on existing conversations
  return talkRoomToken.value
}

const fetchRooms = async () => {
  try {
    const res = await fetch('/ocs/v2.php/apps/spreed/api/v4/room', { headers: { ...ocsHeaders() } })
    const json = await res.json().catch(() => ({}))
    const list = json?.ocs?.data || []
    rooms.value = list.map(r => ({ token: r.token || r.roomToken || r.id, displayName: r.displayName || r.name || r.token }))
    if (!talkRoomToken.value && rooms.value.length) {
      talkRoomToken.value = rooms.value[0].token
      selectedRoomToken.value = talkRoomToken.value
      selectedRoomName.value = rooms.value[0].displayName
      localStorage.setItem('talk_room_token', talkRoomToken.value)
    }
  } catch {}
}

const onSelectRoom = () => {
  const found = rooms.value.find(r => r.token === selectedRoomToken.value)
  if (found) {
    talkRoomToken.value = found.token
    selectedRoomName.value = found.displayName
    localStorage.setItem('talk_room_token', talkRoomToken.value)
    fetchTalk()
  }
}

const fetchTalk = async () => {
  if (!talkRoomToken.value) return
  const res = await fetch(`/ocs/v2.php/apps/spreed/api/v4/room/${encodeURIComponent(talkRoomToken.value)}/message`, {
    method: 'GET',
    headers: { ...ocsHeaders() },
  })
  const json = await res.json().catch(() => ({}))
  const items = json?.ocs?.data?.messages || []
  // Map minimal fields to widget messages
  const mapped = items.map(m => ({
    id: m.id || m.timestamp || Math.random(),
    actorDisplayName: m.actorDisplayName || m.actor?.displayName || 'User',
    actorId: m.actorId || m.actor?.id || m.actor?.uid || '',
    timestamp: m.timestamp || Math.floor(Date.now()/1000),
    message: m.message || m.body || '',
  }))
  // floating notification on new
  if (mapped.length && mapped[mapped.length - 1].id !== lastMessageId) {
    if (lastMessageId && document.visibilityState === 'hidden' || activeView.value !== 'talk') {
      showToast(`New message: ${mapped[mapped.length - 1].message.slice(0, 60)}`)
    }
    lastMessageId = mapped[mapped.length - 1].id
  }
  messages.value = mapped
}
const isSelf = (m) => {
  try { return (window.OC?.currentUser || window.OC?.getCurrentUser?.()) === m.actorId } catch { return false }
}
const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const sendTalk = async (text) => {
  if (!text) return
  if (!talkRoomToken.value) return
  const body = new URLSearchParams({ message: text })
  await fetch(`/ocs/v2.php/apps/spreed/api/v4/room/${encodeURIComponent(talkRoomToken.value)}/message`, {
    method: 'POST',
    headers: { ...ocsHeaders() },
    body,
  })
  await fetchTalk()
}

// Override sendMessage to go through Talk
const sendMessage = async () => {
  const trimmed = newMessage.value.trim()
  if (!trimmed) return
  newMessage.value = ''
  await sendTalk(trimmed)
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ===== Activities integration (compact list) =====
const activities = ref([])
const fetchActivities = async () => {
  const url = '/ocs/v2.php/apps/activity/api/v2/activity'
  const res = await fetch(url, { headers: { ...ocsHeaders() } })
  const json = await res.json().catch(() => ({}))
  const list = json?.ocs?.data || []
  activities.value = list.slice(0, 5).map(a => ({ id: a.activity_id || a.id, subject: a.subject_rich?.[0] || a.subject || 'Activity' }))
}

// Floating notification
const showToast = (text) => {
  let el = document.getElementById('nc-inline-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'nc-inline-toast'
    Object.assign(el.style, { position: 'fixed', right: '20px', bottom: '20px', background: '#111', color: '#fff', padding: '10px 14px', borderRadius: '10px', zIndex: '10000', boxShadow: '0 8px 24px rgba(0,0,0,.2)' })
    document.body.appendChild(el)
  }
  el.textContent = text
  el.style.opacity = '0.95'
  setTimeout(() => { el.style.opacity = '0' }, 4000)
}

// Polling
onMounted(() => {
  fetchRooms(); fetchTalk(); fetchActivities()
  setInterval(fetchTalk, 5000)
  setInterval(fetchActivities, 60000)
})
</script>
<style scoped>
.chat-widget { width: 360px; border-radius: 16px; padding: 14px; background: var(--color-main-background); color: var(--color-main-text); border: 1px solid var(--color-border); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
.chat-widget h2 { color: var(--color-main-text); margin: 0; }
.chat-widget p { color: var(--color-text-maxcontrast); margin: 0; }
.header { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }
.title { display:flex; align-items:center; gap:10px }
.messages-area { max-height: 320px; overflow-y: auto; padding-right:6px }
.message-bubble { background: var(--color-background-darker); border-radius: 12px; padding:10px; margin:8px 0; box-shadow: 0 2px 8px rgba(0,0,0,.08); color: var(--color-main-text); border: 1px solid var(--color-border); max-width: 280px }
.message-bubble.self { margin-left: auto; background: var(--color-primary); color: var(--color-primary-text); border-color: var(--color-primary) }
.meta { display:flex; justify-content: space-between; font-size: 11px; opacity:.8; margin-bottom:4px }
.weather { font-weight:600 }
.shortcuts { display:flex; gap:8px; margin-bottom:8px }
.shortcut { padding:6px 10px; border-radius:10px; border:1px solid var(--color-border); background: var(--color-background-darker); color: var(--color-main-text); cursor:pointer; transition: transform .2s ease, background .2s ease }
.shortcut:hover { transform: translateY(-1px); background: var(--color-background-hover) }
.message-input-area { display:flex; gap:8px; margin-top:10px }
.message-input { flex:1; padding:10px; border-radius: 10px; border:1px solid var(--color-border); background: var(--color-background-darker); color: var(--color-main-text) }
.send-button { padding:8px 12px; border-radius:10px; border:none; background: var(--color-primary); color: var(--color-primary-text); cursor:pointer }
.room-select { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--color-border); background: var(--color-background-darker); color: var(--color-main-text); cursor: pointer; font-size: 14px; }
</style>
