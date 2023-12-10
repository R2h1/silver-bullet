import{_ as e,o as a,c as l,R as t}from"./chunks/framework.buEibnTs.js";const f=JSON.parse('{"title":"Babel","description":"","frontmatter":{},"headers":[],"relativePath":"front-end/engineering/babel.md","filePath":"front-end/engineering/babel.md","lastUpdated":1702208330000}'),i={name:"front-end/engineering/babel.md"},o=t('<h1 id="babel" tabindex="-1">Babel <a class="header-anchor" href="#babel" aria-label="Permalink to &quot;Babel&quot;">​</a></h1><p>Babel 是一个 JavaScript 编译器。Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。Babel的能力：</p><ol><li>语法转换，Babel也能转换JSX语法。</li><li>通过 Polyfill 方式在目标环境中添加缺失的功能（通过引入第三方 polyfill 模块，例如 core-js）。</li><li>源码转换（codemods），Babel 可以删除类型注释。</li><li>Babel是完全插件化的。</li><li>Babel 支持 Source map，因此可以轻松调试编译后的代码。</li><li>Babel 尽最大可能遵循 ECMAScript 标准，也提供了特定的选项来对标准和性能做权衡。</li><li>Babel 尽可能用最少的代码并且不依赖太大量的运行环境。也提供了&quot;assumptions&quot;选项来符合规范、文件大小和编译速度之间做权衡。</li></ol><p>babel 的转译过程也分为三个阶段，这三步具体是：</p><ol><li>解析 Parse: 将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；</li><li>转换 Transform: 对于 AST 进⾏⼀系列变换的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；</li><li>⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 @babel/generator。</li></ol>',5),r=[o];function n(b,s,c,_,d,p){return a(),l("div",null,r)}const m=e(i,[["render",n]]);export{f as __pageData,m as default};
