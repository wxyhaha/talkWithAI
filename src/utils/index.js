import CryptoJS from "crypto-js";
import {githubInfo} from "../../.vscode/config";

const SECRET_KEY = githubInfo.SECRET_KEY;

export function encrypt(content) {
    return CryptoJS.AES.encrypt(JSON.stringify(content), SECRET_KEY).toString();
}

export function decrypt(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
