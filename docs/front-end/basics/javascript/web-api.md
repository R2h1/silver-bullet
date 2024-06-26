# WebAPI

### URL API

URL 接口用于解析，构造，规范化和编码 URL（统一资源定位符Uniform Resource Locator，是指定在 Internet 上可以找到资源的位置的文本字符串，在 HTTP 的上下文中，URL 被叫做”网络地址“或“链接”。浏览器在其地址栏显示 URL。URL也可用于文件传输（FTP）、电子邮件（SMTP）和其他应用）。

**new URL(url [, base])构造函数**返回一个新创建的 URL 对象，如果绝对url（或者base + 相对url）是一个无效的 URL 链接则会抛出TypeError错误。
1. 参数url是一个表示绝对或相对 URL 的 DOMString。如果url 是相对 URL，则会将 base 用作基准 URL。如果 url 是绝对 URL，则无论参数base是否存在，都将被忽略。
2. 参数base是一个表示基准 URL 的 DOMString，在 url 是相对 URL 时，它才会起效。如果未指定，则默认为''。

**URL的静态方法（均在Web Worker中可用）**：
1. URL.createObjectURL(object)方法会创建一个 DOMString，其中包含一个表示参数中给出的对象object的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的 URL 对象表示指定的 File 对象或 Blob 对象。在 Service Worker 中不可用，因为它有可能导致内存泄漏。在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放。浏览器在 document 卸载的时候，会自动释放它们，但是为了获得最佳性能和内存使用状况，应该在安全的时机主动释放掉它们。
2 .URL.revokeObjectURL(objectURL)方法用来释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。

**URL原型属性与方法（均在Web Worker中可用）**：
1. URL.prototype.hash 属性返回一个 USVString，其中会包含 URL 标识中的 '#' 和 fragment 标识符，fragment 不会经过百分比编码（URL 编码）。如果 URL 中没有 fragment，该属性会包含一个空字符串 —— ""。
2. URL.prototype.host 属性是一个 USVString 值，包含了主机信息，也就是主机名（hostname），冒号 ':' 和 URL 的 端口（port）。
3. URL.prototype.hostname 属性是一个 USVString 值，包含有 URL 中的域名。
4. URL.prototype.href 属性是一个包含完整 URL 的 USVString 值。
5. URL.prototype.origin只读属性返回一个 USVString 类型值，包含 URL 源经过 Unicode 序列化之后的值：
    1. 对于使用 http 或者 https 协议的 URL, 返回协议名，然后是 '://', 然后是域，然后是 ':', 最后是端口号 (默认端口是 80 和 443);
    2. 对于使用 file: 协议的 URL，返回值因浏览器而异;
    3. 对于使用 blob: 协议的 URL，返回值是 blob: 后跟随的源地址。比如"blob:https://mozilla.org" 将会返回 "https://mozilla.org"
6. URL.prototype.password 属性为USVString，其中包含在域名之前指定的密码。如果在未设置username属性的情况下进行访问，默认失败。
7. URL.prototype.username 属性是USVString ，其中包含域名前指定的username。
8. URL.prototype.pathname 属性是一个USVString，包含一个 '/' （域名后的首个）和 URL 的路径，如果没有路径，则pathname为空字符串。
9. URL.prototype.属性是包含了 URL 的端口号信息的USVString值，如果 URL 中不包含明确的端口号，这个属性将为''
10. URL.prototype.protocol 属性是一个包含 URL 协议的USVString值，而且包含协议后的':'。
11. URL.prototype.search属性是一个搜索字符串，也称为查询字符串，这是一个包含一个'?'后面跟着 URL 的参数的USVString。现代浏览器提供URL.prototype.searchParams属性，以便轻松解析查询字符串中的参数。
12. URL.prototype.searchParams 属性返回一个 URLSearchParams 对象，这个对象包含当前 URL 中解码后的 GET 查询参数。
    1. URLSearchParams对象可以由new URLSearchParams(init)构造函数创建，其中参数init是一个一个 USVString。URLSearchParams 构造函数不会解析一个完整 URL，但是如果字符串起始位置有 ? 的话会被去除。
    2. URLSearchParams.prototype.append(name, value)添加一个新的name=value的查询参数。
    3. URLSearchParams.prototype.delete(name)删除指定name的所有查询参数。
    4. URLSearchParams.prototype.entries()方法返回一个iterator，每个键值对是[name, value]查询参数
    5. URLSearchParams.prototype..forEach(callback(value, name, searchParams))方法 forEach 允许通过回调函数callback来遍历 URLSearchParams 实例对象上的键值对。
    6. URLSearchParams.prototype.get(name)方法返回第一个与name对应的查询参数的value，如果没找到，返回 null.。
    7. URLSearchParams.prototype.getAll(name)方法以数组的形式返回与name对应的所有查询参数的value。
    8. URLSearchParams.prototype.has(name)返回一个 Boolean 表示一个指定的键名name对应的value值是否存在。
    9. URLSearchParams.prototype.keys()返回一个包含所有name的iterator。
    10. URLSearchParams.prototype.values()返回一个包含所有value的iterator。
    11. URLSearchParams.prototype.toString()返回在 URL 中使用的查询字符串，不包括“?”。
    12. URLSearchParams.prototype.set(name, value) 方法用于设置或修改name对应的value。
    13. URLSearchParams.prototype.sort() 方法对包含在对象中的所有键/值对进行排序，并返回 undefined。排序顺序是根据键的 Unicode 代码点，并且相等键的键/值对之间的相对顺序不变。
13. URL.prototype.toJSON() 方法返回一个USVString，其中包含一个序列化的 URL 版本。和URL.prototype.href结果同。
14. URL.prototype.toString() 字符串化方法返回一个包含完整 URL 的 USVString。它的作用等同于只读的 URL.prototype.href。

### 全局 URI 处理函数

encodeURI(URI) 函数是全局对象的函数属性，它对参数URI进行编码，用一个、两个、三个或四个转义序列取代某些字符的实例，代表该字符的UTF-8编码（对于由两个代用字符组成的字符，将只有四个转义序列）。与encodeURIComponent()相比，这个函数编码的字符较少，保留了URI语法的一部分。encodeURI(URI)转义所有字符，除了A–Z a–z 0–9 - _ . ! ~ * ' ( ) ; / ? : @ & = + $ , #。encodeURIComponent() 也不对字符 -.!~*'() 进行编码，但会对; / ? : @ & = + $ , #进行编码。因为&、+和=没有被编码，它们在GET和POST请求中被视为特殊字符，例如XMLHttpRequest，所以encodeURI()本身不能形成适当的HTTP GET和POST请求，所以应该使用encodeURIComponent()。

encodeURIComponent(uriComponent)和encodeURI(URI)的区别在于会对保留字符; / ? : @ & = + $ , #进行编码。

decodeURI(encodedURI) 函数是全局对象的函数属性，能解码由encodeURI 创建或其它流程得到的统一资源标识符（URI）。当encodedURI 包含无效字符序列时，引发URIError（“格式错误的 URI 序列”）异常。将已编码 URI 中所有能识别的转义序列转换成原字符，但不能解码那些不会被 encodeURI 编码的内容。

decodeURIComponent(encodeURI) 函数是全局对象的函数属性，用于解码由 encodeURIComponent 方法或者其它类似方法编码的部分统一资源标识符（URI）。当encodedURI 包含无效字符序列时，引发URIError（“格式错误的 URI 序列”）异常。

### Fetch API

![](/front-end/basics/javascript/147.png)

Fetch API 提供了一个获取资源的接口（包括跨网络通信）。Fetch 的核心在于对 HTTP 接口的抽象，包括 Request，Response，Headers，Body，以及用于初始化异步请求的全局的fetch方法。Fetch 利用到了请求的异步特性——它是基于 Promise 的。此特性在 Web Worker 中可用，Service Workers就是大量使用Fetch的 API。

Fetch API 的 Headers 接口允许对 HTTP 请求和响应头执行各种操作。这些操作包括检索，设置，添加和删除。一个 Headers 对象具有关联的HTTP标头可迭代列表，它最初为空，由零个或多个键值对组成。在该接口的所有方法中，标题名称由不区分大小写的字节序列匹配。在 header 已存在或者有多个值的状态下header.set() 和 header.append()的使用有如下区别，header.set() 将会用新的值覆盖已存在的值，但是headers.append()会将新的值添加到已存在的值的队列末尾。出于安全考虑，某些头只能由用户代理控制。这些头信息包括**禁止修改的请求标头**和**禁止修改的响应标头（set-Cookie、Set-Cookie2）**。

可以通过 Request.headers 和Response.headers 属性检索一个Headers对象，并使用 Headers() 构造函数创建一个新的Headers 对象。如果尝试传入的名称不是有效的 HTTP 头名称的引用，则所有 Headers 方法都将引发 TypeError 。

Guard 是 Headers 对象的特性，基于不同的情况，它可以有以下取值：immutable、request、request-no-cors、response 或 none。当使用 Headers() 构造函数创建一个新的 Headers 对象的时，它的 guard 被设置成 none（默认值）。而当创建Request 或 Response 对象的时候，它将拥有一个按照以下规则实现的与之关联的 Headers 对象：

guard 会影响Headers对象的 set()、delete() 和 append() 方法。如果试图修改 的guard 是 immutable 的Headers 对象，那么会抛出一个 TypeError。以下情况则不会抛出错误：
1. guard 是 request 并且头信息中的 name 不是**禁止修改的标头**。
2. guard 是 request-no-cors 并且头信息中的 name/value 是**简单标头**（Accept、Accept-Language、Content-Language、Content-Type并且值是 application/x-www-form-urlencoded, multipart/form-data, 或者 text/plain之一的（忽略参数）、DPR、Downlink、Save-Data、Viewport-Width、Width）。
3. guard 是 response 并且头信息中的 name 不是**禁止修改的响应标头**。

全局的fetch(input[, init]) 方法用于发起获取资源的请求。它返回一个 promise，这个 promise 会在请求响应后被 resolve，并传回 Response 对象。当遇到网络错误时，fetch() 返回的 promise 会被 reject，并传回 TypeError，虽然这也可能因为权限或其他问题导致。成功的 fetch() 检查不仅要包括 promise 被 resolve，还要包括 Response.ok 属性为 true。HTTP 404 状态并不被认为是网络错误。

fetch ()与 jQuery.ajax() 主要有以下的不同：
1. 当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject，即使响应的 HTTP 状态码是 404 或 500。相反，它会将 Promise 状态标记为 resolve（如果响应的 HTTP 状态码不在 200 - 299 的范围内，则设置 resolve 返回值的 ok 属性为 false），仅当网络故障时或请求被阻止时，才会标记为 reject。
2. 除非你在 init 对象中设置（去包含）credentials，否则 fetch() 将不会发送跨源 cookie。

Fetch API 的 Response 接口呈现了对一次请求的响应数据。Response对象的属性与方法：
1. response.headers：只读，包含此 Response 所关联的 Headers 对象。
2. response.ok：只读，包含了一个布尔值，标示该 Response 成功（HTTP 状态码的范围在 200-299）。
3. response.redirected：只读，表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。
4. response.status：只读，包含 Response 的状态码。
5. response.statusText：只读，包含了与该 Response 状态码一致的状态信息。
6. response.type：只读，包含 Response 的类型。
7. response.url：只读，包含 Response 的 URL。
8. response.useFinalURL：包含了一个布尔值，来标示这是否是该 Response 的最终 URL。
9. response.body：只读一个简单的 getter，用于暴露一个 ReadableStream 类型的 body 内容。
10. response.bodyUsed：只读包含了一个布尔值来标示该 Response 是否读取过 Body。
11. response.clone()：创建一个 Response 对象的克隆。
12. response.error()：返回一个绑定了网络错误的新的 Response 对象。
13. response.redirect()：用另一个 URL 创建一个新的 Response。
14. response.arrayBuffer()：读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 ArrayBuffer 格式的 Promise 对象。
15. response.blob()：读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 Blob 格式的 Promise 对象。
16. response.formData()：读取Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 FormData 格式的 Promise 对象。
17. response.json()：读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 JSON 格式的 Promise 对象。
18. response.text()：读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 USVString 格式的 Promise 对象。

#### 中止请求

想实现真正的取消请求，就要用到 AbortController API，AbortController 接口表示一个控制器对象，允许根据需要中止一个或多个fetch请求。当调用AbortController API的abort()时，如果请求还没有结束，promise 会被 reject 掉，触发一个名为 AbortError 的 DOMException。

![](/front-end/basics/javascript/148.png)

### MouseEvent

MouseEvent 接口指用户与指针设备（如鼠标）交互时发生的事件。使用此接口的常见事件包括：click、dblclick、mouseup、mousedown。

MouseEvent 派生自 UIEvent，UIEvent 派生自 Event。虽然 MouseEvent.initMouseEvent() 方法保持向后兼容性，但是应该使用 MouseEvent() 构造函数创建一个 MouseEvent 对象。

具体的事件接口WheelEvent 和DragEvent都派生自 MouseEvent。

MouseEvent() 构造器创建一个 MouseEvent，用于主动给目标派发一个鼠标事件(dispatchEvent)，event = new MouseEvent(typeArg, mouseEventInit)，typeArg是DOMString格式的事件名称，mouseEventInit是初始化 MouseEvent 的对象，用于初始化以下实例属性。

MouseEvent的实例属性：
1. altKey、ctrlKey、shiftKey、metaKey: 当鼠标事件触发的时，alt 键或ctrl键或shift键或meta键是否被按下;
2. clientX、clientY：当鼠标事件触发的时，鼠标指针距离浏览器视口左上角原点的距离；
3. momentX、momentY：当前事件和上一个mousemove事件之间鼠标在水平方向或垂直方向上的移动值。currentEvent.movementX = currentEvent.screenX - previousEvent.screenX；
4. screenX、srceenY：鼠标指针相对于全局（屏幕）的 X 坐标或Y坐标；
5. x、y：clientX、clientY的别名；
6. offsetX、offsetY：鼠标指针相对目标节点（最底层）的内填充边（padding edge）在 X 轴或Y轴方向上的偏移量。
7. relatedTarget：鼠标事件的次要目标（如果存在），即鼠标事件上一个触发的目标，如果不存在则为null。
8. pageX、pageY：鼠标指针相对document的 X 坐标或Y坐标；

**click事件**：当定点设备的按钮（通常是鼠标的主键）在一个元素上被按下和放开时，click 事件就会被触发。如果在一个元素上按下按钮，而将指针移到元素外再释放按钮，则在包含这两个元素的最具体的父级元素上触发事件。click 事件会在 mousedown 和 mouseup 事件依次触发后触发。其 detail 属性设置了 target 被点击的次数。换句话说，在双击时，detail 是 2；三击时是 3；以此类推。该计数器会在没有任何点击的情况下会很快被重置，而间隔多长的时间则因浏览器和平台而异。间隔时间也可能受到用户偏好设置的影响；例如，无障碍选项可能会延长间隔时间，以便在自适应界面上更轻松地执行多次点击。
1. IE 8 和 9 中存在一个错误，在将 background-color 的计算值为 transparent 的元素覆盖在其他元素之上时，该元素不会收到 click 事件。click 事件将只会在底层元素上触发。该错误的解决方案
    1. 仅适用于 IE 9：设置 background-color: rgba(0,0,0,0) 设置 opacity: 0 以及为 background-color 设置一个明确的、除 transparent 以外的值。 
    2. 适用于 IE8 和 IE9：设置 filter: alpha(opacity=0); 以及为 background-color 设置一个明确的、除 transparent 以外的值。
2. safari 手机版 7.0+（也可能是更早的版本）存在一个错误，当一个元素为交互式元素（例如：`<div>`），且没有直接将事件监听器绑定在它们自身（即，适用事件委托）时，将无法触发在该元素上触发 click 事件。解决方法如下：
    1. 为该元素或者祖先元素，设置 cursor: pointer; 样式。
    2. 为该元素或者祖先元素（不包括 `<body>`），设置 onclick="void(0)" 属性。
    3. 使用可点击元素如 `<a>`，代替不可交互元素如 `<div>`。
    4. 不使用 click 的事件委托

**dbclick事件**：在单个元素上单击两次鼠标的指针设备按钮 (通常是小鼠的主按钮) 时，将触发 dblclick 事件。

**mousedown 事件**：在指针设备按钮按下时触发。

**mouseup事件**：当指针在元素中时， mouseup事件在指针设备（如鼠标或触摸板）按钮放开时触发。mouseup 事件与mousedown 事件相反。

**mouseenter 事件**：当一个定点设备（通常指鼠标）第一次移动到触发事件元素中的激活区域时，mouseenter 事件在该 Element 中触发。尽管与 mouseover 类似，但是 mouseenter 的不同之处在于当鼠标指针从它后代的物理空间移动到它自己的物理空间时，它不会冒泡，也不会发送给它的任何后代。

**mouseover 事件**：当鼠标移动到一个元素上时，会在这个元素上触发 mouseover 事件。

**mouseleave事件**：mouseleave 事件在定点设备（通常是鼠标）的指针移出某个元素时被触发。mouseleave 和 mouseout 是相似的，但是两者的不同在于 mouseleave 不会冒泡而 mouseout 会冒泡。这意味着当指针离开元素及其所有后代时，会触发 mouseleave，而当指针离开元素或离开元素的后代（即使指针仍在元素内）时，会触发 mouseout。

**mouseout事件**：当移动指针设备（通常是鼠标），使指针不再包含在这个元素或其子元素中时，mouseout 事件被触发。当指针从一个元素移入其子元素时，mouseout 也会被触发，因为子元素遮盖了父元素的可视区域。

**mousemove事件**：当指针设备 ( 通常指鼠标 ) 在元素上移动时，mousemove 事件被触发。

### MessageChannel

MessageChannel 接口的 MessageChannel() 构造函数返回一个新的 MessageChannel 对象，返回的对象中包含两个 MessagePort 对象。此特性在 Web Worker 中可用。MessageChannel 的只读属性 port1 返回消息通道的第一个端口，此端口连接到源上下文通道。MessageChannel接口的 port2 是一个只读属性，返回消息通道的第二个端口，该端口连接到通道另一端的上下文，也就是发送消息时的目的地。

### HTML Drag and Drop API

HTML 拖放（Drag and Drop）接口使应用程序能够在浏览器中使用拖放功能。典型的拖放操作：用户选中一个可拖拽的元素，并将其拖拽（鼠标不放开）到一个可放置的元素，然后释放鼠标。拖放事件DragEvent派生自 MouseEvent。特有属性dataTransfer是在拖放交互期间传输的数据。

在 HTML 中，除了图像、链接和选择的文本默认的可拖拽行为之外，其他元素在默认情况下是不可拖拽的。要使其他的 HTML 元素可拖拽：
1. 将想要拖拽的元素的枚举属性draggable设置成 "true"。
2. 为 dragstart 事件添加一个监听程序。
3. 在上一步定义的监听程序中 设置拖拽数据。

drag 事件在用户拖动元素或者被选择的文本时（每几百毫秒）持续触发。

dragstart 事件在用户开始拖动元素或被选择的文本时触发。

dragenter 事件在可拖动的元素或者被选择的文本进入一个有效的放置目标（即取消了dragenter事件或dragover事件的默认行为的元素）时触发。

dragleave 事件在可拖动的元素或被选择的文本离开一个有效的放置目标时被触发。

dragend 事件在拖放操作结束时触发（通过释放鼠标按钮或单击 escape 键）。

dragover 事件在可拖动的元素或者被选择的文本被拖进一个有效的放置目标时（每几百毫秒）持续触发。

drop 事件在可拖动的元素或者被选择的文本被放置在有效的放置目标上时被触发。

### Touch Events

触摸事件接口是较为底层的 API，可为特定程序提供多点触控交互（比如双指手势）的支持。多点触控交互开始于一个手指（或触控笔）开始接触设备平面的时刻。随后其他手指也可触摸设备表面，并随意进行划动。当所有手指离开设备平面时，交互结束。整个交互期间，程序接收开始、移动、结束三个阶段的触摸事件。触摸事件与鼠标事件类似，不同的是触摸事件还提供同一表面不同位置的同步触摸。

**表面（surface）**：可感知触摸的平面，可以是屏幕或触控板。

**触摸点（touch point）**：表面上的一个接触点。有可能是手指 (或者胳膊肘、耳朵、鼻子都行。但一般是手指) 或者触摸笔。

**TouchEvent** 是一类描述手指在触摸平面（触摸屏、触摸板等）的状态变化的事件。这类事件用于描述一个或多个触点，使开发者可以检测触点的移动，触点的增加和减少，等等。

TouchEvent 的属性继承了 UIEvent 和 Event。TouchEvent的构造函数TouchEvent使用new TouchEvent(type[, options])创建TouchEvent对象：
1. type：带有事件名称的字符串。它区分大小写，浏览器将其设置为 touchstart、touchend、touchmove、touchcancel。
    1. touchcancel：事件在触点被中断时触发，中断方式基于特定实现而有所不同（例如，创建了太多的触点）。
    2. touchend：当触点离开触控平面时触发touchend事件。
    3. touchmove：事件在触点于触控平面上移动时触发。
    4. touchstart：事件在一个或多个触点与触控设备表面接触时被触发。
2. options：除了在UIEvent()中定义的属性外，还配置以下TouchEvent的属性：
    1. touches：一个TouchList，默认为空，这是当前接触表面的每个接触点的对象列表。
    2. targetTouches：一个TouchList，默认为空，它是接触表面并从作为当前事件目标的元素开始的TouchList每个接触点的对象列表。
    3. changedTouches：一个TouchList，默认为空，这是对事件有贡献的每个接触点的对象列表：
        1. 对于 touchstart 事件，它是当前事件变为活动的触摸点的列表。
        2. 对于 touchmove 事件，它是自上次事件以来更改的触摸点列表。
        3. 对于 touchend 事件，它是从表面移除的触摸点的列表（即，与手指不再接触表面的触摸点集合）。
    4. ctrlKey：布尔值，默认为false，指示是否ctrl同时按下该键。
    5. shiftKey：布尔值，默认为false，指示是否shift同时按下该键。
    6. altKey：布尔值，默认为false，指示是否alt同时按下该键。
    7. metaKey：布尔值，默认为false，指示是否meta同时按下该键。

TouchList 对象代表多个触点 Touch 对象的一个类数组。TouchList.prototype.item(index) 返回列表中以指定值index作为索引的 Touch 对象。每个 Touch 对象代表一个触点，其中包含参考浏览器视角的相对坐标; 每个触点都由其位置，大小，形状，压力大小，和目标 element 描述。Touch接口没有方法，也没有父类，不继承任何方法：
1. Touch.target：返回触摸点最初接触的 Element，即使这个触摸点已经移出那个元素的交互区域。需要注意的是，如果这个元素在触摸过程中被移除，这个事件仍然会指向它，因此这个事件也不会冒泡到 window 或 document 对象。因此，如果有元素在触摸过程中可能被移除，最佳实践是将触摸事件的监听器绑定到这个元素本身，防止元素被移除后，无法再从它的上一级元素上侦测到从该元素冒泡的事件。
2. Touch.identifier：此 Touch 对象的唯一标识符。一次触摸动作 (例如手指触摸) 在平面上移动的整个过程中，该标识符不变。可以根据它来判断跟踪的是否是同一次触摸过程。
3. Touch.screenX：触点相对于屏幕左边缘的 X 坐标。
4. Touch.screenY：触点相对于屏幕上边缘的 Y 坐标。
5. Touch.clientX：触点相对于可见视区 (visual viewport) 左边缘的 X 坐标。不包括任何滚动偏移。
6. Touch.clientY：触点相对于可见视区 (visual viewport) 上边缘的 Y 坐标。不包括任何滚动偏移。
7. Touch.pageX：触点相对于 HTML 文档左边缘的 X 坐标。当存在水平滚动的偏移时，这个值包含了水平滚动的偏移。
8. Touch.pageY：触点相对于 HTML 文档上边缘的 Y 坐标。当存在垂直滚动的偏移时，这个值包含了垂直滚动的偏移。
9. Touch.radiusX：返回能够包围接触区域的最小椭圆的水平轴 (X 轴) 半径。这个值的单位和 screenX 相同。如果设备认为触点只是一个点而不是一个面，始终为 1。
10. Touch.radiusY：返回能够包围接触区域的最小椭圆的垂直轴 (Y 轴) 半径。这个值的单位和 screenY 相同。如果设备认为触点只是一个点而不是一个面，始终为 1。
11. Touch.rotationAngle：返回一个角度值，表示上述由radiusX 和 radiusY 描述的椭圆为了尽可能精确地覆盖用户与平面之间的接触区域而需要顺时针旋转的角度。
12. Touch.force：返回用户对触摸平面的压力大小，是一个从 0.0(没有压力) 到 1.0(最大压力) 的浮点数。如果设备本身不支持侦测压感，那么 force 属性的值将始终是 0。

Touch对象属性 Touch.radiusX, Touch.radiusY, 和 Touch.rotationAngle 表示用户触摸操作所作用的区域，即触摸区域，这些属性可以表示出一个尽可能匹配触控区域的椭圆形（例如用户的指尖触控）。

以下是使用触摸事件时要考虑的最佳做法：
1. 最大限度地减少在触摸处理程序中完成的工作量。
2. 将触摸事件处理程序添加到特定目标元素（而不是整个文档或文档树中较高的节点）。
3. 在 touchstart 中添加 touchend， touchcancel 和 touchmove 事件处理程序。
4. 目标元素应足够大以适应手指触摸。如果目标区域太小，触摸它可能会导致相邻元素发射其他事件。

**移动端300ms延迟**：鉴于移动端的双击缩放的功能，因此浏览器在点击之后要等待300ms，看用户有没有下一次点击来判断是不是双击。解决方案：
1. chrome在32+已经解决，只要有添加`<meta name="viewport" content="width=device-width">`即可。
2. 使用CSS属性touch-action：manipulation，浏览器只允许进行滚动和持续缩放操作。任何其他被 auto 值支持的行为不被支持。启用平移和缩小缩放手势，但禁用其他非标准手势，例如双击以进行缩放。禁用双击可缩放功能可减少浏览器在用户点击屏幕时延迟生成点击事件的需要。这是“pan-x pan-y pinch-zoom”（为了兼容性本身仍然有效）的别名。其中对于 IE10 使用-ms-touch-action: manipulation。
3. Chrome所有版本中，在`<meta name="viewport" content="width=device-width">`中使用 user-scalable=no也能达到目的。但请注意，user-scalable=no 也会禁用双指缩放。
4. FastClick，在touchend阶段调用event.preventDefault，然后通过 document.createEvent 创建一个 MouseEvents，然后通过eventTarget.dispatchEvent 触发对应目标元素上绑定的 click事件。

**事件穿透**：移动端上，有两层重叠的元素，上面的元素绑定有touch事件，点击后该元素消失，下面是一个默认会触发click事件的元素（a元素，表单元素，带click事件的元素），此时点击上一层的元素，下一层也同样会被点击。原因是如果在存在300ms延迟的移动端，触发click事件事件是在300ms以后，此时上层元素已经消失，导致click事件被派发到下层元素上。解决方法是在touchstart事件中调用e.prevetDefault取消事件的默认行为。

### Audio API

Web Audio API 使用户可以在音频上下文（AudioContext）中进行音频操作，具有模块化路由的特点。在音频节点上操作进行基础的音频，它们连接在一起构成音频路由图。即使在单个上下文中也支持多源，尽管这些音频源具有多种不同类型通道布局。这种模块化设计提供了灵活创建动态效果的复合音频的方法。

音频节点通过它们的输入输出相互连接，形成一个链或者一个简单的网。一般来说，这个链或网起始于一个或多个音频源。音频源可以提供一个片段一个片段的音频采样数据（以数组的方式），一般，一秒钟的音频数据可以被切分成几万个这样的片段。这些片段可以是经过一些数学运算得到（比如OscillatorNode），也可以是音频或视频的文件读出来的（比如AudioBufferSourceNode和MediaElementAudioSourceNode），又或者是音频流（MediaStreamAudioSourceNode）。其实，音频文件本身就是声音的采样数据，这些采样数据可以来自麦克风，也可以来自电子乐器，然后混合成一个单一的复杂的波形。

这些节点的输出可以连接到其他节点的输入上，然后新节点可以对接收到的采样数据再进行其他的处理，再形成一个结果流。一个最常见的操作是通过把输入的采样数据放大来达到扩音器的作用（缩小就是一个弱音器）。声音处理完成之后，可以连接到一个目的地（AudioContext.destination），这个目的地负责把声音数据传输给扬声器或者耳机。注意，只有当用户期望听到声音时，才需要进行最后一个这个连接。

一个简单而典型的 web audio 流程如下：
1. 创建音频上下文；
2. 在音频上下文里创建源 — 例如 `<audio>`, 振荡器，流；
3. 创建效果节点，例如混响、双二阶滤波器、平移、压缩；
4. 为音频选择一个目的地，例如系统扬声器；
5. 连接源到效果器，对目的地进行效果输出。

使用这个API，时间可以被非常精确地控制，几乎没有延迟，这样开发人员可以准确地响应事件，并且可以针对采样数据进行编程，甚至是较高的采样率。这样，鼓点和节拍是准确无误的。

Web Audio API 也使我们能够控制音频的空间化。在基于源 - 侦听器模型的系统中，它允许控制平移模型和处理距离引起的衰减或移动源（移动侦听）引起的多普勒效应。

**AudioContext 接口**表示由链接在一起的音频模块构建的音频处理图，每个模块由一个AudioNode表示。音频上下文控制它包含的节点的创建和音频处理或解码的执行。在做任何其他操作之前需要创建一个AudioContext对象，因为所有事情都是在上下文中发生的。建议创建一个AudioContext对象并复用它，而不是每次初始化一个新的AudioContext对象，并且可以对多个不同的音频源和管道同时使用一个AudioContext对象。AudioContext 继承自BaseAudioContext。
1. AudioContext.createMediaElementSource(myMediaElement)方法用于创建一个新的 MediaElementAudioSourceNode对象，输入某个存在的HTMLMediaElement对象，即 HTML `<audio>` 或 `<video>` 元素，对应的音频即可被播放或者修改。

**AudioNode 接口**是一个处理音频的通用模块。一个 AudioNode 既有输入也有输出（例外：音频源有一个输出而没有输入），输入与输出都有一定数量的通道。一个 AudioNode 可以作为事件的目标，因为它实现了 EventTarget 接口。
1. AudioNode.connect(destination, outputIndex?, inputIndex?) 方法使能将一个节点的输出连接到一个指定目标，这个指定的目标可能是另一个 AudioNode（从而将音频数据引导到下一个指定节点）或一个AudioParam, 以便上一个节点的输出数据随着时间流逝能自动地对下一个参数值进行改变。
2. AudioContext.destination 属性返回一个 AudioDestinationNode，表示 context 中所有音频的最终目标节点，一般是音频渲染设备，比如扬声器。

**AnalyserNode 接口**表示了一个可以提供实时频域和时域分析信息的节点，继承自AudioNode，而且它不对音频流作任何改动，同时允许获取和处理它生成的数据，从而创建音频可视化，比如结合canvas。
1. AnalyserNode.fftSize 属性的值是一个无符号长整型的值，表示（信号）样本的窗口大小。当执行快速傅里叶变换（Fast Fourier Transfor (FFT)）时，这些（信号）样本被用来获取频域数据。其值必须是从 32 到 32768 范围内的 2 的非零幂，否则抛出异常 INDEX_SIZE_ERR.; 其默认值为 2048。
2. AnalyserNode.frequencyBinCount 的值固定为 AnalyserNode 接口中 fftSize 值的一半。该属性通常用于可视化的数据值的数量。
3. AnalyserNode接口的 getByteFrequencyData(uint8Array) 方法将当前**频率数据**复制到传入的 Uint8Array（无符号字节数组）中。如果Uint8Array数组的长度小于 AnalyserNode.frequencyBinCount，那么 Analyser 多出的元素会被删除。如果是大于，那么Uint8Array数组多余的元素会被忽略。
4. AnalyserNode 接口的 getByteTimeDomainData(uint8Array) 方法复制当前波形或**时域数据**到传递给它的Uint8Array (无符号字节数组) 中。如果该Uint8Array数组的元素少于 AnalyserNode.fftSize，多余的元素会被丢弃。如果是大于，那么Uint8Array数组多余的元素会被忽略。

**MediaElementAudioSourceNode 接口**代表着某个由 HTML `<audio>` 或 `<video>` 元素所组成的音频源。该接口作为 AudioNode 音源节点。MediaElementSourceNode 没有输入，且只有一个输出，其由 AudioContext.createMediaElementSource 方法创建。输出的频道数目与节点创建时引用音频 HTMLMediaElement 的频道数目一致，或当 HTMLMediaElement 无音频时，频道数目为 1。

### Console API

Console 对象提供了浏览器控制台调试的接口。在不同浏览器上个别方法可能存在些许差异。Console 对象可以从任何全局对象中访问到，如window.console和WorkerGlobalScope.console。实际的 console 接口被定义为全小写的形式，这是历史原因。注意，在 Firefox 浏览器中，如果页面中自己定义了 console 对象，那么它会覆盖掉浏览器内置的 console对象，在其他浏览器可能也是。

在生产环境中应该尽量避免使用console，因为有可能导致内存泄漏，可以使用terser将console在构建输出中自动去除。

可以在传递给 console 的方法的时候使用下面的字符以期进行参数的替换（ Chrome 不支持精确格式化），当要替换的参数类型和预期的打印类型不同时，参数会被转换成预期的打印类型。
1. %o or %O：打印 JavaScript 对象。在审阅器点击对象名字可展开更多对象的信息。
2. %d or %i：打印整数。支持数字格式化。例如，console.log("Foo %.2d", 1.1) 会输出有先导 0 的两位有效数字：Foo 01。
3. %s：打印字符串。
4. %f：打印浮点数。支持格式化，比如 console.log("Foo %.2f", 1.1) 会输出两位小数：Foo 1.10
5. %c：为打印内容定义样式，%c指令前的文本不会受到影响，但指令后的文本将会使用参数中声明的 CSS 样式。%c 语法可用的属性包括：background 与其全写版本，border 与其全写版本，border-radius，box-decoration-break，box-shadow，clear 和 float，color，cursor，display，font 与其全写版本，line-height，margin，outline与其全写版本， padding text-transform 这类 text-* 属性，white-space，word-spacing和 word-break，writing-mode。注意：控制台信息的默认行为与行内元素相似。为了应用 padding、margin 这类效果，你应当这样设置display: inline-block。

**Console 的方法**：
1. console.assert()：如果断言为 false，则将一个错误消息写入控制台。如果断言是 true，没有任何反应。此特性在 Web Worker 中可用。console.assert()方法在 Node.js 中的实现和浏览器中可用的console.assert()方法实现是不同的。在浏览器中当console.assert()方法接受到一个值为假断言的时候，会向控制台输出传入的内容，但是并不会中断代码的执行，而在 Node.js v10.0.0 之前，一个值为假的断言也将会导致一个AssertionError被抛出，使得代码执行被打断。v10.0.0 修复了此差异，所以现在console.assert()在 Node 和浏览器中执行行为相同。语法如下，assertion是一个布尔表达式。如果 assertion 为假，消息将会被输出到控制台之中：
    1. 语法1：console.assert(assertion, obj1 [, obj2, ..., objN]); obj1 ... objN被用来输出的 Javascript 对象列表，最后输出的字符串是各个对象依次拼接的结果。
    2. 语法2：console.assert(assertion, msg [, subst1, ..., substN]);msg是一个包含零个或多个子串的 Javascript 字符串。subst1 ... substN是各个消息作为字串的 Javascript 对象。这个参数可以让你能够控制输出的格式。
2. console.clear()：方法会清空控制台，但前提是该控制台允许清空。像浏览器运行的图形控制台就允许清空，而像 Node 运行的终端上显示的控制台则不支持它，调用该方法将不会产生任何效果（也不会报错）。方法既无参数也无返回值（即返回undefined）。
3. console.count()：输出 count() 被调用的次数。此函数接受一个可选参数 label。该特性是非标准的，请尽量不要在生产环境中使用它！ 此特性在 Web Worker 中可用。如果有 label，此函数输出为那个指定的 label 和 count() 被调用的次数。如果 label 被忽略，此函数输出 count() 在其所处位置上被调用的次数。
4. console.countReset()：重置计数器。此函数有一个可选参数 label。此特性在 Web Worker 中可用。如果提供了参数label，此函数会重置与 label 关联的计数。如果省略了参数label，此函数会重置default字段的计数器。若传入一个不存在的 label, countReset 返回下面的警告信息：Counter "counter-name" doesn’t exist。若 label 没有被传入 并且 count() 也没有被调用过，countReset 返回下面的警告信息：Counter "default" doesn’t exist.
5. console.debug()：方法将一条消息输出到 web 控制台，消息的日志级别为“debug”。只有在控制台配置为显示”debgu”输出时，才会向用户显示该消息。在大多数情况下，日志级别在控制台 UI 中进行配置。该日志级别可能对应于 Debug 或 Verbose 日志级别。此特性在 Web Worker 中可用。方法无返回值（即返回undefined）。语法如下：
    1. 语法1：debug(obj1, [/* …, */ objN])，obj1 … objN要输出的 JavaScript 对象列表。按传参的顺序把对象输出到控制台。
    2. 语法2：debug(msg, [subst1, /* …, */ substN])，msg包含零个或多个替换字符串的 JavaScript 字符串，这些替换字符串会按照连续的顺序用 subst1 到 substN 进行替换。subst1 … substN：JavaScript 对象，用来依次替换 msg 中的替代字符串。可以在替代字符串中指定对象的输出格式。
6. console.dir(object)：方法可以显示指定 JavaScript 对象object的属性列表，并以交互式的形式展现。输出结果呈现为分层列表，包含展开/折叠的三角形图标，可用于查看子对象的内容。此特性在 Web Worker 中可用。
7. console.dirxml(object)：7.显示一个明确的 XML/HTML 元素的包括所有后代元素的交互树。如果无法作为一个 element 被显示，那么会以 JavaScript 对象的形式作为替代。它的输出是一个继承的扩展的节点列表，可以让你看到子节点的内容。 该特性是非标准的，请尽量不要在生产环境中使用它！
8. console.error()：方法向 Web 控制台输出一条错误消息，方法参数和返回值同console.debug。console.exception() 是 console.error() 的别名；它们功能相同。此特性在 Web Worker 中可用。
9. console.log()：方法向 Web 控制台输出一条信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象，方法参数和返回值同console.debug。不要使用 console.log(obj)，而应该使用 console.log(JSON.parse(JSON.stringify(obj)))。此特性在 Web Worker 中可用。这样可以确保你所看到的 obj 的值是当前输出的值。否则，大多数浏览器会提供一个随着值的变化而不断更新的实时视图。这可能不是你想要的。此特性在 Web Worker 中可用。
10. console.info()向 web 控制台输出一个通知信息。仅在 Firefox，web 控制台的日志中的项目旁边会显示一个小的‘I‘图标。方法参数和返回值同console.debug。此特性在 Web Worker 中可用。
11. console.warn()：向 Web 控制台输出一条警告信息，方法参数和返回值同console.debug。此特性在 Web Worker 中可用。在火狐浏览器里，警告会有一个小感叹号图标在 Web 控制台信息前面。
12. console.trace()：方法向 Web 控制台输出一个到调用位置的堆栈跟踪。
13. Console.profile([profileName])：开始记录性能描述信息。可以选择提供一个参数profileName来命名描述信息，这将允许在有多个描述信息被记录时来选择只停止那个描述信息（被命名的那个）。要停止记录，请调用Console.profileEnd()。此特性在 Web Worker 中可用。该特性是非标准的，请尽量不要在生产环境中使用它！
14. console.profileEnd([profileName])：方法会停止记录之前已经由console.profile()开始记录的性能描述信息。可以选择提供一个参数profileName来命名需要记录的描述信息。这使得你在记录多个描述信息的时候可以停止记录特定的描述信息。如果 Console.profileEnd() 传了描述信息名字，并且它与正在记录的描述信息的名字相匹配，则此描述信息将会停止。如果 Console.profileEnd() 传了描述信息名字，并且它与正在记录的描述信息的名字不匹配，则不会进行更改。如果 Console.profileEnd() 没有传描述信息名字，最近启动记录的描述信息将会停止。此特性在 Web Worker 中可用。
15. Console.table(data[, columns])：方法将数据data以表格的形式显示。data 必须是一个数组或者是一个对象；还可以使用一个可选参数 columns。它会把数据 data 以表格的形式打印出来。数组中的每一个元素（或对象中可枚举的属性）将会以行的形式显示在表格中。
表格的第一列是 index。如果数据 data 是一个数组，那么这一列的单元格的值就是数组的索引。如果数据是一个对象，那么它们的值就是各对象的属性名称。注意（在 FireFox 中）console.table 被限制为只显示 1000 行。 此特性在 Web Worker 中可用。
16. console.group([label])：方法在 Web 控制台上创建一个新的分组，可选参数label是分组标签。随后输出到控制台上的内容都会被添加一个缩进，表示该内容属于当前分组，直到调用 console.groupEnd() 之后，当前分组结束。方法无返回值（即返回值为undefined）。此特性在 Web Worker 中可用。
17. console.groupEnd()：在 Web 控制台中退出一格缩进 (结分组)。 此特性在 Web Worker 中可用。
18. console.groupCollapsed()：方法在 Web 控制台上创建一个新的分组。与 console.group() 方法的不同点是，新建的分组默认是折叠的。用户必须点击一个按钮才能将折叠的内容打开。调用 console.groupEnd() 以回到父级分组。 此特性在 Web Worker 中可用。
19. console.time(timerName)：方法启动一个计时器来跟踪某一个操作的占用时长。每一个计时器必须拥有唯一的名字，页面中最多能同时运行 10,000 个计时器。当以此计时器名字为参数调用 console.timeEnd() 时，浏览器将以毫秒为单位，输出对应计时器所经过的时间。此特性在 Web Worker 中可用。
20. console.timeEnd(timerName)停止一个通过 console.time() 启动的计时器。该方法在使用时不会将输出的时间返回到 js，它只能用于控制台调试。请勿将该方法作为普通计时器或性能数据收集器的一部分。此特性在 Web Worker 中可用。 该特性是非标准的，请尽量不要在生产环境中使用它！
21. console.timeLog(timerName)：方法在控制台输出计时器的值，该计时器必须已经通过 console.time() 启动。如果没有传入 label 参数，则以 default: 作为引导返回数据。此特性在 Web Worker 中可用。如果计时器未启动， timeLog() 会返回一个警告：Timer "default" doesn't exist。如果传入的 label 索引没有与之对应的计时器，则返回如下警告：Timer "timer name" doesn't exist。
22. console.timeStamp([label])：方法向浏览器的 Performance 或者 Waterfall 工具添加一个标记。这样可以将代码中的一个点和其他在时间轴上已记录的事件相关联，例如布局事件和绘制事件等。可以选择用一个参数label来作为时间戳标签，然后标记旁边就会显示这个标签。该特性是非标准的，请尽量不要在生产环境中使用它！特性在 Web Worker 中可用。

###  EyeDropper API
EyeDropper代表一个系统级别的吸管工具，用户可以打开并使用它从屏幕上选择颜色。EyeDropper() 构造函数（无参）返回一个新的 EyeDropper 对象。

EyeDropper.prototype.open(options?) 方法启动吸管模式，返回一个Promise，一旦用户选择了一种颜色或关闭了吸管模式，该Promise就会敲定（settled）。可选参数对象options：
1. 属性signal：一个AbortSignal。当AbortSignal的abort()方法被调用时，吸管模式将被终止。

**返回的 Promise**，**成功**的结果值是一个包含表示所选颜色sRGBHex属性（值采用十六进制 sRGB 格式 (#aabbcc)）的对象，**拒绝**情况：
1. 当用户通过按 Escape 键关闭吸管模式时。
2. 当吸管模式被作为参数传递给 open() 的 AbortController 中止时。

### Web Animations API
Web 动画 API将浏览器动画引擎向开发者打开，并由 JavaScript 进行操作。通过 Web 动画 API，可以将交互式动画从样式表移动到 JavaScript，将表现与行为分开。

Element 接口的 animate(keyframes, options) 方法创建并返回一个新的Animation对象实例，将它应用于元素，然后运行动画。
1. keyframes：关键帧对象数组，或一个关键帧对象（其属性为可迭代值的数组）。
2. options：代表动画持续时间的整数（以毫秒为单位），或者一个包含一个或多个时间属性（KeyframeEffect() 的options 参数里的和下方列出的）的对象：
    1. id：可选，一个用来引用动画的字符串。在 animate() 里可作为唯一标识的属性。

### clipboard API

剪贴板Clipboard API提供了响应剪贴板命令（剪切、复制和粘贴）与异步读写系统剪贴板的能力。该API 被设计用来取代使用 document.execCommand() 的剪贴板访问方式。

系统剪贴板暴露于全局属性Navigator.clipboard之中。如果用户没有适时使用 Permissions API 授予 "clipboard-read" 或 "clipboard-write" 权限，调用 Clipboard 对象的方法不会成功。所有 Clipboard API 的方法都是异步的，返回一个 Promise 对象，在剪贴板访问完成后被resolve。如果剪贴板访问被拒绝，promise 也会被reject。
1. readText()：解析系统剪贴板的文本内容返回一个Promise。它以一个包含剪贴板文本内容的DOMString来resolve。如果剪贴板是空的，不包含文本，或者在代表剪贴板内容的DataTransfer对象中不包括文本表示，则DOMString是空字符串。
2. read()：和readText()区别在于可以读取返回任意的数据，如图片。
3. writeText(newClipText)：写入特定字符串到操作系统的剪切板。返回一个promise，如果剪贴板的内容被更新则resolve，如果没有没有写入剪贴板的权限则reject。
4. write(dataTransfer)：和writeText()区别在于可以写入任意的数据，如图片。

**ClipboardEvent 事件**：

**copy事件**：当用户通过浏览器 UI（例如，使用 Ctrl/⌘+C 键盘快捷方式或从菜单中选择“复制”）启动复制操作并响应允许的document.execCommand('copy')调用时触发。对于copy 事件，如果默认行为没有取消，就复制到选区（如果有选中内容）到剪切板；如果取消了默认行为，但是调用了setData()方法：就复制clipboardData的内容到到剪切板；如果取消了默认行为，而且没有调用setData()方法，就没有任何行为。注意，不能使用clipboardData.getData()在事件处理函数中获取剪切板数据。e.target是Element，即获得焦点的元素（如contentEditable内容能编辑或者可以选中的元素），或`<body>`。

**paste事件**：当用户在浏览器用户界面发起“粘贴”操作时，会触发 paste 事件。如果光标位于可编辑的上下文中（例如，在 `<textarea>` 或者 contenteditable 属性设置为 true 的元素），则默认操作是将剪贴板的内容插入光标所在位置的文档中。要覆盖默认行为（例如，插入一些不同的数据或转换剪贴板的内容），事件处理程序必须使用 event.preventDefault()，取消默认操作，然后手动插入想要的数据。

**cut 事件**：在将选中内容从文档中删除并将其添加到剪贴板后触发。如果用户尝试对不可编辑内容执行剪切操作，则cut事件仍会触发，但事件对象不包含任何数据。

### CSSOM（CSS Object Model）
CSS对象模型是一组允许用 JavaScript 操纵 CSS 的 API。它很像 DOM，但针对的是 CSS 而不是 HTML。它允许用户动态地读取和修改 CSS 样式。CSS 的值使用String来表示。

**CSSStyleSheet** 接口代表一个 CSS 样式表，并允许检查和编辑样式表中的规则列表。它从父类型 StyleSheet 继承属性和方法。一个 CSS 样式表包含了一组表示规则的 CSSRule 对象。每条 CSS 规则可以通过与之相关联的对象进行操作，这些规则被包含在 CSSRuleList 内，可以通过CSSStyleSheet.cssRules获取。

**CSSStyleSheet.insertRule(rule [, index])** 方法用来给当前样式表插入新的样式规则（CSS rule），return新插入的规则在当前样式表规则列表中的索引。参数传递存在以下限制：
1. 如果 index > CSSRuleList.length，该方法会中止并返回一个 IndexSizeError 错误；
2. 如果 rule 由于一些 CSS 约束而不能被插入到 index 0，该方法会中止并返回一个 HierarchyRequestError 错误；
3. 如果 rule 参数中包含超过一条样式规则，该方法会中止并返回一个 SyntaxError；
4. 如果尝试在一条普通规则后插入一条 @import 这种类型的规则，该方法会中止并返回一个 HierarchyRequestError 错误；
5. 如果 rule 是 @namespace 并且规则列表中有另外的 @import 和/或 @namespace 规则，该方法中止并返回一个 InvalidStateError 错误；

### Geolocation（地理位置）API

地理位置 API（Geolocation API）允许用户向 web 应用程序提供他们的位置。出于隐私考虑，报告地理位置前会先请求用户许可。此功能仅在安全上下文（HTTPS）中可用。Web 扩展若期望使用 Geolocation 对象，则必须将 "geolocation" 权限添加到其清单（manifest）中。在第一次请求地理位置访问时，用户的操作系统将提示用户提供相应的权限。

### Web Workers API

Web Worker在一个独立于 Web 应用程序主执行线程的后台线程中运行脚本。可以在独立线程中执行费时的处理任务，使主线程（通常是 UI 线程）的运行不会被阻塞/放慢。

### Web Storage API

Web Storage 继承自Window 对象，包括localStorage（默认永久存储）和 sessionStorage（在页面会话期间可用，包括页面刷新重新加载和页面恢复），对于每个不同的域使用不同的Storage对象独立运行和控制。最新chrome浏览器大小限制为 10M左右。被存储的键值对总是以 UTF-16 DOMString 的格式所存储，其使用两个字节来表示一个字符，不是字符串会自动转换成字符串形式（最好在设置之前手动转换成字符串）。

通过Window.localStorage 和 Window.sessionStorage使用，常用API：
1. localStorage.setItem(key,value)：接受一个键名和值作为参数，将会把键值对添加到存储中，如果键名存在，则更新其对应的值，或者直接对key进行设置 localStorage.[key] = value 或 localStorage[key] = value；
2. localStorage.getItem(key)：接受一个键名作为参数，返回键名对应的值，或直接对key进行访问localStorage.[key] 或 localStorage[key]。
3. localStorage.removeItem(key)：接受一个键名作为参数，并把该键名从存储中删除。
4. localStorage.clear()：清空存储中的所有键名。
5. localStorage.key(n) 接受一个数值 n 作为参数，并返回存储中的第 n 个键名；

当前页面使用的 storage （特指localStorage）被其他同域页面（新标签或iframe）修改时会触发 StorageEvent 事件（事件字符串为storage）：事件在同一个域下的不同页面之间触发，即在 A 页面注册了 storge 的监听处理，只有在跟 A 同域名下的 B 页面操作 storage 对象，A 页面才会被触发 storage 事件，而且默认B页面自己不触发事件。

隐私/无痕模式下，Safari中给Web Storage分配 0 字节的存储空间，即不能被写入数据，相对于不可用；chrome浏览器中与正常模式不同在于，关闭浏览器会被清除。

Storage 功能支持和可用检测，由于各浏览器提供了禁用 localStorage 的设置，因此不能简单的对属性localStorage和sessionStorage进行断言来判断是否可用（不包括分配的内存用完）：

![](/front-end/basics/javascript/149.png)

### Ajax

Ajax 是异步的 JavaScript 和 XML，就是使用XMLHTTPRequest对象与服务器通信。最大的优点是可以在**不重载页面的情况下与服务器通信并更新部分页面内容**。

![](/front-end/basics/javascript/150.png)

#### XMLHttpRequest

所有现代浏览器（IE7+、Firefox、Chrome、Safari 以及 Opera）均支持XMLHttpRequest对象（IE5 和 IE6 使用 ActiveXObject对象）。

**基本用法**：

```javascript
const xhr = new XMLHttpRequest();
```

**原型属性**：

XMLHttpRequest 继承了XMLHttpRequestEventTarget 和 EventTarget 的属性。
1. readyState，（只读）用于表示请求的五种状态，类型是 unsigned short（无符号短整数）:
    1. **0（UNSET）**：XMLHttpRequest对象已创建且未调用open()；
    2. **1（OPENED）**： open()方法被调用服务器连接已建立且未发送即未调用send()；
    3. **2（HEADERS_RECEIVED）**：send()被调用且头部已被服务器接收，状态已可访问；
    4. **3（LOADING）**：下载中，responseText或responseXML已经包含部分数据；
    5. **4（DONE）**：请求已完成且响应完成。
2. response，（只读）用于获取整个响应实体，响应体的类型由 responseType 来指定，类型是 Blob | ArrayBuffer | Document | JSON | String | null（请求未完成或失败）。
3. responseText，（只读）用于获取请求的响应文本，类型是 DOMString | null（请求未完成或失败）。
4. responseType，用于设置该值能够改变响应类型，类型是 XMLHttpRequestResponseType。
5. status，（只读）用于获取请求的**响应状态码，200（OK）和 404（Not Found）以及 0 （请求未完成或出错）**，类型是	unsigned short。
6. statusText，（只读）用于获取请求的**响应状态信息**，包含一个状态码和消息文本，类型是	DOMString。
7. timeout，用于表示**最大请求时间（毫秒）**，若超出该时间，请求会自动终止	类型是 unsigned long。
8. upload，（只读）用于在 upload 上添加一个事件监听来**跟踪上传过程**。继承自XMLHttpRequsetEventTarget，只有事件属性，也只能对其绑定事件来追踪它的进度。类型是 	XMLHttpRequestUpload。
9. withCredentials，用于指定跨域 Access-Control 请求是否应当带有授权信息，如Cookie 或授权首部字段，类型是 Boolean。

**请求发送前**

**open(method，url[, async][, user][, password])**：初始化一个请求，规定method请求类型、url请求地址、async异步或同步（默认是true - 异步，此时send方法会立即返回，而如果值为 false，则 send 方法直到接收到了服务器的返回数据才会返回）。url尾部的查询字符串中每个参数的**名称和值**都必须使用encodeURIComponent()进行编码，而且所有**名称-值对**都必须由和号（&）分隔。如果 method 不是有效的 HTTP 方法或 URL 地址不能被成功解析，将会抛出DOMException “SyntaxError” 异常，如果请求方法（不区分大小写）为 CONNECT、TRACE 或 TRACK 将会抛出 DOMException“SecurityError” 异常。

**setRequestHeader(name,value)**：向请求设置HTTP头。name头名称，value对应值；可设置响应的MIME类型（表示文档、文件或字节流的性质和格式的媒体类型）；可以调用多次。xhr不允许更改Referer 和 Host字段；调用设置后不能撤销，其他同 name 调用会向 header 中添加value，但不会覆盖它；

![](/front-end/basics/javascript/151.png)

必须在open 与 send 之间调用，否则会抛出DOMException “InvalidStateError” 异常。参数name和value必须对应于HTTP请求头，否则会抛出 DOMException “SynataxError” 异常。**所有浏览器基本默认会发送的头部字段**：
1. Accept ：浏览器能够处理的内容类型。
2. Accept-Charset ：浏览器能够显示的字符集。
3. Accept-Encoding ：浏览器能够处理的压缩编码。
4. Accept-Language ：浏览器当前设置的语言。
5. Connection ：浏览器与服务器之间连接的类型。
6. Cookie ：当前页面设置的任何Cookie。
7. Host ：发出请求的页面所在的域 。
8. Referer：发出请求的页面的URI。
9. User-Agent ：浏览器的用户代理字符串。

**overrideMimeType()**：用于重写XHR响应的MIME类型，强迫XHR对象将响应当作指定的形式来处理，不会改变Header。必须在send 之前调用，否则会抛出DOMException “InvalidStateError” 异常。

**发送请求**

**send(body)**：发送网络请求。body 可以是Document | ArrayBuffer | DOMString | FormData | URLSearchParams | USVString | null，所有的事件绑定必须在send之前进行。若没有调用open 或 send被调用会抛出DOMException “InvalidStateError” 异常。

注意：对于get请求，如果不想获得的是缓存结果，可给url加上唯一的id（比如实时可用时间戳）。

**请求发送后**

**abort()**：立刻终止已被发送的请求（readyState变为XMLHttpRequest.UNSENT（0），并且 status 属性置为 0），此时，应对该 xhr 实例解除引用（xhrInstance = null）。

**接受响应后**

**getResponseHeader()**：**获取响应http头中特定字段的值，如果响应头还没有被接收，或该响应头不存在，则返回 null**。使用该方法获取某些响应头时，浏览器会抛出异常，因为W3C 的 XHR 标准中做了限制，规定无论是同域还是跨域，客户端均无法获取 response 中的 Set-Cookie、Set-Cookie2 这 2 个字段，而且 W3C 的 CORS 标准对于跨域请求也做了限制，规定对于跨域请求，客户端允许获取的响应头首部字段只限于简单的响应首部字段，比如：

```
Expires
Cache-Control
Last-Modified
Pragma
Access-Control-Expose-Headers
Content-Language
Content-Type
```

**getAllResponseHeaders()**：获取响应http头中所有字段的值（Set-Cookie 和 Set-Cookie2 除外）。注意：使用该方法获取的响应头首部字段与在开发者工具 Network 面板中看到的响应头不一致。

**应用示例——获取最后需修改日期并处理**：

![](/front-end/basics/javascript/152.png)

**原型事件**：

**状态变更**

onreadystatechange，事件字符串readstatechange，当readyState属性发生改变时即触发 readystatechange 事件的时候被调用。只有它是XMLHttpRequest上定义的事件，其余事件均继承自XMLHttpRequestEventTarget。

**请求响应后**
1. **onloadstart**，对应事件字符串为 loadstart，接受到数据响应时触发。
2. **onload**，对应事件字符串为load，用于当请求完成时触发，此时 readyState 值为 XMLHttpRequest.DONE（4）。
3. **onloadend**，对应事件字符串为loadend，当请求结束时触发，无论请求成功 ( load) 还是失败 (abort 或 error)，该事件内无法知道是何种原因触发的结束。 
4. **onprogress**，对应事件字符串为pregress用于当请求接收到数据的时候被周期性触发。使用该事件可以获取传输进度信息。progress 事件在使用 file: 协议的情况下是无效的。

**异常处理**
1. **onabort**，事件字符串为 abort，当请求停止时触发。
2. **ontimeout**，事件字符串为timeout，当请求超时时触发。
3. **onerror**，事件字符串为 error，当请求出现异常时触发。

除了readystatechange中事件的回调函数中的事件对象是标准Event外，其余均为ProgressEvent（继承自Event），它是测量如 HTTP 请求（一个XMLHttpRequest，或者一个 `<img>`，`<audio>`，`<video>`，`<style>` 或 `<link>` 等底层资源的加载）等底层进程进度的事件。四个只读属性：
1. lengthComputable，boolean，表示底层流程将需要完成的总工作量和已经完成的工作量是否可以计算，即进度是否可以被测量。
2. loaded，是一个 unsigned long 类型数据，表示底层进程已经执行的工作总量。可以用这个属性和 ProgressEvent.total 计算工作完成比例。当使用 HTTP 下载资源，它只表示内容本身的部分，不包括首部和其它开销。
3. total，是一个 unsigned long类型数据，表示正在执行的底层进程的工作总量。当使用 HTTP 下载资源，它只表示内容本身的部分，不包括首部和其它开销。

![](/front-end/basics/javascript/153.png)

如果需要支持 Internet Explorer 6 和更老的浏览器：

![](/front-end/basics/javascript/154.png)

#### FormData

FormData对象以键值对 key/value 的构造用于表单数据的序列化，可以将数据通过 XMLHttpRequest.send 方法发送出去，如果xhr中编码类型字段为multipart/form-data，则会使用和表单一样的格式。

const data = new FormData(form?: HTMLFormElement)，会自动将form中的表单值也包含进去，包括文件内容也会被编码之后包含进去。
1. has(name)，返回一个布尔值表明 FormData 对象是否包含某些键。
2. get(name)，返回在 FormData 对象中与给定键关联的第一个值。
3. getAll(name)，返回一个包含 FormData 对象中与给定键关联的所有值的数组。
4. delete(name)，从 FormData 对象里面删除一个键值对。
5. entries()，返回一个包含所有键值对的iterator对象。不过，FormData也可以直接使用for...of... 进行迭代。
6. values()，返回一个包含所有值的iterator对象。
7. keys()，返回一个包含所有键的iterator对象。
8. append(name, value)，追加设置表单名称-值；set(name, value)，直接设置表单名称-值；**区别在于**若指定的键已经存在， set 会使用新值覆盖已有的值，而 append会把新值添加到该key的已有值集合的后面。

#### Comet（服务器推送）

Comet即服务器向页面推送数据。比如应用于**体育比赛的分数和股票报价等实时推送数据**。优点：**实时性好**，性能好。缺点： 长期占用连接，丧失了无状态高并发的特点。

实现方式：**长轮询**和**流**两种。

![](/front-end/basics/javascript/155.png)

**短轮询（定时轮询）**：**浏览器定时向服务器发送请求，看有没有更新的数据**。由于需要不断的建立 HTTP 连接，严重浪费了服务器端和客户端的资源。客户端数越多，对服务器压力越大，因此短轮询不适用于那些同时在线用户数量比较大，并且很注重性能的 Web 应用。

![](/front-end/basics/javascript/156.png)

**长轮询**：**浏览器发送请求到服务器，服务器一直处于连接状态，直到服务器有数据发送给浏览器，浏览器接收完数据后随即发送新请求连接**。明显减少了很多不必要的 http 请求次数，相比之下节约了资源，缺点在于，连接挂起也会导致服务器资源的浪费。客户端长时间收不到响应会导致超时，从而主动断开和服务器的连接（可以通过判断如果请求时因为超时而结束时，立即重新发起请求到服务器）。

![](/front-end/basics/javascript/157.png)

**长轮询与短轮询共同特点是浏览器都要在接收数据之前，先发起对服务器的请求连接（被动型服务器 的体现：服务器不会主动推送信息）**。**区别在于**：
1. 长轮询浏览器是接收完数据后才随即发起新请求，短轮询浏览器定时发起新请求。
2. 长轮询服务保持一个请求直到有数据响应，短轮询服务器对每个请求立即响应。
3. 若消息到达率未知，则长轮询提供更短的消息延迟。若消息到达率较高，则长轮询会发送更多的xhr请求。因此，若对消息延迟要求不高的话，则定时轮询能有效的合并一定时间内的消息而形成“消息聚合”，能有效的减少请求数量并提高移动设备的电池寿命。

**流**：浏览器仅向服务器发送一个请求（一个HTTP连接），而服务器保持连接打开，然后周期性地向浏览器发送数据。周期性的readyState变为3，客户端从上一次取出数据的末尾开始取出数据。

![](/front-end/basics/javascript/158.png)

#### SSE（服务器发送事件）

通过SSE创建到服务器的连接，服务器通过这个连接可以发送任意数量的数据。服务器响应的MIME类型必须是text/event-stream ，而且是浏览器中的JavaScript API能解析格式输出。SSE支持短轮询、长轮询和HTTP流，而且能在断开连接时自动确定何时重新连接。

const source = new EventSource(url)：参数url规定发送更新数据的同源url。默认情况下，即使**连接断开**（服务器可通过返回的数据附加id，在连接断开时，客户端会向服务器发送一个包含名为Last-Event-ID的请求，保证下一次请求发送的数据段），还会重新连接，强制断开使用instance.close()方法。其instance具有属性readyState（0：正连接到服务器，1：打开了连接，2：关闭了连接），包括三个事件：
1. open （属性为onopen）：在建立连接时触发。
2. message（属性为onmessage） ：在从服务器接收到新事件时触发。
3. error （属性为onerror）：在无法建立连接时触发。

服务器发回的数据以字符串形式保存在 event.data。

服务器可返回多个连续的以data: 开头的数据行，每个值之间以**一个换行符**分隔。**只有在包含 data: 的数据行后面有空行时，才会触发 message 事件**，因此在服务器上生成事件流时记得添加。

**选择SSE还是websocket?**
1. WebSocket协议不同于HTTP，**需要实现支持Web Socket协议的服务器**。SSE是通过常规HTTP通信，因此现有服务器就可以满足需求。
2. **双向通信（如聊天室）**，优先WebSockets。在不能选择WebSockets的情况下，组合XHR和SSE也是能实现双向通信的。

四种前端即时通讯技术比较：从兼容性考虑：短轮询 > 长轮询 > 长连接 SSE > WebSocket；

从性能方面考虑：WebSocket > 长连接 SSE > 长轮询 > 短轮询；

#### 实现Ajax

实现Ajax：

![](/front-end/basics/javascript/159.png)

实现promise版的Ajax：

![](/front-end/basics/javascript/160.png)

实现简易版的Promise版的Ajax：

![](/front-end/basics/javascript/161.png)
