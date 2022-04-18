module.exports = {
  root: true,
  env: {
    node: true,
  },
  
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "prettier/prettier": "off",
    '@typescript-eslint/no-explicit-any': 'off', // 关闭不能使用any
    '@typescript-eslint/no-var-requires': 'off',
    "@typescript-eslint/explicit-module-boundary-types": "off", // 关闭函数返回类型
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
};
