# Babel

Babel 是一个 JavaScript 编译器。Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。Babel的能力：
1. 语法转换，Babel也能转换JSX语法。
2. 通过 Polyfill 方式在目标环境中添加缺失的功能（通过引入第三方 polyfill 模块，例如 core-js）。
3. 源码转换（codemods），Babel 可以删除类型注释。
4. Babel是完全插件化的。
5. Babel 支持 Source map，因此可以轻松调试编译后的代码。
6. Babel 尽最大可能遵循 ECMAScript 标准，也提供了特定的选项来对标准和性能做权衡。
7. Babel 尽可能用最少的代码并且不依赖太大量的运行环境。也提供了"assumptions"选项来符合规范、文件大小和编译速度之间做权衡。

babel 的转译过程也分为三个阶段，这三步具体是： 
1. 解析 Parse: 将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；
2. 转换 Transform: 对于 AST 进⾏⼀系列变换的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；
3. ⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 @babel/generator。