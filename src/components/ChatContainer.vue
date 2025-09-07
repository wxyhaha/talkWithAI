<template>
  <div class="chatContainerWrapper">
    <div class="dialogBoxWrapper">
      <DialogBox
          :currentChatMessages="currentChatMessages"
          ref="DialogBoxRef"
          :textLoading="textLoading"
      />
    </div>
    <div class="inputWrapper">
      <ChatInput :loading="loading" @sendMsg="handleSend"/>
    </div>
  </div>
</template>

<script setup>
import ChatInput from './ChatInput.vue'
import DialogBox from './DialogBox.vue'
import {computed, ref, watch} from "vue";
import {queryDeepSeekResponse} from "../api";

const DialogBoxRef=ref()
const chats=ref([])
const curChat = ref(0)
const loading=ref(false)
const textLoading=ref(false)
const currentChatMessages = computed(() => {
  return chats.value[curChat.value]?.messages || []
})

watch(currentChatMessages, (newVal) => {
  DialogBoxRef.value.backBottom()
}, { deep: true })

const handleSend=async (value)=>{
  loading.value=true
  if(chats.value.length===0){
    handleAddNewChat()
  }
  const chat = chats.value[curChat.value]
  chat.messages.push({
    role: 'user',
    content: value,
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    timestamp: Date.now()
  })

  try {
    textLoading.value=true
    const response = await queryDeepSeekResponse(chat.messages)
    textLoading.value=false
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let aiMessage = '';

    let aiMessageIndex = chat.messages.length
    const aiMessageObj = {
      role: 'assistant',
      content: '',
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      displayedContent: '',
      timestamp: Date.now()
    };
    chat.messages.push(aiMessageObj);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0].delta.content;
          if (content) {
            aiMessage += content;
            chat.messages[aiMessageIndex].content = aiMessage;
          }
        }
      }
    }
  } catch (error) {
    console.error('API Error:', error)
  } finally {
    saveChats()
    loading.value = false
  }
}

const handleAddNewChat=()=>{
  chats.value.push({
    id: Date.now(),
    title: `新对话 ${chats.value.length + 1}`,
    messages: [],
    createdAt: Date.now()
  })
  curChat.value = chats.value.length - 1
  saveChats()
}

const saveChats = () => {
  localStorage.setItem('ai-chat-sessions', JSON.stringify(chats.value))
}

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
