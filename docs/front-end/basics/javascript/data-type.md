# 数据类型

数据类型分为基本数据类型（原始值）和引用数据类型。

### 基本数据类型

**基本类型**：存储在栈中的简单数据段。值直接存储在变量访问的位置（栈空间），因为原始值占据的空间是固定的，所以可存储在较小的内存区域 – 栈中，便于迅速查寻变量的值。**变量赋值时**，将原始值的副本赋值给新变量，两个变量完全独立，只是拥有相同的 value。

JavaScript 中存在 7 种基本数据类型（原始值）：boolean、bigInt（ES10）、null、undefined、number、string、symbol （ ES6——表示独一无二的值），其中undefined、 null  和 number **字面量**是没有属性和方法的（直接调用方法1.toString()会失败，通过let a = 1;a.toString()却可以成功），或者字符串字面量可以直接调用方法（**隐式创建包装器对象**）。

### 引用数据类型

**引用类型**：存储在堆（heap）中。存储在变量处的值是一个指针（point），指向存储堆中对象的内存地址。因为引用值（堆中对象）的大小会改变，放在栈中会降低变量查寻的速度。相反，放在变量的栈空间中的值是该对象存储在堆空间中对应的地址。地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响。**变量赋值时**，把存储在栈空间的内存地址赋值给新变量，即两个变量都**指向堆内存中的同一个对象**，任何一个**变量的属性**作出的改变都会反映在另一个身上。**复制不会产生新的堆内存消耗**。
除基本类型外都是对象类型（Object）—引用类型，包括Object（父对象）、Array（数组对象）、RegExp（正则对象）、Date（日期对象）、Math（数学函数）、Function（函数对象）、Error（错误对象）、Arguments（类数组对象）、自定义对象等.

### 类型检测与转换

**类型检测**的方法有，typeof、instanceof、Object.prototype.toString、constructor。

**typeof 运算符**返回一个字符串，表示操作数的类型。基本数据类型除null返回object，都正确，引用类型除函数对象返回Function,其余均返回Object。因为在 JavaScript 最初的实现中，在 JavaScript 第一个版本中，所有值都存储在 32 位的单元中，每个单元包含一个小的类型标签(1-3 bits) 以及当前要存储值的真实数据。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，typeof null 也因此返回 "object"。对于声明未初始化和未声明的变量，typeof都会返回undefined，但不能在let或const的暂存性死区内使用，会抛出ReferenceError。适合检测非null的基本数据类型和引用数据类型中的function。typeof 运算符的优先级高于加法（+）等二进制运算符。

![](../../../public/front-end/basics/javascript/53.png)

**instanceof 运算符**用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。instanceof的检测结果不一定正确，构造函数的 prototype 属性对象可能被修改，实例对象的__proto__也可能被修改。多个窗口意味着多个全局环境，不同的全局环境拥有不同的全局对象，从而拥有不同的内置类型构造函数，比如 [] instanceof window.frames[0].Array 会返回false。Symbol.hasInstance用于自定义判断某对象是否为某构造器的实例时应该调用的方法，即使用 instanceof时会调用到该方法。

![](../../../public/front-end/basics/javascript/54.png)

**Object.prototype.toString.call(value)**返回"[object Type]"，Type 是value的类型。如果value有 Symbol.toStringTag 属性，其值是一个字符串，则它的值将被用作 Type。可以通过定义 Symbol.toStringTag 属性来更改 Object.prototype.toString.call() 的行为，因此也会被篡改。

**value.constructor属性**获取value的构造函数的原型对象上的constructor属性，该属性实际上是原型对象的constructor属性，也因此如果原型对象被修改，就不能用来判断类型了。

**实现获取一个值的类型的函数**：

![](../../../public/front-end/basics/javascript/55.png)

**JavaScript中存在的类型转换规则**：
1. **转换为布尔值（ToBoolean）**：除falsy值（false、-0、+0、0n、null、undefined、NaN、""、 ''、 ``）转换为 false，其余均转换为true。
2. **转换为数字（To Number）**：
    1. **基本数据类型**：
        1. null 转换为 0；
        2. 空字符串，以及空格、制表符、换行符的各种组合，转化为0，忽略前导和尾随空格/行终止符的字符串有效纯数字转换为数字，其余按失败处理转化为NaN；+ 和 - 允许且只能出现一次且不得后跟空格在字符串的开头指示其符号。
        3. undefined 转换为 NaN
        4. true 转换为 1，false转换为 0；
        5. BigInt 抛出 TypeError，以防止意外的强制隐式转换损失精度。
        6.Symbol 抛出 TypeError。
    2. **引用数据类型**：先转换为基本数据类型（ToPrimitive），再按基本数据类型处理。
3. **转换为字符串**：
    1. 基本数据类型：
        1. null 转换为 'null'；
        2. undefined转为 "undefined"；
        3. true 转为 "true"，false 转为 "false"；
        4. Number类型转为数字的字符串形式，极小和极大的数字会使用指数形式；
    2. **引用数据类型**：先转换为基本数据类型（ToPrimitive），再按基本数据类型处理。
4. **转换为基本数据类型（ToPrimitive）**：
    1. 首先如果[@@toPrimitive](hint)即Symbol.toPrimitive存在，则调用该方法，该方法必须返回原始值——返回对象会导致 TypeError。
    2. 如果该方法不存在，如果hint为"number"，按先调用valueOf() 再 toString()的顺序。如果hint为"string"，按先调用toString()再valueOf()的顺序。如果前一个返回对象，则忽略其返回值，从而使用后一个的返回值。如果两个方法都不存在或都不返回原始值，则抛出TypeError。注意：Date.prototype[@@toPrimitive] 的hint视为"string"调用 toString() 。Symbol.prototype[@@toPrimitive] 忽略 hint，并总是返回一个 symbol。

**a == 1 && a == 2 如何返回true?**

![](../../../public/front-end/basics/javascript/56.png)

**四则运算中转换规则**：
1. 非加法，将两个操作数均转化为数字，再计算。
2. 加法， a+b 为例，先计算a，再计算b，然后相加。
    1. 如果a 或 b 中有对象，将对象转为原始值，hint为"number"，存在[@@toPrimitive](hint)则先调用，否则再valueOf，再toString()，
    2. 均转为原始值后，如果其中一个是字符串，另一边转换为字符串进行拼接，否则，两边都转换为Number进行自然加法运算，如果无法转换为Number则会报错（比如Symbol）。

**比较运算符类型转换**：
1. 如果是对象，就通过 toPrimitive 转换对象 
2. 如果是字符串，就通过 unicode 字符索引来比较。

### 判断相等

**== （抽象相等运算符）**，进行必要类型转换再比较。**类型转换规则如下**：
1. **类型相同**，对象看是否为同一引用，基本数据类型看值是否相同。
2. **类型不同**：
    1. 其中一个为对象，另一个是基本数据类型，将对象转换为基本类型
    2. 两个均为基本数据类型：
        1. 类型相同，看值是否相同。
        2. 其中一个是null，另一个是undefiend，返回true。
        3. 如果其中一个操作数是 Symbol 而另一个不是，返回 false。
        4. 如果其中一个是布尔值而另一个不是，将布尔值转换为数字。
        5. 其中一个是number，另一个是string，将string转为number。
        6. 其中一个是number，另一个是BigInt，按数值进行比较。如果其中一个数值为 ±∞ 或 NaN，返回 false。
        7. 其中一个是string，另一个是BigInt，将string转为number。

![](../../../public/front-end/basics/javascript/57.png)

**=== （严格相等运算符）判定规则**：
1. 如果操作数的类型不同，则返回 false。
2. 如果两个操作数都是对象，只有当它们指向同一个对象时才返回 true。
3. 如果两个操作数都为 null，或者两个操作数都为 undefined，返回 true。
4. 如果两个操作数有任意一个为 NaN，返回 false。
5. 否则，比较两个操作数的值，数字类型必须拥有相同的数值。+0 和 -0 会被认为是相同的值。字符串类型必须拥有相同顺序的相同字符。布尔运算符必须同时为 true 或同时为 false。由于不进行类型转换因此会更快。

**实现Object.is**（ES6，在严格相等的基础上处理包括+0和-0应该不相等才对，NaN和NaN应该相等才对的特殊情况）：

![](../../../public/front-end/basics/javascript/58.png)

### Number

JavaScript 的 Number 对象是经过封装的能处理数字值的对象。Number 对象由 Number() 构造器（继承自Function）创建。所有 Number 实例都继承自 Number.prototype。在非构造器上下文中 (如：没有 new 操作符)，Number 能被用来执行类型转换。如果参数无法被转换为数字，则返回 NaN。

十进制数值字面量能以 0 开头，但是如果 0 以后的最高位比 8 小，数值将会被认为是八进制而不会报语法错误。对于位数过多的**数值字面量**建议使用科学计数法nem或nEm，即 n * 10m。

JavaScript 的Number类型为**双精度 IEEE 754 64 位浮点类型（符号+指数+尾数）**。JavaScript 能够准确表示的整数范围在[-(2^53 - 1)，2^53 - 1]。在解析序列化的 JSON 时，如果 JSON 解析器将它们强制转换为 Number 类型，那么超出此范围的整数值可能会被破坏。在工作中使用String 类型代替，是一个可行的解决方案。

![](../../../public/front-end/basics/javascript/59.png)

number原始值可以通过**小括号**、**’+’/’-’**、或者 **Number()** 转换成 Number对象。

**Number构造器的属性（其属性特性writable（可重写）、enumerable（可枚举）、configurable（可配置）均为false）与方法**：
1. Number.EPSILON 属性表示 **1** 与 **Number 可表示的大于 1 的最小的浮点数**之间的差值，值接近于 2.2204460492503130808472633361816E-16，或者 2^-52。

![](../../../public/front-end/basics/javascript/60.png)

2. Number.MAX_SAFE_INTEGER（Number.MIN_SAFE_INTEGER ） 常量表示在 JavaScript 中最大（小）的安全整数2^53 - 1 =  9007199254740991 （-(2^53 - 1) = -9007199254740991），安全存储是指能够准确区分两个不相同的值（Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2 为 true）。
3. Number.MAX_VALUE（Number.MIN_VALUE） 属性表示在 JavaScript 里所能表示的最大（小正）值，约为 1.79E+308（5e-324）。大（小）于 MAX_VALUE（MIN_VALUE ） 的值代表 "Infinity"（0）。超过最大正数或最小负数的值会被转化为Infinity或者-Infinity而无法继续参与运算。
4. Number.NEGATIVE_INFINITY （Number.POSITIVE_INFINITY）属性表示负（正）无穷大。Number.NEGATIVE_INFINITY 的值和全局对象的 Infinity 属性的负（正）值相同。使用 isFinite 方法比Number.NEGATIVE_INFINITY 属性来判断值是否有限更好。与数学上的无穷大存在区别：

![](../../../public/front-end/basics/javascript/61.png)

5. **Number.NaN** 表示“非数字”（Not-A-Number），和全局属性 NaN 相同，属于falsy值，且NaN有方法。NaN 及其行为不是 JavaScript 发明的。它在浮点运算中的语义（包括 NaN !== NaN）是由 IEEE 754 指定的。NaN 的行为包括：
    1. 如果 NaN 涉及数学运算（但不涉及位运算），结果通常也是 NaN。
    2. 当 NaN 是任何关系比较（>, <, >=, <=）的操作数之一时，结果总是 false。
    3. NaN 不等于（通过 ==、!=、=== 和 !==）任何其他值——包括与另一个 NaN 值。

    有五种不同类型的操作返回 NaN：
    1. 失败的数字转换。
    2. 计算结果不是实数的数学运算。
    3. 不定式（0 * Infinity、1 ** Infinity、Infinity / Infinity、Infinity - Infinity）。
    4. 一个操作数被强制转换为 NaN 的方法或表达式，NaN具有传染性。
    5. 0 除以 0（正数除以0返回 Infinity，负数除以0返回- Infinity）。
    6. 将无效值表示为数字的其他情况。
    
    判断一个值value是否为 NaN，可以使用isNaN(value) 或Number.isNaN(value) 或value !== value。 isNaN() 和 Number.isNaN() （ES6）之间的区别：isNaN会将非Number类型转换后再判断，后者更可靠，ES6之前使用value !== value更可靠。使用 BigInt 值时 isNaN() 会抛出TypeError错误，而 Number.isNaN() 不会。查找索引的数组方法（indexOf()、lastIndexOf()）不能找到 NaN，而查找值的（includes()）可以。
    
    在 IEEE 754 编码中，任何指数位为 0x7ff 且尾数位非零的浮点数都是 NaN。在 JavaScript 中，可以使用类型化数组来进行位操作。
    
    NaN 被静默转义（相对于被忽略）的唯一情况是使用指数为 0 求幂时，它立即返回 1 而不测试基数的值。

6. Number.isNaN() 方法确定传递的值是否为 NaN，并且检查其类型是否为 Number。
7. Number.isInteger() 方法用来判断给定的参数是否为整数。NaN 和正负 Infinity 不是整数。
8. Number.isFinite() 方法用来检测传入的参数是否是一个有穷数。和全局的 isFinite() 函数相比，这个方法不会强制将一个非数值的参数转换成数值，这就意味着，只有数值类型的值，且是有穷的（finite），才返回 true。
9. Number.isSafeInteger() 方法用来判断传入的参数值是否是一个“安全整数”（safe integer）。安全整数范围为 [-(2^53 - 1) ,  2^53 - 1 ]，3.0和3均是安全整数。一个安全整数是一个符合下面条件的整数：
    1. 可以准确地表示为一个 IEEE-754 双精度数字，
    2. 其 IEEE-754 表示不能是舍入任何其他整数以适应 IEEE-754 表示的结果。
    
    比如，2^53 - 1 是一个安全整数，它能被精确表示，在任何 IEEE-754 舍入模式（rounding mode）下，没有其他整数舍入结果为该整数。作为对比，2^53 就不是一个安全整数，它能够使用 IEEE-754 表示，但是 2^53 + 1 不能使用 IEEE-754 直接表示，在就近舍入（round-to-nearest）和向零舍入中，会被舍入为 2^53。

10. Number.parseFloat() 方法（ES6）可以把一个字符串解析成浮点数，若无法被解析成浮点数，则返回NaN。该方法与全局的 parseFloat() 函数相同。
    1. 如果 parseFloat 在解析过程中遇到了正号（+）、负号（- U+002D HYPHEN-MINUS）、数字（0-9）、小数点（.）、或者科学记数法中的指数（e 或 E）以外的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数。
    2. 第二个小数点的出现也会使解析停止；
    3. 参数首位和末位的空白符会被忽略。
    4. 如果参数字符串的第一个字符不能被解析成为数字，则 parseFloat 返回 NaN；
    5. parseFloat 也可以解析并返回 Infinity。 
    6. parseFloat 解析 BigInt 为 Numbers, 丢失精度。因为末位 n 字符被丢弃。
    7. parseFloat 也可以转换一个已经定义了 toString 或者 valueOf 方法的对象，它返回的值和对 toString 或者 valueOf 方法的返回结果上调用 parseFloat 值相同。
    8. 考虑使用 Number(value) 进行更严谨的解析：只要参数带有无效字符就会被转换为 NaN。
11. Number.parseInt(string[, radix]) 方法依据指定基数，解析字符串并返回一个整数。如果参数不是一个字符串，则将其强制转化为字符串。字符串开头的空白符将会被忽略，若第一个非空白字符不能转换为数字，则返回 NaN。radix是从 2 到 36 的整数，表示进制的基数，如果超出这个范围，将返回 NaN。假如 radix 未指定或者为 0，若数字以 0x 或 0X 开头，则radix为 16，如果输入的 string 以 "0"（0）开头，radix 被假定为 8（八进制）或 10（十进制）。具体选择哪一个 radix 取决于浏览器实现，否则radix为10。ECMAScript 5 规范不再允许 parseInt 函数的实现环境把以 0 字符开始的字符串作为八进制数值，但是直至 2013 年，很多实现环境并没有采取新的规范所规定的做法，而且由于必须兼容旧版的浏览器，所以永远都要明确给出 radix 参数的值。将一个数字转换为特定的 radix 中的字符串字段，请使用 thatNumber.toString(radix) 函数。parseInt不应替代 Math.floor()，因为parseInt是向原点取整。

**number原型方法（直接使用数值字面量点属性访问原型方法会被理解为小数点而抛出语法错误，需要使用两个点或者中括号属性访问）**：
1. Number.prototype.toExponential([fractionDigits]) 方法以指数表示法返回该数值字符串表示形式。用来指定小数点后四舍五入后有fractionDigits位数字，默认情况下用尽可能多的位数来显示数字。对number字面量使用 toExponential() 方法，且该数值没有小数点和指数时，应该在该数值与该方法之间隔开一个空格，以避免点号被解释为一个小数点。也可以使用两个点号调用该方法。
2. Number.prototype.toFixed(digits) 方法使用定点表示法来格式化一个数值，在必要时进行四舍五入，另外在必要时会用 0 来填充小数部分，以便小数部分有指定的位数digits，介于 0 到 20（包括）之间，超过抛出RangeError错误，如果忽略该参数，则默认digits为 0。在一个非number类型的对象或number原始值上调用，会抛出TypeError错误。如果数值大于 1e+21，该方法会简单调用 Number.prototype.toString()并返回一个指数记数法格式的字符串。浮点数不能精确地用二进制表示所有小数，即0.1 + 0.2 === 0.3 返回 false（计算过程中，0.1和0.2转换分别成二进制后变成无限循环小数，同时截掉多标准位数后面的（截取时采取的是二进制舍入，即1入0舍），精度损失导致相加之和二进制转回十进制变成0.30000000000000004，这种不精确可能会发生在小数的存储/运算/显示的情况，**解决方案：parseFloat((0.1 + 0.2).toFixed(10))）**。
    
    银行家舍入法的规则是 “**四舍六入五考虑，五后非零即存在不是零就进一，五后为零看奇偶，五前为偶应舍去，五前为奇要进一**”。由于(2.55).toFixed(1) = 2.5、(3.55).toFixed(1) = 3.5 ，很明显不满足“五前为奇要进一”，toFixed采用的不是银行家舍入法（![参考esma规范](https://262.ecma-international.org/6.0/#sec-number.prototype.tofixed)：如果x < 1021小于，找到n使得(n÷10^(digits)) - this 精确数学值尽可能接近零，如果n存在两个，取较大的n）。

3. Number.prototype.toLocaleString([locales[, options]]) 方法返回这个数字在特定语言环境下的表示字符串。在使用具有 Intl.NumberFormat API 支持的实现时，此方法仅仅简单调用了 Intl.NumberFormat。比如可以将number使用逗号进行千分位分割。
4. Number.prototype.toPrecision(precision) 方法以指定的有效数字个数precision四舍五入返回以定点表示法或指数表示法表示的一个数值对象的字符串表示。如果忽略 precision 参数，则该方法表现类似于 Number.prototype.toString()。如果该参数是一个非整数值，该参数将会向下近似到最接近的整数。如果 precison 参数不在 [1, 100]之间，将会抛出一个 RangeError 。
5. Number.prototype.toString(radix) 方法返回指定 Number 对象的字符串表示形式，覆盖了 Object.prototype.toString()。指定要用于数字到字符串的转换的基数 (从 2 到 36)。如果未指定 radix 参数，则默认值为 10。如果 toString() 的 radix 参数不在 2 到 36 之间，将会抛出一个 RangeError。如果对象是负数，则会保留负号，返回的字符串不是数值的二进制补码，而是包含一个**负号（-）前缀和正数的二进制表示**。进行数字到字符串的转换时，建议用小括号将要转换的目标括起来，防止出错。
6. Number.prototype.valueOf() 方法返回一个被 Number 对象包装的原始值。该方法通常是由 JavaScript 引擎在内部隐式调用的，而不是由用户在代码中显式调用的。

### String

String 全局对象是一个用于字符串或一个字符序列的构造函数，继承自Function。从ES6开始，字符串字面量也可以是模板字面量。除普通字符外，特殊功能的字符通过转义字符可出现在字符串字面量中。和其他语言不同，javascript 的字符串不区分单引号和双引号。 对于长字符串，使用 + 运算符将多个字符串连接起，或者，在每行末尾使用反斜杠字符（“\”）并确保反斜杠后面没有空格或任何除换行符之外的字符或缩进，以指示字符串将在下一行继续。

当字符串字面量需要调用一个字符串对象才有的方法或者查询值的时候（字符串字面量是没有这些方法的），JavaScript 会自动将字符串字面量转化为字符串对象并且调用相应的方法或者执行查询。当使用 eval时，字符串字面量被看作源代码处理; 而字符串对象则被看作对象处理，返回对象。

![](../../../public/front-end/basics/javascript/62.png)

使用 String() 构造器将其它对象转化为字符串比 .toString() 更安全，因为针对 null（undefined），String() 方法也能转换为字符串null（undefined），.toString() 会因为 null或undefined没有属性和方法抛出TypeError错误。

**string 类型是不可变的**，无论调用何种方法，都不会对值有改变。

**String 构造器的静态方法**：
1. String.fromCodePoint(num1[, ...[, numN]]) 静态方法（ES6）返回使用指定的代码点（一串 Unicode 编码位置）序列创建的字符串。如果传入无效的 Unicode 编码，将会抛出一个RangeError。
2. String.raw(callSite, ...substitutions) 是一个模板字符串的标签函数，它的作用类似于 Python 中的字符串前缀 r 和 C# 中的字符串前缀 @。是用来获取一个模板字符串的原始字符串，即结果。如果第一个参数没有传入一个格式正确的对象callSite，则会抛出 TypeError 异常。也能以String.raw`templateString`的方式调用。
3. String.fromCharCode(num1[, ...[, numN]]) 方法返回由指定的 UTF-16 代码单元（范围介于 0 到 65535（0xFFFF）之间，ASCII码在其中）序列创建的字符串。因此可用于将数字转换为ASCII码字符。
4. 字符串的 length 只读属性表示字符串的 UTF-16 代码单元（简称**码元**）数量，不包括转义字符\，其属性特性writable（可重写）、enumerable（可枚举）、configurable（可配置）均为false。由于每个 Unicode 字符可以编码为一个或两个代码单元（表情符号、特殊的汉字等）。语言规范要求字符串的最大长度为 253 - 1 个元素，这是精确整数的上限。但是，具有此长度的字符串需要 16384TB 的存储空间，因此浏览器实现的大多不超过231 - 1（4GB）。如果要统计字符数量，建议先用它的迭代器分割字符串[...str]，再访问[...str].length。而且若尝试修改字符串的length，非严格模式下没有效果，严格模式下会抛出TypeError错误。

**String 原型方法**：
1. `String.prototype[@@iterator]()`方法返回一个新的 Iterator 对象，它遍历字符串的字符。可以通过 for...of... 自动调用`[@@iterator]()`。
2. String.prototype.at(index) 方法接受一个整数值index（允许正整数和负整数。负整数从字符串中的最后一个字符开始倒数，默认值为0），并返回一个新的 String，该字符串由位于指定偏移量处的单个 UTF-16 码元（不一定和字符对应）组成。如果找不到则返回undefined。
3. String.prototype.charAt(index) 方法返回指定index（[0, length-1]，默认值为0）位置的UTF-16 码元。如果找不到则返回空字符串。
4. String.prototype.charCodeAt(index) 方法返回给定索引index（默认为0）位置的UTF-16 代码单元对应的整数。index超过范围则返回NaN。
5. String.prototype.codePointAt(index) 方法返回一个 Unicode 编码点值（码点）的非负整数。如果在索引处开始没有 UTF-16 代理对，将直接返回在那个索引处的编码单元，如果既没有代理对也没有代码单元则返回 undefined。代理对是UTF-16 中用于扩展字符而使用的编码方式，是一种采用四个字节 (两个 UTF-16 编码) 来表示一个字符。
6. String.prototype.concat(str2, [, ...strN]) 方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。concat 方法并不影响原字符串。如果参数不是字符串类型，它们在连接之前将会被转换成字符串。强烈建议使用赋值运算符和 + 代替concat方法。
7. String.prototype.endsWith(searchString[, length]) 方法用来判断当前字符串str是否是以另外一个给定的子字符串searchString 在参数length - 1位置处“结尾”的，对大小写敏感，根据判断结果返回 true 或 false。参数length默认值为 str.length。
8. String.prototype.includes(searchString[, position]) 方法执行区分大小写的搜索，以确定当前字符串str从position位置（默认为0）开始是否包含被搜寻的字符串searchString，并根据情况返回 true 或 false。如果 searchString 是一个正则表达式，抛出TypeError错误。
9. String.prototype.indexOf(searchString[, position])指定子字符串在大于或等于 position 位置（position不传或小于0，则position为0，position大于length - 1则方法返回-1）的第一次出现的索引。找不到则返回-1。如果不带参数调用方法，searchString 将被强制转换为 "undefined"。大小写敏感。
10. String.prototype.lastIndexOf(searchValue[, fromIndex])，待匹配字符串 searchValue 从 str 的第 fromIndex 位开始向左回向查找最后一次出现的位置。fromIndex默认值是 +Infinity。如果 fromIndex >= str.length ，则会搜索整个字符串。如果 fromIndex < 0 ，则等同于 fromIndex == 0。大小写敏感。
11. String.prototype.localeCompare(compareString[, locales[, options]])，返回一个数字表示是否**引用字符串 str**在字典排序中位于**比较字符串compareString** 的前面，后面，或者二者相同。如果引用字符存在于比较字符之前则为负数; 如果引用字符存在于比较字符之后则为正数; 相等的时候返回 0 。
12. String.prototype.match(regexp)，如果传入一个非正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp。如果没有给出任何参数，则返回包含一个空字符串的数组[""] 。如果未找到匹配则为null。如果使用 g 标志，则将返回与完整正则表达式匹配的所有结果，但不会返回捕获组。如果未使用 g 标志，则仅返回一个**数组（Array）**包括**第一个完整匹配及正则所匹配的匿名捕获组**和**以下属性**：
    1. groups: 一个命名捕获组对象，其键是捕获组名称，值是捕获组，如果未定义命名捕获组，则为 undefined。
    2. index: 匹配的结果的开始位置。
    3. input: 搜索的字符串。
13. String.prototype.matchAll(regexp)，方法返回一个包含所有匹配正则表达式regexp的结果及分组捕获组的迭代器。如果所传参数regexp不是一个正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp。RegExp必须是设置了全局模式g的形式，否则会抛出异常TypeError。
14. String.prototype.normalize([form])会按照指定的一种 Unicode 正规形式（四种 Unicode 正规形式 "NFC"、"NFD"、"NFKC"，或 "NFKD" 其中的一个，默认值为 "NFC"，如果给 form 传入了上述四个字符串以外的参数，则会抛出 RangeError 异常）将当前字符串规范化。如果该值不是字符串，则首先将其转换为一个字符串。
15. String.prototype.padStart/padEnd(targetLength[, padString]) 返回在原字符串str开头/末尾填充指定的填充字符串padString直到达到目标长度后形成的新字符串。如果需要，padString可以重复填充，而如果padString太长，则只保留padString的左侧。padString默认值为空格。
16. String.prototype.repeat(count)构造并返回一个指定重复次数count的新字符串。count是介于0 和 +Infinity的整数，重复次数不能为负数且重复次数必须小于 infinity，且长度不会大于浏览器允许的最长的字符串，否则抛出RangeError错误。原字符串不会改变。

![](../../../public/front-end/basics/javascript/63.png)

17. String.prototype.slice(beginIndex[, endIndex])，提取字符串str的一部分，并返回一个新的字符串，且不会改动原字符串。beginIndex默认为0，endIndex默认为strLength；如果beginIndex或endIndex的值为负数，会被当做 strLength + beginIndex或 strLength + endIndex。
18. `String.prototype.split([separator[, limit])`，使用指定的分隔符字符串或正则表达式separator（如果不是字符串或正则表达式，会强制转为字符串）将一个String对象分割成子字符串数组。limit限定返回的分割片段数量。如果省略separator或在 str 中不出现分隔符，则返回的数组仅包含一个由整个字符串组成的元素。如果分隔符为空字符串，则将 str 原字符串中每个字符的数组形式返回，如果字符串和分隔符都是空字符串，则返回一个空数组。
19. String.prototype.startsWith(searchString[, position])方法（ES6）用来判断当前字符串str是否在position（默认为0）的位置开始以给定字符串searchString开头，并根据判断结果返回 true 或 false。
20. String.prototype.substring(indexStart[, indexEnd]) 方法提取从 indexStart （默认为0）到 indexEnd（不包括，默认为length）之间的字符构成的字符串。如果 indexStart 等于 indexEnd，substring 返回一个空字符串。如果任一参数小于 0 或为 NaN，则被当作 0。 如果任一参数大于 str.length，则被当作 str.length。如果 indexStart 大于 indexEnd则调换两个参数。
21. String.prototype.toLocaleLowerCase()/String.prototype.toLocaleUpperCase()方法返回根据任意区域语言大小写映射集而转换成小/大写格式的字符串。参数 locale 指明要转换成小/大写格式的特定语言区域。如果以一个数组 Array 形式给出多个 locales, 最合适的地区将被选出来应用。原始字符串不变。在大多数情况下，和调用 String.prototype.toLowerCase()的结果相同，但是在某些区域环境中（比如土耳其语），大小写映射并不遵循在 Unicode 中的默认的大小写映射，两者结果不同。如果locale是无效的语言标记，会抛出RangeError错误。如果数组 Array 形式中的locale不是字符串形式，会抛出TypeError错误。
22. String.prototype.toLowerCase()/String.prototype.toUpperCase()将调用该方法的字符串转为小/大写形式的新字符串并返回（如果调用该方法的值不是字符串类型会被强制转换）。在 null 或 undefined类型上调用会抛出TypeError错误。
23. String.prototype.trim()/String.prototype.trimStart()/String.prototype.trimEnd() 方法从字符串的两端/首/末尾清除空格（所有的空白字符（空格、tab、不换行空格等）以及所有行终止符字符（如 LF、CR 等）），返回一个新的字符串，而不修改原始字符串。trimLeft/trimRight是方法trimStart/trimEnd的别名。
24. String.prototype.toString()，返回String 包装对象的字符串原始值。覆盖了 Object 对象的 toString() 方法。与String.prototype.valueOf() 方法的返回值相同。
25. String.prototype.valueOf()方法返回String 包装对象的字符串原始值。
26. String.prototype.search(regexp)方法执行正则表达式regexp（如果传入一个非正则表达式对象 regexp，则会使用 new RegExp(regexp) 隐式地将其转换为正则表达式对象。）和 String 对象之间的一个搜索匹配。如果匹配成功，则 search() 返回正则表达式在字符串中首次匹配项的索引;否则，返回 -1。
27. String.prototype.replace(pattern, replacement)方法返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，如果pattern是字符串，则仅替换第一个匹配项。如果pattern是正则表达式，所匹配的内容会被第二个参数的返回值替换掉。替换值可以是一个字符串或者一个每次匹配都要调用的回调函数，如果replacement是字符串，可以使用一些特殊变量名，比如$n表示第n个捕获组匹配的结果。原字符串不会改变。
28. String.prototype.replaceAll(pattern, replacement)方法返回一个新字符串，新字符串所有满足 pattern 的部分都已被replacement 替换。pattern可以是一个字符串或一个 RegExp， replacement可以是一个字符串或一个在每次匹配被调用的函数。 当pattern是 regex 时，必须设置全局（“g”）标志， 否则，它将引发 TypeError错误。原字符串不会改变。

**实现字符串翻转**：

![](../../../public/front-end/basics/javascript/64.png)

#### 零宽字符（隐藏字符）

1. U+200：零宽度空格符，用于较长单词的换行分隔；
2. U+FEFF：零宽度非断空格符，用于阻止特定位置的换行分隔；
3. U+200D : 零宽度连字符，用于阿拉伯文与印度语系等文字中，使不会发生连字的字符间产生连字效果；
4. U+200C : 零宽度断字符，用于阿拉伯文，德文，印度语系等文字中，阻止会发生连字的字符间的连字效果；
5. U+200E : 左至右符，用于在混合文字方向的多种语言文本中(例:混合左至右书写的英语与右至左书写的希伯来语) ，规定排版文字书写方向为左至右；
6. U+200F : 右至左符 用于在混合文字方向的多种语言文本中，规定排版文字书写方向为右至左。

**应用场景**：
1. 文字水印：对于一些对版权要求很严格的网站，将文章访问用户名转换为零宽字符，隐藏在文章内容中，既不影响阅读，也可以标记了用户信息，一旦文章内容泄漏，直接解码中用户名即可了解到信息泄漏的源头。
2. 逃脱关键词匹配：将零宽字符放在关键词中间，即可逃脱部分关键词匹配程序。
3. 隐藏信息传递：以特定排列顺序表示隐藏信息，达到传递信息和加密、解密信息的目的。

#### 模板字面量

模板字面量是用反引号（\`）分隔的字面量，允许多行字符串（`string text line 1
string text line 2`，因为在源码中插入的任何换行符都是模板字面量的一部分）、**带嵌入表达式的字符串插值**（在反引号分隔的模板中，允许在占位符 ${expression} 中使用内层的反引号进行模板字面量的嵌套）和一种叫**带标签的模板**的特殊结构。

**语法**：tagFunction`string text ${expression} string text`，其中string text 将成为模板字面量的一部分的字符串文本，几乎允许所有字符，包括换行符和其他空白字符。但是，除非使用了标签函数，否则无效的转义序列将导致语法错误。expression是可选的要插入当前位置的表达式，其值被转换为字符串（和普通的字符串加法拼接的区别：模板字面量直接将expression表达式强制转换为字符串，而加法则会先将操作数强制转换为原始类型再进行字符串拼接）或传递给可选的tagFunction。tagFunction 如果指定，将使用模板字符串数组（作为第一个参数传递，对于任何模板字面量，其长度等于替换次数（${…} 出现次数）加一，因此总是非空的）和替换expression表达式（分别作为第2 - n个参数传递）调用它，而且，对于任何特定的带标签的模板字面量表达式，无论对字面量求值多少次，都将始终使用完全相同的字面量数组调用标签函数，因此这允许标签函数以其第一个参数作为标识来缓存结果，而且为了进一步确保数组值不变，这个字符串数组参数及其 raw 属性都会被冻结，使得将无法改变它们。标签函数的返回值结果被称为**带标签的模板**，将成为模板字面量的值，标签函数甚至不需要返回字符串！

在标签函数的第一个参数即字符串数组中，存在一个特殊的属性 raw，可以通过它来访问模板字符串的原始字符串（即源码字符串），而无需转义特殊字符。

若要转义模板字面量中的反引号（`），需在反引号之前加一个反斜杠（\）。美元符号 $ 也可以被转义，来阻止插值。

**带标签的模板**允许使用函数解析模板字面量。标签函数的第一个参数包含一个字符串数组，其余的参数与expression表达式相关。可以用标签函数对这些参数执行任何操作，并返回被操作过的字符串（或者，也可返回完全不同的内容）。用作标签的函数名没有限制，不必是普通的标识符，可以使用任何运算符优先级大于 16 的表达式，包括属性访问、函数调用（唯一的例外是标签函数存在可选链，这将抛出语法错误：SyntaxError: Invalid tagged template on optional chain）、new 表达式，甚至其他带标签的模板字面量。对于不带标签的模板字面量，虽然语法从技术上允许作为标签，但由于它是字符串，所以在链式调用时会抛出 TypeError。

另外，使用 String.raw() 方法创建原始字符串和使用默认模板函数和字符串连接创建是一样的。

**模板字面量有时被非正式地叫作模板字符串**，因为它们最常被用作字符串插值（通过替换占位符来创建字符串）。然而，带标签的模板字面量可能不会产生字符串——它可以与自定义标签函数一起使用，来对模板字面量的不同部分执行任何操作。

### Boolean

Boolean 对象是一个布尔值的对象包装器，继承自Function。**基本类型（原始值）中的布尔值 true 和 false 与值为 true 和 false 的 Boolean 对象是不同的**，任何Boolean对象传递给条件语句都是true。

当Boolean()作为构造函数调用时（使用new），它会创建一个Boolean对象，该对象不是原始值，尽量不将其作为构造函数使用来转换值，而是应该直接将 Boolean 当做转换函数即布尔包装器来使用，或者使用双重非（!!）运算符。

当将非标准属性 document.all 用作此构造函数的参数时，结果是值为 false 的布尔对象。此属性是旧的、非标准的属性，不应使用。

当Boolean()作为函数调用时（没有new），即布尔包装器，它会将参数强制转换为布尔原始值。

**原型方法**：
1. Boolean.prototype.toString()：覆盖了Object.prototype.toString()，根据对象的值返回字符串 true 或 false。
2. Boolean.prototype.toString()：覆盖了Object.prototype.valueOf()，返回 Boolean 对象的原始值。

### null

在 JavaScript中，null 是基本类型（原始值），特指对象的值未设置，在布尔运算中被认为是falsy值。

null 是一个字面量，不像 undefined，它不是全局对象的一个属性。null语义上表示非对象但将来是对象，undefined语义上表示非原始值但将来是原始值。

![](../../../public/front-end/basics/javascript/65.png)

### undefined

undefined是全局对象的属性，值为基本类型（原始值）undefined。一个声明未定义的变量的初始值，或没有实际参数的形式参数，以及方法或者是语句中操作的变量没有被赋值，则会返回 undefined。其属性特性writable（可重写）、enumerable（可枚举）、configurable（可配置）均为false。**undefined 不是一个保留字，因此可能被赋值，而 void 表达式可以返回安全的undefined**。

一个变量是否被声明可以通过看它是否在一个封闭的上下文中被声明，比如使用typeof variable === undefined 或 variable === void 0。唯一的例外是全局作用域，但是全局作用域是被绑定在全局对象上的，所以要检查一个变量是否在全局上下文中存在可以通过检查全局对象上是否存在这个属性。

### BigInt

内置对象 BigInt 提供表示大于 (2^53) - 1 的任意大整数，包装器函数 BigInt() 继承自Function。BigInt没有负零（-0n）。定义 BigInt原始值的方式包括：
1. 在一个整数字面量后面加 n，是bigInt原始值。
2. 调用包装器函数BigInt()（BigInt() 不能与 new 运算符一起使用，会抛出TypeError错误）并传递一个整数值或字符串值。

与Number有区别：
1. 不能使用Math对象的方法；
2. 不能与Number混合运算，需要转换为相同类型，且BigInt 在转换成 Number 时可能会丢失精度（因此建议仅在值可能大于 2^53 - 1时使用 BigInt 类型，并且不在两种类型之间进行相互转换）。但是可以使用自增/自减运算符。
3. 由于对 BigInt 的操作不是常数时间的，因而 BigInt 不适合用于密码学。

由于 BigInt 都是有符号的， >>> （无符号右移）不能用于 BigInt。当使用 BigInt 时，带小数的运算会被向下取整。相同的数值的BigInt字面量和Number字面量不严格相等（类型不同）。

对任何 BigInt 值使用 JSON.stringify() 都会引发 TypeError，因为默认情况下 BigInt 值不会在 JSON 中序列化。但是，如果需要，可以利用.toString()在BigInt的prototype上实现 toJSON 方法。

**BigInt包装函数的静态方法**：
1. BigInt.asIntN(width, bigint)方法方法通过将 bigint 模 2^width转换为 -2^(width-1) 与 2^(width-1)-1 之间的的有符号整数。
2. BigInt.asUintN (width, bigint)方法通过将 bigint 模 2^width转换为一个 0 和 2^width-1 之间的的无符号整数。

**BigInt原型方法**：
1. BigInt.prototype.toLocaleString() 方法返回一个具有此 BigInt 在特定语言环境的且不包含"n"的表达形式。
2. BigInt.prototype.toString([radix])方法返回一个表示指定 BigInt 对象的不包含"n"字符串。重写 Object 对象的 toString() 方法。radix可选，是介于 2 到 36 之间的整数，默认为10，指定用于表示数值的基数，如果 radix小于 2 或大于 36, 则抛出 RangeError。如果bigIntObj是负数，则会保留负号，返回的字符串不是数值的二进制补码，而是包含**一个负号（-）前缀**和**正数的二进制表示**。
3. BigInt.prototype.valueOf()返回 BigInt 对象包装的bigInt原始值。

### Symbol

symbol是基本数据类型，Symbol([description])函数会返回唯一的 symbol 类型的值，每次调用Symbol都是创建一个新的symbol值，它不支持"new Symbol()"语法（抛出不是构造函数的 TypeError 错误），其中description是字符串类型，仅仅表示对 symbol 的描述。symbol 值能作为对象的属性的键或值；从ES6开始不支持通过原始数据类型创建一个显式包装器对象（ES6 之前的new Boolean、new String以及new Number除外），包括BigInt和Symbol，只能以symbol值或BigInt值为参数调用Object() 函数来创建。

要创建跨文件可用的 symbol，甚至跨域（每个都有它自己的全局作用域），使用 Symbol.for() 方法和 Symbol.keyFor() 方法从全局的 symbol 注册表设置和取得 symbol，而因为Symbol()创建的不是全局共享的symbol值。

以 symbol 值作为键的属性会被JSON.stringify()、for...in、Object.getOwnPropertyNames(obj)忽略，可以通过Object.getOwnPropertySymbols(obj) 获取给定对象obj自身的所有 Symbol 属性的数组。Symbol 包装器对象Object(sym)作为属性地键时会被强制转换为该symbol 值。

**对symbol值进行类型转换**：
1. 尝试显示或隐式地将symbol 值转换为number 值会抛出 TypeError 错误；
2. Object(sym) == sym 为true；
3. 尝试隐式地将symbol值转换为string值会抛出TypeError错误；
4. 使用String(sym)显示地将symbol值转换为string值和Symbol.prototype.toString()效果相同，返回"Symbol(description)"。

**Symbol函数的静态属性和静态方法**，其属性特性writable（可重写）、enumerable（可枚举）、configurable（可配置）均为false：
1. Symbol.asyncIterator 属性用于指定一个对象的默认异步迭代器，定义该属性后该对象才能成为异步可迭代对象，才能用于for await...of循环，对应于@@asyncIterator符号。目前没有设定该属性的内置对象。
2. Symbol.hasInstance用于判断某对象是否为某构造器的实例。可以用它作为静态方法自定义 instanceof 操作符在某个类上的行为。
3. Symbol.isConcatSpreadable用于配置某对象作为Array.prototype.concat()方法的参数时是否展开其数组元素，对于数组默认为true，而对于类数组默认为false，对应于@@isConcatSpreadable符号。
4. Symbol.iterator 属性用于指定一个对象的默认迭代器，定义该属性后该对象才能成为可迭代对象，才能用于for...of循环，用于展开运算符迭代，对应于@@iterator符号。拥有迭代器的内置类型包括Array.prototype、TypedArray.prototype、String.prototype、Map.prototype、Set.prototype。如果一个迭代器 @@iterator 没有返回一个迭代器对象，那么它就是一个不符合标准的迭代器。这样的迭代器将会在运行期抛出异常。

![](../../../public/front-end/basics/javascript/66.png)

5. Symbol.match 指定是否具有正则表达式的行为，对应于@@match符号。String.prototype.startsWith()，String.prototype.endsWith() 和 String.prototype.includes() 这些方法会检查其第一个参数是否是正则表达式，是正则表达式就抛出一个TypeError。可以通过对参数设置Symbol.match为false（或falsy值），让参数失去正则表达式行为从而避免抛出错误。String.prototype.match() 方法会调用@@match方法。
6. Symbol.matchAll 属性指定返回一个迭代器的方法，该迭代器根据字符串生成正则表达式的匹配项。此方法可以被 String.prototype.matchAll() 方法调用。
7. Symbol.replace 属性指定了当一个字符串替换所匹配字符串时所调用的方法。String.prototype.replace() 方法会调用此方法。
8. Symbol.search 指定了一个搜索方法，这个方法接受用户输入的正则表达式，返回该正则表达式在字符串中匹配到的下标。该方法由 String.prototype.search()来调用。
9. Symbol.species 访问器（get）属性允许子类覆盖对象的默认构造函数，其返回值即为子类的构造函数。比如对于子类MyArray，Array.prototype.map方法返回的是使用子类默认的构造函数创建的实例对象，通过Symbol.species可以重新子类使用的构造函数为Array，如此一来Array.prototype.map返回的就是Array的实例对象。
10. Symbol.split指定在与正则表达式匹配的索引处拆分字符串的方法。该方法由String.prototype.split(reg)调用，即reg如果存在Symbol.split方法则str.split使用该方法处理拆分。
11. Symbol.toPrimitive 属性指定了一种接受首选类型hint并返回对象原始值的方法[@@toPrimitive]()。它被所有的强类型转换制算法优先调用。"number" hint 用于强制数字类型转换算法。"string" hint 用于强制字符串类型转换算法。"default" hint 用于强制原始值转换算法。[@@toPrimitive]() 必须返回一个原始值，否则将抛出 TypeError。
12. Symbol.toStringTag 作为对象的属性键使用，对应的属性值为字符串类型，用来表示该对象的自定义类型标签， Object.prototype.toString() 方法会去读取该标签并把它包含在返回值里（"[object Map]"后面的Map就是类型标签）。许多内置的 JavaScript 类型（String, Number,Array,Boolean,Null,Undefined）即便没有 toStringTag 属性，也能被 toString() 方法识别并返回特定的类型标签。而GeneratorFunction、Map、Set、Promise等等则是设置了Symbol.toStringTag。但自己创建的类如果没有设置get [Symbol.toStringTag] 属性，toString() 找不到 toStringTag 属性时只好返回默认的Object 标签。
13. Symbol.unscopables 用于指定一个对象其自身和继承的属性名称是否被排除在with环境绑定之外。在Symbol.unscopables中设置为true的属性名称在with环境中无法访问，而设置为false的属性可访问。
14. Symbol.for(key) 方法会根据给定的键 key，来从运行时的全局 symbol 注册表（**全局symbol 注册表中的每个记录结构包括 用于标识每个 symbol的字符串`[[key]]`和存储的 symbol 值的`[[symbol]]`**）中找到对应的 symbol，找到则返回，找不到才新建一个与该键key（同时也会作为该 symbol 的描述）关联的symbol，并放入全局 symbol 注册表中，并返回。为了防止冲突，最好给要放入 symbol 注册表中的 symbol 带上键前缀。
15. Symbol.keyFor(sym) 方法用来获取全局 symbol 注册表中与某个 symbol 关联的键。如果全局注册表中查找到该 symbol，则返回该 symbol 的 key 值，返回值为字符串类型。否则返回 undefined。

symbol值的原型（Symbol.prototype）属性与方法：
1. Symbol.prototype[@@toPrimitive](hint)将 Symbol 对象转换为symbol原始值。Symbol.toPrimitive即@@toPrimitive。当对象需要被转换为原始值时，JavaScript 自动地调用该[@@toPrimitive]() 方法将一个对象转换为原始值表示。
2. Symbol.prototype.toString()方法返回当前 symbol 对象的字符串表示（即"Symbol(description)"）。重写 Object 对象的 toString() 方法。
3. Symbol.prototype.valueof()方法返回当前 symbol 对象的symbol原始值（即"Symbol(description)"）。重写 Object 对象的 toString() 方法。

### Object

Object 是 JavaScript 中用于存储各种键值集合和更复杂的实体数据类型，可以通过 Object() 构造函数形式调用（使用new）、非构造函数形式调用（不使用new）、使用对象字面量、Object.create的方式创建。当Object()以非构造函数形式被调用时，Object 的行为等同于 new Object()，Object 构造函数将给定的值包装为一个新对象：
1. 如果给定的值是 null 或 undefined, 它会创建并返回一个空对象。 
2. 如果给定值是其他基本类型原始值，则会构造其包装类型的对象。 
3. 如果给定值是引用类型的值，则会返回这个已经存在的值（相同地址）。

由于object.prototype上没有提供方法删除其自身属性（Map 中的 Map.prototype.delete() 可以删除自身属性），只能使用 delete 操作符。当要修改现有的 Object.prototype上的方法时，应该在已经存在的逻辑之前或者之后有条件的通过添加扩展代码的方式来注入代码，避免原型链污染。

对象的属性的排列顺序规则：key为数字字符串的属性提前并按照升序排列，其余的按照添加顺序排列。

**Object的静态属性与静态方法**：
1. Object.assign(target, ...sources)方法将所有**可枚举（obj.propertyIsEnumerable(prop)返回 true**，可枚举属性是指那些内部“enumerable”标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 true，对于通过 Object.defineProperty 等定义的属性，该标识值默认为 false）的**自有（obj.hasOwnProperty(prop)返回 true**）属性从一个或多个源对象sources **浅复制**到目标对象target（如果传入基本类型，会被Object 包装），返回修改后的对象。如果目标对象target与源对象source具有相同的 key，则目标对象中的属性将被源对象中的属性覆盖，后面的源对象的属性将类似地覆盖前面的源对象的属性。Object.assign() 不会在 source 对象值为 null 或 undefined 时抛出错误。如果复制期间出错，例如如果属性不可写，则会抛出 TypeError，也就只会部分修改 target 对象。

![](../../../public/front-end/basics/javascript/67.png)

2. Object.create(proto[, propertiesObject])方法用于创建一个新对象，使用现有的对象proto来作为新创建对象的原型（prototype）。如果该参数propertiesObject被指定且不为 undefined，则该传入对象propertiesObject的可枚举自有属性及其属性描述符将添加到新创建的对象中。proto 参数需为 null 或对象，否则抛出 TypeError 异常。以 null 为原型的对象存在不可预期的行为，因为它未从 Object.prototype 继承任何对象方法（比如Object.prototype.toString()）。特别是在调试时，因为常见的对象属性的转换/检测工具可能会产生错误或丢失信息，但是优点是可以防止原型污染攻击。

![](../../../public/front-end/basics/javascript/68.png)

3. Object.defineProperty(obj, prop, descriptor)方法会直接在一个对象obj上定义（属性不不存在时）或修改某一个属性prop（包括Symbol），同时设置定义或修改的该属性的属性描述符descriptor，并返回此对象obj。对象里目前存在的属性描述符有两种主要形式：**数据描述符**和**存取描述符**。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。属性描述符 descriptor的键值（默认值是指使用 Object.defineProperty() 定义属性时的默认值）：
    1. configurable：当且仅当值为 true 时，该属性的描述符才能够被改变，同时该属性才能从对应的对象上被删除。 默认值为 false（属性不能删除，且除 value 和 writable 属性特性外的其他属性特性不可以被修改）。是数据描述符与存取描述符共享的键值。
    2. enumerable：当且仅当值为 true 时，该属性才会出现在对象的枚举属性中。 默认值为 false。是数据描述符与存取描述符共享的键值。
    3. value: 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。 默认值为 undefined。是数据描述符的独有的键值。
    4. writable：当且仅当值为 true 时，属性的值value才能被赋值运算符改变。 默认为 false。是数据描述符的独有的键值。
    5. get：属性的 getter 函数，默认值为 undefined。当访问属性prop时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性prop的值。是存取描述符的独有的键值。 
    6. set：属性的 setter 函数， 默认值为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。是存取描述符的独有的键值。
    7. 如果 getter或setter 属性是被继承的，它的 get 和 set 方法会在子对象的属性被访问或者修改时被调用。
    8. 如果一个描述符不具有 value、writable、get 和 set 中的任意一个键，那么它将被认为是一个数据描述符。如果一个描述符同时拥有 **value 或 writable** 和 **get 或 set 键**，则会产生一个异常。
4. Object.defineProperties(obj, props)方法直接在一个对象上定义新的属性或修改现有属性props（一个对象，其键表示要定义或修改的属性的名称，其值是描述属性的属性描述符对象），并返回该对象。
5. Object.getOwnPropertyDescriptor(obj, prop)方法返回指定对象obj的一个自有属性prop对应的属性描述符对象，如果属性不存在于该对象上则返回 undefined。在 ES5 中，如果该方法的第一个参数不是对象而是原始值就会抛出TypeError错误。而在 ES6中，第一个的参数不是对象的话就会被强制转换为对象。
6. Object.getOwnPropertyNames(obj)方法返回一个由指定对象obj的所有自身属性的属性名（**包括不可枚举属性但不包括 Symbol 值作为名称的属性**）组成的数组。数组中枚举属性的顺序与通过 for...in 循环（或 Object.keys）迭代该对象属性时一致。数组中不可枚举属性的顺序未定义。在 ES5 中，如果该方法的第一个参数不是对象而是原始值就会抛出TypeError错误。而在 ES6中，第一个的参数不是对象的话就会被强制转换为对象。
7. Object.getPrototypeOf(obj) 方法返回指定对象obj的原型（内部`[[Prototype]]`属性的值。比如，Object.prototype 是Object()或对象字面量构造出来的对象的原型。Function.prototype是Object()的原型。在 ES5 中，如果该方法的第一个参数不是对象而是原始值就会抛出TypeError错误。而在 ES6中，第一个的参数不是对象的话就会被强制转换为对象。
8. Object.getOwnPropertySymbols(obj)方法返回一个给定对象obj自身的所有 Symbol 属性键组成的数组。
9. Object.entries(obj)方法（ES2017）返回一个给定对象obj自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）。借助Object.entries方法可将一个Object转换为Map，即new Map(Object.entries(obj))。
10. Object.fromEntries(iterable)方法该迭代对象iterable条目提供对应属性的新对象。Object.fromEntries() 执行与 Object.entries 互逆的操作。
11. Object.isExtensible(obj)方法判断一个对象obj是否是可扩展的（是否可以在它上面添加新的属性）。默认情况下，对象是可扩展的，即可以为他们添加新的属性，以及它们的 `__proto__` (已弃用) 即`[[prototype]]`属性的值可以被更改。Object.preventExtensions，Object.seal 或 Object.freeze 方法都可以标记一个对象为不可扩展（non-extensible）。在 ES5 中，如果参数不是一个对象类型，将抛出一个 TypeError 异常。在 ES6 中，非object 参数将被视为一个不可扩展的普通对象，因此会返回 false。
12. Object.preventExtensions(obj)方法让一个对象变的不可扩展，也就是永远不能再给自身添加新的属性，但不可扩展对象的自身属性可能仍然可被删除，而且只是原型对象不可变，但不影响原型对象上的属性新增或修改或删除。一旦将对象变为不可扩展的对象，就再也不能使其可扩展。在 ES5 中，如果参数不是一个对象类型（而是原始类型），将抛出一个TypeError异常。在 ES6 中，非对象参数将被视为一个不可扩展的普通对象，因此会被直接返回。
13. Object.seal(obj)方法封闭目标对象obj，阻止添加新属性和删除现有属性并将所有现有属性标记为不可配置。不会影响从原型链上继承的属性。但__proto__ (已弃用) 即`[[prototype]]`属性的值也不能修改。在 ES5 中，如果这个方法的参数不是一个（原始）对象，那么它将导致TypeError。在 ES6 中，非对象参数将被视为已被密封的普通对象，会直接返回它。
14. Object.isSealed(obj)方法判断一个对象是否被密封。在 ES5 中，如果这个方法的参数不是一个对象（一个原始类型），那么它会导致TypeError。在 ES2015 中，非对象参数将被视为是一个密封的普通对象，只返回true。
15. Object.freeze(obj)方法可以冻结一个对象obj，不能向这个对象添加新的属性，不能删除已有属性，所有属性不可配置，且所有数据属性（即除了get和set以外的属性）不可修改。该对象的原型即__proto__ (已弃用) 即`[[prototype]]`属性的值也不能被修改。被冻结的对象不是常量对象，即浅冻结。在 ES5 中，如果这个方法的参数不是一个对象（一个原始值），那么它会导致 TypeError。在 ES2015 中，非对象参数将被视为要被冻结的普通对象，并被简单地返回。
16. Object.isFrozen(obj)方法判断一个对象是否被冻结。在 ES5 中，如果参数不是一个对象类型，将抛出一个TypeError异常。在 ES6 中，非对象参数将被视为一个冻结的普通对象，因此会返回true。
17. Object.keys(obj)方法会返回一个由一个给定对象的自身可枚举属性键组成的数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）。在 ES5 里，如果此方法的参数不是对象（而是一个原始值）会抛出 TypeError错误。在 ES6中，非对象的参数将被强制转换为一个对象。
18. Object.values(obj)方法返回一个给定对象自身可枚举属性值组成的数组，值的顺序与使用 for...in 循环的顺序相同（区别在于 for-in 循环枚举原型链中的属性）。如果此方法的参数不是对象（而是一个原始值）会抛出 TypeError错误。
19. Object.is(value1, value2)方法判断两个值是否为同一个值。如果满足以下任意条件则两个值相等： 
    1. 都是 undefined 
    2. 都是 null 
    3. 都是 true 或都是 false 
    4. 都是相同长度、相同字符、按相同顺序排列的字符串 
    5. 都是相同对象（意味着都是同一个对象的值引用） 
    6. 都是 +0 
    7. 都是 -0 
    8. 都是 NaN 
    9. 都是同一个数字值，都非零且都不是 NaN
20. Object.setPrototypeOf(obj, prototype)方法设置一个指定的对象obj的原型（即，内部 `[[Prototype]]` 属性）为prototype（对象或 null）。如果obj 参数是不可扩展的或是一个不可修改原型的特异对象（exotic object）（比如 Object.prototype 或 window或location），或者prototype 参数不是对象或 null，将抛出TypeError错误。通常，由于__proto__属性已经弃用，应该使用 Object.setPrototypeOf() 方法来设置对象的原型。如果 obj 参数不是一个对象（例如，数字、字符串等），该方法将什么也不做。由于性能和可读性的原因，不建议使用 setPrototypeOf 来代替 extends实现继承。
21. Object.hasOwn(instance, prop)如果指定的对象instance自身有指定的属性 prop，则返回 true。如果属性是继承的或者不存在，该方法返回 false。建议使用此方法替代 Object.prototype.hasOwnProperty()，因为它适用于使用 Object.create(null) 创建的对象以及覆盖了继承的 hasOwnProperty() 方法的对象。

**object原型方法**：
1. Object.prototype.constructor属性返回 Object() 的构造函数（用于创建实例对象）本身的引用。所有对象（使用 Object.create(null) 创建的对象除外）都将具有 constructor 属性。在没有显式使用构造函数的情况下，创建的对象将具有 constructor 属性，这个属性指向该对象的构造函数（比如 [] 对应于 Array，{} 对应于Object）。除基本类型外，任何对象都可以更改 constructor 属性的值，而且改变 constructor 的属性不会影响 instanceof 运算符。如果对象被密封或冻结，那么更改 constructor 将不会起作用，也不会抛出异常。
2. Object.prototype.hasOwnProperty(prop)方法会返回一个布尔值，指示对象obj自身属性中是否具有指定的属性prop。JavaScript 并没有保护 hasOwnProperty 这个属性名，因此，当某个对象可能自有一个占用该属性名的属性时，就需要使用外部的 hasOwnProperty （比如Object.prototype.hasOwnProperty.call或({}).hasOwnProperty.call）或Object.hasOwn静态方法来获得正确的结果。
3. Object.prototype.isPrototypeOf(obj)方法用于测试调用对象prototypeObj 是否存在于参数对象obj的原型链上。如果 prototypeObj 为 undefined 或 null，会抛出 TypeError。isPrototypeOf() 与 instanceof 运算符不同：在表达式 "object instanceof AFunction"中，object 的原型链是针对 AFunction.prototype 进行检查的，而不是针对 AFunction 本身。
4. Object.prototype.propertyIsEnumerable(prop) 方法返回一个布尔值，表示指定的属性是否可枚举且自有。
5. Object.prototype.toLocaleString()方法返回表示对象的字符串。出于特定于语言环境的目的，此方法旨在被派生对象覆盖，比如Array.prototype.toLocaleString()、Number.prototype.toLocaleString()、Date.prototype.toLocaleString()、TypedArray:。prototype.toLocaleString() 、BigInt.prototype.toLocaleString()。
6. Object.prototype.toString()方法返回一个表示该对象的字符串。基本的Object.prototype.toString()返回 "[object Type]"，这里的 Type 是对象的类型。如果对象有 Symbol.toStringTag 属性，其值是一个字符串，则它的值将被用作 Type。许多内置的对象，包括 Map 和 Symbol，都有 Symbol.toStringTag。一些早于 ES6 的对象没有 Symbol.toStringTag，但仍然有一个特殊的标签。它们包括（标签与类型名相同Array、 Function、 Error 、Boolean、 Number、 String 、Date 、RegExp），arguments 对象返回 "[object Arguments]"。其它所有内容，包括用户自定义的类，除非有一个自定义的 Symbol.toStringTag，否则都将返回 "[object Object]"。 在 null 和 undefined 上调用 Object.prototype.toString() 分别返回 [object Null] 和 [object Undefined]。
该方法旨给派生类对象的提供重写（自定义）类型转换的逻辑。默认情况下，toString() 不接受任何参数。然而，继承自 Object 的对象可能用它们自己的实现重写它，这些实现可以接受参数。例如，Number.prototype.toString() 和 BigInt.prototype.toString() 方法接受一个可选的 radix 参数。
7. Object.prototype.valueOf()原始的 valueOf() 方法会返回 this 值本身，如果尚未转换为对象，则转换为对象，因为返回值是对象，因此返回值将永远不会被任何原始值转换算法使用。此方法旨在被自定义类型转换逻辑的派生对象覆盖。

**实现扁平数据结构转树形结构**：

![](../../../public/front-end/basics/javascript/69.png)

**实现判断对象是否存在循环引用**：

![](../../../public/front-end/basics/javascript/70.png)

### Array

在 JavaScript 中，数组是具有以下核心特征的 Array 对象：
1. JavaScript 数组是可调整大小的，并且可以包含不同的数据类型。
2. JavaScript 数组不是关联数组，必须使用非负整数（或非负整数字符串形式）作为索引访问。
3. JavaScript 数组的索引从 0 开始，length - 1 结束。
4. 所有 JavaScript 对象(包括数组)的标准内置复制操作创建浅拷贝。

数组的对象属性和数组元素列表是分开的，JavaScript 语法要求使用方括号表示法而不能是点号表示法来访问以数字开头的属性。数组方法是通用的——它们不访问数组对象的任何内部数据，只通过 length 属性和索引访问数组元素。如果数组索引是非整形数值，那么将作为一个表示数组的对象的属性 (property) 创建，而不是数组的元素。

Array(arrayLength) 或Array(element0, element1, /* … ,*/ elementN)构造器用于创建 Array 对象。Array() 可以调用或不调用 new。两者都会创建一个新的 Array 实例。arrayLength是 [0 ,232 - 1]之间的整数，返回一个arrayLength 长度的空槽数组。数组字面量创建数组时中使用多余的逗号会创建空槽。如果只有一个参数（arrayLength）且其值不在 [0 ,232 - 1]之间，则会触发RangeError异常。

**Array的静态属性和静态方法**：
1. get Array[@@species] 访问器属性（或get Array[Symbol.species]）返回 Array 的构造函数。该访问器属性允许子类覆盖对象的默认构造函数。
2. Array.from(arrayLike[, mapFn][, thisArg]) 方法对一个类数组对象或可迭代对象arrayLike创建一个新的浅拷贝的数组实例。Array.from.length为1。新数组中的每个元素会执行该回调函数mapFn再返回。thisArg是执行回调函数mapFn时的this对象。
3. Array.isArray(value) 用于确定传递的值是否是一个 Array。给定一个 TypedArray 实例，总是返回 false。当检测 Array 实例时，Array.isArray 优于 instanceof，因为 Array.isArray 能检测 iframes。
4. `Array.of(element0, element1, /* … ,*/ elementN)`方法通过可变数量的参数创建一个新的 Array 实例且不考虑参数的数量或类型。Array.of() 和 Array() 构造函数的区别在于对单个参数的处理：Array.of(element) 创建一个具有单个元素 element 的数组，而 Array(arrayLength) 创建一个 arrayLength长度的空槽数组。Array.of(undefined)返回[undefined]。of() 方法可以在任何**接受单个参数表示新数组长度的构造函数上调用**并返回该构造函数的类数组对象实例，即Array.of.call(thisArg，element0, element1, /* … ,*/ elementN)，当thisArg不是构造函数时，返回一个普通Array对象。

**array原型的属性与方法**：
1. Array.prototype.length返回或设置一个数组中的元素个数。该值是一个无符号 32-bit 整数，并且总是大于数组最高项的下标。其属性特性为enumerable（可枚举）、configurable（可配置）均为false，writable（可重写）为true。当在 JavaScript 数组上设置一个属性时，如果该属性是一个有效的数组索引并且该索引在数组的当前边界之外，引擎将相应地更新数组的 length 属性，减少 length 属性会删除元素。当通过改变 length 属性值来扩展数组时，实际元素的数目将会增加，多出位置上的元素是空槽（empty）。空槽（empty）被索引访问会返回undefined，但是被迭代时会被忽略。
2. Array.prototype[@@unscopables] 包含了所有 ES2015 (ES6) 中新定义的、且并未被更早的 ECMAScript 标准收纳的属性名，这些属性在由 with 语句绑定的环境中被排除，防止某些数组方法被添加到 with 语句的作用域内。@@unscopables即Symbol.unscopables。其属性特性为enumerable、writable均为false，configurable为true。
3. Array.prototype.at(index)方法接收一个整数值并返回该索引对应的元素，允许正数和负数。负整数从数组中的最后一个元素开始倒数。如果找不到指定的索引，则返回 undefined。由于括号表示法不能使用负数（因为方括号内的所有值都会被视为字符串属性），通常的做法是访问 length 并将其减去从末端开始的相对索引，而at()方法可以使用负索引，index < 0时，array[index + array.length]简化为array.at(index)。at() 方法是通用的，其仅期望 thisArg 具有 length 属性和以整数为键的属性，即Array.prototype.at.call(arrayLike, index)。
4. Array.prototype.concat(value0, value1, /* … ,*/ valueN)方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组，如果参数value不是数组，直接放入新数组中，如果参数是数组则展开放入新数组中。concat 在类数组对象的 Symbol.isConcatSpreadable 被设置为真值时才会将类数组对象视作数组。concat 方法不会改变 this 或任何作为参数提供的数组，而是返回一个浅拷贝。
5. Array.prototype.copyWithin(target, start, end)方法浅复制数组的一部分`[start, end)`到同一数组中的指定区域`[target + start, target + end)`，并返回该数组，不会改变原数组的长度。参数 target、start 和 end 必须为整数。如果如果 start或end 为负，则其指定的索引位置为 length+start或length+start。target和start默认值为0，end默认值为length，如果target大于等于length或参数为空则什么也不会发生，如果target小于- length则为0。copyWithin 方法不要求其 thisArg 值必须是一个数组对象。
6. Array.prototype.keys()方法返回一个包含数组中每个索引键的 Array Iterator 对象，会包括空槽（Object.keys则不会包含空槽）。
7. Array.prototype.values()方法返回一个包含数组每个索引的值的新的 Array Iterator 对象。 Array Iterator 对象中存储的是原数组中元素值的地址，而不是数组元素值，Array Iterator 对象是一次性或临时的。Array.prototype.values 是 Array.prototype[Symbol.iterator] 的默认实现，即Array.prototype.values 默认等于 Array.prototype[Symbol.iterator]。
8. Array.prototype.entries()方法返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对。在稀疏数组上使用时，entries() 方法会迭代空槽，对应值为undefined。entries() 方法是通用的,它只要求 thisArg 值具有 length 属性和以整数为键的属性。
9. Array.prototype[Symbol.iterator]() 方法同Array.prototype.values，使得数组可迭代，而不必主动调用Array.prototype.values。
10. Array.prototype.findIndex(callback[, thisArg])方法返回数组中满足提供的测试函数callback的第一个元素的索引，找到会立即返回。若没有找到对应元素或者或者数组的length为 0则返回 -1。针对数组中的每个元素包括空槽，都会执行回调函数callback，执行时会自动传入当前元素element、当前元素的索引index、调用findIndex的数组array。thisArg是执行callback时作为this对象的值。在第一次调用callback函数时会确定元素的索引范围，因此在findIndex方法开始执行之后添加到数组的新元素将不会被callback函数访问到。如果数组中一个尚未被callback函数访问到的元素的值被callback函数所改变，那么当callback函数访问到它时，它的值将是根据它在数组中的索引所访问到的当前值即改变后的值。被删除的索引仍然会被访问到，值是undefined。findeIndex() 方法是通用的,它只要求 thisArg 值具有 length 属性和以整数为键的属性。
11. Array.prototype.findLastIndex(callback[, thisArg])方法与Array.prototype.findIndex的唯一区别是对数组每一个元素按降序（索引从大到小）执行 callbackFn 函数。
12. Array.prototype.find(callback[, thisArg])方法与Array.prototype.findIndex的唯一区别是返回满足提供的测试函数callback的第一个元素的值。
13. Array.prototype.findLast(callback[, thisArg])方法与Array.prototype.find的唯一区别是对数组每一个元素按降序（索引从大到小）执行 callbackFn 函数。
14. Array.prototype.unshift(element0, element1, /* … ,*/ elementN)方法将一个或多个元素从elementN到element0的顺序依次添加到数组的开头，并返回该数组的新长度。unshift()方法是通用的,它只要求 thisArg 值具有 length 属性和以整数为键的属性。
15. Array.prototype.shift()方法从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。如果数组为空则返回undefined。shift()方法是通用的,它只要求 thisArg 值具有 length 属性和以整数为键的属性。
16. Array.prototype.pop()和Array.prototype.shift()的区别在于删除最后一个元素。由于pop 方法根据 length 属性来确定最后一个元素的位置。如果不包含 length 属性或 length 属性不能被转成一个数值，会将 length 置为 0，并返回 undefined。

![](../../../public/front-end/basics/javascript/71.png)

17. Array.prototype.push(element0, element1, /* … ,*/ elementN)方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度。push方法是通用的，push 方法根据 length 属性来决定从哪里开始插入给定的值。如果 length 不能被转成一个数值或length不存在，则插入的元素索引为 0，其中不存在会创建length。String对象由于字符串不可变，length是只读的，不适用push方法。

![](../../../public/front-end/basics/javascript/72.png)

18. Array.prototype.toString()方法返回一个表示数组所有元素的字符串，当一个数组被作为文本值或者进行字符串拼接操作时，将会自动调用其 toString 方法。对于数组对象，Array.prototype.toString() 方法在内部调用 Array.prototype.join() 方法拼接数组中的元素并返回一个字符串，其中包含用逗号分隔的每个数组元素。如果 Array.prototype.join 方法不可用，或者它不是一个函数，将使用 Object.prototype.toString 代替，返回 [object Array]。
19. Array.prototype.toLocaleString(locales, options)返回一个字符串表示数组中的元素。数组中的每个元素将使用各自的 toLocaleString 方法转成字符串。这些字符串将使用一个特定语言环境的字符串，比如用逗号分隔。
20. Array.prototype.flat(depth)方法会按照一个可指定的深度depth（默认为1）递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。flat() 方法会移除数组中的空槽。depth使用Infinity可展开任意深度的嵌套数组。
21. Array.prototype.flatMap(callback[, thisArg])方法与 Array.prototype.flat().map(callback[, thisArg])几乎相同。flatMap 能通过 callback调用期间增删项目（callback函数去返回一个数组，通过修改该数组中元素的数量--数组中元素个数为1则保留，为0则删除，为其他多个元素则新增）。
22. Array.prototype.includes(searchElement[, fromIndex])方法用来判断一个数组从fromIndex开始是否包含一个指定的值searchElement。对于空槽，当作undefined处理。对于字符串和字符是区分大小写的。使用 === 严格相等来判断，即0 的值（-0 与 0 和 +0 ）将全部视为相等。fromIndex 默认值为0，如果是负数即array.length + fromIndex，如果array.length + fromIndex 小于 0，则整个数组都会被搜索。如果 fromIndex 大于等于数组的长度，则将直接返回 false，且不搜索该数组。includes方法是通用的。它只要求 this 值具有 length 属性和整数键的属性。
23. Array.prototype.indexOf(searchElement[, fromIndex])方法与Array.prototype.includes方法的区别在于返回在数组中出现的第一个索引，如果不存在，则返回 -1，而且遍历会跳过空槽。
24. Array.prototype.lastIndexOf(searchElement[, fromIndex])方法与indexOf的区别在于从后往前搜索，返回最后一个出现的索引。如果 fromIndex大于或等于数组的长度，则整个数组会被查找。如果该值为负数则array.length + fromIndex开始从后往前查找，如果array.length + fromIndex小于0，则方法返回 -1，即数组不会被查找。
25. Array.prototype.join(separator)方法将一个数组（或一个类数组对象）的所有元素（包括空槽被看作undefined）用指定的分隔符字符串separator分隔并连接成一个字符串并返回这个字符串。如果需要，将分隔符转换为字符串。如果省略，数组元素用逗号（,）分隔。如果 separator 是空字符串（""），则所有元素之间都没有任何字符。如果数组只有一个元素，那么将返回该元素而不使用分隔符。如果 arr.length 为 0，则返回空字符串。如果一个元素是 undefined 或 null，它将被转换为空字符串，而不是字符串 "undefined" 或 "null"。join() 方法是通用的。它只要求 this 值具有 length 属性和整数键的属性。
26. Array.prototype.reverse()方法将数组中元素的位置颠倒，并返回该数组的引用。方法是通用的,它只要求 thisArg 值具有 length 属性和以整数为键的属性，否则什么也不会发生。
27. Array.prototype.every(callback[, thisArg])方法测试一个数组内的所有元素是否都能通过某个指定函数callback的测试。它返回一个布尔值。若是空数组，此方法在任何情况下都会返回 true。如果遇到callback 返回 falsy 会立即返回 false。如果数组中一个尚未被callback函数访问到的元素的值被callback函数所改变，那么当callback函数访问到它时，它的值将是根据它在数组中的索引所访问到的当前值即改变后的值。callback会跳过空槽和被删除的元素。
28. Array.prototype.some(callback[, thisArg])方法与Array.prototype.every方法的区别在于是否存在元素通过了被提供的函数callback测试，遇到callback 返回truthy会立即返回true，而且若是空数组，始终返回true。
29. Array.prototype.fill(value, start, end)方法用一个固定值value填充数组中`[start, end)`的全部元素。如果start 或end是个负数，则会被自动计算成为 length + start或length+end，start默认为0，end默认为length。如果start或end超过数组索引范围或无效或start等于end，则什么也不做。当一个对象被传递给 fill 方法的时候，填充到数组的是这个对象的引用。fill方法是通用的，它只要求 thisArg 值具有 length 属性。
30. Array.prototype.slice(begin, end)方法返回一个原数组`[begin, end)`的浅拷贝的新的数组对象。如果省略 begin，则 slice 从索引 0 开始。如果 begin 超出原数组的索引范围，则会返回空数组。如果begin或end为负数，则表示从原数组中的倒数第几个元素开始提取或终止提取。如果end被省略或大于数组长度，slice 会一直提取到原数组末尾。
31. Array.prototype.filter(callback[, thisArg])方法创建给定数组的一部分的浅拷贝，其包含通过所提供函数callback的测试的所有元素，callback返回 true 表示该元素通过测试，保留该元素，false 则不保留。如果没有任何数组元素通过测试，则返回空数组。callback会跳过空槽和被删除的元素。filter() 不会改变原数组，遍历会通过in检查跳过空槽。

![](../../../public/front-end/basics/javascript/73.png)

32. Array.prototype.forEach(callback[, thisArg])方法对数组的每个元素执行一次给定的函数callback。forEach方法返回undefined，因此不能链式调用。空槽和被删除的元素会被跳过。forEach 不会直接改变调用它的对象，但是那个对象可能会被 callbackFn 函数改变。除了抛出异常以外，没有办法中止或跳出 forEach() 循环。
33. Array.prototype.map(callback[, thisArg]) 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数callback后的返回值组成。空槽和在调用过程中被删除的元素会被跳过，但空槽的位置会被保留。map 方法生成一个新数组，当不打算使用返回的新数组或没有从回调函数中返回值时请用 forEach 或者 for-of 替代。["1", "2", "3"].map(parseInt)，实际结果为[1, NaN, NaN]，因为parseInt作为callback，实际执行的是map(parseInt(value, index))。解决方案：
    1. 如果要求为整数：['1', '2', '3'].map((item) => parseInt(item, 10))。
    2. 如果可以是浮点数：['1', '2', '3'].map(Number)。

![](../../../public/front-end/basics/javascript/74.png)

34. Array.prototype.splice(start[, deleteCount][, item1][, item2][, itemN])方法通过删除或替换现有元素或者原地添加新的元素来修改调用数组，splice方法返回由被删除的元素组成的一个数组，如果没有删除元素则返回空数组。item1, item2, itemN是从start 位置开始要添加进数组的元素，如果不指定，则 splice方法将只删除数组元素。deleteCount表示从start 位置开始要从数组中移除的元素的个数，如果 deleteCount 是 0 或者负数，则不移除元素，至少应添加一个新元素item，如果 deleteCount 被省略或者大于等于array.length - start，start之后数组的所有元素都会被删除。如果添加进数组的元素个数不等于被删除的元素个数，数组的长度会发生相应的改变。start默认为0，如果为负数则start为length+start，且如果length+star小于0，则start为0，如果start大于length，则为length。

![](../../../public/front-end/basics/javascript/75.png)

35. Array.prototype.reduce(function reducer(previousValue, currentValue, currentIndex, array) { /* … */ }, initialValue)方法对数组中的每个元素按序执行提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果previousValue作为参数传入，最后将其结果汇总为单个返回值，会跳过空槽和被删除的元素。reduce 不会直接改变调用它的对象，但对象可被调用的 reducer 所改变。被删除的元素会被跳过。如果数组仅有一个元素并且没有提供初始值 initialValue，或者有提供 initialValue 但是数组为空，那么此数组仅有元素或initalValue将被返回且 reducer 不会被执行。调用reduce数组为空且初始值 initialValue 未提供时会抛出TypeError 错误。
    1. previousValue：上一次调用 callbackFn 时的返回值。在第一次调用时，若指定了初始值 initialValue，其值则为 initialValue，否则为数组索引为 0 的元素 array[0]。
    2. currentValue：数组中正在处理的元素。在第一次调用时，若指定了初始值 initialValue，其值则为数组索引为 0 的元素 array[0]，否则为 array[1]
    3. currentIndex：数组中正在处理的元素的索引。若指定了初始值 initialValue，则起始索引号为 0，否则从索引 1 起始。
    4. array：调用reduce方法的数组对象。
    5. initialValue：作为第一次调用 callback 函数时参数 previousValue 的值。若指定了初始值 initialValue，则 currentValue 则将使用数组第一个元素；否则 previousValue 将使用数组第一个元素，而 currentValue 将使用数组第二个元素。

![](../../../public/front-end/basics/javascript/76.png)

36. Array.prototype.reduceRight(function reducer(previousValue, currentValue, currentIndex, array) { /* … */ }, initialValue)方法和Array.prototype.reduce的区别在于从后往前调用提供的reducer函数，initialValue不提供且数组不为空时为最后一个元素。
37.Array.prototype.sort(function compareFn(a, b) { /* … */ })方法用原地算法对数组的元素进行排序，并返回数组。如果没有指明 compareFn ，那么元素会按照转换为的字符串的每个字符的 Unicode 位点（代码点）进行排序。如果指明了compareFn，数组会按照调用该函数的返回值排序，a、b分别是第一个、第二个用于比较的元素，compareFn返回值大于0， b会被排列到 a 之前；返回值小于0， a 会被排列到 b 之前；返回值等于0，a 和 b 的相对位置不变。compareFn(a, b) 必须总是对相同的输入返回相同的比较结果。自 ES10（EcmaScript 2019）起，规范要求 Array.prototype.sort 为稳定排序。

**实现数组元素求和**：

![](../../../public/front-end/basics/javascript/77.png)

**实现数组元素的乱序**:

![](../../../public/front-end/basics/javascript/78.png)

**实现类数组转数组**：

![](../../../public/front-end/basics/javascript/79.png)

### RegExp（正则表达式）

RegExp 对象用于将文本与一个模式匹配，继承自Function。可以使用字面量/pattern/flags、构造函数new RegExp(pattern[, flags])和工厂方法RegExp(pattern[, flags])来RegExp 对象，从 ES5 开始，RegExp的第一个参数pattern也可以是另一个RegExp对象。字面量形式提供正则表达式的编译（compilation）状态，当正则表达式保持为常量时使用字面量，不会在每次循环迭代时重新编译。而正则表达式对象的构造函数提供了正则表达式运行时编译，当知道正则表达式模式将发生变化时，或者不知道该模式但正在从其他来源 (如用户输入) 获取它时，请使用构造函数。

从ES6开始，当构造函数RegExp()中第一个参数为正则表达式而第二个标志参数存在时不再抛出 TypeError错误（"从另一个 RegExp 构造一个 RegExp 时无法提供标志"）。当使用RegExp()构造函数创造正则对象时，需要常规的字符转义规则（加反斜杠 \）。

**lastIndex**是正则表达式的一个整型属性，它不在prototype上也不在RegExp上，而是在正则表达式实例上，用来指定下一次匹配的起始索引。其属性特性为enumerable、configurable均为false，writable为true。只有正则表达式使用了表示全局检索的 "g" 或者粘性检索的 "y" 标志时，该属性才会起作用：
1. 如果 lastIndex 大于字符串的长度，则 regexp.test 和 regexp.exec 将会匹配失败，然后 lastIndex 被设置为 0。
2. 如果 lastIndex 小于或等于字符串的长度，则该正则表达式匹配从 lastIndex 位置开始的字符串：
    1. 如果 regexp.test 或 regexp.exec 匹配成功，lastIndex 会被设置为紧随最近一次成功匹配的下一个位置。
    2. 如果 regexp.test 或 regexp.exec 匹配失败，lastIndex 会被设置为 0。

**RegExp的静态属性与方法**：
1. get RegExp[@@species]()访问器属性返回RegExp 的构造器。该访问器属性允许子类覆盖对象的默认构造函数。

**regExp的原型属性与方法**:
1. RegExp.prototype.flags访问器属性返回一个字符串，由当前正则表达式对象的标志组成，每个标志以字典序排序（比如"gimuy"）。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
2. RegExp.prototype.dotAll 访问器属性表明是否在正则表达式中使用"s" flag的布尔值（使得“.”可以匹配任意单个字符，IE不支持该flag——解决方案是用[\s\S]、[\d\D]、[^]替代）。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
3. RegExp.prototype.global 访问器属性表明正则表达式是否使用了 "g" flag的布尔值（找到所有的匹配，而不是在第一个匹配之后停止）。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
4. RegExp.prototype.ignoreCase 访问器属性表明正则表达式是否使用了 "i" flag的布尔值（在字符串进行匹配时，应该忽略大小写）。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
5. RegExp.prototype.multiline 访问器属性表明正则表达式是否使用了"m" flag的布尔值（一个多行输入字符串被看作多行，即开始和结束字符 (^ and $) 匹配每一行的开头和结尾）。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
6. RegExp.prototype.sticky 访问器属性表明正则表达式是否使用了"y" flag的布尔值（仅从正则表达式的 lastIndex 属性表示的索引处开始匹配，并且不会尝试从后续索引匹配）。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。如果一个正则表达式同时指定了 sticky 和 global，其将会忽略 global 标志。
7. RegExp.prototype.hasIndices访问器属性表明正则表达式是否使用了 "d" flag的布尔值（正则表达式匹配的结果应该包含每个捕获组子字符串开始和结束的索引）。 其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
8. RegExp.prototype.unicode 访问器属性表明正则表达式是否带有"u" flag的布尔值(将pattern视为一系列 Unicode 代码点，正则表达式能正确的处理 4 个字节的“长字符”，而不是将其当作一对 2 个字节长的字符)。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
9. RegExp.prototype.source 访问器属性返回一个值为当前正则表达式对象的模式文本的字符串。该字符串不会包含正则字面量两边的斜杠以及任何的flag字符。其set 访问器是 undefined，enumerable为false，configurable为true，因此不能直接修改。
10. RegExp.prototype.[@@match](str)方法返回正则表达式匹配字符串str时的匹配结果。该方法会返回一个数组，它包括整个匹配结果和通过捕获组匹配到的结果；如果没有匹配到则返回 null。match方法是始终会设置 "y" flag。RegExp 的子类可以覆写 [@@match]方法来修改默认行为。RegExp或它的子类的[@@match]方法会在String.prototype.match内部调用。
11. RegExp.prototype.[@@matchAll]()方法返回正则表达式匹配字符串时的包含所有匹配项结果的迭代器，每个匹配项都是一个与 RegExp.prototype.exec方法的返回值相同形式的数组。RegExp 的子类可以覆写 [@@matchAll]方法来修改默认行为。RegExp或它的子类的[@@matchAll]方法会在String.prototype.matchAll内部调用。
12. RegExp.prototype.[@@replace](str, newSubStr|function) 方法会在一个字符串str中用给定的替换器字符串newSubStr或每次配备都会调用的替换器函数function，替换所有符合正则模式的匹配项，并返回替换后的新字符串结果。RegExp 的子类可以覆写 [@@replace]方法来修改默认行为。RegExp或它的子类的[@@replace]方法会在String.prototype.replace的第一个参数是RegExp的对象时在String.prototype.replace内部调用。
13. RegExp.prototype.[@@search](str) 方法返回正则表达式匹配给定字符串str的第一个匹配结果在字符串str中的位置下标，匹配失败则返回-1。RegExp 的子类可以覆写 [@@search]方法来修改默认行为。RegExp或它的子类的[@@search]方法会在String.prototype.search内部调用。
14. RegExp.prototype.[@@split](str[, limit]) 方法切割 String 对象返回一个其子字符串的数组，数组中子字符串数量上限为limit。RegExp 的子类可以覆写 [@@split]方法来修改默认行为。RegExp或它的子类的[@@split]方法会在String.prototype.split的第一个参数是RegExp的对象时在String.prototype.split内部调用。
15. RegExp.prototype.test(str) 方法执行一个检索，用来查看正则表达式与指定的字符串str是否匹配。与String.prototype.search的区别在于该方法返回布尔值。如果正则表达式设置了 "g" flag，test的执行会改变正则表达式 lastIndex属性，连续的执行test方法，后续的执行将会从 lastIndex 处开始匹配字符串，(RegExp.prototype.exec同样改变正则本身的 lastIndex 属性值)。
16. RegExp.prototype.exec(str) 方法在一个指定字符串str中执行一个搜索匹配。exec() 是正则表达式的原始方法。许多其它的正则表达式方法会在内部调用 exec()，包括一些字符串方法。在使用 exec() 时，"g" flag不会在 "y" flag被设置时生效。如果匹配失败，exec方法返回 null，并将正则表达式的 lastIndex 重置为 0。如果匹配成功，exec方法返回一个数组，并更新正则表达式对象的 lastIndex 属性，关于lastIndex的注意事项：
    1. 不要把正则表达式字面量（或者 RegExp 构造函数）创建正则表达式对象的操作放在 while 条件表达式里。由于每次循环迭代时 lastIndex 的属性都被重置。
    2. 请确保设置了全局（g）标志位，否则 lastIndex 不会被更新。
    3. 如果正则表达式可以匹配长度为零的字符（例如：/^/gm），请手动递增 lastIndex，以避免其始终卡在相同的位置。
    4. 建议将此类全局匹配的处理代码替换为 String.prototype.matchAll() 以降低出错的可能性。
    完全匹配成功的文本将作为RegExp.prototype.exec方法返回数组的第一项，从第二项起，后续每项都对应一个匹配的捕获组。该数组对象还包括一下额外属性：
    1. index：完全匹配成功的文本位于原始字符串的基于 0 的索引值。
    2. input：原始字符串。
    3. groups：一个命名捕获组对象，其键是名称，值是捕获组。若没有定义命名捕获组，则 groups 的值为 undefined。
    4. indices：一个二维数组，数组中每一个元素是捕获组位于原始字符串的基于 0 的起始索引和结束索引构成的数组。此属性仅在设置了 "d" flag时存在。
17. RegExp.prototype.toString() 返回一个表示该正则表达式的字符串，包括正则字面量两边的斜杠以及flag字符。覆盖了 Object 对象的 toString() 方法。

**正则表达式模式pattern类**：
1. \d匹配一个数字，等价于 [0-9]。
2. \D匹配一个非数字字符，等价于 [^0-9]。
3. \s匹配一个空白字符，包括空格、制表符、换页符和换行符，等价于 [ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]。
4. \S匹配一个非空白字符。等价于 [^\f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]
5. \w匹配一个单字字符（字母、数字或者下划线），等价于 [A-Za-z0-9_]。
6. \W匹配一个非单字字符，等价于 [^A-Za-z0-9_]
7. \b匹配词的边界（既可以用于单词，也可以用于数字，不适用于非拉丁字母），同样是一个测试条件，本身不匹配任一字符。
8. \B匹配非词边界。
9. 默认插入符号 ^ 匹配行开头，效果同 str.startsWith；美元符号 $ 匹配行结尾，效果同str.endsWith（如果只是匹配固定字符串结尾，应都使用后者str方法）。两者同时使用即完全匹配，^ 和 $ 均属于测试条件，本身不匹配任一字符。
10. 换行符 \n匹配行尾\n并会将\n加入到匹配结果中，而且不会匹配字符串文本结尾。
11. **`特殊字符列表[ \ ^ $ . | ? * + ( )`**：匹配特殊字符需要用反斜杠 \ 进行转义，注意，对于正斜杠 / 虽然不是特殊字符，对于是/pattern/flags方式的正则表达式，匹配正斜杠 / 也才需要转义。同时，对于使用new  RegExp(pattern, flags) 创建正则方式，pattern字符串中的所有\都需要再加转义（即 new  RegExp(‘\\d’, flags) ）
12. **`方括号[...]`**：搜索给定的字符或字符类或字符范围（集）中的任意且仅一个。方括号中的特殊字符可以不用转义（除了方括号），转义也没问题。
13. 数量 {n} 或者{n, m} 或者{n, }：指定具体需要的匹配数量或数量范围，如\d{5} 表示 5 位的数字，同 \d\d\d\d\d，\d{3,5}表示3到5位的数字，\d{3,}表示三位及以上位数的数字。 + 代表“一个或多个”，相当于 {1,}。 ? 代表“零个或一个”，相当于 {0,1},  * 代表着“零个或多个”，相当于 {0,}, 比如匹配没有属性的HTML标签：**`/<\/?[a-z][a-z0-9]*>/gi`**
14. **贪婪模式/惰性模式**：都是针对量词而言，前者（默认情况下）量词都会尽可能地重复多次（**量词重复直到量词前的不匹配，否则搜索至末尾，再进行回溯匹配模式中量词后的部分**）。后者重复最少次数（**量词后面接 ? 即才启用惰性模式——量词重复直到模式 ? 中后的剩余部分找到匹配项，如果没有剩余部分直接就结束**）。惰性模式并不是能完全弥补贪婪模式的不适用，有时需通过微调贪婪模式而不是使用惰性模式
15. **括号（...）**：捕获组，后接量词则捕获组作为一个整体；将括号内匹配的部分作为结果数组中的单独项返回（str.match(regexp)不是g模式时），括号编号从1开始从左到右，括号可嵌套，编号从外到里，然后从左到右编号。如果捕获组是可选的（即量词可以为0），那么即使捕获组匹配不存在，结果数组也存在该索引且值为undefined。允许为括号命名——通过在括号里一开始放置 `?<name>` 实现，匹配的组在 .groups 属性中。允许为捕获组的一开始添加 ?: 来排除该组在结果数组中返回。前瞻断言x(?=Y)，它表示“仅在后面是 Y 时匹配 X”。这里的 X 和 Y 可以是任何模式。前瞻断言只是一个测试，不消耗待匹配字符串，括号 (?=...) 中的内容不包含在匹配结果。

**实现手机号中间四位变成**：

![](../../../public/front-end/basics/javascript/80.png)

**验证密码**：

![](../../../public/front-end/basics/javascript/81.png)

### Date

Date 对象基于 Unix 时间戳（即自 1970 年 1 月 1 日（UTC，即Universal Time Coordinated，协调世界时）起经过的毫秒数）。继承自Object。

创建Date对象只能是通过new 操作符，否则常规函数调用是返回当前日期和时间字符串。

**Date()构造函数创建Date对象有四种形式**：
1. new Date()：没有提供参数，创建表示实例化时刻的日期和时间的 Date 对象。
2. new Date(value)：value是Unix 时间戳，表示自 1970 年 1 月 1 日 00:00:00 UTC以来的毫秒数，忽略了闰秒。创建该时间戳对应的 Date 对象。
3. new Date(dateString)：dateString是表示日期的字符串值。该字符串应该能被 Date.parse() 正确方法识别。创建该日期字符串值对应的 Date 对象。由于浏览器的差异和不一致，强烈建议不要使用 Date 构造函数（或Date.parse()）解析日期字符串。
4. new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])：创建参数对应的当地时区（执行 JavaScript 的客户端电脑所设置的时区）的Date 对象，需要使用世界协调时 UTC（格林威治时间），使用相同参数调用 new Date(Date.UTC(...))。如果某一数值大于合理范围时（如月份为 13 或者分钟数为 70），相邻的数值会被进位调整。其中year和monthIndex是必要参数，其余可选。year是表示年份的整数值。0 到 99 会被映射至 1900 年至 1999 年，其它值代表实际年份。monthIndex是表示月份的整数值，从 0（1 月）到 11（12 月）。date表示一个月中的第几天的整数值，从 1 开始。默认值为 1。hour表示一天中的小时数的整数值 (24 小时制)。默认值为 0（午夜）。minutes/seconds/milliseconds分别表示一个完整时间（如 01:10:00:000）中的分钟/秒/毫秒部分的整数值，默认值为 0。

**Date的静态属性与方法**：
1. Date.length值是 7。这是该构造函数可接受的参数个数。
2. Date.now()方法返回自 1970 年 1 月 1 日 00:00:00 (UTC) 到当前时间的毫秒数。支持 Web Performance API 的高精细度时间功能的浏览器中，Performance.now() 比 Date.now() 更加可靠、精确。

![](../../../public/front-end/basics/javascript/82.png)

3. Date.parse(dateString)方法解析一个表示某个日期的字符串dateString，并返回从 1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的 UTC 时间）的毫秒数，如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值（如：2015-02-31），则返回值为 NaN。当输入为 "March 7, 2014" 时， parse() 将默认使用本地时区。但如果使用 ISO 格式如 "2014-03-07" ，则会被默认为 UTC (ES5 和 ECMAScript 2015) 时区。不同宿主在如何解析日期字符串上仍存在许多差异，强烈建议不要使用 Date.parse()）解析日期字符串，因此最好还是手动或使用库解析日期字符串。
4. `Date.UTC(year[, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])`方法与new Date 构造函数不同在于会将参数视为 UTC 时间，其返回从 1970 年 1 月 1 日 00:00:00 UTC 到指定时间的毫秒数，而且monthIndex是可选的，但是ECMAScript 2017 要求提供少于两个的参数时返回NaN。

**date的原型属性与方法**：
1. Date.prototype.getDate()方法根据本地时间，返回一个指定的日期对象为一个月中的哪一日（从 1--31）。Date.prototype.getUTCDate()则是根据协调世界时。
2. Date.prototype.getFullYear()方法根据本地时间，返回一个指定的日期对象的四位数年份。用于替代Date.prototype.getYear()方法（已弃用，因为该方法返回的是相对于1900的年份差）。Date.prototype.getUTFullYear()则是根据协调世界时。
3. Date.prototype.getMonth()方法根据本地时间，返回一个指定的日期对象的月份部分，0表示第一个月。Date.prototype.getUTCMonth()则是根据协调世界时。
4. Date.prototype.getDay()方法根据本地时间，返回一个指定的日期对象为一周的第几天，0 表示星期天。如果需要，可以使用Intl.DateTimeFormat与一个额外的options 参数，从而更加国际化的返回这天的全称（如"Monday"）。Date.prototype.getUTCDay()则是根据协调世界时。
5. Date.prototype.getHours()方法根据本地时间，返回一个指定的日期对象的小时部分，范围是[0, 23]整数。Date.prototype.getUTCHours()则是根据协调世界时。
6. Date.prototype.getMinutes()方法根据本地时间，返回一个指定的日期对象的分钟数部分，范围是[0, 59]整数。Date.prototype.getUTCMinutes()则是根据协调世界时。
7. Date.prototype.getSeconds()方法根据本地时间，返回一个指定的日期对象的秒数部分，范围是[0, 59]整数。Date.prototype.getUTCSeconds()则是根据协调世界时。
8. Date.prototype.getMilliseconds()方法根据本地时间，返回一个指定的日期对象的毫秒数部分，范围是[0, 999]整数。Date.prototype.getUTCMilliSeconds()则是根据协调世界时。
9. **Date.prototype.setDate(dayValue)**方法根据本地时间，来指定一个日期对象的日部分。如果 dayValue 超出了月份的合理范围，setDate 将会相应地修正更新 Date 对象。Date.prototype.setUTCDate()则是根据协调世界时。
10. Date.prototype.setFullYear(yearValue[, monthValue[, dayValue]])方法根据本地时间，来指定一个日期对象的年份部分，如果没有指定 monthValue 和dayValue 参数，将会使用 getMonth 和getDate 方法的返回值。如果参数超出了合理范围，将会相应地修正更新 Date 对象。用于替代Date.prototype.setYear()方法（使用的是两位数映射，已弃用）。Date.prototype.setUTFullYear()则是根据协调世界时。
11. Date.prototype.setMonth(monthValue[, dayValue])方法根据本地时间为一个日期对象设置月份。如果不指定 dayValue 参数，就会使用 getDate 方法的返回值。如果参数超出了合理范围，将会相应地修正更新 Date 对象。Date.prototype.setUTCMonth()则是根据协调世界时。
12. Date.prototype.setHours(hoursValue[, minutesValue[, secondsValue[, msValue]]])方法根据本地时间为一个日期对象设置小时数。如果不指定 minutesValue，secondsValue 和 msValue 参数，则会使用getMinutes()，getSeconds() 和getMilliseconds() 方法的返回值。如果参数超出了合理范围，将会相应地修正更新 Date 对象。Date.prototype.setUTCHours()则是根据协调世界时。
13. Date.prototype.setMinutes(minutesValue[, secondsValue[, msValue]])方法根据本地时间为一个日期对象设置分钟数。如果没有指定 secondsValue 和 msValue 参数，就会使用 getSeconds() 和 getmilliseconds() 方法的返回值。如果参数超出了合理范围，将会相应地修正更新 Date 对象。Date.prototype.setUTCMinutes()则是根据协调世界时。
14. Date.prototype.getSeconds(secondsValue[, msValue])方法根据本地时间设置一个日期对象的秒数。如果没有指定 msValue 参数，就会使用 getMilliseconds() 方法的返回值。如果参数超出了合理范围，将会相应地修正更新 Date 对象。Date.prototype.setUTCSeconds()则是根据协调世界时。
15. Date.prototype.setMilliseconds(millisecondsValue)方法会根据本地时间设置一个日期对象的豪秒数。如果参数超出了合理范围，将会相应地修正更新 Date 对象。Date.prototype.setUTCMilliSeconds()则是根据协调世界时。
16. Date.prototype.getTimezoneOffset()方法返回协调世界时（UTC）相对于当前时区的时间差值，单位为分钟，因此除以60就可以获得小时差。如果本地时区晚于协调世界时，则该差值为正值，如果早于协调世界时则为负值。
17. Date.prototype.getTime()方法返回一个日期对象距离1970 年 1 月 1 日 0 时 0 分 0 秒（UTC，即协调世界时）的毫秒数。如果需要避免生成date对象，请使用Date.now()代替。
18. Date.prototype.setTime(timeValue)方法以一个表示从 1970-1-1 00:00:00 UTC 计时的毫秒数为来为 Date 对象设置时间。
19. Date.prototype.toDateString()方法根据本地时区以美式英语和人类易读的形式返回一个日期对象日期部分（形式："Wed Jul 28 1993"）的字符串。Date.prototype.toTimeString()则根据本地时区以美式英语和人类易读的形式返回日期对象的时间部分（形式："14:39:07 GMT-0600 (PDT)"）。Date.prototype.toString()返回根据本地时区表示该 Date 对象的完整字符串（形式："Wed Sep 09 1998 05:36:22 GMT+0800 (中国标准时间)"）。Date.prototype.toUTCString()方法则返回根据UTC（协调世界时）表示该 Date 对象的完整字符串（形式："Wed, 14 Jun 2017 07:00:00 GMT"）。
20. Date.prototype.toISOString()方法以UTC（协调世界时）返回一个ISO格式（形式：YYYY-MM-DDTHH:mm:ss.sssZ）的字符串。
21. Date.prototype.toJSON()方法返回 Date 对象的JSON 格式字符串，和Date.prototype.toISOString方法结果相同。
22. Date.prototype.toLocaleDateString([locales [, options]])方法返回该日期对象日期部分的字符串，该字符串格式因不同语言（设置locales和options）而不同，用于格式化日期字符串。但是当格式化大量日期时，最好创建一个 Intl.DateTimeFormat 对象，然后使用该对象 format属性提供的方法。Date.prototype.toLocaleTimeString([locales [, options]])方法则返回该日期对象时间部分的字符串。Date.prototype.toLocaleDateString([locales [, options]])方法则返回日期对象的完整字符串。
23. Date.prototype.valueOf()方法返回一个 Date 对象的原始值，即从 1970 年 1 月 1 日 0 时 0 分 0 秒（UTC，即协调世界时）到该日期对象的毫秒数，功能同Date.prototype.getTime()。
24. Date.prototype[@@toPrimitive](hint)方法可以转换一个 Date 对象到一个原始值，其属性特性为enumerable、writable均为false，configurable为true。。如果 hint 是 "string" 或 "default"，[@@toPrimitive]() 将会调用 toString。如果 toString 属性不存在，则调用 valueOf。如果 valueOf 也不存在，则抛出一个TypeError。如果 hint 是 "number"，[@@toPrimitive]() 会首先尝试 valueOf，若失败再尝试 toString。

实现格式化日期：

![](../../../public/front-end/basics/javascript/83.png)

### Math

Math 是一个拥有一些数学常数属性和数学函数方法的内置对象。Math 继承自Object，不是一个函数对象，不是构造函数，Math 的所有属性与方法都是静态的。Math用与Number类型，不支持BigInt类型。

三角函数 sin()、cos()、tan()、asin()、acos()、atan() 和 atan2() 返回的值是弧度而非角度。若要转换，弧度除以 (Math.PI / 180) 即可转换为角度，同理，角度乘以这个数则能转换为弧度。

**Math的常数属性，其属性特性enumerable、configurable、writable均为false**：
1. Math.E 属性表示自然对数的底数e，即欧拉常数，约等于 2.71828。
2. Math.LN10 属性表示 10 的自然对数ln(10)，约为 2.302。
3. Math.LN2 属性表示 2 的自然对数ln(2)，约为 0.693。
4. Math.LOG10E 属性表示以 10 为底数，e 的对数log10(e)，约为 0.434。
5. Math.LOG2E 属性表示以 2 为底数，e 的对数log2(e)，约为 1.442。
6. Math.PI 表示一个圆的周长与直径的比例，约为 3.14159。
7. Math.SQRT1_2 属性表示 1/2 的算数平方根，约为 0.707。
8. Math.SQRT2 属性表示 2 的平方根，约为 1.414。
![](../../../public/front-end/basics/javascript/83.png)

**Math的数学方法**：
1. Math.abs(x) 函数返回一个数字的绝对值，其将参数强制转换为数字，无法强制转换的值将变成 NaN也就返回 NaN。
2. Math.exp(x) 函数返回 e^x，e 是欧拉常数即自然对数的底数。参数 x 会被自动类型转换成 number 类型。
3. Math.expm1(x) 函数返回 e^x - 1, 其中 x 是该函数的参数，e 是自然对数的底数 2.718281828459045。参数 x 会被自动类型转换成 number 类型。
4. Math.tanh(x)函数将会返回一个数的双曲正切函数值。

![](../../../public/front-end/basics/javascript/84.png)

5. Math.trunc(x) 方法会将数字x的小数部分去掉，只保留整数部分。参数x会被隐式转换成数字类型。
6. Math.acos(x) 返回一个数x的反余弦值（单位为弧度），如果传入的参数值超出了限定的范围[-1, 1]，将返回 NaN。

![](../../../public/front-end/basics/javascript/85.png)

7. Math.acosh(x) 函数返回一个数x的反双曲余弦值，如果该数x小于 1 则返回 NaN。

![](../../../public/front-end/basics/javascript/86.png)
![](../../../public/front-end/basics/javascript/87.png)

8. Math.asin(x) 方法返回一个数值x的反正弦（单位为弧度），如果传入的参数值超出了限定的范围[-1, 1]，将返回 NaN。

![](../../../public/front-end/basics/javascript/88.png)

9. Math.asinh(x) 返回一个数值x的反双曲正弦值。

![](../../../public/front-end/basics/javascript/89.png)
![](../../../public/front-end/basics/javascript/90.png)

10. Math.atan(x) 函数返回一个数值x的反正切（以弧度为单位）。

![](../../../public/front-end/basics/javascript/91.png)

11. Math.atan2(y, x) 返回从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 （以弧度为单位）。
12. Math.cos(x) 函数返回一个数值x（以弧度为单位）的余弦值（以弧度为单位）。
13. Math.sin(x) 函数返回一个数值x（以弧度为单位）的正弦值（以弧度为单位）
14. Math.tan(x) 函数返回一个数值x（以弧度为单位）的正切值（以弧度为单位）
15. Math.cosh(x) 函数返回数值x(单位为角度)的双曲余弦值。

![](../../../public/front-end/basics/javascript/92.png)

16. Math.sinh() 函数返回一个数字 x (单位为角度)的双曲正弦值。
17. Math.cbrt(x) 函数返回任意数字x的立方根。
18. Math.sqrt(x)函数返回一个数x的算数平方根，如果参数 number 为负值（不包括-0），则 sqrt 返回NaN。
19. Math.log10(x) 函数返回数字x以 10 为底的对数。如果传入的参数小于 0，则返回 NaN。
20. Math.log(x) 函数返回一个数x的自然对数，即ln(x)。如果指定的参数x为负数，则返回值为 NaN。logxy如下：

![](../../../public/front-end/basics/javascript/93.png)

21. Math.log1p(x) 函数返回一个数字x加 1 后的自然对数, 既ln(x+1)。如果参数x小于-1, 则返回 NaN.
22. Math.log2(x) 函数返回数字x以 2 为底的对数。如果指定的参数x为负数，则返回值为 NaN。
23. Math.hypot([value1[,value2, ...]]) 函数返回所有参数的平方和的算数平方根。如果有参数不能转换为数字，则返回 NaN。
24. Math.ceil(x) 函数返回大于等于给定数字的最小整数。与 -Math.floor(-x) 相同。

![](../../../public/front-end/basics/javascript/94.png)

25. Math.floor(x) 函数返回小于等于 x 的最大整数。与 -Math.ceil(-x) 相同。

![](../../../public/front-end/basics/javascript/95.png)

26. Math.round(x) 给定数字x四舍五入到最接近的整数。如果参数的小数部分大于 0.5，则舍入到相邻的绝对值更大的整数。如果参数的小数部分小于 0.5，则舍入到相邻的绝对值更小的整数。如果参数的小数部分恰好等于 0.5，则舍入到相邻的在正无穷（+∞）方向上的整数。

![](../../../public/front-end/basics/javascript/96.png)

27. Math.pow(base, exponent) 函数返回基数（base）的指数（exponent）次幂，即 base^exponent。
28. Math.sign(x) 函数返回一个数字的符号，指示数字是正数，负数还是零。传入该函数的参数x会被隐式转换成数字类型。函数共有 5 种返回值，分别是 1, -1, 0, -0, NaN. 代表的各是正数，负数，正零，负零，NaN。
29. Math.fround(doubleFloat) 可以将任意的数字转换为离它最近的32位单精度浮点数形式的数字。若参数为非数字类型，则会被转换成数字。无法转换时，设置成NaN。如果参数超出 32 位浮点数的范围，则返回 Infinity 或 -Infinity。因为JavaScript内部使用的是双精度64位浮点类型，而Float32Array中的元素是32位，有些小数无法使用二进制系统精确表示（比如1.337），检查该小数的 64 位浮点数和 32 位浮点数是否相等会失败，这时就需要使用Math.fround来将 64 位的浮点数转换为 32 位浮点数，再进行对比。比如0.1 + 0.2 === 0.3 就可以将两个浮点数转换成 32 位浮点数进行比较。
30. Math.imul(a, b)函数将两个参数a, b分别转换为 32 位整数，相乘后返回 32 位结果。
31. Math.clz32(x) 函数返回数字x转换成 32 位无符号整数的二进制形式后，开头的 0 的个数，clz32是CountLeadingZeroes32的缩写，NaN, Infinity, -Infinity的转换为0，结果即为32。如果 x 不是Number类型，则它首先会被转换成Number类型。JavaScript没有提供计算前导1的个数的数学函数方法，但是可以通过对数字x按位取反再传递给Math.clz32(~x)来得到。
32. Math.max(value0, value1, /* … ,*/ valueN)函数返回给定数值序列中最大的数。如果任一参数不能转换为数值，则返回 NaN。如果没有提供参数，返回 -Infinity。Math.max.length 为 2，表明形参个数为2，旨在处理至少两个参数。如果数组有太多的元素，展开语法（...）和 apply 都将失败或返回错误的结果，因为它们试图将数组元素作为函数形参传递，因为函数形参个数存在限制会被截断，而reduce解决方案不存在这个问题。

![](../../../public/front-end/basics/javascript/97.png)

33. Math.min(value0, value1, /* … ,*/ valueN)和Math.max的区别在于返回数值序列中的最小值。如果没有提供参数，返回Infinity。
34. Math.random() 函数返回一个`[0, 1)`范围内的伪随机浮点数。实现为随机数生成算法选择初始种子，用户不能选择或重置种子。Math.random()并不提供加密安全的随机数。不要将它们用于与安全有关的任何事情。请使用Web Crypto API的window.crypto.getRandomValues()方法。

![](../../../public/front-end/basics/javascript/98.png)

### Function（参考函数相关）

### Map

Map 对象保存键值对，并且能够记住键的原始插入顺序，继承自Function。任何值（对象或者基本类型）都可以作为一个键或一个值。Map 中的一个键只能出现一次；Map 对象按键值对迭代，迭代按插入顺序进行。规范要求 map 实现“平均访问时间与集合中的元素数量呈次线性关系”。因此，它可以在内部表示为哈希表（使用 O(1) 查找）、搜索树（使用 O(log(N)) 查找）或任何其他数据结构，只要复杂度小于 O(N)。

设置对象属性同样适用于 Map 对象，但不会改变 Map 的数据结构，它使用的是通用对象的特性，正确的存储数据到 Map 中的方式是使用 Map.prototype.set(key, value) 方法。

使用 Array.from 函数或展开运算符可以将一个 Map 对象转换成一个二维键值对数组：Array.from(map)或[...map]。

Map 对象间可以进行合并new Map([...firstMap, ...secondMap])，但是会保持键的唯一性。Map对象可以通过new Map(map)进行浅复制。
Map中键的比较基于零值相等算法，即在同值相等（Object.is）的基础上认为 0、-0、+0都相等。

Object和Map都允许按键存取一个值、删除键、检测一个键是否绑定了值。区别在于：
1. 意外的键：Map默认情况不包含任何键。只包含显式插入的键。Object 有一个原型，原型链上的键名有可能和对象上的设置的自有键名产生冲突（但可以通过Object.create(null)创建一个没有原型的对象）。
2. 键的类型：Map 的键可以是任意值，包括函数、对象或任意基本类型。Object 的键必须是一个 String 或是 Symbol。
3. 键的顺序：Map 中的键是有序，迭代时以插入的顺序返回键值对。Object 的键目前是有序的，但该顺序时复杂的，没有可以迭代对象所有属性的机制，for-in 仅包含了可枚举的以字符串为键的属性；Object.keys 仅包含了对象自身的可枚举的以字符串为键的属性；Object.getOwnPropertyNames 包含了所有以字符串为键的属性；Object.getOwnPropertySymbols 包含的是以 Symbol 为键的属性。
4. Size：Map 的键值对个数轻松通过size属性获得。Object 的键值对个数只能手动计算。
5. 迭代：Map 是可迭代的，可直接使用for...of迭代。Object没有实现迭代协议，不能直接使用for...of，只能使用for...in或自己实现迭代协议或迭代Object.keys/Object.values/Object.entries等等的返回数组。
6. 性能：Map在频繁增删键值对的场景下表现更好。Object则未对此做出优化。
7. 序列化和解析：Map没有原生序列化和解析的支持，但可以借助SON.stringify()和JSON.parse()的replacer和receiver进行处理特殊处理。由 Object 到 JSON 的序列化和由 JSON 到 Object 的解析的原生支持分贝是 JSON.stringify()和JSON.parse()。

![](../../../public/front-end/basics/javascript/99.png)

Map(iterable) 构造函数用于创建 Map 对象，且只能用 new 构造，否则会抛出 TypeError。iterable是可迭代对象，而且每个条目是对象即可（如果是空对象，则生成的键值都是undefined）。如果不指定此参数或其值为 null，则新的 WeakSet 为空。

**Map的静态属性与方法**：
1. get Map[@@species]访问器属性（即Map[Symbol.species]）会返回一个 Map 构造函数。该访问器属性允许子类覆盖对象的默认构造函数。

**map 的原型属性与方法**：
1. Map.prototype.size是只读属性，返回 Map 对象的成员数量。
2. Map.prototype.clear()方法会移除 Map 对象中的所有元素，返回值为undefined。
3. Map.prototype.delete(key)方法用于移除 Map 对象中指定key的键值对。如果 Map 对象中的元素存在并已被移除，则为 true；如果该元素不存在，则为 false。
4. Map.prototype.get(key)方法从 Map 对象返回指定key的值。如果键在 Map 对象中找不到，则返回 undefined。如果与所提供的键相关联的值是一个对象，那么获得的将是该对象的引用。但持有原始对象的引用实际上意味着对象不能被垃圾回收，这可能会导致意外的内存问题。如果希望存储在映射中的对象具有与原始对象相同的生命周期，请考虑使用 WeakMap。
5. Map.prototype.has(key)方法返回一个布尔值，指示具有指定键key的元素是否存在于Map中。
6. Map.prototype.set(key, value)方法为 Map 对象添加或更新一个指定键（key）和值（value）的键值对，并返回Map对象（因此可以链式调用）。key与value均可以是任意类型。
7. Map.prototype[@@iterator]()是Map实现的迭代协议，使得map对象被for..of直接使用，其初始值与 Map.prototype.entries 的初始值是同一个函数对象。也可以写成Map.prototype[Symbol.iterator]()。
8. Map.prototype.keys()方法返回一个新的迭代器对象，该对象包含按插入顺序排列的 Map 对象中每个元素的key键。
9. Map.prototype.values()方法返回一个新的迭代器对象，该对象包含按插入顺序排列的 Map 对象中每个元素的 value 值。
10. Map.prototype.entries()方法返回一个新的迭代器对象，其中包含 Map 对象中按插入顺序排列的每个元素的 [key, value] 对。
11. Map.prototype.forEach(callbackFn[, thisArg])方法按照插入顺序依次对 Map 中每个键/值对执行一次给定的函数callback，它不会对被删除的键执行函数，然而，它会对每个值为 undefined 的键执行函数。每个值只被访问一次，除非它在 forEach 结束前被删除并被重新添加。callbackFn 不会对在被访问前就删除的元素执行。在 forEach 结束前被添加的元素都将会被访问。callback 具有如下的可选参数（Array.prototype.forEach 的 callback 要求第一个值element必传）：每个迭代的值value、每个迭代的键 key、正在迭代的 map。

### WeakMap

WeakMap 对象是一组键/值对的集合，其键必须是对象，而值可以是任意的，其中的键是弱引用的（当键所指对象没有其他地方引用的时候，它会被 GC 回收掉）。与Map对象区别在于WeakMap的键是不可枚举的，不可迭代，不提供列出其键的方法（比如entries/keys/values/@@iterator/forEach等），也没有size属性，也没有Map中移除所有元素的clear方法。WeakMap可以用于存储一个对象的私有数据或隐藏实施细节。
在 JavaScript 里，map API 可以通过共用两个数组（一个存放键，一个存放值）来实现。给这种 map 设置值时会同时将键和值添加到这两个数组的末尾。从而使得键和值的索引在两个数组中相对应。当从该 map 取值的时候，需要遍历所有的键，然后使用索引从存储值的数组中检索出相应的值。首先赋值和搜索操作都是 O(n) 的时间复杂度（n 是键值对的个数）。其次可能会导致内存泄漏，因为数组会一直引用着每个键和值。这种引用使得垃圾回收算法不能回收处理。相比之下，原生的 WeakMap 持有的是每个键对象的“弱引用”，意味着在没有其他引用存在时垃圾回收能正确进行，也正是由于这样的弱引用，WeakMap 的 key 是不可枚举的。

WeakMap([iterable]) 构造函数用于创建 WeakMap 对象，且只能用 new 构造，否则会抛出 TypeError。iterable是一个二维数组或者其他可迭代对象，且元素是键值对。如果不指定此参数或其值为 null，则新的 WeakSet 为空。

**weakMap的原型方法**：
1. WeakMap.prototype.delete(key)方法可以从一个 WeakMap 对象中删除指定key的元素。如果成功删除，返回 true，否则返回 false。
2. WeakMap.prototype.get(key)方法返回 WeakMap 指定key的元素的值，如果 WeakMap 对象找不到这个键则返回 undefined。
3. WeakMap.prototype.has(key)方法根据 WeakMap 对象的元素中是否存在 key 键返回一个 boolean 值。
4. WeakMap.prototype.set(key, value)方法根据指定的 key 和 value 在 WeakMap对象中添加新/更新元素，并返回该WeakMap对象。key必须是对象。

![](../../../public/front-end/basics/javascript/100.png)

### Set

Set 对象允许存储任何类型的唯一值，无论是原始值或者是对象引用。可以按照插入的顺序迭代它的元素，Set 中的元素是只会出现一次。从ES6开始，Set使用零值相等算法判断元素的唯一性。

使用 Array.from 函数或展开运算符可以将一个Set对象转换成一个value数组：Array.from(set)或[...set]。

Set([iterator]) 构造函数用于创建 Set 对象，只能用 new 构建，否则会抛出 TypeError。iterable如果传递一个可迭代对象，它的所有元素将不重复地被添加到新的 Set 中，如果不指定此参数或其值为 null，则新的 Set 为空。

**Set的静态属性与方法**：
1. get Set[@@species]子构造函数或许会重载这个属性以至改变构造函数的赋值。子构造函数或许会重载这个属性以至改变构造函数的赋值。

**set的原型的属性与方法**：
1. Set.prototype.size是只读属性，返回 Set 对象的成员数量。
2. Set.prototype.clear()方法会移除 Set对象中的所有元素，返回值为undefined。
3. Set.prototype.delete(value)方法用于移除 Set 对象中指定value。成功删除返回 true，否则返回 false。对象是通过引用比较的，所以如果没有对原始对象的引用，就必须通过迭代或遍历检查单个属性来删除。
4. Set.prototype.has(value)方法返回一个布尔值，指示的元素value是否存在于Set中。
5. Set.prototype[@@iterator]()是Set实现的迭代协议，使得Set对象被for..of直接使用，其初始值与Set.prototype.values 的初始值是同一个函数对象。也可以写成Set.prototype[Symbol.iterator]()。
6. Set.prototype.keys()方法是Set.prototype.values() 方法的别名。
7. Set.prototype.values()方法返回一个新的迭代器对象，该对象按插入顺序包含 Set 对象中每个元素的值。
8. Set.prototype.entries()方法返回一个新的迭代器对象，这个对象包含的元素是类似 [value, value] 形式的数组，value 是Set对象中的每个元素，迭代器对象元素的顺序即Set对象中元素插入的顺序。
9. Set.prototype.add(value)方法如果Set对象中不存在指定值value，将作为新元素插入到 Set 对象中，并返回Set对象。
10. Set.prototype.forEach(callbackFn[, thisArg])方法对 Set 对象中的每个值按插入顺序执行一次提供的函数callback，返回undefined。它不会对被删除的键执行函数，然而，它会对每个值为 undefined 的键执行函数。callback 被调用时带有三个可选参数：（Array.prototype.forEach的callback要求第一个值element必传）：Set 中正在处理的当前元素value和key（因为 Set 中没有键，所以 value 会被共同传递给这两个参数）、调用forEach的Set对象。每个值都访问一次，除非在 forEach() 完成之前删除并重新添加它。在访问之前删除的值不会调用 callback。在 forEach() 完成之前添加的新值将被访问。

**实现集合的基本操作**：

**1.判断子集**：

![](../../../public/front-end/basics/javascript/101.png)

**2.并集**：

![](../../../public/front-end/basics/javascript/102.png)

**3.交集**：

![](../../../public/front-end/basics/javascript/103.png)

**4.相对补集，即差集**：

![](../../../public/front-end/basics/javascript/104.png)

**5.绝对补集，要求B是A的子集**：

![](../../../public/front-end/basics/javascript/105.png)

### WeakSet

WeakSet 对象允许将弱引用对象存储在一个集合中。和 Set 对象的主要区别有：
1. WeakSet 只能是对象的集合，Set可以是任何类型的值。
2. WeakSet 集合中对象的引用为弱引用。如果没有其它的对 WeakSet 中对象的引用，那么这些对象会被当成垃圾回收掉。WeakSet 中没有存储value对象的列表，因此WeakSet 是不可枚举的，也就没有提供value列表的方法（比如entries/keys/values/@@iterator/forEach）。也没有size属性，也没有Set中移除所有元素的clear方法。

由于对象的数量或它们的遍历顺序不重要，尤其是在涉及大量对象时，WeakSet 比 Set 更适合跟踪对象引用，检测是否循环引用。

WeakSet([iterable]) 构造函数用于创建 WeakSet 对象，且只能用 new 构造，否则会抛出 TypeError。iterable是一个可迭代对象，如果不指定此参数或其值为 null，则新的 WeakSet 为空。

weakSet的原型方法：
1. WeakSet.prototype.delete(value)方法从 WeakSet 对象中移除指定的value对象。如果在 WeakSet 对象中成功移除元素则返回 true。如果 key 没有在 WeakSet 中找到或者 key 不是一个对象，则返回 false。
2. WeakSet.prototype.has(value)方法根据 WeakSet 对象的元素中是否存在 value对象返回一个 boolean 值。
3. WeakSet.prototype.add(value)方法在 WeakSet 对象的最后一个元素后添加新的value对象。返回该WeakSet 对象。

### Promise（ES6）

Promise 对象用于表示一个异步操作的最终完成（或失败）及其结果值。**Promise 可以解决回调地狱的问题**（即**多层嵌套的问题和在同一方法中处理完成或失败逻辑的问题**），通过链式回调的方式使得回调变得可控。**Promise 的出现是为了统一JS中的异步实现方案，异步是JS中的常见场景，统一实现方案，不仅可以有效的降低心智负担，还可以让不同的异步场景相互联动**。Promise 继承自 Function。Promise 可以在 Web Worker 中使用。

一个Promise处于以下状态中的一种：
1. pending（待定）：初始状态，既不完成也不拒绝。
2. fulfilled（已完成）: 意味着操作成功完成。
3. rejected（已拒绝）: 意味着操作失败。

![](../../../public/front-end/basics/javascript/106.png)

pending状态的 Promise 对象要么会通过一个值被fulfilled（已完成），要么会通过一个原因（错误）被rejected（已拒绝）。then方法绑定处理方法onFulfilled或onRejected和Promise的状态不存在竞态条件，可以在任一状态绑定该微任务。Promise.prototype.then、Promise.prototype.catch、Promise.prototype.finally方法均返回的是新Promise，因此支持链式调用，也被称为复合（composition），这些方法的回调是要等调用方法的原始Promise状态改变为对应状态才会将对应状态的回调放入微队列。同一个promise也可以通过多次调用 Promise.prototype.then 添加多个回调函数，会按照插入顺序进行执行。

当Promise被拒绝时，会派发PromiseRejectionEvent 接口创建的事件（继承自Event）到全局作用域（window或Worker）中，如果有可用的有 rejection 处理程序时派发的是 rejectionhandled 事件，如果没有可用的rejection处理程序时派发的是unhandledrejection事件，这两个事件均包含promise属性和 reason属性分别表示被拒绝的 Promise和被拒绝的原因的。

Promise() 只能用 new 构造。尝试在没有 new 的情况下调用它会引发 TypeError。new Promise(executor) 构造函数主要用于包装不支持 promise的函数executor（返回值不是 Promise）。executor的函数签名为**function(resolutionFunc, rejectionFunc){ // 通常是一些异步操作，是一段将输出与 promise 联系起来的自定义代码}**。在executor中，已解决（resolved）时去调用resolutionFunc(value)，已拒绝时（rejected）时去调用rejectFunc(reason)。executor中的异步操作通过 resolutionFunc 或 rejectionFunc 产生的副作用与Promise实例进行通信。如果在 executor 中抛出一个错误，该 promise 将被同步拒绝，除非 resolveFunc 或 rejectFunc 已经被调用，而且resolveFunc 或 rejectFunc如果是同步调用，Promise则会同步变成已完成或已拒绝，只有在异步函数中调用resolveFunc 或 rejectFunc才会异步的变成已完成或已拒绝。而且，executor 的返回值将被忽略。executor 函数在Promise构造函数执行时立即被调用。

![](../../../public/front-end/basics/javascript/107.png)

**Promise的静态属性与方法**：
1. get Promise[@@species]访问器属性返回用于从 promise 方法构造返回值的构造函数。该访问器属性允许子类覆盖对象的默认构造函数。如果this.constructor是undefined，或者this.constructor[Symbol.species]是undefined或null，则then()、catch()和finally()均是使用默认构造函数Promise()来构造新的 promise 对象，否则使用this.constructor[Symbol.species]来构造新的 promise 对象。
2. Promise.resolve(value)方法返回一个以给定值value解析后的 Promise 对象。如果value是promise，则直接返回该value；如果value是 thenable对象（即value有then方法），返回一个状态跟随value的状态的Promise对象；其他情况返回以value已完成（fulfilled）的Promise对象。注意：不要在resolve为自身的 thenable对象上调用Promise.resolve。这将导致无限递归。

![](../../../public/front-end/basics/javascript/108.png)

3. Promise.reject(reason) 方法返回一个以reason作为拒绝原因的新 Promise 对象，无论reason的类型是什么。

![](../../../public/front-end/basics/javascript/109.png)

4. Promise.race(iterable) 方法返回一个当可迭代对象iterable中的某个 promise （如果不是Promise则会被包装为Promise异步地变为完成）解决或拒绝就会对应的解决或拒绝promise。如果可迭代对象iterable是空的，则返回的 promise 将永远等待。如果iterable中存在非promise值或已完成的promise或已拒绝的promise，则Promise将以迭代到的第一个这样的值完成或拒绝。

![](../../../public/front-end/basics/javascript/110.png)

5. Promise.all(iterable)方法将由多个promise组成的可迭代对象iterable作为输入并返回单个 Promise。
    1. 当且仅当如果iterable是一个空的可迭代对象，则返回一个同步已完成（resolved）状态的 Promise，Promise结果为空数组。
    2. 如果iterable不包含任何 promise，则返回一个异步完成（resolved）Promise，Google 注意：Chrome 58返回一个已完成（resolved）状态的 Promise。
    3. 其它情况下返回一个处理中（pending）的Promise。这个返回的 promise 之后会在所有的 promise 都完成（对于不是Promise的则会被包装为Promise异步地变为完成））或有一个 promise 失败时异步地变为完成或失败。返回值将会按照iterable内的 promise 顺序排列，而不是由 promise 的完成顺序决定。

![](../../../public/front-end/basics/javascript/111.png)

6. Promise.any(iterable)将由多个promise组成的可迭代对象iterable作为输入并返回单个 Promise。Promise.any() 方法依然是实验性的。它当前处于 TC39 第四阶段草案（Stage 4）。
    1. 当且仅当如果iterable是一个空的可迭代对象，则返回一个同步已拒绝（rejected）状态的 Promise，其拒因是一个 AggregateError 实例。
    2. 如果iterable不包含任何 promise，则返回一个异步完成（resolved）Promise，
    3. 其它情况下返回一个处理中（pending）的Promise。这个返回的 promise 之后会在任意一个 promise完成则异步地变为完成（如果不是Promise则会被包装为Promise异步地变为完成），而在所有的 promise 都失败时异步地变为失败，其拒因是一个 AggregateError 实例，用于把单一的错误集合在一起。

7. Promise.allSettled(iterable)将由多个promise组成的可迭代对象iterable作为输入并返回单个 Promise。
    1. 当且仅当如果iterable是一个空的可迭代对象，则返回一个同步已完成（resolved）状态的 Promise，Promise结果为空数组。
    2. 如果iterable不包含任何 promise，则返回一个异步完成（resolved）Promise。
    3. 其它情况下返回一个处理中（pending）的Promise。这个返回的 promise 之后会在所有的 promise 都完成或失败时完成，返回的Promise 的结果是带有描述每个 promise 结果的对象数组（每个对象将会按照iterable内的 promise 顺序排列，而不是由 promise 的完成顺序决定）：
        1. status: 一个字符串，要么是 "fulfilled"，要么是 "rejected"，表示 promise 的最终状态。
        2. value：仅当 status 为 "fulfilled"才存在。
        3. reason：仅当 status 为 "rejected"才存在。

![](../../../public/front-end/basics/javascript/112.png)

**promise的原型方法**：
1. **Promise.prototype.then(onFulfilled[, onRejected])** 方法接受**原 Promise** 的成功情况的回调函数onFulfilled（可选）和失败情况的回调函数onRejected（可选），并返回一个新Promise：
    1. onFulfilled是当**原 Promise** 变成已完成状态（fulfilled）执行的函数，唯一参数是已完成的最终结果（the fulfillment value），如果onFulfilled不是函数（包括undefined），则会在内部被替换为 **(x) => x**（即原样返回原Promise 已完成的最终结果的函数）。
    2. onRejected是当 Promise 变成拒绝状态（rejected）时调用的函数。唯一参数是拒绝的原因（rejection reason）。如果onRejected不是函数（包括undefined），则会在内部被替换为一个 "Thrower" 函数 (err) => { throw err; }。
    3. then方法是立即返回一个新的处理中pending的Promise，与调用then方法的原Promise的状态无关，而是取决于onFulfilled或onRejected处理函数的执行结果：
        1. 如果onFulfilled或onRejected处理函数返回一个值value或没有返回值（即undefined），**新 Promise** 以value（没有返回值即undefined）作为其结果变成已完成状态（fulfilled）。
        2. 如果onFulfilled或onRejected处理函数中抛出错误，**新 Promise** 以该错误为拒绝原因变成已拒绝状态（rejected）。
        3. 如果onFulfilled或onRejected返回的是一个“已完成（或已拒绝）状态的Promise”，**新 Promise** 将以“此已完成（已拒绝）状态的Promise”结果值（或原因）作为其结果（或原因）**异步的（V8中是放入微队列中）**变成已完成（或已拒绝）状态。
        4. 如果onFulfilled或onRejected返回的是一个“pending 的Promise”，新Promise的状态**异步的（V8中是放入微队列中）**跟随该“pending 的Promise”的状态。

![](../../../public/front-end/basics/javascript/113.png)

2. Promise.prototype.catch(onRejected) 方法处理拒绝的情况，并返回一个新的Promise。**事实上，promise.catch(onRejected) 内部调用并返回promise.then(undefined, onRejected)**。onRejected函数拥有一个参数：reason是 rejection 的原因。如果 onRejected 抛出一个错误或return一个失败的 Promise，catch方法返回的 Promise 被 rejected；否则，catch方法返回的已完成（resolved）的 Promise。catch方法能捕获executor中的同步错误和rejectFunc调用，以及then/catch/finally回调方法中抛出的错误或失败的Promise返回；但不能捕获executor中使用异步方法（比如setTimeout/setInterval）抛出的错误。因此，建议总是使用catch()方法，而不使用then()方法的第二个参数。

![](../../../public/front-end/basics/javascript/114.png)

3. Promise.prototype.finally(onFinally) 方法在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数onFinally，并且finally方法返回一个新的Promise。finally(onFinally) 虽然与 .then(onFinally, onFinally) 类似，不同之处在于 finally 的回调函数中不接收任何参数；如果在 finally 的回调函数中 throw错误或返回被拒绝的 promise，新的 promise以错误或拒绝原因变为拒绝状态；否则新的promise的状态跟随调用finally方法的promise。

![](../../../public/front-end/basics/javascript/115.png)

混用旧式回调（比如setTimeout）和 Promise 可能会造成运行时序问题，可以使用Promise对其进行封装（实现sleep函数）。

![](../../../public/front-end/basics/javascript/116.png)

Promise 链式编程最好保持扁平化，不要嵌套 Promise，在编写 Promise 链时，一个好的经验法则是总是返回或终止 Promise 链，并且一旦得到一个新的 Promise，返回它。

![](../../../public/front-end/basics/javascript/117.png)

**任务按顺序执行**，即任一任务函数可以是异步或同步的，它们能被保证按顺序执行。composeAsync函数将会接受任意数量的函数作为其参数，并返回一个新的函数接受一个通过 composition pipeline 传入的初始值。

![](../../../public/front-end/basics/javascript/118.png)

**Promise 局限性**：
1. 注册**完成或失败处理函数**后，无法取消（有支持“取消”FetchAPI 的 promise 的 AbortController API，但它不是 Promise API 的一部分） 
2. pending状态下，不知道处理进展 
3. 一个promise只能被完成或失败一次，不适合不断发生的事件。

1. **并发请求控制**
对于短时间可能发送大量网络请求的场景，为了节约资源，需要进行请求的并发控制。设置最大并发数，当某个请求完成时，才发起新的请求。

![](../../../public/front-end/basics/javascript/119.png)

![](../../../public/front-end/basics/javascript/120.png)

2. **节流控制**
通过发布订阅的设计模式，对请求的结果进行复用，适用于在短时间内发送多个相同请求的场景。

关键在于如果有正在进行的请求，则新建一个 promise，将 resolve 和 reject 存到 listeners 数组中，订阅请求的结果。

![](../../../public/front-end/basics/javascript/121.png)

3. **淘汰请求**
根据搜索词展示关联词的场景，短时间会发送大量的请求，这时要保证先发起的请求如果后返回是需要淘汰掉的。可以通过比较请求返回时，请求的序号是不是比上一个有效请求大。如果不是，则说明一个后面发起的请求先响应了，当前的请求应该丢弃。

![](../../../public/front-end/basics/javascript/122.png)

### Generator

Generator 对象只能由生成器函数返回并且它符合**可迭代协议**和**迭代器协议**。Generator 对象继承自Function。

**可迭代协议**允许 JavaScript 对象定义或定制它们的迭代行为。**要成为可迭代对象，该对象必须实现 @@iterator 方法**，这意味着对象（或者它原型链上的某个对象）必须有一个键为 @@iterator 的属性（一个无参数的函数，其返回值必须是一个**符合迭代器协议**的对象），可通过常量 Symbol.iterator 访问该属性。如果一个可迭代对象的 @@iterator 方法不能返回迭代器对象，则此**可迭代对象**被认为是一个不符合标准的可迭代对象，可能会导致某些运行时异常。

**迭代器协议**定义了产生一系列值（无论是有限个还是无限个）的标准方式，值为有限个时，所有的值都被迭代完毕后，则会返回一个默认返回值。**要成为迭代器对象，必须实现 next 方法**，该方法是无参数或者接受一个参数的函数，并返回符合 IteratorResult 接口的对象，可选地，迭代器也实现了 return(value) 和 throw(exception) 方法。所有迭代器协议的方法（next()、return() 和 throw()）都应返回实现 IteratorResult 接口的对象。它必须有以下属性：
1. done 属性表明迭代器是否迭代完毕的布尔值。
2. value 属性是迭代器返回的任何 JavaScript 值，对应于生成器函数中yield关键字后面的表达式的值（如果省略表达式，则值为 undefined）。done 为 true 时可省略，如果value依然存在，即为迭代结束之后的默认返回值。
3. done与value均不是严格要求的，如果返回没有任何属性的对象，则等价于 { done: false, value: undefined }，但是如果返回一个非对象返回值，将会抛出 TypeError（"iterator.next() returned a non-object value"）错误。

因为几乎JavaScript中所有的语法和 API （比如for..of循环、数组展开语法、yield*和数组解构赋值）都期待可迭代对象而不是迭代器，**要使迭代器对象可迭代即成为可迭代迭代器，只需在迭代器对象上实现一个返回this的 [@@iterator]() 方法**，比如Generator对象。

同样存在用于异步迭代的协议——**异步可迭代协议和异步迭代器协议**，区别在于异步可迭代协议必须实现的方法是[@@asyncIterator]()（一个无参数的函数，其返回值为一个符合**异步迭代器协议**的对象,即所有异步迭代器协议的方法（next()必须实现、return() 和 throw()）都返回的是以实现 IteratorResult 接口的对象为最终结果的Promise）。在不是同步迭代的异步迭代对象（即它有 [@@asyncIterator]() 但没有 [@@iterator]()）上使用 for...of、数组展开等将抛出 TypeError：x is not iterable错误。

内置的可迭代迭代器对象包括String、Array、TypedArray、Map、Set，类数组对象（arguments和DOM集合类型），各自的prototype 对象都继承了一个未暴露的公共类（构造函数是Object）上的[Symbol.iterator]() { return this; } 方法。目前，没有内置的异步可迭代对象。生成器函数返回Generator对象，它们是可迭代的迭代器。异步生成器函数返回异步生成器对象，它们是异步可迭代的迭代器。当内置语法迭代一个可迭代迭代器对象，并且最后的结果中 done 为 false（即迭代器能够生成更多值）但不需要更多值时（在 for...of 循环中遇到 break 或 return，或者数组解构中的标识符只是有限个的），如果可迭代迭代器对象中存在return 方法，将调用 return 方法。由于Symbol.iterator是定义在原型上的所有，可以为内置可迭代对象的实例编写自有的[Symbol.iterator]达到重写该实例对象上的可迭代行为的目的。

`yield* [[expression]]` 用于将执行权委托给另一个generator 或可迭代对象。整个yield* 表达式的值是当其后面的迭代器关闭时返回的值（即done为true时）。

**Generator的原型属性与方法**：
1. Generator.prototype[@@toStringTag] 属性的初始值是字符串 "Generator"。该属性被 Object.prototype.toString()使用。
2. Generator.prototype.next(v)方法接受可选参数v并返回一个包含属性 done 和 value 的对象，其中v对应于生成器函数中yield关键字的前面返回值。
3. Generator.prototype.return(v)方法接受可选参数v并始终返回一个包含属性 done 为true和 value 为 v 的对象，使生成器是完成状态。
4. Generator.prototype.throw(exception)方法接受可选参数exception用来向生成器抛出异常，如果抛出的异常被 try...catch 捕获才可恢复生成器的执行并返回带有 done 及 value 两个属性的对象。如果抛出的异常没有被 try...catch 捕获，异常将从生成器函数中抛出，且此次不会返回值，生成器将变成完成状态。

### Proxy

Proxy 对象用于创建一个对象的代理，从而实现拦截并重新定义该对象的基本操作（如属性查找、赋值、枚举、函数调用等）。对象是属性的集合。然而语言不提供任何机制来直接操作对象中存储的数据，相反，与对象的所有交互最终都归结为对内部方法之一的调用，并且它们都可以通过Proxy进行自定义。所有内部方法均由语言本身调用，并且不能在 JavaScript 代码中直接访问。所有对象都有的内部方法：
1. `[[GetPrototypeOf]]`：对应handler为getPrototypeOf()。
2. `[[SetPrototypeOf]]`：对应handler为setPrototypeOf()。
3. `[[IsExtensible]]`：对应handler为isExtensible()。
4. `[[PreventExtensions]]`：对应handler为preventExtensions()。
5. `[[GetOwnProperty]]`：对应handler为getOwnPropertyDescriptor()。
6. `[[DefineOwnProperty]]`：对应handler为defineProperty()。
7. `[[HasProperty]]`：对应handler为has()。
8. `[[Get]]`：对应handler为get()。
9. `[[Set]]`：对应handler为set()。
10. `[[Delete]]`：对应handler为deleteProperty()。
11. `[[OwnPropertyKeys]]`：对应handler为ownKeys()。

**函数对象还具有以下内部方法**：
1. `[[Call]]`：对应handler为apply()。
2. `[[Construct]]`：对应handler为construct()。

**Proxy的静态属性与方法**：
1. Proxy.revocable(target, handler) 方法接受一个target参数和handler参数，返回一个包含了代理对象proxy（和使用new Proxy(target, handler) 创建的代理对象唯一区别在于可撤销）和该代理对象的撤销方法revoke（调用的时候不需要加任何参数）的对象：
    1. 参数target是将用 Proxy 封装的目标对象，可以是任何类型的对象
    2. 参数handler是一个对象，其属性是一批可选函数，这些函数定义了对应的操作被执行时代理对象的行为。

    一旦代理对象被撤销，和它关联的目标对象以及处理器对象都有可能被垃圾回收掉，在它身上执行任何的可代理操作都会抛出 TypeError 异常，但执行可代理操作以外的操作不会抛出异常，再次调用撤销方法 revoke则不会有任何效果，但也不会报错。

new Proxy(target, handler)构造函数用来创建 Proxy 对象，接受两个参数target和handler。target是要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理），handler是一个通常以函数方法作为属性的对象，各方法分别定义了在执行各种操作时代理 p 的行为，这些方法也称为捕捉器。所有的捕捉器是可选的。如果没有定义某个捕捉器，那么就会保留源对象的默认行为，也就是说一个空的 handler 参数将会创建一个与被代理对象行为几乎完全相同的代理对象。handler对象内的方法：
1. const proxy = new Proxy(target, { apply(target, thisArg, argumentsList) { } } )：apply方法用于拦截目标函数target的调用。如果定义了apply捕捉器，那么在执行proxy(...args)、Function.prototype.apply、Function.prototype.call和Reflect.apply时会触发apply捕捉器的行为，否则执行target的默认行为。其中target是必须是可调用的函数否则会抛出TypeError错误，thisArg是proxy被调用时的上下文对象，argumentsList是被调用函数proxy的参数数组。
2. const P = new Proxy(target, { construct(target, argumentsList, newTarget) { } })：construct方法用于拦截 new 操作符和Reflect.construct()。construct方法必须返回一个对象，否则代理P将会抛出TypeError错误。target必须具有 `[[Construct]]` 内部方法（即 new target 必须是有效的），否则new proxy 会抛出TypeError错误。argumentsList是new proxy 的参数列表。newTarget是构造函数P即代理对象本身。方法内的this绑定在处理器对象handler上。
3. const proxy = new Proxy(target, { defineProperty(target, property, descriptor) {} })：defineProperty方法用于拦截对象的Object.defineProperty()、Object.defineProperties()、Reflect.defineProperty()和proxy.property='value' 操作或调用 `[[DefineOwnProperty]]` 内部方法的任何其他操作。必须返回一个表示定义该属性的操作成功与否的Boolean。target是目标对象，而且调用Object.defineProperty()或Reflect.defineProperty()或Object.defineProperties()时传递的 descriptor中除enumerable、configurable、writable、value、get、set之外的非标准描述符属性会被忽略。property是待定义或修改其描述的属性名。descriptor是待定义或修改的属性的描述符。方法内的this绑定在处理器对象handler上。以下情况proxy会抛出TypeError：
    1. 在严格模式下，false 作为 handler.defineProperty 方法的返回值。
    2. 如果目标对象不可扩展时添加属性。
4. const proxy = new Proxy(target, { deleteProperty(target, property) { } })：方法用于拦截对对象属性的 delete 操作和Reflect.deleteProperty()，必须返回一个表示该属性是否被成功删除的Boolean。target是目标对象。property是待删除的属性名。如果目标对象的属性是不可配置的，那么该属性不能被删除，proxy 将会抛出一个 TypeError。方法内的this 被绑定在 handler 上。
5. const proxy = new Proxy(target, { get(target, property, receiver) { } })：方法用于拦截对象的读取属性和Reflect.get()操作，可以返回任何值。target是目标对象。property是被获取的属性名。receiver是proxy 或者继承 proxy 的对象。**如果property对应的目标对象的属性是不可写且不可配置的，则get方法返回的值必须与该目标属性的值相同**；如果property对应的目标对象的属性没有配置getter方法，则get方法返回的值必须为 undefined； 否则都会抛出TypeError错误。方法内的this 被绑定在 handler 上。
6. const proxy = new Proxy(target, { getOwnPropertyDescriptor(target, prop) { } })：getOwnPropertyDescriptor方法用于拦截对象的Object.getOwnPropertyDescriptor()和Reflect.getOwnPropertyDescriptor()操作，必须返回一个 object 或 undefined。如果属性是目标对象的不可配置属性或目标对象不可扩展时，只能返回object。如果属性不是目标对象的属性且目标对象不可扩展，只能返回undefined。如果属性不是目标对象的自身属性或者时目标对象的可配置属性，只能返回configurable为true的描述符对象。target是目标对象。prop是应检索其描述符的属性名。方法内的this 被绑定在 handler 上。
7. `const proxy = new Proxy(target, { getPrototypeOf(target) { } }))`：getPrototypeOf方法用于拦截读取目标对象原型的Object.getPrototypeOf()、Reflect.getPrototypeOf()、Object.prototype.__proto__、Object.prototype.isPrototypeOf()和instanceof操作。方法的返回值必须是一个对象或者 null，而且如果目标对象是不可扩展的则该方法必须返回目标对象的原型对象，否则会抛出TypeError错误。target是目标对象。方法内的this 被绑定在 handler 上。
8. `const proxy = new Proxy(target, { has(target, prop) { } }))`：has方法是针对 in 操作符和Reflect.has()的代理方法，返回是否存在属性的boolean值。如果属性是目标对象的自有属性，而且该属性不可配置或者目标对象不可扩展，则该方法不能返回false，否则会抛出TypeError错误。target是目标对象。prop是需要检查是否存在的属性。方法内的this 被绑定在 handler 上。
9. `const proxy = new Proxy(target, { isExtensible(target) { } }))`：isExtensible方法用于拦截对目标对象的 Object.isExtensible()方法，返回值必须和Object.isExtensible(target) 相同，否则会抛出TypeError错误。target是目标对象。方法内的this 被绑定在 handler 上。
10. `const proxy = new Proxy(target, { ownKeys(target) { } }))`：ownKeys方法用于拦截 Reflect.ownKeys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()和Object.keys()操作，方法必须返回一个可枚举数组对象，且数组的元素类型必须是String或Symbol，且必须包含目标对象的所有不可配置的自有属性key。如果目标对象不可扩展，那么返回值必须包含且只包含目标对象自身属性的所有键。target是目标对象。方法内的this 被绑定在 handler 上。
11. `const proxy = new Proxy(target, { preventExtensions(target) { } }))`：preventExtensions方法用于拦截Object.preventExtensions()、Reflect.preventExtensions()、Object.seal()和Object.freeze()操作，并返回一个boolean值。方法仅在 Object.isExtensible(proxy) 为 false，即目标对象为不可扩展时返回 true，否则会抛出TypeError错误。target是目标对象。方法内的this 被绑定在 handler 上。
12. `const proxy = new Proxy(target, { set(target, property, value, receiver) { } })`：方法用于拦截对象的设置属性和Reflect.set()操作，方法应当返回一个属性是否设置成功的布尔值，在在严格模式下只能返回true否则抛出TypeError错误。target是目标对象。property是要被设置的属性名。value是要设置的属性值。receiver是proxy 或者继承 proxy 的对象。如果property对应的目标对象的属性是不可写且不可配置的，则不可修改proxy的值；如果property对应的目标对象的属性没有配置setter方法，则无法设置proxy该属性的值；在严格模式下set方法只能返回true; 否则都会抛出TypeError错误。方法内的this 被绑定在 handler上。
13. `const proxy = new Proxy(target, { setPrototypeOf(target, prototype) { } }))`：用来拦截设置目标对象的原型的 Object.setPrototypeOf()和Reflect.setPrototypeOf()操作，方法返回是否成功修改目标对象原型的boolean值。如果target是不可扩展的，则参数prototype必须和与 Object.getPrototypeOf(target)相同，否则会抛出TypeError错误。如果不想给目标对象设置对象设置一个新的原型，setPrototypeOf 方法可以返回 false，也可以抛出异常。target是目标对象。方法内的this 被绑定在 handler 上。

与内部插槽相关的实现（具有内部插槽的内置对象/私有类字段，比如Map, Set, Date, Promise）、严格相等运算符无法被代理。

### Reflect

Reflect 对象包含用于调用可拦截的 JavaScript 对象内部方法的静态方法。这些方法与Proxy handler的方法相同。Reflect 的主要用例是在Proxy handler中提供默认转发行为。Proxy handler用于拦截对象上的操作，它为对象内部方法提供自定义实现，而Reflect API用于调用相应的内部方法。Reflect继承自Object，Reflect不是构造函数，不能通过new 运算符或作为函数调用。和Math对象相同，Reflect的所有属性和方法都是静态的。Reflect 对象提供的静态方法与Proxy handler处理器的相同。

**Reflect的静态方法**：
1. Reflect.apply(target, thisArg, argumentsList) 通过指定的参数列表argumentsList（数组或类数组对象）和指定的上下文对象thisArg发起对目标函数target的调用并返回函数调用的结果。等同于Function.prototype.apply.call(target, thisArg, argumentsList)如果 target 对象不可调用，抛出 TypeError。相比Function.prototype.apply或Function.prototype.call，使用 Reflect.apply 方法会使代码更加简洁易懂。
2. Reflect.construct(target, argumentsList[, newTarget])方法相当于new target(...argumentsList)。target是被运行的目标构造函数。参数列表argumentsList是传递给target的类数组或数组。newTarget是作为新创建对象的原型对象的 constructor 属性，可选，默认值为 target。如果 target 或者 newTarget 不是构造函数，抛出TypeError,异常。obj = Reflect.construct(target, argumentsList, newTarget)与使用obj = Object.create(newTarget.prototype); target.apply(obj, argumentsList)来创建对象实例obj等效，如果前者不传newTarget则，后者即修改为Object.create(target.prototype)，区别在于后者构造函数中的new.target始终为undefined。
3. Reflect.defineProperty(target, propertyKey, descriptor)方法返回一个 Boolean，来说明该属性是否被成功定义，如果target不是 Object，抛出一个 TypeError。相比之下，Object.defineProperty 方法，如果成功则返回一个对象，否则抛出一个 TypeError。
4. Reflect.deleteProperty(target, propertyKey)方法允许删除目标对象target上的属性propertyKey，返回一个 Boolean 值表示该属性是否被成功删除。该方法几乎与非严格模式下的delete 操作符相同。如果target不是 Object将抛出TypeError错误。
5. Reflect.get(target, propertyKey[, receiver])方法通过函数调用的方式从目标对象target上读取属性propertyKey并返回属性的值，如果target对象中指定了getter，receiver则为getter调用时的this值。
6. Reflect.getOwnPropertyDescriptor(target, propertyKey)方法获取在对象target中给定的属性propertyKey的属性描述符，如果属性不存在则返回 undefined。如果target不是 Object将抛出TypeError错误。
7. Reflect.getPrototypeOf(target)方法返回指定对象target的原型（即内部的 `[[Prototype]]` 属性的值）。如果target不是 Object将抛出TypeError错误。
8. Reflect.has(target, propertyKey)方法返回一个 Boolean值指示指定对象target上是否存在此属性 propertyKey，作用与in操作符相同。如果target不是 Object将抛出TypeError错误。
9. Reflect.isExtensible(target)方法返回一个 Boolean 值表明该对象target是否可扩展（即是否能够添加新的属性）。如果target不是 Object将抛出TypeError错误。
10. Reflect.ownKeys(target) 方法返回一个由目标对象自身的属性键组成的数组。如果target不是 Object将抛出TypeError错误。它的返回值等同于 Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))。
11. Reflect.preventExtensions(target)方法返回一个 Boolean 值表明目标对象target是否成功被设置为不可扩展。如果target不是 Object将抛出TypeError错误。
12. Reflect.setPrototypeOf(target, prototype)方法返回一个 Boolean 值表明是否原型已经成功设置。如果 target 不是 Object ，或者prototype 既不是对象也不是 null，抛出一个 TypeError 异常。
13. Reflect.set(target, propertyKey, value[, receiver])方法以函数的方式在target上成功设置属性propertyKey的值为value，并返回一个 Boolean 值表明是否设置成功。如果target不是 Object将抛出TypeError错误。如果遇到 setter，receiver则为setter调用时的this值。

### Error

当运行时错误产生时，Error 对象会被抛出。Error 对象也可用于用户自定义的异常的基础对象。

**存在以下错误类型，均继承自Error**：
1. EvalError：代表了一个关于 eval() 全局函数的错误。此异常不再会被 JavaScript 抛出，但是 EvalError 对象仍然存在，以保持兼容性。EvalError 是一个可序列化对象，所以可以使用 structuredClone() 对它进行克隆，也可以使用 postMessage() 在 Worker 之间拷贝它。
2. RangeError：表示一个特定值不在所允许的范围或者集合中的错误。在以下的情况中，可能会遇到这个问题：
    1. 将不允许的字符串值传递给 String.prototype.normalize()，或
    2. 尝试使用 Array 构造函数创建一个具有不合法的长度的字符串，或
    3. 传递错误值到数值计算方法（Number.toExponential()、Number.toFixed() 或 Number.toPrecision()）。
3. ReferenceError：代表当一个不存在（或尚未初始化）的变量被引用时发生的错误。
4. SyntaxError：代表尝试解析不符合语法的代码的错误。当 Javascript 引擎解析代码时，遇到了不符合语法规范的标记（token）或标记顺序，则会抛出 SyntaxError。
5. TypeError：通常（但并不只是）用来表示值的类型非预期类型时发生的错误。以下情况会抛出 TypeError：
    1. 传递给运算符的操作数或传递给函数的参数与预期的类型不兼容；或
    2. 尝试修改无法更改的值；
    3. 尝试以不适当的方法使用一个值。
6. URIError：用来表示以一种错误的方式使用全局 URI 处理函数而产生的错误。
7. AggregateError：代表了包装了多个错误对象的单个错误对象。当一个操作需要报告多个错误时，例如 Promise.any()，当传递给它的所有承诺都被拒绝时，就会抛出该错误。
8. InternalError：表示出现在 JavaScript 引擎内部的错误，该特性是非标准的，仅firefox支持，请尽量不要在生产环境中使用它。通常描述某种数量过多的情况，例如：
    1. "too many switch cases"（过多 case 子句）；
    2. "too many parentheses in regular expression"（正则表达式中括号过多）；
    3. "array initializer too large"（数组初始化器过大）；
    4. "too much recursion"（递归过深）。

**Error的原型属性与方法**：
1. Error.prototype.toString()：方法覆盖了 Object.prototype.toString() 方法，返回一个表示指定 Error 对象的字符串，其实现如下：

![](../../../public/front-end/basics/javascript/123.png)

2. Error.prototype.message：错误消息。对于用户自定义创建的 Error 对象，这是构造函数的第一个参数提供的字符串。
3. Error.prototype.name: 错误名称。这是由具体错误类型构造函数决定的。
4. Error.prototype.cause：表示导致当前错误被抛出的原因——通常是另一个错误。它通过构造函数的第二个可选参数 options.cause 参数被传入。自定义错误类型也可以使用 cause 属性，前提是通过 super() 调用子类的构造函数时传递 options 参数。
5. Error.prototype.stack：此非标准堆栈属性提供了调用哪些函数、调用顺序、来自哪行和文件以及使用哪些参数的堆栈追踪。堆栈字符串从最近的调用开始到较早的调用，返回到原始的全局范围调用。

**throw 语句（语法为throw expression）**用来抛出一个用户自定义的异常，表达式expression是异常内容。当前函数的执行将被停止（throw 之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个 catch 块。如果调用者函数中没有 catch 块，程序将会终止。注意throw语句同样受到自动分号插入（ASI）机制的控制，在throw关键字和值之间不允许有行终止符。

**try...catch 语句**标记要尝试的语句块，并指定一个出现异常时抛出的响应。catch块指定一个标识符（即catch后的 exception_var），该标识符保存由throw语句指定的值。catch块是唯一的，因为当输入catch块时，JavaScript 会创建此标识符，并将其添加到当前作用域；标识符是catch子语句内部的。换言之，当进入catch子语句时标识符创建，catch子语句执行完毕后，这个标识符将不再可用。finally块在try块和catch块之后执行但是在下一个try声明之前执行。无论是否有异常抛出或捕获它总是执行。也可以用一个或者更多条件catch子句来处理特定的异常。在这种情况下，当异常抛出时将会进入合适的catch子句中（catch (exception_var_1 if condition_1) {} 这个功能不符合 ECMAscript 规范）。当用一个无条件catch子句和一个或多个条件语句时，无条件catch子句必须放在最后。否则当到达条件语句之前所有的异常将会被非条件语句拦截。如果从finally块中返回一个值，那么这个值将会成为整个try-catch-finally的返回值，无论是否有return语句在try和catch中。