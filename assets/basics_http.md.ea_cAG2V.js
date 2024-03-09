import{_ as r,D as a,o as l,c as i,k as t,I as s,w as T,R as o,a as e}from"./chunks/framework.buEibnTs.js";const g="/silver-bullet/assets/net-7.IaycXHLq.png",d="/silver-bullet/assets/net-8.52Ql9drh.png",p="/silver-bullet/assets/net-40.d_bBtvj5.png",h="/silver-bullet/assets/net-37.3smeMEoP.png",c="/silver-bullet/assets/net-38.Tm3qtmhH.png",P="/silver-bullet/assets/net-39.ZAwm1g_c.png",U=JSON.parse('{"title":"HTTP","description":"","frontmatter":{},"headers":[],"relativePath":"basics/http.md","filePath":"basics/http.md","lastUpdated":1709993190000}'),b={name:"basics/http.md"},S=o('<h1 id="http" tabindex="-1">HTTP <a class="header-anchor" href="#http" aria-label="Permalink to &quot;HTTP&quot;">​</a></h1><p>超文本传输协议（HTTP）是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的客户端—服务端模型，客户端通过 TCP 或者是 TLS 打开一个连接以发出请求（request），然后等待直到收到服务器端响应（response）。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。</p><p><img src="'+g+'" alt=""></p><p><strong>在客户端与服务端之间，还有许多的被称为代理的实体，履行不同的作用</strong>：</p><ol><li>缓存（可以是公开的也可以是私有的，如浏览器的缓存）</li><li>过滤（如反病毒扫描、家长控制...）</li><li>负载均衡（让多个服务器服务不同的请求）</li><li>认证（控制对不同资源的访问）</li><li>日志（使得代理可以存储历史信息）</li></ol><h2 id="http-报文结构" tabindex="-1">HTTP 报文结构 <a class="header-anchor" href="#http-报文结构" aria-label="Permalink to &quot;HTTP 报文结构&quot;">​</a></h2><p>由请求（响应）起始行 + 请求（响应）头部 + 空行（<strong>区分头部与实体</strong>） + 实体（body）构成。其中请求(响应)起始行分别为方法 + URI路径 + HTTP版本 （版本 + 状态码 + 原因Reason）:</p><p><img src="'+d+`" alt=""></p><p><strong>空行之前不能存在空行的原因：多余的空行会导致空行后的内容全部被视为实体</strong>。</p><p><strong>首部字段的格式特点</strong>：字段名不区分大小写、不允许出现空格，不可以出现下划线 _、字段名后必须紧跟着冒号（:）</p><h2 id="http-的特点-优缺点" tabindex="-1">HTTP 的特点（优缺点） <a class="header-anchor" href="#http-的特点-优缺点" aria-label="Permalink to &quot;HTTP 的特点（优缺点）&quot;">​</a></h2><p><strong>HTTP 1.0 默认短连接</strong>（一个请求对应一个TCP连接），<strong>HTTP 1.1 默认长连接</strong>（一个TCP连接可发多个请求，因此可<strong>管道传输即当前请求响应前可继续发送下一请求</strong>）：减少了重复建立和断开 TCP 连接所造成的额外开销，减轻了服务器端的负载，<strong>减少整体的响应时间</strong>。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes light-plus dark-plus vp-code"><code><span class="line"><span>HTTP 请求启动 KeepAlive (长连接)需要服务端来设置的，比如 Nginx 配置</span></span>
<span class="line"><span>http {</span></span>
<span class="line"><span>  # 客户端连接在服务端保持开启的超时值</span></span>
<span class="line"><span>  keepalive_timeout 120s;</span></span>
<span class="line"><span>  # 可以服务的请求的最大数量</span></span>
<span class="line"><span>  keepalive_requests 10000;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><ol><li><strong>简单易理解（优点）</strong>：报文格式就是 <code>header + body</code>，头部信息也是 <code>key-value</code> 简单文本的形式。</li><li><strong>灵活易扩展（优点）</strong>：语义自由（除基本格式外没严格语法限制），传输形式多样（文本、图片、视频等）、工作在应用层，下层可随意变化（HTTPS 增加 SSL/TLS 安全传输层，HTTP/3 甚至 TCP 替换成基于 UDP 的 QUIC）。</li><li><strong>明文传输</strong>：报文(主要是头部)使用文本形式，调试便利（优点）， 但也暴露给攻击者（缺点）。</li><li><strong>无状态</strong>：不需要保存连接上下文信息场景（优点），长连接的场景下（缺点）。</li><li><strong>HTTP 1.1存在队头阻塞</strong>（缺点）：开启长连接，虽然可以不等响应发起新请求，但需要按顺序响应请求，前面的请求没响应之前会产生阻塞。</li><li><strong>不安全</strong>（缺点）：不验证通信方的身份，无法证明报文的完整性、通信明文（不加密）。</li><li>（优点）<strong>跨平台、应用广泛</strong>，（缺点）<strong>请求单向性、无优先级控制、按顺序响应、首部冗长未压缩</strong>。</li></ol><h2 id="http-响应状态码" tabindex="-1">HTTP 响应状态码 <a class="header-anchor" href="#http-响应状态码" aria-label="Permalink to &quot;HTTP 响应状态码&quot;">​</a></h2><p>HTTP 响应状态码用来表明特定 HTTP 请求是否成功完成。响应被归为五大类：</p><h3 id="_1-信息响应-100–199" tabindex="-1">1. 信息响应 (100–199) <a class="header-anchor" href="#_1-信息响应-100–199" aria-label="Permalink to &quot;1. 信息响应 (100–199)&quot;">​</a></h3><p>表示目前是协议处理的中间状态，还需要后续操作。</p>`,18),u=t("li",null,[t("strong",null,"100 Continue"),e("。表示目前为止一切正常，客户端应该继续请求，如果已完成请求则忽略。如果要让服务器检查请求头，客户端必须在初始请求中发送 Expect: 100-continue 作为标头，并发送带 body 的实际请求之前接收 100 Continue。")],-1),C=t("li",null,[t("strong",null,"101 Switching Protocols"),e("。表示服务器同意升级协议，协议由客户端在 Upgrade 请求头中降序列举，由服务器在 Upgrade 响应头中确认。只能切换到更高级的协议，例如，HTTP 升级为 WebSocket。")],-1),m=t("li",null,[t("strong",null,"103 Early Hints 早期提示"),e("。由服务器仍在准备响应时发送，并提示客户端服务器期望最终响应将链接的资源。这允许浏览器甚至在服务器准备并发送最终响应之前就开始预加载资源。主要与指示要加载的资源的 Link 标头一起使用，也还可能包含处理早期提示时强制执行的 Content-Security-Policy 标头（比如，早期响应通过将 CSP 设置为”self”限制为与请求相同的源才预加载资源。虽然最终响应可能会将 CSP 设置为无，即资源已被预加载，但不会被使用）。服务器可能会在重定向后发送多个 103 响应。浏览器只处理第一个早期提示响应，如果请求导致跨源重定向，则必须丢弃该响应。来自早期提示的预加载资源会有效地预加载到文档的 head 元素中，然后才是最终响应中加载的资源。出于兼容性考虑（Chrome103+/Firefox102+且需要用户主动启用，Edge103+且支持范围限制在 HTTP/2 或更高版本），除非已知客户端能正确处理该响应，建议只通过 HTTP/2 或更高版本发送早期提示响应。")],-1),H=o('<h3 id="_2-成功响应-200–299" tabindex="-1">2. 成功响应 (200–299) <a class="header-anchor" href="#_2-成功响应-200–299" aria-label="Permalink to &quot;2. 成功响应 (200–299)&quot;">​</a></h3><p><strong>表示成功状态</strong>。</p><ol><li><strong>200 OK</strong>。表明请求已经成功。默认情况下状态码为 200 的响应可以被缓存。成功的含义取决于HTTP请求方法： <ol><li>GET: 资源已被获取并在消息体中传输。</li><li>HEAD: 表示标头包含在响应中，没有任何消息正文（body）。</li><li>POST: 资源已被获取并在消息体中传输。</li><li>TRACE: 响应的消息体中包含服务器接收到的请求信息。</li><li>PUT 和 DELETE 的请求成功通常并不是响应200 OK 而是204 No Content （或者201 Created）。</li></ol></li><li><strong>201 Created</strong>，表示请求已经被成功处理，并且创建了新的资源。新的资源在应答返回之前已经被创建。同时新增的资源会在应答消息体中返回，其地址或者是原始请求的路径，或者是 Location 首部的值。常规使用场景是作为 POST 请求的结果。</li><li><strong>202 Accepted</strong>。表示请求已被接受处理，但处理尚未完成；事实上，处理可能还没有开始。该请求最终可能会或可能不会被执行，因为在实际处理时可能会拒绝该请求。它是非承诺性的，即 HTTP 无法在稍后发送异步响应，说明处理请求的结果。它适用于另一个进程或服务器处理请求或批处理的情况。</li><li><strong>203 Non-Authoritative Information 非授权信息</strong>。表明请求已成功，但转换代理已根据源服务器的 200 (OK) 响应修改了随附的有效负载。它类似于 Warning 首部的 214（Transformation Applied）警告码，后者的优势在于可以应用于任何状态码的响应之中。</li><li><strong>204 No Content</strong>。表示请求已成功，但客户端不需要离开其当前页面。默认情况下 204 响应是可缓存的（此类响应中包含 ETag 标头）。适用于PUT和DELETE 请求。例如，在 PUT 请求中进行资源更新，但是不需要改变当前展示给用户的页面，那么返回 204 No Content；如果创建了资源，则返回 201 Created；如果应将页面更改为新更新的页面，则应改用 200。虽然此状态代码旨在描述无body的响应，但服务器可能会错误地将数据包含在标头之后。该协议允许用户代理以不同方式处理此类响应，在持久连接中是可以观察到的，其中无效 body 可能包括对后续请求的不同响应。 Safari 拒绝任何此类数据。Chrome 和 Edge 在有效响应之前最多丢弃四个无效字节。Firefox 在有效响应之前可以容忍超过 1 KB 的无效数据。</li><li><strong>205 Reset Content</strong>。告诉客户端重置文档视图，例如清除表单的内容、重置canvas状态或刷新 UI。如果此响应错误地包含持久连接上的body，不同浏览器的处理行为与204同。</li><li><strong>206 Partial Content 部分内容</strong>。表示请求已成功，并且body中包含请求中Range首部指定的数据范围结果。如果只包含一个数据区间，那么整个响应的Content-Type首部的值为所请求的文件的类型，同时包含 Content-Range首部；如果包含多个数据区间，那么整个响应的 Content-Type首部的值为 multipart/byteranges，每个片段覆盖一个数据区间并用 Content-Range 和 Content-Type 进行描述。<strong>使用场景为 HTTP 分块下载和断点续传</strong>。</li><li><strong>207 Multi-Status 多状态</strong>。响应体是带有多状态根元素的<code>文本/xml</code> 或应用程序 /xml HTTP 实体。XML body 将列出所有单独的响应代码。返回资源集合的能力是 WebDAV 协议的一部分（它可以由访问 WebDAV 服务器的 Web 应用程序接收）。访问网页的浏览器永远不会遇到此状态代码。</li><li><strong>208 Already Reported</strong>。用于207响应中，以节省空间并避免冲突。如果以不同的路径多次请求同一资源（例如作为集合的一部分），则只有第一个资源会报告 200。所有其他绑定的响应将报告此 208 状态代码，因此不会产生冲突，并且响应保持较短。将资源绑定到多个路径的能力是 WebDAV 协议的扩展（它可以由访问 WebDAV 服务器的 Web 应用程序接收）。访问网页的浏览器永远不会遇到此状态代码。</li><li><strong>226 IM Used 已使用 IM</strong>。在增量编码的上下文中由服务器设置以指示它正在返回其收到的GET请求的增量。浏览器不支持 HTTP 增量编码（delta encoding），此状态代码由特定客户端使用的自定义服务器发回。使用增量编码时，服务器会用相对于给定基础文档（而不是当前文档）的差异（称为deltas）来响应GET请求。客户端使用 HTTP 标头 A-IM 表示要使用哪种差异算法，并使用 If-None-Match 标头提示服务器它得到的最新版本。服务器会生成一个delta，并在包含 IM 标头（使用的算法名称）和 Delta-Base 标头（与 delta 相关联的基础文档的 ETag）的 226 响应中发送回来。</li></ol><h3 id="_3-重定向消息-300–399" tabindex="-1">3. 重定向消息 (300–399) <a class="header-anchor" href="#_3-重定向消息-300–399" aria-label="Permalink to &quot;3. 重定向消息 (300–399)&quot;">​</a></h3><p><strong>重定向状态，资源位置发生变动，需要重新请求</strong>。</p><ol><li><strong>300  Multiple Choices</strong>。表示该请求有多个可能的响应。用户代理或用户应该选择其中之一，但由于没有如何选择的标准方法，因此该状态码很少使用。如果服务器有首选选择，它应该生成 Location 标头。</li><li><strong>301 Moved Permanently</strong> 永久重定向。表示请求的资源已明确移动到 Location 标头给出的 URL。浏览器会重定向到新的 URL，搜索引擎也会更新其资源链接。虽然规范要求在执行重定向时method和body保持不变，但并非所有用户代理都符合。由于该状态明确禁止更改方法，请仅将 301 用作 GET 或 HEAD 方法的响应，而将 308 用于 POST 方法。比如，http永久重定向到https（会做缓存优化）。</li><li><strong>302 Found</strong>，即临时重定向。表明请求的资源被暂时的移动到了由Location 指定的 URL 上，客户端应继续使用原有URI。不会做缓存优化，浏览器会重定向到这个 URL，但是搜索引擎不会对该资源的链接进行更新 (用 &quot;搜索引擎优化术语 &quot;来说，就是 &quot;链接汁液 &quot;不会被发送到新的 URL 上)。即使规范要求浏览器在重定向时保证请求method和请求body不变，但并不是所有的用户代理都会遵循。由于该状态明确禁止更改方法，所以推荐仅将 302 用作 GET 或 HEAD 方法的响应，而在其他时候使用307来替代。在确实需要将重定向请求的方法转换为 GET的场景下，可以使用 303，比如在使用 PUT 方法进行文件上传操作时，需要返回确认信息（例如“你已经成功上传了 xyz”）而不是上传的资源本身。</li><li><strong>303 See Other</strong> 参阅其他。表示重定向不链接到所请求的资源本身，而是链接到另一个页面（例如确认页面，或上传进度页面）。它通常作为 PUT 或 POST 的结果发回。用于显示此重定向页面的方法始终是 GET。</li><li><strong>304 Not Modified</strong> 未修改（缓存重定向）。表示无需重传所请求的资源。这是对缓存资源的隐式重定向，缓存控制中当协商缓存命中时（即客户端提供一个头信息指出客户端希望只返回在指定日期之后修改的资源）会返回。当请求方法是安全方法（例如 GET 或 HEAD）时，或者当请求是有条件的并使用 If-None-Match 或 If-Modified-Since 标头时会发生。响应不得包含body，并且必须包含在等效 200 OK 响应中发送的标头：Cache-Control、Content-Location、Date、ETag、Expires 和 Vary。许多开发工具的浏览器网络面板都会创建导致 304 响应的无关请求，因此开发人员可以看到对本地缓存的访问。(6)如果此响应错误地包含持久连接上的body，不同浏览器的处理行为与204同。</li><li><strong>307 Temporary Redirect</strong> 临时重定向。表示请求的资源已暂时移动到 Location 标头给出的 URL。原始请求的method和body将被重新用于执行重定向请求。如果希望使用的方法改为 GET，请使用 303 代替。307和302唯一的区别是307保证重定向请求时方法和主体不会改变。对于 302，一些旧客户端错误地将方法更改为 GET：使用非 GET 方法和 302 的行为在 Web 上是不可预测的，而使用 307 的行为是可预测的。对于 GET 请求，它们的行为是相同的。</li><li><strong>308 Permanent Redirect</strong> 永久重定向。表示请求的资源已明确移动到 Location 标头给出的 URL。浏览器重定向到此页面，搜索引擎更新其到该资源的链接。请求method和body不会改变，而 301 有时可能会错误地更改为 GET 方法。某些 Web 应用程序可能会以非标准方式或出于其他目的使用 308 Permanent Redirect。例如，Google Drive 使用 308 Resume Incomplete 响应来向客户端指示不完整的上传何时停止。</li></ol><h3 id="_4-客户端错误响应-400–499" tabindex="-1">4. 客户端错误响应 (400–499) <a class="header-anchor" href="#_4-客户端错误响应-400–499" aria-label="Permalink to &quot;4. 客户端错误响应 (400–499)&quot;">​</a></h3><p><strong>请求报文有误</strong>。</p><ol><li><strong>400 Bad Request</strong> 表示服务器因某些被认为是客户端错误的原因（例如，请求语法错误、无效请求消息格式或者欺骗性请求路由），而无法或不会处理该请求。警告： 客户端不应该在未进行修改的情况下重复发送此请求。</li><li><strong>401 Unauthorized</strong>  未授权。表示客户端请求尚未完成，因为它缺少所请求资源的有效身份验证凭据。会与包含有如何进行验证的信息的WWW-Authenticate 首部一起发送。该状态码类似于 403 Forbidden，区别是依然可以进行身份验证。</li><li><strong>402 Payment Required</strong> 需要付款。被创建最初目的是用于数字现金或微型支付系统，表明客户端请求的内容只有付费之后才能获取。目前还不存在标准的使用约定，不同的实体可以在不同的环境下使用。是一个非标准响应状态码，该状态码被保留但未定义，实际上没有浏览器支持它。</li><li><strong>403 Forbidden</strong> 禁止。表示服务器理解该请求但拒绝授权。类似于 401，但进入 403状态后即使重新验证也不会改变该状态。该访问是长期禁止的，并且与应用逻辑密切相关（例如没有足够的权限访问该资源）。</li><li><strong>404 Not Found</strong> 找不到。表示服务器无法找到请求的资源。指向 404 页面的链接通常被称为断链或死链。404 只表示资源丢失，而不表示是暂时还是永久丢失。如果资源被永久删除，请使用 410。可以显示自定义 404 页面，以便为用户提供更多帮助，并提供下一步操作的指导。例如，对于 Apache 服务器，可以在 .htaccess 文件中指定自定义 404 页面的路径（定制设计是好事，但要适度。可以使404 页面变得幽默且人性化，但不要让用户感到困惑。）</li><li><strong>405 Method Not Allowed</strong> 方法不允许。表示服务器知道请求方法，但目标资源不支持此方法。服务器必须在 405 中生成一个Allow标头。该字段必须包含目标资源当前支持的方法列表。</li><li><strong>406 Not Acceptable</strong> 不可接受的。表示服务器无法生成与请求中的主动内容协商标头（Accept、Accept-Encoding、Accept-Language）中定义的可接受值列表相匹配的响应，并且服务器不愿意提供默认表示。实际上，这个错误很少被使用。服务器不会使用此错误代码进行响应（这对于最终用户来说是神秘的且难以修复），而是忽略相关标头并向用户提供实际页面。如果服务器返回此状态码，则消息body应包含资源的可用表示形式的列表，允许用户在其中进行选择。</li><li><strong>407 Proxy Authentication Required</strong> 需要代理授权。由于缺乏位于浏览器与可以访问所请求资源的服务器之间的代理服务器（proxy server ）要求的身份验证凭证，发送的请求尚未得到满足。会与包含有如何进行验证的信息的Proxy-Authenticate 首部一起发送。</li><li><strong>408 Request Timeout</strong> 请求超时。表示服务器想要关闭这个未使用的连接。即使客户端之前没有任何请求，它也会由某些服务器在空闲连接上发送。服务器应该在响应中发送“close”Connection 标头字段，因为 408 意味着服务器已决定关闭连接而不是继续等待。由于某些浏览器（例如 Chrome、Firefox 27+ 和 IE9）使用 HTTP 预连接机制来加快网络速度，因此该响应的使用更加频繁。有些服务器只是关闭连接而不发送此消息。</li><li><strong>409 Conflict</strong> 冲突。表示请求与目标资源的当前状态发生冲突。在响应 PUT 请求时最有可能发生冲突。例如，在上传比服务器上现有文件更旧的文件时，可能会收到 409，从而导致版本控制冲突。</li><li><strong>410 Gone</strong> 消失。表示源服务器不再提供对目标资源的访问，并且这种情况可能是永久性的。如果不知道这种情况是暂时的还是永久的，则应使用 404。410 默认是可缓存的。</li><li><strong>411 Length Required</strong> 表示服务器拒绝接受没有定义 Content-Length 标头的请求。根据规范，当使用分块模式传输数据时，Content-Length 头信息会被省略，需要在每个数据块的开头以十六进制格式添加当前数据块的长度。</li><li><strong>412 Precondition Failed</strong> 前提条件失败。表示对目标资源的访问已被拒绝。当不满足 If-Unmodified-Since 或 If-None-Match 标头定义的条件时，除 GET 或 HEAD 之外的方法上的条件请求会发生这种情况，请求（通常是上传或修改资源）将无法执行，从而返回该错误状态码。</li><li><strong>413 Content Too Large</strong> 内容过大。表示请求实体大于服务器定义的限制；服务器可能会关闭连接或返回 Retry-After 标头。在 RFC 9110 之前，状态的响应短语是 Payload Too Large，此名字至今仍被广泛使用。</li><li><strong>414 URI Too Long URI</strong> 太长。表示客户端请求的 URI 比服务器愿意解释的长度长。客户端不恰当地将 POST 请求转换为带有较长查询信息的 GET 请求、客户端陷入重定向循环（例如，重定向 URI 前缀指向自身的后缀）、或当服务器受到试图利用潜在安全漏洞的客户端攻击时会出现此情况。</li><li><strong>415 Unsupported Media Type</strong> 不支持的媒体类型。表示服务器拒绝接受请求，因为有效载荷格式是不支持的格式。格式问题的出现有可能源于客户端在 Content-Type 或 Content-Encoding 首部中指定的格式，也可能源于直接对负载数据进行检测的结果。</li><li><strong>416 Range Not Satisfiable</strong> 范围不满足。表示服务器无法为请求的范围提供服务。最可能的原因是文档不包含此类范围，或者 Range 标头值虽然语法正确，但没有意义。416 响应报文包含一个 Content-Range 首部，提示无法满足的数据区间（用星号 * 表示），后面紧跟着一个“/”，再后面是当前资源的长度。例如：Content-Range: */12777。面对此错误，浏览器通常要么中止操作（例如，下载将被视为不可恢复），要么再次请求整个文档。</li><li><strong>417 Expectation Failed</strong> 不满足期望。表示无法满足请求的 Expect 标头中给出的期望。</li><li><strong>418 I&#39;m a teapot</strong> 我是一个茶壶。表示服务器拒绝冲泡咖啡，因为它永远是茶壶。暂时没有咖啡壶/茶壶的组合应该返回 503。此错误引用了 1998 年和 2014 年愚人节笑话中定义的超文本咖啡壶控制协议。一些网站使用此响应来处理不希望处理的请求，例如自动查询。</li><li><strong>421 Misdirected Request</strong> 表示请求被定向到无法生成响应的服务器。如果重用连接或选择替代服务时可能出现此情况。 (21)422 Unprocessable Content 表示服务器了解请求实体的内容类型，并且请求实体的语法正确，但无法处理所包含的指令。警告：客户端不应在未经修改的情况下重复此请求。</li><li><strong>423 Locked</strong> 表示暂定目标的资源已被锁定，即无法访问。其内容应包含一些 WebDAV XML 格式的信息。锁定资源的功能特定于某些 WebDAV 服务器。浏览器访问网页永远不会遇到这个状态码；如果发生错误，它们会将其作为通用 400 状态码进行处理。</li><li><strong>424 Failed Dependency</strong> 表示无法对资源执行该方法，因为请求的操作依赖于另一个操作，并且该操作失败。常规 Web 服务器通常不会返回此状态代码。但其他一些协议（例如 WebDAV）可以返回它。例如，在 WebDAV 中，如果发出 PROPPATCH 请求，并且一个命令失败，则所有其他命令也会自动失败，并显示 424 Failed Dependency。</li><li><strong>425 Too Early</strong> 表示服务器不愿意冒险处理可能重播的请求，这会产生重播攻击的可能性。</li><li><strong>426 Upgrade required</strong> 表示服务器拒绝使用当前协议执行请求，但在客户端升级到不同协议后可以接受。服务器会在响应中使用 Upgrade 首部来指定要求的协议。</li><li><strong>428 Precondition required</strong> 表示服务器要求发送条件请求。通常，这意味着缺少必需的条件首部，例如 If-Match。而当一个条件首部的值不能匹配服务器端的状态的时，应答的状态码应该是 412 Precondition Failed，前置条件验证失败。</li><li><strong>429 Too Many Requests</strong> 表示用户在给定时间内发送了太多请求（“速率限制”）。此响应中可能包含 Retry-After 标头，指示在发出新请求之前需要等待多长时间。</li><li><strong>431 Request Header Fields Too Large</strong> 表示服务器拒绝处理该请求，因为请求的 HTTP 标头太长。减少请求标头的大小后可以重新提交请求。当请求头的总大小太大，或者单个头字段太大时，可以使用431。为帮助用户解决问题，应在响应body中指出这两个错误中的哪一个是问题所在且包括哪些标头太大。引用 URL 太长或请求中发送的 Cookie 太多时服务器通常会使用此状态码。</li><li><strong>451 Unavailable For Legal Reasons</strong> 表示用户请求的资源由于法律原因不可用，例如已发出法律诉讼的网页。</li></ol><h3 id="_5-服务端错误响应-500–599" tabindex="-1">5. 服务端错误响应 (500–599) <a class="header-anchor" href="#_5-服务端错误响应-500–599" aria-label="Permalink to &quot;5. 服务端错误响应 (500–599)&quot;">​</a></h3><p><strong>服务器端发生错误</strong>。</p><ol><li><strong>500 Internal Server Error</strong> 表示服务器遇到了意外情况，导致其无法完成请求。这个错误代码是一个通用的“万能”响应代码。有时候，对于类似于 500 这样的错误，服务器管理员会更加详细地记录相关的请求信息来防止以后同样错误的出现。</li><li><strong>501 Not Implemented</strong> 表示服务器不支持完成请求所需的功能。此状态还可以发送 Retry-After 标头，告诉请求者何时检查以查看届时是否支持该功能。当服务器无法识别请求方法并且无法支持任何资源时，501 是恰当的响应。服务器唯一必须支持的方法是 GET 和 HEAD，因此不得返回 501。如果服务器确实能识别该方法，但故意不支持它，则适当的响应是 405 方法不允许。默认情况下，501 响应是可缓存的。501 错误需要所尝试访问的网络服务器来进行修复。</li><li><strong>502 Bad Gateway</strong> 表示服务器在充当网关或代理时从上游服务器收到无效响应。网关可能指的是网络中的不同事物，502 错误通常无法修复，但需要 Web 服务器或尝试访问的代理进行修复。</li><li><strong>503 Service Unavailable</strong> 表示服务器尚未准备好处理请求。常见原因是服务器因维护而停机或过载。此响应应用于临时情况，并且 Retry-After HTTP 标头应（如果可能）包含服务恢复的估计时间以及解释问题的用户友好页面。应注意随此响应一起发送的与缓存相关的标头，因为503 通常是一种临时状态，响应通常不应被缓存。</li><li><strong>504 Gateway Timeout</strong> 表示服务器在充当网关或代理时，没有及时从上游服务器获得完成请求所需的响应。</li><li><strong>505 HTTP Version Not Supported</strong> 表示服务器不支持请求中使用的 HTTP 版本。</li><li><strong>506 Variant Also Negotiates</strong> 表示服务器内部配置错误，此时所选变体本身被配置为参与内容协商，因此不是一个合适的协商端点。可在透明内容协商（见 RFC 2295）中给出。在服务器支持多种变体的情况下，该协议使客户端能够检索给定资源的最佳变体。</li><li><strong>507 Insufficient Storage</strong> 可以在 WebDAV 协议（基于 web 的分布式创作和版本控制，参见 RFC 4918）中给出。表示服务器不能存储相关内容。准确地说，一个方法可能没有被执行，因为服务器不能存储其表达形式，这里的表达形式指：方法所附带的数据，而且其请求必需已经发送成功。</li><li><strong>508 Loop Detected</strong> 表示服务器终止了操作，因为在处理“Depth: infinity”的请求时遇到无限循环。此状态表明整个操作失败。可以在 WebDAV 协议（基于 Web 的分布式创作和版本控制）中给出。</li><li><strong>510 Not Extended</strong> 在 HTTP 扩展框架协议（参见 RFC 2774）中发送。在 HTTP 扩展框架协议中，一个客户端可以发送一个包含扩展声明的请求，该声明描述了要使用的扩展。如果服务器接收到这样的请求，但是请求不支持任何所描述的扩展，那么服务器将使用 510 状态码进行响应。</li><li><strong>511 Network Authentication Required</strong> 表示客户端需要通过验证才能使用该网络。该状态码不是由源头服务器生成的，而是由控制网络访问的拦截代理服务器生成的。网络运营商有时在授予访问权限之前需要进行一些身份验证、接受条款或其他用户交互（例如在网吧或机场）。他们经常使用媒体访问控制 (MAC，Media Access Control) 地址来识别尚未这样做的客户端。</li></ol><h2 id="http-请求方法" tabindex="-1">HTTP 请求方法 <a class="header-anchor" href="#http-请求方法" aria-label="Permalink to &quot;HTTP 请求方法&quot;">​</a></h2><h3 id="幂等、安全、可缓存" tabindex="-1">幂等、安全、可缓存 <a class="header-anchor" href="#幂等、安全、可缓存" aria-label="Permalink to &quot;幂等、安全、可缓存&quot;">​</a></h3><ol><li><strong>幂等</strong>：指的是同样的请求被执行一次与连续执行多次的效果是一样的，服务器的状态也是一样的。幂等方法不应该具有副作用（统计用途除外）。在正确实现的条件下， GET， HEAD、PUT、DELETE、OPTIONS和TRACE方法都是幂等的，而 POST、CONNECT和PATCH方法不是。所有的安全方法都是幂等的。幂等性只与后端服务器的实际状态有关，而每一次请求接收到的状态码不一定相同（例如，第一次调用 DELETE 方法有可能返回200 ，但是后续的请求由于已经删除可能会返回 404）。需要主义的是，服务器不一定会确保请求方法的幂等性，有些应用可能会错误地打破幂等性约束。</li><li><strong>安全</strong>：指的是不会修改服务器数据，对服务器是只读操作。安不安全的定义是这个方法需不需要服务器修改数据。所有安全的方法都是幂等的，但并非所有幂等方法都是安全的，PUT、POST、CONNECT和DELETE方法不是安全的。建议任何应用都不应让 GET 请求修改服务端的状态（数据）。安全的方法并不意味着只是对服务端的静态文件的请求，服务端可以在请求的时候即时生成资源返回，只要生成资源的脚本保证是安全的即可。</li><li><strong>可缓存</strong>：指的是可以缓存的 HTTP 响应，它被存储起来以便后续的检索和使用，省去了对服务器的新的请求。对一些不可缓存的请求/响应可能会使先前缓存的响应失效，比如PUT 将使所有对同一 URI 的 GET 或 HEAD 的缓存请求失效。并非所有的 HTTP 响应都可以被缓存，需同时满足条件： <ol><li>请求中使用的方法本身就是可缓存的，即 GET 或 HEAD 方法。如果指示了有效期并且设置了 Content-Location 标头，POST 或 PATCH 请求的响应也可以被缓存，但是这很少被实现，比如Firefox 就不支持它。其他方法，如 PUT 或 DELETE 是不可缓存的，其结果也不能被缓存。</li><li>响应的状态码对应用程序的缓存可知，且被认为是可缓存的。可缓存状态码有：200、203、204、206、300、301、404、405、410、414 和 501。</li><li>响应中与缓存相关的特定标头，如 Cache-Control。</li></ol></li></ol><h3 id="connect" tabindex="-1">CONNECT <a class="header-anchor" href="#connect" aria-label="Permalink to &quot;CONNECT&quot;">​</a></h3><p><strong>CONNECT 请求方法</strong>可以开启与所请求资源之间的双向沟通的通道，它可以用来创建隧道（tunnel）。它是一个逐跳（hop-by-hop）的方法。<strong>请求与响应均无 body、不安全、不幂等、不可缓存以及不允许在HTML表单中使用</strong>。客户端要求 HTTP 代理服务器将 TCP 连接作为通往目的主机的隧道，代理服务器会面向客户端发送或接收 TCP 数据流。它可以用来访问采用了 SSL（HTTPS）协议的站点。</p><h3 id="delete" tabindex="-1">DELETE <a class="header-anchor" href="#delete" aria-label="Permalink to &quot;DELETE&quot;">​</a></h3><p><strong>DELETE 请求方法</strong>用于删除指定的资源。<strong>请求与响应均可能有 body、不安全、幂等、不可缓存以及不允许在 HTML 表单中使用</strong>。方法成功执行可能响应状态码为200（操作已执行且响应消息包含描述状态的表示）、202（操作可能会成功但尚未实施）或204（操作已执行且无需提供进一步信息）。</p><h3 id="head" tabindex="-1">HEAD <a class="header-anchor" href="#head" aria-label="Permalink to &quot;HEAD&quot;">​</a></h3><p><strong>HEAD 请求方法</strong>请求资源的标头信息，并且这些标头与 GET方法请求时返回的一致。<strong>请求与响应均无 body、安全、幂等、可缓存以及不允许在HTML表单中使用</strong>。一个使用场景是在下载大文件前先通过 HEAD 请求读取其 Content-Length 标头的值获取文件的大小，而无需实际下载文件，以此可以节约带宽资源。HEAD 方法的响应不应有body，如果有，则必须忽略：任何可能描述错误body的表示标头都被假定为描述类似 GET 请求将收到的响应。如果 HEAD 请求的响应表明缓存的URL响应已过期，那么即使没有发出 GET 请求，缓存副本也会失效。</p><h3 id="options" tabindex="-1">OPTIONS <a class="header-anchor" href="#options" aria-label="Permalink to &quot;OPTIONS&quot;">​</a></h3><p><strong>OPTIONS 请求方法</strong>请求给定 URL 或服务器所允许的通信选项。客户端可以使用此方法指定 URL，或使用星号 (*) 来引用整个服务器。<strong>请求无 body、响应有body、安全、幂等、不可缓存以及不允许在HTML表单中使用</strong>。200 OK 和 204 No Content 都是允许的状态码。使用场景：1. 检测服务器所支持的请求方法；2. 发起CORS 中的预检请求以检测实际请求是否可以被服务器所接受。</p><h3 id="patch" tabindex="-1">PATCH <a class="header-anchor" href="#patch" aria-label="Permalink to &quot;PATCH&quot;">​</a></h3><p><strong>PATCH 请求方法</strong>用于对资源进行部分修改，类似于CURD（创建：Create，读取：Read，更新：Update，删除：Delete）中的更新。与PUT 是一个资源的完整表述形成对比，PATCH 请求是一组关于如何修改资源的指令。<strong>请求无 body，响应可能有 body、不安全、不幂等、不可缓存以及不允许在 HTML 表单中使用</strong>。任何 2xx 状态码都代表成功的响应。服务器可以通过将其加入 Allow 或 Access-Control-Allow-Methods 响应标头中的列表来宣告其支持PATCH 方法或者 Accept-Patch 标头的存在。</p><h3 id="put" tabindex="-1">PUT <a class="header-anchor" href="#put" aria-label="Permalink to &quot;PUT&quot;">​</a></h3><p><strong>PUT 请求方法</strong>创建一个新的资源或用请求的有效载荷替换目标资源的表示。和post的区别在于PUT是幂等的。<strong>请求有 body，响应可能有body、不安全、幂等、不可缓存以及不允许在 HTML 表单中使用</strong>。如果目标资源没有当前的表示，并且 PUT 方法成功创建了资源，那么源服务器必须返回 201（Created）来通知用户代理资源已创建。如果目标资源已经存在，并且依照请求中封装的表现形式成功进行了更新，那么，源服务器必须返回 200（OK）或 204（No Content）来表示请求成功完成。</p><h3 id="trace" tabindex="-1">TRACE <a class="header-anchor" href="#trace" aria-label="Permalink to &quot;TRACE&quot;">​</a></h3><p><strong>TRACE 请求方法</strong>沿着通往目标资源的路径进行信息回环（loop-back）测试，提供了一种实用的 debug 机制。<strong>请求和响应均无body、安全、幂等、不可缓存以及不允许在 HTML 表单中使用</strong>。请求的最终接收者（源服务器或第一个在请求中收到 Max-Forwards 值为 0 的服务器）应将收到的信息作为 200（OK）响应的信息body反映给客户端，其 Content-Type 为 message/http。</p><h3 id="get" tabindex="-1">GET <a class="header-anchor" href="#get" aria-label="Permalink to &quot;GET&quot;">​</a></h3><p><strong>GET 请求方法</strong>请求指定资源的表示。使用 GET 的请求应该只用于请求数据，而不应该包含数据。<strong>请求无 body，响应有 body、安全、幂等、可缓存以及允许在 HTML 表单中使用</strong>。在 GET 请求中发送请求体或有效载荷可能会导致一些现有的实现拒绝该请求——虽然规范没有禁止，但语义没有定义，因此最好是避免在 GET 请求中发送有效载荷。</p><h3 id="post" tabindex="-1">POST <a class="header-anchor" href="#post" aria-label="Permalink to &quot;POST&quot;">​</a></h3><p><strong>POST 请求方法</strong>发送数据给服务器。请求主体的类型由 Content-Type 标头指定。<strong>请求和响应均有 body、不安全、不幂等、仅在包含足够新的信息时可缓存以及允许在HTML表单中使用</strong>。POST 请求若是通过 HTML 表单发送，其内容类型（content type）是通过在 <code>&lt;form&gt;</code> 元素中设置正确的 enctype 属性，或是在 <code>&lt;input&gt;</code> 和 <code>&lt;button&gt;</code> 元素中设置 formenctype 属性来选择的；若是通过 AJAX（XMLHttpRequest 或 fetch）发送时，请求 body 可以是任何类型。据HTTP 1.1 规范所描述，POST 设计用途是：</p><ol><li>对现有资源进行注释；</li><li>在公告板，新闻组，邮件列表或类似的文章组中发布消息；</li><li>通过注册模板新增用户；</li><li>向数据处理过程提供一批数据，例如提交一个表单；</li><li>通过追加操作，扩展数据库数据。</li></ol><h3 id="get-与-post-的区别" tabindex="-1">GET 与 POST 的区别 <a class="header-anchor" href="#get-与-post-的区别" aria-label="Permalink to &quot;GET 与 POST 的区别&quot;">​</a></h3><p>根据HTTP/1.1-RFC7231中的描述，不同的请求方法仅有语义上的差别（GET请求资源；POST提交资源），并无实质的不同，之所以造成开发上的区别，是因为在具体的实现环境——浏览器中，针对不同的请求方法设置了不同的协议实现方式（GET请求体为空，POST有请求体），从而造成了以下区别：</p><ol><li><strong>安全角度</strong>：如果说一个 HTTP 方法是安全的，是指这是个不会修改服务器的数据的方法。也就是说，这是一个对服务器只读操作的方法。因此POST 是不安全的，GET是安全的。</li><li><strong>缓存角度</strong>：GET 请求会被浏览器主动缓存历史记录，POST 默认不会（如果指示新鲜度并且设置了 Content-Location 标头则可以）。GET请求的地址还可以被保存在浏览器书签，POST则不可以。</li><li><strong>编码角度</strong>：GET只能进行URL 编码，只接收ASCII字符，POST无限制。因为GET数据是在请求行中，POST数据是在请求体中。</li><li><strong>参数角度</strong>：GET一般放在 URL 中（不安全），POST 放在请求body中（适合传输敏感信息）。</li><li><strong>幂等性角度</strong>：GET是幂等的（执行相同操作，结果不变），而POST不是。若当前页面是通过POST请求得到的，则浏览器会提示用户是否重新提交。GET请求得到的页面则没有提示。</li><li><strong>大小限制角度</strong>：GET，POST本身均无限制，但前者依赖URL，不同的浏览器对于 URL 是有限制的，比如 IE 浏览器对于 URL 的限制为 2KB，而 Chrome，FireFox 浏览器理论上对于 URL 是没有限制的。</li><li><strong>TCP 角度</strong>：GET将“header + data请求报文”一次发送，而 POST会发送两个 TCP 数据包，先发 header 部分，如果服务器响应100(continue)，然后再发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)。<strong>优点体现：在网络环境好的情况下，发一次包和两次包的事件差别基本可无视。而网络环境差时，两次包的TCP在验证数据包完整性上优点很大</strong>。</li></ol><h2 id="http-发展" tabindex="-1">HTTP 发展 <a class="header-anchor" href="#http-发展" aria-label="Permalink to &quot;HTTP 发展&quot;">​</a></h2><p><img src="'+p+'" alt=""></p><h3 id="http-1" tabindex="-1">HTTP 1 <a class="header-anchor" href="#http-1" aria-label="Permalink to &quot;HTTP 1&quot;">​</a></h3><p>1989年，网络传输超文本系统 Mesh 被 Tim Berners-Lee 博士提出，1990 年更名为万维网（World Wide Web）。1991 年 8 月 16 日万维网公开发表。它在现有的 TCP 和 IP 协议基础之上建立，由四个部分组成：</p><ol><li>一个用来表示超文本文档的文本格式，超文本标记语言（HTML）。</li><li>一个用来交换超文本文档的简单协议，超文本传输协议（HTTP）。</li><li>一个显示（以及编辑）超文本文档的客户端，即首个网络浏览器 WorldWideWeb。</li><li>一个服务器用于提供可访问的文档，即 httpd 的前身。</li></ol><p>HTTP 的最初版本没有版本号，后来为了与后来的版本区分，被称为 0.9 即 HTTP/0.9，也叫做叫做单行（one-line）协议，请求由单行指令构成，以唯一可用方法 GET 开头，其后跟目标资源的路径（由于一旦连接到服务器就不需要协议、服务器和端口，因此不包括完整的 URL），以空格分隔，比如GET /mypage.html。响应只包含响应文档本身，并不包含 HTTP 头，只能传输HTML文件，没有状态码，出现错误则响应的是包含问题描述信息的 HTML 文件。</p><p>HTTP/1.0 是浏览器和服务器在HTTP/0.9增加扩展功能，但并未形成官方标准：</p><ol><li>协议版本信息随请求发送（GET行追加HTTP/1.0）</li><li>状态码会在响应开始时发送，使浏览器能了解请求执行成功或失败，并相应调整行为（如更新或使用本地缓存）。</li><li>引入了 HTTP 标头的概念，无论是对于请求还是响应，允许传输元数据，使协议变得非常灵活，更具扩展性。</li><li>在新 HTTP 标头的帮助下，具备了传输除纯文本 HTML 文件以外其他类型文档的能力（凭借 Content-Type 标头）。</li></ol><p>1997 年，HTTP/1.1 以 RFC 2068 文件发布：</p><ol><li>连接可以复用，节省了多次打开 TCP 连接加载网页文档资源的时间。</li><li>增加管线化技术，允许在第一个应答被完全发送之前就发送第二个请求，以降低通信延迟。</li><li>支持响应分块。</li><li>引入额外的缓存控制机制。</li><li>引入内容协商机制，包括语言、编码、类型等。并允许客户端和服务器之间约定以最合适的内容进行交换。</li><li>凭借 Host 标头，能够使不同域名配置在同一个 IP 地址的服务器上。</li></ol><h3 id="https" tabindex="-1">HTTPS <a class="header-anchor" href="#https" aria-label="Permalink to &quot;HTTPS&quot;">​</a></h3><p>HTTPS 通过<strong>信息加密</strong>（通过 SSL/TLS 混合加密，而 HTTP 是明文传输无状态协议）、<strong>CA 身份证书</strong>（存放公钥，且通过证书进行身份认证）、<strong>校验机制</strong>（摘要算法）解决 HTTP 所存在的窃听、篡改、冒充风险。HTTPS 的端口号是 443（HTTP 是 80），比 HTTP 多 SSL/TLS 的握手过程。</p><p><img src="'+h+'" alt=""></p><blockquote><p><strong>混合加密：非对称加密</strong>（通信建立前非对称加密「会话秘钥」—<strong>解决了密钥交换问题，但速度慢</strong>） + <strong>对称加密</strong>（通信过程中使用「会话秘钥」对称加密明文数据—<strong>运算速度快，但密钥交换不安全</strong>）。</p></blockquote><h4 id="tls" tabindex="-1">TLS <a class="header-anchor" href="#tls" aria-label="Permalink to &quot;TLS&quot;">​</a></h4><p>传输层安全 (TLS, Transport Layer Security) 协议是使两个联网应用程序或设备能够私密且可靠地交换信息的标准。使用TLS进行任何连接的安全性取决于密码套件和所选的安全性参数。Mozilla 操作安全 (OpSec) 团队为使用TLS的服务器维护的 <a href="https://ssl-config.mozilla.org/" target="_blank" rel="noreferrer">TLS 配置生成器</a>与<a href="https://wiki.mozilla.org/Security/Server_Side_TLS" target="_blank" rel="noreferrer">配置指南</a>。</p><p>HTTPS 是基于 Netscape 推出的安全套接字层 (SSL) 2.0 技术推出的，随后更新为 SSL 3.0。互联网工程任务组( IETF) 于 1999 年 1 月指定 TLS 1.0作为通用的标准加密技术来确保所有 Web 浏览器和服务器之间的互操作性，TLS的当前版本是 1.3。 TLS 提供三项主要服务：</p><ol><li>验证：身份验证让通信各方验证对方是否是声称的身份。</li><li>加密：数据在用户代理和服务器之间传输时被加密，以防止未经授权的各方读取和解释。</li><li>正直：TLS 确保在加密、传输和解密数据之间不会丢失、损坏、篡改或伪造信息。</li></ol><p>TLS 握手协商的主要参数是密码套件。在 TLS 1.2 及更早版本中，协商密码套件包括一组加密算法，这些算法共同提供共享密钥的协商、对服务器进行身份验证的方式以及用于加密数据的方法。TLS 1.3 中的密码套件主要管理数据加密，单独的协商方法用于密钥协商和身份验证。为缓解变得缓慢或无响应的问题，现代浏览器实现了 TLS 握手超时（Firefox 58开始，默认值为 30 秒，可以通过编辑 about:config 中的network.http.tls-handshake-timeout首选项来改变超时值）。TLS 1.3的主要变化：</p><ol><li>大多数情况下，TLS 1.3 握手在一次往返中完成，从而减少了握手延迟。</li><li>服务器可以启用 0-RTT（零往返时间）握手。重新连接到服务器的客户端可以立即发送请求，从而完全消除 TLS 握手的延迟。尽管 0-RTT 的性能提升可能非常显着，但它们会带来一定的重放攻击风险。</li><li>TLS 1.3 仅支持前向安全模式，除非连接已恢复或使用预共享密钥。</li><li>TLS 1.3 定义了 TLS 1.3 独有的一组新密码套件。这些密码套件均使用现代的关联数据验证加密 (AEAD) 算法。</li><li>TLS 1.3 握手是加密的，建立共享密钥所需的消息除外。服务器和客户端证书是加密的。但客户端发送到服务器的服务器身份（server_name 或 SNI 扩展）未加密。</li><li>已被禁用：重新协商、通用数据压缩、数字签名算法(DSA) 证书、静态 RSA 密钥交换以及与自定义 Diffie-Hellman (DH) 组的密钥交换。</li></ol><h4 id="传统-ssl-tls-四次握手-rsa版本" tabindex="-1">传统 SSL\\TLS 四次握手（RSA版本） <a class="header-anchor" href="#传统-ssl-tls-四次握手-rsa版本" aria-label="Permalink to &quot;传统 SSL\\TLS 四次握手（RSA版本）&quot;">​</a></h4><p><img src="'+c+'" alt=""></p><ol><li>客户端发送“随机数 client_random + 支持加密算法”;</li><li>服务器返回“随机数 server_random + 确定的加密算法（RSA） + CA证书 + 公钥（此时只有服务器具有公钥的的私钥）”;</li><li>客户端验证证书通过后，生成随机数 pre_random，使用公钥对 pre_random 加密，发送给服务器。</li><li>服务器用私钥解开 pre_random，最后将之前内容形成摘要返回给客户端。客户端收到回复，校验成功，握手结束。</li></ol><p>之后的数据据传输使用约定的加密方法（RSA）对服务器和客户端都拥有的三个随机数生成的密钥 secret 进行加解密。</p><h4 id="tls-1-2-四次握手" tabindex="-1">TLS 1.2 四次握手： <a class="header-anchor" href="#tls-1-2-四次握手" aria-label="Permalink to &quot;TLS 1.2 四次握手：&quot;">​</a></h4><p>TLS 主流版本是1.2（TLS1.0 = SSL3.1，这之前的都被认为不安全）。TLS 1.2 四次握手如下：</p><p><img src="'+P+'" alt=""></p><ol><li>客户端发送“随机数client_random + TLS版本 + 加密套件列表（比如TLS_ECDHE_WITH_AES_128_GCM_SHA256：ECDHE密钥交换算法，使用128位的AES算法和主流的GCM分组模式对称加密，数字签名采用SHA256哈希摘要算法）”;</li><li>服务器发送“随机数server_random + 确认 TLS版本 + 选定的加密套件列表 + CA证书（公钥）+ 使用私钥对server_params、两个随机数进行签名”;</li><li>客户端使用公钥验证服务器身份通过后，获得server_params，使用其中的椭圆曲线算法、服务器临时公钥和客户端自己生成的临时私钥相乘计算出预主密钥随机数(premaster secret)，最后伪随机函数传入Client Random、Server Random、Premaster Secret 生成会话密钥，发送 client_params（包括客户端生成的椭圆曲线公钥）、切换加密模式、会话密码加密后的验证会话密码消息给服务器。</li><li>服务器拿到 client_params，利用相同的方法计算出会话密钥，同样，将切换加密模式、会话密码加密后的验证会话密码消息发送给客户端验证。校验成功则握手结束。</li></ol><p>TLS 1.3 不必等验证服务器身份而是一开始就将 client_params 发送给服务器。</p><h4 id="证书颁发机构-ca" tabindex="-1">证书颁发机构 (CA) <a class="header-anchor" href="#证书颁发机构-ca" aria-label="Permalink to &quot;证书颁发机构 (CA)&quot;">​</a></h4><p>**证书颁发机构 （CA）**是签署数字证书及其关联公钥的组织，从而断言所包含的信息和密钥是正确的。对于网站数字证书，此信息至少包括请求数字证书的组织名称、其所属网站以及证书颁发机构。证书颁发机构是互联网公钥基础设施的一部分，允许浏览器验证网站身份并通过 SSL（和 HTTPS）安全连接。Web浏览器预装了一个“根证书”列表。浏览器可以使用这些来可靠地检查网站证书是否由“链回”到根证书的证书颁发机构签署(即受根证书所有者或中间CA的信任)。最终，这个过程依赖于每个CA在签署证书之前执行充分的身份检查!</p><h4 id="证书透明度-ct" tabindex="-1">证书透明度（CT） <a class="header-anchor" href="#证书透明度-ct" aria-label="Permalink to &quot;证书透明度（CT）&quot;">​</a></h4><p>**证书透明度（Certificate Transparency，CT）**是一个开放的框架，旨在监测和防止证书的误发。有了证书透明度机制，新颁发的证书会被“记录”到公开运行的、通常是独立的 CT 日志中——这些日志保持着仅允许添加、有密码学保证的已颁发 TLS 证书记录。当证书被提交到 CT 日志时，一个证书签署时间戳（SCT）被生成并返回。这可作为证书已提交的证明，并将被添加到日志中。该规范指出，符合要求的服务器必须在 TLS 客户端连接时向其提供一些这样的 SCT，实现方式有：</p><ol><li>X.509v3 证书扩展，直接将签名的证书时间戳嵌入叶节点证书中。通过 X.509 证书扩展，所包含的 SCT 由签发的 CA 决定。自 2021 年 6 月以来，大多数积极使用和有效的公开信任的证书都包含嵌入该扩展的透明度数据。此方法不应要求修改 Web 服务器。</li><li>握手过程中发送的 signed_certificate_timestamp 类型的 TLS 扩展。</li><li>OCSP 装订（即 status_request TLS 扩展），并提供具有一个或多个 SCT 的 SignedCertificateTimestampList。服务器将需要更新以发送所需的数据，优点是服务器运营商可以定制 CT 日志源，提供通过 TLS 扩展/装订 OCSP 响应发送的 SCT。</li></ol><p>Google Chrome 要求对 notBefore 日期晚于 2018 年 4 月 30 日签发的证书进行 CT 日志收录。用户将被阻止访问使用不符合规定的 TLS 证书的网站。此前，Chrome 浏览器要求对扩展验证（EV）和 Symantec 签发的证书进行 CT 收录。Apple 要求多种数目的 SCT，以使 Safari 和其他服务器信任服务器证书。Firefox 目前并不检查用户访问的网站或要求使用 CT 日志。</p><h4 id="签名" tabindex="-1">签名 <a class="header-anchor" href="#签名" aria-label="Permalink to &quot;签名&quot;">​</a></h4><p><strong>签名或数字签名</strong>是一种表明消息真实性的协议。数字签名依赖于非对称加密技术，也称为公钥加密技术。根据给定消息的哈希，签名过程首先使用实体的私钥生成链接到签名实体的数字签名。收到消息后，进行验证过程：</p><ol><li>验证发送者的身份 - 使用发送者的公钥来解密签名并恢复只能使用发送者的私钥创建的哈希值。</li><li>检查消息完整性 - 将哈希值与接收到的文档中新计算的哈希值进行比较（如果文档已被篡改，则两个哈希值将不同）。 如果私钥被泄露或接收者被欺骗性地提供了错误的公钥，系统就会失败。</li></ol><h4 id="数字证书" tabindex="-1">数字证书 <a class="header-anchor" href="#数字证书" aria-label="Permalink to &quot;数字证书&quot;">​</a></h4><p><strong>数字证书</strong>是将公开的加密密钥与组织绑定的数据文件。数字证书包含有关组织的信息，例如通用名称、组织单位和位置。数字证书通常由**证书颁发机构（CA）**签署，以证明其真实性。在给数字证书签名时，用到的哈希算法的强度对证书的安全性至关重要，弱的哈希算法可以使攻击者能够伪造证书。已知的弱签名算法：</p><ol><li>2012 年初移除对基于 MD5 的签名的支持。</li><li>2017 年开始主流浏览器不再认为 SHA-1 证书安全（应该使用那些采用更安全的哈希算法的证书，比如 SHA-256 或 SHA-512）。</li></ol><h3 id="http-2" tabindex="-1">HTTP 2 <a class="header-anchor" href="#http-2" aria-label="Permalink to &quot;HTTP 2&quot;">​</a></h3><p><strong>HTTP 2</strong> 是多路复用协议，基于HTTPS，首部执行 HPACK 压缩算法（采用“静态表（name） + 动态表（Huffman编码）”压缩，客户端与服务端维护首部信息表，相同字段发送索引号即可），报文（首部 + body）使用二进制（非文本），<strong>支持服务器主动推送</strong>、支持数据流的非顺序优先级请求和响应，<strong>缺陷</strong>：<strong>多路复用请求使用的是同一 TCP 连接，TCP 的丢包重传机制将导致出现 TCP 队头阻塞，也就导致所有HTTP请求阻塞</strong>。</p><h3 id="http-3" tabindex="-1">HTTP 3 <a class="header-anchor" href="#http-3" aria-label="Permalink to &quot;HTTP 3&quot;">​</a></h3><p><strong>HTTP3</strong> 使用 QUIC 代替 TCP 作为传输层协议。QUIC 支持可靠传输，通过在 UDP 上运行多个流并为每个流独立实现数据包丢失检测和重传。首部执行 QPack压缩算法。仅需要 TLS1.3 的 1-RTT 握手，减少连接建立交互次数。</p>',82);function E(L,A,_,f,q,y){const n=a("font");return l(),i("div",null,[S,t("ol",null,[u,C,t("li",null,[s(n,{color:"gray"},{default:T(()=>[e("102 Processing 正在处理。向客户端指示已收到完整请求并且服务器正在处理该请求。仅当服务器预计请求需要很长时间时才发送，它告诉客户端请求尚未终止。已弃用，不应再发送，客户可能仍接受它，但会忽略。")]),_:1})]),m]),H])}const x=r(b,[["render",E]]);export{U as __pageData,x as default};