# React

## 组件相关

组件允许将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。组件从概念上类似于 JavaScript 纯函数（多次调用下相同的入参始终返回相同的结果），它接受唯一的入参（即 “props”，包括JSX 所接收的除ref和key之外的属性（attributes）以及子组件（children），props.children由 JSX 表达式中的子组件组成，而非组件本身定义），**无论是使用函数声明还是通过 class 声明，都绝不能修改自身的 props，返回的是用于描述页面展示内容的 React 元素。组件名称必须以大写字母开头。React 会将以小写字母开头的组件视为原生 DOM 标签**。

**React 的组件可以定义为 class 或函数的形式。class 组件，需要继承 React.Component。强烈建议不要创建自己的组件基类。在 React 组件中，代码重用的主要方式是组合而不是继承**。React并不会强制使用 ES6 的 class 语法。如果倾向于不使用它，可以使用 create-react-class 模块或类似的自定义抽象来代替。

**任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件，这通常被叫做“自上而下”或是“单向”的数据流**。组件中的 state包含了随时可能发生变化的数据。state 由用户自定义，它是一个普通 JavaScript 对象。如果某些值未用于渲染或数据流（例如，计时器 ID），则不必将其设置为 state。此类值可以在组件实例上定义。请把this.state看成是不可变的，永远不要直接改变 this.state而应该使用this.setState。如果使用 createReactClass() 方法创建组件，则需要提供一个单独的 getInitialState 方法，让其返回初始 state。

**类组件中定义 static defaultProps 来设置类的默认props。它们将在props为 undefined 或者缺少时有效，但在 props 为 null 时无效。在类组件中定义 defaultProps 类似于在函数式组件中使用默认值。**如果使用 createReactClass() 方法创建组件，那就需要在组件中定义 getDefaultProps() 函数。

displayName多 用于调试消息，通常不需要设置，react可以根据函数组件或 class 组件的名称推断出来，如果调试时需要显示不同的名称或创建高阶组件（HOC），可以自行进行设置。

ES6 本身是不包含任何 mixin 支持。因此，当你在 React 中使用 ES6 class 时，将不支持 mixins 。而且很多代码库在使用 mixins 然后出现了问题，并不建议在新代码中使用它们。ES5中在使用 createReactClass 创建 React 组件的时候，引入 mixins 是一个很好的处理复用的解决方案。如果组件定义了多个mixins，且这些 mixins 中定义了相同的生命周期方法，那么这些生命周期方法都会被调用的，且会按照定义的顺序执行。

### 类组件与函数组件

**相同点**：组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

我们甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（虽然并不推荐这种重构行为）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以，基本可认为两者作为组件是完全一致的。

**不同点**：
1. 它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。
2. 之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
3. 性能优化上，类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。从上手程度而言，类组件更容易上手，从未来趋势上看，由于 React Hooks 的推出，函数组件成了社区未来主推的方案。
4. 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。

### 受控组件和非受控组件

在 HTML 中，表单元素（如`<input>`、`<textarea>` 和 `<select>`）通常自己维护state并根据用户输入进行更新。而在React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 setState()来更新。
1. 在HTML中，`<textarea>` 元素通过其子元素定义其文本，而在React中，`<textarea>` 使用value属性代替。
2. 在 HTML 中，`<select>` 创建下拉列表标签，`<option>` 的selected属性定义其选中，而在 React 中，根 select 标签上使用value 属性代替，而且支持将数组传递到 value 属性中支持 select标签中选择多个选项（select multiple={true} value={['B','C']}>）。
3. React 中 `<input>`、`<select>` 和 `<textarea>` 组件支持 value 属性构建受控组件，而defaultValue 属性对应的是非受控组件的属性，用于设置组件第一次挂载时的 value。

渲染表单的 React 组件支持将两者结合起来，使 React 的 state 成为“唯一数据源”，控制着用户输入过程中表单发生的操作。**受控组件输入的值始终由 React 的 state 驱动**。在大多数情况下应该使用受控组件。当用户将数据输入到受控组件时，会触发修改状态的事件处理器，这时由代码来决定此输入是否有效（如果有效就使用更新后的值重新渲染，否则表单元素保持不变，也意味着如果设置一个非undefined 或 null的不变值，用户将不能修改表单数据），也可以将 value 传递给其他 UI 元素，或者通过其他事件处理函数重置，也意味着需要编写更多的代码。

![](../../../public/front-end/frame/react/1.png)

**非受控组件**的表单数据由 DOM 节点来处理，提供默认值属性defaultValue（`<select>` 、 `<textarea>`、 `<input>`）或defaultChecked（`<input type="checkbox">` 和 `<input type="radio">`）（修改值不会造成DOM更新），可以使用ref来获取表单数据。在HTML 中，`<input type="file">` 可以让用户选择一个或多个文件上传到服务器，或者通过使用 File API 进行操作。在 React 中，`<input type="file" />` 始终是一个非受控组件，因为它的值只能由用户设置，而不能通过代码控制强制设置值。

综上，可以封装一个支持管理受控和非受控组件的状态的 Hook：

![](../../../public/front-end/frame/react/2.png)

### 高阶组件

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。具体而言，**高阶组件是参数为组件，返回值为新组件的函数**。

之前建议使用 mixins 用于解决横切关注点相关的问题，但 mixins 会产生许多麻烦。因此改为使用高阶组件（HOC）。

普通组件是将props转换为UI，高阶组件是将组件转换为另一个组件。HOC在第三库中很常见，比如Redux 的 connect 是返回高阶组件（HOC）的高阶函数：

![](../../../public/front-end/frame/react/3.png)

![](../../../public/front-end/frame/react/4.png)

**HOC 不会修改传入的组件**，因为修改传入组件的 HOC 是一种糟糕的抽象方式。调用者必须知道它们是如何实现的，以避免与其他 HOC 发生冲突；**也不会使用继承来复制其行为**。相反，**HOC 使用组合的方式，通过将组件包装在容器组件中来组成新组件，来实现功能。HOC 是纯函数，没有副作用**。容器组件担任将高级和低级关注点分离的责任，由容器管理订阅和状态，并将 prop 传递给处理 UI 的组件。HOC 使用容器作为其实现的一部分，**可以将 HOC 视为参数化容器组件**。

HOC 通常可以接收一个（被包裹的组件）或多个参数。建议编写compose工具函数组合多个HOC：

![](../../../public/front-end/frame/react/5.png)

HOC应透传与自身无关且被包装组件需要的props，加上给被包装组件注入它所需要的HOC的state或实例方法。

为HOC中的容器组件设置显示名称，建议使用 HOC 名包住被包装组件名：

![](../../../public/front-end/frame/react/6.png)

**HOC的优点**∶ 逻辑复用、不影响被包裹组件的内部逻辑。 
**HOC的缺点**∶ HOC传递给被包裹组件的props容易和被包裹组件本身的props重名，进而被覆盖。
注意事项：
1. **不要在render函数中调用高阶组件（HOC）**，因为每次更新render函数都会创建一个新的高阶组件，将导致子树每次渲染都会进行卸载，和重新挂载的操作。这不仅仅是性能问题 - 重新挂载组件会导致该组件及其所有子组件的状态丢失。极少数情况需要动态调用HOC，可以在构造函数或生命周期函数中调用。
2. **在容器组件返回之前把被包裹组件的静态方法拷贝到容器组件上**，可以借助 hoist-non-react-statics 自动拷贝所有非 React 静态方法。

![](../../../public/front-end/frame/react/7.png)

3. **refs 不会被传递**，ref添加到HOC返回的组件上，则 ref 引用指向容器组件，而不是被包装组件。需要借助React.forwardRef API 对 refs 进行转发。

### Render Props

“render prop” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术。**具有 render prop 的组件接受一个返回 React 元素的函数，并在组件内部通过调用此函数来实现自己的渲染逻辑**。更具体地说，render prop 是一个用于告知组件需要渲染什么内容的函数 prop。事实上， 任何被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”，比如children prop或其他，而且，children prop 并不真正需要添加到 JSX 元素的 “attributes”上，相反可以直接放置到元素的内部。使用 render prop 的库有 React Router、downshift和 formik。

![](../../../public/front-end/frame/react/8.png)

使用 React.PureComponent的组件使用render props且创建在render方法内，会使得React.PureComponent的优化失效，需要render props函数定义为实例方法或者使用useCallback来避免优化失效。

render props的优点：数据共享、代码复用，将组件内的state作为props传递给调用者，将渲染逻辑交给调用者。

render props的缺点：无法在 return 语句外访问数据，嵌套写法不够优雅。

### 生命周期

![](../../../public/front-end/frame/react/9.png)

![](../../../public/front-end/frame/react/10.png)

**挂载时**——当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下： 
1. constructor(props)：如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。在为 React.Component 子类实现构造函数时，应在其他语句之前调用 super(props)。否则，this.props 在构造函数中可能会出现未定义的 bug。通常，在 React 中，构造函数仅用于以下两种情况：
    1. 通过给 this.state 赋值对象来初始化内部 state。
    2. 为事件处理函数绑定this实例
    
    要避免在构造函数中引入任何副作用或订阅。
2. **static getDerivedStateFromProps(props, state)**，在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用（16.3及以前只在挂载阶段和props更新时会被调用）。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
3. **UNSAFE_componentWillMount()**，已过时，此生命周期之前名为 componentWillMount。该名称将继续使用至 React 17。可以使用 rename-unsafe-lifecycles codemod 自动更新你的组件。此方法是服务端渲染唯一会调用的生命周期函数，在挂载之前具体是render()之前，因此在此方法中同步调用 setState() 不会触发额外渲染。避免在此方法中引入任何副作用或订阅，而应该用 componentDidMount()。
4. **render()**，是 class 组件中唯一必须实现的方法。render() 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。如果 shouldComponentUpdate() 返回 false，则不会调用 render()。当 render 被调用时，它会检查 this.props 和 this.state 的变化并返回以下类型之一：
    1. React 元素。通常通过 JSX 创建。例如，无论是 `<div />` 还是 <MyComponent /> 均为 React 元素。
    2. 数组或 fragments。 使得 render 方法可以返回多个元素。
    3. Portals。可以渲染子节点到不同的 DOM 子树中。
    4. 字符串或数值类型。它们在 DOM 中会被渲染为文本节点。
    5. **布尔类型或 null或undefined**。什么都不渲染。
5. **componentDidMount()**，会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化比如通过网络请求获取数据、添加订阅等应该放在这里。虽然可以在 componentDidMount() 里直接调用 setState()，但将触发额外一次渲染，多调用了一次 render 函数，由于它是在浏览器刷新屏幕前执行的，所以用户对此是没有感知的，但是我应当避免这样使用，这样会带来一定的性能问题，尽量是在 constructor 中初始化 state 对象。

**更新时**——当组件的 props 或 state 发生变化时或调用forceUpdate时会触发更新。组件更新的生命周期调用顺序如下：

**this.SetState**是用于更新用户界面以响应事件处理器和处理服务器数据的主要方式。React会将setState排入队列，并批量更新，即无论是第一个参数是回调函数形式还是对象形式，回调函数返回值stateChange或对象类型的stateChange都是与 state 进行浅合并，且react18开始setState均是异步更新的，但回调函数中可以获取render后的最新的state和props，来链式地进行更新即后续state取决于当前state，但在调用setState后同步仍然获取不到最新的值。如果需要强制某个setState同步更新，可以使用 flushSync 来包装，但会影响性能。最佳实践是为避免出错，把所有的setState当作是异步的，永远不要信任setState调用之后的状态。

**除非 shouldComponentUpdate() 返回 false，否则 setState() 将始终执行重新渲染操作**。为避免不必要的重新渲染，应该仅在新旧状态不一时调用setState()。此外，可以使用componentDidUpdate（推荐） 或者 setState 的第二个可选参数即回调函数中获取更新后的值。

![](../../../public/front-end/frame/react/11.png)

**this.forceUpdate(callback)**，调用会强制组件重新渲染，而且会跳过该组件的shouldComponentUpdate()。但其子组件会触发正常的生命周期方法，包括 shouldComponentUpdate() 方法。通常应该避免使用 forceUpdate()。
1. **UNSAFE_componentWillReceiveProps(nextProps)**，已过时，此生命周期之前名为 componentWillReceiveProps。该名称将继续使用至 React 17。可以使用 rename-unsafe-lifecycles codemod 自动更新你的组件。会在已挂载的组件接收新的 props 之前被调用。如果需要更新状态以响应 prop 更改，可以比较 this.props 和 nextProps 并在此方法中使用 this.setState() 执行 state 转换。在挂载过程中，React 不会针对初始 props 调用 UNSAFE_componentWillReceiveProps()。组件只会在组件的 props 更新时调用此方法。调用this.setState() 通常不会触发 UNSAFE_componentWillReceiveProps()。请注意，如果父组件导致组件重新渲染，即使 props 没有更改，也会调用此方法。如果只想处理更改，请确保进行当前值与变更值的比较。目前已被getDerivedStateFromProps替代。使用此生命周期方法通常会出现 bug 和不一致性：
    1. 如果需要执行副作用以响应 props 中的更改，请改用 componentDidUpdate 生命周期。
    2. 如果使用 componentWillReceiveProps 仅在 prop 更改时重新计算某些数据，请使用 memoization helper 代替。
    3. 如果使用 componentWillReceiveProps 是为了在 prop 更改时“重置”某些 state，请考虑使组件完全受控或使用 key 使组件完全不受控代替。
2. **static getDerivedStateFromProps(props, state)**。
3. **shouldComponentUpdate(nextProps, nextState, nextContext)**， 根据 shouldComponentUpdate() 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是state或props每次发生变化组件都会重新渲染。首次渲染或使用 forceUpdate() 时不会调用该方法。不要企图依靠此方法来“阻止”渲染，而是作为性能优化的手段，因为这可能会产生 bug。不建议在 shouldComponentUpdate() 中进行深层比较或使用 JSON.stringify()。这样非常影响效率，且会损害性能。可以将 this.props 与 nextProps 以及 this.state 与nextState 进行比较，并返回 false 以告知 React 可以跳过更新，则不会调用 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()。请注意，返回 false 并不会阻止子组件在 state 更改时重新渲染。
4. **UNSAFE_componentWillUpdate()**，已过时。此生命周期之前名为 componentWillUpdate。该名称将继续使用至 React 17。可以使用 rename-unsafe-lifecycles codemod 自动更新你的组件。注意，不能此方法中调用 this.setState()；在 UNSAFE_componentWillUpdate() 返回之前，也不应该执行任何其他操作触发对 React 组件的更新。由于fiber是可以中断的，如果需要在此方法中读取 DOM 信息（例如，滚动位置），则可以将此逻辑移至 getSnapshotBeforeUpdate() 中。
5. **render()**。
6. **getSnapshotBeforeUpdate(prevProps, prevState)**，在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值（应返回 snapshot 的值（或 null））将作为参数传递给 componentDidUpdate()。通常是在getSnapshotBeforeUpdate 中读取到DOM信息传递给componentDidUpdate，因为 “render” 阶段生命周期和 “commit” 阶段生命周期之间可能存在延迟。
7. **componentDidUpdate(prevProps, prevState, snapshot)**，会在更新后会被立即调用。首次渲染不会执行此方法。也可以在 componentDidUpdate() 中直接调用 setState()，但请注意它必须被包裹在一个条件语句里，否则会导致额外的重新渲染以及死循环。

**卸载时**——当组件从 DOM 中移除时会调用如下方法：
1. **componentWillUnmount()**；会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，比如清除计时器，取消订阅，取消请求等。在其中不应调用 setState()，因为组件卸载或销毁就不会重新渲染。

**错误处理时**——当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：
1. **static getDerivedStateFromError(error)**，会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并可以返回一个值以更新state。getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。如遇此类情况，请改用 componentDidCatch()。
2. **componentDidCatch(error, info)**，此生命周期在后代组件抛出错误后被调用。 它接收两个参数： error —— 抛出的错误。 info —— 带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息。componentDidCatch() 会在“提交”阶段被调用，因此允许执行副作用。 它应该用于记录错误之类的情况。如果发生错误，可以通过调用 setState 使用 componentDidCatch() 渲染降级 UI，但在未来的版本中将不推荐这样做，应该使用静态 getDerivedStateFromError() 来处理降级渲染。React 的开发和生产构建版本在 componentDidCatch() 的方式上有轻微差别：
    1. 在开发模式下，错误会冒泡至 window，即根错误处理器(window.onerror 或window.addEventListener('error', callback))会已经被componentDidCatch捕获的错误，
    2. 在生产模式下，错误不会冒泡，即根错误处理器（window.onerror 或 window.addEventListener('error', callback)）只会接受那些没有显式地被 componentDidCatch() 捕获的错误。

### PureComponent 和 React.memo

PureComponent 是Component 的子类，isPureReactComponent为true，继承 PureComponent 的组件会在更新前分别浅比较props 和 state，浅比较是指当对象所有顶层自有属性的值同值相等（Object.is）时返回true，排除forceUpdate和context改变的情况下，当 props 和 state 均不变时会跳过重渲染。开发环境下，PureComponent中再定义shouldComponentUpdate 方法，会console.error。

React.memo(SomeComponent, arePropsEqual?) 允许组件在 props 没有改变的情况下跳过重新渲染。
1. SomeComponent是被记忆的组件，可以是任何有效的 React 组件，包括函数组件和 forwardRef 组件。memo 不会修改该组件，而是返回一个新的、记忆化的组件MemoizedComponent。
2. arePropsEqual，可选参数，是接收prevProps和nextProps的函数。如果返回true，则。不指定时React 浅比较props，且 props 不变时在父组件重渲染时跳过重渲染。但如果它自己的 state 或正在使用的 context 发生更改，组件也会重新渲染。

## Refs相关

![](../../../public/front-end/frame/react/12.png)

在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式，父组件修改一个子组件需要使用新的 props 来重新渲染它。但是，在以下情况中需要在典型数据流之外强制修改子组件（组件实例或DOM 元素）。

![](../../../public/front-end/frame/react/13.png)

**ref属性可以接收一个由 React.createRef()函数或React.useRef(initValue) Hook创建的对象、或者一个回调函数、或者一个字符串（遗留 的过时API），来直接访问 DOM 元素或React组件实例。当ref属性是由 React.createRef() 函数或React.useRef(initValue) Hook创建的对象或回调函数时，其current属性或回调函数参数在componentDidMount触发前接收DOM 元素或class组件的挂载实例，并在componentDidUpdate触发前更新，在卸载时传入 null 值**。函数组件没有实例，因此默认情况下其上不能使用 ref 属性，除非使用Ref转发（React.forwardRef，Ref转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递）。 ref 回调函数建议定义成 class 的绑定函数的方式而不是内联函数，因为后者在每次渲染时会创建一个新的函数实例，React 要先传入null清空旧的 ref ，传入DOM元素或class组件实例设置新的。当ref属性是字符串时，通过this.refs.字符串访问，该API存在一些问题不建议使用（比如**不可组合**，即如果一个库在传递的子组件上放了一个ref，用户就不能在上面放另一个ref）。

在ref适合的场景下，可能需要在父组件中引用子节点的DOM，特别是高可复用“叶”组件（比如某种Button，某种Input），**如何将DOM 暴露给父组件？**（虽然不建议，因为它会打破组件的封装）。

![](../../../public/front-end/frame/react/14.png)

![](../../../public/front-end/frame/react/15.png)

React.forwardRef 接受以props 和 ref 作为参数且返回 React 节点的渲染函数作为参数。常规函数组件和 class 组件不接收 ref 参数，且 props 中也不存在 ref。在React DevTools中，React.forwardRef显示为 “ForwardRef”，若渲染函数是非匿名函数则显示为“ForwardRef(渲染函数名称)”。在组件库中使用React.forwardRef 时应当将其视为一个破坏性更改并发布库的一个新的主版本，因为库可能会有明显不同的行为，并可能会导致依赖旧行为的应用和其他库崩溃。

谨慎使用 ref实现想要的功能，**而应该首先考虑自上而下的数据流即状态提升**。

## 事件相关

### 传递事件处理函数给组件

首先需要成功绑定当前组件实例，确保函数可以访问当前类组件的属性this.props 和 this.state。非箭头函数如果没有进行绑定，由于类中是严格模式，则this为undefined，会报错。如果使用 createReactClass() 方法创建组件，组件中的方法会自动绑定至实例。四种写法中，后两者存在性能问题，推荐前两种写法（Create React App 默认启用 public class fields语法）：

![](../../../public/front-end/frame/react/16.png)

有时需要传递参数给事件处理函数，以下写法中，箭头函数（或者调用.bind）由于每次re-rende都会创建函数而存在性能问题，这种情况下，React 的事件对象 e 会被作为第二个参数传递，而且如果通过箭头函数的方式，如果需要使用React 的事件对象 e，则必须显式的进行传递（(e) => this.eventHandler(params1, e)）。而通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。推荐第一种写法：

![](../../../public/front-end/frame/react/17.png)

有时需要阻止事件处理函数被调用太快或者太多次，需要限制执行事件处理函数的速度，可以使用throttle节流、debounce防抖或requestAnimationFrame 节流。

![](../../../public/front-end/frame/react/18.png)

![](../../../public/front-end/frame/react/19.png)

![](../../../public/front-end/frame/react/20.png)

### React事件

与HTML的DOM元素上的事件处理不同，React元素的事件处理：
1. React事件的命名采用小驼峰式（camelCase），而不是纯小写。
2. 使用JSX 语法时需要传入一个函数作为事件处理函数，而不是字符串。
3. 阻止默认行为必须显式地使用 preventDefault，而不能通过return false 的方式。

React事件是一个合成事件（SyntheticEvent ），SyntheticEvent 实例将被传递给事件处理函数，它是浏览器的原生事件的跨浏览器包装器，将事件标准化（normalize）使得在不同浏览器中拥有一致的属性。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 e.stopPropagation和 e.preventDefault。使用 e.nativeEvent 属性可以获取原生事件。

![](../../../public/front-end/frame/react/21.png)

**React事件支持注册冒泡阶段触发（比如onClick）或捕获阶段触发（比如onClickCapture）**。React中的事件列表有：

![](../../../public/front-end/frame/react/22.png)

![](../../../public/front-end/frame/react/23.png)

![](../../../public/front-end/frame/react/24.png)

React 16 及更早版本、React Native中，SyntheticEvent 对象会被放入事件池中统一管理， SyntheticEvent 对象可以被复用，当事件处理函数被调用之后，其所有属性都会被置空，如果需要在事件处理函数运行之后获取事件对象的属性，需要调用 e.persist()。Web端React 17 中移除了event pooling（事件池）。

![](../../../public/front-end/frame/react/25.png)

对大多数事件来说，React 实际上并不会将它们附加到 DOM 节点上。相反，React 会直接在顶层节点（v17之前是document，v17+是渲染 React 树的根 DOM 容器）上为每种事件类型附加一个处理器，即事件委托。当顶层节点上触发 DOM 事件时，React 会找出调用的组件，从事件源对应的fiber开始向上收集上面的 React 合成事件，将React冒泡事件和React捕获事件分别入队到 React 事件执行队列的队尾和队首，然后模拟捕获和冒泡阶段。因此在v17之前即使是带Capture的捕获事件也是处于原生事件的冒泡阶段。而React17中合成捕获事件现在使用的是实际浏览器中的捕获监听器。

React16 的e.stopPropagation只能阻止合成事件的冒泡（react17，18可以阻止document上的冒泡），e.nativeEvent对应的是原生事件对象，e.nativeEvent.stopImmediatePropagation可以阻止顶层节点的其他事件触发。

![](../../../public/front-end/frame/react/26.png)

![](../../../public/front-end/frame/react/27.png)

在 React 18 之前，只在React事件处理程序或生命周期内进行批量更新（批量更新是setState“异步”的原因），Promise、setTimeout/setInterval、原生事件处理程序或任何其他事件内部的更新不会批处理。从 React 18 开始使用createRoot，所有更新都将自动批处理，无论它们来自何处。同时，React 只有在安全的情况下才会去批量更新，比如会确保对于每个用户发起的事件（如点击或按键），DOM 在下一个事件之前完全更新。

## Hooks 相关

Hook并不会在因为在每次渲染时创建函数而变慢，因为现代浏览器中，闭包和类的原始性能只有在极端场景下才会有明显的差别。相反，Hook 的设计在某些方面更加高效：
1. Hook 避免了 class 需要的额外开支，比如创建类实例和在构造函数中绑定事件处理器的成本。 
2. 符合语言习惯的代码在使用 Hook 时不需要很深的组件树嵌套。这个现象在使用高阶组件、render props、和 context 的代码库中非常普遍。组件树小了，React 的工作量也随之减少。
传统上认为，在 React 中使用内联函数对性能的影响，与每次渲染都传递新的回调会如何破坏子组件的 shouldComponentUpdate 优化有关。Hook 从三个方面解决了这个问题：
1. useCallback允许你在重新渲染之间保持对相同的回调引用以使得 shouldComponentUpdate 继续工作。
2. useMemo使得控制具体子节点何时更新变得更容易，减少了对纯组件的需要。
3. useReducer Hook 可以减少对深层传递回调的依赖。

**Hooks的限制？**

只能在函数式组件顶层或自定义Hook中而不能在条件、循环或嵌套函数中调用Hook，否则请提取状态为新组件或在 Hook 的内部进行条件判断。因为，Hooks 的设计是基于链表实现。在调用时按顺序加入，如果使用循环、条件或嵌套函数很有可能导致取值错位，执行错误的 Hook。这可以引入 ESLint 的 Hooks 检查插件eslint-plugin-react-hooks进行预防。

**Hook 会替代 render props 和高阶组件吗？**

Hook除了 getSnapshotBeforeUpdate 和 componentDidCatch 还不支持。提取复用逻辑，除了有明确父子关系的，大多数场景使用 Hooks 足够了，并且能够帮助减少嵌套。Render props 和高阶组件本质上都是将复用逻辑提升到父组件中。Render Props在组件渲染上拥有更高的自由度，可以根据父组件提供的数据进行动态渲染，适合有明确父子关系的场景。高阶组件（HOC）适合用来做注入，并且生成一个新的可复用组件。适合用来写插件。

### useState 和 useEffect

![](../../../public/front-end/frame/react/28.png)

#### useState

开发环境且严格模式下，React将两次调用期望为纯函数的函数（函数组件、初始化函数initialState、更新函数nextState），以找到以外的不纯性，这不影响生产。
1. initalState是希望 state 初始化的值。它在初始渲染后，此参数将被忽略。它可以是任何类型的值，但如果传递函数作为 initialState，将被视为初始化函数（无参且返回一个任何类型的值的纯函数，初始化组件时被 React 调用，并将其返回值存储为初始状态）。
2. 返回值是由两个值组成的数组：
    1. 当前的 state：在首次渲染时，与传递的 initialState 相同。
    2. set 函数：参数为想要 state 更新为的值即 nextState。它可以是任何类型的值，但如果传递函数作为 nextState，将被视为更新函数（唯一参数为当前的 state 且返回值为 nextState）。如果 nextState 与当前 state 相同（由 Object.is 比较确定），React 将跳过重新渲染该组件及其子组件。React 会确保 set函数的标识是稳定的，并且不会在组件重新渲染时发生变化。与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象，可以用传递函数的方式结合展开运算符来达到合并更新对象的效果。调用 set 函数 不会 改变已经执行的代码中当前的 state，它只影响下一次渲染中 useState 返回的内容，如果需要使用nextState，可以在将其传递给 set 函数之前将其保存在一个变量中。

**向非受控组件传递不同的 key 可以重置组件的状态。**

#### useEffect

1. effect处理 Effect 的函数。setup 函数选择性返回一个清理（cleanup） 函数。当组件被添加到 DOM 的时候，React 将运行effect函数。在每次依赖项变更重新渲染后，React 将首先使用旧值运行 cleanup 函数（如果提供了该函数），然后使用新值运行 effect函数。在组件从 DOM 中移除后，React 将最后一次运行 cleanup 函数。cleanup 函数不仅在卸载期间运行，也在每个依赖项变更的重新渲染前运行。此外，在开发环境且严格模式下中，React 在组件挂载后会立即额外运行一次 setup + cleanup。
2. dependencies，可选，effect函数中引用的所有响应式值的列表。响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。并且必须像 [dep1, dep2, dep3] 这样内联编写。React 将使用 Object.is 来比较每个依赖项和它先前的值。
    1. 如果指定了依赖项，则 Effect 在 初始渲染后以及依赖项变更的重新渲染后运行。
    2. 如果完全不传递依赖数组，则 Effect 会在组件的 每次单独渲染（和重新渲染）之后 运行。
    3. 如果传递空依赖数组，则它仅在**初始渲染后**运行。

### useCallback 和 useMemo

![](../../../public/front-end/frame/react/29.png)

#### useCallback

**useCallback** 返回一个 memoized 回调函数。把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。**当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染**（例如 shouldComponentUpdate、React.memo）的子组件时，它将非常有用。useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。

**基本用法**：使用 React.memo 封装函数子组件，使用 useCallback 封装作为 props 传递给子组件的回调函数 ，只有当依赖数据变更时，传递的回调函数才会视为变更，子组件才会驱动引发重新渲染，这有助于优化性能。
函数式组件，每次渲染内部都会执行一遍，因此无论使不使用 useCallback 每次渲染都是会新创建一个函数的，不会因依赖没有变化而减少，只是返回的函数是新创建的函数还是已经缓存下来的函数。

**如何从 useCallback 读取一个经常变化的值？**

如果每次重新渲染，依赖都会改变，useCallback返回的时重新创建的内联回调函数而不是之前缓存的，**此时使用引用相等性去避免非必要渲染就会失效**。可以使用useRef来传递依赖数组变量，保证即使依赖数组变量改变，返回的缓存函数不变，封装成自定义hook如下：

![](../../../public/front-end/frame/react/30.png)

**但不推荐使用这种模式**，而更倾向于通过 context 用 useReducer 往下传一个 dispatch 函数，dispatch context 永远不会变，避免不断在props中层层转发回调。

#### useMemo

useMemo 返回一个 memoized 值。把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。**这种优化有助于避免在每次渲染时都进行高开销的计算**。

记住，传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行不应该在渲染期间内执行的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo。如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。

可以把 useMemo 作为性能优化的手段，但不要把它当成语义上的保证。将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。先编写在没有 useMemo 的情况下也可以执行的代码 —— 之后再在你的代码中添加 useMemo，以达到优化性能的目的。 

### useWindowDimension（RN）和 useColorScheme（RN）

useColorScheme 这个 React hook 提供并订阅来自 Appearance 模块的颜色方案更新。返回值表示当前用户首选的颜色方案（"light": 用户倾向于使用浅色主题；"dark": 用户倾向于使用深色主题；null: 用户未指定首选颜色方案）。该值可以稍后通过直接用户动作（例如，设备设置中的主题选择）或根据时间表（例如，遵循白天/夜晚周期的亮主题和暗主题）来更新。

## Fiber相关

**diff 算法**是指生成更新补丁的方式，主要应用于虚拟 DOM 树变化后，更新真实 DOM。所以 diff 算法一定存在这样一个过程：触发更新 → 生成补丁 → 应用补丁。

React 的 diff 算法，触发更新的时机主要在 state 变化与 hooks 调用之后。此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。
1. 树比对：由于网页视图中较少有跨层级节点移动，两株虚拟 DOM 树只对同一层次的节点进行比较。
2. 组件比对：如果组件是同一类型，则进行树比对，如果不是，则直接放入到补丁中。
3. 元素比对：主要发生在同层级中，通过标记节点操作生成补丁，节点操作对应真实的 DOM 剪裁操作。

以上是经典的 React diff 算法内容。自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。整个更新过程由 current 与 workInProgress 两株树双缓冲完成。workInProgress 更新完成后，再通过修改 current 相关指针指向新节点。

**React15 及以前的架构**：
1. Reconciler（协调器）—— 负责找出变化的组件；采用递归的方式生成虚拟DOM，递归过程是不能中断的。Stack Reconciler，若组件树的层级很深，递归更新占用线程耗时超过16ms，浏览器引擎会从多个函数的调用的执行栈的顶端开始执行，直到执行栈被清空才会停止。然后将执行权交还给浏览器。此时浏览器得不到控制权，事件响应和页面动画因为浏览器不能及时绘制下一帧，就会出现卡顿和延迟。
2. Renderer（渲染器）—— 负责将变化的组件渲染到页面上；

**React16 将递归的无法中断的更新重构为异步的可中断更新**，架构可以分为三层：
1. Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler；
2. Reconciler（协调器）—— 负责找出变化的组件：更新工作从递归变成了可以中断的循环过程。Reconciler内部采用了Fiber的架构；Fiber Reconciler 中用链表遍历的方式替代了 React 16 之前的栈递归。Fiber Reconciler 用空间换时间，更高效的操作可以方便根据优先级进行操作。同时可以根据当前节点找到其他节点，在挂起和恢复过程中起到了关键作用。
3. Renderer（渲染器）—— 负责将变化的组件渲染到页面上。

React Fiber 更新过程的可控主要体现在以下方面：

![](../../../public/front-end/frame/react/31.png)

React17 开始支持 concurrent mode，其根本目的是为了让应用保持cpu和io的快速响应，Concurrent Mode（并发模式）的功能包括 Fiber、Scheduler、Lane，可以根据用户硬件性能和网络状况调整应用的响应速度，核心就是为了实现异步可中断的更新。

React16 的 expirationTimes 模型通过是否大于等于expirationTimes决定节点是否更新。在事件处理函数或生命周期函数中实现批量更新，就是通过将任务设置为相同的 ExpirationTime。这些任务将同时满足 task.expirationTime >= currentExecTaskTime 并被执行。React17的优化的 lanes模型可以选定一个更新区间，并且动态的向区间中增减优先级，可以处理更细粒度的更新。

## Redux

### 对redux的理解

**主要解决的问题**：单纯的Redux只是一个状态机，是没有UI呈现的，react- redux作用是将Redux的状态机和React的UI呈现绑定在一起，当dispatch action改变state的时候，会自动更新页面。

React是视图层框架。**Redux是一个用来管理数据状态和UI状态的JavaScript应用工具**。随着JavaScript单页应用（SPA）开发日趋复杂， JavaScript需要管理比任何时候都要多的state（状态）， Redux就是降低管理难度的。（Redux支持React、Angular、jQuery甚至纯JavaScript）。

在 React 中，UI 以组件的形式来搭建，组件之间可以嵌套组合。**但 React 中组件间通信的数据流是单向的，顶层组件可以通过 props 属性向下层组件传递数据，而下层组件不能向上层组件传递数据，兄弟组件之间同样不能**。这样简单的单向数据流支撑起了 React 中的数据可控性。

**当项目越来越大的时候，管理数据的事件或回调函数将越来越多，也将越来越不好管理。管理不断变化的 state 非常困难**。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。state 在什么时候，由于什么原因，如何变化已然不受控制。当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等。state 的管理在大项目中相当复杂。

**Redux 提供了一个叫 store 的统一仓储库，组件通过 dispatch 将 state 直接传入store，不用通过其他的组件。并且组件通过 subscribe 从 store获取到 state 的改变。使用了 Redux，所有的组件都可以从 store 中获取到所需的 state，他们也能从store 获取到 state 的改变。这比组件之间互相传递数据清晰明朗的多。**

### Redux的原理与工作流程

**原理**，Redux源码主要分为以下几个模块文件：
1. compose.js 提供从右到左进行函数式编程
2. createStore.js 提供作为生成唯一store的函数
3. combineReducers.js 提供合并多个reducer的函数，保证store的唯一性
4. bindActionCreators.js 可以让开发者在不直接接触dispacth的前提下进行更改state的操作
5. applyMiddleware.js 这个方法通过中间件来增强dispatch的功能

**工作流程：**
1. const store= createStore（reducer）生成数据; 
2. action: {type, payload}定义行为; 
3. dispatch发起action：store.dispatch(action); 
4. reducer：处理action，返回新的state;

简单来说就是，**首先**，用户（通过View）发出Action，发出方式就用到了dispatch方法；**然后**，Store自动调用Reducer，并且传入两个参数：当前State和收到的Action，Reducer会返回新的State；**最后**，State—旦有变化，Store就会调用监听函数，来更新View。

以 store 为核心，可以把它看成数据存储中心，但是他要更改数据的时候不能直接修改，数据修改更新的角色由Reducers来担任，store只做存储，中间人，当Reducers的更新完成以后会通过store的订阅来通知react component，组件把新的状态重新获取渲染，组件中也能主动发送action，创建action后这个动作是不会执行的，所以要dispatch这个action，让store通过reducers去做更新React Component 就是react的每个组件。

### redux数据流

**初始启动：**
1. 使用最顶层的 root reducer 函数创建 Redux store。
2. store 调用一次 root reducer，并将返回值保存为它的初始 state。
3. 当 UI 首次渲染时，UI 组件访问 Redux store 的当前 state，并使用该数据来决定要呈现的内容。同时监听 store 的更新，以便可以知道 state 是否已更改。

**更新环节**：
1. 应用程序中发生了某些事情，例如用户单击按钮。
2. dispatch一个 action 到 Redux store，如果是异步逻辑，则先调用 dispatch 到达 middleware 进行异步调用，然后在异步调用完成时 dispatch 一个真正的 action 对象到 Redux store。
3. store 用之前的 state 和当前的 action 再次运行 reducer 函数，并将返回值保存为新的 state 。
4. store 通知所有订阅过的 UI，通知它们 store 发生更新。
5. 每个订阅过 store 数据的 UI 组件都会检查它们需要的 state 部分是否被更新。
6. 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页。

### Redux和Vuex的比较

本质上，redux与vuex都是对mvvm思想的服务，将数据从视图中抽离的一种方案。单—的数据源，变化可以预测。区别在于：
1. Vuex改进了Redux中的Action和Reducer函数，以mutations变化函数取代Reducer，无需switch，只需在对应的mutation函数里改变state值即可
2. Vuex由于Vue自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的State即可
3. Vuex数据流的顺序是∶View调用store.commit提交对应的请求到Store中对应的mutation函数->store改变（vue检测到数据变化自动渲染）