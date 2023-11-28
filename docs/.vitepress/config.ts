import { defineConfig } from 'vitepress'
import { sidebar } from './sideBar';

export default defineConfig({
  base: '/silver-bullet/',
  title: "Silver Bullet",
  description: "前端修炼手册：也许，求知的道路上，未必就没有银色子弹",
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    outline: [2, 3],
    nav: [
      { text: '计算机基础', link: '/basics/data-structures-algorithms' }
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/R2h1/silver-bullet' }
    ],
    editLink: {
      pattern: "https://github.com/R2h1/silver-bullet",
      text: "Edit this page on Github",
    },
    lastUpdatedText: "Last Updated",
    footer: {
      copyright: "Copyright © 2023-present R2h1",
    },
  }
})
