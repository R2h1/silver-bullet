# Typescript

Typescript是添加了类型系统的JavaScript，属于弱类型（即允许隐式类型转换）、静态类型语言，适应于任何规模的项目，支持 ES6，由微软开发并开源。Typescript增加的功能包括：类型批注和编译时类型检查、类型推断、类型擦除、接口、枚举、Mixin、泛型编程、名字空间、元组、Await。TypeScript 区分大小写。

TypeScript 和 JavaScript 一样没有整数类型；

TypeScript 继承关键字为extends，允许接口继承多个接口；

因此，现有的 JavaScript 代码可与 TypeScript 一起工作无需任何修改，TypeScript 可处理已有的 JavaScript 代码，并只对其中的 TypeScript 代码进行编译。

## 声明空间/编译上下文

在 TypeScript 里存在两种声明空间：**类型声明空间**与**变量声明空间**。
1. **类型声明空间包含用来当做类型注解的内容**。注意，不能够把interface、type等声明作为一个变量来使用，因为它没有定义在变量声明空间中。类型注解支持使用内联语法注解任何内容，即 :**{ /\*Structure\*/ }**。
2. **变量声明空间包含可用作变量的内容**，注意，用 var/let/class 声明的变量，也只能在变量声明空间使用，不能用作类型注解。但构造函数或 Class类名提供了一个类型到类型声明空间，此外它同样提供了一个同名变量到变量声明空间。

**编译上下文**可以用它来给文件分组，告诉 TypeScript 哪些文件是有效的，哪些是无效的，此外还包含有正在被使用的编译选项的信息。比较好的方式是使用 tsconfig.json 文件（在项目的根目录下创建一个包含空{}的tsconfig.json文件，TypeScript 将会把此目录和子目录下的所有.ts文件作为编译上下文的一部分，它还会包含一部分默认的编译选项）。编译选项通过compilerOptions 来定制。

好的 IDE 支持对 TypeScript 的即时编译。但是，如果想在使用 tsconfig.json 时从命令行手动运行 TypeScript 编译器，可以通过以下方式：
1. 运行 tsc，它会在当前目录或者是父级目录寻找 tsconfig.json 文件。
2. 运行 tsc -p ./path-to-project-directory 。当然，这个路径可以是绝对路径，也可以是相对于当前目录的相对路径。
3. 甚至可以使用 tsc -w 来启用 TypeScript 编译器的观测模式，在检测到文件改动之后，它将重新编译。

也可以通过和 compilerOptions 同级的 files 选项或 include 和 exclude 选项，显式指定需要编译的文件：
1. files 选项指定一个允许包括在程序中的文件数组。当找不到其中任何文件发生错误。不支持通配符匹配，适用于少量枚举需编译且不依赖全局引用很多文件，否则用include
2. include 同files, 但支持三种通配符来匹配多个文件（exclude选项也支持），如果通配符中不包含文件扩展名，则仅包含具有受支持扩展名的文件（默认是文件后缀名为.ts/.ts/.d.ts + [.js/.jsx](若allowJs: true)）：
    1. * 匹配零个或多个字符（不包括目录分隔符）；
    2. ？匹配任何一个字符（不包括目录分隔符）；
    3. **/ 匹配嵌套到任何级别的任何目录。
3. exclude 指定编译过程include选项配置的文件中需要忽略的文件列表，不影响文件实际的import types reference files ，默认值是 ["node_modules", "bower_components", "jspm_packages", outDir]。
4. extends 选项指定当前配置文件要继承的配置文件，是一个路径字符串，加载顺序 ./config/base.json(extends) -> tsconfig.json(当前)，适用于控制某一配置文件的作用域；

<<< ../../../src/typescript/tsconfig-options.json#docs[tsconfig-options.json]

## 命名空间/模块/动态导入表达式/lib.d.ts

### 命名空间

namespace 是 TypeScript 早期时为了解决模块化而创造的关键字，中文称为命名空间。namespace 关键字编译后的 JavaScript 代码与传入待修改参数对象的立即调用函数表达式一样，注意，命名空间是支持嵌套的。对于大多数项目，建议使用外部模块和命名空间，来快速演示和移植旧的 JavaScript 代码。

### 模块

**全局模块**：在默认情况下，在一个新的 TypeScript 文件中写下代码时，它处于全局命名空间中。如果在相同的项目里创建了一个新的文件，TypeScript 类型系统将会允许使用全局命名空间中的变量。显然，使用全局变量空间是危险的，因为它会与当前文件内的代码命名冲突。然而如果团队里有 TypeScript 初学者，可以自定义一个 global.d.ts 文件（global.d.ts 是一种扩充 lib.d.ts 很好的方式），用来将一些接口或者类型放入全局命名空间里，这些定义的接口和类型能在所有 TypeScript 代码里使用。

**文件模块**：文件模块也被称为外部模块。如果在TypeScript 文件的根级别位置含有 import 或者 export，那么它会在这个文件中创建一个本地的作用域。文件内的代码不再处于全局命名空间中。在当前文件里使用 import 时，它不仅允许使用从其他文件导入的内容，还会将当前文件也标记为一个文件模块，当前文件内定义的声明也不会“污染”全局命名空间。**可以根据不同的 module 选项来把 TypeScript 编译成不同的 JavaScript 模块类型，使用 module: commonjs 选项（tsconfig.json中）来替代以下模式是个好主意**：
1. AMD：不要使用它，它仅能在浏览器工作；
2. SystemJS：这是一个好的实验，已经被 ES 模块替代；
3. ES 模块：它并没有准备好。编译结果js文件中除了没有类型以外完全一样。

放弃使用 import/require 语法即 import foo = require('foo') 写法，推荐使用 ES 模块语法书写TypeScript模块。即使用 module: commonjs 选项的同时，使用 ES 模块语法导入、导出、编写模块。

模块路径：如果需要使用编译选项 moduleResolution: node，应该将此选项放入tsconfig.json中，但如果使用了编译选项 module: commonjs 选项， moduleResolution: node 将会默认开启。存在两种截然不同的模块，它们的主要区别在于系统如何解析模块：
1. 相对模块路径（路径以 . 开头，例如：./someFile 或者 ../../someFolder/someFile 等）：
    1. 如果当前文件中含有相对路径导入./someFile，那么someFile文件必须与当前文件存在于相同的文件夹下；
    2. 如果当前文件中含有相对路径导入../someFile，那么someFile文件所存在的地方必须是当前文件的上一级目录；
    3. 如果当前文件中含有../someFolder/someFile，那么someFile文件所在的文件夹 someFolder 必须与someFile文件所在文件夹在相同的目录下。
2. 动态查找模块（模块解析将会模仿 Node 模块解析策略，如：core-js，typestyle，react 或者甚至是 react/core 等）：
    1. 当你使用 import Some from 'some'，将会按如下顺序查找模块：
        1. ./node_modules/some；
        2. ../node_modules/some；
        3. ../../node_modules/some；
        4. 直到系统的根目录。
    2. 当你使用 import Some from 'something/some'，将会按照如下顺序查找内容：
        1. ./node_modules/something/some；
        2. ../node_modules/something/some；
        3. ../../node_modules/something/some；
        4. 直到系统的根目录。

TypeScript 对查找到some文件或文件夹对应的位置（.ts/.d.ts/.js）即 place 将会检查以下内容：
1. 如果 place表示一个文件，则查找结束；
2. 否则，如果place是一个文件夹且存在一个文件some/index.ts，则查找结束；
3. 否则，如果place是一个文件夹且some/package.json 文件中的types指定的文件存在，则查找结束；
4. 否则，如果place是一个文件夹且package.json 文件中的main指定的文件存在，则查找结束。

项目中可以通过 declare module 'some' 声明一个全局模块的方式，来解决查找模块路径的问题。 而且，定义declare module "some-library-you-dont-care-to-get-defs-for"能使得快速开始从JS迁移到TS。

语法import some = require(‘some’) 只是导入 foo 模块的所有类型信息以及确定some模块运行时的依赖关系。如果没有把导入的名称some当做变量声明空间来用，在编译成 JavaScript 时，导入的模块some将会被完全移除。使用场景有：
1. **懒加载**：
    1. 在 webApp 中在特定路由上加载 JavaScript。
    2. 在 node 应用中只想加载特定模块，用来加快启动速度时。
2. **打破循环依赖**：某些模块加载器（commonjs/node 和 amd/requirejs）不能很好的处理循环依赖。在这种情况下，一方面使用延迟加载代码，另一方面预先加载模块。
3. **确保导入**：当加载该模块只是想引入其附加的作用（如：模块可能会注册一些像 CodeMirror addons）时，然而，如果仅仅是 import/require （导入），经过 TypeScript 编译后，这些将会被完全忽视。在这种情况下可以使用一个 ensureImport 变量，来确保编译的 JavaScript 依赖该模块。

### 动态导入表达式

动态导入表达式是 ECMAScript 的新功能，它允许在程序的任意位置异步加载一个模块，目前处于提案的 stage4 阶段。此外，webpack 支持 Code Splitting 功能，它能允许将代码拆分为许多块，这些块在将来可被异步下载，webpack 实现代码分割的方式有两种：使用 import() （首选，ECMAScript 的提案）和 require.ensure()。在 tsconfig.json 中的compilerOptions编译选项配置中使用 "module": "esnext" 选项使得TypeScript 保留 import() 语句用于 Webpack 的Code Splitting。

### lib.d.ts

安装 TypeScript 时会安装 lib.d.ts 声明文件（包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明）。
1. 它自动包含在 TypeScript 项目的编译上下文中；
2. 它使得能快速开始书写经过类型检查的 JavaScript 代码。

如果当前运行的 JavaScript 环境与基于标准浏览器运行时环境有很大不同，或者希望在代码里严格的控制全局变量（比如不希望lib.d.ts中定义的某些全局变量泄漏到项目代码里），可以通过指定 --noLib 的编译器命令行标志（或者在 tsconfig.json 中指定选项noLib: true）从上下文中排除此文件，然后在编译上下文中包含一个命名相似的文件，TypeScript 将提取该文件进行类型检查，但请谨慎使用--noLib选项。

寻找代码类型的最简单方式是**选中代码并 F12** 或者 **ctrl（Mac是command） + 鼠标左键**跳转到定义。

在 TypeScript 中，接口也是开放式的，这意味着想使用原本不存在的成员时，只需要将它们添加至 lib.d.ts 中的接口声明中即可，TypeScript 将会自动接收它。注意，基于可维护性，推荐在全局模块（比如创建一个global.d.ts）中做这些修改，以使这些接口与 lib.d.ts 相关联，然而如果愿意，可以在文件模块中通过使用 declare global { /* global namespace */ }进入全局命名空间。String接口、Date接口等对应的是prototype，DateConstructor接口、StringConstructor接口等对应的是构造函数。

编译目标选项target改变编译出的代码版本，版本越高，能导致 lib.d.ts 包含更多的新功能的环境声明，但不应该将编译出的代码与环境混为一谈，如果是对环境进行更细粒的控制应该使用lib选项，它可以将任何lib（环境库支持）与target（编译目标，即生成的 JavaScript 版本）解耦。

lib 分类如下：
1. JavaScript 功能：es5/es6/es2015/es7/es2016/es2017/esnext；
2. 运行环境：dom/dom.iterable/webworker/scripthost；
3. ESNext 功能选项：es2015.core/es2015.collection/es2015.generator/es2015.iterable/es2015.promise/es2015.proxy/es2015.reflect/es2015.symbol/es2015.symbol.wellknown/es2016.array.include/es2017.object/es2017.sharedmemory/esnext.asynciterable。

lib 选项提供非常精细的控制，因此最有可能从运行环境与 JavaScript 功能类别中分别选择一项，如果没有指定lib，则会导入默认库：
1. target 选项为 es5 时，会导入es5, dom, scripthost。
2. target 选项为 es6 时，会导入es6, dom, dom.iterable, scripthost。

targe 与 lib 配置示例：

```json
{
  "complierOptions": {
    "target": "es5",
    "lib": ["es6", "dom"] // 如果要使用 Symbol，添加一个 "es2015.symbol" 即可
  }
}
```

特别的，如果运行时是在旧的 JavaScript 引擎的浏览器中，要使用新功能（比如 Map、Set、Promise或更新的功能），除了使用现代的 lib 选项，还需要安装 core-js 并在项目中导入 Polyfill：core-js/shim。

## 原始数据类型

JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。原始数据类型包括：boolean、number、string、null、undefined、Symbol、bigInt。

在 TypeScript 中，使用 boolean 定义布尔值类型， number 定义数值类型，string 定义字符串类型，而new Boolean/Number/String返回的是一个 Boolean/Number/String 对象，直接调用 Boolean /Number/String也可以返回一个 boolean /number/string类型。其中，0b1010 和 0o744 是 ES6 中的二进制和八进制表示法，转为JavaScript时它们会被编译为十进制数字。其中` `用来定义 ES6 中的模板字符串，${expr} 用来在模板字符串中嵌入表达式，转为JavaScript时它们会被编译为字符串拼接。

JavaScript 没有空值（void）的概念，在 TypeScript 中，void类型表示没有任何返回值的函数。声明一个 void 类型的变量没有什么用，因为只能将它赋值为 undefined 和 null。在 TypeScript 中，可以使用 null 和 undefined 来定义原始数据类型null 和 undefined。与 void 的区别是，undefined 和 null 是所有类型的子类型，即undefined 和 null 类型的变量可以赋值给任何类型的变量（前提是strictNullChecks选项设置为false）。

## 其他类型

### 元组（tuple）类型

在 TypeScript 中，数组合并了相同类型的元素，而元组合并了不同类型的元素：
1. 当赋值或访问元组类型中某个已知索引的元素时，会得到正确的类型。
2. 当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。
3. 当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型。

### 枚举（enum）类型

枚举类型用于取值被限定在一定有限范围内的场景，枚举可以作为变量使用，因为它既处于类型声明空间，也位于变量声明空间。**枚举使用 enum 关键字来定义**：

<<< ../../../src/typescript/enum.ts#docs[enum.ts]

1. 枚举成员默认会被赋值为从 0 开始递增的数字，即数字类型枚举，同时也会对枚举值到枚举名进行反向映射。数字类型枚举允许将数字类型或者其他任何与数字类型兼容的类型赋值给枚举类型的实例。
2. 枚举项可以手动赋值。手动赋值的枚举项可以不是数字，也可以是小数或负数。未手动赋值的枚举项会接着上一个枚举项步长为1递增。
3. 根据枚举的编译结果，枚举是开放式的，意味着可以跨多个文件拆分（和扩展）枚举定义。在枚举的延续块中，重新初始化第一个成员（此处为 DarkRed = 3），使生成的代码不破坏先前定义的值（即0、1...等值），否则，TypeScript 将会发出警告（错误信息：In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.）。只有在不使用模块时，开放式的枚举才有意义，然而应该使用模块而不是开放式枚举。
4. 可以使用枚举，将其中的数字枚举成员作为标志，允许你检查一组条件中的某个条件是否为真。使用左移的位运算符，将除0以外的每个数字枚举成员的二进制向左移动位置得到数字 0001、0010、0100 和 1000（换成十进制结果是：1, 2, 4, 8），依次类推，然后，可以使用 |= 来添加一个标志；组合使用 &= 和 ~ 来清理标志；| 来合并多个标志。比如:

```typescript
enum Flags {
  None = 0;
  Flag1 = 1 << 0;
  Flag1 = 1 << 1;
  Flag1 = 1 << 2;
  Flag1Flag2Flag3 = Flag1 | Flag2 | Flag3;
}
```
5. 枚举项有两种类型：常数项（constant member）和计算所得项（computed member）。如果紧接在计算所得项后面的是未手动赋值的项，那么它就会因为无法获得初始值而报错。当满足以下条件时，枚举成员被当作是常数，其它情况的枚举成员被当作是需要计算得出的值：
    1. 不具有初始化函数并且之前的枚举成员是常数。在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。
    2. 枚举成员使用常数枚举表达式初始化。常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：
        1. 数字字面量；
        2. 引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用；
        3. 带括号的常数枚举表达式；
        4. +, -, ~ 一元运算符应用于常数枚举表达式；
        5.+, -, *, /, %, <<, >>, >>>, &, |, ^ 二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错。

**常数枚举是使用 const enum 定义的枚举类型**，常数枚举与普通枚举的区别是它会在编译阶段被删除，可以获得性能提升，并且不能包含计算成员，否则会在编译阶段抛错。然而，可能除了内联枚举，还想让编译器仍然把枚举类型的定义编译到JavaScript中，用于从字符串到数字，或者是从数字到字符串的查找。在这种情景下，可以使用编译选项 --preserveConstEnums，并且这不会以任何方式影响内联。

**外部枚举（Amibient Enums）是使用 declare enum 定义的枚举类型**，declare 定义的类型只会用于编译时的检查，编译结果中会被删除。外部枚举与声明语句一样，常出现在声明文件（.d.ts）中，同时使用 declare 和 const 关键字也是可以的。

**有静态方法的枚举**，可以使用 enum定义好枚举类型SomeEnum，然后再使用namespace 向枚举类型SomeEnum中添加静态方法。

### 任意（any）类型

任意类型用来表示允许赋值为任意类型。
1. 对于单一普通类型，在赋值过程中改变类型是不被允许的，任意类型则可以。
2. 在任意值上访问任何属性都是允许的，也允许调用任何方法。
3. 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型。
通常，会用any 来表示数组中允许出现任意类型，即 any[]。

### never 类型

never 类型表示那些永不存在的值的类型。特别的，never 可以是永远不返回的函数的返回值类型，也可以是变量在类型收窄中不可能为真的类型，也可以是总是会抛出错误的函数的类型。具有以下特征：
1. 没有类型是 never 的子类型，never类型可以赋值给任何类型，返回 never 的函数可以赋值给需要返回一个具体类型的函数。never类型可作为类型注解；
2. never 是所有类型的子类型，在联合类型中它始终被省略，并且只要函数有其他返回的类型，推导出的函数返回值类型中就会忽略它；
3. 除了never类型，没有类型可以赋值给 never类型；
4. 在一个没有返回值标注的函数表达式或箭头函数中，如果函数没有 return 语句，或者仅有表达式类型为 never 的 retur 语句，并且函数的终止点无法被执行到（按照控制流分析），则推导出的函数返回值类型是 never；
5. 在一个明确指定了 never 返回值类型的函数中，所有 return 语句（如果有）表达式的值必须为 never 类型，且函数不应能执行到终止点。

never 类型同时也是 TypeScript 中的底层类型，自然被分配为never类型包括：
1. 一个从来不会有返回值的函数（如：函数内含有 while(true) {}）；
2. 一个总是会抛出错误的函数（如：function foo() { throw new Error('Not Implemented') }，foo 的返回类型是 never）。

void 表示没有任何类型，never 表示永远不存在的值的类型。当一个函数没有返回值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never 类型。void 类型可以被赋值（在 strictNullChecking 为 false 时），但是除了 never 本身以外，其他任何类型不能赋值给 never。

### 数组（Array）类型
在 TypeScript 中，有多种方式定义数组类型，**最简单的方法是使用「类型 + 方括号」来表示数组**。数组的项中不允许出现其他的类型。数组方法的参数也会根据数组在定义时约定的类型进行限制。**也可以使用数组泛型（Array Generic）即 `Array<elemType>` 来表示数组**。也可以用interface接口来描述数组。然而类数组只能使用接口的方式来描述。

使用接口表示数组：
```typescript
interface NumberArray {
  [index: number]: number;
}

// 类数组
interface ArrayLike<T> {
  readonly [index: number]: T;
  readonly length: number;
}
```

### 函数（Function）类型

函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到。
1. 输入多余的（或者少于要求的）参数，是不被允许的，但支持用 ? 表示可选的参数且可选参数必须接在必需参数后面。在 ES6 中允许给函数的参数添加默认值，TypeScript 会将添加了默认值的参数识别为可选参数且不受「可选参数必须在必需参数后面」的限制。
2. 在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型，而且不能使用重载，而 ES6 中，=> 叫做箭头函数。
3. 在 ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数（rest 参数），事实上，rest是一个数组，所以可以用数组的类型来定义它。
4. 如果有一个含有很多参数或者相同类型参数的函数，那么可能需要考虑将函数改为接收对象的形式，有利于发现错误及代码审查。
5. **在 TypeScript 中，通过重复定义多次函数类型进行重载允许一个函数接受不同数量或类型的参数，作出不同的处理**。TypeScript 中的函数重载没有任何运行时开销，它只允许记录希望调用函数的方式，并且编译器会检查其余代码。注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。最后一个签名要包含前面所有签名的情况，并且它不在重载列表内，即最后一个签名不能被有效调用。
6. 在没有提供函数实现的情况下，有两种声明函数类型的方式，完全相同，区别在于方式（1）才支持函数重载：
    1. 可以使用类型别名或者接口来表示一个可调用的类型注解，type LongHand = { (a: number): number; }; 或 interface LongHand { (a: number): number; }; 这种方式可以在内联注解语法上使用。可实例化是可调用的一种特殊情况，在其中的函数声明前添加new关键字。
    可调用且可实例化：

    ```typescript
    interface CallMeWithNew {
      new (): someType;
    }
    // 或
    type CallMeWithNew {
      new (): someType;
    }
    ```

    2. type ShortHand = (a: number) => number;
7. 对于函数表达式，进行类型定义应该是对赋值目标进行定义。
8. 函数返回类型如果确定为void，内联注解可以删除void，TypeScript 能推导出来。
9. 也可以使用接口interface的方式来定义一个函数需要符合的形状。

使用接口定义函数：

```typescript
interface IFunc {
  (param1: string, param2: string): boolean;
}
```

### 字符串/数字/布尔字面量类型

字符串字面量可以作为类型，约束只能是该字符串字面量。字符串字面量类型用来约束取值只能是某几个字符串中的一个（type StringLiteralType = ‘string1’ | ‘string2’ | ‘string3’），通过关键字type和联合类型符号“|”进行定义。注意，类型别名与字符串字面量类型都是使用 type 进行定义。

TypeScript 同样也提供 boolean 和 number 的字面量类型。

使用 keyof typeof 操作一个普通对象obj，可以返回obj的属性构成的字符串字面量联合类型。

### 对象字面量类型

为了能让检查对象字面量类型更容易，TypeScript 提供 「Freshness」 的概念（它也被称为更严格的对象字面量检查）用来确保对象字面量在结构上类型兼容。结构类型在赋值时，可以允许接受未知属性，然而在对象字面量上只能指定已知属性即更严格的对象字面量类型：

```typescript
const person1 = { name: 'matt', job: 'being awesome' };
let person2 = {
  name: string;
} = person1; // ok，因为非对象字面量赋值可以有未知属性

person2 = { name: 'matt', job: 'being awesome' }; // Error，因为对象字面量只能指定已知属性，'job' 属性不存在 person2 的类型中 
```

使用比较多的场景是与具有可选成员的接口一起使用，如果严格的对象字面量检查，当输入的对象中属性名错误时，并不会发出错误警告。

之所以只对**对象字面量**进行更严格类型检查，因为在使用对象字面量时，保证属性不被拼写错误或属性不冗余。

但是，可以通过包含索引签名[propName: string]: valueType的方式明确表明可以使用额外的属性。

React的this.setState通常是使用对象字面量进行调用，它是Freshness的很好的用例。

### 接口（interface）

在 TypeScript 中，使用接口即interface来定义对象的类型。TypeScript 中的接口可用于对类的一部分行为进行抽象，也常用于对「对象的形状（Shape）」进行描述。
1. 接口一般首字母大写。
2. 接口对运行时的影响为 0。
3. 接口相比接口形式的内联类型注解，是开放式的即可扩展的（利用接口声明合并，扩展接口成员）。
4. 赋值的时候，变量的形状必须和接口保持一致，但可以使用可选属性，其含义是该属性可以不存在，但仍然不允许添加未定义的属性。
5. 使用 [propName: string]: valueType 可以定义任意属性，其他确定属性和可选属性的值类型都必须是类型valueType的子集。一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在该任意属性中使用联合类型。如果同时存在任意属性、可选属性，那么任意属性的数据类型要带undefined，除非valueType是any。
6. 可以用 **readonly** 前缀定义只读属性（包括索引签名）。注意，只读的约束存在于第一次给对象赋值后，而不是第一次给只读属性赋值后。
    1. 也可以在type里使用 readonly；
    2. 比如React中的声明文件已经标记Props和State的属性为 readonly（通过传入泛型参数至一个内部包装，来把每个属性标记为 readonly）。
    3. 可以使用 TypeScript 提供的 `ReadonlyArray<T>` 接口，以不变的方式使用原生 JavaScript 数组。
    4. 编译器能把一些特定的属性推断为 readonly，比如class 中一个只含有 getter 但是没有 setter 的属性能被推断为只读。
    5. **与 const 的区别**：const用于变量且变量不能重新赋值为其他任何值。readonly用于属性，readonly 能确保本身不能修改属性，但是由于类型兼容性的原因，当把这个属性交给其他并没有这种保证的使用者后能被修改。

#### interface vs type?

interface 的几乎所有功能都在type 中可用，主要区别在于类型创建后无法更改，而接口始终可扩展。接口只能用于声明对象的形状，而不是重命名基本类型/联合类型/交叉类型。类型别名不得参与 在声明合并中，但接口可以。命名联合类型的类型别名无法被实现/扩展。

![](../../public/front-end/typescript/1.png)


## 类

TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。类的相关概念：
1. 类(Class)：定义了一件事物的抽象特点，包含它的属性和方法。
2. 对象（Object）：类的实例，通过 new 生成。
3. **面向对象（OOP）的三大特性：封装、继承、多态**。
    1. 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据。
    2. 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性。继承可以描述类与类之间的关系。子类重写父类的成员时类型需要和父类匹配。
    3. 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行eat。
4. 存取器（getter & setter）：用以改变属性的读取和赋值行为。
5. 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法。
6. 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现。
7. 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。**接口可以被类实现（implements）**，希望在类中使用必须要被遵循的接口（类）或别人定义的对象结构时使用，implements关键字限制了类实例的结构。一个类只能继承自另一个类，但是可以实现多个接口。

ES6 中，使用 class 定义类，使用 constructor 定义构造函数。通过 new 生成新实例的时候，会自动调用构造函数。使用 extends 关键字实现继承，子类中使用 super 关键字来调用父类的构造函数和方法。使用 getter 和 setter 可以改变属性的赋值和读取行为。使用 static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用。

ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 中可以直接在类里面定义。ES7 提案中，可以使用 static 定义一个静态属性。

在 TypeScript 中，可以使用三种访问修饰符（Access Modifiers），分别是 public、private 和 protected：
1. public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的。
2. private 修饰的属性或方法是私有的，不能在声明它的类的外部访问，即实例中无法访问，在子类中也无法访问。需要注意的是，TypeScript 编译之后的代码中，并没有限制 private 属性在外部的可访问性。**当构造函数修饰为 private 时，该类不允许被继承或实例化**。
3. protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的，即子类实例中也无法访问。protected修饰构造函数时，该类只允许继承。
4. readonly指定一个类的属性为只读，然后在声明时或者构造函数中进行初始化。
5. 修饰符 public、修饰符 private 和修饰符 protected 以及 readonly，还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁。只读属性关键字readonly，只允许出现在属性声明或索引签名或构造函数中。注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面：

```typescript
class Animal {
  // public readonly name: string
  public constructor(public readonly name) {
    // this.name = name;
  }
}
```

abstract 用于定义抽象类和其中的抽象方法。首先，抽象类是不允许被实例化的，否则会编译抛出错误。其次，抽象类中的抽象方法必须被子类实现，否则也会编译抛出错误。需要注意的是，即使TypeScript 的编译结果中，仍然会存在这个抽象类，但这个抽象类中没有抽象方法。

类名可以作为类型注解（:TypeAnnotation），因为它既处于类型声明空间，也位于变量声明空间。然而，使用var/let/const 声明新变量赋值为已有类名，只是复制该类到变量声明空间，新变量不能再作为类型注解使用。正确的方式是使用 import 关键字，import NewClassName = ClassName。

TypeScript（和 JavaScript）类只能严格的单继承。混合（mixins）是以基类作为输入和一个继承该基类的派生类作为输出的函数，实现多重继承：

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;
    activate() {
      this.isActivated = true;
    }
    deactivate() {
      this.isActivated = false;
    }
  };
}
```

### UML 类图

**统一建模语言(Unified Modeling Language，UML)**是一种为面向对象系统的产品进行说明、可视化和编制文档的的一种标准语言，UML是面向对象设计的建模工具，独立于任何具体程序设计语言。

类图表示类、接口和它们之间的协作关系。类的属性、操作中的可见性使用+、#、－分别表示 public、protected、private。static 静态属性和方法添加下划线表示。类之间的关系有：
1. 关联（即A是B的属性，实线非心箭头指向A，线上可添加n:m表示数量对应关系），可细化为：
    1. 聚合：整体A包含部分B，部分可以脱离整体而单独存在；空心菱形开始实线非心箭头指向B。
    2. 组合：整体A包含部分B，部分不可以脱离整体；实心菱形开始实线非心箭头指向B。
    3. 依赖：不是属性关系，而是函数参数B或返回值B。虚线非心箭头指向B。
2. 泛化（即继承）：实线空闲箭头指向父类。
3. 实现（即实现接口）：虚线空心箭头指向接口。

UML类图中，单个类分为三个区域（类名、属性、方法）。对于接口，需要在类名前添加`<<Interface>>`，而且接口属性和方法放在同一区域。

## 声明文件

### 关于声明文件

通常会把声明语句放到一个单独的文件（声明文件必需以 .d.ts 为后缀）中，这就是声明文件，也就是环境声明。当使用第三方库时需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。TypeScript会解析项目中所有的 *.ts 文件，当然也包含以 .d.ts 结尾的文件，前提根据tsconfig.json 中的 files、include 和 exclude 配置确保包含声明文件。通常是通过使用 @types 统一管理第三方库的声明文件。声明语句用于编译时的检查，在编译结果中会被删除。声明文件的类型可以直接使用而不需要手动导入。

### 书写声明文件

库的使用场景主要有：
1. **全局变量：通过 `<script>` 标签或npm安装引入第三方库，注入全局变量**。使用全局变量的声明文件时，如果是以 npm install @types/xxx --save-dev 安装的，则不需要任何配置。如果是将声明文件直接存放于当前项目中，则建议和其他源码一起放到 src 目录下（或者对应的源码目录下）。需要注意的是，声明语句中只能定义类型，切勿在声明语句中定义具体的实现。声明语句用于编译时的检查，在编译结果中会被删除。全局变量的声明文件主要语法有：
    1. declare var/let/const 声明全局变量，其中declare var与declare let没什么区别，而declare const 声明定义的全局变量是常量，通常全局变量都是禁止修改的常量，因此大部分情况使用的是declare const。
    2. declare function 声明全局方法/函数的类型。在函数类型的声明语句中，支持函数重载。
    3. declare class 声明全局类的类型。
    4. declare enum 声明全局枚举类型，也称作外部枚举（Ambient Enums）。
    5. declare namespace 声明（含有子属性的）全局对象。namespace 是TypeScript早期时为了解决模块化而创造的关键字，中文称为命名空间。由于历史遗留原因，在早期还没有 ES6 的时候，TypeScript提供了一种模块化方案，使用 module 关键字表示内部模块。但由于后来 ES6 也使用了 module 关键字，TypeScript 为了兼容 ES6，使用 namespace 替代了原来的 module，更名为命名空间。随着 ES6 的广泛应用，不建议再使用TypeScript中的 namespace模块化方案，而推荐使用 ES6 的模块化方案了。namespace 模块化方案被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。注意，在 declare namespace 内部，直接使用 function来声明函数，而不是使用 declare function。类似的，也直接使用 const, class, enum 等语句。如果对象拥有深层的层级，则需要用嵌套的 namespace 而不是declare namespace来声明深层的属性的类型。假如 declare namespace声明的全局对象下仅有一个属性prop，则可以不需要嵌套 namespace，而是直接 declare namespace globalObject.prop 内部去声明prop的子属性。
    6. interface 和 type 声明全局类型。暴露在声明文件中最外层的 interface 或 type 会作为全局类型作用于整个项目中，应该尽可能的减少这种全局变量或全局类型的数量，而最好将它们放到declare namespace 下，而在使用时需要加上declare namespace声明的全局对象前缀。
2. **npm 包：通过 import foo from 'foo' 导入，符合 ES6 模块规范**。在尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在。一般来说，npm 包的声明文件可能存在于两个地方：
    1. 与该 npm 包绑定在一起。判断依据是 package.json 中有 types 字段，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的。
    2. 发布到 @types 里。只需要尝试安装一下对应的 @types 包就知道是否存在该声明文件，安装命令是 `npm install @types/[some] --save-dev`。这种模式一般是由于 npm 包的维护者没有提供声明文件，所以只能由其他人将声明文件发布到 @types 里了。@types 支持全局和模块类型定义。@types支持全局和模块类型定义，全局即默认情况下，TypeScript 会自动包含支持全局使用的任何声明定义；模块指可以像import导入模块那样被使用。全局类型定义可通过编译选项 ’compilerOptions’: { ‘types’: [] } 进行配置，只允许使用types对应的 @types 包，即使安装其他声明文件，其他声明文件的全局变量也不会泄漏到项目代码中，直到将它们添加到types选项里。
    
    假如以上两种方式都没有找到对应的声明文件，那么就需要自己为它写声明文件了。由于是通过 import 语句导入的模块，所以声明文件存放的位置也有所约束，一般有两种方案：
    1. 创建一个 `node_modules/@types/[some]/index.d.ts` 文件，存放对应模块的声明文件。这种方式不需要额外的配置，但是 node_modules 目录不稳定，代码也没有被保存到仓库中，无法回溯版本，有不小心被删除的风险，故不太建议用这种方案，一般只用作临时测试。
    2. 创建一个 types 目录，专门用来管理自己写的声明文件，将对应模块的声明文件放到 `types/[some]/index.d.ts` 中。这种方式需要配置下 tsconfig.json 中的 paths 和 baseUrl 字段。如此配置后，通过 import 导入对应模块的时候，也会去 types 目录下寻找对应的模块的声明文件了。
    
    注意 module 配置可以有很多种选项，不同的选项会影响模块的导入导出模式。最常用的是 commonjs。不管采用了以上两种方式中的哪一种，都强烈建议将书写好的声明文件（通过给第三方库发 pull request，或者直接提交到 @types 里）发布到开源社区中。
    
    npm 包的声明文件主要有以下几种语法： 
    1. **export 导出变量**。export 的语法与普通的 ts 中的语法类似，区别仅在于声明文件中禁止定义具体的实现。也可以使用 declare 先声明多个变量，最后再用 export 一次性导出，注意，与全局变量的声明文件类似，interface 前是不需要 declare 的。npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明。
    2. **export namespace 导出（含有子属性的）对象**。与 declare namespace 类似，export namespace 用来导出一个拥有子属性的对象。
    3. **export default ES6 默认导出**。 在 ES6 模块系统中，使用 export default 可以导出一个默认值，使用方可以用 import some from 'some' 而不是 import { some } from 'some' 来导入这个默认值。在类型声明文件中，export default 用来导出默认值的类型。注意，只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来再默认导出。默认导出一般会将导出语句放在整个声明文件的最前面。
    4. **export = commonjs 导出模块**。在 commonjs 规范中，用module.export 或export.some = some方式来导出一个模块。在 ts 中，针对这种模块导出，有多种方式可以导入，第一种方式是 const ... = require。第二种方式是 import ... from，注意针对整体导出module.export，需要使用 import * as 来导入。第三种方式是 import ... require，这也是 ts 官方推荐的方式。对于这种使用 commonjs 规范的库，假如要为它写类型声明文件的话，就需要使用到 **export =** 语法。使用了export =就不能再使用export 单个导出。export = 不仅可以用在声明文件中，也可以用在普通的 ts 文件中。实际上，import ... require 和 export = 都是 ts 为了兼容 AMD 规范和 commonjs 规范而创立的新语法。虽然由于很多第三方库是 commonjs 规范的，但相比与 export =，我们更推荐使用 ES6 标准的 export default 和 export。
3. **UMD 库：既可以通过 `<script>` 标签引入，又可以通过 import 导入**。相比于 npm 包的类型声明文件，我们需要额外声明一个全局变量，ts 提供了一个新语法 export as namespace实现这种方式。一般使用 export as namespace 时，都是先有了 npm 包的声明文件，再基于它添加一条 export as namespace 语句，即可将声明好的一个变量声明为全局变量。export as namespace也可以与 export default 一起使用。
4. **直接扩展全局变量：通过 `<script>` 标签引入后，改变一个全局变量的结构**。有的第三方库扩展了一个全局变量，可是此全局变量的类型却没有相应的更新过来，就会导致 ts 编译错误，此时就需要利用声明合并扩展全局变量的类型。
5. **在 npm 包或 UMD 库中扩展全局变量：引用 npm 包或 UMD 库后，改变一个全局变量的结构**。对于一个 npm 包或者 UMD 库的声明文件，只有 export 导出的类型声明才能被导入。所以对于 npm 包或 UMD 库，如果导入此库之后会扩展全局变量，则需要使用 declare global语法在声明文件中扩展全局变量的类型。注意即使模块声明文件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个全局变量的声明文件。
6. **模块插件：通过 `<script>` 或 import 导入后，改变另一个模块的结构**。有时通过 import 导入一个模块插件，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，而插件模块没有类型声明文件，就会导致类型不完整，缺少插件部分的类型。TypeScript提供declare module语法用来在模块插件的类型声明文件对原有模块的类型进行扩展。declare module 也可用于在一个文件中一次性声明多个模块的类型。

一个声明文件有时会依赖另一个声明文件中的类型。除了可以在声明文件中通过 import 导入另一个声明文件中的类型之外，还可以使用**三斜线指令（`/// <reference  type=''或path=''/>`）**来导入另一个声明文件。三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的三斜线指令来声明普通模块之间的依赖关系了，而在声明文件中有用武之地。类似于声明文件中的 import，它可以用来导入另一个声明文件。与 import 的区别是，当且仅当在以下几个场景下才需要使用三斜线指令替代 import，在其他的一些不是必要使用三斜线指令的情况下，就都需要使用 import 来导入：
1. 当书写一个全局变量的声明文件时；在全局变量的声明文件中，是不允许出现 import, export 关键字的，否则会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了。
2. 当需要依赖一个全局变量的声明文件时。由于全局变量不支持通过 import 导入，当然也就必须使用三斜线指令来引入。

注意，三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释。当全局变量的声明文件太大时，可以通过拆分为多个文件，然后在一个入口文件中将它们一一引入，来提高代码的可维护性。types 和 path 是三斜线指令中两种不同的指令。它们的区别是：types 用于声明对另一个库的依赖，而 path 用于声明对另一个文件的依赖。

**自动生成声明文件：如果库的源码本身就是由 ts 写的，那么在使用 tsc 脚本将 ts 编译为 js 的时候，在tsconfig.json中添加 declaration 选项为true，就可以自动生成 .d.ts 声明文件到lib**。使用 tsc 自动生成声明文件时，每个 ts 文件都会对应一个 .d.ts 声明文件。这样的好处是，使用方不仅可以在使用 import some from 'some' 导入默认的模块some时获得类型提示，还可以在使用 import other from 'some/lib/other' 导入一个子模块other时，也获得对应的类型提示。除了 declaration 选项之外的与自动生成声明文件有关的选项有：
1. declarationDir 设置生成 .d.ts 文件的目录；
2. declarationMap 对每个 .d.ts 文件，都生成对应的 .d.ts.map（sourcemap）文件；
3. emitDeclarationOnly 仅生成 .d.ts 文件，不生成 .js 文件。

### 发布声明文件

发布声明文件有两种方案：
1. 将声明文件和源码放在一起。如果声明文件是通过 tsc 自动生成的，那么无需做任何其他配置，只需要把编译好的文件也发布到 npm 上，使用方就可以获取到类型提示了。如果是手动写的声明文件，那么按以下优先级满足其中一个条件才能被正确的识别（有的库为了支持导入子模块，就需要额外再编写一个类型声明文件）：
    1. 给 package.json 中的 types 或 typings 字段指定一个类型声明文件地址；
    2. 在项目根目录下，编写一个 index.d.ts 文件；
    3. 针对入口文件（package.json 中的 main 字段指定的入口文件），编写一个同名不同后缀的 .d.ts 文件；
2. 将声明文件发布到 @types 下。与普通的 npm 模块不同，@types 是统一由 DefinitelyTyped 管理的。要将声明文件发布到 @types 下，就需要给 DefinitelyTyped 创建一个 pull-request，其中包含了类型声明文件，测试代码，以及 tsconfig.json 等。pull-request 需要符合它们的规范，并且通过测试，才能被合并，稍后就会被自动发布到 @types 下。

优先选择第一种方案。保持声明文件与源码在一起，使用时就不需要额外增加单独的声明文件库的依赖了，而且也能保证声明文件的版本与源码的版本保持一致。仅当在给别人的仓库添加类型声明文件，但原作者不愿意合并 pull request 时，才需要使用第二种方案，将声明文件发布到 @types 下。

## 内置对象

JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型。 

内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。ECMAScript 标准提供的内置对象有：Boolean、Error、Date、RegExp 等；DOM 和 BOM 提供的内置对象有：Document、HTMLElement、Event、NodeList 等。这些对象的定义文件在 TypeScript 核心库的定义文件中。

TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。注意，TypeScript 核心库的定义中不包含 Node.js 部分。Node.js 不是内置对象的一部分，如果想用 TypeScript 写 Node.js，则需要引入第三方声明文件@types/node。

## 类型兼容性

类型兼容性用于确定一个类型是否能赋值给其他类型。比如，string 类型与 number 类型不兼容。
1. 安全性：TypeScirpt类型系统设计比较方便，它允许有一些不正确的行为。比如，任何类型都能被赋值给any。类型安全：保证成员始终可用（即只能子类型（范围小的）赋值给父类型（范围大的），函数则是判定具体参数、返回值是否满足此规则）。
2. 结构化：TypeScript 对象是一种结构类型，这意味着只要结构匹配，名称无关紧要，即成员类型是兼容的则它们就是兼容的。允许动态创建对象，并且如果它能被推断，该对象仍然具有安全性，比如类型推论时，对象中额外属性是允许的。
3. 变体：对一个简单类型 Base 和 Child 来说，如果 Child 是 Base 的子类，Child 的实例能被赋值给 Base 类型的变量。这是多态性。在由 Base 和 Child 组合的复杂类型的类型兼容性中，它取决于相同场景下的 Base 与 Child 的变体：
    1. 协变（Covariant）：只在同一个方向；
    2. 逆变（Contravariant）：只在相反的方向；
    3. 双向协变（Bivariant）：包括同一个方向和不同方向；
    4. 不变（Invariant）：如果类型不完全相同，则它们是不兼容的。

**我们在协变与逆变中约定**：
1. **A ≼ B** 意味着 A 是 B 的子类型。子类型通常是可传递的。
2. **A → B** 指的是以 A 为参数类型，以 B 为返回值类型的函数类型。假设 f 是一个以 Dog → Dog 为参数的函数即f : (Dog → Dog) → String。Dog -> Dog安全的子类型可以是 Animal -> Greyhound。首先，f 可能会以任何狗的品种来作为参数调用，而所有的狗都是动物。其次，它可能会假设结果是一条狗，而所有的灰狗都是狗。即(Animal → Greyhound) ≼ (Dog → Dog)。返回值类型，灰狗是狗的子类型。但参数类型则是相反的：动物是狗的父类！允许一个函数类型中，返回值类型是协变的，而参数类型是逆变的。返回值类型是协变的，意思是 A ≼B 就意味着 (T → A) ≼ (T → B) 。参数类型是逆变的，意思是 A ≼B 就意味着 (B → T) ≼ (A → T) 。在 TypeScript 中，参数类型是双向协变的，即既是协变又是逆变的，而这并不安全。但是现在可以在 TypeScript 2.6+ 版本中通过 --strictFunctionTypes 或 --strict 标记设置为true来修复这个问题。可以允许不变的列表（immutable）在它的参数类型上是协变的，但是对于可变的列表（mutable），其参数类型则必须是不变的（invariant），既不是协变也不是逆变。
3. **x : A** 意味着 x 的类型为 A。

## 类型推论/类型断言/类型保护

### 类型推论

**类型推论**：TypeScript 会在没有明确的指定类型的时候推测出一个类型。如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）（又称类型推断、类型判断）的规则推断出一个类型。如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查。
1. 如果类型不能被赋值推断出来，类型也将不会流入函数参数中。
2. **编译选项 noImplicitAny** 告诉编译器，当无法推断变量的类型或者只能推断为一个隐式的 any 类型时抛出编译错误，通过显式添加 :any 的类型注解或者更正确的类型注解来帮助 TypeScript 推断类型而不是抛出错误。

## 类型断言

**类型断言**（Type Assertion）可以用来手动指定一个值的类型。语法是 **<类型>值** 或 **值 as 类型**，在 tsx 语法中必须使用后一种即**值 as 类型**，因为前者会与 JSX 的语法存在歧义。前者是在需要断言的变量前加上 `<Type>` 即可。类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的。类型断言的常见用途有：
1. **将一个联合类型断言为其中一个类型**。需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误。总之，使用类型断言时一定要格外小心，尽量避免断言后调用方法或引用深层属性，以减少不必要的运行时错误。
2. **将一个父类断言为更加具体的子类**。特别是当某一个类型不是一个真正的类，而只是一个 TypeScript 的接口（interface），接口是一个类型，不是一个真正的值，它在编译结果中会被删除，当然就无法使用 instanceof 来做运行时判断。
3. **将任何一个类型断言为 any**，因为在 any 类型的变量上，访问任何属性都是允许的。需要注意的是，将一个变量断言为 any 可以说是解决 TypeScript 中类型问题的最后一个手段。它极有可能掩盖了真正的类型错误，所以如果不是非常确定，就不要使用 as any，也可以使用类型扩展的方式解决。总之，一方面不能滥用 as any，另一方面也不要完全否定它的作用，我们需要在类型的严格性和开发的便利性之间掌握平衡。
4. **将 any 断言为一个具体的类型**。在日常的开发中，我们不可避免的需要处理 any 类型的变量，可能是由于第三方库未能定义好自己的类型，也有可能是历史遗留的或其他人编写的烂代码，还可能是受到 TypeScript 类型系统的限制而无法精确定义类型的场景。通过类型断言及时的把 any 断言为精确的类型，亡羊补牢，才能使代码向着高可维护性的目标发展，提高代码的可维护性。

**类型断言的限制**：并不是任何一个类型都可以被断言为任何另一个类型。具体来说，要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可（当 A 类型是 B类型的子集，或者 B 类型是 A 类型的子集时，A 能被成功断言成 B）。TypeScript 是结构类型系统，类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。

**双重断言**：通过任何类型都可以被断言为 any和any 可以被断言为任何类型，我们知道，通过双重断言（as any as type）可以打破类型断言的限制，将任何一个类型断言为任何另一个类型。双重断言十有八九是非常错误的，它很可能会导致运行时错误，除非迫不得已，千万别用双重断言。
类型断言vs 类型转换：类型断言只会影响 TypeScript 编译时的类型，类型断言语句在编译结果中会被删除。类型断言不是类型转换，它不会真的影响到变量的类型，因为后者通常意味着某种运行时的支持。若要进行类型转换，需要直接调用类型转换的方法。

**类型断言 vs 类型声明**：类型断言是被认为有害的，即使断言使得更容易的从遗留项目中迁移（甚至将其他代码粘贴复制到项目中），因此应该小心谨慎的使用类型断言而是使用类型声明注解。类型声明是比类型断言更加严格的，最好优先使用类型声明，这也比类型断言的 as 语法更加优雅。类型1断言为类型2，只需要满足类型1兼容类型2或类型2兼容类型1即可；但类型1赋值给类型2，需要满足类型2兼容类型1。

**类型断言 vs 泛型**：通过给返回any类型的函数添加了一个泛型 `<T>`，可以更加规范的实现对改函数返回值的约束，这也同时去除掉了代码中的 any，是最优的一个解决方案。

### 类型保护

**类型保护**允许使用更小范围下的对象类型。对于联合类型的变量，是无法法知道编译时的具体类型的。JavaScript 中常用的方式是检查成员是否存在，但是 TypeScript 中联合类型只有访问联合类型中共同拥有的成员（即辨析联合类型）。而TypeScript 的类型保护机制：一次判断，整个作用域/所有分支有效。类型保护（Type Guards）就是一些表达式，会在运行时检查以确保在某个作用域内的类型：
1. **typeof 类型保护**：用于判断变量是哪种原始类型。typeof 类型保护只有两种形式能被识别（typename 必须为 number、string、boolean 或 symbol 类型，但是 TypeScript 并不会阻止与其他字符串字面量比较而且不会把那些表达式识别为类型保护）：
    1. typeof val === 'typename'；
    2. typeof val !== 'typename'。
2. **instanceof 类型保护**：主要用于判断是否是一个类的实例对象或继承实例对象。instanceof 类型保护是通过构造函数来细化类型，其右侧要求是一个构造函数，TypeScript 将细化为：
    1. 此构造函数的 prototype 属性的类型，如果它的类型不为 any；
    2. 构造签名所返回类型的联合。
3. **in 类型保护**：检查一个对象上是否存在一个属性。
4. **字面量类型保护**：用字面量类型属性来辨析联合结构类型。
5. **自定义类型保护**：typeof 和 instanceof 类型保护能够满足一般场景，对于一些更加特殊的场景（比如区分不同的普通对象时），可以通过创建用户自定义的类型保护函数，即返回值类型为someArgumentName is SomeType 的函数自定义类型保护。编译器通过类型谓词 someArgumentName is SomeType 得知，如果函数返回 true，则someArgumentName就是SomeType类型。

自定义类型保护(利用类型谓词 is)：
```typescript
const isNumber: (value: any) => value is number;
let foo: string | number = 1;
if (isNumber(foo)) {
  foo.toFixed(2);
} else {
  foo.toUpperCase();
}
```

## 联合类型/交叉类型

### 联合类型

**联合类型**（**Union Types**）表示取值可以为多种类型中的一种，使用|分隔每个类型。联合类型是对参与类型对应的值取并集。当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，只能访问此联合类型的所有类型里共有的属性或方法。联合类型与其他类型进行运算时，是分别进行元素的。联合类型的变量在被赋值的时候，会根据类型推论的规则推断出其中一个类型。在 TypeScript 中，具有判别属性的类型联合通常称为辨析联合类型。如果使用类型保护风格的检查（==、===、!=、!==）或者使用具有判断性的属性，TypeScript 将认为使用的对象类型一定是拥有特殊字面量的，并且它会自动把类型范围变小。
1. 在辨析联合类型时，可能需要在判定的情况外添加一个更额外的检查来捕获错误（比如将辨析后收缩的剩余类型（即never）赋值给never类型的变量），如果同时还使用 strictNullChecks 选项，那么应该返回never类型的变量，否则 TypeScript 可能会推断返回值为 undefined。Redux的Action和reducer函数正是使用辨析联合类型的示例，与 TypeScript 一起使用可以有效的防止拼写错误，并且能提高重构和书写文档化代码的能力。

never 进行详细检查：
```typescript
interface Square {
  kind: 'square';
}

interface Rectangle {
  kind: 'rectangle';
}

// 有人仅仅是添加了 'Circle' 类型
interface Circle {
  kind: 'circle'; 
}
type Shape = Square | Rectangle | Circle;

function area(s: Shape) {
  if (s.kind === 'square') {
    return s.size * s.size;
  }
  if (s.kind === 'rectangle') {
    return s.width * s.height;
  }
  const _exhaustiveCheck: never = s; // Error: 'Circle' 不能被赋值给 'never'
}

function area(s: Shape) {
  if (s.kind === 'square') {
    return s.size * s.size;
  }
  if (s.kind === 'rectangle') {
    return s.width * s.height;
  }
  if (s.kind === 'circle') {
    return Math.PI * s.radius ** 2;
  }
  const _exhaustiveCheck: never = s; // ok
}
```


### 交叉类型

**交叉类型**（Intersection Types）是将多个类型叠加合并组成新的类型，是对这些类型对应的值取交集：使用&交叉合并多个非基本类型，新类型包含了所有被合并类型的所有属性；然而对于基本类型之间使用&交叉类型则是取交集 (string & (string | number) = string)。在混入（Mixins）或其他不适合典型面向对象模型的地方存在交叉类型的使用。交叉类型可能出现属性类型冲突，则该属性类型为属性类型的交叉类型（比如，string & number = never），导致组成类型（string或number）均不能赋值给交叉属性类型。此时解决办法时将类型变量断言为any，这样类型变量的属性都是any，赋值就不会报编译错。

## 类型别名/声明合并

### 类型别名

**类型别名**：使用 type 创建类型别名，类型别名用来给一个类型起个新名字，类型别名常用于联合类型。

### 声明合并

**声明合并**：如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型。
1. 函数声明合并: 使用重载定义多个函数类型。
2. 接口声明合并：接口中的属性在合并时会简单的合并到一个接口。被合并的接口中的同一属性的类型必须是相同的。接口中方法的合并，与函数声明合并一样。
3. 类合并：类的合并与接口的合并规则一致。
4. 除此之外，声明文件中的全局变量类型也可以不冲突的合并起来，比如 declare namespace和declare function声明的同名变量。

## 泛型

设计泛型的关键目的是在成员（成员可以是**类的实例成员**、**类的方法**、**函数参数**、**函数返回值**）之间提供有意义的约束。比如约束队列出队类型和入队类型一样，又比如约束反转数组reverse 函数中传入参数类型与函数返回值类型相同。

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
1. 在函数名后添加了 `<T>`，其中 T 用来指代任意输入的类型，在后面参数、返回值以及函数体中即可以使用类型T。调用时可以在函数名后手动指定，或者让类型推论自动推断出来。
2. 仅使用一次的泛型并不比一个类型断言来的安全。`declare function some<T>(name: string): T` 中泛型 T 只在函数返回值中使用，它相当于类型断言 `declare function some(name: string): any; some('something') as TypeOfParamsSomething;` 比如，一个用于加载 json 返回值函数，它返回任何传入类型的Promise。

```typescript
const getJson = <T>(config: {
  url: string; 
  headers?: {
    [key: string]: string;
  } 
}): Promise<T> => {
  const fetchConfig = {
    method: 'GET',
    Accept: 'application/json',
    'Content-type': 'application/json',
    ...(config.headers || {})
  };
  return fetch(config.url, fetchConfig).then<T>((rsp) => rsp.json());
}
```

3. 定义泛型的时候，可以一次定义多个类型参数 `<T, K, U>`。如果在参数里不止一个泛型，则应该使用一个更语义化名称，如 TKey 和 TValue （通常情况下，以 T 作为泛型的前缀，在其他语言如 C++ 里，也被称为模板）。
4. 在函数内部使用泛型变量（被赋予泛型类型的变量）的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法。此时，可以对泛型进行约束，只允许该函数传入那些包含对应属性的变量，即泛型约束。比如T extends SomeType，SomeType是包含属性的类型。而且如果调用该函数传入的对应参数不包含对应属性，那么在编译阶段就会报错。多个泛型类型参数之间也可以互相约束 `<T extends U, U>`，即要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。
5. 泛型接口：可以使用含有泛型的接口来定义函数的形状，注意，在使用泛型接口的时候做类型注解时，需要确定定义泛型的类型。
6. 泛型类：与泛型接口类似，泛型也可以用于类的类型定义中。

TypeScript 2.3+ 可以为泛型中的类型参数指定默认类型（`<T = SomeType>`）。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

### 配合 axios 使用

通常情况下会把后端返回数据格式单独放入一个接口 interface 里：

```typescript
interface ResponseData<T = any> {
  /**
   * 状态码
   * @type { number }
   */
  code: number;

  /**
   * 数据
   * @type { T }
   */
  result: T;

  /**
   * 消息
   * @type { string }
   */
  message: string;
}

function getUser<T>() {
  return axios.get<ResponseData<T>>('/some-path')
    .then((res) => res.data)
    .catch(err => console.error(err));
}

interface User {
  name: string;
  age: number;
}

async function test() {
  // user 被推断出为
  // {
  //   code: number,
  //   result: { name: string; age: number },
  //   message: string
  // }
  const user = await getUser<User>();
}
```

### 内置泛型

可选泛型 `Partial<T>` 将类型T所有的属性设置为可选的。它的返回类型表示输入类型的所有子类型。

只读泛型 `Readonly<T>` 将类型T所有的浅属性设置为只读 readonly，也就是说构造出的类型的属性不能被再次赋值。

键值泛型 `Record<K, T>` 构造一个类型，其属性名的类型为 K，属性值的类型为 T。可用来将某个类型K的属性映射到另一个类型T上。

挑选属性泛型 `Pick<T, K>` 从类型 T 中挑选部分属性 K 来构造类型。

剔除属性泛型 `Exclude<T, U>` 从类型 T 中剔除所有可以赋值给 U 的属性来构造新类型。

提取属性泛型 `Extract<T, U>` 从类型 T 中提取所有可以赋值给 U 的类型来构造新类型。

`Omit<T, K>` 通过从 T 中选取所有属性然后删除传入的属性 K 来构造新类型。

剔除空属性泛型 `NonNullable<T>` 从类型 T 中剔除 null 和 undefined来构造新类型。

返回值类型泛型 `ReturnType<T>` 由函数类型 T 的返回值类型构造一个类型。

实例泛型 `InstanceType<T>` 由构造函数类型 T 的实例类型构造一个类型。

必须泛型 `Required<T>` 构造一个类型，使类型 T 的所有属性为必须 required。

`Parameters<T>` 构造一个关于函数类型 T 的参数类型的元组类型。

`ConstructorParameters<T>` 提取构造函数类型的所有参数类型，它会生成构造函数所具有的所有参数类型的元组类型（如果 T 不是函数，则不返回）。

`ThisType<T>` 通过 ThisType 可以在对象字面量中键入 this，并提供通过上下文类型控制 this 类型的便捷方式。它只有在--noImplicitThis 的选项为true才有效。在对象字面量方法中的 this 类型，将由以下决定：
1. 如果这个方法显式指定了 this 参数，那么 this 具有该参数的类型。
2. 否则，如果方法由带 this 参数的签名进行上下文键入，那么 this 具有该参数的类型。
3. 否则，如果 --noImplicitThis 选项已经启用，并且对象字面量中包含由 `ThisType<T>` 键入的上下文类型，那么 this 的类型为 T。
4. 否则，如果 --noImplicitThis 选项已经启用，并且对象字面量中不包含由 `ThisType<T>` 键入的上下文类型，那么 this 的类型为该上下文类型。
5. 否则，如果 --noImplicitThis 选项已经启用，this 具有该对象字面量的类型。
6. 否则，this 的类型为 any。

通过 API 转换参数的形式来生成 this 的值的情景下，可以通过创建一个新的 `ThisType<T>` 标记接口，可用于在上下文中表明转换后的类型。尤其是当字面量中的上下文类型为 `ThisType<T>` 或者是包含   `ThisType<T>` 的交集时，显得尤为有效，对象字面量方法中 this 的类型即为 T。`ThisType<T>` 的接口，在 lib.d.ts 只是被声明为空的接口，除了可以在对象字面量上下文中可以被识别以外，该接口的作用等同于任意空接口。

## 索引类型/映射类型

### 索引类型

**索引类型**（**Index Types**）的使用让编译器能够检查使用了动态属性名的类型。
1. **索引类型的查询操作符为 `keyof T`**。对于任何类型查询操作符 `keyof T`，假设 T 是一个类型，那么 `keyof T` 产生的类型是 T 的属性名称字符串字面量类型构成的联合类型。和直接使用联合类型的区别在于，可以动态的根据类型T的改变自动改变。索引类型的查询操作符 keyof T：
```typescript
interface Person {
  name: string;
  age: number;
  address: string;
}
type PersonKeyUnion = keyof T; // name | age | address;
```
2. **索引访问操作符 `T[K]`**，表示类型T 的属性 K 的类型。可以在普通的上下文中使用 `T[K]`，只要确保类型变量 `K extends keyof T`。
3. **索引签名**：TypeScript 的索引签名必须是 string 或者 number，此外 Symbol 也是有效的。索引签名的名称（如：`{ [key: string]: SomeType}` 里的 key）除了可读性外，并没有任何意义。声明一个索引签名时，所有明确的成员都必须符合索引签名。索引签名[key in UnionType]可以通过映射类型来使索引字符串k为联合类型 UnionType 中的一员。number类型的索引也支持：`{ [index: number]: SomeType }`。对于对象类型的索引签名，JavaScript 会隐式调用 toString 方法，而在 TypeScript需要显式调用toString，否则会抛出错误。**尽量不要把字符串索引签名与确定属性名称混合使用，因为如果属性名称中有拼写错误将不会被捕获到，应该将索引签名在一个确定属性名称里嵌套**。嵌套索引签名：
    ```typescript
    interface NestedCSS {
      color?: string;
      nest?: {
        [selector: string]: NestedCSS;
      };
    }
    ```
    1. 如果类型 T 带有字符串索引签名，那么 keyof T 为 string | number 类型。因为可以同时拥有string 和 number 类型的索引签名。
    2. 如果类型 T 带有数字索引签名，那么 keyof T 为 number 类型。
    3. 如果类型 T 带有索引签名，那么 T[K] 为索引签名的类型。

### 映射类型

```typescript
// 将原有类型所有属性转为可选的
type Partial<T> = {
  [P in keyOf T]: T[P];
}
// 将原有类型所有属性转为只读的
type Readonly<T> = {
  readonly [P in keyOf T]: T[P];
}
// 从原来类型中选取部分属性形成新类型
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
// 新类型是 K 为属性，T 类型为值得类型
type Recode<K extends string, T> = {
  [P in K]: T;
}
```

**映射类型**（**Mapped Types**）可以基于旧类型创建新类型。比如将现有类型转换为可选的或将现有类型转换为只读的，其实现中[P in keyof T]类型变量 P会把字符串字面量联合类型keyof T 的每个字符串都映射为属性。Readonly，Partial 和 Pick 是同态的，即属性列表是 keyof T 且结果类型是 T[P] 的变体，因为这类转换是同态的，映射只作用于 T 的属性而没有其他的。编译器知道在添加任何新属性之前可以拷贝所有存在的属性修饰符，但 Record是非同态的，因为 Record 并不需要输入类型来拷贝属性，非同态类型本质上会创建新的属性，因此它们不会从它处拷贝属性修饰符。

由映射类型进行推断，即拆包（注意这个拆包推断只适用于同态的映射类型。如果映射类型不是同态的，那么需要给拆包函数一个明确的类型参数）：

```typescript
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get()
  }
  return result;
}
let originalProps = unproxify(proxyProps);
```

## 条件类型/This 类型

### 条件类型

**条件类型**（**Conditional Types**）用于表达非均匀类型映射（non-uniform type mapping），能够根据类型兼容关系（即条件）从两个类型中选出一个。T extends U ? X : Y语义类似于三目运算符，若 T 是 U 的子类型，则为 X 类型，否则就是 Y 类型。另外，还有一种情况是条件的真假无法确定（无法确定 T 是不是 U 的子类型），此时为 X | Y 类型。另外，如果 T 或 U 含有类型变量，就要等到类型变量都有对应的具体类型后才能得出条件类型的结果。

可分配条件类型（distributive conditional type）中被检查的类型是个裸类型参数（naked type parameter）。其特殊之处在于满足分配律，即(A | B | C) extends U ? X : Y等价于(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)。此外，在 T extends U ? X : Y 中，X 中出现的 T 都具有 U 类型约束。

在条件类型的 extends 子句中，可以通过 infer 声明引入一个将被推断的类型变量。

TypeScript 内置的常用的条件类型有：

```typeScript
// 从 T 中去掉属于 U 的子类型的部分
type Exclude<T, U> = T extends U ? never : T;
// 从 T 中筛选出属于 U 的子类型的部分
type Extract<T, U> = T extends U ? T : never;
// 取出函数类型的返回类型：如果存在重载，就取最后一个签名（按照惯例，最后一个通常是宽泛的）进行推断
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
// 取出构造函数类型的实例类型
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
```

## This 类型

**This 类型**（**This Types**）表示所属类或接口的子类型（称之为有界多态性 F-bounded polymorphism）。具体地，TypeScript 中的 This 类型分为两类：
1. 类/接口（的成员方法）中的 this 类型；JavaScript运行时 this 指向当前类实例或其子类实例，即this 的类型并不是固定的，取决于其调用上下文。而this 类型表现为所属类/接口的子类型，即this 类型就是 this 值的类型，其实现原理，就是把类/接口看作是具有隐式类型参数 this 的泛型，并加上其所在类/接口相关的类型约束。具体地，this 类型在实现上相当于 `A<this extends A<A>>`，类中 this 值的类型就是泛型参数 this。除了当前类/接口的上下文，this 的类型就是 `A<this: A>`，类型兼容性等与泛型一致。所以，this 类型就像一个带有类派生关系约束的隐式类型参数。
2. 普通函数中的 this 类型。不同于类或接口中的 this 类型通常隐式发挥作用，函数中的 this 类型大都通过现式声明来约束函数体中 this 值的类型。把 this 显式地作为函数的（第一个）参数，从而限定其类型，像普通参数一样进行类型检查。特殊地，匿名函数（lambda）的 this 无法手动限定其类型。

**This 类型的应用场景**：
1. 流式接口：this 类型让流式接口（fluent interface）变得很容易描述。所谓的流式接口（设计层面），可以简单理解为链式调用（实现层面）。简言之，流式接口是 OOP 中的一种 API 设计方式，通过链式方法调用让源码具有可读性。
2. 描述this的类型：普通函数中的 this 类型允许我们像描述普通参数一样限定 this 的类型，尤其是会调用函数场景。
3. 追踪上下文类型：有了 this 类型，bind、call、apply 等场景也能正确维持类型约束，要求当前函数 this 与传入的目标对象类型一致，让其中的错误暴露出来（需要开启 strictBindCallApply 选项）。

## 从 JavaScript 迁移

所有的 JavaScript 代码都是有效的 TypeScript 代码。这意味着，如果让 TypeScript 编译器编译 TypeScript 里的 JavaScript 代码，编译后的结果将会与原始的 JavaScript 代码一模一样。也就是说，把文件扩展名从 .js 改成 .ts 将不会造成任何负面的影响。一般来说，将 JavaScript 代码迁移至 TypeScript 包括以下步骤：
1. 添加一个 tsconfig.json 文件；
2. 把文件扩展名从 .js 改成 .ts，开始使用 any 来减少错误；使用any来减少错误是危险的，但是它允许将注意力转移到新 TypeScript 代码错误上，因为此时的重点是在逐步更新旧代码库的同时，用 TypeScript 编写新代码。当进行下一步前，最好要留下 // TODO 的注释。
3. 开始在 TypeScript 中写代码，尽可能的减少 any 的使用；
4. 回到旧代码，开始添加类型注解，并修复已识别的错误；
5. 为第三方 JavaScript 代码定义环境声明。可以创建一个针对于特定库的声明文件（.d.ts）或去DefinitelyTyped 仓库中寻找是否有对应的声明文件。

在 TypeScript 中，甚至可以允许导入任何文件（.css/.html），只需要在 global.d.ts 中declare `module '*.css'` 或 `declare module '*.html'`。

## 异常处理和错误提示

内置错误类型包括Error类和以下继承自Error类的：
1. RangeError：当数字类型变量或者参数超出其有效范围时，出现 RangeError 的错误提示。
2. ReferenceError：当引用无效时，会出现 ReferenceError 的错误提示。
3. SyntaxError：当解析无效 JavaScript 代码时，会出现 SyntaxError 的错误提示。
4. TypeError：变量或者参数不是有效类型时，会出现 TypeError 的错误提示。
5. URIError：当传入无效参数至 encodeURI() 和 decodeURI() 时，会出现 URIError 的错误提示。

除非想要使用非常通用（try/catch）的方式处理错误，否则不要抛出错误。抛出错误时使用内置错误类型能自动跟踪堆栈的属性构建以及生成位置。相比之下，原始字符串会导致极差的调试体验，并且在分析日志时，将会变得错综复杂。

TypeScript 错误信息提示分为两类：简洁和详细。简洁的错误信息包括编译器描述的错误号以及对应基本信息。详细的错误信息是为了指导使用者知道为什么一些错误会发生。IDE 通常会在详细的错误提示之后显示简洁版本。常见错误代码：
1. TS2304：Cannot find name “”；可能在使用第三方的库，但是并没有 declare 的声明。需要明确的声明使用的任何变量。
2. TS2307：Cannot find module “”；可能把第三方的库作为模块使用，但没有对应的环境声明文件。
3. TS1148：Cannot compile modules unless the '--module' flag provided；
4. 捕获不能有类型注解的简短变量：比如try...catch中的e，需要在catch块内对e使用类型保护。
5. 接口 ElementClass 不能同时扩展类型别名 Component 和 Component：当在编译上下文中同时含有两个 react.d.ts（@types/react/index.d.ts）会发生。	
    1. 删除 node_modules 和任何 package-lock（或者 yarn lock），然后再一次 npm install；
    2. 如果这不能工作，查找无效的模块（所使用的所有用到了 react.d.ts 模块应该作为 peerDependency 而不是作为 dependency 使用），并且把这个报告给相关模块。

## JSX

**JSX的规则**：
1. 只能返回一个根元素：多个 JSX 标签必须要用一个父元素或者 Fragment 来包裹，因为JSX 虽然看起来很像 HTML，但在底层其实被转化为了 JavaScript 对象，不能在一个函数中返回多个对象，除非用一个数组把他们包装起来。
2. JSX 要求标签必须正确闭合。
3. 使用驼峰式命名法给大部分属性命名：JSX 最终会被转化为 JavaScript，而 JSX 中的属性也会变成 JavaScript 对象中的键值对。在组件中，经常会遇到需要用变量的方式读取这些属性。但 JavaScript 对变量的命名有限制。例如，变量名称不能包含 - 符号或者像 class 这样的保留字。但是，由于历史原因，aria-* 和 data-* 属性应该以带 - 符号的 HTML 格式书写。

TypeScript 支持 JSX 转换和代码分析。JSX允许用户在 JavaScript 中书写类似于 HTML 的视图，因此可以：
1. 使用相同代码，既能检查JavaScript，同时能检查 HTML 视图层部分。
2. 让视图层了解运行时的上下文（加强传统 MVC 中的控制器与视图连接）。
3. 复用 JavaScript 设计模式维护 HTML 部分，例如用Array.prototype.map 创建新元素。

这能够减少错误的可能性，并且能增加用户界面的可维护性。JSX 的主要消费者是React。使用TypeScript开始开发 React 的应用的重点：
1. 使用文件后缀 .tsx（替代 .ts）；
2. 在 tsconfig.json 配置文件的 compilerOptions 里设置选项 "jsx": "react"；
3. 在项目里为 JSX 和 React 安装声明文件：npm i -D @types/react @types/react-dom；
4. 导入 react 到.tsx 文件（import * as React from 'react'）。

React 不但能渲染 HTML 标签（首字母小写，原理是`React.createElement('div')`）也能渲染 React 组件（首字母大写，原理是 `React.createElement(MyComponent)`）。
1. HTML 标签的类型是 `JSX.IntrinsicElements.div`。
2. 函数式组件类型是 `React.FunctionComponent`。
3. 类组件类型是 `React.Component<Props,State>`。
4. 组件实例的类型是 `React.ReactElement<T>` 。
5. 可渲染内容的类型是类型 `React.ReactNode`。
6. 对于泛型组件，组件内部定义 `<T>` 时，需要在泛型参数里使用 extends 即 `<T extends SomeType>` 来提示编译器，这是个泛型。

```typescript
// 一个泛型组件
type SelectProps<T> = { items: T[] };
class Select<T> extends React.Component<SelectProps<T>, any> {}

// 使用
const Form = () => <Select<string> items={['a', 'b']} />;
```

7. ref的类型应该使用 ref 和 null 的联合类型。

TypeScript 使得能够以类型安全的方式，在 React 中使用 JSX 之外的其他东西。可自定义的点如下（适用于高级 UI 框架的作者）：
1. 可以使用 "jsx":"preserve" 选项来禁用 React 的样式触发。这意味着，JSX 将按原样被触发，然后可以使用自定义转化器来转化 JSX 部分。
2. 使用 JSX 全局模块：
    1. 可以通过定制 JSX.IntrinsicElements 的接口成员来控制哪些 HTML 标签是可用的，以及如何对其进行类型检查；
    2. 当在组件中使用时：
        1. 可以通过自定义默认的 `interface ElementClass extends React.Component<any, any> { }` 声明文件来控制哪个 class 必须由组件继承；
        2. 可以通过自定义 declare module JSX { interface ElementAttributesProperty { props: {} } } 声明文件来控制使用的哪个属性（property）来检查特性（attribute）（默认是 props）。
3. 通过 `--jsxFactory <JSX factory Name>` 与 `--jsx react`，能不同于默认 React 的方式使用 JSX 工厂函数（默认工厂函数名称是createElement）。


## TypeScript 编译原理

TypeScript 编译器源文件位于 src/compiler 目录下，关键部分包括：
1. **Scanner 扫描器**（scanner.ts）：SourceCode（源码）转化为Token流；解析器根据需要使用 initializeState 函数准备该扫描器。为避免重复创建扫描器造成的开销，parser.ts 中创建单例扫描器。调用 scan 后，扫描器更新其局部状态（扫描位置，当前 token 详情等）。扫描器提供工具函数获取当前扫描器状态，scanner.getStartPos()获取即将扫描的token的开始位置。即便 TypeScript 解析器有单例扫描器，仍可以使用ts.createScanner 创建独立的扫描器，然后用 setText/setTextPos 随意扫描文件的不同位置。
2. **Parser 解析器**（parser.ts）：控制扫描器将源码转化为Token 流，再转化为AST（抽象语法树）；Node节点是抽象语法树（AST） 的基本构造块。语法上，通常 Node 表示非末端（non-terminals）节点。但是，有些末端节点，如：标识符和字面量也会保留在树中。AST 节点文档由两个关键部分构成，一是节点的 SyntaxKind 常量枚举（const enum），用于标识 AST 中的类型；二是其接口，即实例化 AST 时节点提供的 API。工具函数 ts.forEachChild，可以用来访问 AST 任一节点的所有子节点。interface Node 的关键成员：
    1. TextRange 标识该节点在源文件中的起止位置。
    2. parent?: Node 当前节点（在 AST 中）的父节点。
    3. 标志（flags）和修饰符（modifiers）。

    ```typescript
    // 常量枚举
    // 但编译时需要使用 --preserveConstEnums 编译标志，以便枚举在运行时仍可用。
    export const enum SyntaxKind {
      Unknown,
      EndOfFileToken,
      SingleLineCommentTrivia,
      // ... 更多
    }
    
    // 将枚举成员转化为可读的字符串
    export function syntaxKindToName(kind: ts.SyntaxKind) {
      return (<any>ts).SyntaxKind[kind];
    }
    
    // 访问 AST 任一节点的所有子节点
    // 该函数不会为所有子节点调用 visitNode（例如：SyntaxKind.SemicolonToken）。
    export function forEachChild<T>(
      node: Node, 
      cbNode: (node: Node) => T, 
      cbNodeArray?: (nodes: Node[]) => T
    ): T {
      if (!node) {
        return;
      }
      switch (node.kind) {
        case SyntaxKind.BinaryExpression:
            return visitNode(cbNode, (<BinaryExpression>node).left) ||
                visitNode(cbNode, (<BinaryExpression>node).operatorToken) ||
                visitNode(cbNode, (<BinaryExpression>node).right);
        case SyntaxKind.IfStatement:
            return visitNode(cbNode, (<IfStatement>node).expression) ||
                visitNode(cbNode, (<IfStatement>node).thenStatement) ||
                visitNode(cbNode, (<IfStatement>node).elseStatement);

        // .... 更多
    }

    // 获得某 AST 节点的所有子节点
    function printAllChildren(node: ts.Node, depth = 0) {
      console.log(
        new Array(depth + 1).join('----'), 
        ts.syntaxKindToName(node.kind), 
        node.pos, 
        node.end
      );
      depth += 1;
      node.getChildren().forEach(c => printAllChildren(c, depth));
    }
    ```

    解析器实现原理是单例模式（其原因类似扫描器，如果能重新初始化就不重新构建）。实际实现成 namespace Parser，包含解析器的各种状态变量和单例扫描器（const scanner）。该扫描器由解析器函数管理。解析器由程序间接驱动，简化的调用栈：

    ```typescript
    程序 ->
      CompilerHost.getSourceFile ->
        (全局函数 parser.ts).createSourceFile ->
          Parser.parseSourceFile
    ```

    parseSourceFile 不仅准备好解析器的状态，还调用 initializeState 准备好扫描器的状态。然后使用 parseSourceFileWorker 继续解析源代码。

    parseSourceFileWorker函数先创建一个 SourceFile AST 节点，然后从 parseStatements 函数开始解析源代码。一旦返回结果，就用额外信息（例如 nodeCount, identifierCount等） 完善 SourceFile 节点。parseStatements根据扫描器返回的当前 token 来切换（调用相应的 parseXXX 函数），例如：如果当前 token 是一个 SemicolonToken（分号标记），就会调用 parseEmptyStatement 为空语句创建一个 AST 节点。

    解析器有一系列 parseXXX 函数用来创建相应类型为XXX的节点，通常在相应类型的节点出现时被（其他解析器函数）调用。该过程的典型示例是解析空语句（例如 ;;;;;;）时要用的 parseEmptyStatement() 函数，其中包括 3 个关键函数 createNode, parseExpected 和 finishNode：
    1. createNode：解析器函数 function createNode(kind: SyntaxKind, pos?: number): Node 负责创建节点，设置传入的 SyntaxKind（语法类别），和初始位置（默认使用当前扫描器状态提供的位置信息）。
    2. parseExpected：解析器的 parseExpected 函数 function parseExpected(kind: SyntaxKind, diagnosticMessage?: DiagnosticMessage): boolean 会检查解析器状态中的当前 token 是否与指定的 SyntaxKind 匹配。如果不匹配，则会向传入的 diagnosticMessage（诊断消息）报告，未传入则创建某种通用形式 xxx expected。该函数内部用 parseErrorAtPosition 函数（使用扫描位置）提供良好的错误报告。
    3. finishNode：解析器的 finishNode 函数 `function finishNode<T extends Node>(node: T, end?: number): T` 设置节点的 end 位置，并添加一些有用的信息，例如上下文标志（parserContextFlags）以及解析该节点前出现的错误（如果有错的话，就不能在增量解析中重用此 AST 节点）。
3. **Binder 绑定器**（binder.ts）：AST转化为Symbols（符号）；大多数的 JavaScript 转译器（transpiler）相比TypeScript 几乎没提供代码分析的方法，缺失TypeScript 的语义系统。为了协助（检查器执行）类型检查，绑定器将源码的各部分连接成一个相关的类型系统，供检查器使用。绑定器的主要职责是创建符号（Symbols）。符号将 AST 中的声明节点与相同实体的其他声明相连。符号是绑定的结果，是 TypeScript 语义系统的主要构造块。符号的构造器定义在 core.ts（绑定器实际上通过 objectAllocator.getSymbolConstructor 来获取构造器）。SymbolFlags 符号标志是个标志枚举，用于识别额外的符号类别（例如：变量作用域标志 FunctionScopedVariable 或 BlockScopedVariable 等。实际上，绑定器被检查器在内部调用，而检查器又被程序调用。简化的调用栈如下：
    
    ```typescript
    program.getTypeChecker ->
      ts.createTypeChecker（检查器中）->
        initializeTypeChecker（检查器中） ->
            for each SourceFile `ts.bindSourceFile`（绑定器中）
            // followed by
            for each SourceFile `ts.mergeSymbolTable`（检查器中）
    ```
    bindSourceFile 和 mergeSymbolTable 是两个关键的绑定器函数：
    1. bindSourceFile：主要是检查 file.locals 是否定义，如果没有则交给（本地函数） bind 来处理。注意：locals 定义在节点上，其类型为 SymbolTable。SourceFile 也是一个节点（事实上是 AST 中的根节点）。TypeScript 编译器大量使用本地函数。本地函数很可能使用来自父函数的变量（通过闭包捕获）。
    2. bind 是 bindSourceFile 中的一个本地函数，它或它调用的函数会设置 symbolCount 和 classifiableNames 等状态，然后将其存在返回的 SourceFile 中。bind 能处理任一节点（不只是 SourceFile），它做的第一件事是分配 node.parent（如果 parent 变量已设置，绑定器在 bindChildren 函数的处理中仍会再次设置），然后交给 bindWorker。最后调用 bindChildren进行递归绑定（该函数简单地将绑定器的状态（如：parent）存入函数本地变量中，接着在每个子节点上调用 bind，然后再将状态转存回绑定器中）。
    3. bindWorker函数依据 node.kind（SyntaxKind类型）进行切换，并将工作委托给合适的 bindXXX 函数（通用的模式和工具函数，也定义在binder.ts中）。例如：如果该节点是 SourceFile 则（最终且仅当节点是外部文件模块时）调用 bindAnonymousDeclaration。常用的有 createSymbol 函数，它简单地更新 symbolCount（一个 bindSourceFile 的本地变量），并使用指定的参数创建符号。
    
    addDeclarationToSymbol函数用于绑定 SourceFile 节点到源文件符号（外部模块的情况下）。创建一个从 AST 节点到符号的链接（node.symbol），并将节点添加为该符号的一个声明（interface Declaration）。
    
    AST 的节点可以被当作容器。这决定了节点及相关符号的 SymbolTables 的类别。容器是个抽象概念（没有相关的数据结构），由ContainerFlags 枚举等决定。函数 getContainerFlags（位于 binder.ts） 驱动此标志，该函数只在绑定器函数 bindChildren 中调用，会根据 getContainerFlags 的运行结果将节点设为 container 和（或） blockScopedContainer。
    
    符号表（SymbolTable）是 Map 实现的，符号表通过绑定进行初始化。编译器中实用的符号表，节点上是locals?: SymbolTable；符号上是members?: SymbolTable和exports?: SymbolTable。符号表使用符号来填充，主要是通过调用declareSymbol( symbolTable: SymbolTable, parent: Symbol, node: Declaration, includes: SymbolFlags, excludes: SymbolFlags ): Symbol来进行。
    
    **绑定器中的绑定错误**被添加到源文件的 bindDiagnostics 列表中。
4. **Checker 检查器**（checker.ts）：利用AST +符号进行类型验证；符号和 AST 是检查器用来验证源代码语义的。检查器是由程序（program）初始化。检查器是整个编译器中最大的部分。检查器的相关调用栈如下：

    ```typescript
    program.getTypeChecker ->
      ts.createTypeChecker（检查器中）->
        initializeTypeChecker（检查器中） ->
            for each SourceFile `ts.bindSourceFile`（绑定器中）
            // 接着
            for each SourceFile `ts.mergeSymbolTable`（检查器中）
    ```

    真正的类型检查会在调用getDiagnostics时才发生。该函数被调用时（比如由 Program.emit 请求），检查器返回一个EmitResolver（由程序调用检查器的 getEmitResolver 函数得到），EmitResolver 是 createTypeChecker 的一个本地函数的集合。

    ```typescript
    program.emit ->
      emitWorker (program local) ->
        createTypeChecker.getEmitResolver ->
            // 第一次调用下面的几个 createTypeChecker 的本地函数
            call getDiagnostics ->
                getDiagnosticsWorker ->
                    checkSourceFile

            // 接着
            return resolver
            // 通过对本地函数 createResolver() 的调用，resolver 已在 createTypeChecker 中初始化。
    ```

    全局命名空间合并由initializeTypeChecker 中初始化全局符号表，基本上是将所有的 global 符号合并到 let globals: SymbolTable = {} 符号表中（位于 createTypeChecker 中）。 mergeSymbolTable 主要调用 mergeSymbol 函数。
    检查器使用本地的 error 函数报告错误：

    ```typescript
    function error(location: Node, message: DiagnosticMessage, arg0?: any, arg1?: any, arg2?: any): void {
      let diagnostic = location
        ? createDiagnosticForNode(location, message, arg0, arg1, arg2)
        : createCompilerDiagnostic(message, arg0, arg1, arg2);
      diagnostics.add(diagnostic);
    }
    ```

5. **Emitter 发射器**（emitter.ts）：检查器 + AST输出JavaScript代码。程序Program 提供emit 函数，它主要将功能委托给 emitter.ts中的 function emitFiles(resolver: EmitResolver, host: EmitHost, targetSourceFile?: SourceFile): EmitResult 函数。emitWorker给发射器提供一个 EmitResolver。 EmitResolver 由程序的 TypeChecker 提供，是来自 createChecker 的本地函数的子集。emitJavaScript函数主要设置了一批本地变量和函数（这些函数构成 emitter.ts 的大部分内容），接着交给本地函数 emitSourceFile 发射文本，其中initializeEmitterWithSourceMaps函数是emitJavaScript 的本地函数，initalizeEmitterWithSourceMap 的底部覆盖了部分已定义的本地函数，意味着大部分的发射器代码不关心 SourceMap，它们以相同的方式使用这些（带或不带 SourceMap 的）本地函数。emitSourceFile 函数设置 currentSourceFile 然后交给本地函数 emit 去处理。emit函数处理注释和实际 JavaScript 的发射。实际 JavaScript 的发射是 emitJavaScriptWorker 函数的工作。emitJavaScriptWorker通过简单地调用相应的 emitXXX 函数来完成递归。发射器相关调用栈：

    ```typescript
    Program.emit ->
      `emitWorker` （在 program.ts 中的 createProgram） ->
        `emitFiles` （emitter.ts 中的函数）
          emitFile(jsFilePath, targetSourceFile) ->
            emitJavaScript(jsFilePath, targetSourceFile);
    ```
    另一个发射器declarationEmitter.ts用于为 TypeScript 源文件（.ts） 创建声明文件（.d.ts）。
6. **core.ts** ：TypeScript 编译器使用的核心工具集。let objectAllocator: ObjectAllocator 是一个定义为全局单例的变量。提供以下定义：
    1. getNodeConstructor；
    2. getSymbolConstructor；
    3. getTypeConstructor；
    4. getSignatureConstructor（签名是索引，调用和构造签名）。
7. **types.ts**：包含整个编译器中使用的关键数据结构和接口，关键部分有:
    1. SyntaxKind AST 节点类型通过 SyntaxKind 枚举进行识别；
    2. TypeChecker 类型检查器提供此接口；
    3. CompilerHost 用于程序（Program）和系统之间的交互；
    4. Node AST 节点。
8. **system.ts**：可以将其视为操作环境（OE, Operating Environment）；TypeScript 编译器与操作系统的所有交互均通过 System 接口进行。接口及其实现（WScript 和 Node）均定义在system.ts中。
9. **program.ts**：编译上下文在 TypeScript 编译器中被视为一个 Program，它包含 SourceFile 和编译选项。CompilerHost 是与操作环境（OE, Operating Enviornment）进行交互的机制。用 CompilerHost 作中间层的原因是可以让接口对 Program 的需求进行细粒度的调整，而无需考虑操作环境的需求。程序的getSourceFiles API（getSourceFiles(): SourceFile[]）用于获取SourceFile 。得到的每个元素均是一棵抽象语法树的根节点（称做 SourceFile）。
10. **AST杂项**（**Trivia**）：杂项是指源文本中对正常理解代码不太重要的部分，例如：空白，注释，冲突标记。为了保持轻量，杂项不会存储在 AST 中。
    1. 通常，token拥有它后面同一行到下一个token之前的所有杂项；该行之后的注释都与下个的token相关。
    2. 对于文件中的前导（leading）和结束（ending）注释：源文件中的第一个 token 拥有所有开始的杂项；而文件最后的一些列杂项则附加到文件结束符上，该 token 长度为 0。
    
    节点存在 "token start" 和 "full start" 位置，Token Start即文件中一个 token 的文本开始的位置。Full Start是指扫描器从上一个重要 token 之后开始扫描的位置，要注意，full start 甚至会包含前一节点拥有的杂项。AST 节点有 getStart 和 getFullStart API 用于获取以上两种位置。节点的注释通过以下函数获取：
    1. ts.getLeadingCommentRanges：给定源文本及其位置，返回给定位置后第一个换行符到 token 本身之间的注释范围（可能需要结合 ts.Node.getFullStart 使用）。
    2. ts.getTrailingCommentRanges	给定源文本及其位置，返回给定位置后第一个换行符之前的注释范围（可能需要结合 ts.Node.getEnd 使用）。