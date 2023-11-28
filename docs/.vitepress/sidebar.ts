import { DefaultTheme } from "vitepress";
export const sidebar: DefaultTheme.Sidebar = [
  {
    text: '计算机基础',
    collapsed: true,
    items: [
      { text: '数据结构与算法', link: '/basics/data-structures-algorithms' },
      { text: '网络', link: '/basics/internet' },
      { text: '操作系统', link: '/basics/os' },
      { text: '组成原理', link: '/basics/make-up-principle' },
    ]
  }
];