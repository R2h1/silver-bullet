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
          { text: '查找和排序', link: '/basics/data-structures-algorithms/search-sort' },
          { text: '动态规划和数学', link: '/basics/data-structures-algorithms/dp-math' },
        ]
      },
      { 
        text: '网络', 
        link: '/basics/internet', 
        items: [
          { text: 'HTTP', link: '/basics/http' }
        ] 
      },
      { text: '操作系统', link: '/basics/os' },
      { text: '组成原理', link: '/basics/make-up-principle' },
    ]
  },
  {
    text: 'typescript',
    link: '/front-end/typescript/index',
    items: []
  },
  {
    text: '设计模式',
    items: [
      { text: '前端常用设计模式', link: '/front-end/design-patterns' },
    ]
  },
  {
    text: '前端框架',
    link: '/front-end/frame/index',
    collapsed: true,
    items: [
      
    ]
  },
  {
    text: '浏览器',
    link: '/front-end/browser',
    items: []
  },
  {
    text: '微前端',
    link: '/front-end/micro-front-end',
    items: []
  },
  {
    text: '混合开发',
    items: [
      { text: '跨平台', link: '/front-end/hybrid' },
    ]
  },
  {
    text: '前端数据治理与异常监控',
    items: [
      { text: '前端数据治理与异常监控', link: '/front-end/data-govern-exception-monitor' },
    ]
  },
  {
    text: '前端工程化',
    link: '/front-end/engineering/index',
    collapsed: true,
    items: [
      { text: 'Git', link: '/front-end/engineering/git' },
      { text: 'babel', link: '/front-end/engineering/babel' },
      { text: 'eslint', link: '/front-end/engineering/eslint' },
      { text: 'esbuild', link: '/front-end/engineering/esbuild' },
      { text: 'pnpm', link: '/front-end/engineering/pnpm' },
    ]
  }
];