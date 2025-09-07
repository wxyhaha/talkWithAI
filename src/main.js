import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import TDesignChat from '@tdesign-vue-next/chat'; // 引入chat组件
import 'tdesign-vue-next/es/style/index.css'; // 引入少量全局样式变量
import './theme.css'

const app = createApp(App)
document.documentElement.setAttribute("theme-mode", "dark")

app.use(ElementPlus)
app.use(TDesignChat);
app.mount('#app')
