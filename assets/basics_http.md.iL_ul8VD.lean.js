import{_ as r,D as a,o as l,c as i,k as t,I as s,w as T,R as o,a as e}from"./chunks/framework.buEibnTs.js";const g="/silver-bullet/assets/net-7.IaycXHLq.png",d="/silver-bullet/assets/net-8.52Ql9drh.png",p="/silver-bullet/assets/net-40.d_bBtvj5.png",h="/silver-bullet/assets/net-37.3smeMEoP.png",c="/silver-bullet/assets/net-38.Tm3qtmhH.png",P="/silver-bullet/assets/net-39.ZAwm1g_c.png",U=JSON.parse('{"title":"HTTP","description":"","frontmatter":{},"headers":[],"relativePath":"basics/http.md","filePath":"basics/http.md","lastUpdated":1702825769000}'),b={name:"basics/http.md"},S=o("",18),u=t("li",null,[t("strong",null,"100 Continue"),e("。表示目前为止一切正常，客户端应该继续请求，如果已完成请求则忽略。如果要让服务器检查请求头，客户端必须在初始请求中发送 Expect: 100-continue 作为标头，并发送带 body 的实际请求之前接收 100 Continue。")],-1),C=t("li",null,[t("strong",null,"101 Switching Protocols"),e("。表示服务器同意升级协议，协议由客户端在 Upgrade 请求头中降序列举，由服务器在 Upgrade 响应头中确认。只能切换到更高级的协议，例如，HTTP 升级为 WebSocket。")],-1),m=t("li",null,[t("strong",null,"103 Early Hints 早期提示"),e("。由服务器仍在准备响应时发送，并提示客户端服务器期望最终响应将链接的资源。这允许浏览器甚至在服务器准备并发送最终响应之前就开始预加载资源。主要与指示要加载的资源的 Link 标头一起使用，也还可能包含处理早期提示时强制执行的 Content-Security-Policy 标头（比如，早期响应通过将 CSP 设置为”self”限制为与请求相同的源才预加载资源。虽然最终响应可能会将 CSP 设置为无，即资源已被预加载，但不会被使用）。服务器可能会在重定向后发送多个 103 响应。浏览器只处理第一个早期提示响应，如果请求导致跨源重定向，则必须丢弃该响应。来自早期提示的预加载资源会有效地预加载到文档的 head 元素中，然后才是最终响应中加载的资源。出于兼容性考虑（Chrome103+/Firefox102+且需要用户主动启用，Edge103+且支持范围限制在 HTTP/2 或更高版本），除非已知客户端能正确处理该响应，建议只通过 HTTP/2 或更高版本发送早期提示响应。")],-1),H=o("",82);function E(L,A,_,f,q,y){const n=a("font");return l(),i("div",null,[S,t("ol",null,[u,C,t("li",null,[s(n,{color:"gray"},{default:T(()=>[e("102 Processing 正在处理。向客户端指示已收到完整请求并且服务器正在处理该请求。仅当服务器预计请求需要很长时间时才发送，它告诉客户端请求尚未终止。已弃用，不应再发送，客户可能仍接受它，但会忽略。")]),_:1})]),m]),H])}const x=r(b,[["render",E]]);export{U as __pageData,x as default};
