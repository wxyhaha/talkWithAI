<template>
  <div class="barWrapper">
    <div class="titleWrapper">
      <span>Talk with AI</span>
      <el-icon @click="dialogVisible=true"><Setting /></el-icon>
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
import {Setting} from '@element-plus/icons-vue'
import {ref} from "vue";

const dialogVisible=ref(false)
const apiKey=ref()

const handleSaveApiKey=()=>{
  localStorage.setItem('apiKey',apiKey.value)
  dialogVisible.value=false
}
</script>

<style lang="scss" scoped>
.titleWrapper{
  width: calc(100% - 20px);
  color: white;
  font-weight: bolder;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.barWrapper {
  width: 15%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #212327;
}
</style>
