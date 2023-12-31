# 框架通识

## MVC、MVP 和 MVVM？

MVC、MVP 和 MVVM 是三种常见的软件架构设计模式，都是通过分离关注点的方式来组织代码结构，优化开发效率。
1. **MVC** 将应用抽象为数据层（Model）、视图层（View）、逻辑层（controller），降低了项目耦合。View 传送指令到 Controller， Controller 完成业务逻辑后，要求 Model 改变状态，Model将新的数据发送到 View，用户得到反馈。但 MVC 并未限制数据流，Model 和 View 之间可以通信。MVC 中大量的 DOM 操作可能使页面渲染性能降低，加载速度变慢，影响用户体验。

![](../../public/front-end/frame/frame-1.png)

2. **MVP** 则限制了 Model 和 View 的交互都要通过承载了所有显示相关的逻辑的 Presenter（展示器），这样对 Model 和 View 解耦，提升项目维护性和模块复用性。
3. **MVVM** 则是对 MVP 的 P 的改造，用 VM（视图模型层，负责监听Model 中数据的改变并且控制视图的更新，处理用户交互操作）替换 P，将很多手动的数据和视图之间的同步操作通过双向数据绑定的方式自动化，降低了代码复杂度，提升可维护性。绝大多数业务逻辑都在后端，app 主要功能就是展示数据，交互等，适合偏向展示型的 app，**模式优点**：1. 耦合度更低；2. 更易数据一致性。**模式缺点**：1. 数据绑定使bug易于传递，定位调试bug更困难； 2. 数据绑定长期持有，对于model过大时，内存开销大。

![](../../public/front-end/frame/frame-2.png)

## SPA（单页面应用）

**SPA 即单页面应用**（single-page Application），其仅页面初始化时加载相应的 JavaScript、HTML、CSS（**初始化加载耗时**）。**利用路由机制**（缺点：需要额外的前进后退路由和内容切换堆栈管理）实现 HTML 内容变换、UI 交互（缺点：动态变换内容导致 SEO 难度较大），不会因为用户的页面操作发生重新加载或跳转（优点：**用户体验好、快，对服务器压力较小**）。前端进行交互逻辑，后端负责数据处理，职责分离，架构清晰。

## React 与 Vue 的对比

1. 都使用了Virtual DOM（虚拟DOM）提高重绘性能，都有props的概念，允许组件间的数据传递，都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性
2. React与Vue最大的不同是模板的编写。Vue鼓励写近似常规HTML的模板。写起来很接近标准 HTML元素，只是多了一些属性。React推荐你所有的模板通用JavaScript的语法扩展——JSX书写。React中render函数是支持闭包特性的，所以我们import的组件在render中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 完组件之后，还需要在 components 中再声明下。
3. Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能。React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM的重新渲染。因为 Vue 使用的是可变数据，而React更强调数据的不可变。
4. Vue在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。对于React而言，每当应用的   状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。