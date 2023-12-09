# 计算机网络

**网页（webpage）**：一份能够显示在网络浏览器（如 Firefox,，Google Chrome，Microsoft Internet Explorer 或 Edge，Apple 的 Safari）上的文档。网页也常被称作"web pages"（网页）或者就叫"pages"（页面）。浏览器也能显示其他文档，例如 PDF 文件或图像，但网页（webpage）专指 HTML 文档。其他情况使用文档（document）。

**网站（website）**：网站是共享唯一域名的相互链接的网页的集合。网站常被称作"web site"（网站）或简称"site"（站点）。当网站只包含一个网页时，可称之为单页网站（single-page website）。

**搜索引擎（search engine）**：帮助寻找其他网页的网站，比如 Google，Bing，或 Yahoo。

**CMS（内容管理系统，content management system）**：是一个允许用户发布、组织、修改、删除多种类型的内容的软件。CMS 不仅支持文本，还可以嵌入图片、视频、音频和互动的代码。

## Web 机制

无论通过有线方式 (比如，网线) 还是无线方式（比如 wifi 或蓝牙），通信都需要进行连接，而网络上的每台计算机都需要链接到**路由器（router）**，它确保从一台计算机上发出的一条信息可以到达正确的计算机。计算机先连接路由器，然后路由器之间互相连接，可以通过电话基础设施相互连接，并把网络连接到管理特殊路由器的互联网服务提供商（ISP），最后这些路由器再连接其他 ISP 的路由器。**调制解调器（modem）**可以把网络信息变成电话设施可以处理的信息，而网络消息可以被 ISP 捕获并发送到相应的网络。互联网作为基础设施，就是由这些所有的网络设施所组成，而网络是建立在这种基础设施之上的服务。 

**超链接（Hyperlink）**，通常简称为链接（link）。大多数链接将两个网页相连。而锚将一个网页中的两个段落相连。当点击指向锚点的链接时，浏览器跳转到当前文档的另一部分，而不是加载新文档。内链是自己的网页之间的链接。外链是从自己的网页链接到其他人的网页的链接。传入链接是从其他人的网页链接到自己的网页的链接。链接对网站用户和搜索引擎都很重要，链接的可见文本会影响搜索结果对特定 URL 的搜索。一个网页拥有的链接越多，它在搜索结果中的排名就越靠前。外部链接会影响源网页和目标网页的搜索排名，但具体影响程度尚不清楚。

连接到互联网的计算机被称作**客户端**和**服务器**。客户端是典型的 Web 用户入网设备（比如连接了 Wi-Fi 的计算机，或接入移动网络的手机）和设备上可联网的软件（比如 Firefox 和 Chrome 的浏览器）。服务器是存储网页，站点和应用的计算机。当一个客户端设备想要获取一个网页时，一份网页的拷贝将从服务器上下载到客户端机器上来在用户浏览器上显示。

**网络服务器（web server）**：一台托管一个或多个网站的计算机。可以代指硬件或软件，或者是它们协同工作的整体。硬件部分是一台存储了 web 服务器软件以及网站的组成文件（比如，HTML 文档、图片、CSS 样式表和 JavaScript 文件）的计算机。它接入到互联网并且支持与其他连接到互联网的设备进行物理数据的交互。软件部分包括控制网络用户如何访问托管文件的几个部分，至少是一台 HTTP 服务器。一台 HTTP 服务器是一种能够理解 URL和 HTTP的软件。一个 HTTP 服务器可以通过它所存储的网站域名进行访问，并将这些托管网站的内容传递给最终用户的设备。

**静态 web 服务器**（static web server）由一个计算机（硬件）和一个 HTTP 服务器（软件）组成。称它为“静态”是因为这个服务器把它托管文件的“保持原样”地传送到你的浏览器。

**动态 web 服务器**（dynamic web server）由一个静态的网络服务器加上额外的软件组成，最普遍的是一个应用服务器和一个数据库。称它为“动态”是因为这个应用服务器会在通过 HTTP 服务器把托管文件传送到你的浏览器之前会对这些托管文件进行更新。

严格来说，可以在自己的计算机上托管所有的这些文件，但专用的 web 服务器上有以下优势：
1. 专用 web 服务器可用性更强（会一直启动和运行）
2. 除去停机时间和系统故障，专用 web 服务器总是连接到互联网。
3. 专用 web 服务器可以一直拥有一样的 IP 地址，这也称为专有 IP 地址（不是所有的 ISP 都会为家庭线提供一个固定的 IP 地址）
4. 专用 web 服务器往往由第三方提供者维护。

## 协议体系结构

**协议**（protocol）是定义计算机内部或计算机之间如何交换数据的规则系统。设备之间的通信要求设备就所交换的数据的格式达成一致。定义格式的规则集为协议。

OSI 体系结构顺口溜：**物联网叔会试用**。

![](../public/basics/net-1.png)

**物理层**：主要任务是在物理媒体上实现比特流的透明传输。主要解决二进制数据到信号之间的互转问题。**功能**：定义接口特性、传输模式（单工/半双工/双工）、传输速率，实现比特同步和比特编码；**工作设备**：集线器、中继器。

**数据链路层**：把网络层传下来的数据报组装成帧。作用是将数据在一个子网（广播域）内有效传输。**功能**：成帧(定义帧的开始和结束)、差错控制（帧错+位错）、流量控制、访问(接入)控制（ 控制对信道的访问）；**工作设备**：网桥、交换机。

**网络层**：把分组（IP数据报）从源主机传到目的主机（点到点），为分组交换网上的不同主机提供通信服务。主要解决如何定位目标以及如何寻找最优路径的问题。**功能**：路由选择（最佳路径）、流量控制、差错控制、拥塞控制；协议：IP/ARP（地址解析协议：根据IP获取物理地址）；**工作设备**：路由器。

**传输层**：负责主机中「两个进程」的通信，即「端到端」的通信。传输单位是报文段或用户数据报；主要面向传输过程。**功能**：可靠传输（TCP）或不可靠传输（UDP）、差错控制、流量控制、复用分用。
> 复用：多个应用层进程可同时使用下面传输层的服务；  
> 分用：传输层把收到的信息分别交付给上面应用层中相应的进程。

**会话层**： 向**表示层实体/用户进程**提供「建立链接」并在连接上「有序」地「传输」数据。这是会话，也是建立「同步（SYN）」。**功能**：
1. 建立、管理、终止会话；
2. 使用校验点可使会话在通信失效时从校验点/同步点继续恢复通信，实现数据同步（适用于传输大文件）。

**表示层**：用于处理两个通信系统中交换信息的表示方式（语义和语法）。**功能**：数据格式交换、加密解密、压缩和恢复

**应用层**：所有能和用户交互产生网络流量的程序。**典型的网络应用**：域名系统（DNS）、文件传输（FTP）、电子邮件（SMTP、POP3）、万维网（HTTP）。面向互联网中的具体应用场景相关的消息格式。

**分层的意义**在于利用分层的思想将复杂的问题简单化。发送消息时，消息从上到下进行打包，每一层会在上一层的基础上加包，而接受消息时，从下到上进行解包，最终得到原始信息。

## TCP 和 UDP

传输控制协议（TCP，Transmission Control Protocol）是一种面向连接的、可靠的、基于字节流的传输层通信协议。TCP 会校验包的交付。TCP 确保字节流在接收时维持它们的发送顺序。TCP 使用三次握手来建立连接和四次握手来中断连接。

用户数据报协议（UDP，User Datagram Protocol，又称用户数据包协议）是一种简单的面向数据包的无连接的传输层通信协议。用于在传输速度和效率比安全性和可靠性更重要的场合下发送数据。UDP 使用**校验和**保证数据完整性，使用端口号以区分数据发送方和接收方中不同的应用程序。它无需握手会话，即将不可靠的底层网络直接暴露给了用户的应用程序：不保证消息交付、不保证交付顺序也不保证消息不重复。

UDP 避免了处理差错和纠错的开销。对时间敏感的应用程序通常使用 UDP，因为丢弃数据包比等待数据包重传（可能不是实时操作系统可接受的选项）更可取。

### TCP 和 UDP的异同？

（两者的异同即定义，因此直接列出异同）同为传输层协议；异：
1. TCP 面向连接（可靠），UDP 无连接（不可靠）；
2. TCP 面向字节流，UDP 面向数据报；
3. TCP 支持1对1 ，UDP 支持1对多、多对一、多对多；
4. TCP 首部开销大（20字节），UDP 首部开销小（8字节）；
5. TCP 使用流量和拥塞控制，UDP 不使用；
6. TCP 可靠传输应用（文件传输、远程登录），UDP实时应用（IP电话，视频会议，直播）。

当数据传输的性能必须让位于数据传输的完整性、可控制性和可靠性时，TCP协议是当然的选择。当强调传输性能而不是传输的完整性时，UDP 是更好的选择。

### TCP 三次握手

![](../public/basics/net-2.png)

1. **第一次握手**：客户端进行连接请求，发送 SYN = j 包（SYN 表示连接请求）,进入SYN_SEND状态，等待服务端确认（**服务端确认：自己接收正常，对方发送正常**）。
2. **第二次握手**：服务端同意连接请求，返回 SYN-ACK 包，SYN（等于 j 表示是确认了该客户端的连接请求） 、ACK = 1 （等于 1 表示有效 ACK 包，用于验证服务端到客户端通信是否正常）、seq = y（服务端起始序列号） 、ack = x+1（确认号，期望收到的下一个数据的开头），进入 SYN-RCVD 状态，等待客户端确认（**客户端确认：自己发送接收正常，对方发送接收正常**）。
3. **第三次握手**：客户端收到确认包，发送 ACK 包，ACK=1，seq = x+1, ack = y + 1，发送完毕即双方进入 ESTABLISHED 状态（**服务端确认：自己发送正常，对方接收正常**）。

**三次握手的目的就是双方确认自己与对方发送和接收是正常**。

### TCP 四次挥手

![](../public/basics/net-3.png)

**第一次挥手**：客户端发送一个断开连接的 FIN 报文：FIN=1（表示断开连接）、seq=u，主动关闭连接，进入 FIN-WAIT1 状态，等待服务端确认。

**第二次挥手**：服务端收到 FIN 报文，返回ACK报文：ACK = 1、ack= u + 1，seq = v，服务端进入 CLOSE_WAIT 状态，此时客户端到服务端的连接释放。而客户端收到这个确认报文后进入FIN_WAIT2（终止等待2）状态（等待服务端的连接释放报文）

**第三次挥手**：服务端发送一个断开连接的 FIN 报文：FIN=1（表示断开连接）、ACK=1、seq=w、ack=u+1，主动关闭连接，进入 LAST-ACK 状态，等待客户端的确认。
第四次挥手：客户端收到服务端的 FIN 报文后，返回确认报文段（ACK=1，seq=u+1，ack=w+1），客户端进入 TIME_WAIT（时间等待）状态。等待 `2MSL` 时间后客户端进入CLOSE状态（1. ACK有可能丢失，从而导致处在 LAST-ACK 状态的服务器收不到对FIN的确认报文。**服务器会超时重传这个 FIN**；2. **使本连接持续的时间内所产生的所有报文段都从网络中消失**）。

**四次挥手的原因：服务端收到FIN报文时，很可能仍然有数据发送，因此服务端返回的确认客户端FIN报文的ACK报文需要和服务端断开连接的FIN报文分开发送**。

### TCP 的可靠传输

- **流量控制**：通过滑动窗口限制发送方的发送速率来保证接收方来得及接收实现流量控制，其中滑动窗口的大小由接收方返回的确认报文中的窗口大小字段来决定。
- **差错控制**：检验报文段首部和数据的检验和，把检验和有差错的报文进行丢弃和不确认。
- **超时重传**：发送方超过定时器时间未收到确认即进行重传。
- **重复丢弃**：接收端对重复报文段只确认一次，其余丢弃。
> **ARQ（自动重传请求）**： 1. **停止等待 ARQ**；2. **连续 ARQ**；**区别在于前者发送方每发送一个报文段后即等待确认**（**确认报文段丢失**：丢弃发送方发送的重复消息，不向上层交付并再向发送方发送确认消息。**确认报文段迟到**：发送方收到重复的确认和接收方收到重复的消息都直接丢弃。），**而后者发送方连续发送，接收方进行累计确认**。
- **拥塞控制**：采用**慢开始**（初始值为 1，指数段）、**拥塞避免**（线性段）、**快重传**和**快恢复**的策略，**具体过程**：慢开始到初始门限值 `ssthresh` 后进入拥塞避免端直到拥塞（标志：三个重复 ACK），先优先快重传丢失的报文段，然后更新 `ssthresh` 门限值为拥塞的一半，后续报文段进入快恢复（初始值为新 `ssthresh` 门限值）阶段继续拥塞避免（线性段）。

![](../public/basics/net-4.png)

## DNS

DNS（Domain Name System）域名系统，是一个层次化、分散化的互联网连接资源命名系统。DNS 维护着一个域名列表以及与之相关联的资源（即 IP 地址）。DNS 最突出的功能是将易于记忆的域名翻译成为数字化的IP地址；从域名到 IP 地址的映射过程被称为 **DNS 查询**（DNS lookup）。而 **DNS 反向查询**（rDNS）用来找到与 IP 地址对应的域名。

DNS 数据库存储在全球每个 DNS 服务器上，所有这些服务器都源于 (refer to) 几个被称为“权威名称服务器”或“顶级 DNS 服务器”。只要你的注册商创建或更新给定域名的任何信息，信息就必须在每个 DNS 数据库中刷新。知道给定域名的每个 DNS 服务器都会存储一段时间的信息，然后再次刷新（DNS 服务器再次查询权威服务器）。因此，知道此域名的 DNS 服务器需要些时间才能获取最新信息，这个时间一般被称为传播时间。然而这个术语是不精准的，因为更新本身没有传播 (top → down)。被计算机(down) 查询的 DNS 服务器只在它需要的时候才从权威服务器 (top) 中获取信息。

### 域名和 TLD(顶级域)

域名是在互联网的网站的地址。域名被用于URL识别一个服务器属于哪个特定的网站。域名包含由句号点（”.“）分隔的标签（名称）的分级序列并以 TLD 作为结尾，不同于中文书写顺序，它需要从右到左阅读。二级域 (SLD，Secondary Level Domain)是刚好位于 TLD 前面的标签。一个域名可以有多个标签（或者说是组件、名称），没有强制规定必须要 3 个标签来构成域名。

TLD（顶级域）是互联网分层 DNS（域名系统）中最通用的域，且是作为域名的最后一个组成部分。顶级域既可以包含拉丁字母，也可以包含特殊字符。顶级域名最长可以达到 63 个字符，为了使用方便，大多数顶级域都是两到三个字符。ICANN（互联网名称与数字地址分配机构）指定组织来管理每个 TLD。根据管理组织的严格程度，TLD 通常可以作为网站目的、所有权或国籍的线索。IANA 区分了以下几组顶级域：
1. 国家/地区代码顶级域 (ccTLD，country-code top-level domains)：为国家或地区建立的二字符域。
2. 国际化国家代码顶级域 (IDN c​​cTLD)：非拉丁字符集（例如阿拉伯语或中文）的 ccTLD。
3. 通用顶级域 (gTLD)：具有三个或更多字符的顶级域。
4. 非赞助顶级域：直接根据 ICANN 流程为全球互联网社区制定的政策运营的域，例如“com”和“edu”。
5. 赞助顶级域：由私人组织提议和赞助，这些组织根据社区主题概念决定申请人是否有资格使用 TLD。
6. 基础设施顶级域：该组仅由一个域组成，即地址和路由参数区域 (arpa)， 尤其是用于反向 DNS 查找。

### 选择非 www 的还是 www 的 URL?

选择 www 或非 www URL 作为其中之一作为规范域名，保证所有绝对链接都应使用它。同时，HTTP 允许使用两种技术，当无法预测用户会在浏览器地址栏使用哪个 URL时，以便让用户或搜索引擎清楚地知道哪个域是规范域，同时仍然允许非规范域正常工作并提供预期的页面：
1. 在需要对接收 HTTP 请求的服务器进行配置，使其对任何指向非规范域的请求作出带指向规范域的HTTP Location首部的 HTTP 301 响应。这将把试图访问非规范 URL 的浏览器重定向到其规范等效域。
2. 为两个域提供相同的内容，向页面添加 `<link rel="canonical" href="">` 元素指示页面的规范地址。这对用户没有影响，但会告诉搜索引擎爬虫页面的实际位置。这样，搜索引擎就不会多次索引同一个页面，避免将其视为重复内容或垃圾邮件甚至将页面从搜索引擎结果页面中删除或降级。与前一种情况不同，浏览器历史记录会将非 www 和 www URL 视为独立条目。

### DNS 使用 TCP 还是 UDP？

1. **使用 TCP**：**辅域名服务器**会定时（一般3小时）向**主域名服务器**查询数据是否有变动。如有变动，则会执行一次区域传送，进行数据同步。区域传送使用TCP是因为传送的数据量比一个请求/应答的数据量要多得多，而且需要保证数据的准确性。
2. **使用 UDP**：目的是**避免使用 TCP 协议造成的连接时延**。因为得到一个域名的 IP 地址，往往会向多个域名服务器查询，如果使用 TCP 协议，那么每次请求都会存在连接时延，会使得 DNS 服务变得很慢，导致网页等待时间过长。

## URI、URL、URN

URI（统一资源标识符，Uniform Resource Identifier）是一个用于标识（区分）互联网资源的字符串，允许用户对网络中的资源通过特定的协议进行交互操作。URI 只支持 ASCII 码，对于非ASCII 码和界定符（比如空格）编码转为“%十六进制字节值”。

![URI示例](../public/basics/net-5.png)

> 其中，**scheme（或protocol）是方案（或协议）**，常见协议有：
> 1. data：Data URIs；即前缀为 data: 协议的 URL，其允许内容创建者向文档中嵌入小文件。 现代浏览器将 Data URL 视作唯一的不透明来源，是不可以用于导航的 URL。由四个部分组成：`data:[<mediatype>][;base64],<data>`。使用场景：1. CSS url()；2. img元素src；3. link元素href。Opera 11 浏览器限制 URL 最长为 65535 个字符，这意味着 data URL 最长为 65529 个字符（如果你使用纯文本 data:，而不是指定一个 MIME 类型的话，那么 65529 字符长度是编码后的长度，而不是源文件）。Firefox 97 及更高版本支持高达 32MB 的数据 URL（在 97 之前，限制接近 256MB）。Chromium 支持到超过 512MB 的 URL，Webkit（Safari）支持到超过 2048MB 的 URL。
    > 1. `data:`：前缀。
    > 2. `[<mediatype>]`：可选，指示数据类型的MIME类型字符串。如果被省略，则默认值为 text/plain;charset=US-ASCII。
    > 3. `[;base64]`：如果非文本则为可选的base64标记。在 Windows 中，PowerShell 的 Convert.ToBase64String 可用于执行 Base64 编码：
        > 1. `[convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("hello"))`
    > 4. `<data>`：数据本身。如果数据包含RFC 3986中定义为保留字符的字符或包含空格符、换行符或者其他非打印字符，这些字符必须进行百分号编码（又名“URL 编码”）。如果数据是文本类型，可以直接将文本嵌入（根据文档类型，使用合适的实体字符或转义字符）。否则，可以指定base64标记来嵌入 base64 编码的二进制数据。data字段是没有结束标记的，所以尝试在data URL后面添加查询字符串（特定于页面的参数，语法为 `<url>?parameter-data`）会导致查询字符串也一并被当作data字段。 
> 2. file：指定主机上文件的名称；
> 3. ftp：文件传输协议；
> 4. http、https：超文本传输协议、安全的超文本传输协议；
> 5. mailto：电子邮件地址；
> 6. ssh：安全shell；
> 7. tel：电话
> 8. urn：统一资源名称；
> 9. view-source：资源的源代码；
> 10. ws、wss：WebSocket连接。

> **#fragment（或Anchor）**是资源本身的某一部分的一个锚点。# 号后面的部分，也称为**片段标识符**，永远不会与请求一起发送到服务器。

URI 可以分为 URL（统一资源定位符，Uniform Resource Locator）和 URN（永久统一资源定位符，Uniform Resource Name），URN 通过特定命名空间中的唯一名称来标识资源。

![URL示例](../public/basics/net-6.png)

## 媒体类型（MIME）

**媒体类型**（**Multipurpose Internet Mail Extensions 或 MIME 类型**）是一种标准，用来表示文档、文件或字节流的性质和格式。其语法结构为 type/subtype，由类型 type 与子类型subtype 两个字符串中间用'/'分隔而组成，不允许空格存在。**type 表示可以被分多个子类的独立类型或 Multipart 类型**，subtype 表示细分后的每个类型。

> **独立类型**包括：
> 1. text：表明文件是普通文本，理论上是人类可读，比如text/plain, text/html, text/css, text/javascript。对于 text 文件类型若没有特定的 subtype，就使用 text/plain，文本文件默认值。即使它意味着未知的文本文件，但浏览器认为是可以直接展示的。text/plain并不是意味着某种文本数据。如果浏览器想要一个文本文件的明确类型，浏览器并不会考虑他们是否匹配。比如说，如果通过一个表明是下载 CSS 文件的 `<link>` 链接下载了一个 text/plain 文件。如果提供的信息是 text/plain，浏览器并不会认出这是有效的 CSS 文件。CSS 类型需要使用 text/css。
> 2. image：表明是某种图像。不包括视频，但是动态图（比如动态 gif）也使用 image 类型，比如image/gif,image/png、image/jpeg、image/bmp、image/webp、image/x-icon、image/vnd.microsoft.icon。
> 3. audio：表明是某种音频文件，比如audio/midi、audio/mpeg、audio/webm、audio/ogg、audio/wav。 
> 4. video：表明是某种视频文件，比如video/webm, video/ogg。
> 5. application：表明是某种二进制数据，比如application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf。二进制文件没有特定或已知的 subtype，即使用 application/octet-stream，这是应用程序文件的默认值。意思是未知的应用程序文件，浏览器一般不会自动执行或询问执行。浏览器会像对待 设置了HTTP 头Content-Disposition 值为 attachment 的文件一样来对待这类文件。

> **Multipart 类型**：表示细分领域的文件类型的种类，经常对应不同的 MIME 类型。这是复合文件的一种表现方式。

浏览器通常使用 MIME 类型（而不是文件扩展名）来确定如何处理 URL，因此 Web 服务器在响应头中添加正确的 MIME 类型非常重要。如果配置不正确，浏览器可能会曲解文件内容，网站将无法正常工作，并且下载的文件也会被错误处理。

Web 上重要的 MIME 类型：

> 1. text/plain：文本（通常为 ASCII 或 ISO 8859- n）(.txt)。	
> 2. text/css：	层叠样式表(CSS)(.css)。在网页中要被解析为 CSS 的任何 CSS 文件必须指定 MIME 为text/css。通常，服务器不识别以.css 为后缀的文件的 MIME 类型，而是将其以 MIME 为text/plain 或 application/octet-stream 来发送给浏览器：在这种情况下，大多数浏览器不识别其为 CSS 文件，直接忽略掉。特别要注意为 CSS 文件提供正确的 MIME 类型。
> 3. text/html：超文本标记语言(HTML)(.htm或.html)。所有的 HTML 内容都应该使用这种类型。XHTML 的其他 MIME 类型（如application/xml+html）现在基本不再使用。但如果打算使用 XML 的严格解析规则，使用 `<![CDATA[...]]>` 或非 HTML、非 SVG 或非 MathML XML 命名空间中的元素，则仍需要使用 application/xml 或 application/xhtml+xml，因为 text/html 的解析语义与 application/xml 的解析语义存在微妙的不兼容。
> 4. text/calendar：日历格式(.ics)。
> 5. text/javascript：JavaScript(.js)。据 HTML 标准，应该总是使用 MIME 类型 text/javascript 服务 JavaScript 文件。其他值不被认为有效，使用那些值可能会导致脚本不被载入或运行。即便任何给定的 user agent 可能支持这些中的任意或所有，你只应该使用 text/javascript。它是唯一确保能在目前和以后正常工作的 MIME 类型。
> 6. text/javascript：JavaScript 模块(.mjs)。
> 7. text/csv：逗号分隔值(CSV)(.csv)	。

> 8. image/gif：图形交换格式(GIF)(.gif)。
> 9. image/vnd.microsoft.icon：图标格式(.ico)。
> 10. image/bmp：Windows OS/2位图图形(.bmp)。
> 11. image/jpeg：JPEG 图像(.jpeg .jpg)。
> 12. image/png：便携式网络图形(.png)。
> 13. image/tiff：标记图像文件格式(TIFF)(.tif .tiff)。
> 14. image/svg+xml：可缩放矢量图形(SVG)(.svg)。	
> 15. image/webp：	网页图像(.webp)。

> 16. font/otf：OpenType 字体(.otf)。
> 17. font/ttf：TrueType字体(.ttf)。
> 18. font/woff：Web 开放字体格式 (WOFF)(.woff)。
> 19. font/woff2：Web 开放字体格式 (WOFF)(.woff2)。

> 20. audio/midi 或audio/x-midi：乐器数字接口 (MIDI)(.mid或.midi)。
> 21. audio/ogg：奥格音频(.oga)。采用 OGG 多媒体文件格式的音频文件。Vorbis 是这个多媒体文件格式最常用的音频解码器。
> 22. audio/mpeg：MP3音频(.mp3)。
> 23. audio/wav：波形音频格式(.wav	)。音频流媒体文件。一般支持 PCM 音频编码 
> 24. audio/webm：	网络管理音频(.weba)。WebM 音频文件格式。Vorbis 和 Opus 是其最常用的解码器。
> 25. audio/aac：AAC音频(.aac)。

> 26. video/x-msvideo：AVI音频视频交错(.avi)。
> 27. video/ogg：奥格视频(.ogv)。采用 OGG 多媒体文件格式的音视频文件。常用的视频解码器是 Theora；音频解码器为 Vorbis。
> 28. video/mpeg：MPEG视频(.mpeg)。
> 29. video/webm：	网络视频(.webm)。采用 WebM 视频文件格式的音视频文件。VP8 和 VP9 是其最常用的视频解码器。Vorbis 和 Opus 是其最常用的音频解码器。
> 30. video/3gpp audio/3gpp（若不含视频）：3GPP音频/视频容器(.3gp)。
> 31. video/3gpp2 audio/3gpp2（若不含视频）：3GPP2音频/视频容器(.3g2)。

> 32. application/x-abiword：AbiWor文档(.abw)。	
> 33. application/x-freearc：存档文档，嵌入多个文件(.arc)。
> 34. application/vnd.amazon.ebook：亚马逊Kindle电子书格式(.azw)。
> 35. application/octet-stream：任何类型的二进制数据(.bin)。
> 36. application/x-bzip：BZip 存档(.bz)。
> 37. application/x-bzip2：BZip2存档(.bz2)。
> 38. application/x-csh：C-Shell脚本(.csh)。
> 39. application/java-archive：Java存档 (JAR)(.jar)。
> 40. application/msword：微软Word(.doc)。
> 41. application/vnd.openxmlformats-officedocument.wordprocessingml.document：微软Word (OpenXML)(.docx)。
> 42. application/vnd.ms-fontobject：MS 嵌入式OpenType字体(.eot)。
> 43. application/epub+zip：电子出版物(EPUB)(.epub)。
> 44. application/json：JSON格式(.json)。	
> 45. application/ld+json：JSON-LD 格式(.jsonld)。
> 46. application/vnd.apple.installer+xml：苹果安装包(.mpkg)。
> 47. application/vnd.oasis.opendocument.presentation：OpenDocument演示文档(.odp)。
> 48. application/vnd.oasis.opendocument.spreadsheet：OpenDocument电子表格(.ods)。
> 49. application/vnd.oasis.opendocument.text：OpenDocument文本文档(.odt)。
> 50. application/ogg：奥格(.ogx)。采用 OGG 多媒体文件格式的音视频文件。常用的视频解码器是 Theora；音频解码器为 Vorbis。	
> 51. application/pdf：Adobe便携式文档格式(PDF)(.pdf)。	
> 52. application/vnd.ms-powerpoint：微软PowerPoint(.ppt)。
> 53. application/vnd.openxmlformats-officedocument.presentationml.presentation：微软PowerPoint (OpenXML)(.pptx)。
> 54. application/x-rar-compressed：RAR存档(.rar)。
> 55. application/rtf：富文本格式(RTF)(.rtf)。
> 56. application/x-sh：Bourne shell脚本(.sh)。
> 57. application/x-shockwave-flash：小型网页格式(SWF) 或 Adobe Flash 文档(.swf)。
> 58. application/x-tar：磁带存档(TAR)(.tar)。	
> 59. application/vnd.visio：微软Visio	(.vsd)。
> 60. application/xhtml+xml：	XHTML(.xhtml)。
> 61. application/vnd.ms-excel：微软Excel(.xls)。
> 62. application/vnd.openxmlformats-officedocument.spreadsheetml.sheet：Microsoft Excel (OpenXML)(.xlsx)。	
> 63. application/xml：XML代码对普通用户来说不可读 (RFC 3023, section 3) text/xml 代码对普通用户来说可读 (RFC 3023, section 3)(.xml)。	
> 64. application/vnd.mozilla.xul+xml：选择(.xul)。
> 65. application/zip：ZIP存档(.zip)。	
> 66. application/x-7z-compressed：7-zip存档(.7z)。	

> 67. multipart/form-data：将完整的 HTML 表单的值从浏览器发送到服务器时，可以使用 multipart/form-data 类型。作为多部分文档格式，它由不同部分组成，由边界（以双破折号”--”开头的字符串）分隔。每个部分都是其自己的实体，具有自己的 HTTP 标头、Content-Disposition 和用于文件上传字段的 Content-Type。
> 68. multipart/byteranges：用于把部分的响应报文发送回浏览器。当发送状态码206 Partial Content 时，这个 MIME 类型用于指出这个文件由若干部分组成，每个部分对应一个请求的范围。

## 绝对路径与相对路径

**当前资源**是资源当前所处的 html 文件或 CSS 文件；**目标资源**是在当前资源中取访问的一个其他资源。

**绝对路径**则是与当前资源的 path 无关。比如当前资源是 `http:<span></span>//b.com/some/something?id=1*，其中 path 是some/something?id=1h1：
1. `http:<span></span>//b.com/list` 即 `http:<span></span>//b.com/list`
2. 省略协议：`//b.com/list` 即协议名沿用当前资源的协议，即 `http:<span></span>//b.com/list`
3. 省略协议，域名，端口：`/list` 省略即 `http:<span></span>//b.com/list`
4. `/` 即 `http:<span></span>//b.com/`

**绝对路径的使用场景**：
1. 站外资源只能使用绝对路径：iconfont 的 css、站外图片、站外链接等；（站外资源是指非当前网站的资源，站内资源指的是当前网站的资源）。
2. 当前资源和目标资源的相对位置不稳定或不明确，且目标资源的path是稳定的，推荐绝对路径：用户上传的图片地址、多地址的页面引入同一目标资源等。

**相对路径**则是相对于当前资源的 path 的路径。比如当前资源是 `http:<span></span>//b.com/some/something?id=1#h1`，path 为域名后面的部分，path 目录为最后一个斜杠之前的部分，因此：
1. `./list` 即 `http:<span></span>//b.com/some/list`
2. `../list` 即 `http:<span></span>//b.com/list`
3. `list` 即 `http:<span></span>//b.com/some/list`
4. `?id=2` 即 `http:<span></span>//b.com/some/something?id=2`
5. `#h2` 即 `http:<span></span>//b.com/some/something?id=1#h2`

**相对路径的应用场景**：当前资源与目标资源的相对位置稳定且明确，开发中大部分场景均适用。

## Websocket

WebSocket是 HTML5 中的全双工、双向通信协议，专门为快速传输小数据设计，支持持久（长）连接，而且服务端可主动 push，不受同源策略限制。数据轻量开销小且通信高效。

WebSocket 未加密的请求协议是 ws://，默认端口是 80；加密的请求协议是 wss://，默认端口是 443。

**Websocket 的缺点**：
1. 兼容性；
2. 对于消息少的场景，维持TCP连接会造成资源浪费。

### 握手

握手阶段采用 HTTP 协议完成一次特殊的请求-响应，ws:// 则是采用 HTTP，wss:// 则采用HTTPS。握手阶段的请求头为：

> Upgrade: websocket  
> Connection: Upgrade  
> Sec-WebSocket-Version: 13  
> Sec-WebSocket-Key: YWJzZmFzZmRhYw==

握手阶段的响应消息则是:

> HTTP/1.1 101 Switching Protocols  
> Upgrade: websocket  
> Connection: Upgrade  
> Sec-WebSocket-Accept: ZzIzMzQ1Z2v3NDUyMzIzNGvy  

握手完成后，后续消息的收发不再使用HTTP协议，任何一方都可主动发消息给对方。

JavaScript 中使用 `new WebSocket(url[,protocols])` 创建一个 WebSocket 对象，url 必须是绝对 URL，构造函数内部即进行握手。

### 属性与方法

**实例属性与方法**：
1. readyState：只读属性，表示当前 WebSocket 的链接状态，取值有：
    1. 0：即 WebSocket.OPENING，正在建立连接。
    2. 1：即 WebSocket.OPEN，已经建立连接。
    3. 2：即 WebSocket.CLOSING，正在关闭连接。
    4. 3：即WebSocket.CLOSE，已经关闭连接。
2. send(data)：发送数据，对于复杂数据，应先序列化再发送（JSON.stringify(data)）。
3. close()：关闭连接。

**wsInstance.addEventListener(‘eventString’, eventHandler)**：
1. wsInstance.onmessage（事件字符串message）：message 事件会在 WebSocket 接收到新消息时被触发。数据在event.data中。
2. wsInstance.onopen（事件字符串open）：定义一个事件处理程序，当WebSocket 的连接状态readyState 变为1时调用，这意味着当前连接已经准备好发送和接受数据。
3. wsInstance.onerror（事件字符串error）：当websocket的连接由于一些错误事件的发生 (例如无法发送一些数据) 而被关闭时，一个error事件将被引发。
4. wsInstance.onclose （事件字符串close）：在连接关闭时触发，有 event 对象（具有三个额外的属性： wasClean — 表示连接是否已经明确地关闭、 code — 服务器返回的数值状态码、reason—包含服务器发回的消息）。

### Socket.io

**Socket.IO** 是一个可以在客户端和服务器之间实现低延迟, 双向和基于事件的通信的库。Socket.IO 不是 WebSocket 实现，而是建立在 WebSocket 协议之上，并为每个数据包添加了额外的元数据，因此如果一方使用 Socket.IO，则双方都要使用。

Socket.IO 在普通 WebSockets 上扩展的功能：
1. **HTTP 长轮询回退**：如果无法建立 WebSocket 连接（老版本浏览器不支持或用户使用了错误配置的代理），连接将回退到 HTTP 长轮询。
2. **自动重新连接**：在某些特定情况下，服务器和客户端之间的 WebSocket 连接可能会中断，而双方都不知道链接的断开状态。Socket.IO 包含心跳机制，它会定期检查连接的状态。当客户端最终断开连接时，它会以指数回退延迟自动重新连接，以免使服务器不堪重负。
3. **数据包缓冲**：当客户端断开连接时，数据包会自动缓冲，并在重新连接时发送。
4. **基于事件的通信**：由服务器和客户端约定事件的监听方和发送方，进行基于事件的通信。约定事件时，为避免与 Socket.IO 的预定义事件冲突，建议加上特殊符号，比如$。
5. **广播**：在服务器端可以向所有连接的客户端或客户端的子集发送事件。
6. **多路复用**：命名空间允许在单个共享连接上拆分应用程序的逻辑。

## HTTP

超文本传输协议（HTTP）是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的客户端—服务端模型，客户端通过 TCP 或者是 TLS 打开一个连接以发出请求（request），然后等待直到收到服务器端响应（response）。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。

![](../public/basics/net-7.png)

**在客户端与服务端之间，还有许多的被称为代理的实体，履行不同的作用**：
1. 缓存（可以是公开的也可以是私有的，如浏览器的缓存）
2. 过滤（如反病毒扫描、家长控制...）
3. 负载均衡（让多个服务器服务不同的请求）
4. 认证（控制对不同资源的访问）
5. 日志（使得代理可以存储历史信息）

### HTTP 报文结构

由请求（响应）起始行 + 请求（响应）头部 + 空行（**区分头部与实体**） + 实体（body）构成。其中请求(响应)起始行分别为方法 + URI路径 + HTTP版本 （版本 + 状态码 + 原因Reason）:

![](../public/basics/net-8.png)

**空行之前不能存在空行的原因：多余的空行会导致空行后的内容全部被视为实体**。

**首部字段的格式特点**：字段名不区分大小写、不允许出现空格，不可以出现下划线 _、字段名后必须紧跟着冒号（:）

### HTTP 的特点（优缺点）

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