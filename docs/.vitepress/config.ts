import { defineConfig } from 'vitepress'
import { sidebar } from './sideBar';

export default defineConfig({
  base: '/silver-bullet/',
  title: "Silver Bullet",
  description: "前端修炼手册：也许，求知的道路上，未必就没有银色子弹",
  lastUpdated: true,
  cleanUrls: true,
  markdown: {
    math: true,
    lineNumbers: true,
    theme: {
      light: "dark-plus",
      dark: "dark-plus",
    },
  },
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: { //这里是个大坑，zh是不生效的，改为root即可
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    outline: [2, 4],
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
