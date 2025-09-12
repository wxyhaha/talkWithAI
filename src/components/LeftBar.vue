<template>
  <div class="barWrapper">
    <div class="titleWrapper">
      <span>Talk with AI</span>
      <div class="iconWrapper">
        <el-icon style="cursor: pointer" @click="handleSaveRemote">
          <UploadFilled/>
        </el-icon>
        <el-dropdown trigger="click">
          <el-icon style="font-size: 24px;margin-left: 15px">
            <Setting/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="dialogVisible=true">配置API key</el-dropdown-item>
              <el-dropdown-item>配置数据保存</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="conversationListWrapper">
      <div class="addButton">
        <el-button color="#43454a" round :icon="CirclePlus" @click="emit('addNewChat')">开启新对话</el-button>
      </div>
      <div :class="{conversationItem:true,activeItem:index===chatListStore.curChatIndex}"
           v-for="(item,index) in chatListStore.chatList"
           :key="item.id"
           @click="chatListStore.setCurChatIndex(index)"
      >
        <span>{{ item.title }}</span>
        <el-dropdown trigger="click">
          <el-button class="moreIcon" color="#343638" :icon="MoreFilled" circle/>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleRename(index)">重命名</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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

  <el-dialog v-model="renameDialogVisible" title="请输入新的名称" width="500">
    <el-input v-model="renameValue" style="width: 300px"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFinishRename">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {Setting, CirclePlus, UploadFilled, MoreFilled} from '@element-plus/icons-vue'
import {onUnmounted, ref} from "vue";
import {useChatListStore} from '../store'
import {loadConversation, saveConversation} from "../api/githubRequest";

const chatListStore = useChatListStore()

const dialogVisible = ref(false)
const renameDialogVisible = ref(false)
const apiKey = ref()
const renameValue = ref()
const onRenameItemIdx = ref()

const emit = defineEmits(['addNewChat'])

const handleFinishRename = () => {
  if (renameValue.value.trim() === '') {
    return
  }
  chatListStore.$patch(state => {
    state.chatList[onRenameItemIdx.value].title = renameValue.value
    state.chatList[onRenameItemIdx.value].isChange = true
  })
  renameDialogVisible.value = false
}
const handleRename = (idx) => {
  onRenameItemIdx.value = idx
  renameValue.value = chatListStore.chatList[idx].title
  renameDialogVisible.value = true
}
const handleSaveRemote = async () => {
  for (let i = 0; i < chatListStore.chatList.length; i++) {
    if (chatListStore.chatList[i]?.isChange) {
      await saveConversation(chatListStore.chatList[i])
      chatListStore.$patch(state => {
        state.chatList[i].isChange = false
      })
    }
  }
}

const handleSaveApiKey = () => {
  localStorage.setItem('apiKey', apiKey.value)
  dialogVisible.value = false
}

</script>

<style lang="scss" scoped>
.iconWrapper {
  display: flex;
  align-items: center;
  font-size: 24px;
}

.addButton {
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

.conversationItem {
  width: calc(100% - 20px);
  padding: 10px;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;

  .moreIcon {
    visibility: hidden;
  }

  &:hover {
    background-color: #2c2c2e;
    border-radius: 12px;

    .moreIcon {
      visibility: visible;
    }
  }
}

.activeItem {
  background-color: #353638;
  border-radius: 12px;

  > .moreIcon {
    visibility: visible;
  }
}

.barWrapper {
  width: 15%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #212327;
}
</style>
