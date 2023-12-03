import { DefaultTheme } from "vitepress";
export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '计算机基础',
    collapsed: true,
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
  },
  {
    text: '前端数据治理与异常监控',
    items: [
      { text: '前端数据治理与异常监控', link: '/font-end/data-govern-exception-monitor' },
    ]
  },
  {
    text: '前端工程化',
    link: '/font-end/engineering/index',
    collapsed: true,
    items: [
      { text: 'Git', link: '/font-end/engineering/git' },
      { text: 'babel', link: '/font-end/engineering/babel' },
      { text: 'eslint', link: '/font-end/engineering/eslint' },
      { text: 'esbuild', link: '/font-end/engineering/esbuild' },
      { text: 'pnpm', link: '/font-end/engineering/pnpm' },

    ]
  }
];