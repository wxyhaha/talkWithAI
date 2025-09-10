import {githubInfo} from "../../config";
import {decodeBase64ToUnicode, decrypt, encrypt, uint8ArrayToBase64} from "../utils";

const OWNER = githubInfo.OWNER;
const REPO = githubInfo.REPO;
const BRANCH = githubInfo.BRANCH;
const TOKEN = githubInfo.TOKEN;
const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export async function getFile(path) {
    const res = await fetch(`${BASE_URL}/${path}?ref=${BRANCH}`, {
        headers: { Authorization: `token ${TOKEN}` }
    });
    const data = await res.json();
    if (data.content) {
        const content = decodeBase64ToUnicode(data.content); // base64解码
        return content;
    }
    return null;
}

export async function updateFile(path, content, sha) {
    const body = {
        message: `Update ${path}`,
        content: uint8ArrayToBase64(new TextEncoder().encode(content)),
        sha,
        branch: BRANCH
    };
    const res = await fetch(`${BASE_URL}/${path}`, {
        method: "PUT",
        headers: {
            Authorization: `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return res.json();
}

export async function saveConversation(conversation) {
    const filePath = `conversations/${conversation.id}.json`;

    // 先尝试获取当前文件的 sha（如果已存在，用于更新）
    const existing = await getFile(filePath);
    let sha = null;
    if (existing) {
        const res = await fetch(`${BASE_URL}/${filePath}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${TOKEN}` }
        });
        const data = await res.json();
        sha = data.sha;
    }

    // 加密内容
    const encryptedContent = encrypt(conversation.messages);

    // 上传到 GitHub
    await updateFile(filePath, encryptedContent, sha);

    // 更新 index.json
    const indexContent = await getFile("index.json");
    let index = indexContent ? JSON.parse(indexContent) : [];
    const idx = index.findIndex(c => c.id === conversation.id);

    const conversationData = {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt || new Date()
    }
    if (idx >= 0) {
        index[idx] = conversationData
    } else {
        index.push(conversationData)
    }

    // 上传 index.json
    let indexSha = null;
    if (indexContent) {
        const res = await fetch(`${BASE_URL}/index.json?ref=${BRANCH}`, {
            headers: { Authorization: `token ${TOKEN}` }
        });
        const data = await res.json();
        indexSha = data.sha;
    }
    await updateFile("index.json", JSON.stringify(index, null, 2), indexSha);
}

export async function loadConversation(id) {
    const encrypted = await getFile(`conversations/${id}.json`);
    if (!encrypted) return null;
    const messages = decrypt(encrypted);
    return messages;
}

