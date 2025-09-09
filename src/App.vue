<template>
  <div class="pageWrapper">
    <LeftBar @changeCurChat="ChatContainerRef?.handleSelectChat" @addNewChat="ChatContainerRef?.handleAddNewChat"/>
    <ChatContainer ref="ChatContainerRef"/>
  </div>
</template>

<script setup>
import LeftBar from './components/LeftBar.vue'
import ChatContainer from './components/ChatContainer.vue'
import {ref} from "vue";

const ChatContainerRef=ref()
</script>

<style scoped lang="scss">
.pageWrapper{
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
