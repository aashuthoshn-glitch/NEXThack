<template>
  <div id="dashboard-talk-widget">
    <TalkWidget :selected-room-id="talkRoomToken" />
    
    <!-- iOS-Style Floating Widget -->
    <IOSFloatingWidget />
  </div>
</template>

<script>
import TalkWidget from '../components/TalkWidget.vue'
import IOSFloatingWidget from '../components/IOSFloatingWidget.vue'

export default {
  name: 'Dashboard',
  components: {
    TalkWidget,
    IOSFloatingWidget
  },
  data() {
    return {
      talkRoomToken: 'your-room-token-here'
    }
  }
}
</script>
