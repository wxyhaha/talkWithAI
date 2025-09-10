import { defineStore } from 'pinia'
import {saveConversation} from "../api/githubRequest";
import {mergeRemoteAndLocalData} from "../utils/index.js";
export const useChatListStore = defineStore('chatList', {
    state: async () => ({
        chatList: [],
        curChatIndex:null
    }),
    actions: {
        setChatList(chatList) {
            this.chatList = chatList
            localStorage.setItem('ai-chat-sessions', JSON.stringify(chatList))
            //saveConversation(chatList[0])
        },
        setCurChatIndex(index) {
            this.curChatIndex = index
        },
        async initChatList(){
            this.chatList = await mergeRemoteAndLocalData()
        }
    },
})
