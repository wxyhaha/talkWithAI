<template>
  <div class="chatContainerWrapper">
    <div class="dialogBoxWrapper">
      <DialogBox
          :currentChatMessages="currentChatMessages"
          ref="DialogBoxRef"
          :textLoading="textLoading"
          :isStreamLoad="loading"
      />
    </div>
    <div class="inputWrapper">
      <ChatInput :loading="loading" @sendMsg="handleSend" ref="ChatInputRef"/>
    </div>
  </div>
</template>

<script setup>
import ChatInput from './ChatInput.vue'
import DialogBox from './DialogBox.vue'
import {computed, onUnmounted, ref, watch} from "vue";
import {queryDeepSeekResponse} from "../api";
import { useChatListStore } from '../store'
import {generateUUID} from "../utils/index.js";
import {loadConversation} from "../api/githubRequest";
const chatListStore = useChatListStore()

const DialogBoxRef=ref()
const loading=ref(false)
const textLoading=ref(false)
const ChatInputRef=ref()
const modelName=computed(()=>ChatInputRef.value?.isDeepThink ? 'deepseek-reasoner' : 'deepseek-chat')
const currentChatMessages = ref([])

const getChatDataFromRemote=async (index)=>{
  if(index!==undefined){
    const result=await loadConversation(chatListStore.chatList[index].id)
    if(result){
      chatListStore.chatList[index].messages=result
      saveLocal()
    }
    return result || []
  }
}

watch(() => chatListStore.curChatIndex, async (newIndex) => {
  if (chatListStore?.chatList?.[newIndex]?.messages) {
    currentChatMessages.value = chatListStore.chatList[newIndex].messages
  } else {
    currentChatMessages.value = await getChatDataFromRemote(newIndex)
  }
}, { immediate: true })


watch(currentChatMessages, (newVal) => {
  DialogBoxRef.value.backBottom()
}, { deep: true })

const handleSend=async (value)=>{
  loading.value=true
  if(chatListStore.chatList.length===0){
    handleAddNewChat()
  }
  const chat = chatListStore.chatList[chatListStore.curChatIndex]
  chat['isChange']=true
  chat.messages.push({
    role: 'user',
    content: value,
    timestamp: Date.now()
  })

  try {
    textLoading.value=true
    const response = await queryDeepSeekResponse(chat.messages,modelName.value)
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let aiMessage = '';
    let reasonContent=''

    let aiMessageIndex = chat.messages.length
    const aiMessageObj = {
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };
    chat.messages.push(aiMessageObj);

    while (true) {
      const { done, value } = await reader.read();
      textLoading.value=false
      if (done) {
        loading.value = false
        chatListStore.chatList[chatListStore.curChatIndex]['updatedAt']=Date.now()
        saveLocal()
        break
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0].delta.content;
          const reason=data.choices[0].delta?.reasoning_content;
          if (content) {
            aiMessage += content;
            chat.messages[aiMessageIndex].content = aiMessage;
          }
          if (reason) {
            reasonContent += reason;
            chat.messages[aiMessageIndex]['reasoning'] = reasonContent;
          }
        }
      }
    }
  } catch (error) {
    console.error('API Error:', error)
  } finally {
    textLoading.value=false
  }
}

const handleAddNewChat=()=>{
  chatListStore.chatList.push({
    id: generateUUID(),
    title: `新对话 ${chatListStore.chatList.length + 1}`,
    messages: [],
    createdAt: Date.now()
  })
  chatListStore.curChatIndex = chatListStore.chatList.length - 1
}

const saveLocal=()=>{
  localStorage.setItem('ai-chat-sessions', JSON.stringify(chatListStore.chatList))
}
defineExpose({handleAddNewChat})
</script>

<style lang="scss" scoped>
.inputWrapper{
  width: 60%;
  height: 195px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialogBoxWrapper{
  width: calc(100% - 40px);
  height: calc(100% - 195px - 40px);
  padding: 20px;
}
.chatContainerWrapper{
  height: 100%;
  width: 85%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
