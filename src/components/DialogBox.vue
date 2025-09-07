<template>
  <t-chat
      ref="chatRef"
      animation="gradient"
      :clear-history="false"
      :data="currentChatMessages"
      :reverse="false"
      variant="variant"
      :textLoading="textLoading"
  >
  </t-chat>
</template>

<script setup>
import {ref} from "vue";

const props=defineProps({
  currentChatMessages:Array,
  textLoading:Boolean
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
