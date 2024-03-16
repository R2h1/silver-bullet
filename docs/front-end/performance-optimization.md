# 前端性能优化

优化的目的是展示更快、交互响应快、页面无卡顿情况。

![](../public/front-end/performance-optimization/1.png)

![](../public/front-end/performance-optimization/2.png)


## 性能指标

![](../public/front-end/performance-optimization/3.png)

## 分析方法

使用 ChromeDevTool 作为性能分析工具来观察页面性能情况。其中Network观察网络资源加载耗时及顺序，Performace观察页面渲染表现及JS执行情况，Lighthouse对网站进行整体评分，找出可优化项。

DOM的解析受JS加载和执行的影响，找到最长请求路径文件的耗时，尽量对JS进行压缩、拆分处理（HTTP2下），能减少 DOMContentLoaded 时间。图片、视频、iFrame等资源，会阻塞 onload 事件的触发，需要优化资源的加载时机，尽快触发onload。

页面LCP触发时间较晚，且出现多次布局偏移，则会影响用户体验，需要尽早渲染内容和减少布局偏移。页面 Long Tasks 较多，则需要对 JS进行合理拆分和加载，减少 Long Tasks 数量，特别是影响 DCL 和 onload 的 Task。

## 优化加载耗时

### JS 资源

**JS 资源**：根据**是否参与首屏渲染**将影响 DOM 解析的 JS 资源划分为：关键 JS（采用拆分处理进行优化）和非关键 JS（采用延迟异步加载进行优化）。

**使用 webpack-bundle-analyzer（如果是vite项目，推荐使用rollup-plugin-visualizer）进行打包分析关键 JS 文件数量和体积。优化近乎一半的关键  JS 文件体积。**

**首先配置正确的spliteChunks规则**，不能简单的依靠 miniChunks 规则（比如miniChunks等于3，则会将某个页面使用三次的也打进去），对于所有页面都会加载的公共文件vendor.js（第三方），根据业务具体的需求，使用cacheGroups的test方法提取不同页面和组件都有的共同依赖（包括utils/log/api）到vendor中。而剩下的公共依赖新增一个common.js，提高 miniChunks 的阈值比如20，保证打包到common.js的是大多数页面的公共依赖，提供缓存利用率。

![](../public/front-end/performance-optimization/4.png)

**然后是按需加载组件**，优化前存在require 来加载 svg 图片，会导致 webpack 将 require 文件夹内的内容一并打包，导致页面图标组件冗余，可以通过配置 babel 的依赖加载路径调整 Icon 的引入方式，通过 import { Fire，ToTop } from 'components/Icons' 进行按需引入。

**对业务组件进行代码分割（code splitting）**，考虑对不在首屏的页面组件进行拆分再延迟加载，减少业务代码 JS 大小和执行时长，使用React 官方提供的React.lazy实现。

还可以**用到 Tree Shaking（用于描述移除 JavaScript 上下文中的未引用代码(dead-code)的行为。它依赖于 ES2015 中的 import 和 export 语句，用来检测代码模块是否被导出、导入。）优化**，即对于引用到的包/模块/方法等，tree Shaking 检查时会进行删除。可以给引入的包/模块（不是用来做 ponyfill 或 shim 之类） 标记为 sideEffects: false ，只要它没有被引用到，整个模块/包都会被完整的移除，以及包和模块中没有被引用部分也会被删除，只保留用到的。

**非关键JS在弱网环境会成为影响 DOM 解析的因素**。对于监控上报（灯塔 sdk）等非关键JS资源，选择延迟加载它，或者在其他 JavaScript 之后立即加载，或者直到需要时才加载。

### 媒体资源（图片、视频）

首先是使用TinyPng对图片进行多次合理压缩，其次对于首屏没有展示的图片或视频等媒体资源借助lazy load库进行懒加载处理，而且需要注意懒加载不能阻塞业务的正常展示，应该做好超时处理、重试等兜底措施。

![](../public/front-end/performance-optimization/5.png)

其他优化包括将 iframe 的时机放在 onload 之后，并设置setTimeout进行异步加载。将原先的image get方式上报埋点数据采取beacon上报的方式。

## 优化页面渲染

**直出页面（SSR）优化**，通过日志打点、查看 Nginx Accesslog 日志、网关监控耗时，发现页面TTFB时间过长的根本原因是SSR 服务器程序和NGW 网关部署和反向代理网关 Nginx 集群不在同一区域导致的网络时延。解决方案是让 NGW网关、反向代理网关 Nginx 集群和SSR 服务器服务机房部署在同一区域，即执行对网关 NGW 进行扩容和分布式服务开启就近访问。相较优化前平均耗时140ms左右，优化后控制在40ms以内。

**页面首屏的关键CSS进行内联优化，CSS文件的加载不会阻塞页面解析，但会阻塞页面渲染**。如果 CSS 文件较大或弱网情况，会影响到页面渲染时间，影响用户体验。利用 ChromeDevTool 的 More Tools 里的 Coverage 工具，录制页面渲染时 CSS 的使用率，发现首屏的使用CSS 只不到20%，利用 webpack 插件 critters 实现（用于内联关键 CSS 并延迟加载其余部分），与加载其余完整 CSS 文件进行分离，避免首屏页面渲染被 CSS 阻塞。

**优化页面视觉稳定性（CLS）**，尽量使首屏页面内容相对固定，页面元素出现无突兀感，避免图标缺失、背景图缺失、字体大小改变或者出现非预期页面元素导致页面抖动，**解决方案如下**：
1. 确定直出页面元素出现位置，根据数据提前做好布局；
2. 首屏页面的小图可以通过base64处理，页面解析的时候就会立即展示；
3. 减少动态内容对页面布局的影响，使用脱离文档流的方式或定好宽高。

![](../public/front-end/performance-optimization/6.png)

## 骨架屏处理

骨架屏（Skeleton Screen）是指在页面数据加载完成前，先给用户展示出页面的大致结构（灰色占位图），不会造成网页长时间白屏或者闪烁，在拿到接口数据后渲染出实际页面内容然后替换掉，本质上是界面加载过程中的过渡效果。

### image 切换

**原理**：使用一张占位骨架图（svg / lottie / gif）来代替 loading 效果，当数据加载完成后对替换掉骨架图。

**优缺点**：优点是实现简单，开发成本较低。缺点是维护成本较高，对于迭代比较频繁的页面，增大UI设计的工作量。

**实现**：

![](../public/front-end/performance-optimization/7.png)

首先使用 preload 提高图片加载优先级，让骨架图更早的显示，其次需要尽量减少图片的体积以加快加载速度，最后由于浏览器对同一域名的请求有并发限制，骨架屏的图片尽量放在单独的域名上，最后获取数据后隐藏图图片，显示真实 DOM 元素。

![](../public/front-end/performance-optimization/8.png)

### 手动CSS + html

**原理**：用 css + html 实现一个骨架屏的元素，当数据加载完成后替换掉。代表是react-content-loader（是利用svg实现的）。

**优缺点**：优点是相对image切换实现灵活，更易维护，由于需要在开发时为每个元素添加背景，开发和维护成本仍然较高。

**实现**：通过 animation: loading 2s ease infinite;控制背景移动实现从左到右的进度效果或通过 animation: opacity 2s ease infinite;控制透明度实现渐隐渐现的动画效果；获取到数据后，去掉 skeleton 选择器。

![](../public/front-end/performance-optimization/9.png)

### 自动生成css + html骨架屏实现

**原理**：借助getBoundingClientRect()方法，获取到元素相对于可视窗口的位置以及宽高。通过简化所有元素，不考虑结构层级、不考虑样式，对所有元素统一用 div 去代替，而且在骨架中只需要渲染最后一个层级，以定位的方式设置每个元素其相对于视窗的位置，形成骨架屏。这样生成的节点是扁平的，体积比较小，同时避免额外的读取样式表，而且不需要通过抽离样式维持骨架屏的外观，使得骨架屏的节点更可控。该方法生成的骨架屏是由纯 DOM 颜色块拼成的。

**优缺点**：优点是自动化，降低重复编写骨架屏代码的成本，缺点是对于复杂的页面，可能受元素定位的影响较大，自动生成的时候存在不确定性。另外，只能是首次加载，对于加载完成后用户触发的动态数据不支持生成骨架屏。可以结合前面的手动CSS + html配合为动态数据生成。

**实现**：

![](../public/front-end/performance-optimization/10.png)

![](../public/front-end/performance-optimization/11.png)