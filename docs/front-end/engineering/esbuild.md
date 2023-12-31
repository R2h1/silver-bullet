# esbuild

esbuild 使用 go 语言编写，由于相对 node 更为底层，且不提供 AST 操作能力，所以代码执行效率更高。可以减少等待构建运行的时间，能改善开发体验，但是 esbuild 相对较为底层，因此在拉入依赖关系和配置环境上环节上会花费时间。使用 Rollup 和 terser 生成的 bundler 包相较 esbuild 略小 6.8 % 左右。

esbuild 有两大功能，分别是 bundler 与 minifier，其中 bundler 用于代码编译，类似 babel-loader、ts-loader；minifier 用于代码压缩，类似 terser。 但 esbuild 无法操作 AST，所以一些需要操作 AST 的 babel 插件无法与之兼容，导致生产环境很少直接使用 esbuild 的 bundler 模块。幸运的是 minifier 模块可以直接替换为 terser 使用，可以用于生产环境。