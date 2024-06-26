# HTTP

超文本传输协议（HTTP）是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的客户端—服务端模型，客户端通过 TCP 或者是 TLS 打开一个连接以发出请求（request），然后等待直到收到服务器端响应（response）。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。

![](../public/basics/net-7.png)

**在客户端与服务端之间，还有许多的被称为代理的实体，履行不同的作用**：
1. 缓存（可以是公开的也可以是私有的，如浏览器的缓存）
2. 过滤（如反病毒扫描、家长控制...）
3. 负载均衡（让多个服务器服务不同的请求）
4. 认证（控制对不同资源的访问）
5. 日志（使得代理可以存储历史信息）

## HTTP 报文结构

由请求（响应）起始行 + 请求（响应）头部 + 空行（**区分头部与实体**） + 实体（body）构成。其中请求(响应)起始行分别为方法 + URI路径 + HTTP版本 （版本 + 状态码 + 原因Reason）:

![](../public/basics/net-8.png)

**空行之前不能存在空行的原因：多余的空行会导致空行后的内容全部被视为实体**。

**首部字段的格式特点**：字段名不区分大小写、不允许出现空格，不可以出现下划线 _、字段名后必须紧跟着冒号（:）

## HTTP 的特点（优缺点）

**HTTP 1.0 默认短连接**（一个请求对应一个TCP连接），**HTTP 1.1 默认长连接**（一个TCP连接可发多个请求，因此可**管道传输即当前请求响应前可继续发送下一请求**）：减少了重复建立和断开 TCP 连接所造成的额外开销，减轻了服务器端的负载，**减少整体的响应时间**。

```
HTTP 请求启动 KeepAlive (长连接)需要服务端来设置的，比如 Nginx 配置
http {
  # 客户端连接在服务端保持开启的超时值
  keepalive_timeout 120s;
  # 可以服务的请求的最大数量
  keepalive_requests 10000;
}
```

1. **简单易理解（优点）**：报文格式就是 `header + body`，头部信息也是 `key-value` 简单文本的形式。
2. **灵活易扩展（优点）**：语义自由（除基本格式外没严格语法限制），传输形式多样（文本、图片、视频等）、工作在应用层，下层可随意变化（HTTPS 增加 SSL/TLS 安全传输层，HTTP/3 甚至 TCP 替换成基于 UDP 的 QUIC）。
3. **明文传输**：报文(主要是头部)使用文本形式，调试便利（优点）， 但也暴露给攻击者（缺点）。
4. **无状态**：不需要保存连接上下文信息场景（优点），长连接的场景下（缺点）。
5. **HTTP 1.1存在队头阻塞**（缺点）：开启长连接，虽然可以不等响应发起新请求，但需要按顺序响应请求，前面的请求没响应之前会产生阻塞。
5. **不安全**（缺点）：不验证通信方的身份，无法证明报文的完整性、通信明文（不加密）。
6. （优点）**跨平台、应用广泛**，（缺点）**请求单向性、无优先级控制、按顺序响应、首部冗长未压缩**。

## HTTP 响应状态码

HTTP 响应状态码用来表明特定 HTTP 请求是否成功完成。响应被归为五大类：

### 1. 信息响应 (100–199)

表示目前是协议处理的中间状态，还需要后续操作。

1. **100 Continue**。表示目前为止一切正常，客户端应该继续请求，如果已完成请求则忽略。如果要让服务器检查请求头，客户端必须在初始请求中发送 Expect: 100-continue 作为标头，并发送带 body 的实际请求之前接收 100 Continue。
2. **101 Switching Protocols**。表示服务器同意升级协议，协议由客户端在 Upgrade 请求头中降序列举，由服务器在 Upgrade 响应头中确认。只能切换到更高级的协议，例如，HTTP 升级为 WebSocket。
3. `<font color="gray">`102 Processing 正在处理。向客户端指示已收到完整请求并且服务器正在处理该请求。仅当服务器预计请求需要很长时间时才发送，它告诉客户端请求尚未终止。已弃用，不应再发送，客户可能仍接受它，但会忽略。`</font>`
4. **103 Early Hints 早期提示**。由服务器仍在准备响应时发送，并提示客户端服务器期望最终响应将链接的资源。这允许浏览器甚至在服务器准备并发送最终响应之前就开始预加载资源。主要与指示要加载的资源的 Link 标头一起使用，也还可能包含处理早期提示时强制执行的 Content-Security-Policy 标头（比如，早期响应通过将 CSP 设置为”self”限制为与请求相同的源才预加载资源。虽然最终响应可能会将 CSP 设置为无，即资源已被预加载，但不会被使用）。服务器可能会在重定向后发送多个 103 响应。浏览器只处理第一个早期提示响应，如果请求导致跨源重定向，则必须丢弃该响应。来自早期提示的预加载资源会有效地预加载到文档的 head 元素中，然后才是最终响应中加载的资源。出于兼容性考虑（Chrome103+/Firefox102+且需要用户主动启用，Edge103+且支持范围限制在 HTTP/2 或更高版本），除非已知客户端能正确处理该响应，建议只通过 HTTP/2 或更高版本发送早期提示响应。

### 2. 成功响应 (200–299)

**表示成功状态**。

1. **200 OK**。表明请求已经成功。默认情况下状态码为 200 的响应可以被缓存。成功的含义取决于HTTP请求方法：
    1. GET: 资源已被获取并在消息体中传输。
    2. HEAD: 表示标头包含在响应中，没有任何消息正文（body）。
    3. POST: 资源已被获取并在消息体中传输。
    4. TRACE: 响应的消息体中包含服务器接收到的请求信息。
    5. PUT 和 DELETE 的请求成功通常并不是响应200 OK 而是204 No Content （或者201 Created）。
2. **201 Created**，表示请求已经被成功处理，并且创建了新的资源。新的资源在应答返回之前已经被创建。同时新增的资源会在应答消息体中返回，其地址或者是原始请求的路径，或者是 Location 首部的值。常规使用场景是作为 POST 请求的结果。
3. **202 Accepted**。表示请求已被接受处理，但处理尚未完成；事实上，处理可能还没有开始。该请求最终可能会或可能不会被执行，因为在实际处理时可能会拒绝该请求。它是非承诺性的，即 HTTP 无法在稍后发送异步响应，说明处理请求的结果。它适用于另一个进程或服务器处理请求或批处理的情况。
4. **203 Non-Authoritative Information 非授权信息**。表明请求已成功，但转换代理已根据源服务器的 200 (OK) 响应修改了随附的有效负载。它类似于 Warning 首部的 214（Transformation Applied）警告码，后者的优势在于可以应用于任何状态码的响应之中。
5. **204 No Content**。表示请求已成功，但客户端不需要离开其当前页面。默认情况下 204 响应是可缓存的（此类响应中包含 ETag 标头）。适用于PUT和DELETE 请求。例如，在 PUT 请求中进行资源更新，但是不需要改变当前展示给用户的页面，那么返回 204 No Content；如果创建了资源，则返回 201 Created；如果应将页面更改为新更新的页面，则应改用 200。虽然此状态代码旨在描述无body的响应，但服务器可能会错误地将数据包含在标头之后。该协议允许用户代理以不同方式处理此类响应，在持久连接中是可以观察到的，其中无效 body 可能包括对后续请求的不同响应。 Safari 拒绝任何此类数据。Chrome 和 Edge 在有效响应之前最多丢弃四个无效字节。Firefox 在有效响应之前可以容忍超过 1 KB 的无效数据。
6. **205 Reset Content**。告诉客户端重置文档视图，例如清除表单的内容、重置canvas状态或刷新 UI。如果此响应错误地包含持久连接上的body，不同浏览器的处理行为与204同。
7. **206 Partial Content 部分内容**。表示请求已成功，并且body中包含请求中Range首部指定的数据范围结果。如果只包含一个数据区间，那么整个响应的Content-Type首部的值为所请求的文件的类型，同时包含 Content-Range首部；如果包含多个数据区间，那么整个响应的 Content-Type首部的值为 multipart/byteranges，每个片段覆盖一个数据区间并用 Content-Range 和 Content-Type 进行描述。**使用场景为 HTTP 分块下载和断点续传**。
8. **207 Multi-Status 多状态**。响应体是带有多状态根元素的`文本/xml` 或应用程序 /xml HTTP 实体。XML body 将列出所有单独的响应代码。返回资源集合的能力是 WebDAV 协议的一部分（它可以由访问 WebDAV 服务器的 Web 应用程序接收）。访问网页的浏览器永远不会遇到此状态代码。
9. **208 Already Reported**。用于207响应中，以节省空间并避免冲突。如果以不同的路径多次请求同一资源（例如作为集合的一部分），则只有第一个资源会报告 200。所有其他绑定的响应将报告此 208 状态代码，因此不会产生冲突，并且响应保持较短。将资源绑定到多个路径的能力是 WebDAV 协议的扩展（它可以由访问 WebDAV 服务器的 Web 应用程序接收）。访问网页的浏览器永远不会遇到此状态代码。
10. **226 IM Used 已使用 IM**。在增量编码的上下文中由服务器设置以指示它正在返回其收到的GET请求的增量。浏览器不支持 HTTP 增量编码（delta encoding），此状态代码由特定客户端使用的自定义服务器发回。使用增量编码时，服务器会用相对于给定基础文档（而不是当前文档）的差异（称为deltas）来响应GET请求。客户端使用 HTTP 标头 A-IM 表示要使用哪种差异算法，并使用 If-None-Match 标头提示服务器它得到的最新版本。服务器会生成一个delta，并在包含 IM 标头（使用的算法名称）和 Delta-Base 标头（与 delta 相关联的基础文档的 ETag）的 226 响应中发送回来。

### 3. 重定向消息 (300–399)

**重定向状态，资源位置发生变动，需要重新请求**。

1. **300  Multiple Choices**。表示该请求有多个可能的响应。用户代理或用户应该选择其中之一，但由于没有如何选择的标准方法，因此该状态码很少使用。如果服务器有首选选择，它应该生成 Location 标头。
2. **301 Moved Permanently** 永久重定向。表示请求的资源已明确移动到 Location 标头给出的 URL。浏览器会重定向到新的 URL，搜索引擎也会更新其资源链接。虽然规范要求在执行重定向时method和body保持不变，但并非所有用户代理都符合。由于该状态明确禁止更改方法，请仅将 301 用作 GET 或 HEAD 方法的响应，而将 308 用于 POST 方法。比如，http永久重定向到https（会做缓存优化）。
3. **302 Found**，即临时重定向。表明请求的资源被暂时的移动到了由Location 指定的 URL 上，客户端应继续使用原有URI。不会做缓存优化，浏览器会重定向到这个 URL，但是搜索引擎不会对该资源的链接进行更新 (用 "搜索引擎优化术语 "来说，就是 "链接汁液 "不会被发送到新的 URL 上)。即使规范要求浏览器在重定向时保证请求method和请求body不变，但并不是所有的用户代理都会遵循。由于该状态明确禁止更改方法，所以推荐仅将 302 用作 GET 或 HEAD 方法的响应，而在其他时候使用307来替代。在确实需要将重定向请求的方法转换为 GET的场景下，可以使用 303，比如在使用 PUT 方法进行文件上传操作时，需要返回确认信息（例如“你已经成功上传了 xyz”）而不是上传的资源本身。
4. **303 See Other** 参阅其他。表示重定向不链接到所请求的资源本身，而是链接到另一个页面（例如确认页面，或上传进度页面）。它通常作为 PUT 或 POST 的结果发回。用于显示此重定向页面的方法始终是 GET。
5. **304 Not Modified** 未修改（缓存重定向）。表示无需重传所请求的资源。这是对缓存资源的隐式重定向，缓存控制中当协商缓存命中时（即客户端提供一个头信息指出客户端希望只返回在指定日期之后修改的资源）会返回。当请求方法是安全方法（例如 GET 或 HEAD）时，或者当请求是有条件的并使用 If-None-Match 或 If-Modified-Since 标头时会发生。响应不得包含body，并且必须包含在等效 200 OK 响应中发送的标头：Cache-Control、Content-Location、Date、ETag、Expires 和 Vary。许多开发工具的浏览器网络面板都会创建导致 304 响应的无关请求，因此开发人员可以看到对本地缓存的访问。(6)如果此响应错误地包含持久连接上的body，不同浏览器的处理行为与204同。
6. **307 Temporary Redirect** 临时重定向。表示请求的资源已暂时移动到 Location 标头给出的 URL。原始请求的method和body将被重新用于执行重定向请求。如果希望使用的方法改为 GET，请使用 303 代替。307和302唯一的区别是307保证重定向请求时方法和主体不会改变。对于 302，一些旧客户端错误地将方法更改为 GET：使用非 GET 方法和 302 的行为在 Web 上是不可预测的，而使用 307 的行为是可预测的。对于 GET 请求，它们的行为是相同的。
7. **308 Permanent Redirect** 永久重定向。表示请求的资源已明确移动到 Location 标头给出的 URL。浏览器重定向到此页面，搜索引擎更新其到该资源的链接。请求method和body不会改变，而 301 有时可能会错误地更改为 GET 方法。某些 Web 应用程序可能会以非标准方式或出于其他目的使用 308 Permanent Redirect。例如，Google Drive 使用 308 Resume Incomplete 响应来向客户端指示不完整的上传何时停止。 

### 4. 客户端错误响应 (400–499)

**请求报文有误**。

1. **400 Bad Request** 表示服务器因某些被认为是客户端错误的原因（例如，请求语法错误、无效请求消息格式或者欺骗性请求路由），而无法或不会处理该请求。警告： 客户端不应该在未进行修改的情况下重复发送此请求。
2. **401 Unauthorized**  未授权。表示客户端请求尚未完成，因为它缺少所请求资源的有效身份验证凭据。会与包含有如何进行验证的信息的WWW-Authenticate 首部一起发送。该状态码类似于 403 Forbidden，区别是依然可以进行身份验证。
3. **402 Payment Required** 需要付款。被创建最初目的是用于数字现金或微型支付系统，表明客户端请求的内容只有付费之后才能获取。目前还不存在标准的使用约定，不同的实体可以在不同的环境下使用。是一个非标准响应状态码，该状态码被保留但未定义，实际上没有浏览器支持它。
4. **403 Forbidden** 禁止。表示服务器理解该请求但拒绝授权。类似于 401，但进入 403状态后即使重新验证也不会改变该状态。该访问是长期禁止的，并且与应用逻辑密切相关（例如没有足够的权限访问该资源）。
5. **404 Not Found** 找不到。表示服务器无法找到请求的资源。指向 404 页面的链接通常被称为断链或死链。404 只表示资源丢失，而不表示是暂时还是永久丢失。如果资源被永久删除，请使用 410。可以显示自定义 404 页面，以便为用户提供更多帮助，并提供下一步操作的指导。例如，对于 Apache 服务器，可以在 .htaccess 文件中指定自定义 404 页面的路径（定制设计是好事，但要适度。可以使404 页面变得幽默且人性化，但不要让用户感到困惑。）
6. **405 Method Not Allowed** 方法不允许。表示服务器知道请求方法，但目标资源不支持此方法。服务器必须在 405 中生成一个Allow标头。该字段必须包含目标资源当前支持的方法列表。
7. **406 Not Acceptable** 不可接受的。表示服务器无法生成与请求中的主动内容协商标头（Accept、Accept-Encoding、Accept-Language）中定义的可接受值列表相匹配的响应，并且服务器不愿意提供默认表示。实际上，这个错误很少被使用。服务器不会使用此错误代码进行响应（这对于最终用户来说是神秘的且难以修复），而是忽略相关标头并向用户提供实际页面。如果服务器返回此状态码，则消息body应包含资源的可用表示形式的列表，允许用户在其中进行选择。
8. **407 Proxy Authentication Required** 需要代理授权。由于缺乏位于浏览器与可以访问所请求资源的服务器之间的代理服务器（proxy server ）要求的身份验证凭证，发送的请求尚未得到满足。会与包含有如何进行验证的信息的Proxy-Authenticate 首部一起发送。
9. **408 Request Timeout** 请求超时。表示服务器想要关闭这个未使用的连接。即使客户端之前没有任何请求，它也会由某些服务器在空闲连接上发送。服务器应该在响应中发送“close”Connection 标头字段，因为 408 意味着服务器已决定关闭连接而不是继续等待。由于某些浏览器（例如 Chrome、Firefox 27+ 和 IE9）使用 HTTP 预连接机制来加快网络速度，因此该响应的使用更加频繁。有些服务器只是关闭连接而不发送此消息。
10. **409 Conflict** 冲突。表示请求与目标资源的当前状态发生冲突。在响应 PUT 请求时最有可能发生冲突。例如，在上传比服务器上现有文件更旧的文件时，可能会收到 409，从而导致版本控制冲突。
11. **410 Gone** 消失。表示源服务器不再提供对目标资源的访问，并且这种情况可能是永久性的。如果不知道这种情况是暂时的还是永久的，则应使用 404。410 默认是可缓存的。
12. **411 Length Required** 表示服务器拒绝接受没有定义 Content-Length 标头的请求。根据规范，当使用分块模式传输数据时，Content-Length 头信息会被省略，需要在每个数据块的开头以十六进制格式添加当前数据块的长度。
13. **412 Precondition Failed** 前提条件失败。表示对目标资源的访问已被拒绝。当不满足 If-Unmodified-Since 或 If-None-Match 标头定义的条件时，除 GET 或 HEAD 之外的方法上的条件请求会发生这种情况，请求（通常是上传或修改资源）将无法执行，从而返回该错误状态码。
14. **413 Content Too Large** 内容过大。表示请求实体大于服务器定义的限制；服务器可能会关闭连接或返回 Retry-After 标头。在 RFC 9110 之前，状态的响应短语是 Payload Too Large，此名字至今仍被广泛使用。
15. **414 URI Too Long URI** 太长。表示客户端请求的 URI 比服务器愿意解释的长度长。客户端不恰当地将 POST 请求转换为带有较长查询信息的 GET 请求、客户端陷入重定向循环（例如，重定向 URI 前缀指向自身的后缀）、或当服务器受到试图利用潜在安全漏洞的客户端攻击时会出现此情况。
16. **415 Unsupported Media Type** 不支持的媒体类型。表示服务器拒绝接受请求，因为有效载荷格式是不支持的格式。格式问题的出现有可能源于客户端在 Content-Type 或 Content-Encoding 首部中指定的格式，也可能源于直接对负载数据进行检测的结果。
17. **416 Range Not Satisfiable** 范围不满足。表示服务器无法为请求的范围提供服务。最可能的原因是文档不包含此类范围，或者 Range 标头值虽然语法正确，但没有意义。416 响应报文包含一个 Content-Range 首部，提示无法满足的数据区间（用星号 * 表示），后面紧跟着一个“/”，再后面是当前资源的长度。例如：Content-Range: */12777。面对此错误，浏览器通常要么中止操作（例如，下载将被视为不可恢复），要么再次请求整个文档。
18. **417 Expectation Failed** 不满足期望。表示无法满足请求的 Expect 标头中给出的期望。
19. **418 I'm a teapot** 我是一个茶壶。表示服务器拒绝冲泡咖啡，因为它永远是茶壶。暂时没有咖啡壶/茶壶的组合应该返回 503。此错误引用了 1998 年和 2014 年愚人节笑话中定义的超文本咖啡壶控制协议。一些网站使用此响应来处理不希望处理的请求，例如自动查询。
20. **421 Misdirected Request** 表示请求被定向到无法生成响应的服务器。如果重用连接或选择替代服务时可能出现此情况。
(21)422 Unprocessable Content 表示服务器了解请求实体的内容类型，并且请求实体的语法正确，但无法处理所包含的指令。警告：客户端不应在未经修改的情况下重复此请求。
22. **423 Locked** 表示暂定目标的资源已被锁定，即无法访问。其内容应包含一些 WebDAV XML 格式的信息。锁定资源的功能特定于某些 WebDAV 服务器。浏览器访问网页永远不会遇到这个状态码；如果发生错误，它们会将其作为通用 400 状态码进行处理。
23. **424 Failed Dependency** 表示无法对资源执行该方法，因为请求的操作依赖于另一个操作，并且该操作失败。常规 Web 服务器通常不会返回此状态代码。但其他一些协议（例如 WebDAV）可以返回它。例如，在 WebDAV 中，如果发出 PROPPATCH 请求，并且一个命令失败，则所有其他命令也会自动失败，并显示 424 Failed Dependency。
24. **425 Too Early** 表示服务器不愿意冒险处理可能重播的请求，这会产生重播攻击的可能性。
25. **426 Upgrade required** 表示服务器拒绝使用当前协议执行请求，但在客户端升级到不同协议后可以接受。服务器会在响应中使用 Upgrade 首部来指定要求的协议。
26. **428 Precondition required** 表示服务器要求发送条件请求。通常，这意味着缺少必需的条件首部，例如 If-Match。而当一个条件首部的值不能匹配服务器端的状态的时，应答的状态码应该是 412 Precondition Failed，前置条件验证失败。
27. **429 Too Many Requests** 表示用户在给定时间内发送了太多请求（“速率限制”）。此响应中可能包含 Retry-After 标头，指示在发出新请求之前需要等待多长时间。
28. **431 Request Header Fields Too Large** 表示服务器拒绝处理该请求，因为请求的 HTTP 标头太长。减少请求标头的大小后可以重新提交请求。当请求头的总大小太大，或者单个头字段太大时，可以使用431。为帮助用户解决问题，应在响应body中指出这两个错误中的哪一个是问题所在且包括哪些标头太大。引用 URL 太长或请求中发送的 Cookie 太多时服务器通常会使用此状态码。
29. **451 Unavailable For Legal Reasons** 表示用户请求的资源由于法律原因不可用，例如已发出法律诉讼的网页。

### 5. 服务端错误响应 (500–599)

**服务器端发生错误**。
1. **500 Internal Server Error** 表示服务器遇到了意外情况，导致其无法完成请求。这个错误代码是一个通用的“万能”响应代码。有时候，对于类似于 500 这样的错误，服务器管理员会更加详细地记录相关的请求信息来防止以后同样错误的出现。
2. **501 Not Implemented** 表示服务器不支持完成请求所需的功能。此状态还可以发送 Retry-After 标头，告诉请求者何时检查以查看届时是否支持该功能。当服务器无法识别请求方法并且无法支持任何资源时，501 是恰当的响应。服务器唯一必须支持的方法是 GET 和 HEAD，因此不得返回 501。如果服务器确实能识别该方法，但故意不支持它，则适当的响应是 405 方法不允许。默认情况下，501 响应是可缓存的。501 错误需要所尝试访问的网络服务器来进行修复。
3. **502 Bad Gateway** 表示服务器在充当网关或代理时从上游服务器收到无效响应。网关可能指的是网络中的不同事物，502 错误通常无法修复，但需要 Web 服务器或尝试访问的代理进行修复。
4. **503 Service Unavailable** 表示服务器尚未准备好处理请求。常见原因是服务器因维护而停机或过载。此响应应用于临时情况，并且 Retry-After HTTP 标头应（如果可能）包含服务恢复的估计时间以及解释问题的用户友好页面。应注意随此响应一起发送的与缓存相关的标头，因为503 通常是一种临时状态，响应通常不应被缓存。
5. **504 Gateway Timeout** 表示服务器在充当网关或代理时，没有及时从上游服务器获得完成请求所需的响应。
6. **505 HTTP Version Not Supported** 表示服务器不支持请求中使用的 HTTP 版本。
7. **506 Variant Also Negotiates** 表示服务器内部配置错误，此时所选变体本身被配置为参与内容协商，因此不是一个合适的协商端点。可在透明内容协商（见 RFC 2295）中给出。在服务器支持多种变体的情况下，该协议使客户端能够检索给定资源的最佳变体。
8. **507 Insufficient Storage** 可以在 WebDAV 协议（基于 web 的分布式创作和版本控制，参见 RFC 4918）中给出。表示服务器不能存储相关内容。准确地说，一个方法可能没有被执行，因为服务器不能存储其表达形式，这里的表达形式指：方法所附带的数据，而且其请求必需已经发送成功。
9. **508 Loop Detected** 表示服务器终止了操作，因为在处理“Depth: infinity”的请求时遇到无限循环。此状态表明整个操作失败。可以在 WebDAV 协议（基于 Web 的分布式创作和版本控制）中给出。
10. **510 Not Extended** 在 HTTP 扩展框架协议（参见 RFC 2774）中发送。在 HTTP 扩展框架协议中，一个客户端可以发送一个包含扩展声明的请求，该声明描述了要使用的扩展。如果服务器接收到这样的请求，但是请求不支持任何所描述的扩展，那么服务器将使用 510 状态码进行响应。
11. **511 Network Authentication Required** 表示客户端需要通过验证才能使用该网络。该状态码不是由源头服务器生成的，而是由控制网络访问的拦截代理服务器生成的。网络运营商有时在授予访问权限之前需要进行一些身份验证、接受条款或其他用户交互（例如在网吧或机场）。他们经常使用媒体访问控制 (MAC，Media Access Control) 地址来识别尚未这样做的客户端。

## HTTP 请求方法

### 幂等、安全、可缓存

1. **幂等**：指的是同样的请求被执行一次与连续执行多次的效果是一样的，服务器的状态也是一样的。幂等方法不应该具有副作用（统计用途除外）。在正确实现的条件下， GET， HEAD、PUT、DELETE、OPTIONS和TRACE方法都是幂等的，而 POST、CONNECT和PATCH方法不是。所有的安全方法都是幂等的。幂等性只与后端服务器的实际状态有关，而每一次请求接收到的状态码不一定相同（例如，第一次调用 DELETE 方法有可能返回200 ，但是后续的请求由于已经删除可能会返回 404）。需要主义的是，服务器不一定会确保请求方法的幂等性，有些应用可能会错误地打破幂等性约束。
2. **安全**：指的是不会修改服务器数据，对服务器是只读操作。安不安全的定义是这个方法需不需要服务器修改数据。所有安全的方法都是幂等的，但并非所有幂等方法都是安全的，PUT、POST、CONNECT和DELETE方法不是安全的。建议任何应用都不应让 GET 请求修改服务端的状态（数据）。安全的方法并不意味着只是对服务端的静态文件的请求，服务端可以在请求的时候即时生成资源返回，只要生成资源的脚本保证是安全的即可。
3. **可缓存**：指的是可以缓存的 HTTP 响应，它被存储起来以便后续的检索和使用，省去了对服务器的新的请求。对一些不可缓存的请求/响应可能会使先前缓存的响应失效，比如PUT 将使所有对同一 URI 的 GET 或 HEAD 的缓存请求失效。并非所有的 HTTP 响应都可以被缓存，需同时满足条件：
    1. 请求中使用的方法本身就是可缓存的，即 GET 或 HEAD 方法。如果指示了有效期并且设置了 Content-Location 标头，POST 或 PATCH 请求的响应也可以被缓存，但是这很少被实现，比如Firefox 就不支持它。其他方法，如 PUT 或 DELETE 是不可缓存的，其结果也不能被缓存。
    2. 响应的状态码对应用程序的缓存可知，且被认为是可缓存的。可缓存状态码有：200、203、204、206、300、301、404、405、410、414 和 501。
    3. 响应中与缓存相关的特定标头，如 Cache-Control。

### CONNECT

**CONNECT 请求方法**可以开启与所请求资源之间的双向沟通的通道，它可以用来创建隧道（tunnel）。它是一个逐跳（hop-by-hop）的方法。**请求与响应均无 body、不安全、不幂等、不可缓存以及不允许在HTML表单中使用**。客户端要求 HTTP 代理服务器将 TCP 连接作为通往目的主机的隧道，代理服务器会面向客户端发送或接收 TCP 数据流。它可以用来访问采用了 SSL（HTTPS）协议的站点。

### DELETE

**DELETE 请求方法**用于删除指定的资源。**请求与响应均可能有 body、不安全、幂等、不可缓存以及不允许在 HTML 表单中使用**。方法成功执行可能响应状态码为200（操作已执行且响应消息包含描述状态的表示）、202（操作可能会成功但尚未实施）或204（操作已执行且无需提供进一步信息）。

### HEAD

**HEAD 请求方法**请求资源的标头信息，并且这些标头与 GET方法请求时返回的一致。**请求与响应均无 body、安全、幂等、可缓存以及不允许在HTML表单中使用**。一个使用场景是在下载大文件前先通过 HEAD 请求读取其 Content-Length 标头的值获取文件的大小，而无需实际下载文件，以此可以节约带宽资源。HEAD 方法的响应不应有body，如果有，则必须忽略：任何可能描述错误body的表示标头都被假定为描述类似 GET 请求将收到的响应。如果 HEAD 请求的响应表明缓存的URL响应已过期，那么即使没有发出 GET 请求，缓存副本也会失效。

### OPTIONS

**OPTIONS 请求方法**请求给定 URL 或服务器所允许的通信选项。客户端可以使用此方法指定 URL，或使用星号 (*) 来引用整个服务器。**请求无 body、响应有body、安全、幂等、不可缓存以及不允许在HTML表单中使用**。200 OK 和 204 No Content 都是允许的状态码。使用场景：1. 检测服务器所支持的请求方法；2. 发起CORS 中的预检请求以检测实际请求是否可以被服务器所接受。

### PATCH

**PATCH 请求方法**用于对资源进行部分修改，类似于CURD（创建：Create，读取：Read，更新：Update，删除：Delete）中的更新。与PUT 是一个资源的完整表述形成对比，PATCH 请求是一组关于如何修改资源的指令。**请求无 body，响应可能有 body、不安全、不幂等、不可缓存以及不允许在 HTML 表单中使用**。任何 2xx 状态码都代表成功的响应。服务器可以通过将其加入 Allow 或 Access-Control-Allow-Methods 响应标头中的列表来宣告其支持PATCH 方法或者 Accept-Patch 标头的存在。

### PUT

**PUT 请求方法**创建一个新的资源或用请求的有效载荷替换目标资源的表示。和post的区别在于PUT是幂等的。**请求有 body，响应可能有body、不安全、幂等、不可缓存以及不允许在 HTML 表单中使用**。如果目标资源没有当前的表示，并且 PUT 方法成功创建了资源，那么源服务器必须返回 201（Created）来通知用户代理资源已创建。如果目标资源已经存在，并且依照请求中封装的表现形式成功进行了更新，那么，源服务器必须返回 200（OK）或 204（No Content）来表示请求成功完成。

### TRACE

**TRACE 请求方法**沿着通往目标资源的路径进行信息回环（loop-back）测试，提供了一种实用的 debug 机制。**请求和响应均无body、安全、幂等、不可缓存以及不允许在 HTML 表单中使用**。请求的最终接收者（源服务器或第一个在请求中收到 Max-Forwards 值为 0 的服务器）应将收到的信息作为 200（OK）响应的信息body反映给客户端，其 Content-Type 为 message/http。

### GET

**GET 请求方法**请求指定资源的表示。使用 GET 的请求应该只用于请求数据，而不应该包含数据。**请求无 body，响应有 body、安全、幂等、可缓存以及允许在 HTML 表单中使用**。在 GET 请求中发送请求体或有效载荷可能会导致一些现有的实现拒绝该请求——虽然规范没有禁止，但语义没有定义，因此最好是避免在 GET 请求中发送有效载荷。

### POST

**POST 请求方法**发送数据给服务器。请求主体的类型由 Content-Type 标头指定。**请求和响应均有 body、不安全、不幂等、仅在包含足够新的信息时可缓存以及允许在HTML表单中使用**。POST 请求若是通过 HTML 表单发送，其内容类型（content type）是通过在 `<form>` 元素中设置正确的 enctype 属性，或是在 `<input>` 和 `<button>` 元素中设置 formenctype 属性来选择的；若是通过 AJAX（XMLHttpRequest 或 fetch）发送时，请求 body 可以是任何类型。据HTTP 1.1 规范所描述，POST 设计用途是：
1. 对现有资源进行注释；
2. 在公告板，新闻组，邮件列表或类似的文章组中发布消息；
3. 通过注册模板新增用户；
4. 向数据处理过程提供一批数据，例如提交一个表单；
5. 通过追加操作，扩展数据库数据。

### GET 与 POST 的区别

根据HTTP/1.1-RFC7231中的描述，不同的请求方法仅有语义上的差别（GET请求资源；POST提交资源），并无实质的不同，之所以造成开发上的区别，是因为在具体的实现环境——浏览器中，针对不同的请求方法设置了不同的协议实现方式（GET请求体为空，POST有请求体），从而造成了以下区别：
1. **安全角度**：如果说一个 HTTP 方法是安全的，是指这是个不会修改服务器的数据的方法。也就是说，这是一个对服务器只读操作的方法。因此POST 是不安全的，GET是安全的。
2. **缓存角度**：GET 请求会被浏览器主动缓存历史记录，POST 默认不会（如果指示新鲜度并且设置了 Content-Location 标头则可以）。GET请求的地址还可以被保存在浏览器书签，POST则不可以。
3. **编码角度**：GET只能进行URL 编码，只接收ASCII字符，POST无限制。因为GET数据是在请求行中，POST数据是在请求体中。
4. **参数角度**：GET一般放在 URL 中（不安全），POST 放在请求body中（适合传输敏感信息）。
5. **幂等性角度**：GET是幂等的（执行相同操作，结果不变），而POST不是。若当前页面是通过POST请求得到的，则浏览器会提示用户是否重新提交。GET请求得到的页面则没有提示。
6. **大小限制角度**：GET，POST本身均无限制，但前者依赖URL，不同的浏览器对于 URL 是有限制的，比如 IE 浏览器对于 URL 的限制为 2KB，而 Chrome，FireFox 浏览器理论上对于 URL 是没有限制的。
7. **TCP 角度**：GET将“header + data请求报文”一次发送，而 POST会发送两个 TCP 数据包，先发 header 部分，如果服务器响应100(continue)，然后再发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)。**优点体现：在网络环境好的情况下，发一次包和两次包的事件差别基本可无视。而网络环境差时，两次包的TCP在验证数据包完整性上优点很大**。

## HTTP 发展

![](../public/basics/net-40.png)

### HTTP 1

1989年，网络传输超文本系统 Mesh 被 Tim Berners-Lee 博士提出，1990 年更名为万维网（World Wide Web）。1991 年 8 月 16 日万维网公开发表。它在现有的 TCP 和 IP 协议基础之上建立，由四个部分组成：
1. 一个用来表示超文本文档的文本格式，超文本标记语言（HTML）。
2. 一个用来交换超文本文档的简单协议，超文本传输协议（HTTP）。
3. 一个显示（以及编辑）超文本文档的客户端，即首个网络浏览器 WorldWideWeb。
4. 一个服务器用于提供可访问的文档，即 httpd 的前身。

HTTP 的最初版本没有版本号，后来为了与后来的版本区分，被称为 0.9 即 HTTP/0.9，也叫做叫做单行（one-line）协议，请求由单行指令构成，以唯一可用方法 GET 开头，其后跟目标资源的路径（由于一旦连接到服务器就不需要协议、服务器和端口，因此不包括完整的 URL），以空格分隔，比如GET /mypage.html。响应只包含响应文档本身，并不包含 HTTP 头，只能传输HTML文件，没有状态码，出现错误则响应的是包含问题描述信息的 HTML 文件。

HTTP/1.0 是浏览器和服务器在HTTP/0.9增加扩展功能，但并未形成官方标准：
1. 协议版本信息随请求发送（GET行追加HTTP/1.0）
2. 状态码会在响应开始时发送，使浏览器能了解请求执行成功或失败，并相应调整行为（如更新或使用本地缓存）。
3. 引入了 HTTP 标头的概念，无论是对于请求还是响应，允许传输元数据，使协议变得非常灵活，更具扩展性。
4. 在新 HTTP 标头的帮助下，具备了传输除纯文本 HTML 文件以外其他类型文档的能力（凭借 Content-Type 标头）。

1997 年，HTTP/1.1 以 RFC 2068 文件发布：
1. 连接可以复用，节省了多次打开 TCP 连接加载网页文档资源的时间。
2. 增加管线化技术，允许在第一个应答被完全发送之前就发送第二个请求，以降低通信延迟。
3. 支持响应分块。
4. 引入额外的缓存控制机制。
5. 引入内容协商机制，包括语言、编码、类型等。并允许客户端和服务器之间约定以最合适的内容进行交换。
6. 凭借 Host 标头，能够使不同域名配置在同一个 IP 地址的服务器上。

### HTTPS

HTTPS 通过**信息加密**（通过 SSL/TLS 混合加密，而 HTTP 是明文传输无状态协议）、**CA 身份证书**（存放公钥，且通过证书进行身份认证）、**校验机制**（摘要算法）解决 HTTP 所存在的窃听、篡改、冒充风险。HTTPS 的端口号是 443（HTTP 是 80），比 HTTP 多 SSL/TLS 的握手过程。

![](../public/basics/net-37.png)

> **混合加密：非对称加密**（通信建立前非对称加密「会话秘钥」—**解决了密钥交换问题，但速度慢**） + **对称加密**（通信过程中使用「会话秘钥」对称加密明文数据—**运算速度快，但密钥交换不安全**）。

#### TLS

传输层安全 (TLS, Transport Layer Security) 协议是使两个联网应用程序或设备能够私密且可靠地交换信息的标准。使用TLS进行任何连接的安全性取决于密码套件和所选的安全性参数。Mozilla 操作安全 (OpSec) 团队为使用TLS的服务器维护的 [TLS 配置生成器](https://ssl-config.mozilla.org/)与[配置指南](https://wiki.mozilla.org/Security/Server_Side_TLS)。

HTTPS 是基于 Netscape 推出的安全套接字层 (SSL) 2.0 技术推出的，随后更新为 SSL 3.0。互联网工程任务组( IETF) 于 1999 年 1 月指定 TLS 1.0作为通用的标准加密技术来确保所有 Web 浏览器和服务器之间的互操作性，TLS的当前版本是 1.3。
TLS 提供三项主要服务：
1. 验证：身份验证让通信各方验证对方是否是声称的身份。
2. 加密：数据在用户代理和服务器之间传输时被加密，以防止未经授权的各方读取和解释。
3. 正直：TLS 确保在加密、传输和解密数据之间不会丢失、损坏、篡改或伪造信息。

TLS 握手协商的主要参数是密码套件。在 TLS 1.2 及更早版本中，协商密码套件包括一组加密算法，这些算法共同提供共享密钥的协商、对服务器进行身份验证的方式以及用于加密数据的方法。TLS 1.3 中的密码套件主要管理数据加密，单独的协商方法用于密钥协商和身份验证。为缓解变得缓慢或无响应的问题，现代浏览器实现了 TLS 握手超时（Firefox 58开始，默认值为 30 秒，可以通过编辑 about:config 中的network.http.tls-handshake-timeout首选项来改变超时值）。TLS 1.3的主要变化：
1. 大多数情况下，TLS 1.3 握手在一次往返中完成，从而减少了握手延迟。
2. 服务器可以启用 0-RTT（零往返时间）握手。重新连接到服务器的客户端可以立即发送请求，从而完全消除 TLS 握手的延迟。尽管 0-RTT 的性能提升可能非常显着，但它们会带来一定的重放攻击风险。
3. TLS 1.3 仅支持前向安全模式，除非连接已恢复或使用预共享密钥。
4. TLS 1.3 定义了 TLS 1.3 独有的一组新密码套件。这些密码套件均使用现代的关联数据验证加密 (AEAD) 算法。
5. TLS 1.3 握手是加密的，建立共享密钥所需的消息除外。服务器和客户端证书是加密的。但客户端发送到服务器的服务器身份（server_name 或 SNI 扩展）未加密。
6. 已被禁用：重新协商、通用数据压缩、数字签名算法(DSA) 证书、静态 RSA 密钥交换以及与自定义 Diffie-Hellman (DH) 组的密钥交换。

#### 传统 SSL\TLS 四次握手（RSA版本）

![](../public/basics/net-38.png)

1. 客户端发送“随机数 client_random + 支持加密算法”;
2. 服务器返回“随机数 server_random + 确定的加密算法（RSA） + CA证书 + 公钥（此时只有服务器具有公钥的的私钥）”;
3. 客户端验证证书通过后，生成随机数 pre_random，使用公钥对 pre_random 加密，发送给服务器。
4. 服务器用私钥解开 pre_random，最后将之前内容形成摘要返回给客户端。客户端收到回复，校验成功，握手结束。

之后的数据据传输使用约定的加密方法（RSA）对服务器和客户端都拥有的三个随机数生成的密钥 secret 进行加解密。

#### TLS 1.2 四次握手：

TLS 主流版本是1.2（TLS1.0 = SSL3.1，这之前的都被认为不安全）。TLS 1.2 四次握手如下：

![](../public/basics/net-39.png)

1. 客户端发送“随机数client_random + TLS版本 + 加密套件列表（比如TLS_ECDHE_WITH_AES_128_GCM_SHA256：ECDHE密钥交换算法，使用128位的AES算法和主流的GCM分组模式对称加密，数字签名采用SHA256哈希摘要算法）”;
2. 服务器发送“随机数server_random + 确认 TLS版本 + 选定的加密套件列表 + CA证书（公钥）+ 使用私钥对server_params、两个随机数进行签名”;
3. 客户端使用公钥验证服务器身份通过后，获得server_params，使用其中的椭圆曲线算法、服务器临时公钥和客户端自己生成的临时私钥相乘计算出预主密钥随机数(premaster secret)，最后伪随机函数传入Client Random、Server Random、Premaster Secret 生成会话密钥，发送 client_params（包括客户端生成的椭圆曲线公钥）、切换加密模式、会话密码加密后的验证会话密码消息给服务器。
4. 服务器拿到 client_params，利用相同的方法计算出会话密钥，同样，将切换加密模式、会话密码加密后的验证会话密码消息发送给客户端验证。校验成功则握手结束。

TLS 1.3 不必等验证服务器身份而是一开始就将 client_params 发送给服务器。

#### 证书颁发机构 (CA)

**证书颁发机构 （CA）**是签署数字证书及其关联公钥的组织，从而断言所包含的信息和密钥是正确的。对于网站数字证书，此信息至少包括请求数字证书的组织名称、其所属网站以及证书颁发机构。证书颁发机构是互联网公钥基础设施的一部分，允许浏览器验证网站身份并通过 SSL（和 HTTPS）安全连接。Web浏览器预装了一个“根证书”列表。浏览器可以使用这些来可靠地检查网站证书是否由“链回”到根证书的证书颁发机构签署(即受根证书所有者或中间CA的信任)。最终，这个过程依赖于每个CA在签署证书之前执行充分的身份检查!

####  证书透明度（CT）

**证书透明度（Certificate Transparency，CT）**是一个开放的框架，旨在监测和防止证书的误发。有了证书透明度机制，新颁发的证书会被“记录”到公开运行的、通常是独立的 CT 日志中——这些日志保持着仅允许添加、有密码学保证的已颁发 TLS 证书记录。当证书被提交到 CT 日志时，一个证书签署时间戳（SCT）被生成并返回。这可作为证书已提交的证明，并将被添加到日志中。该规范指出，符合要求的服务器必须在 TLS 客户端连接时向其提供一些这样的 SCT，实现方式有：
1. X.509v3 证书扩展，直接将签名的证书时间戳嵌入叶节点证书中。通过 X.509 证书扩展，所包含的 SCT 由签发的 CA 决定。自 2021 年 6 月以来，大多数积极使用和有效的公开信任的证书都包含嵌入该扩展的透明度数据。此方法不应要求修改 Web 服务器。
2. 握手过程中发送的 signed_certificate_timestamp 类型的 TLS 扩展。
3. OCSP 装订（即 status_request TLS 扩展），并提供具有一个或多个 SCT 的 SignedCertificateTimestampList。服务器将需要更新以发送所需的数据，优点是服务器运营商可以定制 CT 日志源，提供通过 TLS 扩展/装订 OCSP 响应发送的 SCT。

Google Chrome 要求对 notBefore 日期晚于 2018 年 4 月 30 日签发的证书进行 CT 日志收录。用户将被阻止访问使用不符合规定的 TLS 证书的网站。此前，Chrome 浏览器要求对扩展验证（EV）和 Symantec 签发的证书进行 CT 收录。Apple 要求多种数目的 SCT，以使 Safari 和其他服务器信任服务器证书。Firefox 目前并不检查用户访问的网站或要求使用 CT 日志。

#### 签名

**签名或数字签名**是一种表明消息真实性的协议。数字签名依赖于非对称加密技术，也称为公钥加密技术。根据给定消息的哈希，签名过程首先使用实体的私钥生成链接到签名实体的数字签名。收到消息后，进行验证过程：
1. 验证发送者的身份 - 使用发送者的公钥来解密签名并恢复只能使用发送者的私钥创建的哈希值。
2. 检查消息完整性 - 将哈希值与接收到的文档中新计算的哈希值进行比较（如果文档已被篡改，则两个哈希值将不同）。
如果私钥被泄露或接收者被欺骗性地提供了错误的公钥，系统就会失败。

#### 数字证书

**数字证书**是将公开的加密密钥与组织绑定的数据文件。数字证书包含有关组织的信息，例如通用名称、组织单位和位置。数字证书通常由**证书颁发机构（CA）**签署，以证明其真实性。在给数字证书签名时，用到的哈希算法的强度对证书的安全性至关重要，弱的哈希算法可以使攻击者能够伪造证书。已知的弱签名算法：
1. 2012 年初移除对基于 MD5 的签名的支持。
2. 2017 年开始主流浏览器不再认为 SHA-1 证书安全（应该使用那些采用更安全的哈希算法的证书，比如 SHA-256 或 SHA-512）。

### HTTP 2

**HTTP 2** 是多路复用协议，基于HTTPS，首部执行 HPACK 压缩算法（采用“静态表（name） + 动态表（Huffman编码）”压缩，客户端与服务端维护首部信息表，相同字段发送索引号即可），报文（首部 + body）使用二进制（非文本），**支持服务器主动推送**、支持数据流的非顺序优先级请求和响应，**缺陷**：**多路复用请求使用的是同一 TCP 连接，TCP 的丢包重传机制将导致出现 TCP 队头阻塞，也就导致所有HTTP请求阻塞**。

### HTTP 3

**HTTP3** 使用 QUIC 代替 TCP 作为传输层协议。QUIC 支持可靠传输，通过在 UDP 上运行多个流并为每个流独立实现数据包丢失检测和重传。首部执行 QPack压缩算法。仅需要 TLS1.3 的 1-RTT 握手，减少连接建立交互次数。

## HTTP 标头

**HTTP 标头**是用于 HTTP 请求或响应的字段，它传递关于请求或者响应的额外上下文和元数据。HTTP 标头由它的名称（不区分大小写）后跟随一个冒号（:），冒号后跟随它具体的值。该值之前的空格 (en-US)会被忽略。

**通用标头**是过时的术语，其用于指代同时适用于请求和响应的消息，而不适用于内容本身（适用于内容的标头称为实体标头）的 HTTP 标头。取决于应用的上下文环境，通用标头可以是响应标头或者请求标头。当前的 HTTP/1.1 规范没有明确将标头归类为 "通用标头"。现在，根据上下文的不同，这些标头被简单地称为响应标头或请求标头。

**实体标头（Entity header）**是描述 HTTP 报文有效载荷的 HTTP 标头。实体标头包括Content-Length, Content-Language, Content-Encoding, Content-Type, Expires等。实体标头可以出现在 HTTP 请求和响应报文中。当前的 HTTP/1.1 规范不再涉及实体、实体标头或实体主体，某些字段现在称为表示标头字段。

**请求标头（request header）**可在 HTTP 请求中使用，其提供有关请求上下文的信息，以便服务器可以定制响应。根据规范，并非所有可以出现在请求中的标头都称为请求标头。例如，Content-Type 标头被称为表示标头。

**响应标头（response header）**可以用于 HTTP 响应，且与响应消息主体无关。根据规范，并非所有可以出现在请求中的标头都称为响应标头。例如，Content-Type 标头被称为表示标头。

**表示标头（representation header）**是用于描述 HTTP 消息body中发送资源的特定的表示形式的HTTP标头，包括：Content-Type、Content-Encoding、Content-Language 和 Content-Location。**所谓表示（representation）就是特定的资源不同的表示形式**。客户端指定它们希望在内容协商期间发送的格式（使用 Accept-* 标头），并且表示标头将实际收到的选定的表示形式传达给客户端。它们可能同时出现在 HTTP 请求和响应消息中，如果它们是作为 HEAD 请求的响应发送的，则描述了在实际请求资源时会选择的body内容。

**CORS 安全列表请求标头（CORS-safelisted request header，旧称是简单标头（Simple header））**，包括Accept、Accept-Language、Content-Language、Content-Type。可以使用Access-Control-Allow-Headers 将其他标头添加到安全列表中，并在其中列出上述标头，以规避以下额外限制：
1. 对于 Accept-Language 和 Content-Language：只能包含 0-9、A-Z、a-z、空格或 *,-;=。
2. 对于 Accept 和 Content-Type：不能包含 CORS 不安全请求头字节：0x00-0x1F（0x09 (HT) 允许除外）、"():<>?@[\]{} 和 0x7F (DEL)。
3. 对于Content-Type：其解析值 MIME 类型（忽略参数）必须是 application/x-www-form-urlencoded、multipart/form-data 或 text/plain。
4. 对于任何标头：值的长度不能大于 128。

**CORS 安全列表请求标头（CORS-safelisted response header，又称为简单响应标头（Simple response header））**，包括Cache-Control、Content-Language、Content-Length、Content-Type、Expires、Last-Modified、Pragma。可以使用Access-Control-Expose-Headers 将其他标头添加到安全列表中。这些标头被认为可以安全地向客户端脚本公开。

**有效负荷标头（payload header）**从一个或多个消息中描述与安全传输和原始资源表示形式（representation）重建的相关的有效负荷信息。有效负荷标头包括Content-Length、Content-Range、Trailer 和 Transfer-Encoding。有效负荷标头可能存在于 HTTP 请求和响应消息中（即在任何携带有效载荷数据的消息中）。

**禁止修改的标头（Forbidden header name）**指的是不能在代码中通过编程的方式进行修改的 HTTP 请求标头。禁止修改的标头包括以 Proxy- 和 Sec- 开头的标头和Accept-Charset、Accept-Encoding、Access-Control-Request-Headers、Access-Control-Request-Method、Connection、Content-Length、Cookie、Date、DNT、Expect、Permissions-Policy、Host、Keep-Alive、Origin、Referer、TE、Trailer、Transfer-Encoding、Upgrade、Via。因为用户代理保留对此类标头的完全控制权，所以它们被禁止修改。

**禁止修改的响应标头（Forbidden response header name）**指的是不能在代码中通过编程的方式进行修改的 HTTP 响应标头。包括set-Cookie、Set-Cookie2。

**Fetch 元数据请求标头（Fetch metadata request header）**其提供有关来自请求上下文的额外信息。Fetch 元数据请求标头包括Sec-Fetch-Site、Sec-Fetch-Mode、Sec-Fetch-User、Sec-Fetch-Dest。Sec-开头，因此属于禁止修改的标头，不能通过 JavaScript 进行修改。这允许服务器根据请求的来源和将要使用的方式，决定是否允许该请求。服务器借此可以实现资源隔离策略，允许额外的站点仅请求用于共享的资源并且适当的使用资源。可以帮助缓解常见的跨站点网络漏洞，例如 CSRF、跨站点脚本攻击（“XSSI”）、定时攻击和跨源消息攻击。

**标头可以根据代理服务器处理它们的方式进行分组**：
1. **端到端（End-to-end）标头**：必须被传输到最终的消息接收者（请求的服务器或者响应的客户端）。中间的代理必须重新转发这些未经修改的标头，并且必须缓存它们。
2. **逐跳（Hop-by-hop）标头**：仅对单次传输连接有意义，并且不得由代理重传或者缓存。注意，只能使用 Connection 标头来设置逐跳标头。标准的逐跳标头包括Keep-Alive, Transfer-Encoding,TE,Connection,Trailer,Upgrade,Proxy-Authorization和Proxy-Authenticate。

**质量价值（Quality values）亦称作 q 值**，其与 q 因子以逗号分隔的方式来描述值的优先级顺序，是 HTTP 消息头以及 HTML 中的特殊语法。值的重要性以一种后缀表示：';q='。该后缀紧接0到1间的数(可达小数点后三位)，值越大优先级越高。无此后缀时，默认为1。q 相同时，前面的值越具体，其优先级越高。

### HTTP 控制相关标头（Control）

**Max-Forwards 请求标头**（`Max-Forwards: <integer>`）被用于限制 TRACE 方法可经过的服务器（通常指代理服务器）数目。它的值是一个整数，指定可经过的服务器最大数目。服务器在转发 TRACE 请求之前，将递减 Max-Forwards 的值，直到到达目标服务器，或服务器接收到 Max-Forwards 的值为 0 的请求。而后直接返回一个 200 OK 的响应（可以包含一些标头）。如果 TRACE 请求中没有 Max-Forwards 标头，就可以认为，不限制可经过的服务器最大数目。

**Expect 请求标头**包含一个期望条件，表示服务器只有在满足此期望条件的情况下才能妥善地处理请求。规范中只规定了一个期望条件，即Expect: 100-continue，表示通知接收方客户端要发送一个体积可能很大的消息体，期望收到状态码为100 (Continue) 的临时回复。服务器可做出的响应：
1. 100-continue：如果消息头中的期望条件可以得到满足，使得请求可以顺利进行的话，
2. 417 Expectation Failed：如果服务器不能满足期望条件的话；也可以是其他任意表示客户端错误的状态码（4xx）。

### HTTP 下载相关标头（Downloads）

**Content-Disposition 通用标头**在常规的 HTTP 应答中，指示回复的消息体该以何种形式展示，是以内联的形式（即第一个参数为inline，网页或者页面的一部分），还是以附件的形式下载并保存到本地（即第一个参数为attachment，大多数浏览器会呈现一个“保存为”的对话框，将指令 filename 的值预填为下载后的文件名）。在同源 URL情况下，Chrome 和 Firefox 82 以及更高的版本会优先使用 HTML 的 `<a>` 元素的 download 属性而不是 Content-Disposition: inline 参数来处理下载。而 Firefox 的早期版本则优先使用标头信息并内联显示内容。当使用 multipart/form-data 格式提交表单数据时，每个子部分（例如每个表单字段和任何与字段数据相关的文件）都需要提供一个 Content-Disposition 标头，以提供相关信息。标头的第一个指令始终为 form-data，并且还必须包含一个 name 参数来标识相关字段。额外的指令不区分大小写，并使用带引号的字符串语法在 = 号后面指定参数。多个参数之间使用分号（;）分隔。指令filename 和 `filename*` 同时出现时，应优先采用 `filename*`。

### HTTP 代理相关标头（Proxies）

**Forwarded 请求标头**（`Forwarded: by=<identifier>; for=<identifier>; host=<host>; proto=<http|https>`）包含反向代理服务器（负载均衡器、CDN 等）可能添加的信息，这些信息在代理服务器参与请求路径时会被更改或丢失。例如，如果客户端通过 HTTP 代理（或负载均衡器）连接到网络服务器，服务器日志将只包含代理的 IP 地址、主机地址和协议；该标头可用于识别原始请求的 IP 地址、主机和协议。该标头是可选的，可由服务器路径上的任何代理服务器添加、修改或删除。该标头用于调试、统计和生成与位置相关的内容。在设计上，它暴露了对隐私敏感的信息，如客户端的 IP 地址。因此，在部署此标头时必须注意用户的隐私。其他可用来替代的，既成标准的标头是 X-Forwarded-For 、 X-Forwarded-Host 以及X-Forwarded-Proto 。参与的指令可能有：
1. `by=<identifier>`：该请求进入到代理服务器的接口。`<identifier>` 显示了在使用代理的过程中被修改或者丢失的信息。它们可以是以下几种形式：
    1. 一个 IP 地址（V4 或 V6，端口号可选，ipv6 地址需要包含在方括号里面，同时用引号括起来），
    2. 语意不明的标识符（比如 "_hidden" 或者 "_secret"）,
    3. 或者是 "unknown"，当当前信息实体不可知的时候（但是依然想要说明请求被进行了转发）。
2. `for=<identifier>`：发起请求的客户端以及代理链中的一系列的代理服务器。多值可用逗号分隔
3. `host=<host>`：代理接收到的 Host 首部的信息。
4. `proto=<http|https>`：表示发起请求时采用的何种协议（通常是 "http" 或者 "https"）。

**Via 通用标头**（`Via: [ <protocol-name>"/"]<protocol-version> <host> [ ":" <port> ]或Via: [ <protocol-name> "/" ] <protocol-version> <pseudonym>`）是由代理服务器添加的，适用于正向和反向代理，可以用来追踪消息转发情况，防止循环请求，以及识别在请求或响应传递链中消息发送者对于协议的支持能力。每个值可能由以下几部分组成（多个值使用逗号分隔）：
1. `<protocol-name>`是可选的，表示所使用的协议名称；
2. `<protocol-version>`是所使用的协议版本号；
3. `<host>`和`<port>`是公共代理的 URL 及端口号；
4. `<pseudonym>`是内部代理的名称或别名。

### HTTP 请求上下文相关标头（Request context）

**From 请求标头**（`From: <email>`）中包含一个属于发送请求的用户代理的实际掌控者的人类用户的电子邮箱地址。在运行一个机器人代理程序（比如爬虫）时应该包含Form 首部，在服务器遇到问题的时候（比如，机器人代理发送了过量的、不希望收到的或者不合法的请求），站点管理员可以联系到。注意，不可以将 From 首部用于访问控制或者身份验证。

**Host 请求标头**（`Host: <host>:<port>` 其中 `<host>` 是服务器的域名（用于虚拟主机）；`<port>` 可选，是服务器监听的 TCP 端口号）指明了请求将要发送到的服务器主机名和端口号。如果没有包含端口号，会自动使用被请求服务的默认端口（比如 HTTPS 使用 443 端口，HTTP 使用 80 端口）。所有 HTTP/1.1 请求报文中必须包含一个Host头字段。对于缺少Host头或者含有超过一个Host头的 HTTP/1.1 请求，可能会收到400（Bad Request）状态码。

**Referer 请求标头**（`Referer: <url>` 其中 `<url>` 是当前页面被链接而至的前一页面的绝对路径或者相对路径，不包含fragments 和 user information，可能包含来源、路径和查询字符串（取决于Referrer-policy标头））包含了当前请求的来源页面的地址。当点击链接时，Referer是链接所在页面的地址。当向另一个域发出资源请求时，Referer 是使用所请求资源的页面地址。需要注意的是 referer 实际上是 "referrer" 误拼写。服务端使用 Referer 请求头识别访问来源，这些数据可用于分析、日志记录、优化缓存等，Referer 请求头可能暴露用户的浏览历史，涉及到用户的隐私问题。如果来源页面采用的协议为表示本地文件的 "file" 和"data" URI或者当前请求页面采用的是非安全协议而来源页面采用的是安全协议（HTTPS），则不会发送Referer。

**Referrer-Policy响应标头**控制请求中应包含哪些访问来源信息（通过 Referer 标头发送）。可取的取值有：
1. no-referrer：整个 Referer 首部会被移除。访问来源信息不随着请求一起发送。
2. no-referrer-when-downgrade：默认值，在同等安全级别的情况下，引用页面的地址会被发送 (`HTTPS->HTTPS`)，但是在降级的情况下不会被发送 (`HTTPS->HTTP`)。
3. origin：在任何情况下，仅发送文件的源作为引用地址。例如 https://example.com/page.html 会将 https://example.com/ 作为引用地址。
4. origin-when-cross-origin：对于同源的请求，会发送完整的 URL 作为引用地址，但是对于非同源请求仅发送文件的源。
5. same-origin：对于同源的请求会发送引用地址，但是对于非同源请求则不发送引用地址信息。
6. strict-origin：在同等安全级别的情况下，发送文件的源作为引用地址 (HTTPS->HTTPS)，但是在降级的情况下不会发送 (HTTPS->HTTP)。
7. strict-origin-when-cross-origin：对于同源的请求，会发送完整的 URL 作为引用地址；在同等安全级别的情况下，发送文件的源作为引用地址 (HTTPS->HTTPS)；在降级的情况下不发送此首部 (HTTPS->HTTP)。
8. unsafe-url：无论是同源请求还是非同源请求，都发送完整的 URL（移除参数信息之后）作为引用地址。

除了 HTTP 标头，还可以用一个 name 为 referrer 的 `<meta>` 元素为整个文档设置 referrer 策略。或者用 `<a>`、`<area>`、`<img>`、`<iframe>`、`<script>` 或者 `<link>` 元素上的 referrerpolicy 属性为其设置独立的请求策略。也可以在 `<a>`、`<area>` 或者 `<link>` 元素上将 rel 属性设置为 noreferrer。外部 CSS 样式表使用默认策略 (no-referrer-when-downgrade)，除非 CSS 样式表的响应消息通过 Referrer-Policy 首部覆盖该策略。对于 `<style>` 元素或 style 属性，则遵从文档的 referrer 策略。如果要为那些策略未获广泛的浏览器指定后备策略，使用逗号分隔的列表，并将希望使用的策略放在最后。

**User-Agent 请求标头**（`User-Agent: <product> / <product-version> <comment>或User-Agent: Mozilla/<version> (<system-information>) <platform> (<platform-details>) <extensions>`）包含了一个特征字符串，用来让网络协议的对端来识别发起请求的用户代理软件的应用类型、操作系统、软件开发商以及版本号。
1. Firefox 的用户代理字符串自身可以分为四部分，即Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion：Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0。
    1. Mozilla/5.0 是一个通用标记符号，用来表示与 Mozilla 兼容，这几乎是现代浏览器的标配。
    2. platform 用来说明浏览器所运行的原生系统平台（例如 Windows、Mac、Linux 或 Android），以及是否运行在手机上。搭载 Firefox OS 的手机仅简单地使用了 "Mobile" 这个字符串；因为 web 本身就是平台。注意 platform 可能会包含多个使用 "; " 隔开的标记符号。
    3. rv:geckoversion 表示 Gecko 的发布版本号（例如 "17.0"）。在近期发布的版本中，geckoversion 表示的值与 firefoxversion 相同。
    4. Gecko/geckotrail 表示该浏览器基于 Gecko 渲染引擎。在桌面浏览器中，geckotrail 是固定的字符串 "20100101" 。
(5)Firefox/firefoxversion 表示该浏览器是 Firefox，并且提供了版本号信息（例如 "17.0"）。
2. Chrome（或 Chromium/blink-based engines）用户代理字符串与 Firefox 的格式类似。为了兼容性，它添加了 "KHTML, like Gecko" 和 "Safari"：Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
3. Opera 也是一款基于 blink 引擎的浏览器，它的 UA 和 Chrome 的几乎一样，不过，它添加了一个 `"OPR/<version>"：Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41`。
4. Safari的用户代理字符串：Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1。
5. IE的用户代理字符串：Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)。
6. 爬虫和机器人的 UA 字符串：Googlebot/2.1 (+http://www.google.com/bot.html)。

### HTTP 响应上下文相关标头（Response context）

**Allow 响应标头**（`Allow: <http-methods>` 以逗号分隔的允许的HTTP 请求方法列表）用于枚举资源所支持的 HTTP 方法的集合。若服务器响应状态码 405 Method Not Allowed，则响应必须带上此首部。如果 Allow 首部字段的值为空，说明资源不接受使用任何 HTTP 方法的请求，这是可能的，比如服务器需要临时禁止对资源的任何访问。

**Server 响应标头**（`Server: <product>` 处理请求的软件或者产品（或组件产品）的名称）包含了处理请求的源头服务器所用到的软件相关信息。应该避免使用过长或者过于详细的描述作为 Server 的值，因为这有可能泄露服务器的内部实现细节，有利于攻击者找到或者探测已知的安全漏洞。

### HTTP Fetch元数据请求相关标头

**Sec-Fetch-Site Fetch元数据请求标头**表明请求发起者的源与目标资源的源之间的关系。可能的取值有：
1. cross-site：请求发起者和托管资源的服务器是不同的站点。
2. same-origin：请求发起者和托管资源的服务器具有相同的源（相同的方案、主机和端口）。
3. same-site：请求发起者和托管资源的服务器具有相同的方案、域或子域，但不一定具有相同的端口。
4. none：该请求是用户发起的操作，与与任意上下文（站点、源，或者框架）无关。例如：在地址栏中输入 URL、打开书签或将文件拖放到浏览器窗口中。

**Sec-Fetch-Mode Fetch元数据标头**表明请求的模式。可能的取值有：
1.cors：CORS 协议请求。
2.navigate：请求是由 HTML 文档之间的导航启动。
3.no-cors： no-cors 请求。
4.same-origin：请求与被请求资源的源相同.
5.websocket：请求是为了建立 WebSocket 连接。

**Sec-Fetch-User Fetch元数据标头**（Sec-Fetch-User: ?1）表明导航请求是否由用户激活触发。其值始终为 ?1。当请求是由用户激活以外的其他原因触发时，规范要求浏览器完全省略该标头。

**Sec-Fetch-Dest Fetch元数据请求标头**指示请求的目标即数据的来源以及如何使用这些获取到的数据。这允许服务器根据请求是否采用了适当的使用方式来确定是否为请求提供服务。可能的取值有：
1. audio：目标是音频数据。这可能源自 HTML `<audio>` 标签。
2. audioworklet：目标是获取供 audio worklet 使用的数据。这可能源于对 audioWorklet.addModule()的调用。
3. document：目标是文档（HTML 或 XML），请求是用户发起的顶级导航的结果（例如，由用户单击链接产生）。
4. embed：目标是嵌入内容。这可能源自 HTML `<embed>` 标签。
5. empty：目标是空字符串。这用于没有自己值的目标。例如：fetch()、navigator.sendBeacon()、EventSource、XMLHttpRequest、WebSocket 等等。
6. font：目标是字体。这可能源自 CSS @font-face。
7. frame：目标是 frame。这可能源自 HTML `<frame>` 标签。
8. iframe：目标是 iframe。这可能源自 HTML `<iframe>` 标签。
9. image：目标是图片。这可能源自 HTML `<image>`、SVG `<image>`、CSS background-image、CSS cursor、CSS list-style-image 等等。
10. manifest：目标是 mainfest。这可能源自 HTML `<link rel=manifest>` 。
11. object：目标是对象，这可能源自 `<object>` 标签。
12. paintworklet：目标是 paint worklet。这可能源自对 CSS.PaintWorklet.addModule() 的调用。
13. report：目标是报告（如一份内容安全策略报告）。
14. script：目标是脚本。这可能源自HTML `<script>` 标签或对 WorkerGlobalScope.importScripts() 的调用。
15. serviceworker：目标service worker。这可能源于对 navigator.serviceWorker.register() 的调用。
16. sharedworker：目标是 shared worker。这可能源自 SharedWorker。
17. style：目标是 style。这可能源自 HTML `<link rel=stylesheet>` 或者 CSS @import。
18. track：目标是 HTML text track。这可能源自 HTML `<track>` 标签。
19. video：目标是视频数据。这可能源自于 `<video>` 标签。
20. worker：目标是 Worker。
21. xslt：目标是 XSLT 转换。

**Service-Worker-Navigation-Preload 请求标头**（`Service-Worker-Navigation-Preload: <value>`）指示该请求是 Service Worker 导航预加载期间进行的 fetch() 操作的结果。它允许服务器使用与正常 fetch() 不同的资源进行响应。通过 NavigationPreloadManager.setHeaderValue() 设置。`<value>` 是任意值，指示在响应预加载请求时应发送哪些数据，默认为 true。

### HTTP WebSocket相关标头

**Sec-WebSocket-Accept 响应标头**（`Sec-WebSocket-Accept: <hashed key>` 服务器获取握手请求中发送的 Sec-WebSocket-Key 值，添加 258EAFA5-E914-47DA-95CA-C5AB0DC85B11，获取新值的 SHA-1，然后进行 base64 编码）用在 websocket 开放握手中，表明服务器愿发起一个 websocket 连接。

**Sec-WebSocket-Extensions请求标头**（`Sec-WebSocket-Extensions: <extensionlist>`）用于指定一个或多个请求服务器使用的协议级 WebSocket 扩展。允许在一个请求中使用多个 Sec-WebSocket-Extension 标头或在一个标头中列出多个扩展（逗号分隔）。

**Sec-WebSocket-Key请求标头**（Sec-WebSocket-Key: key）向服务器提供确认客户端有权请求升级到 WebSocket 的所需信息即密钥key。当不安全（HTTP）客户端希望升级时，可以使用该标头，以提供一定程度防止滥用的保护。密钥的值是使用 WebSocket 规范中定义的算法计算的，因此不提供安全性。相反，它有助于防止非 WebSocket 客户端无意或滥用请求 WebSocket 连接。那么，从本质上讲，这个密钥是为了确认“是的，我真的是要打开一个 WebSocket 连接。”该标头由选择使用它的客户端自动添加；它不能使用 XMLHttpRequest.setRequestHeader() 方法添加。

**Sec-WebSocket-Protocol标头**（Sec-WebSocket-Protocol: subprotocols）按优先顺序指定希望用的一个或者多个 WebSocket 协议。将服务器支持的第一个 WebSocket 协议，由服务器在响应中包含的 Sec-WebSocket-Protocol 标头中选择并返回它。可以在标头中多次使用它；结果与在单个标头中使用逗号分隔的子协议标识符列表相同。

**Sec-WebSocket-Version通用标头**（Sec-WebSocket-Version: version或Sec-WebSocket-Version: supportedVersions ）指定客户端希望使用的 WebSocket 协议版本，以便服务器可以确认其是否支持该版本。如果服务器无法使用指定版本的 Websocket 协议进行通信，它将响应一个错误（例如 426 Upgrade Required），该错误在它的标头中包含一个 Sec-WebSocket-Version 标头，其中包含支持的逗号分隔列表的协议版本。如果服务器确实支持请求的协议版本，则响应中不包含 Sec-WebSocket-Version 标头。

### HTTP 其他标头

**Alt-Svc 头部**列举了当前站点备选的访问方式列表。一般用于在提供“QUIC”等新兴协议支持的同时，实现向下兼容。可能包括的指令有：
1. clear：表示源请求该源的所有替代服务无效的特殊值。
2. `<service-list>`：使用分号隔离的访问方式列表，格式形如`<service-name>="<host-name>:<port-number>"`。这里的`<service-name>`应是有效的 ALPN （应用层协议协商Application-Layer Protocol Negotiation）标识符。
3. `<max-age>`：可选，当前访问方式的有效期，超过该时间后，服务端将不保证该访问方式依旧可用，客户端应当重新获取更新后的 Alt-Svc 列表。单位为秒，默认值为 24 小时（86400）。
4. persist：可选，用于标识当前访问方式在网络环境改变时或者会话间始终保持。

**Date 通用首部**（`Date: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT`）包含了报文创建的日期时间。

**Link 实体报头**（`Link: < uri-reference >; param1=value1; param2="value2" < uri-reference >`必须要用 < 和 >来关闭。以 ; 分隔的参数与 HTML 元素 `<link>` 的属性一致供了一种在 HTTP 标头中序列化一个或多个链接（以逗号分隔）的方法。它在语义上与 HTML 元素 `<link>` 相等。

**Retry-After 响应首部**表示用户代理需要等待多长时间之后才能继续发送请求。主要应用场景：
1. 当与 503 Service Unavailable 响应一起发送的时候，表示服务下线的预期时长。
2. 当与重定向响应一起发送的时候，比如 301 Moved Permanently，表示用户代理在发送重定向请求之前需要等待的最短时间。
可能取值有：
1. `<http-date>`：表示在此时间之后可以重新尝试。
2. `<delay-seconds>`：表示在重试之前需要等待的秒数。

**Server-Timing 响应标头**传达在一个给定请求 - 响应周期中的一个或多个参数和描述。它用于在用户浏览器的开发工具或 PerformanceServerTiming接口中显示任何后端服务器定时参数（例如，数据库读/写、CPU 时间、文件系统访问等）。Server-Timing 头可能会暴露潜在的敏感应用程序和基础设备信息。请考虑在服务器端控制何时向谁返回哪些参数信息。
**SourceMap 响应标头**（`SourceMap: <url>` 指向一个 source map 文件的一个相对（于请求的 URL）或者一个绝对的 URL）将生成的代码链接到一个source map，使浏览器能够重建原始的资源然后显示在调试器里。

**X-DNS-Prefetch-Control 响应标头**（X-DNS-Prefetch-Control: on或X-DNS-Prefetch-Control: off）控制着浏览器的 DNS 预读取功能。DNS 预读取是一项使浏览器主动去执行域名解析的功能，其范围包括文档的所有链接，无论是图片的，CSS 的，还是 JavaScript 等其他用户能够点击的 URL。因为预读取会在后台执行，所以 DNS 很可能在链接对应的东西出现之前就已经解析完毕，这能够减少用户点击链接时的延迟。除了通过在服务器端发送 X-DNS-Prefetch-Control 报头：
1. 可以在文档中使用 `<meta http-equiv="x-dns-prefetch-control" content="">` 标签改变content的值为on或off来改变DNS预读取设置。
2. 可以通过使用 rel 属性值为 dns-prefetch的 `<link>` 标签来对特定域名进行预读取。协议可以省略，但主机名前必需要有双斜线。

关闭预读取功能，只需要将 network.dns.disablePrefetch 选项值设置为 true。默认情况下，通过 HTTPS 加载的页面上内嵌链接的域名并不会执行预加载。在 Firefox 浏览器中，可以通过 about:config 设置 network.dns.disablePrefetchFromHTTPS 值为 false 来改变默认行为。

**Upgrade通用标头**（仅限HTTP/1.1，HTTP/2明确禁止使用此机制）（Upgrade: protocol_name[/protocol_version]）可用于将已建立的客户端/服务器连接升级到不同的协议（通过相同的传输协议）。在创建初始 HTTP/1.1 会话之后，需发送另一个 HTTP 标准请求来请求升级。注意：由于Upgrade是一个逐跳标头，Connection: upgrade必须始终与Upgrade标头一起发送。协议按优先级降序排列，以逗号分隔，协议版本是可选的。客户端可以使用 Upgrade 标头来邀请服务器按优先顺序降序切换到所列协议中的一个（或多个以逗号分隔）。服务器可以出于任何原因选择忽略该请求，在这种情况下，它应该像未收到 Upgrade 标头一样进行响应（例如，使用 200 OK）。但如果服务器决定升级连接，它必须发回包含指定要切换到的协议的Upgrade标头的 101 Switching Protocols响应，然后服务器再使用新协议发送对原始请求的响应。例如，客户端可以使用它来将连接从 HTTP 1.1 升级到 HTTP 2.0，或者将 HTTP 或 HTTPS 连接升级到 WebSocket。请记住，当用 WebSocket API 以及其他大部分实现 WebSocket 的库去建立新的连接时，基本上都不用操心升级的过程，因为这些 API 已经实现发送初始 HTTP/1.1 连接和处理握手及升级过程。

## HTTP cookie

**HTTP Cookie**（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据。浏览器会存储 cookie 并在下次向同一服务器再发起请求时携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器——如保持用户的登录状态。Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。

Cookie 主要用于以下三个方面：
1. 会话状态管理：如用户登录状态、购物车、游戏分数或其他需要记录的信息
2. 个性化设置：如用户自定义设置、主题和其他设置
3. 浏览器行为跟踪：如跟踪分析用户行为等。

更多/更大的cookies意味着每个请求都要包含更繁重的数据传输。如果只是需要存储些 "client-only" 的数据，应该使用Web storage API（localStorage和sessionStorage）或IndexedDB。window.sessionStorage 和 window.localStorage对应于会话 cookie和永久 cookie 的持续时间，但是存储限制比 cookie 大，并且永远不会发送到服务器。可以使用 IndexedDB API 或基于它构建的库来存储更多结构化的数据。

Document.cookie是用于获取或设置与当前文档相关联的 cookie的getter和setter。作为getter时，返回一个包含所有的 Cookie，且每条cookie（即，`<cookie-name>=<cookie-value>` 键值对，）以分号+空格（'; '）分隔的字符串。作为setter时，一次只能对一条cookie 字符串进行设置或更新。设置时不能包含 HttpOnly 标志。可以通过更新一个 cookie 的过期时间为 0 来删除一个 cookie。以下可选的 cookie 属性值可以跟在键值对后，用来具体化对 cookie 的设定/更新，使用分号以作分隔：
1. `;path=<path>`：如果没有定义，默认为当前文档位置的路径。
2. `;domain=<domain>`：如果没有定义，默认为当前文档位置的路径的域名部分。
3. `;max-age=<max-age-in-seconds>`：过期时间。
4. `;expires=<date-in-GMTString-format>`：如果没有定义，cookie 会在对话结束时过期。
5. `;secure：cookie` 只通过 https 协议传输。
6. 此外，cookie 的值字符串`<cookie-value>`可以用encodeURIComponent() 来保证它不包含任何cookie 值中禁止使用的字符：逗号、分号或空格。

### HTTP Cookie 相关标头

**Cookie请求标头**包含与服务器相关联的已存储 HTTP cookie（即服务器先前通过 Set-Cookie 标头发送或在 JavaScript 中使用Document.cookie设置的 cookie。语法为 `Cookie: <cookie-list>`，其中 `<cookie-list>` 是一系列的名称/值对`<cookie-name>=<cookie-value>`。名称/值对之间用分号+空格（'; '）隔开。

**Set-Cookie响应标头**被用来由服务器端向用户代理发送cookie，所以用户代理可在后续的请求中将其发送回服务器。**服务器要发送多个cookie，则应该在同一响应中发送多个 Set-Cookie标头**。根据Fetch规范，Set-Cookie 是一个禁止的响应标头，对应的响应在被暴露给前端代码前，必须滤除这一响应标头，即浏览器会阻止前端JavaScript代码访问 Set-Cookie标头。语法为：`Set-Cookie: <cookie-name>=<cookie-value>; [Expires=<date>]；[Max-Age=<number>]; [Domain=<domain-value>]; [Path=<path-value>]; [Secure]; [HttpOnly]; [SameSite=<SameSite-value>]; [Partitioned]`
1. `<cookie-name>=<cookie-value>`：有且仅一个名称/值对cookie。
    1. `<cookie-name>` 可以是除了控制字符、空格或制表符之外的任何 US-ASCII 字符，同时不能包含以下分隔字符：( ) < > @ , ; : \ " / [ ] ? = { }。具有特殊语义的 `<cookie-name>`：以 __Secure- 或 __Host- 为前缀的 cookie（其中连接符是前缀的一部分），必须与 secure 属性一同设置，同时必须应用于使用 HTTPS 访问的页面。后者还禁止设置 domain 属性（也就不会发送给子域）且 path 属性的值必须为 /，这种 cookie 被视为“domain-locked”。带有这些前缀的 Cookie，如果不符合其限制的会被浏览器拒绝。
    2. `<cookie-value>` 可以选择用双引号括起来，并包含任何 US-ASCII 字符，但不包括控制字符（ASCII 字符 0 到 31 和 ASCII 字符 127）、空格、双引号、逗号、分号和反斜杠。
    3. 许多应用会对 cookie 值按照 URL 编码规则进行编码，但是按照 RFC 规范，这不是必须的。不过满足规范中对于 `<cookie-value>` 所允许使用的字符的要求是有用的。
2. `Expires=<date>`：可选，设置cookie最长有效时间`<date>`，是客户端而不是服务器时间，形式为符合HTTP-date规范的时间戳（`<day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT`）。如果没有设置，则表示是会话期 cookie，即会话结束于客户端被关闭时，该会话期 cookie会被移除。然而，很多 Web 浏览器支持会话恢复功能，这个功能可以使浏览器保留所有的 tab 标签，然后在重新打开浏览器的时候将其还原。与此同时，cookie 也会恢复，就跟从来没有关闭浏览器一样。
3. `Max-Age=<number>`：可选，在 cookie 失效之前需要经过的秒数`<number>`。秒数为 0 或 -1 将会使 cookie 直接过期。Max-Age 的优先级高于Expires。用于敏感信息（例如指示身份验证）的 Cookie 的生存期应较短。
4. `Domain=<domain-value>`：可选，指定 cookie 可以送达的主机名`<domain-value>`。多个主机/域名的值是不被允许的，但如果指定了一个域，则其子域也会被包含。但假如没有指定，那么默认值为当前文档访问地址中的主机部分且不包含子域名。域名（.example.com）之前的点号会被忽略（example.com）。属于特定域的 cookie，假如域名`<domain-value>`不能涵盖发送该cookie服务器的域名，那么会被用户代理拒绝。
5. `Path=<path-value>`：可选，指定一个 URL 路径 `<path-value>`，该路径必须出现在要请求的资源的路径中才可以发送 Cookie 标头。字符 / 可以解释为文件目录分隔符，此目录的下级目录也满足匹配的条件（例如，如果 path=/docs，那么/docs、/docs/、/docs/Web/ 和 /docs/Web/HTTP 都满足匹配条件。/、/docsets 或者 /fr/docs 则不满足匹配条件）。
6. cookie 只有在请求使用 https: 协议（localhost 不受此限制）的时候才会被发送到服务器，以阻止中间人攻击。不要假设 Secure 会阻止所有的对 cookie 中敏感信息（session key、登录信息，等等）的访问。携带这一属性的 cookie 在不设置 HttpOnly 的情况下仍能从客户端的硬盘或是从 JavaScript 中访问。非安全站点（http:）已经不能在 cookie 中设置 Secure 属性了（在 Chrome 52 和 Firefox 52 中新引入的限制）。对于 Firefox，Secure 属性的 https: 限制会在域为 localhost 时被忽略（从 Firefox 75 开始）。
7. HttpOnly：可选，用于阻止 JavaScript 通过Document.cookie 属性访问 cookie，其可用于防范跨站脚本攻击（XSS）。注意，设置了HttpOnly的cookie在使用JavaScript初始化的请求（调用 XMLHttpRequest.send() 或 fetch()）中仍然会被发送。
8. `SameSite=<SameSite-value>`：可选，控制是否通过跨站请求发送 cookie，从而在一定程度上防止跨站请求伪造攻击（CSRF）。其中站点由可注册域（**可注册域由公共后缀列表（https://publicsuffix.org/list/public_suffix_list.dat**）中的某个条目加上它之前的域名部分组成）和URL方案（http 或 https）定义。Chrome89才开始来自同域的cookie若使用了不同的协议（http: 或 HTTPS:），将不再被视为来自同一站点。如果该 cookie 域和方案匹配当前的页面，则认为该 cookie 和该页面来自同一站点，则称为**第一方 cookie（first-party cookie）**。如果域和方案不同，则它不认为来自同一个站点，被称为**第三方 cookie（third-party cookie）**。`<SameSite-value>` 的取值有：
    1. Strict：浏览器仅对同一站点的请求发送 cookie。如果请求来自不同的域或协议（即使是相同域），则携带有 SameSite=Strict 属性的 cookie 将不会被发送。
    2. Lax：默认值（chrome 80+），cookie 不会在跨站点请求（例如加载img或iframe的请求）上发送，而是在用户从外部站点导航到源站点（例如，点击链接）时发送。
    3 None：浏览器会在跨站和同站请求中均发送 cookie。携带 SameSite=None 属性的 cookie 必须同时设置 Secure 属性。
9. Partitioned：可选，指示应使用分区存储来存储 cookie（chrome 114+）。分区cookie 必须使用Secure和设置Path=/。此外，建议在设置分区cookie时使用前缀__Host，以使它们绑定到主机名而不是可注册域。

### Cookie与Session

cookie和session均可用于存储用户信息。

**Cookie**：保存在客户端；容易被截获篡改（**安全性缺点—可采用加密方案或带Token**）；大小一般4KB（**容量小缺点**）；同域请求一律携带cookie（**性能缺点**）；通过Expires（过期时间）或Max-Age（时间间隔（秒））设置有效期；通过 **Domain（域名）和 path（路径）**设置作用域；HttpOnly禁止JS访问（预防XSS攻击）；**SameSite 属性**限制第三方携带cookie（预防CSRF 攻击），取值Strict（完全禁止第三方）、**Lax（chrome80开始的默认值，仅get提交表单或a标签get请求允许第三方发送）**和 None。大多限制站点最多保存 20 个cookie。

![](../public/basics/http/100.png)

服务端可以设置 Cookie 的所有选项：Expires、Domain、Path、Secure、HttpOnly，一个 Set-Cookie 字段只能设置一个 Cookie, 当需要设置多个 Cookie 时，需要添加同样多的 Set-Cookie 字段。

客户端可以设置 Cookie 的选项：Expires、Domain、Path、Secure(有条件：只有在 HTTP 协议的网页中，客户端设置 Secure 类型的 Cookie 才能成功)，但无法设置 HttpOnly 选项。

**Session**：保存在服务器，敏感的信息用session存储更安全，session可以存放在文件/数据库/内存中，但是会增加服务器的压力。

## HTTP 连接管理

打开和维护连接很大程度上影响性能。HTTP/1.x连接管理模型包括**短连接（short-lived connections）**，**持久连接（Persistent Connection，又称为长连接）**和 **HTTP流水线（HTTP pipelining）**。 HTTP/2 新增了其他连接管理模型。HTTP 的连接管理适用于两个连续节点之间的连接，它是逐跳的，而不是端到端的，即客户端与其第一个代理之间的连接使用的模型可能不同于代理与目标服务器（或任何中间代理）之间的模型，而定义连接模型所涉及的 HTTP 标头（如 Connection 和 Keep-Alive）是逐跳标头，其值可由中间节点更改。

![](../public/basics/http/102.png)

HTTP 主要依赖于 TCP 来提供从客户端到服务器端之间的连接。

HTTP 最早期的模型和 HTTP/1.0 的默认模型是**短连接（short-lived connections）**：**每发起一个请求时都会创建一个新的连接，并在收到应答时立即关闭**。HTTP/1.1 中，只有当 Connection标头被设置为 close 时才用该模型。**短连接的两个大的问题是创建新连接本身耗费时间和TCP 连接的性能只有在该连接被使用一段时间后即成为热连接才能得到改善。**

HTTP/1.1的默认模型是**持久连接（Persistent Connection）**：会保持一段时间，重复用于发送一系列请求，连接在空闲一段时间后会被关闭，节省了新建 TCP 连接握手的时间，还可以利用 TCP 热链接的性能增强能力（服务器可以使用 Keep-Alive 标头来指定一个空闲连接最小保持时间）。HTTP/1.0中只有当Connection 标头显式设置成 close 以外的值才用该模型（通常会设置为 retry-after）， HTTP/1.1 即使默认持久连接，为避免可能回退到HTTP/1.0，建议也显式设置。**持久连接的缺点**是空闲状态会消耗服务器资源，而且在重负载时有可能遭受 DoS 攻击。

HTTP/1.1的**持久连接（Persistent Connection）**在默认情况下请求是按顺序发出的，即下一个请求只有在当前请求收到响应过后才会被发出。而**HTTP流水线**：在同一条持久连接上发出连续的请求，而不用等待应答返回。理论上，如果将两个 HTTP 请求打包到同一个 TCP 消息中，性能也会得到提高，管 HTTP 请求大小的需求持续增长，但典型的 MSS（最大分段大小，Maximum Segment Size，是除去TCP 或 IP 协议头后，以字节数定义一个计算机或通信设备所能接受的分段的最大数据量）足以包含多个简单请求。所有遵循 HTTP/1.1 标准的代理和服务器都应该支持流水线，但HTTP 流水线在现代浏览器中并不是默认被启用的，因为：
1. 服务器或代理程序可能不支持HTTP/1.1
2. 正确的实现流水线是复杂的：传输资源的大小、将使用的有效 RTT 以及有效带宽，都会直接影响流水线的改进效果。不知道这些的话，重要的消息可能被延迟到不重要的消息后面。这个重要性的概念甚至会演变为影响到页面布局！因此 HTTP 流水线在大多数情况下带来的改善并不明显。
3. 流水线受制于队头阻塞（Head-of-line blocking，HOL blocking）问题。
4. 如果有故障发生时，流水线的内容要能被安全的重试。因此只有幂等方法（GET， HEAD、PUT、DELETE、OPTIONS和TRACE）能使用。

因此，HTTP流水线已被 HTTP/2的多路复用（multiplexing）所取代。

由于浏览器限制每个域的活动连接数（6，大于该数字就有触发服务器 DoS 保护的风险），**域名分片（domain sharding）**会将内容拆分到多个子域中。浏览器能够同时下载更多资源，从而缩短了页面加载时间并改善了用户体验。但域名分片的问题在于每个域都需要额外的 DNS 查找成本以及建立每个 TCP 连接的开销。HTTP/2 不限制并发请求，因此 HTTP/2 中不必使用域名分片。

### HTTP连接管理相关标头（Connection）

**Connection 通用标头（Connection: keep-alive或Connection: close）**控制网络连接在当前会话完成后是否仍然保持打开状态。如果发送的值是 keep-alive，则连接是持久的，不会关闭，允许对同一服务器进行后续请求。在 HTTP/2 和 HTTP/3 中，禁止使用特定于连接的标头字段，如 Connection 和 Keep-Alive。Chrome 和 Firefox 会在 HTTP/2 响应中忽略它们，但 Safari 遵循 HTTP/2 规范要求，不会加载包含这些字段的任何响应。除去标准的逐段传输（hop-by-hop）头，任何逐段传输头都需要在 Connection 头中列出，这样才能让第一个代理知道必须处理它们且不转发这些头。标准的逐段传输头也可以列出。可能取值：
1. close表明客户端或服务器想要关闭该网络连接，这是 HTTP/1.0 请求的默认值。
2. 以逗号分隔的 HTTP 标头列表。通常仅有keep-alive，表明客户端想要保持该网络连接打开。HTTP/1.1 的请求默认使用持久连接。

**Keep-Alive 通用标头（Keep-Alive: parameters）**允许消息发送者暗示连接的状态，还可以用来设置超时时长和最大请求数。前提是将Connection 首部的值设置为 "keep-alive"，同时在 HTTP/2 协议中， Connection 和 Keep-Alive 是被忽略的。parameters是一系列用逗号隔开的参数，每一个参数由一个标识符和一个值构成，并使用等号 ('=') 隔开。可用的标识符有：
1. timeout：指定了一个空闲连接需要保持打开状态的最小时长（以秒为单位），如果没有在传输层设置 keep-alive TCP message 的话，大于 TCP 层面的超时设置会被忽略。
2. max：表示关闭连接之前可以在此连接上发送的最大请求数。除非为 0，否则非管道连接将忽略此值，因为下一个响应将发送另一个请求。HTTP 管道可以用它来限制管道化。

## HTTP 内容协商

在 HTTP 协议中，内容协商指通过为同一 URI 指向的资源提供不同的表示形式，可以使用户代理选择与用户需求相适应的最佳匹配（例如：文档使用的自然语言、图片的格式或者内容编码形式）。

![](../public/basics/http/103.png)

内容协商的最佳表示形式的选取可以通过两种机制实现：
1. 服务端驱动型内容协商或者主动内容协商：服务器以浏览器（或者其他任何类型的用户代理）随同 URL 发送的一系列描述了用户选择倾向的 HTTP 标头（比如Accept、Accept-Encoding、Accept-Language）为线索，通过内部算法来选择最佳方案提供给客户端。如果不能提供合适的资源，它可能使用 406 Not Acceptable、415 Unsupported Media Type进行响应并为其支持的媒体类型设置标头（比如，分别对 POST 和 PATCH 请求使用 Accept-Post 或 Accept-Patch 标头）。
    1. 每一个特性需要对应一个标头随请求发送，客户端提供的标头信息相当冗长（HTTP/2 协议的标头压缩机制可以缓解），并且存在被HTTP 指纹识别的隐私风险。
    2. 即使借助客户端提示扩展，服务器也无法获取关于浏览器能力的全部信息。
    3. 因为给定的资源需要返回不同的表示形式，共享缓存的效率会降低，而服务器端的实现会越来越复杂。 

![](../public/basics/http/104.png)

2. 代理驱动型协商或者响应式协商：服务器返回 300 Multiple Choices或者 406 Not Acceptable、415Unsupported Media Type（备选方案）。当面临不明确的请求时，服务器会返回一个页面，其中包含了可供选择的资源的链接呈现给用户，由用户做出选择。
    1. HTTP 标准没有明确指定提供可选资源链接的页面的格式，因此自动化大都是在检测了协商的条件之后，由JavaScript脚本会触发重定向。
    2. 需要额外发送一次请求来获取实际资源，减慢了将资源呈现给用户的速度。

![](../public/basics/http/105.png)

### HTTP内容协商相关标头（Content negotiation）

**Accept 请求标头**表示客户端可以处理的内容类型（用MIME 类型来表示）。借助内容协商机制，服务器可以从诸多备选项中选择一项进行应用，并使用 Content-Type 响应标头通知客户端它的选择。浏览器会基于请求的上下文来为Accept 请求标头设置合适的值。可能取值为：
1. `<MIME_type>/<MIME_subtype>`：单一精确的 MIME 类型。
2. `<MIME_type>/*`：一类 MIME 类型，但是没有指明子类。
3. `*/*`：任意类型的 MIME 类型。
4. 可以设置以上的多种类型。
5. 不同的 MIME 类型之间用逗号分隔，
6. 每个类型后可接质量价值（Quality values）`;q=<q>`作权重。

**Accept-Language 请求标头**允许客户端声明它可以理解的自然语言，以及优先选择的区域方言。借助内容协商机制，服务器可以从诸多备选项中选择一项进行应用，并使用 Content-Language 应答头通知客户端它的选择。可能的取值有：
1. `Accept-Language: <language>`，用含有两到三个字符的字符串表示的语言码或完整的语言标签。
2. `Accept-Language: *，任意语言；"*"` 表示通配符（wildcard）。
3. `Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`，每个语言后可接质量价值（Quality values）`;q=<q>`作权重。

**Accept-Encoding 请求标头**会将客户端能够理解的内容编码方式列表通常是某种压缩算法通知给服务端。通过内容协商的方式，服务端会从中选择使用并在响应头 Content-Encoding 中通知客户端该选择。即使客户端和服务器都支持相同的压缩算法，在指令可以被接受的情况下，服务器也可以选择对响应body不进行压缩，导致这种情况出现的两种常见的情形是：
1. 要发送的数据已经经过压缩，再次进行压缩不会导致被传输的数据量更小。比如一些图像格式的文件；
2. 服务器超载，无法承受压缩需求导致的计算开销。通常，如果服务器使用超过 80% 的计算能力，微软建议不要压缩。

可能的标记取值（每个标记后可接质量价值（Quality values）`;q=<q>`作权重）：
1. gzip：表示采用 Lempel-Ziv coding (LZ77) 压缩算法，以及 32 位 CRC 校验的编码方式。
2. compress：采用 Lempel-Ziv-Welch (LZW) 压缩算法。
3. deflate：采用 zlib 结构和 deflate 压缩算法。
4. br：表示采用 Brotli 算法的编码方式。
5. identity：用于指代自身（例如：未经过压缩和修改）。除非特别指明，这个标记始终可以被接受，即服务器禁止返回表示客户端错误的 406 Not Acceptable 响应。
6. `*`：匹配其他任意未在该请求头字段中列出的编码方式。假如该请求头字段不存在的话，这个值是默认值。它并不代表任意算法都支持，而仅仅表示算法之间无优先次序。

**Accept-Patch 响应标头**指示服务器接受 PATCH请求的媒体类型。

**Accept-Post 响应标头**指示服务器接受 POST 请求的媒体类型。

**Accept-CH 响应标头**指定在后续请求中应包含哪些客户端提示标头。

### HTTP 消息主体信息相关标头（Message body information）

**Content-Length 实体标头/表示标头（`Content-Length: <length>`）**，用来指明发送给接收方的消息主体的大小，即用十进制数字表示的八位元组的数目。

**Content-Type 实体标头/表示标头**用于指示资源的 MIME 类型（`Content-Type: <media-type>;[charset=<charset>];[boundary=<boundary>]`）。在响应中，Content-Type 标头告诉客户端返回内容的内容类型。浏览器会在某些情况下进行 MIME 查找，并不一定遵循此标头的值，为了防止这种行为，可以将标题 X-Content-Type-Options 设置为 nosniff。在请求中 (如POST 或 PUT)，客户端告诉服务器实际发送的数据类型。参与的指令包括：
1. `<media-type>`：资源或数据的 MIME type 。
2. `[charset=<charset>]`：可选，字符编码标准。
3. `[boundary=<boundary>]`：可选，但对于多部分实体是必需的，其包括来自一组字符的 1 到 70 个字符。它用于封装消息的多个部分的边界。

**Content-Encoding实体标头/表示标头**列出了对当前实体消息（消息荷载）应用的任何编码类型，以及编码的顺序。它让接收者知道需要以何种顺序解码该实体消息才能获得原始荷载格式。Content-Encoding 主要用于在不丢失原媒体类型内容的情况下压缩消息数据。请注意原始媒体/内容的类型通过 Content-Type 首部给出，而 Content-Encoding 应用于数据的表示，或“编码形式”。如果原始媒体以某种方式编码（例如 zip 文件），则该信息不应该被包含在 Content-Encoding 首部内。一般建议服务器应对数据尽可能地进行压缩，并在适当情况下对内容进行编码。对一种压缩过的媒体类型如 zip 或 jpeg 进行额外的压缩并不合适，因为这反而有可能会使荷载增大。可能取值：
1. gzip：表示采用 Lempel-Ziv coding (LZ77) 压缩算法，以及 32 位 CRC 校验的编码方式。
2. compress：采用 Lempel-Ziv-Welch (LZW) 压缩算法。此内容编码方式已经被大部分浏览器弃用，部分因为专利问题（这项专利在 2003 年到期）。
3. deflate：采用 zlib 结构和 deflate 压缩算法。
4. br：表示采用 Brotli 算法的编码方式。

**Content-Language 实体标头/表示标头**用来描述目标访问者希望采用的语言或语言组合。如果没有指明 Content-Language，那么默认地，文件内容是提供给所有语言的访问者使用的。多个语言标签也是合法的，同样的，这个首部还可以用来描述不同媒体类型的文件，而不单单局限于文本型文档。多个语言标签需要用逗号隔开。每一个语言标签都是由一个或多个不区分大小写的子标签构成的，子标签之间用连字号 ("-") 隔开。

**Content-Location 实体标头/表示标头**（`Content-Location: <url>` 其中`<url>`是相对（相对于请求 URL）或绝对 URL）表示返回数据的备用位置。最主要的用途是用来指定要访问的资源经过内容协商后的结果的 URL。Location 指定的是一个重定向请求的目的地址（或者新创建的文件的 URL），而 Content-Location指向的是可供访问的资源的直接地址，不需要进行进一步的内容协商。Location 对应的是响应，而 Content-Location 对应的是要返回的实体。

## HTTP 条件请求

**HTTP 条件请求**通过将受影响的资源与验证器的值进行比较，可以改变请求的结果甚至成功与否。

在 HTTP 协议中，**条件请求**指的是请求的执行结果会因特定首部的值不同而不同。这些首部规定了请求的前置条件，请求结果则视条件匹配与否。请求引发的不同的反应取决于请求所使用的方法，以及组成前置条件首部集合（If-Match、If-None-Match、If-Modified-Since、If-Unmodified-Since、If-Range）：
1. 对于安全方法来说，例如GET，条件请求可以被用来限定仅在满足条件的情况下返回资源，这样可以节省带宽。
2. 对于非安全方法来说，例如PUT，条件请求可以被用来限定仅在满足文件的初始版本与服务器上的初始版本相同的条件下才会将其上传。

这种请求可以用来验证缓存的内容，避免无用的控制，验证文档的完整性，比如在断点续传时，或者在上传或修改文档时防止丢失更新。

**验证器是描述资源版本的条件请求首部值**，分为两大类：
1. 文件的最后修改时间。
2. 指代版本的一个独一无二的不透明的字符串，称为entity tag或etag。

对于比较同一份资源的不同版本，取决于上下文环境的不同，有两种不同的等值检查（equality checks）类型：
1. **强验证类型（Strong validation）**：需要每一个字节都相同，由 ETag 首部来完成的。比如断点续传。
2. **弱验证类型（Weak validation）**：只需要确认资源内容相同。即便是有细微差别也可以接受，比如展示的广告不同或者页脚显示的时间不同。

验证类型与验证器的类型是相互独立的，Last-Modified标头和 ETag 标头均可应用于两种验证类型，尽管在服务器端实现的复杂程度可能会有所不同。HTTP 协议默认使用强验证类型，可以指定何时使用弱验证类型。构建应用于弱验证类型的标签（etag）体系可能会比较复杂，因为这会涉及到对页面上不同的元素的重要性进行排序，但是会对缓存性能优化相当有帮助。

**应用场景**：

1. **更新缓存**。
    1. 假如缓存为空，或者是没有缓存的话，被请求资源会以状态码 200 OK 返回。验证器（Last-Modified 或 ETag标头值）会同资源一起返回和缓存起来。

    ![](../public/basics/http/106.png)

    2. 只要缓存未失效，就不会发起任何请求。但是一旦失效——主要是由 Cache-Control 首部控制——客户端就不会采用缓存而是以验证器（Last-Modified 或 ETag标头值）的值用作 If-Modified-Since 或 If-Match 标头的值发起条件式请求。
    3. 假如资源未发生变化，服务器响应 304 Not Modified。客户端则仍采用被缓存的资源。

    ![](../public/basics/http/107.png)

    4. 假如资源发生了变化，服务器响应200 OK 返回新版本的资源；客户端则采用新版本资源并将其缓存起来。

    ![](../public/basics/http/108.png)

2. 断点续传。
    1. 支持增量下载的服务器会通过 Accept-Ranges 标头告知客户端。

    ![](../public/basics/http/109.png)

    2. 户端就可以通过发送 Ranges标头以及缺失的范围值来进行断点续传。
    3. 如果要下载的资源在两次下载之间进行了修改，得到的数据范围就会对应该资源的两个不同的版本，那么最终获得的文件是损坏的。因此，需要以验证器（Last-Modified 或 ETag标头值）的值作为If-Range的值发起条件式请求。
    4. 如果条件得到满足时，服务器回复 206 Partial Content，以及Range 首部请求的相应部分。
    5. 如果条件没有得到满足，服务器将会返回 200 OK，并返回完整的请求资源。而客户端就可以从头开始重新下载资源。

    ![](../public/basics/http/110.png)

3. 远程更新文件。
    1. 客户端首先读取原始文件，然后进行修改，最后将它们推送到服务器上（使用PUT方法）。当一个客户端在本地修改它新获得的资源副本的时候，另外一个客户端同样可以获取一份资源副本并进行同样的操作，即出现竞态条件，可能导致更新丢失。

    ![](../public/basics/http/111.png)

    2. 条件式请求的思路是，允许所有的客户端获得资源的副本，然后在本地进行编辑，通过只允许第一个客户端成功提交的方式来控制并发操作。具体是使用If-Match 或 If-Unmodified-Since 首部，假如实体标签与源头文件的实体标签不一致，或者源头文件在被获取副本之后经过了修改，那么此次变更请求就会被拒绝，收到 412 Precondition Failed 的错误提示。之后就需要依靠客户端来处理该错误了：或者通知用户重新开始（基于最新的版本），或者是给用户展示两个版本之间的差异，辅助他们决定要保留哪些变更。

    ![](../public/basics/http/112.png)

    3. 资源的首次上传时（使用PUT方法），当两个客户端在大致相同的时间进行上传操作的时候，也可能会遇到竞态条件。使用值设置为'*'（表示任意实体标签）的 If-None-Match标头发起条件请求。当且仅当资源先前并不存在的情况下请求的操作才会成功执行。If-None-Match 首部只可应用于兼容 HTTP/1.1（及后续版本）的服务器。

    ![](../public/basics/http/113.png)


### HTTP 条件相关标头（Conditional）

**Last-Modified 响应标头**（Last-Modified: `<day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT`）表示源头服务器认定的资源做出修改的日期及时间，通常用于判断接收到的或者存储的资源是否一致。精确度比 ETag 低，因此是备用机制。包含有 If-Modified-Since 或 If-Unmodified-Since 标头的条件请求会使用该标头。其中：
1. `<day-name>`：Mon, Tue, Wed, Thu, Fri, Sat, 或 Sun 之一（区分大小写）。
2. `<day>`：两位数字表示的天数，例如 04 or 23。
3. `<month>`：Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec 之一（区分大小写）。
4. `<year>`：4 位数字表示的年份，例如 1990 或者2016。
5. `<hour>`：两位数字表示的小时数，例如 09或者 23。
6. `<minute>`：两位数字表示的分钟数，例如04 或者 59。
7. `<second>`：两位数字表示的秒数，例如 04 或者 59。
8. GMT：国际标准时间。HTTP 中的时间均用国际标准时间表示，从来不使用当地时间。

**ETag 响应标头**（`ETag: W/"<etag_value>"`或`ETag: "<etag_value>"`）是资源的特定版本的标识符。'W/'(大小写敏感) 表示使用弱验证器。`"<etag_value>"` 是唯一地表示所请求的资源的实体标签，是位于双引号之间的 ASCII 字符串。ETag常见的应用场景：
1. 缓存未更改的资源：如果用户再次访问给定的 URL（设有ETag字段），如果资源过期了且不可用，客户端就发送包含值为ETag的If-None-Match 标头的请求。服务器将客户端的 ETag（即If-None-Match的值）与其当前版本的资源的 ETag 进行比较，如果两个值匹配（即资源未更改），服务器将返回不带任何内容的 304 Not Modified 状态，告诉客户端缓存版本可用（fresh）。
2. 避免“空中碰撞”：利用在ETag和 If-Match 标头，可以检测到"空中碰撞"的编辑冲突。编辑后内容被散列，并在响应中放入Etag标头，对更改保存即发布数据时，POST请求将包含有 ETag 值的If-Match标头来检查是否为最新版本。如果哈希值不匹配，则意味着文档已经被其他人编辑，抛出412错误。

**If-Match 条件请求标头**（`If-Match: <etag_value>` 或 `If-Match: <etag_value>, <etag_value>, … `或 `If-Match:*`），在请求方法为 GET 和 HEAD 的情况下，服务器仅在请求的资源满足此首部列出的 ETag值时才会返回资源，而对于 PUT 或其他非安全方法来说，只有在满足条件的情况下才可以将资源上传。*星号是一个指代任意资源的特殊值，它只用在进行资源上传时，通常是采用 PUT 方法，来检测拥有相同识别 ID 的资源是否已经上传过了。ETag 值之间的比较使用的是强比较算法，即只有在每一个字节都相同的情况下，才可以认为两个文件是相同的，在 ETag 值前面添加 W/ 前缀才表示采用弱验证。If-Match常见的应用场景：
1. 对于 GET 和 HEAD 方法，搭配 Range首部使用，可以用来保证新请求的范围与之前请求的范围是对同一份资源的请求。如果 ETag值 无法匹配，那么需要返回 416 (Range Not Satisfiable，范围请求无法满足) 响应。
2. 对于其他方法来说，尤其是 PUT, If-Match 首部可以用来避免更新丢失问题（即“空中碰撞”问题）。它可以用来检测用户想要上传的不会覆盖获取原始资源之后做出的更新。如果请求的条件不满足，那么需要返回 412 (Precondition Failed，先决条件失败) 响应。

If-None-Match条件请求标头（`If-None-Match: <etag_value>` 或 `If-None-Match: <etag_value>`, `<etag_value>, …` 或 `If-None-Match:*`），对于 GET 和 HEAD 请求方法来说，当且仅当服务器上没有任何资源的 ETag 值与该首部中列出的相匹配的时候，服务器端才会返回所请求的资源，响应码为 200，否则返回 304且同时生成会存在于 200 响应中的Cache-Control、Content-Location、Date、ETag、Expires 和 Vary首部。对于其他方法来说，当且仅当最终确认没有已存在的资源的 ETag 值与该首部中所列出的相匹配的时候，才会对请求进行相应的处理，否则返回412 Precondition Failed。ETag 值之间的比较默认就是采用的是弱比较算法，即内容一致就可以认为是相同的。ETag 值前有可能包含一个 W/ 前缀，来提示应该采用弱比较算法（画蛇添足，因为 If-None-Match 用且仅用弱比较算法）。If-None-Match比If-Modified-Since优先级更高。If-None-Match常见的应用场景：
1. 采用 GET 或 HEAD 方法，来更新拥有特定的ETag 值的缓存。
2. 采用其他方法，尤其是 PUT，将 If-None-Match 的值设置为 * ，用来生成事先并不知道是否存在的文件，可以确保先前并没有进行过类似的上传操作，防止之前操作数据的丢失。

**If-Modified-Since 条件请求标头**（`If-Modified-Since: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT`），表示资源最后修改的日期时间。服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200。如果请求的资源从那时起未经修改，那么返回 304 响应，而在 Last-Modified 首部中会带有上次修改时间。不同于 If-Unmodified-Since, If-Modified-Since 只可以用在 GET 或 HEAD 请求中。当与 If-None-Match 一同出现时，它（If-Modified-Since）会被忽略掉，除非服务器不支持 If-None-Match。最常见的应用场景是来更新没有特定 ETag 标签的缓存实体。

**If-Unmodified-Since 条件请求标头**（`If-Unmodified-Since: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT`）：只有当资源在指定的时间之后没有进行过修改的情况下，服务器才会返回请求的资源，或是接受 POST 或其他不安全方法的请求。如果所请求的资源在指定的时间之后发生了修改，那么会返回 412 (Precondition Failed) 错误。常见的应用场景：
1. 与不安全方法如 POST 搭配使用，可以用来优化并发控制。假如在原始副本获取之后，服务器上所存储的文档已经被修改，那么对其作出的编辑会被拒绝提交。
2. 与含有 If-Range 请求标头的范围请求搭配使用，用来确保新的请求片段来自于未经修改的文档。

**Vary 响应标头**（`Vary: *` 或 `Vary: <header-name>, <header-name>, ...`）描述了请求信息中除方法和 URL 之外影响响应内容的其他部分。这通常用于在使用内容协商时创建缓存密钥。在响应状态码为 304 Not Modified 中，也要设置 Vary 首部，而且要与相应的 200 OK 响应设置得相同。*表示该响应的生成受请求标头以外因素的影响，表示该响应不可缓存。`<header-name>` 表示可能影响此响应生成的请求标头名称。

### HTTP 范围请求相关标头（Range requests）

**Accept-Ranges 响应标头**（Accept-Ranges: bytes或Accept-Ranges: none）是服务器用来表示其支持客户端部分文件下载请求的标记。该字段的值表示可用于定义范围的单位。如果出现 Accept-Ranges 标头，浏览器可能会尝试恢复中断的下载，而不是重新开始下载。none表示不支持任何范围请求单位，由于其等同于没有返回此头部，因此很少使用，不过一些浏览器，比如 IE9，会依此去禁用或者移除下载管理器的暂停按钮。bytes表示范围请求的单位是字节。

**Range 请求标头**（`Range: <unit>=<range-start>-<range-end>`）告知服务器返回文件的哪一部分。在一个 Range 首部中，可以一次性请求多个部分，服务器会以 multipart 文件的形式将其返回。如果服务器返回的是范围响应，需要使用 206 Partial Content。假如所请求的范围不合法，那么服务器会返回 416 Range Not Satisfiable，表示客户端错误。服务器允许忽略 Range 首部，从而返回整个文件，状态码用 200 。`<unit>`范围所采用的单位，通常是bytes（字节）。`<range-start>` 表示在特定单位下，范围的起始整数值。`<range-end>` 表示在特定单位下，范围的结束整数值，这个值是可选的，如果不存在，表示此范围一直延伸到文档结束。多个 `<range-start>-<range-end>` 之间用逗号分隔。

**If-Range 请求标头**（`If-Range: <http-date>` 或 `If-Range: <etag>`，其中 `<etag>` 当应用弱匹配算法时会有 W/ 前缀）用来当字段值中的条件得到满足时，Range首部才生效且服务器回复 206 Partial Content，以及Range 首部请求的相应部分；如果字段值中的条件没有得到满足，服务器将会返回 200 OK，并返回完整的请求资源。字段值中既可以用 Last-Modified 时间值用作验证，也可以用ETag标记作为验证，但不能将两者同时使用。If-Range 首部通常用于断点续传的下载过程中，确保自上次中断后下载的资源没有发生改变。

**Content-Range 响应标头**（`Content-Range: <unit> <range-start>-<range-end>/<size>`）显示的是一个数据片段在整个文件中的位置。`<size>` 表示整个文件的大小（如果大小未知则用"*"表示）。

## HTTP范围请求
  
HTTP 协议范围请求允许服务器只发送 HTTP 消息的一部分到客户端。范围请求在传送大的媒体文件，或者文件下载的断点续传时很有用。

假如在响应中存在 Accept-Ranges 首部并且它的值不为“none”，那么表示该服务器支持范围请求，否则表示不支持，而在这种情况下，某些应用的下载管理器会将暂停按钮禁用。

在请求的范围越界的情况下即范围值超过了资源的大小，服务器会响应 416 Requested Range Not Satisfiable。

如果数据量很大，并且在请求未能完全处理完成之前无法知晓响应的体积大小。

范围请求分为三类：
1. **单一范围请求**：使用Range标头，可以请求资源的某一部分。而服务器端会带Content-Length 标头（表示先前请求范围的大小）和Content-Range 标头（表示这部分内容在整个资源中所处的位置）响应206 Partial Content。
2. **多重范围请求**：使用Range标头，也可以请求资源的多个部分（用逗号分隔开）。而服务器返回 206 Partial Content和 `Content-Type：multipart/byteranges; boundary=<boundary>` 标头（表示响应有多个byterange），而且每一部分 byterange 都有自己的 Content-type 标头和 Content-Range标头，并且使用 `<boundary>` 对 body 进行划分。
3. **条件式范围请求**：使用If-Range 请求标头生成，当中断之后重新开始请求更多资源片段的时候，确保自从上一个片段被接收之后该资源没有进行过修改：假如条件满足的话，条件请求就会生效，服务器会响应 206 Partial，以及相应的消息主体。假如条件未能得到满足，那么就会响应 200 OK，以及整个资源。

### HTTP 传输编码相关标头（Transfer coding）

**Transfer-Encoding 响应标头**指示将有效载荷安全传递给用户所采用的编码形式。Transfer-Encoding 是逐跳标头，即仅应用于两个节点之间的消息传递，而不是所请求的资源本身。一个多节点连接中的每一段都可以应用不同的Transfer-Encoding 值。如果想要将压缩后的数据应用于整个连接，那么请使用端到端传输消息首部 Content-Encoding 。当这个消息首部出现在 HEAD 请求的响应中，而这样的响应没有消息体，那么它其实指的是应用在相应的 GET 请求的应答的值。可能的取值有，且允许以逗号分隔的多值：
1. chunked：数据以一系列分块的形式进行发送。 Content-Length 首部在这种情况下不被发送。在每一个分块的开头需要添加当前分块的长度，以十六进制的形式表示，后面紧跟着 '\r\n' ，之后是分块本身，后面也是'\r\n' 。终止块是一个常规的分块，不同之处在于其长度为 0。终止块后面是一个挂载（trailer），由一系列（或者为空）的实体消息首部构成。这在将大量数据发送到客户端并且在请求完全处理之前未知响应的总大小时非常有用。服务器会直接向客户端发送数据，而无需缓冲响应或确定确切长度，从而改善了延迟。分块传输与范围请求是兼容的，可以单独或搭配使用。
2. compress：采用 Lempel-Ziv-Welch (LZW) 压缩算法。这种内容编码方式已经被大部分浏览器弃用，部分因为专利问题（这项专利在 2003 年到期）。
3. deflate：采用 zlib 结构和 deflate 压缩算法。
4. gzip：表示采用 Lempel-Ziv coding (LZ77) 压缩算法，以及 32 位 CRC 校验的编码方式。处于兼容性的考虑，HTTP/1.1 标准提议支持这种编码方式的服务器应该识别作为别名的 x-gzip 指令。
5. identity：用于指代自身（例如：未经过压缩和修改）。除非特别指明，这个标记始终可以被接受。

**TE 请求标头**用来指定用户代理希望使用的传输编码类型。(可以将其非正式称为 Accept-Transfer-Encoding)。可能的标记取值（每个标记后可接质量价值（Quality values）`;q=<q>` 作权重）：
1. gzip：表示采用 Lempel-Ziv coding (LZ77) 压缩算法，以及 32 位 CRC 校验的编码方式。
2. compress：采用 Lempel-Ziv-Welch (LZW) 压缩算法。
3. deflate：采用 zlib 结构和 deflate 压缩算法。
4. trailers：表示客户端期望在采用分块传输编码的响应中接收挂载(trailer )首部。

**Trailer 响应首部**（Trailer: header-names）允许发送方在分块发送的消息后面添加额外的元信息，这些元信息可能是随着消息主体的发送动态生成的，比如消息的完整性校验，消息的数字签名，或者消息经过处理之后的最终状态等。header-names是出现在分块信息挂载部分的消息首部。以下首部字段不允许出现：
1. 用于信息分帧的首部 (例如Transfer-Encoding 和 Content-Length),
2. 用于路由用途的首部 (例如 Host)，
3. 请求修饰首部 (例如控制类和条件类的，如Cache-Control，Max-Forwards，或者 TE)，
4. 身份验证首部 (例如 Authorization 或者 Set-Cookie)，
5. Content-Encoding, Content-Type, Content-Range，以及 Trailer 自身。

## HTTP压缩

数据压缩是提高 Web 站点性能的一种重要手段。数据压缩会在三个不同的层面发挥作用：
1. **文件格式压缩**：某些格式的文件会采用特定的优化算法进行压缩。每一种文件类型都会存有冗余（即浪费的空间）。文件的压缩算法大致分为两类：
    1. 无损压缩。在压缩与解压缩的循环期间，不会对要恢复的数据进行修改。复原后的数据与原始数据是一致的（比特与比特之间一一对应）。对于图片文件来说，gif 或者 png 格式的文件就是采用了无损压缩算法。
    2. 有损压缩。在压缩与解压缩的循环期间，会对原始数据进行修改，但是会（希望）以用户无法觉察的方式进行。网络上的视频文件通常采用有损压缩算法，jpeg 格式的图片也是有损压缩。
    3. 特定的文件格式既可以采用无损压缩算法，又可以采用有损压缩算法，例如 webp，并且有损压缩算法可以对压缩比率进行配置，当然这会导致压缩品质的不同。为使站点获得更好的性能，理想情况是在保持可以接受的品质水准的前提下，压缩比率尽可能得高。对于图片来说，通过压缩工具生成的图片对于 Web 应用来说，优化程度可能依然不够高。一般建议选用在保持所要求的品质的前提下压缩比率尽可能高的工具。
2. **端到端压缩**：在HTTP 协议层面会进行通用数据加密，即数据资源会以压缩的形式进行端到端传输。端到端压缩技术指的是消息主体的压缩是在服务器端完成的，并且在传输过程中保持不变，无论中间节点如何，直到抵达客户端。建议对除了已经经过压缩的文件如图片、音频和视频文件之外的其他类型的文件均进行端到端压缩。

    ![](../public/basics/http/114.png)

    1. 浏览器和服务器通过主动协商机制：浏览器发送 Accept-Encoding 标头（包含有它所支持的压缩算法，以及各自的优先级），服务器从中选择一种对响应的消息主体进行压缩，并且发送 Content-Encoding 标头来告知所选择的算法。由于该内容协商过程是基于编码类型来选择资源的展现形式的，在响应时，服务器至少发送一个包含 Accept-Encoding 的 Vary 标头，这样，缓存才能够缓存资源的不同表示形式。

    ![](../public/basics/http/115.png)

    2. Apache 服务器支持数据压缩，有 mod_deflate可使用；nginx 中有ngx_http_gzip_module 模块；在 IIS 中则可以使用 `<httpCompression>` 元素。
3. **逐跳压缩**：在网络连接层面，数据压缩发生在 HTTP 连接的两个节点之间。这里的压缩指的不是对源头服务器上的资源的压缩，以此来创建一份特定的展现形式然后进行传输，而是对客户端与服务器端之间的任意两个节点（在单次转发层面使用传输编码和压缩非常罕见，以至于大多数服务器，例如 Apache、Nginx 或 IIS，没有简单的方法来配置它。此类配置通常发生在代理服务器层面）之间传递的消息的主体的压缩。在两个相邻的中间节点之间的连接上，可能会应用不同的压缩方式。

    ![](../public/basics/http/116.png)

    1. 节点使用 TE 标头（包含有它所支持的压缩算法，以及各自的优先级）发送请求，另外一个节点则从中选择合适的算法进行应用，然后在 Transfer-Encoding 标头中指出它所选择的方法。在实际应用中，逐跳压缩对于服务器和客户端来说是不可见的，并且很少使用。TE 标头和 Transfer-Encoding 标头最常用来发送分块响应，允许在获得资源的确切长度之前就可以开始传输。

    ![](../public/basics/http/117.png)

## HTTP 重定向

URL 重定向（也称为 URL 转发）是一种为页面、表单或者整个 Web 站点/应用提供多个 URL 地址的技术。

定义URL重定向的方法有：
1. HTTP 重定向（HTTP redirect）：是HTTP对URL 重定向操作的一种特殊类型的响应。在 HTTP 协议中，重定向操作由服务器向请求发送特殊的重定向响应而触发，除额外的往返操作存在性能损失外，该操作对于用户来说是透明的。重定向响应包含以 3 开头的状态码，以及 Location 标头（保存着重定向的 URL）。浏览器在接收到重定向时会立刻加载 Location 标头中提供的新 URL。HTTP 协议的重定向机制永远最先触发。HTTP重定向分为三个类型：

    ![](../public/basics/http/118.png)

    1. **临时重定向**：请求的资源无法从其标准地址访问，但是却可以从另外的地方访问时使用。搜索引擎和其他爬虫不会记录新的、临时的 URL。在创建、更新或者删除资源的时候，临时重定向也可以用于显示临时性的进度页面。
        1. 响应302	Found。GET 方法不会发生变更。其他方法有可能会变更为 GET 方法（（规范并不打算允许方法更改，但现有的用户代理确实会更改其方法）。典型的应用场景是由于不可预见的原因该页面暂不可用。 
        2. 响应303	See Other。GET 方法不会发生变更，其他方法会变更为 GET 方法（消息主体丢失）。典型应用场景是用于 PUT 或 POST 请求完成之后重定向，防止由于页面刷新导致的操作的重复触发。 
        3. 响应307	Temporary Redirect	。方法和消息主体都不发生变化。创建 307 是为了消除使用非 GET 方法时行为的歧义。典型的应用场景是由于不可预见的原因该页面暂不可用，当站点支持非 GET 方法的链接或操作时，该状态码优于 302。
    2. **永久重定向**：表示原 URL 不应再被使用，而选用新的 URL 替换它。搜索引擎机器人、RSS 阅读器以及其他爬虫将更新资源原始的 URL。
        1. 响应301 Moved Permanently。GET 方法不会发生变更，其他方法有可能会变更为 GET 方法（规范并不打算允许方法更改，但现有的用户代理确实会更改其方法）。典型应用场景是网站重构。
        2. 响应308 Permanent Redirect。方法和消息主体都不发生变化。创建 308 是为了消除使用非 GET 方法时行为的歧义。典型应用场景是使用非 GET 链接/操作重构网站。
    3. 特殊重定向：
        1. 响应300 Multiple Choice。这是手动重定向，即将消息主体以 Web 页面形式呈现在浏览器中，列出了可能的重定向链接，用户可以从中进行选择。相比把所有的选择在消息主体的 HTML 页面中列出，更鼓励将机器可读的选择作为带有 rel=alternate 的Link标头发送。
        2. 响应304 Not Modified。缓存失效但资源未发生变更时，会使页面跳转到本地的缓存副本中。典型应用场景是更新缓存的条件请求，表示本地缓存可继续使用。
2. 借助 HTML 的 `<meta>` 元素的 HTML 重定向机制：在页面的 `<head>` 中添加 http-equiv="Refresh" content="0; URL=http://example.com/" /> 元素，当显示页面的时浏览器会检测该元素，然后跳转到指定的http://example.com/ 页面，其中content 属性的值开头是的数字指示浏览器延迟跳转的秒数（建议始终将其设置为 0 来获取更好的无障碍体验）。应用场景是自己不能控制服务器，且仅适用于 HTML 页面（或类似的页面），然而并不能应用于图片或者其他类型的内容。HTML 的重定向机制 (`<meta>`) 会在没有任何 HTTP 协议重定向的情况下触发。如果可能，请采用 HTTP 协议的重定向机制，而不要使用 `<meta>` 元素重定向。
3. 借助 DOM 的 JavaScript 重定向机制：设置 window.location 的属性值，然后加载新的页面。与 HTML 重定向机制类似，它并不适用于所有类型的资源，并且显然只有在执行 JavaScript 的客户端上才能使用。

注意应该尽可能地限制其使用数量，因为每一次重定向都会带来性能上的开销。**重定向应用场景**：
1. **域名别称**：理想情况下，一项资源只有一个访问位置，也就是只有一个 URL。但是由于种种原因，需要为资源设定不同的名称
    1. 扩大站点的用户覆盖面：假如站点位于 www.example.com 域名下，那么通过 example.com 也应该可以访问到。这种情况下，可以建立从 example.com 的页面到 www.example.com 的重定向。此外还可以提供域名常见的同义词，或者该域名容易导致的拼写错误的别称来重定向到网站。
    2. 迁移到新的域名：公司改名后，你希望用户在搜索旧名称的时候，依然可以访问到应用了新名称的站点
    3. 强制使用 HTTPS：对网站的 http:// 版本的请求将重定向到网站的 https:// 版本。
2. **保持链接有效**：当重构 Web 站点的时候，资源的 URL 会发生改变。即便是更新站点内部的链接来匹配新的 URL，也无法控制被外部资源使用的 URL。此时并不想因此而使旧链接失效，因为它们会为你带来宝贵的用户并且帮助优化 SEO，所以需要建立从旧链接到新链接的重定向映射。
3. **对于不安全请求的临时响应**：不安全的请求会修改服务器端的状态，应该避免用户无意的重复发送它们，如果将响应作为此请求的结果，只需按一下重新加载按钮即可重新发送请求（可能在确认消息之后）。在这种情况下，服务器可以发回包含正确信息的 URL 的 303 See Other响应。如果按下重新加载按钮，则仅重新显示该页面，而不会重复提交不安全的请求。
4. **对于耗时请求的临时响应**：一些请求的处理会需要比较长的时间，比如有时候 DELETE 请求会被安排为稍后处理。在这种情况下，会返回一个 303 See Other重定向响应，该响应链接到一个页面，表示请求的操作已经被列入计划，并且最终会通知用户操作的进展情况，或者允许用户将其取消。

通用服务器中配置重定向：
1. Apache：重定向可以在服务器的配置文件中设置，也可以在每一个文件目录的 .htaccess 文件中设置。mod_alias 模块提供了 Redirect 和 Redirect_Match 两种指令来设置，其中Redirect_Match 指令可以通过正则表达式来指定一批受影响的 URL，默认设置的是302响应，可以使用额外参数（要么使用的 HTTP 状态码，比如301，要么设置关键字，比如 permanent ）来设置不同的重定向。mod_rewrite 模块也可以用来设置重定向。
2. Nginx：可以创建一个server模块进行重定向设置，如果要将重定向应用于目录或者仅是部分页面，则使用 rewrite 指令。
3. IIS：可以使用 `<httpRedirect>` 元素来配置重定向。

### HTTP 重定向相关标头（Redirects）

**Location 响应标头**（`Location: <url>` 其中 `<url>` 是相对（相对于请求 URL）或绝对 URL）指定的是需要将页面重新定向至的地址。一般在响应码为 3xx 的响应中才会有意义。发送新请求获取 Location 指向的新页面所采用的方法与初始请求使用的方法以及重定向的类型相关：
1. 303 See Also始终导致请求使用 GET 方法，而 307 Temporary Redirect和 308 Permanent Redirect则不转变初始请求中的所使用的方法；
2. 301 Permanent Redirect和 302 Found在大多数情况下不会转变初始请求中的方法，不过一些比较早的用户代理可能会引发方法的变更。

以上响应都会带Location 首部。此外，状态码为 201 Created的消息也会带有 Location 首部。Location 指定的是一个重定向请求的目的地址（或者新创建的文件的 URL），而Content-Location指向的是经过内容协商后的资源的直接地址，不需要进行进一步的内容协商。Location 对应的是响应，而 Content-Location 对应的是要返回的实体。

## HTTP 认证

在安全协议中，质询（challenge）是服务器将某些数据发送到客户端，以便每次生成不同的响应。**质询—响应认证协议**是防御**重放攻击**的一种方法。在重放攻击中，攻击者侦听先前的消息，并在以后的时间重新发送它们，以获取与原始消息相同的凭据。

HTTP 认证协议即通用的 HTTP 认证框架是基于质询—响应认证协议的，尽管“Basic”协议未使用实际的质询（realm 始终相同）。服务器可以使用它来质询客户端请求，客户端可以使用它来提供身份验证凭据。质询与响应的工作流程如下：
1. 服务器端向客户端返回 401（Unauthorized，未被授权的）响应状态码，并在 WWW-Authenticate 响应标头提供如何进行验证的信息，其中至少包含有一种质询方式。
2. 想要使用服务器对自己身份进行验证的客户端，可以通过包含凭据的 Authorization 请求标头进行验证：通常，客户端会向用户显示密码提示，然后发送包含正确的 Authorization 标头的请求。

![](../public/basics/http/119.png)

以上质询和响应机制可用于代理身份验证，但由于资源身份验证和代理身份验证可以共存，因此需要一组不同的标头和状态码。对于代理，质询状态码为 407 Proxy Authentication Required，其中Proxy-Authenticate 响应标头包含至少一个适用于代理的质询，Proxy-Authorization 请求标头用于向代理提供凭据服务器：
1. 如果代理服务器收到无效的凭据，它应该响应 401 Unauthorized 或 407 Proxy Authentication Required，用户可以发送新的请求或替换 Authorization 标头字段。
2. 如果代理服务器接受的有效凭据不足以访问给定的资源，服务器将响应 403 Forbidden 状态码，与 401 Unauthorized 或 407 Proxy Authentication Required 不同的是，该用户无法进行身份验证并且浏览器不会提出新的的尝试。
3. 在所有情况下，服务器更可能返回 404 Not Found 状态码，以向没有足够权限或者未正确身份验证的用户隐藏页面的存在。

HTTP 认证采用的字符编码：浏览器使用 utf-8 编码用户名和密码。

一个潜在的安全漏洞（现已在浏览器中修复）是跨站点图像的身份验证。从 Firefox 59 开始，从不同来源加载到当前文档的图像资源不再能够触发 HTTP 身份验证对话框，从而防止攻击者能够将任意图像嵌入第三方页面时窃取用户凭据。

通用 HTTP 身份验证框架可以被多个验证方案使用。不同的验证方案会在安全强度以及在客户端或服务器端软件中可获得的难易程度上有所不同。常见的验证方案包括：
1. Basic：使用用户的 ID/密码作为凭据信息，并且使用 base64 算法进行编码。由于用户 ID 与密码是是以明文的形式在网络中进行传输的（尽管采用了 base64 编码，但是 base64 算法是可逆的），所以Basic验证方案并不安全。basic 验证方案应与 HTTPS/TLS 协议搭配使用。假如没有这些安全方面的增强，那么 basic 验证方案不应该被来用保护敏感或者极具价值的信息。
    1. 使用 Apache 限制访问和 basic 身份验证：需要 .htaccess 和 .htpasswd 文件。该 .htaccess 文件引用一个 .htpasswd 文件（每行用冒号（:）分隔的用户名和密码）。可以命名 .htpasswd 文件为其他名字，但是应该保证这个文件不被其他人访问(Apache 通常配置阻止访问 .ht* 类的文件)。
    2. nginx 访问限制和 basic 认证：指定一个要保护的 location 并且 auth_basic 指令提供密码保护区域的名称。而auth_basic_user_file 指令指定包含加密的用户凭据 .htpasswd 文件
2. Bearer：bearer 令牌通过 OAuth 2.0 保护资源。
3. Digest：Firefox 93 及更高版本支持 SHA-256 算法。以前的版本仅支持 MD5 散列（不建议）。
4. HOBA：HTTP Origin-Bound 认证，基于数字签名。
5. Mutual
6. Negotiate / NTLM
7. VAPID
8. SCRAM
9. AWS4-HMAC-SHA256：用于 AWS3 服务器验证。

### HTTP认证相关标头（Authentication）

**WWW-Authenticate 响应标头**定义了 HTTP 身份验证的方法（“质询”），它用于获取特定资源的访问权限。该标头是通用的 HTTP 认证框架的一部分，可用于多种身份验证方案。每个“质询”都列出了服务器支持的方案以及为该方案类型添加的额外参数。使用 HTTP 身份验证的服务器将以 401 Unauthorized 响应去响应受保护资源的请求。该响应必须包含至少一个 WWW-Authenticate 标头和至少一个质询，以指示使用哪些身份验证方案访问资源（以及每个特定方案的任意额外的数据）。一个 WWW-Authenticate 标头中允许以逗号分隔的多个质询，一个响应也允许多个 WWW-Authenticate 标头，单个质询的格式为 `WWW-Authenticate: <auth-scheme> realm=<realm> token68 auth-param1=auth-param1-token , ..., auth-paramN=auth-paramN-token。这些方案的 token（<auth-scheme>`）是强制性的，而realm、token68 以及其他参数的存在依赖于所选方案的定义。服务器也可以在其他的响应消息中包含 WWW-Authenticate 标头，以指示提供的凭据可能会影响响应。客户端在接收 WWW-Authenticate 标头之后，通常会提示用户接收凭据，然后重新请求资源。这个新的请求会使用Authorization标头向服务器提供凭据，并针对所选择的“质询”身份验证方法进行合适的编码。客户端应该选择它理解的最安全的质询。

**Authorization 请求标头**（`Authorization: <type> <credentials>`）用于提供服务器验证用户代理身份的凭据，允许访问受保护的资源。Authorization 标头通常在用户代理首次尝试请求受保护的资源（没有携带凭据）之后发送的，但并不总是发送。服务器响应一条 401 Unauthorized 信息，其中包含至少一个 WWW-Authenticate 标头。该标头表示哪些身份验证的方案可用于访问资源（以及客户端使用它们时需要的额外的信息）。用户代理应该从这些提供的身份验证方案中选择它支持的最安全的身份验证方案，并提示用户提供凭据，然后重新获取资源（包含 Authorization 标头中编码的凭据）。

**Proxy-Authenticate 响应标头**（`Proxy-Authenticate: <type> realm=<realm>`，其中 `<type>` 是身份验证方案，`realm=<realm>` 中的 `<realm>` 是对于被保护区域（即安全域）的描述。如果没有指定安全域，客户端通常用一个格式化的主机名来代替）指定了获取**代理服务器**上的资源访问权限而采用的身份验证方式。代理服务器对请求进行验证，以便它进一步传递请求。它需要与 407 Proxy Authentication Required 响应一起发送。

**Proxy-Authorization 请求标头**（`Proxy-Authorization: <type> <credentials>` 其中 `<type>` 是身份验证方案，`<credentials>` 是身份验证的值）包含了用户代理提供给**代理服务器**的用于身份验证的凭证。它通常是在服务器返回407 Proxy Authentication Required 响应状态码及 Proxy-Authenticate 首部后发送的。在使用basic身份验证方案的时候推荐与 HTTPS 搭配使用，因为其中Base64 编码的安全性相当于将凭证使用明文发送。

## HTTP CORS（跨源资源共享）

出于安全性，浏览器限制脚本内发起的跨源 HTTP 请求。例如，XMLHttpRequest 和 Fetch API 遵循同源策略。这意味着除非响应报文包含了正确 CORS 响应头，使用这些 API 的 Web 应用程序只能从加载应用程序的同一个源请求 HTTP 资源。

跨源资源共享（CORS，Cross-Origin Resource Sharing，或通俗地译为跨域资源共享）是一种基于 HTTP 标头的机制，允许服务器指示除其自身之外的任何源（域、方案或端口），浏览器应允许从中加载资源。比如运行在 https://domain-a.com 的 JavaScript 代码使用 XMLHttpRequest 或Fetch API来发起一个到 https://domain-b.com/data.json 的请求。

![](../public/basics/http/120.png)

默认情况下，XMLHttpRequest 或 Fetch具有跨域安全策略限制即只能访问同源资源（协议-域名-端口相同）（可能是浏览器直接限制发起请求，也可能是请求响应被浏览器拦截），跨源会抛出 DOMException “INVALID_ACCESS_ERR” 异常。

浏览器将CORS请求分为两种：简单请求和**非简单请求（即 CORS 预检请求）**。

**满足以下全部条件的请求即简单请求**（在废弃的 CORS 规范中，目前的 Fetch 规范（CORS 的现行定义规范）中不再使用这个词语）：
1. http方法是get、post、head之一；
2. 使用CORS规定的安全首部集合中的字段：Accept、Accept-Language、Content-Language、Content-Type （只能是text/plain、multipart/form-data、application/x-www-form-urlencoded之一）、DPR、Downlink、Save-Data、Viewport-Width、Width；
3. Content-Type 标头所指定的媒体类型的值仅限于下列三者之一： text/plain、multipart/form-data、application/x-www-form-urlencoded。
4. 请求中的任意XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象使用 XMLHttpRequest.upload 属性访问；
5. 请求中没有使用 ReadableStream 对象。

![](../public/basics/http/121.png)

简单请求使用 Origin 和 Access-Control-Allow-Origin 就能完成最简单的访问控制。

CORS 预检请求是用于检查服务器是否支持 CORS 即跨域资源共享。“需预检的请求”要求必须首先使用 OPTIONS 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。"预检请求“的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响。**真正的POST 请求不会携带 Access-Control-Request-* 标头，它们仅用于 OPTIONS 请求。如果浏览器发现服务端并不支持该请求，则会在控制台抛出错误**。

![](../public/basics/http/122.png)

**并不是所有浏览器都支持预检请求的重定向**。如果一个预检请求发生了重定向，一部分浏览器将报告错误。CORS 最初要求浏览器具有该行为，不过在后续的修订中废弃了这一要求。但并非所有浏览器都实现了这一变更，而仍然表现出最初要求的行为。在浏览器的实现跟上规范之前，有两种方式规避上述报错行为：
1. 更改服务器端行为以避免预检和避免重定向。
2. 更改请求使其成为不会导致预检的简单请求。

如果难以做到，另一个方法是：发出一个简单的请求，使用 XMLHttpRequest.responseURL或 Fetch API 的 Response.url来确定实际预检请求最终到达的UR，然后使用该 URL 发出实际的请求。但如果请求是由于存在 Authorization 字段而引发了预检请求，则只能由服务端进行更改。

默认情况下，跨源 XMLHttpRequest 或 Fetch 请求，浏览器不会发送身份凭证信息（cookie、HTTP认证及客户端SSL证明等），而且不能使用 setRequestHeader() 设置自定义头部以及调用 getAllResponseHeaders() 方法总会返回空字符串。如果要发送凭证信息，需要设置 XMLHttpRequest 对象的withCredentials标志，或在构造 Request 对象时设置。

对于携带凭据的简单请求，如果服务器端的响应中未携带 Access-Control-Allow-Credentials: true，浏览器将不会把响应内容返回给请求的发送者。

CORS 预检请求不能包含凭据。预检请求的响应必须指定 Access-Control-Allow-Credentials: true 来表明可以携带凭据进行实际的请求。某些企业身份验证服务要求在预检请求中发送 TLS 客户端证书，这违反了 Fetch 规范。Firefox 87 允许通过将首选项network.cors_preflight.allow_client_cert设置为true启用此不合规行为。基于 Chromium 的浏览器目前始终在 CORS 预检请求中发送 TLS 客户端证书。在响应附带身份凭证的请求时，服务器不能将 Access-Control-Allow-Origin 的值设为通配符 `“*”`，而应将其设置为特定的域；服务器不能将 Access-Control-Allow-Headers 的值设为通配符 `“*”`，而应将其设置为标头名称的列表；服务器不能将 Access-Control-Allow-Methods 的值设为通配符 `“*”`，而应将其设置为特定请求方法名称的列表。

当发出跨源请求时，第三方 cookie 策略（受 SameSite 属性控制）仍将适用。无论如何改变CORS相关的服务器和客户端的设置，该策略都会强制执行，即强制执行的 cookie 策略可能会阻止发出任何携带凭据的请求。

**浏览器CORS允许的应用场景**：
1. 由 XMLHttpRequest 或 Fetch 发起的跨源 HTTP 请求
2. Web 字体（CSS 中通过 @font-face 使用跨源字体资源），因此，网站就可以发布 TrueType 字体资源，并只允许已授权网站进行跨站调用。
3. WebGL 贴图。
4. 使用 drawImage 将 Images/viedo 画面绘制到 Canvas。
5. 来自图像的 CSS 图形。

检测XMLHttpRequest是否支持CORS的最简单方式：检查是否存在 withCredentials属性。再结合检测 XDomainRequest 对象是否存在。

### HTTP CORS相关标头

**Access-Control-Allow-Origin 响应标头**指定了该响应的资源是否被允许与给定源共享。可能的取值有：
1. `*`：对于不包含凭据的请求，服务器会以 `“*”` 作为通配符，从而允许任意来源的请求都具有访问资源的权限。尝试使用通配符来响应包含凭据的请求会导致错误（Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'）。
2. `<origin>`：指定且只能指定一个来源。因此，如果需要将可能的 Access-Control-Allow-Origin 值限制在一组允许的源，则需要服务器端的代码检查 Origin 请求标头的值，将其与允许的来源列表进行比较，如果Origin值在列表中，才将 Access-Control-Allow-Origin 设置为与 Origin 标头相同的值。如果服务器未使用通配符“*”，而是指定了明确的来源，那么为了向客户端表明服务器的返回会根据 Origin 请求标头而有所不同，必须在 Vary 响应标头中包含 Origin。
3. null：null 不应该被使用，返回 Access-Control-Allow-Origin: null 似乎是安全的，但任何使用非分级协议（如 data: 或 file:）的资源和沙盒文件的源的序列化都被定义为‘null’。许多用户代理将授予这类文件对带有 Access-Control-Allow-Origin: null 标头的响应的访问权，而且任何源都可以用 null 源创建一个恶意文件。因此，应该避免将 ACAO 标头设置为‘null’值。

**Access-Control-Allow-Credentials 响应标头**（唯一有效值true，且区分大小写，如果不需要 credentials，请完全省略此标头，而不是将其值设置为 false）用于在请求要求包含 credentials（Request.credentials 的值为 include）时，告知浏览器是否可以将对请求的响应暴露给前端 JavaScript 代码。Access-Control-Allow-Credentials 标头需要与 XMLHttpRequest.withCredentials 或 Fetch API 的 Request() 构造函数中的 credentials 选项结合使用。Credentials 必须在前后端都被配置（即 Access-Control-Allow-Credentials header 和 XHR 或 Fetch request 中都要配置）才能使带 credentials 的 CORS 请求成功。因此，若请求带了 credentials，如果Access-Control-Allow-Credentials响应头没有随资源返回，响应就会被浏览器忽视，不会返回到 web 内容。

**Access-Control-Allow-Headers 响应标头**（`Access-Control-Allow-Headers: [<header-name>[, <header-name>]*]`）用于预检请求中，它列出了将会在正式请求的 Access-Control-Request-Headers 请求标头中出现的首部列表，用逗号分隔。简单请求标头始终是被支持的，不需要在Access-Control-Allow-Headers中特意列出。对于没有凭据的请求（没有 HTTP cookie 或 HTTP 认证信息的请求），值“ *”仅作为特殊的通配符值。在具有凭据的请求中，它被视为没有特殊语义的文字标头名称“ *”。请注意，Authorization标头不能使用通配符，并且始终需要显式列出。

**Access-Control-Allow-Methods 响应标头**（`Access-Control-Allow-Methods: <method>, <method>, ...`）在对预检请求的响应中列出了客户端所要访问的资源允许使用的方法或方法列表。对于没有凭据的请求（没有 HTTP cookie 或 HTTP 认证信息的请求），值“ *”仅作为特殊的通配符值。在具有凭据的请求中，它被视为没有特殊语义的文字标头名称“ *”。

**Access-Control-Expose-Headers 响应标头**（`Access-Control-Expose-Headers: [<header-name>[, <header-name>]*]`）允许服务器指示那些响应标头可以暴露给前端 JavaScript 代码，以响应跨源请求，用逗号分隔。默认情况下，仅暴露 CORS 安全列表的响应标头。如果想要让客户端可以访问到其他的标头，服务器必须将它们在 Access-Control-Expose-Headers 里面列出来。对于没有凭据的请求（没有 HTTP cookie 或 HTTP 认证信息的请求），值“ *”仅作为特殊的通配符值。在具有凭据的请求中，它被视为没有特殊语义的文字标头名称“ *”。请注意，Authorization标头不能使用通配符，并且始终需要显式列出。

**Access-Control-Max-Age 响应标头**（`Access-Control-Max-Age: <delta-seconds>`）表示预检请求的返回结果，即 Access-Control-Allow-Methods 和Access-Control-Allow-Headers 提供的信息可以被缓存多久（秒）。在有效时间内，浏览器无须为同一请求再次发起预检请求。在 Firefox 中，上限是 24 小时 （即 86400 秒）。 在 Chromium v76 之前， 上限是 10 分钟（即 600 秒）。 从 Chromium v76 开始，上限是 2 小时（即 7200 秒）。 Chromium 同时规定了一个默认值 5 秒。如果值为 -1，表示禁用缓存，则每次请求前都需要使用 OPTIONS 预检请求。

**Access-Control-Request-Headers 请求标头**（`Access-Control-Request-Headers: <header-name>, <header-name>, ...`）出现于预检请求中，用于通知服务器在真正的请求中会采用哪些请求头。Access-Control-Allow-Headers 将响应该标头。

**Access-Control-Request-Method 请求标头**（`Access-Control-Request-Method: <method>`）出现于预检请求中，用于通知服务器在真正的请求中会采用哪种 HTTP 方法。因为预检请求所使用的方法总是 OPTIONS ，与实际请求所使用的方法不一样，所以这个请求头是必要的。

**Origin 请求标头**（`Origin: null或Origin: <scheme>://<hostname>或Origin: <scheme>://<hostname>:<port>`）表示了请求的来源（协议、主机、端口）。例如，如果一个用户代理需要请求一个页面中包含的资源，或者执行脚本中的 HTTP 请求（fetch），那么该页面的来源（origin）就可能被包含在这次请求中。null表示请求的来源是“隐私敏感”的，或者是 HTML 规范定义的不透明来源。`<scheme>` 是请求所使用的协议，通常是 HTTP 协议或者它的安全版本（HTTPS 协议）。`<hostname>` 是来源的域名或 IP 地址。`<port>` 是可选的，表示服务器正在监听的端口号，缺省为服务的默认端口（对于 HTTP 而言，默认端口为 80）。Origin 标头与 Referer 标头类似，但前者不会暴露 URL 的 path 部分，而且其可以为 null 值。其用于为源站的请求提供“安全上下文”，除非源站的信息敏感或不必要的。从广义上讲，用户代理会在除no-cors 模式下的跨源请求和除GET、HEAD以外的同源请求中添加 Origin 请求标头。Origin 标头在以下情况中（不完整）会被设置为 null：
1. 请求来源的协议不是 http、https、ftp、ws、wss 或 gopher 中的任意一个（如：blob、file 和 data）。
2. 跨源的图像或媒体，包括：`<img>`、`<video>` 和 `<audio>` 元素。
3. 属于以下几种文档类型的：使用 createDocument() 创建的、通过 data: URL 生成的或没有创建者的浏览上下文的。
4. 跨源重定向。
5. 没有为 sandbox 属性设置 allow-same-origin 值的 iframe。
6. 响应（response）是网络错误。

**Timing-Allow-Origin 响应标头**（`Timing-Allow-Origin:[<origin>[, <origin>]*]`）用于指定以允许访问Resource Timing API提供的相关信息的特定站点，否则这些信息会由于跨源限制将被报告为零。*表示允许所有域都具有访问定时信息的权限。

### 常见CORS错误及解决方案

当请求因 CORS 失败时，浏览器会在其控制台中显示消息。常见的 CORS 错误消息：
1. **Reason: CORS disabled**。发送了一个需要使用 CORS 的请求，但在用户的浏览器中禁用了 CORS。发生这种情况时，用户需要在浏览器的首选项中重新打开 CORS，比如Firefox的禁用 CORS 的首选项是 content.cors.disable。
2. **Reason: CORS header 'Access-Control-Allow-Origin' does not match 'xyz'**。发出请求的源不能与 Access-Control-Allow-Origin 标头允许的源相匹配。如果响应包含多个 Access-Control-Allow-Origin 标头，也会发生此错误。如果代码使用 CORS 请求访问的服务在自己的控制之下，请确保在它的 Access-Control-Allow-Origin 标头中包含了当前源。此外，确定响应中只有一个Access-Control-Allow-Origin，并且它只能包含一个单独的源。在 Apache 中，将Header set Access-Control-Allow-Origin 'origin' 行添加到服务器的配置中（在相应的 `<Directory>`、`<Location>`、`<Files>` 或 `<VirtualHost>` 部分中）。配置通常位于 .conf 文件中（httpd.conf 和 apache.conf 是这些文件的通用名称）或者位于 .htaccess 文件中。而在 Nginx 中，对应的配置为add_header 'Access-Control-Allow-Origin' 'origin'。
3. **Reason: CORS header 'Access-Control-Allow-Origin' missing**：对 CORS 请求的响应缺少必需的 Access-Control-Allow-Origin 标头，该标头用于确定在当前源中的操作是否可以访问资源。如果服务器在自己的控制之下，请将请求站点的源添加到允许访问的域集，方法是将其添加到 Access-Control-Allow-Origin 标头的值。如果要在不使用 * 通配符的情况下让任意站点发出 CORS 请求，服务器必须读取请求的 Origin 标头，将那个值设置为 Access-Control-Allow-Origin 的值，且必须一并设置 Vary: Origin 标头，表明一部分标头由源动态决定。
4. **Reason: CORS header 'Origin' cannot be added**：用户代理不能把所需的 Origin 标头添加到 HTTP 请求中。所有的 CORS 请求必须有 Origin 标头。例如，如果 JavaScript 代码以增强的权限运行，允许它访问多个域名的内容，则会发生这种情况。
5. **Reason: CORS preflight channel did not succeed：CORS 请求需要预校验，但是不能执行预校验。原因可能是：a. 一个跨站请求在先前已经进行过预校验，进行重复的校验是不被允许的。请确保代码每次连接只进行一次预校验。b. 预校验请求碰到了通常情况下不应该发生的网络问题。
6. **Reason: CORS request did not succeed**：使用 CORS 的 HTTP 请求失败，因为 HTTP 连接在网络或协议级别失败。该错误与 CORS 没有直接关系，而是某种基本的网络错误。很多情况下，它是某个浏览器插件（比如广告拦截或隐私保护插件）阻止了请求而引起的。其他可能的原因：a. 尝试访问拥有无效凭证的 https 资源将导致此错误。b. 尝试从 https 源页面访问 http 资源将也会导致此错误。c. 从 Firefox 68 开始，https 页面不允许去访问 http://localhost。d. 服务器不能响应真实的请求（即使它响应了预检请求）。一种情况是正在开发的 HTTP 服务器发生异常停止，而且没有返回任何数据。
7. **Reason: CORS request external redirect not allowed**：服务器响应了 CORS 请求，并将 HTTP 重定向到与原始请求不同源的 URL 上，这在 CORS 请求期间是不允许的。
8. **Reason: CORS request not HTTP**：CORS 请求只能用于 HTTP 或 HTTPS URL 方案，但请求指定的 URL 可能是不同类型。这种情况经常发生在 URL 指定本地文件，例如使用了 file:/// 的 URL。来自相同的目录或者子目录的本地文件在历史上被视为同源的。这意味着在测试期间可以从本地目录或子目录加载文件以及它的所有子资源，而不会触发 CORS 错误。但是现在很多浏览器，包括 Firefox 和 Chrome，现在将所有本地文件视为不透明来源（默认）。因此，加载包含本地资源的本地文件现在会导致 CORS 错误。开发者如果想要在本地进行测试，现在要设置一个本地服务器。由于所有的文件都来自同种方案和域（localhost），它们都有相同的源，并不会触发跨源错误。
9. **`Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'`**：CORS 请求是在设置了凭证标志的情况下尝试的，但服务端使用通配符（"*"）配置 Access-Control-Allow-Origin 的值，这样是不允许使用凭证的。要在客户端改正这个问题，只需要确保发出 CORS 请求时将凭证标志设置为 false：a. 如果使用 XMLHttpRequest 发出请求，确保未将 withCredentials 设置为 true；b. 如果使用服务器发送事件，确保 EventSource.withCredentials的值为 false（false 为默认值）；c. 如果使用 Fetch API，确保 Request.credentials 的值为 "omit"。如果还不成功，则需要修改服务端的行为，可能需要修改 Access-Control-Allow-Origin 的值，来为客户端所能够加载资源的源予以授权。
10. **Reason: Did not find method in CORS header 'Access-Control-Allow-Methods'**：CORS 请求使用的 HTTP 方法不包含在响应的 Access-Control-Allow-Methods 标头指定的方法列表中。此标头指定了一个使用逗号分隔的 HTTP 方法列表，当使用 CORS 访问请求中指定的 URL 时，可以使用这些方法；如果请求使用任何其他方法，则会发生此错误。
11. **Reason: expected 'true' in CORS header 'Access-Control-Allow-Credentials'**：CORS 请求要求服务器允许使用凭据，但是服务器的 Access-Control-Allow-Credentials 标头的值并没有设置为 true。要在客户端改正这个问题，只需要确保发出 CORS 请求时将凭证标志设置为 false：a. 如果使用 XMLHttpRequest 发出请求，确保未将 withCredentials 设置为 true；b. 如果使用服务器发送事件，确保 EventSource.withCredentials的值为 false（false 为默认值）；c. 如果使用 Fetch API，确保 Request.credentials 的值为 "omit"。想要通过更改服务器的配置来消除此错误，请调整服务器的配置以将 Access-Control-Allow-Credentials 标头的值设置为 true。
12. **Reason: invalid token 'xyz' in CORS header 'Access-Control-Allow-Headers'**：服务器发送的对 CORS 请求的响应包含 Access-Control-Allow-Headers 标头，并且至少含有一个无效的标头名称。这很有可能只能在服务端解决，方法是修改服务器的配置以不再发送带有 Access-Control-Allow-Headers 标头的无效或未知标头名称。
13. **Reason: invalid token 'xyz' in CORS header 'Access-Control-Allow-Methods'**：服务器发送的对 CORS 请求的响应包含 Access-Control-Allow-Methods 标头信息，并且含有至少一个无效的方法名称。这很有可能只能在服务端解决，方法是修改服务器的配置以不再发送带有 Access-Control-Allow-Methods 标头的无效或未知方法名称。
14. **Reason: missing token 'xyz' in CORS header 'Access-Control-Allow-Headers' from CORS preflight channel**：尝试预检未明确允许的标头时会发生此错误（即，它不包含在服务器发送的 Access-Control-Allow-Headers 标头指定的列表中）。要解决此问题，需要更新服务器以允许指定的标头，或者需要避免使用该标头。
15. **Reason: Multiple CORS header 'Access-Control-Allow-Origin' not allowed**：服务器返回了多个 Access-Control-Allow-Origin 标头。这是不允许的。如果有权访问该该服务器，请更改实现以在 Access-Control-Allow-Origin 标头返回该源。且不能发回源列表，因为浏览器仅接受单一的源或者空值。

## HTTP 权限策略

**权限策略**为网站开发人员提供了**明确声明哪些特性可以或不可以在网站上使用的机制**，即定义一组“策略”，限制网站代码可以访问哪些 API，或者修改浏览器对某些特性的默认行为，比如：
1. 改变手机和第三方视频自动播放的默认行为。
2. 限制网站使用相机、麦克风、扬声器等敏感设备。
3. 允许 iframe 使用全屏 API。
4. 如果项目在视口中不可见则停止对其进行脚本处理以提高性能。

权限策略曾经被称为特性策略（Feature Policy，对应于过去的HTTP标头是Feature-Policy）。

权限策略允许控制哪些源可以使用哪些特性，无论是在顶层页面还是在嵌入的 `<iframe>` 中。脚本会继承其浏览上下文的策略，而不管其源如何。这意味着顶层的脚本会继承主文件的策略。权限策略提供两种指定策略的方法：
1. Permissions-Policy HTTP 标头，控制收到的响应和页面内任何嵌入的内容（包括 `<iframe>`）。
2. `<iframe>` 的 allow 属性，控制在特定 `<iframe>` 中使用的特性。allow属性中特性的默认行为总是 src。通过在 allow 属性中包含一个分号分隔的策略指令列表，可以同时控制多个特性。默认情况下，如果一个 `<iframe>` 导航到另一个源，策略就不会应用到 `<iframe>` 导航到的源。通过在 allow 属性中列出 `<iframe>` 导航到的源，应用于原始 `<iframe>` 的许可策略将被应用于 `<iframe>` 导航到的源。

所有 `<iframe>` 都继承其父页的策略。如果 `<iframe>` 有一个 allow 属性，并且父页面有一个 Permissions-Policy 标头，父页面和 allow 属性的策略将被合并，使用最严格的子集。对于一个 `<iframe>` 来说，要启用一种特性，其源必须是在父页和 allow 属性的允许列表中。

### HTTP 权限策略相关标头

**Permissions-Policy 响应标头**（`Permissions-Policy: <directive>=<allowlist>`）提供了一种可以在本页面或包含的 iframe 上启用或禁止浏览器特性的机制。`<directive>` 是应用到allowlist的权限策略指令，指令确定了要控制的特性名称。可能的指令取值有：
1. accelerometer：控制是否允许当前文档通过 Accelerometer接口收集有关设备加速度的信息。
2. ambient-light-sensor：控制当前文档是否允许通过 AmbientLightSensor 接口收集有关设备周围环境的光量信息。
3. autoplay：控制是否允许当前文档自动播放媒体。
4. battery：控制当前文档是否允许通过 Navigator.getBattery() 获取的 BatteryManager 接口收集有关设备电池的信息。
5. camera：控制是否允许当前文档使用视频输入设备。
6. display-capture：控制文档是否允许使用Screen Capture API，即getDisplayMedia()来捕获屏幕内容。
7. document-domain：控制是否允许当前文档设置 document.domain。
8. encrypted-media：控制是否允许当前文档使用 Encrypted Media Extension API（EME）。
9. fullscreen：控制是否允许当前文档使用 Element.requestFullScreen()。
10. execution-while-not-rendered：控制任务是否应该在未渲染的帧中执行（例如，如果 iframe 被隐藏或设置了 display: none）。具体来说，如果定义的策略在未呈现内容时阻止执行任务呈现，则当该条件为真时，该内容将处于Page Lifecycle API 中定义的冻结状态。这会停止执行可冻结任务，例如 JavaScript 计时器（例如 setTimeout()）和 fetch() 回调。
11. execution-while-out-of-viewport：控制任务在可见视口之外时是否应在帧中执行。具体来说，如果定义的策略在未呈现内容时阻止执行任务呈现，则当该条件为真时，该内容将处于Page Lifecycle API 中定义的冻结状态。这会停止执行可冻结任务，例如 JavaScript 计时器（例如 setTimeout()）和 fetch() 回调。
12. gamepad：控制当前文档是否允许使用 Gamepad API。
13. geolocation：控制是否允许当前文档使用 Geolocation 接口。
14. gyroscope：控制是否允许当前文档通过Gyroscope接口（陀螺仪）收集有关设备方向的信息。
15. hid：控制是否允许当前文档使用 WebHID API 连接到不常见或奇异的人机界面设备，例如替代键盘或游戏手柄。具体来说，如果定义的策略阻止 WebHID 使用，则 Navigator.hid 属性将不可用。
16. identity-credentials-get：控制是否允许当前文档使用Federated Credential Management API (FedCM) ，更具体地说是带有身份选项的 navigator.credentials.get() 方法。
17. idle-detection：控制是否允许当前文档使用Idle Detection API  来检测用户何时与其设备交互，例如报告聊天应用程序中的“可用”/“离开”状态。
18. local-fonts：控制是否允许当前文档通过 Window.queryLocalFonts() 方法收集有关用户本地安装的字体的数据。
19. magnetometer：控制是否允许当前文档通过Magnetometer接口（磁力计）收集有关设备方向的信息。
20. microphone：控制是否允许当前文档使用音频输入设备。
21. midi：控制是否允许当前文档使用 Web MIDI API 。
22. otp-credentials：控制是否允许当前文档使用 WebOTP API 从应用程序服务器发送的特殊格式SMS 消息中请求一次性密码 (OTP)，即通过 navigator.credentials.get({otp: ... ，...}）。
23. payment：控制是否允许当前文档使用 Payment Request API。
24. picture-in-picture：控制当前文档是否允许以画中画模式播放视频。
25. publickey-credentials-create：控制是否允许当前文档使用 Web Authentication API 创建新的 WebAuthn 凭据，即通过 navigator.credentials.create({publicKey})。
26. publickey-credentials-get：控制是否允许当前文档访问 Web Authentication API 以检索公钥凭据，即通过 navigator.credentials.get({publicKey})。
27. screen-wake-lock：控制当前文档是否允许使用 Screen Wake Lock API 来指示设备不应调暗或关闭屏幕。
28. serial：控制当前文档是否允许使用 Web Serial API与串行设备进行通信，即通过串行端口直接连接，或通过USB或蓝牙设备模仿串行端口。
29. speaker-selection：控制当前文档是否允许枚举和选择音频输出设备（扬声器、耳机等）。具体来说，MediaDevices.enumerateDevices() 不会返回音频输出类型的设备。MediaDevices.selectAudioOutput() 不会显示用于选择音频输出的弹出窗口，并且返回的 Promise 将拒绝并返回 NotAllowedError 类型的 DOMException。如果调用音频输出，HTMLMediaElement.setSinkId() 和 AudioContext.setSinkId() 将抛出 NotAllowedError。
30. storage-access：控制是否允许在第三方上下文中加载的文档（即嵌入 `<iframe>` 中）使用Storage Access API来请求访问未分区的 cookie。默认情况下，用户代理会阻止第三方上下文中加载的站点访问未分区的 cookie，以提高隐私性（例如，防止跟踪）。
31. usb：控制当前文档是否允许使用WebUSB API。具体来说，如果定义的策略阻止 WebHID 使用，则 Navigator.usb 属性将不可用。
32. web-share：控制是否允许当前文档使用 Web Share API 的 Navigator.share() 方法将文本、链接、图像和其他内容共享到用户选择的任意目的地。
33. xr-spatial-tracking：控制是否允许当前文档使用 WebXR Device API。具体来说，devicechange 事件不会在 navigator.xr 对象上触发。navigator.xr.isSessionSupported() 和 navigator.xr.requestSession() 调用将返回一个 Promise，该 Promise 会被拒绝，并出现 SecurityError 类型的 DOMException。

**`<allowlist>` 允许列表**是该特性应该被控制的源列表，可以为所有或特定的源启用一种特性，或者阻止它在所有源中的使用。它包含一个或多个以下值，这些值用空格分隔在括号中，在支持的情况下，可以在权限策略源中包含通配符。这就意味着，无需在allowlist中明确指定多个不同的子域，而是可以在单个源中使用通配符指定所有子域：
1. *：本文档和所有嵌套浏览上下文（`<iframe>`）都允许使用该功能，无论其来源如何。
2. ()：空允许列表，表示该功能在顶级和嵌套浏览上下文中被禁用。 `<iframe>` 的allow属性的等效值是“none”。
3. self：该功能仅在本文档以及同一源的所有嵌套浏览上下文 (`<iframe>`) 中允许。嵌套浏览上下文中的跨源文档不允许使用该功能。self 可以被视为 https://your-site.example.com 的简写。`<iframe>` 的allow属性的等效值是 self。
4. src：只要加载到该 `<iframe>` 中的文档与其 src 属性中的 URL 来自同一来源，则允许在该 `<iframe>` 中使用该功能。此值仅用于 `<iframe>` allow 属性，也是 `<iframe>` 中的默认 allowlist 值。
5. `“<origin>”`：特定来源允许使用该功能（例如，“https://a.example.com”）。源应该用空格分隔。请注意，`<iframe>` allow属性中的源不加引号。
6. 值 * 和 () 只能单独使用，而 self 和 src 可以与一个或多个源结合使用。

## HTTP缓存

HTTP 缓存会存储与请求关联的响应，并将存储的响应复用于后续请求。可复用性的优点：
1. 由于不需要将请求传递到源服务器，客户端和缓存和缓存越近，响应速度就越快，比如浏览器本身为浏览器请求存储缓存。
2. 当响应可复用时，源服务器不需要处理请求（解析请求和路由请求、根据 cookie 恢复会话、查询数据库以获取结果或渲染模板引擎），降低了服务器上的负载。

HTTP 缓存分为**私有缓存**和**共享缓存**。

**私有缓存**是绑定到特定客户端的缓存，比如浏览器缓存。由于存储的响应不与其他客户端共享，因此私有缓存（通过设置Cache-Control:private）可以存储该用户的个性化响应（个性化内容通常由 cookie控制，但 cookie 的存在并不能表明它是私有的，也不会使响应成为私有的），从而避免无意的信息泄露。

**共享缓存**位于客户端和服务器之间，可以存储能在用户之间共享的响应，旨在减少到源服务器的流量。因此，**如果多个相同的请求同时到达共享缓存，中间缓存将代表自己将单个请求转发到源，然后源可以将结果重用于所有客户端，这称为请求折叠**。当请求同时到达时会发生请求折叠，因此即使响应中给出了max-age=0 或 no-cache，它也会被重用。如果响应是针对特定用户个性化的，并且不希望它在折叠中共享，则应添加 private 指令。如果响应具有 Authorization 标头，则它不能存储在HTTP 缓存中，除非设置Cache-Control: public，而且也只有在设置了 Authorization 标头时需要存储响应才应使用 public 指令，否则不需要，因为只要给出了 max-age，响应就会存储在共享缓存中。**共享缓存则分为代理缓存和托管缓存**。

![](../public/basics/http/123.png)

1. 代理缓存：由代理实现，目的是减少网络流量，通常不由服务开发人员管理，而必须由恰当的 HTTP 标头等控制，然而过去没有正确理解 HTTP 缓存标准的代理缓存实现经常给开发人员带来问题。Kitchen-sink 标头（即Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate）用于尝试解决不理解当前 HTTP 缓存规范指令（比如no-store指令）的“已过时且未更新的代理缓存”实现。随着HTTPS的普遍以及客户端-服务器通信加密，在许多情况下，路径中的代理缓存只能传输响应而不能充当缓存，因此无需担心过时的代理缓存实现甚至无法看到响应。此外，如果 TLS 桥接代理通过在 PC 上安装来自组织管理的 CA（证书颁发机构）证书，以中间人方式解密所有通信并执行访问控制等，则可以查看响应的内容并将其缓存。然而，由于CT（证书透明度）的普遍，并且某些浏览器仅允许使用SCT（签名证书时间戳）颁发的证书，因此该方法需要应用企业策略。在这样的受控环境下，无需担心代理缓存“过时且未更新”。
2. 托管缓存：由服务开发人员明确部署，以降低源服务器负载并有效地交付内容，比如反向代理、CDN以及与缓存 API 结合的service worker。很难长时间的缓存主要资源（通常是 HTML 文档），因为如果仅使用 HTTP 缓存规范中的标准指令，当服务器上的内容更新时，无法主动删除缓存内容。但是，可以通过部署托管缓存（CDN 或 service worker）来实现（允许通过 API 或仪表板操作清除缓存的 CDN 将允许通过存储主要资源并仅在服务器上发生更新时显式清除相关缓存来实现更积极的缓存策略或者 service worker 在服务器上发生更新时删除缓存 API 中的内容）。

![](../public/basics/http/124.png)

缓存的默认行为，即对于没有 Cache-Control 的响应，是根据“启发式缓存”进行隐式缓存，复用的时长则取决于客户端的实现，但规范建议存储后大约 10%。如今，基本上所有响应都建议显式指定 Cache-Control 标头。

存储的 HTTP 响应有两种状态，分别是fresh（表示响应仍然有效，可以重复使用）和stale（表示缓存的响应已经过期）。状态确定的标准是自响应生成以来经过的时间age，由存储响应的缓存进行计算，当响应存储在共享缓存中时，应该使用Age标头将它的age通知到客户端：

![](../public/basics/http/125.png)

stale 响应不能重用，但不会立即被丢弃，HTTP 通过使用包含 If-Modified-Since 或 If-None-Match 请求标头的条件请求询问源服务器资源是否更新将 stale 响应转换为 fresh 响应的机制称为**验证**或**重新验证**。其中If-Modified-Since对应缓存响应的Last-Modified响应标头的值（服务器可以从操作系统的文件系统中获取修改时间，但存在时间格式复杂且难以解析，分布式服务器难以同步文件更新时间的问题），If-None-Match对应缓存响应的 ETag 响应标头的值（服务器生成的任意值。服务器对于生成值没有任何限制，因此服务器可以根据它们选择的任何方式自由设置值，比如主体内容的哈希或版本号）。在缓存重新验证期间，如果 ETag 和 Last-Modified 都存在，则 ETag 优先。因此，如果只考虑缓存，可能会认为 Last-Modified 是不必要的。然而，Last-Modified 不仅仅对缓存有用；相反，它是一个标准的 HTTP 标头，内容管理系统(CMS) 也使用它来显示上次修改时间，用于爬虫调整爬取频率以及其他各种目的。所以考虑到整个 HTTP 生态系统，最好同时提供 ETag 和 Last-Modified。如果资源未改变（服务器为请求的资源确定的 ETag 标头的值与请求中的 If-None-Match 值相同或者服务器为请求的资源确定的Last-Modified与If-Modified-Since不同），服务器将响应 304 Not Modified，没有响应体，传输大小非常小，客户端收到响应后将存储的stale响应恢复为fresh状态。如果已改变（服务器确定请求的资源现在应该具有不同的 ETag 值或者服务器为请求的资源确定的Last-Modified与If-Modified-Since相同），服务器将其改为 200 OK 和资源的最新版本进行响应。

在 HTTP/1.0 中，有效期是通过 Expires 标头来指定的。Expires 标头使用明确的时间指定缓存的生命周期。然而，时间格式难以解析，发现了许多实现错误，并且有可能通过故意移动系统时钟来引发问题；因此，在 HTTP/1.1 中，Cache-Control 采用了Cache-Control的max-age指令用于指定经过的时间。如果 Expires 和 Cache-Control: max-age 都可用，则 max-age 为首选，而且，由于 HTTP/1.1 已被广泛使用，无需特地提供 Expires。

默认情况下响应基于它们的 URL区分，即使是具有相同的 URL的响应的内容并不总是相同的，尤其是在执行内容协商时，来自服务器的响应可能取决于 Accept、Accept-Language 和 Accept-Encoding 请求标头的值。可以通过在 Vary 标头的值中添加内容协商相关的标头，针对它们进行单独缓存响应。但不建议在 Vary 标头的值中添加User-Agent标头来实现基于用户代理提供内容优化（比如，响应式设计），因为User-Agent 请求标头通常具有非常多的变体，这大大降低了缓存被重用的机会，为之代替的应该是基于特征检测来改变行为的方法。对于使用 cookie来防止其他人重复使用缓存的个性化内容的应用程序，应该指定 Cache-Control: private 而不是为 Vary 指定 cookie。

如果不希望重用响应，而是希望始终从服务器获取最新内容，则可以在Cache-Control中添加 no-cache 指令强制客户端在重用任何存储的响应之前发送验证请求。如果服务端不支持条件请求，Cache-Control: no-cache可以强制客户端每次都访问服务端，也就总是得到最新的 200 OK 响应。Cache-Control: max-age=0, must-revalidate 与 Cache-Control:no-cache 具有相同的含义，其中max-age=0 意味着响应立即stale，而 must-revalidate 意味着stale后不得在没有重新验证的情况下重用它。使用max-age=0 是解决 HTTP/1.1 之前的许多实现无法处理 no-cache 指令。no-cache 指令并不会阻止响应的存储，而no-store 指令会阻止存储响应但不会删除相同 URL 的任何已存储响应（即返回 no-store 不会阻止已存储的响应被重用），但不建议随意授予 no-store，因为失去了 HTTP 和浏览器所拥有的许多优势，包括浏览器的后退/前进缓存。

浏览器执行验证即绕过缓存响应的操作有（**正常**）**重新加载**和**强制重新加载**。

1. **（正常）重新加载**可以通过在Fetch API中请求的 cache 模式设置为 no-cache 重现。请求通过 If-None-Match 和 If-Modified-Since 进行验证，出于向后兼容的原因，浏览器在重新加载期间使用max-age=0——因为在 HTTP/1.1 之前的许多过时的实现中不理解 no-cache。浏览器重新加载期间发送的 HTTP 请求的简化如下所示：

![](../public/basics/http/126.png)

2. **强制重新加载**可以通过在Fetch API中请求的cache 模式设置为reload重现。这是带有 Cache-Control: no-cache 的非条件请求，因此可以确定总是会从源服务器获得 200 OK。浏览器强制重新加载期间的 HTTP 请求的简化如下所示：

![](../public/basics/http/127.png)

最适合缓存的资源是静态不可变文件，其内容永远不会改变，应该被赋予一个较长的 max-age，方法是使用缓存破坏，即在请求 URL 中包含版本号、哈希值等，**缓存破坏是一种通过在内容更改时更改 URL 来使响应在很长一段时间内可缓存的机制**，可以应用于所有子资源，例如图像。但是，当用户重新加载时，即使知道内容是不可变的，也会发送重新验证请求，为了防止这种情况，immutable 指令可用于明确指示不需要重新验证，因为内容永远不会改变。请注意，Chrome 没有实现该指令，而是更改了重新加载的实现——仅验证主要资源。对于会变化的资源，通常的最佳实践是每次内容变化时都改变 URL，这样 URL 单元可以被缓存更长的时间。可以使用包含基于版本号或哈希值的更改部分的 URL 来提供 JavaScript 和 CSS，通过这种设计，JavaScript 和 CSS 资源都可以被缓存很长时间。

基本上没有办法删除使用很长的 max-age 存储的响应。一旦响应在服务器上过期，可能希望覆盖该响应，但是一旦存储响应，服务器就无法执行任何操作——因为由于缓存，不再有请求到达服务器。即使使用Clear-Site-Data: cache 标头，也只会影响浏览器缓存，而不会影响中间缓存。因此，除非用户手动执行重新加载、强制重新加载或清除历史操作，否则应该假设任何存储的响应都将保留其 max-age 期间。缓存减少了对服务器的访问，这意味着服务器失去了对该 URL 的控制。如果服务器不想失去对 URL 的控制——比如，在资源会频繁更新的情况下，为始终传输最新版本的资源，应该使Cache-Control 值包含 no-cache，以便服务器始终接收请求并发送预期的响应。

QPACK 是一种用于压缩 HTTP 标头字段的标准，其中定义了常用字段值表。常用的缓存头值有（如果选择其中一个编号选项，则可以在通过 HTTP3 传输时将值压缩为 1 个字节）：
1. 36 cache-control max-age=0
2. 37 cache-control max-age=604800：一周
3. 38 cache-control max-age=2592000：一月
4. 39 cache-control no-cache
5. 40 cache-control no-store
6. 41 cache-control public, max-age=31536000：一年

### HTTP缓存相关标头（Cache）

**Age 响应标头**（`Age: <delta-seconds>`）表示对象在缓存代理服务器中存贮的时长，以秒为单位。Age 的值通常接近于 0。如果是 Age: 0，则可能是从源服务器获取的；其他的值则是表示代理服务器当前的系统时间与HTTP响应中的Date标头的值之差。

**Cache-Control 通用标头**，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。指令的格式不区分大小写但推荐小写，多个指令以逗号相隔。可用的指令有：
1. public：表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容（例如：1.该响应没有max-age指令或Expires消息头；2. 该响应对应的请求方法是 POST）。
2. private：表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。
3. no-cache：在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证 (协商缓存验证)。
4. no-store：缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。
5. `max-age=<seconds>`：设置缓存存储的最大周期，超过这个时间缓存被认为过期 (单位秒)。与Expires相反，时间是相对于请求的时间。
6. `s-maxage=<seconds>`：覆盖max-age或者Expires头，但是仅适用于共享缓存 (比如各个代理)，私有缓存会忽略它。
7. `max-stale[=<seconds>]`：表明客户端愿意接收一个已经过期的资源。可以设置一个可选的秒数，表示响应不能已经过时超过该给定的时间。
8. `min-fresh=<seconds>`：表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应。
9. must-revalidate：一旦资源过期（比如已经超过max-age），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求。
10. proxy-revalidate：与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。
11. only-if-cached：表明客户端只接受已缓存的响应，并且不要向原始服务器检查是否有更新的拷贝。
12. no-transform：不得对资源进行转换或转变。Content-Encoding、Content-Range、Content-Type等 HTTP 头不能由代理修改。
13. immutable：表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如If-None-Match或 If-Modified-Since）来检查更新，即使用户显式地刷新页面。

服务器可以在响应中使用的标准 Cache-Control 指令有：
1. Cache-control: must-revalidate
2. Cache-control: no-cache
3. Cache-control: no-store
4. Cache-control: no-transform
5. Cache-control: public
6. Cache-control: private
7. Cache-control: proxy-revalidate
8. `Cache-Control: max-age=<seconds>`
9. `Cache-control: s-maxage=<seconds>`。

客户端可以在 HTTP 请求中使用的标准 Cache-Control 指令有：
1. `Cache-Control: max-age=<seconds>`
2. `Cache-Control: max-stale[=<seconds>]`
3. `Cache-Control: min-fresh=<seconds>`
4. Cache-control: no-cache
5. Cache-control: no-store
6. Cache-control: no-transform
7. Cache-control: only-if-cached

**Clear-Site-Data 响应标头**表示清除当前请求网站有关的浏览器数据（cookie，存储，缓存）。它让 Web 开发人员对浏览器本地存储的数据有更多控制能力，目前浏览器兼容性不佳（Safari不支持，Chrome61+、Firefox63+、Edge79+支持）。Clear-Site-Data 可以接受一个或多个参数，以逗号分隔，可用的参数有：
1. "cache"：表示服务端希望删除本 URL 原始响应的本地缓存数据（即：浏览器缓存，请参阅 HTTP 缓存）。根据浏览器的不同，可能还会清除预渲染页面，脚本缓存，WebGL 着色器缓存或地址栏建议等内容。
2. "cookies"：表示服务端希望删除 URL 响应的所有 cookie。HTTP 身份验证凭据也会被清除。会影响整个主域，包括子域。
3. "storage"：表示服务端希望删除 URL 原响应的所有 DOM 存储，这包括localStorage、indexDB、sessionStorage。
4. "*" (通配符)：表示服务端希望清除原请求响应的所有类型的数据。
5. "executionContexts"：表示服务端希望浏览器重新加载本请求。

**Expires 响应标头**（`Expires: <http-date>`）包含日期/时间，指示响应过期的时刻。如果是无效的日期，比如 0，代表着过去的日期，即该资源已经过期。如果在Cache-Control响应标头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。

**Pragma 通用标头**是在 HTTP/1.0 中规定的，效果依赖于不同的实现，在HTTP/1.1中已被Cache-Control替代，因此只推荐该标头用于向后兼容没有 Cache-Control的HTTP/1.0客户端。唯一指令是no-cache，与 Cache-Control: no-cache 效果一致。

Cookie 默认关闭浏览器后失效，可设置失效时间，大小4k，与服务器通信，更适合用户登录识别场景；localStorage默认永久保存可手动清除，大小10M左右，不与服务器通信，适合页面间传递数据/参数，最新chrome浏览器隐私/无痕模式下关闭浏览器就会被清除（关闭页面不会）；**SessionStorage关闭页面或浏览器即清除**，大小 10M 左右，适合保存**刷新当前页面不应丢失的临时数据**；

**浏览器缓存策略**：分为**强缓存**和**协商缓存**，目的是降低服务器负担、减少冗余数据传输，加快页面加载。

**强缓存（本地缓存）：不会发送请求，利用 HTTP的 Expires（http1.0，过期时刻） 和 Cache-Control（http1.1，相对时间） 控制缓存时间，同时存在优先考虑Cache-Control（因为服务器的时间和浏览器的时间可能并不一致），由服务器进行设置。cache-control：no-cache 是可以缓存的，但每次使用缓存前应该去向服务器验证缓存是否可用。cache-control：no-store 才是不在浏览器缓存内容。**

**协商缓存（弱缓存）**：在强缓存过期情况下，浏览器携带**缓存标识 If-None-Match（资源唯一标识，等于第一次请求服务器返回的 Etag，优先校验 —— “精度高，速度慢”）和If-Modified-Since（资源最后修改时间，等于第一次请求服务器返回的Last-Modified**）发起请求，由服务器根据**缓存标识**判断服务器资源是否被修改来决定是否使用本地缓存的过程。协商缓存没失效，返回304（继续使用本地缓存），反之200（返回新的资源和缓存标识，再存入浏览器缓存中）。**性能上**，Last-Modified优于ETag，Last-Modified记录的是时间点，而Etag需要根据文件的MD5算法生成对应的hash值。**精度上**，ETag优于Last-Modified。ETag按照内容给资源带上标识，能准确感知资源变化。「如果两种方式都支持的话，服务器会优先考虑ETag」。

**Last-Modified在某些场景并不能准确感知变化，比如**：
1. 编辑了资源文件，但是文件内容并没有更改，这样也会造成缓存失效。
2. **Last-Modified 能够感知的单位时间是秒**，如果文件在 1 秒内改变了多次，这时候的 Last-Modified 无法体现出修改。

**服务器没有设置任何缓存策略时浏览器会采用启发式的算法**：通常会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间。

**实际应用**：
1. 频繁变动的资源设置Cache-Control: no-cache（**不使用强缓存**） + ETag / Last-Modified;
2. 不经常变动的资源设置Cache-Control: max-age=31536000 + 动态更改文件名(或者路径)中的 hash或版本号等动态字符（比如，webpack打包出来的文件后有hash 或者类库文件存在版本号 jquery.1.11.1.min.js）。

![](../public/basics/http/128.png)

## 内容安全策略 (CSP)

内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等，这些攻击作为数据盗取、网站内容污染以及恶意软件分发的主要手段。CSP 的主要目标是减少和报告 XSS 攻击。

CSP 完全向后兼容（除 CSP2 在向后兼容有明确提及的不一致）。不支持 CSP 的浏览器也能与实现了 CSP 的服务器正常工作，反之亦然：不支持 CSP 的浏览器只会忽略它并正常运行，默认为网页内容使用标准的同源策略。如果网站不提供 CSP 标头，浏览器也使用标准的同源策略。

CSP 是一种由开发者定义的安全性政策性申明，通过 CSP 所约束的规则指定可信的内容来源（这里的内容可以指脚本、图片、iframe、font、style 等等可能的远程的资源）。CSP 策略在默认的情况下是不允许使用 data URIs 资源、inline script 和 eval 类型函数（包括 eval、setInterval、setTimeout 和 new Function()）也是不被执行的。

为降低部署成本，CSP 可以部署为仅报告（report-only）模式。在此模式下，CSP 策略不是强制性的，但是任何违规行为将会报告给一个指定的 URI 地址。如果 Content-Security-Policy-Report-Only 标头和 Content-Security-Policy 同时出现在一个响应中，两个策略均有效。在 Content-Security-Policy 标头中指定的策略有强制性，而 Content-Security-Policy-Report-Only 中的策略仅产生报告而不具有强制性。如果策略里包含一个有效的report-uri (en-US) 指令，支持 CSP 的浏览器将始终对于每个企图违反所建立的策略都发送违规报告。

Content-Security-Policy中可以设置report-uri 用来告诉浏览器，应该把注入行为使用POST方法报告给该网址：

```json
{
    "csp-report": {
        "document-uri": "http://example.org/page.html",
        "referrer": "http://evil.example.com/",
        "blocked-uri": "http://evil.example.com/evil.js",
        "violated-directive": "script-src 'self' https://apis.google.com",
        "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"
    }
}
```

**开启 CSP 可用**：

网络服务器返回 Content-Security-Policy HTTP 头部，或者：
```html
<meta http-equiv="Content-Security-Policy" />
```

### HTTP 安全相关标头（Security）

**Cross-Origin-Embedder-Policy (COEP) 响应标头**（Cross-Origin-Embedder-Policy: unsafe-none | require-corp）可防止文档加载未明确授予文档权限 (通过 CORP 或者 CORS) 的任何跨域资源。unsafe-none 是默认值，表示允许文档获取跨源资源，而无需通过 CORS 协议或 Cross-Origin-Resource-Policy 头。require-corp表示文档只能从相同的源加载资源，或显式标记为可从另一个源加载的资源。如果跨源资源支持 CORS，则必选使用crossorigin 属性或 Cross-Origin-Resource-Policy 标头来加载该资源，而不会被 COEP 阻止。

**Cross-Origin-Opener-Policy (COOP) 响应标头**可以确保顶级文档不与跨源文档共享浏览上下文组。COOP 将对文档进行进程隔离，潜在的攻击者即使在弹出窗口中打开文档，也无法访问全局对象，从而防止XS-Leaks 跨源攻击。如果在新窗口中打开具有 COOP 的跨源文档，则打开的文档将不会引用它，并且新窗口的 window.opener 属性将为 null。与 rel=noopener 相比，这可以更好地控制对窗口的引用，rel=noopener 只影响外向导航。可能取值有：
1. unsafe-none默认值，允许将文档添加到其打开程序的浏览上下文组中，除非打开程序本身的 COOP 为 same-origin 或 same-origin-allow-popups。
2. same-origin-allow-popups表示保留对新打开的窗口或标签页的引用，这些窗口或标签页要么未设置 COOP，要么通过将 COOP 设置为 unsafe-none 来退出隔离。
3. same-origin表示将浏览上下文完全隔离为同源文档。跨源文件不会在同一浏览上下文中加载。

**Cross-Origin-Resource-Policy 响应标头**（Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin）会指示浏览器阻止对指定资源的no-cors跨域/跨站点请求。
Content-Security-Policy 响应标头（`Content-Security-Policy: <policy-directive>; <policy-directive>`, 其中 `<policy-directive>` 的形式为 `<directive> <source>` 且source>可能是多个）允许站点管理者控制用户代理能够为指定的页面加载哪些资源。除了少数例外情况，设置的政策主要涉及指定服务器的源和脚本端点。这有助于防范跨站脚本攻击（XSS，Cross-site_scripting）。Workers 一般来说不被创建他的文档（或者父级 Worker）的 CSP 策略管理。如果要为 Worker 指定 CSP 策略，可以为 Worker 脚本的请求的响应的头部设置 CSP 策略。例外的情况是：如果 Worker 脚本的来源是一个全局唯一 ID（比如，它的 URL 是一个结构化的数据或者 BLOB），这个 Worker 会继承它所属的文档或者创建它的 Worker 的 CSP 策略。CSP 允许在一个资源中指定多个策略，包括通过 Content-Security-Policy 头（可以调用多次），以及 Content-Security-Policy-Report-Only 头，和 `<meta>` 组件。可能的指令 `<directive>` 有：
1. 获取指令（Fetch directives）：控制某些可能被加载的确切的资源类型的位置。
    1. child-src：为 Web Workers 和其他内嵌浏览器内容（例如用 `<frame>` 和 `<iframe>` 加载到页面的内容）定义合法的源地址。可以设置一个或多个源值 `<source>`。如果该指令不存在，用户代理将查找 default-src 指令。如果开发者希望管控内嵌浏览器内容和 web worker 应分别使用 frame-src 和 worker-src 指令，来取代 child-src。`<source>` 可以是 CSP 源值中列出的任何一个值。
    2. connect-src：限制能通过脚本接口加载的 URL。可以设置一个或多个源值` <source>`。如果该指令不存在，用户代理将查找 default-src 指令。受限制的API包括 `<a>` 的ping属性、fetch()、XMLHttpRequest、WebSocket、EventSource、Navigator.sendBeacon()。`<source>` 可以是 CSP 源值中列出的任何一个值。
    3. default-src：为其他获取指令提供备选项。可以设置一个或多个源值 `<source>`。如果child-src、connect-src、font-src、frame-src 、img-src、manifest-src 、media-src、object-src、script-src、style-src 、worker-src指令不存在，那么用户代理会查找并应用 default-src 指令的值。`<source>` 可以是 CSP 源值中列出的任何一个值。
    4. font-src：设置允许通过 @font-face 加载的字体源地址。可以设置一个或多个源值 `<source>`。如果该指令不存在，用户代理将查找 default-src 指令。`<source>` 可以是 CSP 源值中列出的任何一个值。
    5. frame-src：设置允许通过类似 `<frame>` 和 `<iframe>` 标签加载的内嵌内容的源地址。如果该指令不存在，则用户代理将查找 child-src 指令。`<source>` 可以是 CSP 源值中列出的任何一个值。
    6. img-src：限制图片和图标的源地址。`<source>` 可以是 CSP 源值中列出的任何一个值。如果该指令不存在，用户代理将查找default-src指令。
    7. manifest-src：限制应用声明文件的源地址。`<source>` 可以是 CSP 源值中列出的任何一个值。如果该指令不存在，用户代理将查找default-src指令。
    8. media-src：限制通过 `<audio>`、`<video>` 或 `<track>` 标签加载的媒体文件的源地址。`<source>` 可以是 CSP 源值中列出的任何一个值。如果该指令不存在，用户代理将查找default-src指令。
    9. object-src：限制 `<object>` 或 `<embed> `标签的源地址。被 object-src 控制的元素可能碰巧被当作遗留 HTML 元素，导致不支持新标准中的功能（例如 `<iframe>` 中的安全属性 sandbox 和 allow）。因此建议限制该指令的使用（比如，如果可行，将 object-src 显式设置为 'none'）。`<source>` 可以是 CSP 源值中列出的任何一个值。如果该指令不存在，用户代理将查找default-src指令。要设置 `<object>` 和 `<embed>` 允许的类型，请使用 plugin-types 指令。
    10. prefetch-src：指定预加载或预渲染的允许源地址。
    11. script-src：规定了 JavaScript 的有效来源。这不仅包括直接加载到 `<script>` 元素中的 URL，还包括内联脚本事件处理程序（onclick）和 XSLT 样式表等可触发脚本执行的内容。`<source>` 可以是 CSP 源值中列出的任何一个值。如果该指令不存在，用户代理将查找default-src指令。
    12. script-src-attr：指定 JavaScript 内联事件处理程序的有效源。该指令仅指定内联脚本事件处理程序（如 onclick）的有效源。它不适用于可以触发脚本执行的其他 JavaScript 源，例如直接加载到 `<script>` 元素和 XSLT 样式表中的 URL。（可以使用 script-src 为所有 JavaScript 脚本源指定有效源，或者使用 script-src-elem 仅为 `<script>` 元素指定有效源）。如果该指令不存在，用户代理将查找 script-src 指令。`<source>` 可以是 CSP 源值中列出的任何一个值。
    13. scrip-src-elm：指定 JavaScript `<script>` 元素的有效源。该指令只指定 `<script>` 元素（包括脚本请求和块）中的有效源。它不适用于其他可触发脚本执行的 JavaScript 源，例如内联脚本事件处理程序（onclick）、通过 "unsafe-eval "检查设置的脚本执行方法以及 XSLT 样式表。（可使用 script-src 为所有 JavaScript 脚本源指定有效源，或使用 script-src-attr 仅为内联脚本处理程序指定有效源）。如果该指令不存在，用户代理将查找 script-src 指令。`<source>` 可以是 CSP 源值中列出的任何一个值。
    14. style-src：指定样式表的合法源。`<source>` 可以是 CSP 源值中列出的任何一个值。如果该指令不存在，用户代理将查找default-src指令。
    15. style-src-attr：指定应用于各个 DOM 元素的内联样式的有效源。如果该指令不存在，用户代理将查找 style-src 指令。该指令不会为 `<style>` 元素和带有 rel="stylesheet" 的 `<link>` 元素设置有效源（这些是使用 style-src-elem 设置的）。`<source>` 可以是 CSP 源值中列出的任何一个值。
    16. style-src-elem：指定样式表 `<style>` 元素和带有 rel="stylesheet" 的 `<link>` 元素的有效源。该指令没有为内联样式属性设置有效的源（这些是使用 style-src-attr 设置的）。如果该指令不存在，用户代理将查找 style-src 指令。`<source>` 可以是 CSP 源值中列出的任何一个值。
    17. webrtc-src：指定WebRTC连接的合法源地址。
    18. worker-src：指定 Worker、SharedWorker 或 ServiceWorker 脚本的有效源。`<source>` 可以是 CSP 源值中列出的任何一个值。如果没有该指令，用户代理在管理 Worker 执行时将首先查找child-src指令，然后是script-src指令，最后是default-src指令。
2. 文档指令（Document directives）：管理文档属性或者 worker 环境应用的策略。
    1. base-uri：限制可以应用于文档的 `<base>` 元素的 URL，可以设置一个或多个源值`<source>`，某些源值对 base-uri 没有意义，例如关键字 'unsafe-inline' 和 'strict-dynamic'。如果指令值为空，那么任何 URL 都是允许的。如果指令不存在，那么用户代理会使用 `<base>` 元素中的值。
    2. plugin-types：通过限制可以加载的资源类型来限制哪些插件可以被嵌入到文档中。
    3. sandbox：类似 `<iframe>` sandbox 属性，为请求的资源启用沙盒。它对页面的操作施加限制，包括防止弹出窗口、防止执行插件和脚本，以及执行同源策略。`<meta> `元素或 Content-Security-policy-Report-Only 标头字段不支持此指令。`Content-Security-Policy: sandbox <value>;` 其中 `<value>` 的可能取值有：
        1. allow-forms：允许嵌入式浏览上下文提交表单。如果未使用此关键字，则不允许此操作。
        2. allow-modals：允许嵌入式浏览上下文打开模态窗口。
        3. allow-orientation-lock：允许嵌入式浏览上下文禁用锁定屏幕方向的功能。
        4. allow-pointer-lock：允许嵌入式浏览上下文使用Pointer Lock API。
        5. allow-popups：允许弹出窗口（像window.open，target="_blank"，showModalDialog）。如果未使用此关键字，则该功能将无提示失败。
        6. allow-popups-to-escape-sandbox：允许沙盒文档打开新窗口而不强制沙盒标记。例如，这将允许安全地沙箱化第三方广告，而不会对登陆页面施加相同的限制。
        7. allow-presentation：允许嵌入器控制 iframe 是否可以启动演示会话。
        8. allow-same-origin：允许将内容视为来自其正常来源。如果未使用此关键字，则嵌入的内容将被视为来自唯一来源。
        9. allow-scripts：允许嵌入式浏览上下文运行脚本（但不创建弹出窗口）。如果未使用此关键字，则不允许此操作。
        10. allow-top-navigation：允许嵌入式浏览上下文将内容导航（加载）到顶级浏览上下文。如果未使用此关键字，则不允许此操作。
3. 导航指令（Navigation directives）：管理用户能打开的链接或者表单可提交的链接。
    1. form-action：能够限定当前页面中表单的提交地址（即限制 form 的 action 属性的链接地址）。未设定时允许任何值。可以设置一个或多个源值`<source>`。在表单提交之后， form-action 指令是否应该阻止重定向，各个浏览器实现不同，Chrome 63 会阻止重定向，而 Firefox 57 则不会。`<source>` 可以是 CSP 源值中列出的任何一个值。
    2. frame-ancestors：指定了可以包含 `<frame>`、`<iframe>`、`<object>` 或 `<embed>` 等元素的有效父级。如未设置则允许所有可能值。当该指令设置为 'none' 时，其作用类似于 X-Frame-Options: DENY。该指令不支持通过 `<meta>` 元素或通过 Content-Security-policy-Report-Only 头域所指定。源值中不允许 'unsafe-eval' 或'unsafe-inline'。
    3. navigation-to：限制文档可以通过以下任何方式访问 URL，包括 `<form>`（如果未指定 form-action）、`<a>`、window.location、window.open 等。
4. 报告指令（Report directives）：控制 CSP 违规的报告过程。
    1. report-to：指示客户端存储特定域名的报告端点。该指令本身没有任何作用，只有与其他指令结合使用才有意义。会触发 SecurityPolicyViolationEvent。`<meta>` 元素中不支持该指令。该指令的值不是`<source>`，而是Report-to标头值里的groupname。尽管report-to指令旨在取代已弃用的report-uri指令，但大多数浏览器尚不支持report-to。因此，为了与当前浏览器兼容，同时在浏览器获得report-to支持时添加向前兼容性，可以同时指定report-uri和report-to，即Content-Security-Policy: …; report-uri https://endpoint.example.com; report-to groupname
5. 其他指令（Other directives）：
    1. block-all-mixed-content：当使用 HTTPS 加载页面时阻止使用 HTTP 加载任何资源。该指令存在即可（Content-Security-Policy: block-all-mixed-content;）。已弃用。
    2. require-sri-for：需要使用 SRI 作用于页面上的脚本或样式。
    3. upgrade-insecure-requests：让浏览器把一个网站所有的不安全 URL（通过 HTTP 访问）当做已经被安全的 URL 链接（通过 HTTPS 访问）替代。该指令存在即可（Content-Security-Policy: upgrade-insecure-requests;）。该指令适用于具有大量需要重写的不安全旧版 URL 的网站。该指令在 block-all-mixed-content 指令之前进行评估，如果设置了该指令，则后者实际上是无操作。建议设置其中一个指令，但不要同时设置两者，除非想在旧版浏览器上强制使用 HTTPS，而这些浏览器在重定向到 HTTP 后不会强制使用 HTTPS。该指令不会确保通过第三方网站上的链接访问网站的用户将升级到 HTTPS 进行顶级导航，因此不会替换Strict-Transport-Security (HSTS) 标头，该标头仍应使用适当的设置max-age 确保用户不会受到 SSL 剥离攻击
    4. require-trusted-types-for：指示用户代理控制传递给 DOM XSS 接收器函数的数据，例如 Element.innerHTML setter。唯一值是 'script'。使用时，这些函数只接受由可信类型策略创建的不可欺骗的类型值，而拒绝字符串。与可保护可信类型策略创建的 trusted-types 指令一起使用时，作者可以定义保护向 DOM 写入值的规则，从而将 DOM XSS 攻击面缩小到网络应用程序代码库中的小块孤立部分，便于监控和代码审查。唯一值是 'script'。
    5. trusted-types：指示用户代理限制可信类型策略的创建 - 构建不可欺骗的类型化值的函数，这些值旨在代替字符串传递到 DOM XSS 接收器。该指令与 require-trusted-types-for 指令一起，允许作者定义规则，保护向 DOM 中写入值，从而将 DOM XSS 攻击面缩小到网络应用程序代码库中的小块孤立部分，方便其监控和代码审查。该指令声明了一个允许列表，其中包含通过Trusted Types API 中的 trustedTypes.createPolicy 创建的可信类型策略名称。可能取值有：
        1. 'none'：不允许创建任何受信任类型策略（与不指定任何 `<policyName>` 相同）。
        2. 'allow-duplicates'：允许使用已使用的名称创建策略。
        3. `<policyName>`：有效的策略名称仅包含字母数字字符或“-#=_/@.%”之一。星号 (*) 作为策略名称指示用户代理允许任何唯一的策略名称（'allow-duplicates'可以进一步放宽限制）。

可选的`<source>`有：
1. `<host-source>`：按名称或 IP 地址显示的 Internet 主机。URL 方案、端口号和路径为可选项。子域、主机地址和端口号可用通配符（'*'），表示对应的所有合法值都有效。匹配方案时，允许安全升级（例如，指定 http://example.com 将匹配 https://example.com）。
2. `<scheme-source>`：方案，http: 或 https:、data:、mediastream:、blob:、filesystem:。冒号为必填项。如果缺少方案源，则使用文档源的方案。允许安全升级，因此如果使用 https: 加载文档，则 example.com 将匹配 https://example.com，但不匹配 http://example.com。
3. 'self'：指提供受保护文档的源，包括相同的 URL 方案和端口号。必须包含单引号。某些浏览器专门从源指令中排除 blob 和filesystem。需要允许这些内容类型的站点可以使用数据属性来指定它们。
4. 'unsafe-eval'：允许使用 eval() 和其他不安全的方法从字符串创建代码。必须包含单引号。
5. 'wasm-unsafe-eval'：允许加载和执行 WebAssembly 模块，而无需允许通过“unsafe-eval”执行不安全的 JavaScript。需要使用单引号。
6. 'unsafe-hashes'：允许启用特定的内联事件处理程序。如果只需要允许内联事件处理程序，而不需要内联 `<script>` 元素或 javascript： URLs 时，这是一种比使用不安全内联表达式更安全的方法。
7. 'unsafe-inline'：允许使用内联资源，例如内联 `<script>` 元素、javascript: URL、内联事件处理程序和内联 `<style>` 元素。需要使用单引号。
8. 'none'：指空集，即没有 URL 匹配。必须使用单引号。
9. `'nonce-<base64-value>'`：使用加密随机数（使用一次的数字）的特定内联脚本的允许列表。服务器每次传输策略时都必须生成唯一的随机数值。提供不可猜测的随机数至关重要，因为否则绕过资源的策略是微不足道的。指定随机数会使现代浏览器忽略'unsafe-inline'，在没有随机数支持的情况下，仍可以为旧版浏览器设置该'unsafe-inline'。CSP nonce 源只能应用于 nonceable 元素（例如，由于 `<img>` 元素没有 nonce 属性，因此无法将其与此 CSP 源关联）。
10. `'<hash-algorithm>-<base64-value>'`：脚本或样式的 sha256、sha384 或 sha512 哈希值。脚本或样式的 sha256、sha384 或 sha512 哈希值。该值由用于创建哈希值的算法、连字符和脚本或样式的 base64 编码哈希值组成。生成哈希值时，请排除 `<script>` 或 `<style>` 标记，并注意大小写和空白的重要性，包括前导空白或尾部空白。在 CSP 2.0 中，哈希源可应用于内联脚本和样式。CSP 3.0 允许在 script-src 指令中对外部脚本使用哈希源表达式。
11. 'strict-dynamic'：指定显式给予标记中存在的脚本的信任（通过附带随机数或散列）应传播到该根脚本加载的所有脚本。同时，任何allowlist或source表达式（例如“self”或“unsafe-inline”）都会被忽略。
12. 'report-sample'：要求在违规报告中包含违规代码示例。

**Content-Security-Policy-Report-Only 响应标头**（`Content-Security-Policy-Report-Only: <policy-directive>; <policy-directive>`）允许 Web 开发人员通过监视（但不强制执行）其效果来试验策略。这些违规报告包含通过 POST 请求发送到指定 URI 的 JSON 文档。`<meta>` 元素内部不支持此标头。Content-Security-Policy 标头的指令也可以应用于 Content-Security-Policy-Report-Only，但sandbox指令除外，该指令与 Content-Security-Policy-Report-Only 一起使用时会被忽略。

**Strict-Transport-Security（HSTS）响应标头**（`Strict-Transport-Security: max-age=<expire-time>[; includeSubDomains[; preload]]`）用来通知浏览器应该只通过 HTTPS 访问该站点，并且以后使用 HTTP 访问该站点的所有尝试都应自动重定向到 HTTPS。 这比在服务器上简单地配置 HTTP 到 HTTPS（301）重定向要安全，因为初始的 HTTP 连接仍然易受到中间人攻击。如果只使用 HTTP 访问网站，浏览器会忽略 Strict-Transport-Security 标头。网站第一次通过 HTTPS 请求且证书没有错误，服务器响应 Strict-Transport-Security 标头，浏览器记录下这些信息，然后后面尝试访问这个网站的请求都会自动把 HTTP 替换为 HTTPS。浏览器这样做是因为攻击者可能会拦截到网站的 HTTP 连接，并注入或移除标头。包含的指令有：
1. `max-age=<expire-time>` 是浏览器应该记住的只能使用 HTTPS 访问站点的最大时间量（以秒为单位）。将 max-age 设置为 0（通过 https 连接）将立即使 Strict-Transport-Security 标头失效，从而可以通过 http 访问。
2. includeSubDomains 是可选的，说明此规则也适用于该网站的所有子域名。
3. preload是可选的，当使用 preload，max-age 指令必须至少是 31536000（一年），并且必须存在 includeSubDomains 指令，谷歌维护着一个 HSTS 预加载服务。按照如下指示成功提交你的域名后，浏览器将会永不使用非安全的方式连接到你的域名。虽然该服务是由谷歌提供的，但所有浏览器都在使用这个预加载列表。但是，这不是 HSTS 标准的一部分，也不该被当作正式的内容。

**Upgrade-Insecure-Requests 请求标头**（Upgrade-Insecure-Requests: 1）用来向服务器端发送信号，表示客户端优先选择加密及带有身份验证的响应，并且它可以成功处理 upgrade-insecure-requests CSP 指令。

**X-Content-Type-Options HTTP 响应标头**（X-Content-Type-Options: nosniff 如果请求目标是 style 类型且 MIME 类型不是 text/css，或者是 script 类型且 MIME 类型不是 JavaScript MIME 类型，则阻止请求）相当于一个提示标志，被服务器用来提示客户端一定要遵循在 Content-Type 首部中对 MIME 类型 的设定，而不能对其进行修改。这就禁用了客户端的 MIME 类型嗅探行为，即意味着网站管理员确定自己的设置没有问题。该消息头最初是由微软在 IE 8 浏览器中引入的，提供给网站管理员用作禁用内容嗅探的手段，内容嗅探技术可能会把不可执行的 MIME 类型转变为可执行的 MIME 类型。在此之后，其他浏览器也相继引入了这个消息头，尽管它们的 MIME 嗅探算法没有那么有侵略性。

**X-Frame-Options HTTP 响应标头**可用于指示是否允许浏览器在 `<frame>`、`<iframe>`、`<embed>` 或 `<object>` 中呈现页面，网站可以使用它来避免点击劫持攻击，确保自己的内容不会嵌入到其他网站中。使用 `<meta>` 标签来设置 X-Frame-Options 是无效的，需要在服务器配置中添加X-Frame-Options HTTP响应头。可能的取值：
1. DENY 表示该页面不允许在 frame 中展示，即便是在相同域名的页面中嵌套也不允许。
2. SAMEORIGIN 表示该页面可以在相同域名页面的 frame 中展示。
