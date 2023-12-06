import { DefaultTheme } from "vitepress";
export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '计算机基础',
    collapsed: false,
    items: [
      { 
        text: '数据结构与算法',
        collapsed: true,
        link: '/basics/data-structures-algorithms/index',
        items: [
          { text: '数组和字符串', link: '/basics/data-structures-algorithms/array-string' },
          { text: '链表', link: '/basics/data-structures-algorithms/linkList' },
          { text: '栈和队列', link: '/basics/data-structures-algorithms/stack-queue' }, 
          { text: '树和图', link: '/basics/data-structures-algorithms/tree-graph' },
          { text: '堆和散列表', link: '/basics/data-structures-algorithms/heap-hash' },
        ]
      },
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