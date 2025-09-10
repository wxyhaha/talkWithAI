const API_URL = 'https://api.deepseek.com/v1/chat/completions'

export const queryDeepSeekResponse = async (messages,modelName) => {
    const messageArr = messages.map(item=>{return {role:item.role,content:item.content}})
    const API_KEY = localStorage.getItem('apiKey')
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: modelName,
            messages: messageArr,
            stream: true,
        })
    });

    if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
    }

    return response;
}
