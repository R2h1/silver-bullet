# NodeJS

## require和import的区别
1. 是否采用严格模式，import/export 导出的模块默认调用严格模式。
2. ES6 模块可以在 import 引用语句前使用模块，CommonJS 则需要先引用后使用
3. import/export 不能对引入模块重新赋值/定义
4. require/exports 输出的是一个值的拷贝，import/export 模块输出的是值的引用
5. CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成
6. import/export 在浏览器中无法直接使用，我们需要在引入模块的 `<script>` 元素上添加type="module属性

## Express

:::danger 写作中 :::