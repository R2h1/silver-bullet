import{_ as t,o as a,c as e,R as s}from"./chunks/framework.OLpLg_fz.js";const r="/silver-bullet/assets/1.JLs_OfTk.png",o="/silver-bullet/assets/2.bCyXj6pk.png",b=JSON.parse('{"title":"我的看单","description":"","frontmatter":{},"headers":[],"relativePath":"projects/theater/my-watchlist.md","filePath":"projects/theater/my-watchlist.md","lastUpdated":1712402870000}'),i={name:"projects/theater/my-watchlist.md"},c=s('<h1 id="我的看单" tabindex="-1">我的看单 <a class="header-anchor" href="#我的看单" aria-label="Permalink to &quot;我的看单&quot;">​</a></h1><h2 id="问题-1" tabindex="-1">问题 1 <a class="header-anchor" href="#问题-1" aria-label="Permalink to &quot;问题 1&quot;">​</a></h2><p>历史记录从端上获取，由于不支持分页，采用模拟分页的方式，usePagination去消费所有从端上取到的历史记录。再根据这些分页好的数据去与后台进行交互，保证一次请求后台的数据量不会太多。</p><p><img src="'+r+'" alt=""></p><h2 id="问题-2" tabindex="-1">问题 2 <a class="header-anchor" href="#问题-2" aria-label="Permalink to &quot;问题 2&quot;">​</a></h2><p>收藏记录直接从后台获取，但每一条记录中的观看进度依赖播放页的播放记录的上报，原本是这个播放记录是后台消费端上的上报流水，链路过长具有一定的延迟，导致用户刚观看马上切到看单，不会立即更新观看记录，每一条历史记录也会存在这个问题针对这个问题，进行了改造，由前端直接将当前播放的的视频同步到后台，当 vid 改变的时候（收到终端 onPlay 回调时）。快速滑动可能存在性能问题。</p><p><img src="'+o+'" alt=""></p>',7),l=[c];function n(_,h,p,d,m,u){return a(),e("div",null,l)}const P=t(i,[["render",n]]);export{b as __pageData,P as default};