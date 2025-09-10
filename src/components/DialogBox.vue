<template>
  <t-chat
      ref="chatRef"
      :clear-history="false"
      :data="currentChatMessages"
      :reverse="false"
      variant="variant"
      :textLoading="textLoading"
  >
    <template #name="{item}">
      <div style="color: white">
        <span v-if="item.role==='user'">我</span>
        <span v-else-if="item.role==='assistant'">deepSeek</span>
      </div>
    </template>
    <template #avatar="{item}">
      <img v-if="item.role==='user'" src="../assets/user.png" alt="">
      <img  v-else-if="item.role==='assistant'" src="../assets/assistant.png" alt="">
    </template>
    <template #content="{ item, index }">
      <t-chat-reasoning v-if="item.reasoning" expand-icon-placement="right">
        <template #header>
          <t-chat-loading v-if="isStreamLoad && !item.content" text="思考中..." />
          <div v-else style="display: flex; align-items: center">
            <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px" />
            <span>已深度思考</span>
          </div>
        </template>
        <t-chat-content v-if="item.reasoning" :content="item.reasoning" />
      </t-chat-reasoning>
      <t-chat-content v-if="item.content" :content="item.content" />
    </template>
  </t-chat>
</template>

<script setup>
import {ref} from "vue";
import {CheckCircleIcon} from 'tdesign-icons-vue-next'

const props=defineProps({
  currentChatMessages:Array,
  textLoading:Boolean,
  isStreamLoad: Boolean
})

const chatRef=ref()

const backBottom = () => {
  chatRef.value.scrollToBottom({
    behavior: 'smooth',
  });
};

defineExpose({backBottom})
</script>

<style lang="scss" scoped>

</style>
