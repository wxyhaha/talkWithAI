module.exports = {
  root: true,
  env: {
    browser: true,      // 浏览器环境
    node: true,         // Node.js 环境
    es2021: true,       // ES2021 全局变量
  },
  extends: [
    "eslint:recommended",         // ESLint 官方推荐规则
    "plugin:vue/vue3-recommended" // Vue3 推荐规则
  ],
  parserOptions: {
    ecmaVersion: 12,     // 支持最新 ECMAScript 特性
    sourceType: "module" // 支持 ESM 模块
  },
  plugins: [
    "vue"
  ],
  rules: {
    /* ---- 严格性相关 ---- */
    "no-undef": "error",              // 未定义的变量报错
    "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }], // 未使用变量警告
    "eqeqeq": ["error", "always"],    // 必须用 === / !==
  }
};
