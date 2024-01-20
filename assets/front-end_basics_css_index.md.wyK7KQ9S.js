import{_ as t,o as i,c as o,R as e}from"./chunks/framework.buEibnTs.js";const n="/silver-bullet/assets/1.CevksEca.png",m=JSON.parse('{"title":"CSS","description":"","frontmatter":{},"headers":[],"relativePath":"front-end/basics/css/index.md","filePath":"front-end/basics/css/index.md","lastUpdated":1705768166000}'),s={name:"front-end/basics/css/index.md"},l=e('<h1 id="css" tabindex="-1">CSS <a class="header-anchor" href="#css" aria-label="Permalink to &quot;CSS&quot;">​</a></h1><p>CSS（层叠样式表，Cascading Style Sheets）不是编程语言，而是用来描述 HTML 或 XML（包括如 SVG、MathML 或 XHTML 之类的 XML 分支语言）文档的表现与展示效果的样式表语言。CSS3是CSS的最新标准，是<strong>向后兼容（指的是老版本的功能和数据在新版本能完美运行，与向前兼容相反）的</strong>，CSS1/2 的特性在 CSS3 里也可以使用。</p><h2 id="值与单位" tabindex="-1">值与单位 <a class="header-anchor" href="#值与单位" aria-label="Permalink to &quot;值与单位&quot;">​</a></h2><p>所有的 CSS 声明都包括一个 属性 / 值 对。由于属性不同，对应的值可能是一个单个整数或关键字，也可能是一串包含或不包含计数单位的数字和关键字的集合。</p><p><img src="'+n+'" alt=""></p><p>通常，支持四个方位的简写属性可以采用单值、两值、三值、四值语法，其中单值设置上下左右，两值设置上下、左右，三值设置上、左右、下，四值设置上、右、下、左。</p><p><strong>初始值（initial value）、指定值 (specified value) 、计算值（computed value）、应用值（used value）、解析值（resolved value）、实际值（actual value）</strong>：</p><p><strong>初始值</strong>：CSS 属性的初始值是其默认值，即规范中其定义表中所列，注意，初始值不应与浏览器样式表指定的值混淆。初始值的使用取决于属性是否被继承：<strong>对于继承的属性</strong>，只要未提供指定值，初始值仅用于根元素。<strong>对于非继承属性</strong>，只要未提供指定值，所有元素都会使用初始值。可以使用 initial 关键字显式指定初始值。</p><p>浏览器执行四个步骤来计算一个属性的<strong>实际（最终）值</strong>。</p><ol><li>首先，根据<strong>级联</strong>和<strong>层叠</strong>、<strong>继承</strong>或<strong>使用初始值</strong>的结果来确定指定值。</li><li>接下来，根据规范计算计算值。</li><li>然后，计算布局，产生使用值。</li><li>最后，根据本地环境的限制对使用的值进行转换，产生实际值。</li></ol><p>CSS属性的<strong>指定值</strong>获取途径：</p><ol><li>首先文档的样式表（用户代理样式表或页面作者样式表或用户自定义样式表）中给这个属性赋的值，通过样式层叠（选取样式表里权重最高的规则）后会被优先使用；</li><li>如果文档的样式表中没有给这个属性赋值，那么它会尝试从父元素那继承一个值；</li><li>如果上面的两种途径都不可行，则把CSS规范中针对这个元素的这个属性的初始值作为指定值。</li></ol><p>CSS属性的<strong>计算值</strong>是在继承期间从父级传输到子级的值。通过以下方式从指定值计算得出的：</p><ol><li>处理特殊值inherit, initial, revert, revert-layer和unset；</li><li>执行所需的计算以达到属性定义表中&quot;计算值&quot;一行中所描述的值，而所需的计算通常涉及将相对值转换为绝对值(如em单位或百分比)。对于依赖布局的CSS属性百分比值或auto就是计算值： <ol><li>background-position</li><li>bottom,left, right, top</li><li>height, width</li><li>margin-bottom, margin-left, margin-right, margin-top</li><li>min-height, min-width</li><li>padding-bottom, padding-left, padding-right, padding-top</li><li>text-indent</li></ol></li></ol><p>此外，line-height如果是没有单位的数字，该值就是它的计算值。</p><p>CSS属性的<strong>应用值</strong>是对计算值执行所有计算后的值。</p><p>CSS属性的<strong>解析值</strong>是getComputedStyle返回的值。对于于大多数属性，它是计算值；但对于一些旧属性（包括宽度和高度），它是应用值。</p><p>CSS属性的<strong>实际值</strong>是在应用了任何必要的近似值之后该属性的使用值。例如，一个只能呈现整数像素宽度的边框的用户代理可以将边框的厚度四舍五入到最接近的整数。</p>',18),r=[l];function a(p,g,d,S,c,h){return i(),o("div",null,r)}const u=t(s,[["render",a]]);export{m as __pageData,u as default};
