<template>
  <div class="pageWrapper">
    <LeftBar @addNewChat="ChatContainerRef?.handleAddNewChat"/>
    <ChatContainer ref="ChatContainerRef" />
  </div>
</template>

<script setup>
import LeftBar from './components/LeftBar.vue'
import ChatContainer from './components/ChatContainer.vue'
import {onMounted, ref} from "vue";
import {mergeRemoteAndLocalData} from "./utils/index.js";
import {useChatListStore} from "./store/index.js";

const ChatListStore=useChatListStore()
const ChatContainerRef=ref()

onMounted(()=>{
  ChatListStore.initChatList()
})
</script>

<style scoped lang="scss">
.pageWrapper{
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
