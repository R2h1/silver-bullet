import{_ as o,o as t,c as r,R as e}from"./chunks/framework.buEibnTs.js";const n="/silver-bullet/assets/1.9EQrFNsT.png",a="/silver-bullet/assets/2.U27wO895.png",s="/silver-bullet/assets/3.XSRZXXXH.png",f=JSON.parse('{"title":"浏览器","description":"","frontmatter":{},"headers":[],"relativePath":"front-end/browser.md","filePath":"front-end/browser.md","lastUpdated":1711372818000}'),l={name:"front-end/browser.md"},i=e('<h1 id="浏览器" tabindex="-1">浏览器 <a class="header-anchor" href="#浏览器" aria-label="Permalink to &quot;浏览器&quot;">​</a></h1><h2 id="架构" tabindex="-1">架构 <a class="header-anchor" href="#架构" aria-label="Permalink to &quot;架构&quot;">​</a></h2><p>浏览器是多进程多线程的应用程序，多进程可以避免相互影响和减少连环崩溃的几率：</p><ol><li><strong>浏览器（主）进程</strong>：主要负责界⾯显示、⽤户交互、⼦进程管理、存储等功能。内部会启动多个线程分别处理不同的任务。</li><li><strong>⽹络进程</strong>：负责加载⽹络资源。⽹络进程内部会启动多个线程来处理不同的⽹络任务。之前是作为一个模块运行在浏览器进程内。</li><li><strong>渲染进程</strong>（多个）：渲染进程启动后，会开启⼀个渲染主线程，主线程负责执⾏ HTML、CSS、JS 代码。<strong>默认情况下，chrome 浏览器会为每个标签页开启⼀个新的渲染进程，以保证不同的标签⻚之间不相互影响（参见 <a href="https://chromium.googlesource.com/chromium/src/+/main/docs/process_model_and_site_isolation.md#Modes-and-Availability" target="_blank" rel="noreferrer">chrome 官方文档</a>）</strong>。处于安全考虑，渲染进程都是运行在沙箱模式下。 <ol><li><strong>新增渲染进程</strong>： <ol><li>新增标签页，无论同源与否；</li><li>当前标签页内打开非同源页面；</li></ol></li><li><strong>复用渲染进程</strong>：当前标签页内打开同源页面；</li></ol></li><li><strong>GPU 进程</strong>：进行页面的绘制。</li><li><strong>插件进程（多个）</strong>：负责插件的运行，因插件容易崩溃，需要单独的插件进行来隔离，避免插件运行崩溃对浏览器和页面造成影响。</li></ol><h2 id="内核" tabindex="-1">内核 <a class="header-anchor" href="#内核" aria-label="Permalink to &quot;内核&quot;">​</a></h2><p>浏览器由外壳（shell）和内核组成，起初浏览器内核分为<strong>渲染引擎</strong>(layout engineer或Rendering Engine)和 <strong>JS 引擎</strong>，随着 JS 引擎独立化，内核就倾向于只指渲染引擎。</p><p><strong>渲染引擎</strong>负责网页的效果<strong>显示</strong>和内容<strong>加载</strong>，<strong>JS 引擎</strong>负责解析和执行 JavaScript 完成<strong>动态</strong>效果和<strong>交互</strong>。</p><p>常见的浏览器内核和五大浏览器：<strong>trident</strong>（<strong>IE</strong>）、<strong>gecko</strong>（<strong>Firefox</strong>，扩展性和功能强大，内存消耗大）、 <strong>presto</strong>（<strong>opera</strong>，快，部分不兼容性，后来转向研发使用blink）、<strong>webkit</strong>（<strong>Safari</strong>，较快，代码容错性较低）、<strong>blink</strong>（<strong>Chrome</strong>，webkit 精简强化版）、<strong>EdgeHTML</strong>（<strong>edge</strong>，现在也转向使用 <strong>blink</strong>）。</p><p>常见 JS 引擎有 <strong>V8</strong>（Chrome）、<strong>SpiderMonkey</strong>（Firefox）、<strong>JSCore</strong>（Safari）。</p><h2 id="渲染原理" tabindex="-1">渲染原理 <a class="header-anchor" href="#渲染原理" aria-label="Permalink to &quot;渲染原理&quot;">​</a></h2><p>准备好渲染进程后，<strong>浏览器进程</strong>接收到<strong>网络进程</strong>的响应头数据后，向<strong>渲染进程</strong>发起“提交文档”的消息，进入<strong>提交文档</strong>的阶段：</p><ol><li>建立传输管道：<strong>渲染进程</strong>接收到<strong>浏览器进程</strong>发出的 “提交文档” 消息后，会和<strong>网络进程</strong>建立传输数据的 “管道”；</li><li>确认提交：等数据传输完成后，<strong>渲染进程</strong>会返回 “确认提交” 的消息给<strong>浏览器进程</strong>；</li><li>更新浏览器界面状态：<strong>浏览器进程</strong>收到确认提交消息后，更新界面状态，包括安全状态、地址栏的URL、前进后台的历史状态以及<strong>进入渲染页面阶段</strong>——即产生一个渲染任务，并将其传递给渲染主线程的消息队列。在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，<strong>开启渲染流程</strong>。</li></ol><p>整个渲染流程分为多个阶段，分别是：<strong>HTML 解析、样式计算、布局、分层、生成绘制指令、分块、光栅化、显示</strong>。每个阶段都有明确的输入输出，上一个阶段的输出会成为下一个阶段的输入。</p><h4 id="_1-解析-html" tabindex="-1">1. 解析 HTML <a class="header-anchor" href="#_1-解析-html" aria-label="Permalink to &quot;1. 解析 HTML&quot;">​</a></h4><p>解析过程中遇到 CSS 解析 CSS，遇到 JS 执行 JS。为了提高解析效率，浏览器在开始解析前，会启动一个预解析的线程，率先下载 HTML 中的外部 CSS 文件和外部的 JS 文件。</p><p>如果渲染主线程解析到 <code>&lt;link&gt;</code> 位置，此时外部的 CSS 文件还没有下载解析好，主线程不会等待，继续解析后续的 HTML。这是<strong>因为下载和解析 CSS 的工作是在预解析线程中进行的。这就是 CSS 不会阻塞 HTML 解析的根本原因</strong>。同时，CSS 文件的加载会阻塞后面的脚本 JS 的执行，因为脚本 JS 可能想要获取元素的坐标和其他与样式相关的属性。CSS 的加载会阻塞 DOM 树的渲染。</p><p>如果主线程解析到 <code>&lt;script&gt;</code> 位置，会停止解析 HTML，转而等待 JS 文件下载好，并将全局代码解析执行完成后，才能继续解析 HTML。这是<strong>因为 JS 代码的执行过程可能会修改当前的 DOM 树，所以 DOM 树的生成必须暂停。这就是 JS 会阻塞 HTML 解析的根本原因</strong>。JS 的执行会阻塞 DOM 树的渲染。 第一步完成后，会得到 DOM 树和 CSSOM 树，浏览器的默认样式、内部样式（<code>&lt;style&gt;</code>）、外部样式（<code>&lt;link&gt;</code>）、行内样式均会包含在 CSSOM 树中。</p><h4 id="_2-样式计算" tabindex="-1">2. 样式计算 <a class="header-anchor" href="#_2-样式计算" aria-label="Permalink to &quot;2. 样式计算&quot;">​</a></h4><p>主线程会遍历得到的 DOM 树，依次为树中的每个节点计算出它最终的样式，称之为 Computed Style。在这一过程中，很多预设值会变成绝对值，比如 <code>red</code> 会变成 <code>rgb(255,0,0)</code>；相对单位会变成绝对单位，比如 <code>em</code> 会变成 <code>px</code> 这一步完成后，会得到一棵带有样式的 DOM 树。</p><h4 id="_3-布局" tabindex="-1">3. 布局 <a class="header-anchor" href="#_3-布局" aria-label="Permalink to &quot;3. 布局&quot;">​</a></h4><p>布局阶段会依次遍历 DOM 树的每一个节点，计算每个节点的几何信息。例如节点的宽高、相对包含块的位置。大部分时候，DOM 树和布局树并非一一对应（而且布局树里的对象是DOM对象不是同一个对象）。比如 <code>display:none</code> 的节点没有几何信息，因此不会生成到布局树；又比如使用了伪元素选择器，虽然 DOM 树中不存在这些伪元素节点，但它们拥有几何信息，所以会生成到<strong>布局树（或渲染树）<strong>中。还有匿名行盒、匿名块盒等等都会导致 DOM 树和布局树无法一一对应。布局完成后会得到</strong>布局树（或渲染树）</strong>。</p><h4 id="_4-分层" tabindex="-1">4. 分层 <a class="header-anchor" href="#_4-分层" aria-label="Permalink to &quot;4. 分层&quot;">​</a></h4><p>主线程会使用一套复杂的策略对整个布局树中进行分层。分层的好处在于，将来某一个层改变后，仅会对该层进行后续处理，从而提升效率。<code>&lt;video&gt;</code>、<code>&lt;canvas&gt;</code>、滚动条、堆叠上下文、transform、opacity 等样式都会或多或少的影响分层结果，也可以通过 <code>will-change</code> 属性更大程度的影响分层结果。</p><h4 id="_5-生成绘制指令" tabindex="-1">5. 生成绘制指令 <a class="header-anchor" href="#_5-生成绘制指令" aria-label="Permalink to &quot;5. 生成绘制指令&quot;">​</a></h4><p>主线程会为每个层单独产生绘制指令集，用于描述这一层的内容该如何画出来。完成绘制后，主线程将每个图层的绘制信息提交给渲染进程的合成线程，剩余工作将由合成线程完成。</p><h4 id="_6-合成" tabindex="-1">6. 合成 <a class="header-anchor" href="#_6-合成" aria-label="Permalink to &quot;6. 合成&quot;">​</a></h4><p>合成线程首先对每个图层进行分块，将其划分为更多的小区域。它会从线程池中拿取多个线程来完成分块工作。<strong>分块完成后，进入光栅化阶段</strong>。</p><h4 id="_7-光栅化" tabindex="-1">7. 光栅化 <a class="header-anchor" href="#_7-光栅化" aria-label="Permalink to &quot;7. 光栅化&quot;">​</a></h4><p>合成线程会将块信息交给 GPU 进程，以极高的速度完成光栅化。GPU 进程会开启多个线程来完成光栅化，并且优先处理靠近视口区域的块。光栅化的结果，就是一块一块的位图。</p><h4 id="_8-显示-drawqua" tabindex="-1">8. 显示（DrawQua） <a class="header-anchor" href="#_8-显示-drawqua" aria-label="Permalink to &quot;8. 显示（DrawQua）&quot;">​</a></h4><p>合成线程拿到每个层、每个块的位图后，生成一个个<code>「指引（Quad）」</code>信息。指引会标识出每个位图应该画到屏幕的哪个位置，以及会考虑到旋转、缩放等变形。<strong>变形发生在合成线程，与渲染主线程无关，这就是 <code>transform</code> 效率高的本质原因</strong>。合成线程会把 Quad 提交给 GPU 进程，由GPU进程产生系统调用，提交给 GPU 硬件，完成最终的屏幕成像。</p><h2 id="指纹" tabindex="-1">指纹 <a class="header-anchor" href="#指纹" aria-label="Permalink to &quot;指纹&quot;">​</a></h2><p>浏览器指纹可以是 UA，失去，地理位置或者使用的语言等，网站可以通过浏览器指纹获取到对应的使用者用户信息，能识别用户和记录用户的操作，进行个性化推荐。<strong>现有的浏览器指纹技术，由于目前跨浏览器识别指纹的问题尚未解决，可认为发展到处于 2.5 代</strong>：</p><ol><li><strong>第一代是状态化的</strong>，主要集中在用户的 cookie 和 evercookie 上，需要用户登录才可以得到有效的信息。</li><li><strong>第二代才有了浏览器指纹的概念</strong>，通过不断增加浏览器的特征值从而让用户更具有区分度，例如 UA、浏览器插件信息等</li><li><strong>第三代是已经将目光放在人身上了</strong>，通过收集用户的行为、习惯来为用户建立特征值甚至模型，可以实现真正的追踪技术。但是目前实现比较复杂，依然在探索中。</li></ol><p><strong>浏览器指纹也分为基本指纹和高级指纹</strong>，由许多浏览器的特征信息综合起来的，不同特征值的信息熵（entropy，是接收的每条消息中包含的信息的平均量，信息熵越高，则能传输越多的信息，信息熵越低，则意味着传输的信息越少）有异。可以通过 <a href="https://browserleaks.com/" target="_blank" rel="noreferrer">Browserleaks</a> 来检测浏览器指纹情况。FingerprintJS 是一个浏览器指纹识别库，它查询浏览器属性并从中计算哈希访问者标识符。</p><p><strong>基本指纹</strong>就是容易被发现和修改的部分，比如：</p><ol><li>每个浏览器的 UA；</li><li>浏览器发送的 HTTP ACCEPT 标头；</li><li>浏览器中安装的浏览器扩展/插件，例如 Quicktime，Flash，Java 或 Acrobat，以及这些插件的版本；</li><li>计算机上安装的字体；</li><li>浏览器是否执行 JavaScript 脚本；</li><li>浏览器是否能种下各种 cookie 和 “super cookies”；</li><li>是否浏览器设置为“Do Not Track”；</li><li>系统平台（例如 Win32、Linux x86）；</li><li>系统语言（例如 cn、en-US）；</li><li>浏览器是否支持触摸屏；</li><li>http 的 header。</li></ol><p>经过运算，得到浏览器指纹具体的信息熵以及浏览器的 uuid，由于基本指纹的重复率较高，只能作为辅助识别，所以人们需要更精确的高级指纹来判断唯一性。甚至生成一个独一无二的跨浏览器身份。</p><p><strong>高级指纹</strong>，比如像时区、屏幕分辨率和色深、Canvas、webGL 的信息熵在跨浏览器指纹上的权重是比较大的：</p><ol><li>Canvas 指纹：Canvas 是 HTML5 中的动态绘图标签，也可以用它生成图片或者处理图片。即便使用 Canvas 绘制相同的元素，但是由于系统的差别，字体渲染引擎不同，对抗锯齿、次像素渲染等算法也不同，Canvas 将同样的文字转成图片，得到的结果也是不同的。通过在网站上执行 Canvas 渲染代码，在画布上渲染一些文字，再用 <code>toDataURL</code> 转换出来，如此针对不同浏览器，Canvas 结果不尽相同。</li><li>WebGL 指纹：WebGL（Web图形库）是一个 JavaScript API，可在任何兼容的 Web 浏览器中渲染高性能的交互式 3D 和 2D 图形，而无需使用插件。WebGL 通过引入一个与 OpenGL ES 2.0 非常一致的 API 来做到这一点，该 API 可以在 HTML5 元素中使用。这种一致性使 API 可以利用用户设备提供的硬件图形加速。网站可以利用 WebGL 来识别设备指纹，一般可以用两种方式来做到指纹生产： <ol><li>WebGL 报告——完整的 WebGL 浏览器报告表是可获取、可被检测的。在一些情况下，它会被转换成为哈希值以便更快地进行分析。</li><li>WebGL 图像 ——渲染和转换为哈希值的隐藏 3D 图像。由于最终结果取决于进行计算的硬件设备，因此此方法会为设备及其驱动程序的不同组合生成唯一值。这种方式为不同的设备组合和驱动程序生成了唯一值。</li></ol></li></ol><p><strong>产生 WebGL 指纹原理</strong>是首先需要用着色器（shaders）绘制一个梯度对象，并将这个图片转换为 Base64 字符串。然后枚举 WebGL 所有的拓展和功能，并将他们添加到 Base64 字符串上，从而产生一个巨大的字符串，这个字符串在每台设备上可能是非常独特的。比如 fingerprintjs 库的 WebGL 指纹生产。</p><p><strong>浏览器指纹可能涉及到隐私泄露</strong>，如果不想被网站获取，是需要一些方法来阻止网站的。通过浏览器的扩展插件（Canvas Blocker、WebGL Fingerprint Defender、Fingerprint Spoofing 等），在网页加载前执行一段 JS 代码，更改、重写 JS 的各个函数来阻止网站获取各种信息，或返回一个假的数据，以此来保护我们的隐私信息：</p><ol><li>混淆时区，就是更改 <code>Date.prototype.getTimezoneOffset</code> 的返回值。</li><li>混淆分辨率则是更改 <code>documentElement.clientHeight</code>、<code>documentElement.clientWidth</code>。</li><li>混淆 WebGL 则要更改 <code>WebGLbufferData</code> <code>getParameter</code> 方法等等。</li><li>混淆 Canvas 指纹则需要更改 <code>toDataURL</code> 方法，比如 先使用 <code>toDataURL()</code> 将整个 canvas 的内容导出，通过 getImageData() 复制画布上指定矩形的像素数据并修改然后通过 <code>putImageData()</code> 将图像数据放回，然后再使用 <code>toDataURL()</code> 导出的图片，完成混淆。</li></ol><h2 id="重绘、回流、合成" tabindex="-1">重绘、回流、合成 <a class="header-anchor" href="#重绘、回流、合成" aria-label="Permalink to &quot;重绘、回流、合成&quot;">​</a></h2><p><strong>回流即重排（reflow）</strong>，当渲染树中的一部分或者全部因为元素的尺寸、布局、隐藏等改变而需要重新构建的时候，这时候就会发生回流。 具体操作包括：</p><ol><li>DOM节点的尺寸，边距，填充内容，宽高改变；</li><li>DOM节点display显示与否；</li><li>DOM 节点的增删，位置改变；</li><li>浏览器窗口尺寸变化（resize）；</li><li>读写 offset族、scroll族和client族和width，height属性时（浏览器为了获取这些值，需要进行回流操作）；</li><li>调用 window.getComputedStyle（该方法返回指定元素的对象，通过对象的getPropertyValue方法获取指定css属性的最终计算值）和window.currentStyle 方法；</li><li>页面第一次渲染。</li></ol><p>因此，对DOM的操作应该<strong>减少回流次数</strong>和<strong>降低回流的规模即节点数</strong>。</p><p>reflow 过程图：</p><p><img src="'+n+'" alt=""></p><p><strong>reflow 的本质</strong>就是重新计算布局树。当进行了会影响布局树的操作后，需要重新计算布局树，会引发布局。相当于重新进行DOM的解析和合成，开销相当大。为了避免连续的多次操作导致布局树反复计算，浏览器默认会合并这些操作，当 JS 代码全部完成后再进行统一计算（但对于 window.getComputedStyle精确计算会强行刷新队列，无法优化），所以，改动属性造成的 reflow 是异步完成的。然而，如果JS 获取属性则浏览器会立即同步 reflow，否则当 JS 获取布局属性时，就可能造成无法获取到最新的布局信息。</p><p><strong>重绘（repaint）是当修改导致了非几何属性的样式变化时触发，根据新的渲染树重新绘制改变的部分的过程</strong>。重绘过程（<strong>只计算样式和绘制列表</strong>）：</p><p><img src="'+a+'" alt=""></p><p>repaint 的本质就是重新根据分层信息计算了绘制指令。当改动了可见样式后，就需要重新计算，会引发 repaint。由于元素的布局信息也属于可见样式，所以回流一定会引起重绘。重绘不一定回流。</p><p><strong>合成即在DOM的修改是 CSS3 的 transform、opacity、filter 属性时触发</strong>。合成过程中，调用线程池完成分块，然后使用 <strong>GPU（擅长处理位图数据）<strong>开启多个线程快速将块信息生成位图（光栅化），由于使用的是非主线程的</strong>合成线程</strong>，即使主线程卡住，也可以流畅的展示。</p><p><img src="'+s+'" alt=""></p><p>因此，可以<strong>利用重绘、回流、合成原理改进渲染过程</strong>：</p><ol><li>避免频繁使用 style，而是采用修改或添加class的方式；而对于确实需要动态修改多个style可使用element.style.cssText</li><li>使用createDocumentFragment文档碎片进行批量的 DOM 操作。</li><li>先display:none（不存在渲染树内），中间进行多个不可避免的回流操作，再display:block。</li><li>读写 offset族、scroll族和client族和width，height属性时尽量做变量缓存</li><li>涉及动画操作时，尽量绝对定位脱离文档流，来降低对父级元素回流影响</li><li>对于 resize、scroll 等进行防抖/节流处理（浏览器默认也会进行）。</li><li>添加 will-change: transform ，让渲染引擎为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。当然这个变化不限于 transform, 任何可以实现合成效果的 CSS 属性都能用will-change来声明。</li></ol>',57),g=[i];function c(d,p,h,S,m,b){return t(),r("div",null,g)}const _=o(l,[["render",c]]);export{f as __pageData,_ as default};
