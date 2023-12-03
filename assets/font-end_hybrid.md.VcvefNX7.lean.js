import{_ as o,D as s,o as d,c as n,I as l,w as a,a as i,k as e,R as r}from"./chunks/framework.buEibnTs.js";const b="/silver-bullet/assets/hybrid-1.VDQtbLln.png",p="/silver-bullet/assets/hybrid-2.l-LYDZT2.png",c="/silver-bullet/assets/hybrid-3.ZXWxhO3I.png",_="/silver-bullet/assets/hybrid-4.7scIEYmX.png",u="/silver-bullet/assets/hybrid-5.VlXkPuhu.png",h="/silver-bullet/assets/hybrid-6.0JvFKU5t.png",g="/silver-bullet/assets/hybrid-7.OPS9Ef3s.png",v="/silver-bullet/assets/hybrid-8.7DdVMHSb.png",w="/silver-bullet/assets/hybrid-9.wyagMNTk.png",S="/silver-bullet/assets/hybrid-12.aiO4zNBb.png",m="/silver-bullet/assets/hybrid-13.CjHME3tG.png",W="/silver-bullet/assets/hybrid-14.5ve_qB4F.png",V="/silver-bullet/assets/hybrid-15.mRga9i4C.png",J="/silver-bullet/assets/hybrid-10.4ADIlbMM.png",f="/silver-bullet/assets/hybrid-11.Ms80cE2_.png",z=JSON.parse('{"title":"跨平台（混合开发）","description":"","frontmatter":{},"headers":[],"relativePath":"font-end/hybrid.md","filePath":"font-end/hybrid.md","lastUpdated":1701577723000}'),N={name:"font-end/hybrid.md"},T=r("",24),R=e("p",null,[e("img",{src:c,alt:""})],-1),I=r("",9),A=e("p",null,"小程序的渲染层和逻辑层分别由两个线程管理，渲染层采用 WebView 进行页面渲染（iOS 使用 UIWebView/WKWebView，Android 使用 WebView），小程序的多页面也由多 WebView 接管。逻辑层从 WebView 分离，使用 JavaScript 引擎（iOS 使用 JavaScriptCore，Android 使用 V8）单独开启一个 Worker 线程去执行 JavaScript 代码。逻辑层和渲染层之间的通信经由 Native 层中转，网络 IO 也通过 Native 层进行转发：",-1),P=e("p",null,[e("img",{src:h,alt:""})],-1),C=e("p",null,"小程序采用的是多 WebView + 双线程模型。由多 WebView 构成的视图层为页面性能赋予更加接近原生的用户体验，单个 WebView 承载更加轻量的页面渲染任务（左侧为原始web渲染，右侧为小程序）：",-1),U=e("p",null,[e("img",{src:g,alt:""})],-1),B=e("p",null,"JavaScript 被单独抽离在 Worker 线程，限制了直接操作页面的能力（无法直接操作 DOM），也就被约束在微信小程序的规范下。",-1),D=e("p",null,"综上来看，Web 渲染的发展经历了从 h5 + JSBridge + WebView，到 h5 容器的抽象提升，再到小程序三个阶段。",-1),k=e("h2",{id:"原生渲染-react-native",tabindex:"-1"},[i("原生渲染(React Native) "),e("a",{class:"header-anchor",href:"#原生渲染-react-native","aria-label":'Permalink to "原生渲染(React Native)"'},"​")],-1),y=e("p",null,"原生渲染的基本思路是在 UI 层采用前端框架，然后通过 JavaScript 引擎解析 JS 代码，JS 代码通过 Bridge 层调用原生组件和能力，最终，UI 的渲染通过 JSBridge 由原生控件直接接管，从而获得性能和体验的提升。代表的框架是 React Native，其整体架构图如下：",-1),O=e("p",null,[e("img",{src:v,alt:""})],-1),E=e("p",null,"视图层的渲染通过 UIManager 调 createView/updateView 等方法，基于 Yoga 布局引擎创建对应的 shadowView；逻辑层中涉及原生能力调用的部分通过 RCTBridge 对象转发到相应的原生接口。 Native 接收到 Bridge 层的消息，进行视图的更新或是功能处理。",-1),q=e("p",null,[e("img",{src:w,alt:""})],-1),x=e("p",null,"整个 RN 的线程模型：",-1),F=e("ol",null,[e("li",null,"Main 线程（UI 线程）：应用的主线程，进行初始化和处理原生控件的绘制。初始化的内容包括加载 JSBundle、初始化 Native Modules 等原生能力模块、创建 JSCore/Hermes JavaScript 引擎。"),e("li",null,"JS 线程：React 构成的 JS 代码运行在此线程，解释执行 React 代码，并将生成的布局或逻辑信息序列化后经由 Bridge 发送给 Native。"),e("li",null,"Shadow 线程：主要用于构建 JS 与原生控件的布局镜像数据。"),e("li",null,"Native Modules 线程：提供原生能力，这里采用的是多线程模型，iOS 端通过 GCD 实现，Android 端通过 AsyncTask 实现。")],-1),M=r("",10),H=r("",10),L=r("",5);function j(G,K,Y,$,X,Q){const t=s("font");return d(),n("div",null,[T,l(t,{color:"red"},{default:a(()=>[i("Web 渲染本质上是依托原生应用的内嵌浏览器控件 WebView 去渲染 H5 页面，并在原生应用中定义可供 H5 页面访问原生部分能力的接口 JSBridge，从而实现 H5 和 Native 双向通信，也进一步扩展 H5 端侧能力。")]),_:1}),i("因此，H5 App 的渲染流水线和 Web 页面渲染相一致。从 WebView 初始化到 H5 页面最终渲染的过程如下："),R,l(t,{color:"red"},{default:a(()=>[i("因此，Web 渲染性能上也存在首屏渲染优化问题，而且，还多出一个WebView 初始化的问题（可以通过 APP 启动的时候初始化一个常驻的隐藏WebView来处理）。")]),_:1}),I,l(t,{color:"red"},{default:a(()=>[i("小程序是无需下载安装即可使用的轻应用。小程序也是基于 Web 渲染方案，即采用 WebView 作为渲染引擎、JSBridge 的封装和离线包机制等，其最大创新之处在于将渲染层和逻辑层进行了分离，提供一个干净纯粹的 JavaScript 运行时，多 WebView 的架构使得用户体验进一步逼近原生体验。")]),_:1}),A,P,C,U,B,e("p",null,[e("strong",null,[l(t,{color:"red"},{default:a(()=>[i("小程序的组件分为原生组件和非原生组件")]),_:1})]),l(t,{color:"red"},{default:a(()=>[i("，原生组件属于原生渲染的一部分，所以小程序算得上是 Web 渲染和原生渲染的融合")]),_:1}),i("。")]),D,k,y,O,e("ol",null,[e("li",null,[l(t,{color:"red"},{default:a(()=>[i("React 层：利用 React 框架进行 UI 的数据描述，开发者使用 Class Component 或 Functional Component 进行页面开发，框架内部将会把页面描述转化为 ReactElement 这一代表的虚拟 DOM 的数据结构，用于运行时的 Diff 对比和消息收发等。")]),_:1})]),e("li",null,[l(t,{color:"red"},{default:a(()=>[i("[JS Bundle 中间产物]：RN 通过 metro 打包功能直接将整个 RN 应用打包为一个 JSBundle，通过 Bridge 层在 RN 应用初始化时加载整个 JS 包进来。")]),_:1})]),e("li",null,[l(t,{color:"red"},{default:a(()=>[i("Bridge 层：Bridge 是连接 React 和 Native 的中间层，React 层的 UI 需要通过 Bridge 层的 UIManager 接口实现原生控件的创建和更新，通过 NativeModules 接口实现原生能力的调用。")]),_:1})]),e("li",null,[l(t,{color:"red"},{default:a(()=>[i("Native 层：在 Native 层中，Native Modules 实现了与上层交互的原生能力接口，Native UI 实现终端实际的控件展示，Yoga 跨平台布局引擎实现了基于 FlexBox 布局系统的 JS 和 Native 的镜像映射关系。")]),_:1})])]),E,q,x,F,l(t,{color:"red"},{default:a(()=>[i("原生渲染直接接管渲染层，弥补了 Web 渲染方法在性能和体验上的不足。但是，在原生渲染架构中，页面的更新和事件的响应存在 Native 层和 JS 层的通信的时间成本，同时数据的交互需要频繁进行序列化和反序列化的转换，导致在一些 UI 线程和 JS 线程存在持续频繁交互的场景（动画、滚动等），RN等原生渲染的表现差强人意。")]),_:1}),M,l(t,{color:"red"},{default:a(()=>[i("自建渲染引擎渲染通过自建渲染引擎方式，直接从底层渲染上实现 UI 的绘制，代表的框架是 Flutter，")]),_:1}),i("其架构设计如下:"),H,l(t,{color:"red"},{default:a(()=>[i("因此，以 Flutter 为代表的的自建渲染引擎的优势在于：")]),_:1}),e("ol",null,[e("li",null,[l(t,{color:"red"},{default:a(()=>[i("UI 控件是直接采用 Skia 这一跨平台渲染引擎进行绘制：顶层使用 Dart 的语法进行 UI 的配置信息描述，并通过 Diff 算法优化渲染流程，生成 Layer Tree 后，再调用 C++ 的代码将布局信息发送给 Flutter Engine，Flutter Engine 直接通过 Skia 将 UI 控件绘制上屏。这里与原生渲染方案最大的不同点在于，Native 应用仅作为宿主环境，UI 控件不需要转化为原生控件，直接采用渲染引擎进行绘制，从而保证了双端的一致性和良好的性能与体验。")]),_:1})]),e("li",null,[l(t,{color:"red"},{default:a(()=>[i("Dart 在 Release下采用 AOT 的 编译模式：Dart 代码在 Release 采用 AOT 的编译模式转化为二进制代码，从而在 Dart 运行时环境中执行效率更高，性能也更为卓越。对比 React Native 来说，由于打包的是 JSBundle，所以在运行时仍是基于 JavaScript 运行时进行解释执行 JS 代码，因而产生较大的性能瓶颈。")]),_:1})]),e("li",null,[l(t,{color:"red"},{default:a(()=>[i("UI 层与原生层的数据交换性能更高。")]),_:1})])]),L])}const ee=o(N,[["render",j]]);export{z as __pageData,ee as default};
