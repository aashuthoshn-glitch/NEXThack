<template>
  <div id="dashboard-talk-widget">
    <TalkWidget :selected-room-id="talkRoomToken" />
  </div>
</template>

<script>
import TalkWidget from '../components/TalkWidget.vue'

export default {
  name: 'Dashboard',
  components: {
    TalkWidget
  },
  data() {
    return {
      talkRoomToken: 'your-room-token-here'
    }
  }
}
</script>
