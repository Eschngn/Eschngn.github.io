import { defineUserConfig } from "vuepress";
import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'
import { cut } from 'nodejs-jieba'


import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Shawn's Blog",
  description: "vuepress-theme-hope 的博客演示",

  theme,
  plugins: [
    slimsearchPlugin({
      // 索引全部内容
      indexContent: true,
      indexOptions: {
        // 使用 nodejs-jieba 进行分词
        tokenize: (text, fieldName) =>
          fieldName === 'id' ? [text] : cut(text, true),
      },
    }),
  ],


  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
