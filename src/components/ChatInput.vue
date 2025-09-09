<template>
  <t-chat-sender v-model="query" :textarea-props="{placeholder: '请输入消息...'}"
                 :loading="loading"
                 @send="inputEnter"
                 @stop="onStop"
  >
    <!-- 自定义操作区域的内容，默认支持图片上传、附件上传和发送按钮 -->
    <template #suffix="{ renderPresets }">
      <!-- 在这里可以进行自由的组合使用，或者新增预设 -->
      <!-- 不需要附件操作的使用方式 -->
      <component :is="renderPresets([])" />
      <!-- 只需要附件上传的使用方式-->
      <!-- <component :is="renderPresets([{ name: 'uploadAttachment' }])" /> -->
      <!-- 只需要图片上传的使用方式-->
      <!-- <component :is="renderPresets([{ name: 'uploadImage' }])" /> -->
      <!-- 任意配置顺序-->
      <!-- <component :is="renderPresets([{ name: 'uploadAttachment' }, { name: 'uploadImage' }])" /> -->
    </template>
    <template #prefix>
      <t-button class="check-box" :class="{ 'is-active': isDeepThink }" variant="text" @click="isDeepThink=!isDeepThink">
        <SystemSumIcon />
        <span>深度思考</span>
      </t-button>
    </template>
  </t-chat-sender>
</template>

<script setup>
import {ref} from "vue";
import { SystemSumIcon } from 'tdesign-icons-vue-next';

const props=defineProps({
  loading:Boolean
})

const emit=defineEmits(['sendMsg'])

const query = ref('');
const isDeepThink=ref(false)

const inputEnter = function () {
  if (props.loading) {
    return;
  }
  if (!query.value) return;
  emit('sendMsg',query.value)
};

const onStop = function () {

};

defineExpose({isDeepThink})
</script>

<style lang="scss" scoped>
.check-box {
  width: 112px;
  height: 32px;
  border-radius: 32px;
  border: 0;
  background: #393939;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0 5px;

  >span{
    margin-left: 5px;
  }
}
.is-active {
  border: 1px solid #173463;
  background: #1b2f51;
  color: #4582e6;
}
</style>
