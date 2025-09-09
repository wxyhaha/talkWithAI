import { defineStore } from 'pinia'
import {saveConversation} from "../api/githubRequest";
export const useChatListStore = defineStore('chatList', {
    state: () => ({
        chatList: JSON.parse(localStorage.getItem('ai-chat-sessions') || [])
    }),
    actions: {
        setChatList(chatList) {
            this.chatList = chatList
            localStorage.setItem('ai-chat-sessions', JSON.stringify(chatList))
            saveConversation(chatList[0])
        },
    },
})
