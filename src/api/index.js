const API_URL = 'https://api.deepseek.com/v1/chat/completions'

export const queryDeepSeekResponse = async (messages) => {
    const API_KEY = localStorage.getItem('apiKey')
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: messages,
            stream: true,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
    }

    return response;
}
