import CryptoJS from "crypto-js";
import {githubInfo} from "../../config";

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
