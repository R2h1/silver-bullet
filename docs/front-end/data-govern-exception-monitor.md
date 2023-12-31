# 前端数据治理与异常监控

服务监控包括错误监控、性能监控和行为监控。

数据埋点是对服务监控中收集用户信息的技术实现，分为侵入式和非侵入式。

## 数据治理

前端数据治理的重要指标是准确性和数据，一个数据对象包括数据值和其他元数据。

## 数据上报方式

### Image

通过将采集的数据拼接在图片请求的后面，向服务端请求一个 1*1 px 大小的图片（gif）实现的，设置它的 src 属性就可以发送数据。这种方式简单且天然可跨域，又兼容所有浏览器，没有阻塞问题，是目前比较受欢迎的前端数据上报方式。但由于是 get 请求，对上报的数据量有一定的限制，一般为 2~8 kb。适合发送数据量较小的场景，比如采集用户在 Web 页面的页面浏览、元素点击、视区停留等行为事件。

### Ajax

通过 XMLHttpRequest 的 send 方法以post的方式发送 data 给服务端，可以发送大量的数据，默认发送方式是异步，不会阻塞页面，但会占用一定的客户端资源，且需要特殊处理跨域限制。XMLHttpRequest 的跨域请求默认不携带 cookie。要允许跨域携带cookies，首先浏览器设置中，没有关闭第三方 cookie 功能，而且进行以下配置：

```javascript
/** 客户端 */

/** 服务端 */
set('Access-Control-Allow-Credentials', true); // 跨域携带 cookie
// 不能设为星号，必须指定明确的且与请求网页一致的域名
set('Access-Control-Allow-Origin', getRequestHeader('origin')); // 允许跨域
```

**适合发送数据量较大的场景**，比如获取后端所有数据用于前端渲染。

### Beacon

使用 navigator.sendBeacon API，是指浏览器通过异步的 post 方式发送数据到服务端。具体使用方法如下：

```javascript
/**
 * @param url 数据将要被发送的网络地址
 * @param data 将要发送的 ArrayBufferView、Blob、DOMString 或者 FormData 类型的数据
 * @return {boolean} 用户代理是否成功把数据加入传输队列
 */
navigator.sendBeacon(url, data);
```

其特点很明显： 
1. 在浏览器空闲的时候（跳转、刷新、关闭页面时）异步发送数据，不影响页面诸如 JS、CSS Animation 等执行；
2. 页面在非加载状态下，也会异步发送数据，不阻塞页面刷新、跳转和卸载等操作；
3. 可以保证数据发送不易丢失，浏览器会对其进行调度以保证数据有效送达；
4. 能够被客户端优化发送，尤其在 Mobile 环境下，可以将 beacon 请求合并到其他请求上一起处理；
5. 不受跨域限制，浏览器兼容性较好，可以支持除 IE 之外的几乎所有浏览器；
6. 当数据是 65536 字符长度时，异步请求进入浏览器发送队列失败，代表数据大小是有限制，不一样的浏览器应该有所差异； 
7. 缺陷是只能判断出是否放入浏览器任务队列，不能判断是否发送成功。

适合需要进行精确统计的场景，比如点击支付按钮、视频播放时长、页面跳转或关闭等行为时，能最大程度保证数据成功率。

## 异常监控

异常监控目的是能快速定位到发生错误的代码位置、第一时间通知开发人员异常发生以及报错的堆栈信息、用户 O 与浏览器版本等。在上报的时候增加报错时间，用户浏览器信息，对错误类型区分，自定义错误类型统计，引入图表可视化展示，更加直观地追踪。同时对上报频率做限制。如类似 mouseover 事件中的报错应该考虑防抖般的处理。

### 异常类型与捕获

前端异常分为JS异常和网络异常（ResourceError：资源加载错误和 HttpError：Http 请求错误）。其中JS异常的特点是出现不会导致 JS 引擎崩溃，最多只会终止当前执行的任务。
1. SyntaxError：解析时发生语法错误，window.onerror捕获不到，一般 SyntaxError在构建阶段，甚至本地开发阶段就会被发现；
2. TypeError：值不是所期待的类型；
3. ReferenceError：引用未声明的变量；
4. RangeError：当一个值不在其所允许的范围或者集合中。

在Javascript中，通常有以下异常捕获机制：
1. try…catch 语句能捕捉到的异常，必须是线程执行已经进入 try...catch 但 try...catch 未执行完的时候抛出来的，优点是能够较好地进行异常捕获，不至于使得页面由于一处错误挂掉，缺点是显得过于臃肿，大多代码使用 try...catch 包裹，影响代码可读性。try...catch 无法捕获的情况：
    1. 异步任务抛出的异常（执行时 try catch 已经从执行完了，比如 setTimeout）；
    2. promise 中非同步代码的异常（async/await 可以被 try... catch 捕获）；
    3. 语法错误（代码运行前，在编译时就检查出来了的错误）。
2. window.onerror/window.addEventListener(‘error’, handler):
    1. 最大的好处就是同步任务、异步任务都可捕获，可以得到具体的异常信息、异常文件的 URL、异常的行号与列号及异常的堆栈信息，捕获异常后，统一上报至日志服务器，而且可以全局监听。
    1. 缺点是**无法捕获资源加载错误**，同时，跨域脚本无法准确捕获异常，跨域之后 window.onerror 捕获不到正确的异常信息，而是统一返回一个 Script error，可通过在 script 脚本上使用 crossorigin 属性来规避这个问题，或者使用 try ... catch ... 进行捕获。由于当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个 Event 接口的error 事件，使用 window.addEventListener(‘error’, handler)，图片、script、css 加载错误，都能被捕获。和 window.onerror 区别是没有 onerror 打印信息丰富，但可以捕获网络资源加载错误。
3. Promise 内部异常，为防止遗漏处理，最好是添加一个 Promise 全局异常捕获事件 window.addEventListener('unhandledrejection')。
4. 崩溃和卡顿，利用 window 的 load 和 beforeLoad,以及 serviceWorker 开启一个线程进行监控。
5. 请求错误，异步请求的底层原理都是调用的 XMLHttpRequest API 或者 Fetch API，通过统一处理 ajax 和 fetch 方法，手动上报。
6. Vue 错误，使用 Vue.config.errorHandler（Vue2）/app.config.errorHandler（Vue3）捕获错误信息和 Vue 实例。
7. React 错误，通过 componentDidCatch，声明一个错误边界 ErrorBoundary 的组件。

### 行为收集

通过搜集用户的操作，可以明显发现错误为什么产生。 用户的操作分类如下：
1. UI 行为： 点击、滚动、聚焦/失焦、长按；
2. 浏览器行为：请求、前进/后退、跳转、新开页面、关闭；
3. 控制台行为：log、warn、error；

如何搜集？
1. 点击行为：使用 addEventListener 监听全局上的 click 事件，将事件和 DOM 元素名字收集。与错误信息一起上报。
2. 发送请求：监听 XMLHttpRequest 的 onreadystatechange 回调函数。
3. 页面跳转：监听 window.onpopstate，页面进行跳转时会触发。
4. 控制台行为：重写 console 对象的 info 等方法。