import { DefaultTheme } from "vitepress";
export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '计算机基础',
    collapsed: false,
    items: [
      { text: '数据结构与算法', link: '/basics/data-structures-algorithms' },
      { text: '网络', link: '/basics/internet' },
      { text: '操作系统', link: '/basics/os' },
      { text: '组成原理', link: '/basics/make-up-principle' },
    ]
  },
  {
    text: '设计模式',
    items: [
      { text: '前端常用设计模式', link: '/font-end/design-patterns' },
    ]
  },
  {
    text: '混合开发',
    items: [
      { text: '跨平台', link: '/font-end/hybrid' },
    ]
  }
];