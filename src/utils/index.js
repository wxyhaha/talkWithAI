import CryptoJS from "crypto-js";
import {githubInfo} from "../../config";
import {getFile, loadConversation} from "../api/githubRequest.js";
import {useChatListStore} from "../store/index.js";

const SECRET_KEY = githubInfo.SECRET_KEY;

export function encrypt(content) {
    return CryptoJS.AES.encrypt(JSON.stringify(content), SECRET_KEY).toString();
}

export function decrypt(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function mergeRemoteAndLocalData() {
    const remoteData = await getFile("index.json");
    const remoteDataArr = remoteData ? JSON.parse(remoteData) : [];
    const localData=localStorage.getItem("ai-chat-sessions") ? JSON.parse(localStorage.getItem("ai-chat-sessions")) : [];
    console.log("mergeArraysById(remoteDataArr,localData)",mergeArraysById(remoteDataArr,localData))
    return mergeArraysById(remoteDataArr,localData)
}

export function decodeBase64ToUnicode(base64String) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}

export function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
}

function mergeArraysById(arr1, arr2) {
    const mergedMap = new Map();

    // 合并两个数组并遍历
    [...arr1, ...arr2].forEach(item => {
        const existing = mergedMap.get(item.id);
        // 如果当前项不存在，或者当前项的 updatedAt 更新，则存入 Map
        if (!existing || item.updatedAt > existing.updatedAt) {
            mergedMap.set(item.id, item);
        }
    });

    // 返回合并后的数组
    return Array.from(mergedMap.values());
}
