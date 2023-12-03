# eslint

ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。在许多方面，它和 JSLint、JSHint 相似，除了少数的例外：
1. ESLint 使用 Espree 解析 JavaScript。
2. ESLint 使用 AST 去分析代码中的模式
3. ESLint 是完全插件化的。每一个规则都是一个插件并且你可以在运行时添加更多的规则。

在目录中存在package.json文件（可以使用npm init或yarn init创建）的前提下，运行安装和配置命令npm init @eslint/config后的目录中将有一个.eslintrc.{js,yml,json}文件。