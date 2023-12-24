# JavaScript

## 关于JavaScript

JavaScript（JS）是单线程的、基于原型的、弱类型的、动态类型的、轻量的、支持面向对象/命令式/声明式编程的、头等函数的、多范式的、解释性（直译式或即时编译）的、也可在非浏览器环境下使用的动态脚本语言。JavaScript区分大小写。JavaScript 中，通过在运行时给空对象附加方法和属性来创建对象并且可以作为创建相似对象的原型。

浏览器JavaScript由三部分组成：核心ECMAScript 描述了该语言的语法和基本对象；DOM 描述了处理网页内容的方法和接口；BOM 描述了与浏览器进行交互的方法和接口。

JavaScript 的动态特性包括运行时构造对象、可变参数列表、函数变量、动态脚本执行（通过 eval）、对象内枚举（通过 for ... in）和源码恢复（JavaScript 程序可以将函数反编译回源代码）。

JavaScript® 是 Oracle 在美国和其他国家的商标或注册商标。

## 编译原理与编译过程

在代码执行之前会经历**词法分析**、**语法分析**和**代码生成**的编译阶段。

1. **词法分析**（**Lexing**）会将由字符组成的字符串分解成有意义的代码块即词法单元（Token）。
2. **语法分析**（**Parsing**）是将词法单元流转换成一个**由元素逐级嵌套所组成**的代表了程序语法结构的树即抽象语法树（AST，Abstract Syntax Tree）。
3. **代码生成**是将 AST 转换为可执行代码。

V8 的执行过程：

![](../../../public/front-end/basics/javascript/1.png)

源代码经过 Parser 解析器，经过词法分析和语法分析生成 AST；AST经过 Ignition 解释器生成字节码并执行；在执行过程中，如果发现热点代码，将热点代码交给 TurboFan 编译器生成机器码并执行；如果热点代码不再满足要求，进行去优化处理即还原成字节码并把执行权交还给 Ignition 解释器。

## 执行上下文和作用域

JavaScript代码是运行在执行上下文中的，创建新执行上下文的方式有：
1. 全局执行上下文：为函数之外的任何代码创建的上下文。
2. 函数执行上下文：每个函数执行时创建的上下文。创建个数没有限制。
3. eval执行上下文：eval函数执行创建的上下文，不建议使用可忽略。

每一个上下文在本质上都是一种作用域层级，每个上下文创建的时候会被推入**执行上下文栈（Execution Context Stack，或者叫函数调用栈（Call Stack））**，栈顶是当前执行的上下文，执行完代码退出的时候从上下文栈中移除，栈底是全局执行上下文。（注意：JavaScript 中，以回调方式调用的函数，是否会形成类似于递归那样“一层套一层” 的调用链而存在堆栈溢出的风险，取决于父函数执行完毕之前是否再次调用 “父” 函数，比如 setTimeout、nextTick、promise.then/catch/finally、MutationObserver等是在任务队列中执行，再次调用“父”函数时，父函数已经执行完毕，即不存在堆栈溢出的危险）。

```javascript
function fun2() {
  console.log('fun2');
}
function fun1() {
  fun2();
}
fun1();
/**
 模拟：
 // fun1()
 ECStack.push(<fun1> functionContext);
 // fun1 中调用了 fun2, 所以还要创建 fun2 的执行上下文
 ECStack.push(<fun2> functionContext);
 // fun2 执行（创建作用域链 => 变量对象 => 执行代码）完毕
 ECStack.pop();
 // fun1 执行（创建作用域链 => 变量对象 => 执行代码）完毕
 ECStack.pop();
 */
```

**变量对象**（**Variable object，VO**）是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。**作用域即执行上下文，由多个作用域的变量对象构成的链表就叫做作用域链**。函数创建时，每个函数的`[[Scopes]]`**属性**在会保存所有父级作用域内的变量对象。

全局对象的通用变量名是通用名称 globalThis，特定环境名称分别是：
1. 浏览器——window；
2. Worker——WorkGlobalScope；
3. nodejs——global；

全局变量提供可在任何地方使用的变量和函数。默认情况下，这些全局变量内建于语言或环境中。

**执行上下文中的代码会分成两个阶段进行处理**：
1. **进入执行上下文**：
    1. 如果是函数执行上下文，会**复制**函数`[[scope]]`属性到函数执行上下文的 Scopes 属性来初始化作用域链。
    2. 然后创建变量对象：全局执行上下文的变量对象初始化是全局对象。函数执行上下文的变量对象初始化是只包含 Arguments 对象的对象。如果是函数执行上下文则首先给当前执行上下文的变量对象添加形参及初始值，否则先添加函数声明（函数表达式属于后面的变量声明）及初始值，再添加变量声明（带声明var/let/const关键字的）及初始值，完成后被激活为**活动对象（Activation Object，AO）**；因此，变量提升（Hosting）是JavaScript执行上下文工作方式，意味着变量和函数的声明在编译阶段即执行阶段之前被放入内存中，就好像声明处在作用域最前面。由执行上下文的两个处理阶段可知，函数声明提升（非函数表达式）优先于变量声明提升（var、let、const）；

    ![](../../../public/front-end/basics/javascript/2.png)

    3. **如果是函数执行上下文，会将活动对象压入**函数执行上下文的Scopes属性即**作用域链顶端**。

    ```javascript
    function foo() {
      function bar() {
        // do something
      }
    }

    // foo 函数创建时
    foo.[[Scopes]] = [
      globalContext.VO
    ];

    bar.[[Scopes]] = [
      fooContext.AO,
      globalContext.VO
    ];

    // bar 函数执行上下文
    barContext = {
      AO: {
        arguments: []
      },
      Scope: [AO, fooContext.AO, globalContext.VO],
      this: undefined
    }
    ```

2. **代码执行**：
    1. 访问并修改活动对象的属性值。对于let 或 const 声明的变量，从一个代码块的开始直到代码执行到声明变量的行之前，变量都处于“暂时性死区”（Temporal dead zone，TDZ），尝试访问即使是typeof也将抛出 ReferenceError；只有当代码执行到声明变量所在的行时，才会对其进行初始化（若未赋值，则初始化为 undefined）。
    2. 执行完后将函数执行上下文从执行上下文栈中弹出。

**作用域即执行上下文，由多个作用域的变量对象构成的链表就叫做作用域链**。函数在执行前会复制该函数 `[[Scopes]]` 属性到函数执行上下文中创建作用域链。当访问一个变量时，解释器会首先在当前作用域的变量对象中查找标识符，如果没有找到，就去父作用域找，直到找到标识符，如果全局作用域也找不到就报错。**因此，一个变量或函数在整个作用域链都没有声明，那么在代码执行阶段就会报 ReferenceError 错**。

作用域共有两种主要的工作模式：词法作用域（静态作用域）和动态作用域。**JavaScript 采用词法作用域（Lexical Scope）**。词法作用域根据源代码中声明变量的位置来确定该变量在何处可用，而动态作用域 并不关心函数和作用域是如何声明以及在何处声明，它只关心它们从何处调用。


```javascript
const a = 2;
function foo() {
  console.log(a);
}

function bar() {
  const a = 3;
  foo();
}

bar();
// JS 是词法作用域，所以输出 2
// 假如是动态作用域则输出 3
```

**JavaScript的词法作用域**分为：
1. **全局作用域**：脚本模式运行所有代码的默认作用域。
2. **模块作用域**： 模块模式中运行代码的作用域。 Node 中顶级作用域不是全局作用域，而是当前模块作用域。
3. **函数作用域**：由函数创建的作用域。函数作用域指属于这个函数的全部变量都可以在整个函数的范围内访问。
使用 let（ES6）、const（ES6）声明的变量和Function 构造函数声明的函数属于额外的**块级作用域**（被限制在定义它的代码块内——块由一对大括号界定）。

![](../../../public/front-end/basics/javascript/3.png)


## this

this是执行上下文的一个属性，在非严格模式下指向一个对象，严格模式下可以是任意值。
1. 在全局上下文（任何函数体外部）中，无论是否为严格模式，this指向全局对象。
2. 在函数上下文中，this的值取决于函数被调用的方式（运行时绑定，箭头函数除外），函数的调用方式包括：
    1. 方法调用模式即作为对象的属性被调用；
    2. 普通调用模式即普通的函数调用；
    3. 构造函数调用模式即使用 new；
    4. 间接调用模式即 call、apply 调用；

    默认情况即普通函数调用模式下，非严格模式中 this 指向globalThis，严格模式中指向undefined，因此this可以用来判断当前是否处于严格模式：

    ```javascript
    function isStrict() {
      return this === void 0;
    }
    ```

3. 在类（class，ES6）上下文中，**类中所有非静态的方法都会被添加到 this 的原型中**。子类的构造函数中没有初始的this绑定，需要调用super()才会生成this绑定，因此在调用super()之前访问this会报错。而且子类不能在调用 super() 之前创建实例返回，除非其构造函数返回的是一个对象，或者根本没有构造函数。类内部总是严格模式，调用一个 this 值为 undefined 的方法会抛出错误。
4. nodejs环境下的模块中，this指向module.exports。而浏览器环境下的模块中，顶级 this 是 undefined。
5. 当函数作为对象里的方法（包括getter、setter、原型链上的方法）、DOM事件处理函数、内联事件处理函数调用时，this 被设置为调用该函数的对象和元素。
6. 显示绑定函数的this方式：bind，call，apply，对箭头函数来说不能绑定 this即第一个参数会被忽略，只能传递参数。在非严格模式下使用 call 和 apply 更改函数的 this 绑定时，如果用作 this 的值不是对象，则会被尝试转换为对象：
    1. null 和 undefined 被转换为全局对象；
    2. 其他原始值会使用对应的构造函数转换为对象，比如 7 会被转换为 new Number(7)，'foo'会被转换为 new String('foo')；
    3. bind 函数会创建返回与原函数具有相同函数体和作用域的函数，新函数的 this 将被永久地绑定到首次 bind 的第一个参数，后续无论如何调用或更改绑定，this 不会变。
7. 箭头函数不会创建自己的this，它只会从自己的作用域链的上一层继承 this，**即箭头函数保持为创建时封闭词法作用域的this值（箭头函数不是封闭词法作用域）**。关于“ this”的严格模式区别规则在箭头函数中将被忽略。针对箭头函数判定this的简便方法：在箭头函数创建的位置将整个箭头函数替换为this，则箭头函数的this就是这个被替换的this，如果有多层箭头函数，则重复这个步骤。
8. Proxy 代理对象调用方法时，原对象内部的 this 指向其代理对象。handler 拦截函数内部的 this，指向的是 handler 对象本身。

**对象方法的链式调用通过该方法返回当前对象实现**。

## 内存管理与垃圾回收

### 内存管理

编程语言的内存生命周期均包括三部分：
1. 分配所需要的内存，JavaScript中发生在值的初始化和函数调用返回。
2. 使用分配到的内存（读、写）
3. 不需要时将其释放\归还，即垃圾回收（Garbage collection，GC），是计算机编程中用于描述查找和删除那些不再被其他对象引用的对象处理过程。

JavaScript 的内存管理是自动的、无形的。在内存管理的环境中，一个对象如果有访问另一个对象的权限（隐式或者显式），叫做一个对象引用另一个对象，“对象”的概念包括 JavaScript 对象和函数作用域（或者全局作用域）。特别注意，全局变量的生命周期直到浏览器卸载页面才会结束，也就是全局变量不会被当成垃圾变量回收。

### 垃圾回收

#### 引用计数法

最初级的**引用计数法**：将“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”，因此如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。该方法存在循环引用的内存无法被回收的问题。

#### 标记清除法

**标记清除法**：将“对象是否不再需要”简化定义为“对象是否**可达**”。假定设置一个设置一个叫做根（root）的对象（在 Javascript 里，根是全局对象），如果一个值可以通过引用链从根访问，则认为该值是可达的。它相比引用计数法更好，因为“有零引用的对象”总是不可达，即使是循环引用。标记清楚算法缺陷是无法从根对象查询到的对象都将被清除。

```javascript
function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;
  return {
    father: man,
    mother: woman
  }
}

// 1. 创建引用
let family = marry({
  name: 'John'
}, {
  name: 'Ann'
});

// 2. 移除两个引用
delete family.father;
delete family.mother.husband;

// 3. 移除外部引用
let family = null;
```

![](../../../public/front-end/basics/javascript/4.png)

![](../../../public/front-end/basics/javascript/5.png)

**栈内存**，ESP 指针下移（即上下文切换），栈顶的空间会自动被回收。

垃圾收集器进行分代收集（Generational collection）（按新生代和老生代收集）、增量收集（Incremental collection）（分多次收集）、闲时收集（在 CPU 空闲的时候）。

**堆内存**，分为**新生代内存**（临时分配的内存，存活时间短）和**老生代内存**（常驻内存，存活时间长）。

![](../../../public/front-end/basics/javascript/6.png)

**新生代**的内存在 64 位和 32 位系统下默认限制分别为 32MB 和 16MB（存活时间短，操作更频繁，所以设置小）。

> V8 引擎会限制内存的使用（64 位最多只能分配 1.4GB，32 位最多只能分配 0.7GB），因为垃圾回收是非常耗时的操作，同时，回收过程会阻塞线程。以 1.5GB 的垃圾回收为例，V8 做一次小的垃圾回收需要 50ms 以上，做一次非增量式的垃圾回收甚至要 1s 以上。
> 手动调整老生代：node --max-old-space-size=2048 xxx.js；
> 手动调整新生代（一般不建议）：node --max-new-space-size=2048 xxx.js。

**新生代内存空间分为 From（正在使用的内存）和 To （目前闲置的内存）**。垃圾回收时使用 **Scavenge 算法**：检查From内存，将存活对象**从头放置的方式复制**到 To 内存（按理说复制的同时，From空间内存活对象的占用的内存应该释放掉），回收非存活对象，直到From内存空，From内存空间和To内存空间角色对调。由于**新生代**存储的是生命周期短的对象，对象较少，因此时间性能优秀，**算法缺点是新生代内存使用率不超过新生代内存的一半**。**为何不直接将非存活对象回收？一个对象的堆内存分配是连续的，直接回收非存活对象会容易产生不够后续对象使用的内存碎片，内存利用率低。**

![](../../../public/front-end/basics/javascript/7.png)

**老生代内存**，被晋升（1. 已经经历过一次 Scavenge 回收 2. 回收后To（闲置）空间的内存占用超过25%）的对象会被放入到老生代内存中。老生代垃圾回收（不使用 Scavenge 算法，老生代空间大，考虑内存利用率和复制耗时），采用标记清除算法：
1. **标记-清除**，遍历老生代中所有对象并**做上标记**，仅**使用的变量**以及**被强引用**的变量**取消标记**。标记结束后**清除回收具有标记**的变量对象。其中标记采用**增量标记**（为避免垃圾回收耗时阻塞时间过长，即将标记任务分为很多小的部分，小部分完成就暂停一下，直到标记阶段完成，如此，阻塞时间减少到原来的1/6）；
2. **整理内存碎片**，清除阶段结束后把存活的对象全部往一端靠拢（移动对象，全过程最耗时操作）。

![](../../../public/front-end/basics/javascript/8.png)

#### 内存泄漏

**堆栈溢出**：指没有足够的内存空间申请。

**内存泄漏**指申请的内存执行完后没有及时的清理或者销毁，占用空闲内存。当内存泄漏过多就会导致堆栈溢出。一般是堆内存溢出。

常见内存泄漏的原因：
1. 减少不正当的使用闭包，因为可能会造成内存泄漏

```javascript
function fn() {
  const test = new Array(1000).fill('');
  return function () {
    console.log(test);
    return test;
  }
}
let fnInner = fn();
fnInner();
/** fnInner() = null; // 置空外部引用 */
// More Tools -> Developer Tools -> Memory -> Allocation instrumentation on timeline 
```

2. 隐式的全局变量可能导致内存泄漏

```javascript
function fn() {
  'use strict' // 函数内使用严格模式避免泄漏
  // 没有声明的变量是隐式全局变量
  test1 = new Array(1000).fill('');
  // 函数内部 this 指向 window, test2 也是隐式全局变量
  this.test2 = new Array(1000).fill('');
}
// More Tools -> Developer Tools -> Performance/Memory， 一般先在 Performance 面板录制页面内存占用情况随时间变化的图像，对内存泄漏有个直观的判断，然后在 Memory 面板定位问题发生的位置
```
3. 游离的 DOM 引用

```html
<div id="root">
  <ul id="ul">
    <li></li>
    <li></li>
    <li id="li3"></li>
    <li></li>
  </ul>
</div>
<script>
  let root = document.querySelector('#root');
  let ul = document.querySelector('#ul');
  let li = document.querySelector('#li3');
  
  root.removeChild(ul);
  ul = null; // 虽然置空了 ul 变量，但由于 li 变量引用了 ul 的子节点，所以 ul 元素依然不能被垃圾回收

  li = null; // 已无变量引用，此时 ul 元素才可以垃圾回收

  // 通过堆快照（Heap Snapshot），调试路径 Memory -> Heap Snapshot -> Take Snapshot，堆快照可以直接显示是否游离的 DOM 节点，只要在顶部过滤框 filter 输入 detached，如果过滤出东西，说明存在游离的 DOM 节点
</script>
```
4. 未清除的定时器和 requestAnimationFrame

```javascript
let someResource = getData();
const timer = setInterval(() => {
  const node = document.getElementById('Node');;
  if (node) {
    node.innerHTML = JSON.stringify(someResource);
  }
}, 1000)
```
5. 组件卸载时未解除监听

```javascript
created() {
  eventBus.on('test', this.doSomething)
},
beforeDestroy() {
   // eventBus.off('test');
},
methods: {
  doSomething() {
    // do something
  }
}
```

6. 未清理的 console 输出：控制台会始终保持对 console 输出结果的引用，导致无法被垃圾回收

7. 遗忘的 Map、Set 对象：Map、Set 是强引用，即一个对象被强引用所引用时，那么这个对象就不会被垃圾回收，若要能够回收，需置空 Map 和 Set。而 WeakMap 和 WeakSet 是弱引用，即一个对象只被弱引用所引用，则被认为是不可访问（或弱可访问）的，因此可能在任何时刻被回收。

## 并发模型与事件循环

JavaScript 有一个基于**事件循环（Event Loop）**的并发模型，负责浏览器和Node中执行代码、收集和处理事件以及执行队列中的子任务，是用于**解决JavaScript单线程运行时可能会阻塞**的一种机制。

事件循环是一个在 JavaScript 引擎等待任务，执行任务和进入休眠状态等待更多任务的状态之间转换的无限循环。**Javascript 引擎大多数时候处于不执行任何操作即等待任务状态**，仅在脚本加载完成/事件触发时执行。

渲染和执行JS是互斥的，都在渲染主线程中进行。执行JS时永远不会进行渲染（render）。仅在执行完成后才会绘制对 DOM 的更改。如果一项任务执行花费的时间过长，浏览器将无法执行其他任务，例如处理用户事件或渲染。因此，在一定时间后，浏览器会抛出一个如“页面未响应”之类的警报来建议终止这个任务。这种情况常发生在有大量复杂的计算或导致死循环的程序错误时。

任务分为**宏任务（MacroTask或Task）**和**微任务（MicroTack）**，每个宏任务之后，JavaScript引擎会立即执行微任务队列中的所有任务，然后再执行其他的宏任务，或渲染，或进行其他任何操作。主动安排一个宏任务使用setTimeout/setInterval，主动安排一个微任务使用queueMicrotask。对于 v11.15.0+ 的Node表现和浏览器一致，执行完一个定时器任务立即执行微任务队列中的所有任务，而之前版本的Node在执行完定时器任务后先检查任务队列的队首是否定时器任务，是则保存微任务队列，优先执行该定时器任务，中途产生的微任务进入微任务队列，待定时器任务执行完再依次执行微任务队列。

```javascript
// 使用嵌套的 setTimeout 调用来拆分 cpu 过载任务
let i = 0;
let start = Date.now();
function count() {
  // 将调度（scheduling）移动到开头
  if (i < 1e9 - 1e6) {
    setTimeout(count); // 安排（schedule）新的调用
  }
  do {
    i += 1;
  } while (i % 1e6 !== 0);
  if (i === 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  }
}
count();
```

**宏任务**：script、setTimeout/setInterval（由计时线程计时，到期才放入队列中，且浏览器不会对同一个 setInterval 回调多次添加到任务队列，因此setInterval 的处理时长不能比设定的间隔长，否则 setInterval 将会没有间隔地重复执行）、setImmediate（Node.js）、I/O（Mouse Events、Keyboard Events、Network Events、文件读写）、UI Rendering（HTML Parsing）、MessageChannel等，多个宏任务形成宏任务队列。

```javascript
// 实际上很多地方都见过这种技术
setTimeout(function repeatMe() {
  // do something
  setTimeout(repeatMe, 15);
  // 执行完处理程序的内容后， 在末尾再间隔 15ms 来调用该程序，这样就能保证一定是15毫秒间隔的周期调用
}, 15);
```

**微任务**：promise.then/catch/finally 的回调、await下一行、process.nextTick（Node.js）、MutationObserver、垃圾回收过程、queueMicrotask的回调。其中调用 process.nextTick() 时传入的 callback 会被入队到nextTick callback queue。其余微任务的 callback 会被入队到microtask callback queue，且nextTick callback queue的优先级高于 microtask callback queue。

**浏览器事件（Event Loop）循环算法**：
1. 从宏任务队列中出队（dequeue）并执行最早的任务（例如script）。
2. 依次执行当前微任务队列的所有任务。
3. 如果有变更，则将变更渲染出来。
4. 如果宏任务队列为空，则休眠直到出现宏任务。
5. 转到步骤1。

![](../../../public/front-end/basics/javascript/9.png)

**Node.js事件循环算法**：

![](../../../public/front-end/basics/javascript/10.png)

每个阶段都会有一个 callback queue 与之相对应。Event Loop会遍历这个 callback queue，执行里面的每一个callback。直到 callback queue 为空或者当前callback的执行数量超过了某个阈值为止，Event Loop才会移步到下一个阶段。事件循环示意图：

![](../../../public/front-end/basics/javascript/11.png)

> nodejs 事件循环涉及的队列:
> timer callback queue
> I/O callback queue
> immediate callback queue
> close callback queue
> nexTick callback queue
> microtask callback queue

1. **timer 阶段**：此阶段执行 timer callback queue中的任务，调用 setTimeout 或者 setInterval 方法时传入的 callback 会在指定的延迟时间后入队到 timer callback queue。调用时候传入的延迟时间并不是回调确切执行的时间，会受到操作系统调度层面和其他callback函数调用耗时的影响，timer callback函数的执行只会比预定的时间晚。
2. **pending callbacks 阶段**：执行上一次循环延迟到下一次循环迭代的I/O回调，可能是系统操作的回调，如TCP错误的类型。
3. **idle、prepare 阶段**：只在node内部使用，不必理会。
4. **poll 阶段**：timer callback queue为空进入poll阶段，会计算应该为I/O进行阻塞和轮询的时长，然后处理I/O callback queue中的事件（几乎所有回调，比如**文件读写、网络请求等**，除了 close callback 、定时器调度的 callback 和 setImmediate）。若I/O callback queue非空则依次执行；若I/O callback queue为空且存在setImmdiate回调，直接进入check阶段，否则阻塞轮询到超时后进入自动check阶段。
5. **check 阶段**：I/O callback queue队列为空时，会立即进入该阶段，**执行immediate callback queue**。
6. **close callbacks 阶段**：比如socket被突然关闭（如socket.destroy()），"close "事件将在这个阶段被发出。否则，它将通过process.nextTick()发出。此阶段执行close callbacks queue 的任务。


### 阐述⼀下 JS 的事件循环?

事件循环，是浏览器渲染主线程的工作⽅式，是异步的实现方式。

在 Chrome 的源码中，它开启⼀个不会结束的 for 循环，每次循环从消息队列中取出第⼀个任务执⾏，⽽其他所有线程（包括其他进程的线程、计时线程）只需要在合适的时候将任务加⼊到队列末尾即可。任务本身没有优先级，在队列中先进行出，不同的队列有优先级。过去把任务队列简单分为宏队列和微队列，目前已无法满足复杂的浏览器环境，而是更加灵活多变的处理方式，根据 W3C 最新的解释：每个任务有不同的类型，同类型的任务必须在同⼀个队列，不同类型的任务可以属于同一队列。不同任务队列有不同的优先级，在⼀次事件循环中，由浏览器自⾏决定取哪⼀个队列的任务。但浏览器必须有⼀个**微队列**，微队列的任务⼀定具有最高的优先级，必须优先所有其他任务执⾏。在目前 chrome 的实现中，至少还包括优先级「中」的延时队列和优先级「⾼」的交互队列，分别用于存放计时器到达后的回调任务，和用于存放用户操作后产生的事件处理任务。

### 如何理解 JS 的异步？

JS是⼀⻔单线程的语⾔，这是因为它运⾏在浏览器的渲染主线程中，⽽渲染主线程只有⼀个。⽽渲染主线程承担着诸多的⼯作，渲染⻚⾯、执⾏ JS 都在其中运⾏。如果使用同步的⽅式，就极有可能导致主线程产⽣阻塞，从⽽导致消息队列中的很多其他任务⽆法得到执⾏。这样⼀来，⼀⽅⾯会导致繁忙的主线程⽩⽩的消耗时间，另⼀⽅⾯导致⻚⾯⽆法及时更新，给⽤户造成卡死现象。所以浏览器采⽤异步的⽅式来避免。具体做法是当某些任务发⽣时，⽐如计时器、⽹络、事件监听，主线程将任务交给其他线程去处理，⾃身⽴即结束任务的执⾏，转⽽执⾏后续代码。当其他线程完成时，将事先传递的回调函数包装成任务，加⼊到消息队列的末尾排队，等待主线程调度执⾏。在这种异步模式下，浏览器永不阻塞，从⽽最⼤限度的保证了单线程的流畅运⾏。单线程是异步产生的原因。

### JS 中的计时器能做到精确计时吗？

不⾏，因为：
1. 计算机硬件没有原子钟，⽆法做到精确计时；
2. 操作系统的计时函数本身就有少量偏差，由于 JS 的计时器最终调用的是操作系统的函数，也就携带了这些偏差；
3. 按照 W3C 的标准，浏览器实现计时器时，如果嵌套层级 >= 5 层，则会带有 4 毫秒的最少时间，这样在计时时间少于 4 毫秒时⼜带来了偏差；
4. 受事件循环的影响，计时器的回调函数只能在主线程空闲时运行，因此⼜带来了偏差。