/*
 * @Descripttion:
 * @Author: gaocz
 * @Date: 2021-09-06 18:01:30
 * @LastEditors: gaocz
 * @LastEditTime: 2022-04-27 11:06:12
 * @FilePath: /edmp-web/.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    // 启用环境
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/typescript/recommended", "@vue/prettier", "@vue/prettier/@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "prettier/prettier": "off",  // 关闭prettier校验
    "@typescript-eslint/no-explicit-any": "off", // 关闭不能使用any
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off", // 关闭函数返回类型
  },
};
