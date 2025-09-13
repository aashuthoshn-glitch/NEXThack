import Vue from 'vue'
import Dashboard from './views/Dashboard.vue'

// Create Vue app instance
const app = new Vue({
  render: h => h(Dashboard)
})

// Mount the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dashboard-talk-widget')
  if (container) {
    app.$mount(container)
  }
})

export default app
