# webpack

Webpack核心能力：
1. 打包压缩（js混淆防止源码被利用），减少网络传输；
2. 文件指纹，合理利用http缓存；
3. 开发服务器，热更新，改善开发体验。

Webpack 的好处：
1. 可以使用任意模块化标准，无须担心兼容性问题。
2. 可以将非JS视为模块，使得对css、图片等资源进行更细粒度的控制。
3. 前端开发也能使用npm，webpack不会运行源代码，而是作为依赖，最终合并打包。
4. 非常适合开发单页应用。

webpack会非常暴力的将public目录中除页面模板（index.html）的文件复制到打包结果中。

除 JS 和 css 模块外，其他模块被视为资源模块。webpack 是无法识别 JS 中直接书写的路径字符串的，只有通过模块化的方式导入资源，资源才会被视为模块，webpack 才能将该资源的原始路径转换为打包结果的真实路径。

## 核心概念

###  bundle，chunk，module

**bundle**：是由webpack打包出来的可在浏览器直接运行的⽂件；chunk是无法在打包结果中看到的，打包结果中看到的是bundle。

**chunk**：代码块，⼀个chunk由多个模块组合⽽成，⽤于代码的合并和分割；简单来说，它表示通过某个入口模块找到的所有依赖的统称。每个chunk都至少有两个属性：
1. name：默认是main；
2. id：开发环境和name相同，生产环境是一个数字，从 0 开始。

**module**：是开发中的单个模块，在webpack的世界，⼀切皆模块，⼀个模块对应⼀个⽂件，webpack会从配置的 entry中递归开始找出所有依赖的模块。

**module 就是没有被编译之前的代码，通过 webpack 的根据文件引用关系生成 chunk 文件，webpack 处理好 chunk 文件后，生成运行在浏览器中的代码 bundle。**

### 构建流程

![](../../public/front-end/engineering/webpack-1.png)

![](../../public/front-end/engineering/webpack-2.png)

Webpack 的运⾏（编译、构建或打包）流程是⼀个串⾏的过程，从启动到结束会依次执⾏以下流程： 
1. **初始化**参数：从配置⽂件和 Shell 语句（CLI）中读取与合并参数并与默认配置融合，得出最终的参数；依托第三方库yargs完成。
2. 开始编译：⽤上⼀步得到的参数初始化 Compiler 对象，加载所有配置的插件，执⾏对象的 run ⽅法开始执⾏编译； 
3. 确定⼊⼝：根据配置中的 entry 找出所有的⼊⼝⽂件； 
4. **编译**模块：**从⼊⼝⽂件出发，调⽤所有配置的 Loader 对模块进⾏翻译（语法分析转换为AST），再找出该模块依赖的模块进行记录，再递归本步骤直到所有⼊⼝依赖的⽂件都经过了本步骤的处理；**
5. 完成模块编译：在经过第4步使⽤ Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系； 
6. **输出**资源：根据⼊⼝和模块之间的依赖关系，组装成⼀个个包含多个模块的 Chunk，再把每个 Chunk 转换成⼀个单独的⽂件加⼊到输出列表，这步是可以修改输出内容的最后机会； 
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和⽂件名，把⽂件内容写⼊到⽂件系统。

在以上过程中，Webpack 会在特定的时间点⼴播出特定的事件，插件在监听到感兴趣的事件后会执⾏特定的逻辑，并且插件可以调⽤ Webpack 提供的 API 改变 Webpack 的运⾏结果。

**target 配置选项是构建目标**，指定构建出对应运行环境的代码。默认值为 "browserslist"，如果没有找到 browserslist 的配置，则默认为 "web"。虽然 webpack 不支持 向 target 属性传入多个字符串，但是可以通过设置两个独立配置（module.exports = [serverConfig, clientConfig];），来对 library 进行多套构建。

![](../../public/front-end/engineering/webpack-3.png)

### mode 模式

提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。Webpack4+ 支持，取值有 'none' | 'development' | 'production'，默认值是 'production'。

```javascript
// webpack.development.config.js
module.export = {
  mode: 'development'
}

// webpack.production.config.js
module.export = {
  mode: 'production'
}

// webpack.custom.config.js
module.export = {
  mode: 'none'
}
```

1. **development**：
    1. 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development。
    2. 启用 NamedChunksPlugin 和 NamedModulesPlugin 为所有的module（源文件）和chunk（构建输出的文件）定义一个名字。方便于浏览器调试；可以快速地对增加的内容进行编译；提供了更精确、更有用的运行时错误提示机制。
2. **production**：
    1. 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。
    2. 启用插件（最后一个为非内置插件）：
        1. FlagDependencyUsagePlugin：检测并标记模块之间的从属关系；
        2. FlagIncludeChunksPlugin：可以让 Webpack 根据模块间的关系依赖图中，将所有的模块连接成一个模块；
        3. ModuleConcatenationPlugin：告诉 Webapck 去清除一个大的模块文件中的未使用的代码，这个大的文件模块可以是自定义的，也可以是第三方的（注意：一定要 package.json 文件中添加 "sideEffects": false）；
        4. NoEmitOnErrorsPlugin；
        5. OccurrenceOrderPlugin；
        6. SideEffectsFlagPlugin：告知 Webapck 各个模块间的先后顺序，这样可以实现最优的构建输出；
        7. TerserPlugin：替代 uglifyjs-webpack-plugin 插件。它的作用依然是对构建输出的代码进行压缩。
3. **none：不使用任何默认优化选项，即启动 Webpack 打包时关闭默认的内置插件。**

```javascript
/**
 * 如果要根据 webpack.config.js 中的 mode 变量更改打包行为，则必须将配置导出为函数
 */
const config = {
  entry: './app.js',
  // ...
}
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }
  if (argv.mode === 'production') {
    // ...
  }
  return config;
}
```

### entry 入口

**入口起点(entry point)** 指示 webpack 应该使用哪个模块，来作为构建其内部**依赖图(dependency graph) **的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。动态加载的模块不是入口起点。

Webpack 寻找相对路径的文件时（解析入口点(entry point)和加载器(loader)）会以 **context 配置选项**为根目录，**context 配置选项**必须是绝对路径字符串。默认使用 Node.js 进程的当前工作目录，但是推荐在配置中传入一个值，使得配置独立于 CWD(current working directory, 当前工作目录)。


```javascript
const path = require('path');

module.exports = (env, argv) => {
  // __dirname: 当前所在目录
  // context 即同级的 app 目录
  context: path.resolve(__dirname, 'app');
}
```

**Webpack 提供 entry 配置选项**，来指定一个（或多个）不同的入口起点，默认值是 ./src/index.js。

**单入口语法**：string | string[]，是多入口对象语法中只有一个main-chunk的简写。entry 设置为string[]，在作为库的时候即和output.library一起使用时只有数组中最后一个模块会暴露。

![](../../public/front-end/engineering/webpack-4.png)

**Webpack 配置的可扩展**是指配置可重用，并且可以与其他配置组合使用，使得可以将关注点从环境(environment)、构建目标(build target)、运行时(runtime)中分离。然后使用专门的工具（如 webpack-merge）将它们合并起来。

**多入口对象语法**： `entry: { <entryChunkName> string | [string] } | {}`，entry 是一个 object，对象中每个属性对应一个Chunk，属性名key即chunk名，属性值value可以是string | string[] | {}，**描述每个入口的对象有如下属性**： 
1. dependOn：当前入口所依赖的入口，它们必须在该入口被加载前被加载。使用 dependOn 选项可以与另一个入口 chunk 共享模块（相当于将依赖的入口从当前入口剥离）。 
2. filename：指定要输出的文件名称。 
3. import：启动时需加载的模块。 
4. library：指定 library 选项，为当前 entry 构建一个 library。 
5. runtime：运行时 chunk 的名字。如果设置了，就会创建一个新的运行时 chunk。
6. publicPath：当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址。

确保runtime 和 dependOn 不应在同一个入口上同时使用，确保dependOn 不能是循环引用的，确保 runtime 不能指向已存在的入口名称，否则均会抛出错误。

![](../../public/front-end/engineering/webpack-5.png)

**分离 app(应用程序) 和 vendor(第三方库) 入口的场景**，webpack4开始，不推荐为 vendor 或其他不是执行起点创建 entry，而是应该使用 optimization.splitChunks 选项，将 vendor 和 app模块分开，并为其创建一个单独的文件。在多页面应用程序中，server会拉取一个新的 HTML 文档到客户端。页面重新加载此新文档，并且资源被重新下载。借助optimization.splitChunks 为页面间共享的应用程序代码创建 bundle，并对多个入口起点之间的大量代码/模块进行复用。**根据经验，每个 HTML 文档只使用一个入口起点。**

**动态入口语法**：entry设置为一个函数，那么它将会在每次 make 事件中被调用。make 事件在 Webpack 启动和每当监听文件变化时都会触发。动态入口使得可以从外部来源（远程服务器，文件系统内容或者数据库）获取真正的入口。

![](../../public/front-end/engineering/webpack-6.png)

### output 输出

output 配置选项指定webpack 对「bundle、asset 和其他所打包或使用 webpack 载入的任何内容」如何进行输出和输出位置。只能指定一个 output 配置。主要输出文件的默认值是 ./dist/main.js，其他生成文件默认放置在 ./dist 文件夹中。

在 webpack 配置中，output 配置选项的最低要求是，包括output.filename的一个对象。

#### output.filename
如果webpack配置会生成多于一个 "chunk"（例如，使用多个入口起点或使用 CommonsChunkPlugin 插件），则在output.filename上应该使用占位符(substitutions) 来确保每个文件具有唯一的名称。占位符可以是以下一个或多个组合：
1. [name]：chunk 名称。
2. [id]：内部chunk id，从0自增。
3. [fullhash]：整个编译过程(compilation)的 hash，webpack4是[hash]（已弃用）。
4. [chunkhash]：每一个入口（entry）的hash。
5. [contnethash]：每一个模块的hash。

因为 ExtractTextWebpackPlugin 提取出来的内容是代码内容本身，而不是由一组模块组成的 Chunk，所以ExtractTextWebpackPlugin 插件使用 contenthash 而不是 chunkhash 来代表哈希值。

hash的长度可以使用 [chunkhash:16]（默认为 20）来指定，或者通过指定output.hashDigestLength 在全局配置长度

也可以使用函数：

![](../../public/front-end/engineering/webpack-7.png)

#### output.pathinfo

类型是boolean | 'verbose'，用于告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项在 development 模式时的默认值为 true，而在 production 模式时的默认值为 false。当值为 'verbose' 时，会显示更多信息，如 export以及运行时依赖。生产环境(production)下，不应该使用true 或  'verbose'。

#### output.publicPath

用于指定在浏览器中所引用的「此输出目录对应的公开 URL」，相对 URL(relative URL) 会被相对于 HTML 页面（或 `<base>` 标签）解析。相对于服务的 URL(Server-relative URL)、相对于协议的 URL(protocol-relative URL) 或绝对 URL(absolute URL) 也可能用到，比如托管在CDN的资源。

该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 的前缀。因此大多数情况，该选项的值以 / 结尾。

对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定错误的值，会导致404错误。

#### output.chunkFilename

只用于配置非初始（non-initial）chunk 文件，即在运行时生成的chunk的名称。取值和output.filename类似。常见场景包括：
1. 使用 CommonsChunkPlugin，用于创建一个单独的文件中，由多个入口点之间共享的公共模块。不过从 Webpack v4+ 开始，CommonsChunkPlugin 已被删除，转而使用 optimization.splitChunks。
2. 使用 import('path/to/module') 动态加载的模块等。

#### output.crossOriginLoading

按需加载是通过JSONP实现的。JSONP 的原理是动态地向 HTML 中插入一个 `<script>` 标签去加载异步资源。该选项配置启用 cross-origin 属性按需加载 chunk，仅在 target 设置为 'web' 时生效。`<script>` 标签的crossOrigin值：
1. 'anonymous' - 不带凭据(credential) 启用跨域加载 
2. 'use-credentials' - 携带凭据(credential) 启用跨域加载。

默认情况下（即未指定 crossOrigin 属性时），CORS（跨域资源共享） 根本不会使用。而且script标签的可以使用cross-origin 属性来使那些将静态资源放在另外一个域名的站点打印详细错误信息。

#### output.library

当用 Webpack 去构建一个可以被其他模块导入使用的库时使用。类型是string | string[]| {}，对象语法包括以下属性：
1. output.library.name指定库的名称。
2. output.library.type配置将库暴露的方式，以何种方式将入口点的返回值赋值给output.library.name提供的名称，之前是使用的配置选项是output.libraryTarget（不推荐，未来可能会废弃）。取值有：
    1. 'var'（默认），入口起点的返回值 将会被赋值给一个  output.library.name名称的变量。
    2. 'this'，入口起点的返回值将会被赋值给 this 对象下的 output.library.name 属性。
    3.  'global'，入口起点的返回值将会被复制给全局对象下的 output.library.name。
    4.  'commonjs'，入口起点的返回值将使用 output.library.name 赋值给 exports 对象。
    5.  'commonjs2'，入口起点的返回值将会被赋值给 module.exports。
    6.  'amd'，将库暴露为 AMD 模块。
    7. 'module'，输出ES模块。
    8.  'window'，入口起点的返回值将会被赋值给 window 对象下的 output.library.name。
3. output.library.export，类型string | string[]，指定入口起点返回值的哪一个子模块应该被暴露为一个库。默认为 undefined，将会导出整个（命名空间）对象。string[]将被解析为一个要分配给库名的模块的路径。

![](../../public/front-end/engineering/webpack-8.png)

### resolve 解析

resolve配置选项用于设置模块如何被解析。类型是object。有以下几个属性：
1. **resolve.alias**，类型object，创建 import 或 require 的别名。
2. **resolve.mainFields**，此选项将决定当从 npm 包中导入模块时，在 package.json 中使用哪个字段导入模块，默认值受target的影响。当 target 属性设置为 webworker, web 或者没有指定时，resolve.mainFields的值是['browser', 'module', 'main']，即会优先从package.json 的 browser 属性解析文件。对于其他任意的 target（包括 node），默认值为['module', 'main']，即会优先选择package.json 的的module属性。
3. **resolve.extensions**，类型string[]，尝试按顺序解析这些后缀名。当导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在，支持使用 '...' 访问webpack设置的默认拓展名。

![](../../public/front-end/engineering/webpack-9.png)

1. **resolve.modules**，告诉 webpack 解析模块时应该搜索的目录。默认值是['node_modules']，可以在之前添加目录，会优先于 node_modules/ 搜索。
2. **resolve.descriptionFiles**，用于描述第三方模块的 JSON 文件，默认值是['package.json']
3. **resolve.enforceExtension**，默认值是false，如果是 true，导入语句将不允许无扩展名文件。Webpack 4+ 版本，只针对node_modules中模块的resolve.moduleExtensions 和 resolve.enforceModuleExtension 已经被删除。

**resolver（解析器）** 是一个帮助 webpack 从每个 require/import 语句中，找到需要引入到 bundle 中的模块代码的库。 当打包模块时，webpack 使用 enhanced-resolve 来解析三种文件路径：
1. **绝对路径**：直接使用，不用解析。
2. **相对路径**：在 import/require 中给定的相对路径，会拼接使用 import 或 require 的资源文件所处的目录（上下文目录），来生成模块的绝对路径。
3. **模块路径**：在 resolve.modules 中指定的所有目录中检索模块。 可以通过 resolve.alias配置别名的方式来简化模块路径的首个目录。

一旦根据上述规则解析路径后，resolver 将会检查路径是指向文件还是文件夹：
1. **如果路径指向文件**，如果文件具有扩展名，则直接将文件打包。 否则，将使用 resolve.extensions 选项作为文件扩展名来解析。
2. **如果路径指向一个文件夹**，则进行如下步骤寻找具有正确扩展名的文件：
    1. 如果文件夹中包含 package.json 文件，则会根据 resolve.mainFields 配置中的字段顺序查找，并根据 package.json 中的符合配置要求的第一个字段来确定文件路径。
    2. 如果不存在 package.json 文件或 resolve.mainFields 没有返回有效路径，则会根据 resolve.mainFiles 配置选项中指定的文件名顺序查找，看是否能在 import/require 的目录下匹配到一个存在的文件名。
    3. 然后使用 resolve.extensions 选项，以类似的方式解析文件扩展名。

**resolveLoader 配置选项**，与resolve配置选项的value对象的属性集相同，但仅用于解析 webpack 的 loader 包。

### module（包括loader）

module 配置选项决定了如何处理项目中的不同类型的模块。Webpack 天生支持如下模块类型有 ECMAScript 模块， CommonJS 模块， AMD 模块， Assets， WebAssembly 模块。

#### module.rules

用于配置模块的读取和解析规则，通常用来配置 Loader。每个Rule（规则）可以分为三部分 - 条件(condition)，结果(result)和嵌套规则(nested rule)。

**条件匹配**：通过 Rule.test（引入所有通过断言测试的模块）、Rule.include（引入符合任何条件的模块）、Rule.exclude （排除所有符合条件的模块）三个配置项来选中 Loader 要应用规则的文件。其中任意一个提供，就不能再提供 Rule.resource。支持字符串，数组和正则。

**应用规则**：对选中的文件通过 Rule.use 配置项来应用 Loader，传递字符串（如：use: [ 'style-loader' ]）是 loader 属性的简写方式（如：use: [ { loader: 'style-loader'} ]）。可以分别向 Loader 在Rule.use.options上传入参数。Rule.enforce选项设置loader的种类，没有值表示是普通（normal） loader，pre表示前置loader（相当于放到数组最后面），post 表示后置loader（相当于放到数组最前面）。多个Loader默认按照从右往左的顺序应用，因为webpack选择了compose这样的函数式编程方式，这种方式的表达式执行是从右向左的。而所有一个接一个地进入的 loader，都有两个阶段：
1. Pitching 阶段：loader 上的 pitch 方法，从左往右的顺序调用，而且如果一个patching方法返回了结果，就会跳过其他的loader直接进入Normal阶段。
2. Normal 阶段:：loader 上的常规方法从右往左的顺序调用。模块源码的转换， 发生在这个阶段。

#### module.noParse

防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能，比如 jQuery 或 lodash。

#### module.parse

类似于module.generator，相比module.noParse只是指定哪些文件不被解析，可以用 module.parser 在一个地方配置所有解析器的选项。

#### loader

loader 用于对模块的源代码进行转换。可以使用 loader 告诉 webpack 加载 CSS 文件使用使用 css-loader，或者使用ts-loader将 TypeScript 转为 JavaScript。
loader 支持链式调用。链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照相反的顺序执行。链中的第一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader，依此类推。loader 可以是同步的，也可以是异步的。loader 运行在 Node.js 中，并且能够执行任何操作。loader 可以通过module.Rules中的Rule.use.options 对象配置传递给loader的参数。也可以使用Rule.use.options.plugins（插件）给loader添加更多特性。

**esbuild-loader 特性**：esbuild 是用 Go 语言写的，并且编译为 Native Code，大量使用并行，内存得到有效利用，可以替换掉babel-loader对JS做转译和minimizer上使用esbuid-loader，前提是没有使用一些自定义的 babel-plugin (如 babel-plugin-import)，以及不需要兼容一些低版本浏览器（esbuild 只能将代码转成 es6）。

![](../../public/front-end/engineering/webpack-15.png)

#### 如何编写一个loader？

loader 本质上是导出为函数的 JavaScript 模块。loader runner 会调用此函数，然后将上一个 loader 产生的结果或者资源文件传入进去。函数中的 this 作为上下文可以调用 loader runner 中的一些实用的方法，比如可以使 loader 调用方式变为异步。编写 loader 时应该遵循以下准则：
1. **简单**：loaders 应该只做单一任务。这不仅使每个 loader 易维护，也可以在更多场景链式调用。
2. **链式**：利用 loader 可以链式调用的优势，写多个功能隔离的loader。loader 可以被链式调用意味着不一定要输出 JavaScript。只要下一个 loader 可以处理这个输出，这个 loader 就可以返回任意类型的模块。
3. **模块化**：保证输出模块化。
4. **无状态**：确保 loader 在不同模块转换之间不保存状态。
5. **loader 工具库**：充分利用 loader-utils 包。

可以用 webpack-defaults 来生成开始编写 loader 必要的样板代码(boilerplate code)。

如果是单个处理结果，可以在**同步模式**中直接return返回。如果有多个处理结果，则必须调用 this.callback()，且不能有return。**在异步模式中**，必须调用 this.async() 来告知 loader runner 等待异步结果，它会返回 this.callback() 回调函数。随后 loader 必须返回 undefined 并且调用该回调函数。

![](../../public/front-end/engineering/webpack-10.png)

### Plugin

相比loader 是对某些类型的模块进行转换，插件可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量等等。

webpack 插件是一个具有 apply 方法的JavaScript Class 对象。**apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象**。插件能够 hook 到编译(compilation)中发出的每一个关键事件中。

由于插件可以携带参数/选项，因此必须在 webpack 配置中，向 plugins 属性传入一个插件的 new 实例，插件会按从左到右的顺序执行。

![](../../public/front-end/engineering/webpack-11.png)

所有webpack内置插件都作为webpack的静态属性存在的，使用则是通过new webpack.PluginName(options)。

#### SplitChunksPlugin

最初，块（Chunks）及其内部导入模块是通过 Webpack 内部的依赖关系图的父子关系连接起来的，用于提取公共模块。从 Webpack v4+ 开始，CommonsChunkPlugin 已被删除，转而使用 optimization.splitChunks选项配置。默认情况下 Webpack 会按照下列条件自动分割 Chunks：
1. 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹。
2. 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）。
3. 当按需加载 chunks 时，并行请求的最大数量小于或等于 30。
4. 当加载初始化页面时，并发请求的最大数量小于或等于 30。

![](../../public/front-end/engineering/webpack-12.png)

当 Webpack 处理文件路径时，它们在 Unix 系统上始终包含 /，在 Windows 上始终包含 \。因此，必须在 cacheGroup.test 字段中使用 [\\/] 来表示路径分隔符。在跨平台使用时，cacheGroups.test 中的 / 或 \ 将导致问题。

#### DefinePlugin

**DefinePlugin 允许在编译时将代码中的变量替换为其他值或表达式**。这在需要根据开发模式与生产模式进行不同的操作时，非常有用。传递给 DefinePlugin 的每个键都是一个标识符或多个以 . 连接的标识符。
1. 如果该值为字符串，它将被作为代码片段来使用。
2. 如果该值不是字符串，则将被转换成字符串（包括函数方法）。
3. 如果值是一个对象，则它所有的键将使用相同方法定义。
4. 如果键添加 typeof 作为前缀，它会被定义为 typeof 调用。

![](../../public/front-end/engineering/webpack-13.png)

通过 webpack.DefinePlugin.runtimeValue 可以生成运行时值，定义一些依赖于文件的变量，当文件系统中的文件发生变化时，这些变量将被重新评估。这意味着当这些被监视的文件发生变化时，Webpack 将重建。
请注意：
1. 由于本插件会直接替换文本，因此提供的值必须在字符串本身中再包含一个 实际的引号 。通常，可以使用类似 '"production"' 这样的替换引号，或者直接用 JSON.stringify('production')。
2. 在为 process 定义值时，'process.env.NODE_ENV': JSON.stringify('production') 会比 process: { env: { NODE_ENV: JSON.stringify('production') } } 更好，后者会覆盖 process 对象，这可能会破坏与某些模块的兼容性，因为这些模块会在 process 对象上定义其他值。

#### DllPlugin

DllPlugin 和 DllReferencePlugin 主要功能是可以将可共享且不经常改变的代码，抽取成一个共享的库，避免进行二次构建，同时也对构建时间进行优化。

通常来说，我们的代码都可以至少简单区分成业务代码和第三方库。如果不做处理，每次构建时都需要把所有的代码重新构建一次，耗费大量的时间。然后大部分情况下，很多第三方库的代码并不会发生变更（除非是版本升级），这时就可以用到 dll：把复用性较高的第三方模块打包到动态链接库中，在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码。

DllReferencePlugin 和 DllPlugin 都是在 单独的 webpack 配置中使用的，用于创建一个 dll-only-bundle。建议 DllPlugin 只在 entryOnly: true 时使用，否则 DLL 中的 tree shaking 将无法工作，因为所有 exports 均可使用。

插件的作用是：
1. 分离代码：业务代码和第三方模块可以被单独打包到不同的文件中
    1. 避免打包出单个文件的大小太大，不利于调试
    2. 将单个大文件拆分成多个小文件之后，一定情况下有利于加载（不超过浏览器一次性请求的文件数的情况下，并行下载肯定比串行快）
2. 提升构建速度：第三方库代码没有变更时，由于我们只构建业务相关代码，相比全部重新构建自然要快得多。

**首先，使用 DllPlugin 打包需要分离到动态库的模块**。

然后在主构建配置文件webpack.config.js 中使用动态库文件，要用到 DllReferencePlugin，这个插件通过引用 dll 的 manifest 文件来把依赖的名称映射到模块的 id 上，之后再在需要的时候通过内置的 webpack_require 函数来 require 它们：

DllPlugin 中的 name 参数必须和 output.library 中保持一致，因为DllReferencePlugin 会去 manifest.json 文件读取 name 字段的值，并作为在全局变量中获取动态链接库中内容时的全局变量名。

![](../../public/front-end/engineering/webpack-16.png)

最后在在入口文件引入 dll 文件，生成的 dll 暴露出的是全局函数，因此还需要在入口文件中引入对应的 dll 文件。（也可以使用 AddAssetHtmlPlugin，将打包好的 DLL 库引入到 HTML 模版中）。

#### 如何编写一个Plugin（插件）？

webpack 插件由以下组成：
1. 一个 JavaScript 命名函数或 JavaScript 类。
2. 在插件函数的 prototype 上定义一个 apply 方法（也就是Class里的方法）。
3. 指定一个绑定到 webpack 自身的事件钩子。
4. 处理 webpack 内部实例的特定数据。
5. 功能完成后调用 webpack 提供的回调。

![](../../public/front-end/engineering/webpack-14.png)

可以使用 schema-utils 来校验在webpack配置中传入插件的options，这点和loader类似。

当hook入到的生命周期钩子函数是同步的，比如compile（beforeCompile 之后立即调用，但在一个新的 compilation 创建之前） 阶段，只有同步的 tap 方法可以使用。当hook入到的生命周期钩子函数是异步的，比如run 阶段或emit（输出 asset 到 output 目录之前执行）阶段，则可以使用  tapAsync 、 tapPromise以及tap方法。

当用 tapAsync 方法来绑定插件时，必须在最后调用指定的回调函数的最后一个参数 callback 。当我们用 tapPromise 方法来绑定插件时，必须返回一个 pormise，异步任务完成后 resolve，即可以使用async/await。

#### 有用的plugin

1. clean-webpack-plugin：重新构建成功之前webpack的output.path 目录中的所有文件将被删除一次，但目录本身不会被删除。
2. html-webpack-plugin：自动化的生成HTML文件，这对于文件名中包含每次编译都会更改的hash的 webpack bundle特别有用。如果是多入口，则对应的script标签都会包括在生成的html文件中。如果在 webpack 的输出中有任何 CSS 资源（例如，使用 mini-css-extract-plugin 提取的 CSS），那么这些资源将包含在 HTML 头部的 `<link>` 标签中。也支持通过template选项来提供自定义模板html。通过filename选项自定义生成的html文件名。通过chunks选项自定义生成的html文件要引入哪些script标签。注意，每个HtmlWebpackPlugin实例只生成一个html，可以通过配置多个HtmlWebpackPlugin实例生成多个html。**public/index.html 文件是一个会被 html-webpack-plugin 处理的模板**。在构建过程中，资源链接会被自动注入。
3. copy-webpack-plugin：将已存在而不是构建产生的单个文件或整个目录（from）复制到构建目录（to）。如果希望 webpack-dev-server 在开发期间将文件写入输出目录，可以使用 writeToDisk 选项或 write-file-webpack-plugin 强制它。

## sourceMap

SourceMap 就是一个信息文件，里面储存着代码的位置信息。这种文件主要用于开发调试，现在代码都会经过压缩混淆，这样报错提示会很难定位代码。通过 SourceMap 能快速定位到源代码，并进行调试。通常情况 SourceMap 在开发环境开启，线上环境关闭。

**使用场景**：
1. 开发期间，开发人员能直接通过浏览器调试工具直接定位错误或进行 Debug 调试。
2. 线上排查问题的时候可以将 SourceMap 上传到错误监控系统。

首先，浏览器一般默认开启SourceMap 调试，使得控制台的 Console 面板的错误提示，直接点击就会跳转到对应的源文件出错位置：

![](../../public/front-end/engineering/webpack-17.png)

如果没 Console 没报错，但是页面显示不正确。可以点击控制台的 Sources （源代码）tab，源文件都在 webpack:// 目录下，或者直接搜索文件，打开源文件后进行断点调试。而对于按需加载的路由，只有页面加载了，源文件才会在该目录下显示。

![](../../public/front-end/engineering/webpack-18.png)

生成sourceMap，浏览器控制台才能直接显示原始代码出错的位置，而不是转换后的代码，使用Webpack 的devtool字段配置 sourceMap，都是eval、source-map、inline、cheap 和 module 的自由组合或都没有（none）：
1. none：省略 devtool 选项，即不生成 source map。
2. eval：使用 eval 包裹模块代码，并且在末尾追加注释 //@sourceURL。
3. source-map：产生 .map 文件，每个 bundle 文件后缀加上 sourcemap 的 sourceURL 或 dataURL，包括行列信息，loader 也有对应的 sourcemap。
4. cheap：sourcemap 中的 mappings 只有对应行信息，没有列文件，loader 也没有对应的 sourcemap，对应的都是 loader 转换后的代码，不是纯正的源代码。
5. inline：将 .map 作为 DataURI（Base64）嵌入，不单独生成 .map 文件（不推荐使用，因为这样会造成源代码体积巨大）。
6. module：包含 loader 的 sourcemap。

**开发环境推荐：eval-cheap-module-source-map**。

**生产环境推荐**：
1. **source-map**，应该将服务器配置为不允许普通用户访问 source map 文件。
2. **none**
3. **nosources-source-map**，会暴露反编译后的文件名和结构，但它不会暴露原始代码。它可以用来映射客户端上的堆栈跟踪，而无须暴露所有的源代码，因此可以将 source map 文件部署到 web 服务器。
4. **hidden-source-map** ，与 source-map 相同，但不会为 bundle 添加引用注释，即浏览器不会主动去请求map文件。适合只想 source map 映射那些源自错误报告的错误堆栈跟踪信息，但不想为浏览器开发工具暴露 source map的情况，且该设置不应将 source map 文件部署到 web 服务器。

**推荐原因**：
1. 使用 cheap 模式可以大幅提高 souremap 生成的效率。大部分情况调试并不关心列信息，而且就算 sourcemap 没有列，有些浏览器引擎（例如 v8）也会给出列信息。
2. 使用 eval 方式可大幅提高持续构建效率。
3. 使用 module 可支持 babel 这种预编译工具。
4. 使用 eval-source-map 模式可以减少网络请求。这种模式开启 DataUrl 本身包含完整 sourcemap 信息，并不需要像 sourceURL 那样，浏览器需要发送一个完整请求去获取 sourcemap 文件，这会略微提高点效率。而生产环境中则不宜用 eval，这样会让文件变得极大。

也可以直接使用 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin 来替代使用 devtool 选项，可以进行更加精细化的控制。切勿同时使用 devtool 选项和 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin 插件。devtool 选项在内部添加过这些插件，所以最终将应用两次插件。

**sourceMap 方便调试，但也会暴露源代码，存在以下安全问题：**
1. 代码被抄袭：查看源码，抄走对应功能。
2. 业务流失：竞争对手拿到源码，宣扬其中的漏洞或者缺陷，或者直接写后台，成本少，价格低，抢走业务。
3. 系统被攻击：绕过权限获得对应资源。

或者可以使用nosources-source-map创建的 source map 不包含 sourcesContent(源代码内容)。它可以用来映射客户端上的堆栈跟踪，而无须暴露所有的源代码。你可以将 source map 文件部署到 web 服务器。

## 文件监听（watch 和 watchOptions）

Webpack 可以监听文件变化，当它们修改后会重新编译。watch默认值是false，即不开启监听。

![](../../public/front-end/engineering/webpack-19.png)

## 模块热替换(HMR)

**模块热替换（ HMR-Hot Module Replacement）**，是指在应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。主要通过以下几种方式，来显著加快开发速度：
1. 保留在完全重新加载页面期间丢失的应用程序状态
2. 只更新变更内容，以节省宝贵的开发时间
3. 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

**页面的刷新一般分为两种**：
1. 一种是页面刷新，直接 window.location.reload()，不保留页面状态，比如Live Server。
2. 基于 WDS (webpack-dev-server，对应webpack命令为webpack server) 的模块热替换（HMR），只需要局部刷新页面上发生变化的模块，同时可以保留当前的页面状态。

实现原理：首先是建立起浏览器端和服务器端之间的通信，浏览器会接收服务器端推送的消息，如果需要热更新，浏览器发起 HTTP 请求去服务器端获取打包好的资源解析并局部刷新页面（橙色框是浏览器端，红色框是服务端；绿色方框是 Webpack 代码控制的区域，蓝色方框是 webpack-dev-server 代码控制的区域）。

![](../../public/front-end/engineering/webpack-20.png)

1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，**根据配置文件对模块重新编译打包，并将打包后的代码通过JavaScript 对象保存在内存中**。
2. 第二步， webpack 和 webpack-dev-server 进行接口交互，主要是 webpack-dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API 对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3. 第三步是 webpack-dev-server 对文件变化的一个监控，与第一步监控代码变化重新打包不同：当配置devServer.watchContentBase为true时，Server会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行live reload（浏览器刷新）。
4. 第四步是webpack-dev-server 通过 sockjs在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息（新模块的 Hash 值或第三步中 web-dev-server 监听静态文件变化的信息）告知webpack-dev-server/client浏览器端，
5. 第五步，webpack-dev-server/client 端并不能够请求更新的代码，也不会执⾏模块热替换的操作，而是交给webpack/hot/dev-server，它的⼯作就是根据 webpack-dev-server/client 传给它的信息以及 webpack-dev-server 的配置决定是刷新浏览器还是进⾏模块热替换。
6. 如果是模块热替换，由HotModuleReplacement.runtime （客户端 HMR 的中枢）将接收到webpack/hot/dev-server传递的新模块的 hash 值，并通过JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回⼀个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码（图中7、8、9步）。
7. **第 10 步，HotModulePlugin 将会对新旧模块进⾏对⽐**，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引⽤。是决定 HMR 成功与否的关键步骤
8. 若 HMR 失败，则回退到live reload （刷新浏览器 ）获取最新打包代码。

## webpack 相关的优化

### ⽤webpack来优化前端性能
⽤ webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。 
1. 压缩代码：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 terser-webpack-plugin（默认使用 terser 来压缩 JavaScript） 来压缩JS⽂件， 利⽤ CssMinimizerWebpackPlugin （使用 cssnano 优化和压缩 CSS）来压缩css ，利用HtmlWebpackPlugin来压缩HTML。
2. 利⽤CDN加速: 在构建过程中，将引⽤的静态资源路径修改为CDN上对应的路径。可以利⽤webpack对于 output 参数和各loader的 publicPath 参数来修改资源路径。
3. Tree Shaking（通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)）：将代码中永远不会⾛到的⽚段删除掉。可以通过在启动webpack时追加参数 --optimize-minimize 来实现。
4. Code Splitting（代码分割）: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存。
    1. 入口起点：使用 entry 配置手动地分离代码。
    2. 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
    3. **动态导入：通过模块的内联函数（import（））调用来分离代码**。
5. 提取公共第三⽅库：SplitChunksPlugin插件来进⾏公共模块抽取，利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码。

### 提⾼webpack的构建和打包速度
1. thread-loader：并⾏编译loader，利⽤缓存来使得 rebuild 更快。
2. **外部扩展(externals)**: 将不怎么需要更新的第三⽅库脱离webpack打包，不被打⼊bundle中，从⽽减少打包时间，⽐如生产环境下，jQuery、vue、vuex、vue-router、axios等⽤script标签cdn引⼊。
3. **dll**: 采⽤ webpack 的 DllPlugin 和 DllReferencePlugin 引⼊dll，让⼀些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间 。
4. **利⽤缓存**: webpack.cache 、babel-loader.cacheDirectory、thread-loader.cache 都可以利⽤缓存提⾼ rebuild效率缩⼩⽂件搜索范围。
5. **多⼊⼝情况下，使⽤ SplitChunksPlugin 来提取公共代码**。
6. **使⽤ Tree-shaking 和 Scope Hoisting 来剔除多余代码**。
7. 使用 esbuild-loader来提升压缩速度。
8. 使用现代模式构建应用，为现代浏览器交付原生支持的 ES2015 代码，并生成一个兼容老浏览器的包用来自动回退。比如Vue CLI 中，vue-cli-service build命令添加 --modern 选项。Vue CLI 会产生两个应用的版本：一个现代版的包，面向支持 ES modules 的现代浏览器，另一个旧版的包，面向不支持的旧浏览器，仅生成一个HTML来智能的判断应该加载哪个包：
    1. 现代版的包会通过 `<script type="module">` 在被支持的浏览器中加载；它们还会使用  `<link rel="modulepreload">` 进行预加载。
    2. 旧版的包会通过 `<script nomodule>` 加载，并会被支持 ES modules 的浏览器忽略。
    3. 一个针对 Safari 10 中 `<script nomodule>` 的修复会被自动注入。

## 其他配置

### externals

externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。