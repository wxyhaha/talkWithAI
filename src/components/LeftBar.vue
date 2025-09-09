<template>
  <div class="barWrapper">
    <div class="titleWrapper">
      <span>Talk with AI</span>
      <el-icon @click="dialogVisible=true">
        <Setting/>
      </el-icon>
    </div>
    <div class="conversationListWrapper">
      <div class="addButton">
        <el-button color="#43454a" round :icon="CirclePlus" @click="emit('addNewChat')">开启新对话</el-button>
      </div>
      <div :class="{conversationItem:true,activeItem:index===selectItemIndex}" v-for="(item,index) in chatListStore.chatList" :key="item.id" @click="handleSelectItem(index)">
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="请输入API key" width="500">
    <el-input v-model="apiKey" style="width: 300px"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveApiKey">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {Setting,CirclePlus} from '@element-plus/icons-vue'
import {ref} from "vue";
import { useChatListStore } from '../store'
const chatListStore = useChatListStore()

const dialogVisible = ref(false)
const apiKey = ref()

const selectItemIndex=ref(null)

const emit = defineEmits(['changeCurChat','addNewChat'])

const handleSelectItem=(index)=>{
  selectItemIndex.value= index
  emit('changeCurChat',index)
}

const handleSaveApiKey = () => {
  localStorage.setItem('apiKey', apiKey.value)
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.addButton{
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.titleWrapper {
  width: calc(100% - 20px);
  height: 44px;
  color: white;
  font-weight: bolder;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.conversationListWrapper {
  width: calc(100% - 20px);
  height: calc(100% - 64px - 20px - 60px);
  margin: 10px;
}

.conversationItem{
  width: calc(100% - 20px);
  padding: 10px;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover{
    background-color: #2c2c2e;
    border-radius: 12px;
  }
}

.activeItem{
  background-color: #353638;
  border-radius: 12px;
}

.barWrapper {
  width: 15%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #212327;
}
</style>
