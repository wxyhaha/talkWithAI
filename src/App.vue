<template>
  <div class="pageWrapper">
    <LeftBar/>
    <ChatContainer/>
  </div>
</template>

<script setup>
import LeftBar from './components/LeftBar.vue'
import ChatContainer from './components/ChatContainer.vue'
</script>

<style scoped lang="scss">
.pageWrapper{
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
