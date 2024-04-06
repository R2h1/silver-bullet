# CSS

CSS（层叠样式表，Cascading Style Sheets）不是编程语言，而是用来描述 HTML 或 XML（包括如 SVG、MathML 或 XHTML 之类的 XML 分支语言）文档的表现与展示效果的样式表语言。CSS3是CSS的最新标准，是**向后兼容（指的是老版本的功能和数据在新版本能完美运行，与向前兼容相反）的**，CSS1/2 的特性在 CSS3 里也可以使用。

## 值与单位

所有的 CSS 声明都包括一个 属性 / 值 对。由于属性不同，对应的值可能是一个单个整数或关键字，也可能是一串包含或不包含计数单位的数字和关键字的集合。

![](/front-end/basics/css/1.png)

通常，支持四个方位的简写属性可以采用单值、两值、三值、四值语法，其中单值设置上下左右，两值设置上下、左右，三值设置上、左右、下，四值设置上、右、下、左。

**初始值（initial value）、指定值 (specified value) 、计算值（computed value）、应用值（used value）、解析值（resolved value）、实际值（actual value）**：

**初始值**：CSS 属性的初始值是其默认值，即规范中其定义表中所列，注意，初始值不应与浏览器样式表指定的值混淆。初始值的使用取决于属性是否被继承：**对于继承的属性**，只要未提供指定值，初始值仅用于根元素。**对于非继承属性**，只要未提供指定值，所有元素都会使用初始值。可以使用 initial 关键字显式指定初始值。

浏览器执行四个步骤来计算一个属性的**实际（最终）值**。
1. 首先，根据**级联**和**层叠**、**继承**或**使用初始值**的结果来确定指定值。
2. 接下来，根据规范计算计算值。
3. 然后，计算布局，产生使用值。
4. 最后，根据本地环境的限制对使用的值进行转换，产生实际值。

CSS属性的**指定值**获取途径：
1. 首先文档的样式表（用户代理样式表或页面作者样式表或用户自定义样式表）中给这个属性赋的值，通过样式层叠（选取样式表里权重最高的规则）后会被优先使用；
2. 如果文档的样式表中没有给这个属性赋值，那么它会尝试从父元素那继承一个值；
3. 如果上面的两种途径都不可行，则把CSS规范中针对这个元素的这个属性的初始值作为指定值。

CSS属性的**计算值**是在继承期间从父级传输到子级的值。通过以下方式从指定值计算得出的：
1. 处理特殊值inherit, initial, revert, revert-layer和unset；
2. 执行所需的计算以达到属性定义表中"计算值"一行中所描述的值，而所需的计算通常涉及将相对值转换为绝对值(如em单位或百分比)。对于依赖布局的CSS属性百分比值或auto就是计算值：
    1. background-position
    2. bottom,left, right, top
    3. height, width
    4. margin-bottom, margin-left, margin-right, margin-top
    5. min-height, min-width
    6. padding-bottom, padding-left, padding-right, padding-top
    7. text-indent

此外，line-height如果是没有单位的数字，该值就是它的计算值。

CSS属性的**应用值**是对计算值执行所有计算后的值。

CSS属性的**解析值**是getComputedStyle返回的值。对于于大多数属性，它是计算值；但对于一些旧属性（包括宽度和高度），它是应用值。

CSS属性的**实际值**是在应用了任何必要的近似值之后该属性的使用值。例如，一个只能呈现整数像素宽度的边框的用户代理可以将边框的厚度四舍五入到最接近的整数。

## 定位

position 属性用于指定一个元素在文档中的定位方式。top，right，bottom 和 left 属性则决定了该元素的最终位置。按定位类型将元素分为：
1. 非定位元素（non-positioned element）是其计算后position属性为static（默认值）：位于正常文档流位置，设置top, right, bottom, left 和 z-index 属性无效；
2. 定位元素（positioned element）是其计算后position属性为 relative、absolute、fixed、sticky 。
3. 相对定位元素（relatively positioned element）是计算后position属性为 relative：在不改变页面布局的前提下，**top/right/bottom/left**属性指定了元素的上/右/下/左边界离开其正常位置的偏移（因此会在此元素未添加定位时所在位置留下空白），而且不影响其他元素的位置与自身的尺寸，该值对设置 table-*-group, table-row, table-column, table-cell, table-caption的元素无效。同时，z-index不为auto时会创建新的层叠上下文。

![](/front-end/basics/css/2.png)

4. 绝对定位元素（absolutely positioned element）是计算后position属性为 absolute 或 fixed：元素会被移出正常文档流，并不为元素预留空间，**top/right/bottom/left**属性指定了定位元素**上/右/下/左**外边距边界与其包含块**上/右/下/左**边界之间的偏移。fixed或absolute为其内容建立一个新的块格式上下文，会将display的计算值隐式的变为block。fixed会创建一个新的层叠上下文。
5. 粘性定位元素（stickily positioned element）是计算后位置属性为 sticky ：它被视为相对定位，直到它的包含块在块格式上下文(或最近的滚动祖先即overflow为hidden，hidden, scroll, auto, 或 overlay)中跨越指定的阈值固定住，top/right/bottom/left属性用于计算粘性约束矩形，直到遇到包含块的相反边缘。其次，如果想相对视口固定生效，任何祖先的overflow要为默认值visible。注意：同一个父容器中的sticky元素，如果定位值相等，则会重叠；如果属于不同父元素，且这些父元素正好紧密相连，则会挤开原来的元素，形成依次占位的效果。父级元素设置和粘性定位元素等高的固定的height高度值，或者高度计算值和粘性定位元素高度一样，也没有粘滞效果。当最近的滚动祖先是视口时，粘性定位可以被认为是相对定位和固定定位的混合。

根据重绘内容的复杂性、浏览器性能和设备的处理速度，滚动包含fixed或sticky内容的元素时，浏览器可能无法管理 60 fps 的重绘，从而导致敏感人群的可访问性问题和所有人的卡顿。一个解决方案是添加will-change: transform到定位元素，以在其自己的层中渲染元素，提高重绘速度，从而提高性能和可访问性。

z-index 属性设定了一个定位元素及其后代元素或 flex 项目的 z轴顺序。当元素之间重叠的时候，z-index 较大的元素会覆盖较小的元素在上层进行显示。z-index为auto，盒子不会建立新的**本地层叠上下文**。当前层叠上下文中默认生成的盒子的层叠级别是0。z-index为`<integer>`表示当前层叠上下文中生成的盒子的层叠级别，而且会建立新的本地层叠上下文，意味着后代的 z-indexes 不会与该元素之外的元素的 z-indexes 进行比较。

**形成新的层叠上下文的方式**：

![](/front-end/basics/css/3.png)

## 盒模型

CSS的盒模型存在外部显示类型和内部显示类型，由display属性设置

![](/front-end/basics/css/4.png)

其中外部显示类型（block，inline，inline-block）决定一个盒子是块级盒子（display: block）还是行内盒子（display: inline和inline-block）。

![](/front-end/basics/css/5.png)

内部显示类型（比如flex，grid）则决定盒子内部是如何布局的，比如内部设置为弹性布局（display：flex）或网格布局（display：grid），而默认是按**正常文档流布局**即内部按块级和内联的默认行为布局。如果一个元素是浮动（float不为none）的、绝对定位（fixed或absolute）的或者是根元素（html），那么它就被称为流外（out of flow）即布局方式分别为浮动或绝对定位。如果一个元素不在流外，则称为流内（in-flow）即布局方式为正常流（normal flow），包括相对定位（relative）和粘性定位（sticky）。

![](/front-end/basics/css/6.png)

**CSS 视觉格式化模型**（visual formatting model）根据**CSS基础框盒模型**（CSS basic box model）将文档树中的元素转换为零个或多个盒子（box），盒子会创建一个包含其后代元素的包含块，但是盒子内布局并不由包含块所限制，当盒子的内布局跑到包含块的外面时称为溢出（overflow）。每个盒子的布局由以下因素决定：

![](/front-end/basics/css/7.png)

每个盒子都有一个**内容 content** 和**可选的内边距 padding（隔离元素与内容）**、**边框 border** 、**外边距 margin（隔离元素）**，所能看到的元素显示区域是content + padding + border。外边距总是在计算可见部分后额外添加，设置负值会导致和其他元素重叠。

基础盒模型分为标准盒模型（默认值，box-sizing: content，width/height设置的是content）和替代（IE）盒模型（box-sizing: border-box，width/height设置的是content + padding + border）。

![](/front-end/basics/css/8.png)

**给所有元素默认设置为替代盒模型**：

```css
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
```

**获取盒模型宽高的方式**：

![](/front-end/basics/css/10.png)

正常文档流中，块的下外边距 (margin-bottom)和另一个块的上外边距 (margin-top)有时合并 (折叠) 为单个边距，其大小为单个边距的最大值 (或如果它们相等，则仅为其中一个)，这种行为称为**外边距折叠**。因此设置 float和absolute的元素不处于正常流中，因此不会产生外边距重叠行为。

![](/front-end/basics/css/11.png)

多个设置 display: inline-block 或者 display: inline的元素，它们之间会出现一个微小的空隙。原因默认情况下浏览器会将内联元素标签之间的空白符（空格、回车换行等）合并为一个空格字符处理。解决办法有：

```html
<!-- 1. 去掉内联元素之间的空格或者换行 -->
<a>元素1</a><a>元素2</a><a>元素3</a>
<style>
/* 2. 设置负 margin */
a {
  margin-right: -4px;
}
/* 3. 父元素使用弹性布局 */
.parent {
  display: flex;
  flex-direction: row;
}
/* 4. 父元素设置 font-size: 0; 子元素重新设置 font-size 为正常值 */
.parent {
  font-size: 0;
}
.child {
  font-size: 14px;
}
</style>
```

一个或多个 display: inline-block 或者 display: inline的图片在垂直方向上也会出现空隙，原因是针对内联元素，默认是和父元素的 baseline 对齐，即 vertical-align: baseline; 而基线与父元素的下边缘是存在一定的距离的。解决办法是：

```css
img {
  vertical-align: top;
}
```

**min-width/min-height和max-width/max-height属性**分别为给定元素设置最小和最大宽度/高度。当达到这两者的临界值时（比如内容增加或减少，浏览器窗口尺寸改变），宽度或者高度都不再增加或者减少。当 min-height/min-width 大于 max-height/max-width 或 height/width 时，元素的高度会设置为 min-height/min-width 的值。当 max-height/max-width的值 小于 height/width 时，元素的高度会设置为 max-height/max-width 的值。[min/max]-[width/height]均不能为负值。**min-width/min-height**和**max-width/max-height**初始值是none，width/height的初始值是auto。**常规流中，块级元素width/height为auto时，分别相当于fill-available/fit-content**。auto高度计算时会忽略脱离正常文档流的元素。

![](/front-end/basics/css/14.png)

**margin属性**为给定元素设置所有四个（上下左右）方向的外边距，是margin-top，margin-right，margin-bottom，和 margin-left 四个外边距属性设置的简写。取值可以是`<length>`或`<percentage>`或auto。正常流中，**auto的margin总是会占据全部的多余的空间，但如果是width为auto的块级元素，以width占据剩余空间优先，即**auto的margin计算值为0。而在浮动元素上设置margin为auto时，margin计算值为0。在一个固定宽度的块上设置auto的左右margin可以使它在父元素内水平居中。

**padding属性**为给定元素设置所有四个（上下左右）方向的内边距，是padding-top，padding-right，padding-bottom，和 padding-left 四个外边距属性设置的简写。和margin不同，内边距不能为负值，且没有auto。

**outline属性**是outline-style, outline-width 和 outline-color的简写属性。将 outline 设置为 0 或 none 会移除浏览器的默认聚焦样式，比如input元素。outline和border语法相似，区别在于轮廓（outline）不占据空间，不会影响元素的尺寸，绘制于元素可见区域周围，因此可能与其他元素重叠，通常是矩形，但也可能是非矩形，而且不允许设置单边（border-top，border-right）。

**元素的百分比尺寸及位置的计算值是根据它的包含块计算得的**：
1. height，top，bottom 中的百分值，默认是通过包含块的height进行计算。但如果包含块的height会根据它的内容变化（即为初始值auto，没有指定值），而且包含块的 position 属性的值被赋予 relative 或 static，那么，这些百分比值失效，计算值变为 auto。
2. width, left, right, padding, margin 这些属性由包含块的宽度来计算它的百分值。

**包含块的确定完全依赖于position属性**：
1. 根元素 (`<html>`) 所在的包含块是一个被称为初始包含块的矩形。尺寸是视口 viewport (for continuous media) 或分页媒体 page media (for paged media)。
2. 如果position属性是static的、relative或sticky，则包含块由最近的块容器(如inline-block、block或list-item元素)或块格式化上下文祖先元素的内容区的边缘形成。
3. 如果 position 属性为 absolute，包含块就是由它的最近的 position 的值不是 static （也就是值为fixed, absolute, relative 或 sticky）的祖先元素的内边距区的边缘形成。
4. 如果 position 属性是 fixed，在连续媒体的情况下 (continuous media) 包含块是viewport，在分页媒体 (paged media) 下的情况下包含块是分页区域 (page area)。
5. 如果 position 属性是 absolute 或 fixed，包含块也可能是满足条件之一的最近祖先元素的内边距区的边缘形成：
    1. transform 或 perspective 的值不是 none；
    2. will-change 的值是 transform 或 perspective；
    3. filter 的值不是 none 或 will-change 的值是 filter（只在 Firefox 下生效）。
    4. contain 的值是 paint；
    5. backdrop-filter 的值不是 none。

## 格式化上下文

页面上的所有内容都是格式上下文的一部分，或者是一个被定义为以特定方式（grid，multi-column，flex，table）布局内容的区域。格式化上下文可以分为块格式化上下文、行内格式化上下文和其他（比如弹性、网格等）格式化上下文。**块格式化上下文（block formatting context，BFC）**将根据块布局规则布置子元素，比如文档最外层元素是使用块布局规则的，称为初始块格式上下文；flex 格式化上下文将其子元素布置为flex items等。

**块格式化上下文（Block Formatting Context，BFC）是 Web 页面的可视 CSS 渲染的一部分，是块级盒子的布局过程发生的区域，也是浮动元素（计算BFC高度时浮动元素也参与）与其他元素交互的区域。新 BFC 的行为与最外层文档（html）非常相似，因为它成为主布局内的子布局。BFC 包含其中的所有内容（因此，auto的height会计算BFC内部的浮动），float和clear仅适用于同一格式化上下文中的项目，并且边距仅在同一格式化上下文中的元素之间折叠。块格式化上下文的创建方式（IE浏览器创建方式：zoom：1）与表现及应用**：

![](/front-end/basics/css/15.png)

如果采用浮动创建一个占满整个容器宽度的多列布局，在某些浏览器中最后一列有时候会掉到下一行。这可能是因为浏览器四舍五入了列宽从而所有列的总宽度会超出容器。但如果我们对最后一列采用非浮动方式创建一个新BFC，那么它将总是占据其他列先占位完毕后剩下的空间。

块级盒子参与块格式上下文，块级盒子会从包含块的顶部开始，按序垂直排列，每个盒子的左外边缘会与包含块左边缘重合（如果是从右到左的排版顺序，则盒子的右外边缘与包含块右边缘重合），相邻两个块级盒子之间的垂直间距会遵循外边距折叠原则被折叠。**行内格式上下文（inline formatting context，IFC）**存在与其他格式上下文中，行内盒子参与行内格式上下文，从包含块的顶部开始，按序水平排列。若是**垂直书写模式**，块级盒子按序水平排列，行内盒子按序垂直排列。块轴（block-axis）即是块级盒子排列的方向，行内轴（inline-axis）即是行内盒子排列的方向。

![](/front-end/basics/css/16.png)

## 浮动
float属性指定一个元素从网页的正常流动（文档流）中移除，尽管仍然保持部分的流动性（与绝对定位相反，即允许其他元素的文本（即匿名行盒）和行内级元素环绕它），然后向上向左（float:left）或者向上向右（float:right）平移，直到碰到了所处的包含块的边框，或者碰到同一行另外一个相同方向浮动的元素，或者碰到元素位置在前的**正常流块盒（相反，位置靠后的正常流块盒会无视位置在前的浮动元素进行排列），行盒（包括匿名行盒）或其他BFC在排列时会避开浮动元素**。浮动元素是 float 的计算值非 none 的元素。由于浮动意味着使用块格式上下文，某些情况下会修改 display 属性的计算值：

![](/front-end/basics/css/17.png)

**clear属性**指定一个元素是否必须移动到在它之前的浮动元素下面看，适用于浮动和非浮动元素。当应用于非浮动块时，它将非浮动块的边框边界移动到所有相关浮动元素（即在相同块格式化上下文中的前置浮动）外边距的下方，这个非浮动块的顶部外边距会折叠，而两个浮动元素的垂直外边距将不会折叠。当应用于浮动元素时，它将底部元素的外边距边缘移动到所有相关的浮动元素（即在相同块格式化上下文中的前置浮动）外边距边缘的下方，这会影响后面浮动元素的布局，因为后面的浮动元素的位置无法高于它之前的元素。

![](/front-end/basics/css/18.png)

如果一个元素只包含浮动子元素，它的高度就会崩溃为0。如果希望该元素自适应包含所有浮动元素（非自适应的话，也可以给父元素显式指定高度），则需要给该元素添加clearfix类清楚浮动：

```css
/* 添加伪元素来清除浮动 */
.clearfix::after {
  content: '';
  display: block;
  height: 0px;
  clear: both;
  visibility: hidden;
}

/* 或者创建 BFC 清除浮动 */
.clearfix {
  display: flow-root;
}
```

## 边框属性

**border属性**是border-width、border-style、border-color简写属性。但border 属性只接受三个参数，分别是宽度、风格和颜色，所以这样会使得四条边的边框相同。如果border-style未定义，它将不可见，这是因为样式默认为 none。border-color的默认值是color属性的值。

![](/front-end/basics/css/20.png)

**border-image**（CSS3）用于在元素的边框上绘制图像，它会替换掉 border-style 属性所设置的边框样式。border-image-slice 属性可以用四个指定的 `<number-percentage>` 值来表示每一个图像切片的位置。负数是无效的，而大于其相应的最大尺寸的值则会被限制为 100%。

![](/front-end/basics/css/21.png)

```CSS
/**
  点九图：把一张 PNG 图分成了 9 个部分（9宫格），分别是 4 个角，4条边，以及一个中间区域；
  四周保持不同，中间区域根据内容伸缩
*/ 
.nine-path {
  position: relative;
  width: 207px;
  min-width: 207px;
  height: auto;
  min-height: 130px;
  margin: 48px;
  transform-origin: 103.5px -48px;
  border-image-source: url('./bg.png');
  border-image-slice: 48 61 27 61 fill;
  border-image-width: 48px 61px 27px 61px;
  border-image-outset: 48px 61px 27px 61px;
  border-image-repeat: repeat;
}
```

特别注意，若 border-image-source的值为 none 或者图片不能显示，则会降级为 border-style。

**border-radius**（CSS3）设置边框的圆角，当使用一个半径时确定一个圆形圆角，当使用两个半径时（半长轴和半短轴）确定一个椭圆圆角。是border-top-left-radius、border-top-right-radius、border-bottom-right-radius，和 border-bottom-left-radius 的简写属性。当 border-collapse 的值为 collapse 时，border-radius 属性不会被应用到表格元素上。当使用百分比值的时候，水平半轴相对于盒模型的宽度；垂直半轴相对于盒模型的高度。**border-radius:50% 和 100% 的区别？**W3C规定如果两个相邻的角的半径和超过了对应的盒子的边的长度，那么浏览器要重新计算保证它们不会重合即同时缩放两个圆角的半径，直至两个相邻角的半径和为盒子的长度。

**box-shadow（CSS3）** 用于定义元素的阴影，可设置的值包括阴影扩散方向，阴影的 X 轴偏移量、Y 轴偏移量、模糊半径、扩散半径和颜色。偏移量x的正（负）对应于阴影出现在右（左）侧。偏移量y的正（负）对应于阴影出现在底（顶）侧，若使用insert关键字则刚好相反。

![](/front-end/basics/css/22.png)

box-shadow 可以用来尝试处理移动端1px的问题（画0.5px的线）：

```css
.one-pixel {
  -webkit-box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.6);
}
```

## 渐变（CSS3）

CSS渐变由两种或多种颜色之间的渐进过渡组成，数据类型是`<gradient>`，是类型`<image>`的子类型。渐变可以在任何使用 `<image>` 的地方使用，例如在背景中。

**线性渐变 linear-gradient**，线性渐变的着色线垂直于渐变线。渐变线由包含渐变图形的容器的中心点和一个角度来定义的。渐变线上的颜色值是由不同的点来定义，包括起始点，终点，以及两者之间的可选的中间点（中间点可以有多个）。着色线上的颜色和渐变线上的色点一致。起始点由渐变线和从最近的顶点发出的垂直线之间的交叉点定义的，终点是起点关于容器的中心点的反射点。利用在颜色后面添加`<length>`或者`<percentage>`数据类型来定义颜色中间点的位置。

![](/front-end/basics/css/24.png)

![](/front-end/basics/css/25.png)

**径向渐变radial-gradient**，从原点（容器中心）辐射的两种或多种颜色之间的渐进过渡组成。它的形状可以是圆形或椭圆形。径向渐变由其中心点、边缘形状轮廓、两个或多个色值结束点定义而成。径向渐变函数绘制了一系列从中心点放射到边缘轮廓（甚至可能超出范围）的同心着色轮廓。边缘形状可以是圆形（circle）或椭圆形（ellipse）色值点位于虚拟渐变射线（Virtual gradient ray）上，该渐变射线从中心点水平向右延伸。基于百分比的色值中间点是相对于边缘轮廓和此渐变射线之间的交点（代表 100％）。每个轮廓都是一种单色，并由其相交的渐变射线上的颜色确定。

![](/front-end/basics/css/26.png)

**圆锥渐变conic-gradient**，是通过指定渐变中心、旋转角度以及颜色断点列表来实现的。颜色断点放置在渐变圆弧（圆的周长）上，两个颜色断点之间颜色平滑过渡。

![](/front-end/basics/css/27.png)

![](/front-end/basics/css/28.png)

**重复线性渐变repeating-linear-gradient**，参数和linear-gradient一致。**重复径向渐变repeating-radial-gradient**，参数同radial-gradient一致。**重复圆锥渐变repeating-conic-gradient**，参数同 conic-gradient一致。重复渐变线或弧的大小，是第一个色标和最后一个色标之间的长度。如果第一个色标只有颜色没有色标长度，那么值默认为 0。如果最后一个色标只有颜色没有色标长度，那么值默认为 100%。如果都没有指定，那么渐变线是 100%，意味着线性和锥形的渐变都不会重复，径向渐变只会在渐变的半径小于中心点和最远角之间的距离时重复。如果第一个色标声明了，其值大于 0，渐变也会重复，因为线或弧的大小就是第一个色标和最后一个色标之间的距离，小于 100% 或 360 度。

## 背景属性

**background**用于一次性集中定义各种背景属性，包括 color, image, origin 与 size, repeat 方式等等。可以应用多个背景（逗号分隔）到元素，但只有最下方也就是最后一个背景可以包含颜色。

**background-color**用于指定背景颜色，值为颜色值或关键字"transparent"，默认值是transparent透明。是非继承属性。

**background-image（CSS3）**用于为一个元素设置一个或者多个背景图像（以逗号隔开），值为url（相对或绝对地址）或渐变函数。在绘制时，图像以 z 方向堆叠的方式进行。先指定的图像会在后指定的图像上面绘制。因此指定的第一个图像“最接近用户”。层级上，元素的border会在background-image之上，background-image在background-color之上。若图像加载失败则等同于设置成none，建议指定 background-color 属性预防图像无法被加载的情况。

**背景图像（background-image）和HTML图像（`<img>`）的区别有：前者不存在语义上的意义，它们不能有任何备选文本，也不能被屏幕阅读器识别**。当图片属于网页的内容时推荐使用`<img>`，当图片仅用于美化页面时，推荐使用background-image。

```css
.multi-background {
  width: 100%;
  height: 400px;
  /* 从左到右的层级依次变小 */
  background-image: url(bg1.png),
    url(bg2.png),
    linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: bottom right, top left, right;
}
```

![](/front-end/basics/css/30.png)

**background-origin（CSS3）**设置background-image显示的区域，当使用 background-attachment 为 fixed 时，该属性将被忽略不起作用。默认值是padding-box。

![](/front-end/basics/css/31.png)

**background-position**用于设置background-image应该位于background-origin所规定区域内的位置，初始值是0% 0%。

![](/front-end/basics/css/32.png)

**background-repeat** 定义背景图像的重复方式。可以沿着水平轴（repeat-x），垂直轴（repeat-y），两个轴重复（repeat），或者根本不重复（no-repeat）。单值语法是双值语法的简写。

![](/front-end/basics/css/33.png)

**background-size（CSS3）**设置背景图片大小。图片可以保有其原有的尺寸，或者拉伸到新的尺寸，或者在保持其原有比例的同时缩放到元素的可用空间的尺寸。

![](/front-end/basics/css/34.png)

**background-attachment**决定背景图像的位置是在视口内固定，或者随着包含它的区块或内容滚动。

![](/front-end/basics/css/35.png)

**background-clip（CSS3）**设置元素的背景（背景图片或颜色）是否延伸到文本、内容盒子、内边距盒子、边框下面。默认值是border-box（是在边框下层）。如果没有设置背景图片（background-image）或背景颜色（background-color），那么这个属性只有在边框（ border）被设置为非固实（即非soild）、透明或半透明时才能看到视觉效果（与 border-style 或 border-image 有关），否则，本属性产生的样式变化会被边框覆盖。

![](/front-end/basics/css/36.png)

**background-blend-mode 属性**定义该元素的背景图片，以及背景色如何混合。 混合模式应该按background-image属性同样的顺序定义。如果混合模式数量与背景图像的数量不相等，它会被截取至相等的数量。
mix-blend-mode属性描述了元素的内容应该与元素的直系父元素的内容和元素的背景如何混合。
**mask属性**允许使用者通过遮罩或者裁切特定区域的图片的方式来隐藏一个元素的部分或者全部可见区域。
**backdrop-filter属性**可以为元素后面区域添加图形效果（如模糊或颜色偏移），与fillter的区别在于不会影响元素本身。因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。可以用来实现磨砂玻璃效果。取值如下：
1. none：没有应用于背景的滤镜。 
2. `<filter-function-list>`：一个以空格分隔的滤镜函数（`<filter-function>`）或是要应用到背景上的 SVG 滤镜。

## 文本属性

**text-align 属性**设置块元素或表格单元格中行内级内容的水平对齐方式。这意味着它的工作方式类似于 vertical-align，但在水平方向上。，该属性是设置在非 display: inline 元素上才有效。

![](/front-end/basics/css/37.png)

**单行文本两端对齐问题？**因为text-align: justify 不会处理块级元素内文本的最后一行，导致不能对单行文本两端对齐，text-align-last（**CSS3**）定义最后一行的对齐方式，取值与text-align相同，因此可以通过定义 text-align-last: justify 来实现单行文本两端对齐。或者使用伪元素派生一行新的占位内容把单行文本变成多行文本，即可直接使用text-align: justify实现两端对齐。

**单行文本居中显示，多行文本自动居左显示？**父元素设置text-align：center，子元素设置为display: inline-block; text-align : left; 即可。如此子元素内文本单行时，子元素在父元素内居中；子元素内文本多行时，文本在子元素内居左。

**vertical-align**指定行内级元素（inline或inline-block或inline-table）或表格单元格（table-cell）元素的垂直对齐方式，即以不同的方式在块的方向上进行对齐。Flex容器内会忽略该属性。

![](/front-end/basics/css/38.png)

**text-decoration** 用于设置文本的修饰线外观的（下划线、上划线、贯穿线/删除线 或 闪烁）。

![](/front-end/basics/css/39.png)

**text-transform** 定义元素的文本如何转换大小写。

![](/front-end/basics/css/40.png)

**text-justify**（CSS3）用于定义使用什么方式实现文本内容两端对齐。由于该属性影响文本布局，所以 text-align 属性必须设置为 justify。

![](/front-end/basics/css/41.png)

**text-indent**定义一个块级元素首行文本内容之前的缩进量。行内级元素要使用该属性必须先定义该元素为块级（block）或行内块级（line-block），hanging 和 each-line 关键词紧随在缩进数值之后。

![](/front-end/basics/css/42.png)

**text-overflow** （CSS3）用于确定如何提示用户存在隐藏的溢出内容。其形式可以是裁剪、显示一个省略号（“…”）或显示一个自定义字符串。该属性并不会强制“溢出”事件的发生，需要设置宽度，overflow，且只对块级元素溢出的内容以及元素内联方向上有效。单值，指的行末溢出行为。双值，第一个值指行左端，第二个值指行右端溢出。

![](/front-end/basics/css/43.png)

**letter-spacing** 用于设置文本字符的间距表现，最后一个字符后也会被添加。取值为`<length>`或normal。

**word-spacing** 用于指定单词之间的额外间隙，最后一个单词不添加。取值为 `<length>` 或 normal 或 `<percentage>`。

**overflow-wrap（CSS3）**用于设置当一个不能被分开的字符串太长而不能填充其包含块时，为防止其溢出，浏览器是否允许这样的单词中断换行。word-wrap 属性原本属于微软的一个私有属性，在 CSS3 现在的文本规范草案中已经被重名为 overflow-wrap。word-wrap只是被当作 overflow-wrap 的“别名”。

![](/front-end/basics/css/44.png)

**word-break（CSS3）**指定怎样在单词内断行。其中值break-word已弃用，**word-break：break-all和overflow-wrap: break-word的区别在于后者会先将整个单词换到下一行进行显示**。

![](/front-end/basics/css/45.png)

**white-space** 用来设置如何处理元素中的空白。

![](/front-end/basics/css/46.png)

![](/front-end/basics/css/47.png)

**text-shadow（CSS3）**可以为文字与 decoration 添加多个阴影，阴影值之间用逗号隔开。每个阴影值由元素在 X 和 Y 方向的偏移量`<offset-x>` 和`<offset-y>`、模糊半径`<blur-radius>`和颜色值`<color>`组成。

**line-height** 用于设置多行元素的空间量，如多行文本的间距。对于块级元素，它指定**元素行盒（line boxes）**的最小高度。对于非替代的行内级元素，它用于计算**行盒（line box）**的高度。主段落内容的 line-height 至少应为 1.5。这将有助于改善低可视条件下的体验，也对认知阻碍者有帮助，如阅读困难者。如果文字的大小要随页面的缩放而变化，请使用无单位的值，以确保行高也会等比例缩放。

![](/front-end/basics/css/48.png)

**color属性**设置颜色值的前景色以及文本装饰，并设置currentcolor值。currentcolor 可以用作其他属性的间接值，并且是其他颜色属性的默认值，例如 border-color。CSS并不是唯一支持颜色的web技术。同时还有其他支持颜色的图形技术（svg，canvas，webgl）。

transparent 关键字表示一个完全透明的颜色，即该颜色看上去将是背景色。从技术上说，它是带有阿尔法通道为最小值的黑色，是 rgba(0,0,0,0) 的简写。

HSL（Hue、Saturation、Lightness），HSL 颜色的色调/色相 (H) 分量的值是从红色到黄色、绿色、青色、蓝色和品红色（在 360° 处再次回到红色）的角度，它标识了基色是什么。该值可以用CSS 支持的`<angle>`任何单位指定，包括度 ( deg)、弧度 ( rad)、弧度 ( grad) 或转数 ( turn)，当省略色调的单位时，它假定为度数 ( deg)。但这并不能控制颜色的鲜艳程度或暗淡程度，或颜色的亮暗程度。颜色的饱和度 (S) 分量指定最终颜色中包含指定色调的百分比，100% 饱和度是完全饱和，而 0% 是完全不饱和（灰色）。其余部分由亮度 (L) 分量提供的灰度级定义，100% 的亮度是白色，0% 的亮度是黑色，50% 的亮度是“正常”。

![](/front-end/basics/css/49.png)

**-webkit-text-stroke 属性**指定了文本字符的笔触宽度`<length>`（初始值为0）和笔触颜色`<color>`（初始值为当前color的颜色），取值为`<length>` `<color>`。可用于文字描边。此属性为全称属性 -webkit-text-stroke-width 和 -webkit-text-stroke-color 的简写属性。

**text-combine-upright属性**将字符组合设置到单个字符的空间中。如果组合文本的宽度超过 1em，则用户代理必须将内容调整到 1em 以内。生成的组合被视为用于布局和装饰的单个直立字形。初始值是none即不做特殊处理，值all表示尝试水平排版盒子中的所有连续字符，以便它们占据盒子垂直线内单个字符的空间。该属性仅在垂直书写模式下有效，是用来产生横向文字的效果，即使得所有文字都是直立的。

**​-webkit-line-clamp 属性**可以把块容器中的内容限制为指定的行数。它只有在 display 属性设置成 -webkit-box 或者 -webkit-inline-box 并且 box-orient 属性设置成 vertical时才有效果。在大部分情况下，也需要设置​ overflow 属性为 hidden，否则，里面的内容不会被裁减，并且在内容显示为指定行数后还会显示省略号。 ​

**​-webkit-box-orient 属性**用来设置一个元素是水平还是垂直布局其子元素。

### 单行文本内容溢出省略

```css
.text-ellipsis {
  white-space: nowrap; /* 文本不换行 */
  overflow: hidden; /* 溢出部分隐藏 */
  text-overflow: ellipsis; /* 超出的文本在区域内显示为省略号 */
}
```

### 多行文本内容溢出省略

```css
.multi-line-text-ellipsis {
  display: -webkit-box; /* 作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置伸缩盒子的子元素排列方式：从上到下垂直排列 */
  -moz-box-orient: vertical;
  -ms-box-orient: vertical;
  -webkit-line-clamp: 2; /* 显示的行数 */
  overflow: hidden; /* 溢出部分隐藏 */
  text-overflow: ellipsis; /* 超出的文本在区域内显示为省略号 */
}
```

**优点**：响应式截断，根据不同宽度做出调整；文本超出范围才显示省略号，否则不显示省略号；浏览器原生实现，所以省略号位置显示刚好

**缺点**： -webkit-line-clamp 是不规范的属性，没有出现在 CSS 规范草案中，也就是说只有 webkit 内核的浏览器才支持这个属性。

开源方案：[clamp.js](https://github.com/josephschmitt/Clamp.js) / [jQuery.dotdotdot](https://github.com/FrDH/dotdotdot-js)。

## 字体属性

**font属性**是 font-style, font-variant, font-weight, font-size, line-height 和 font-family 属性的简写，还可以用于设置元素的字体为系统字体。

![](/front-end/basics/css/52.png)

**font-family 属性**指定一个有先后顺序的、逗号隔开，由字体名或者字体族名组成的列表来为选定的元素设置字体。浏览器会选择列表中第一个该计算机上有安装的字体，或者是通过 @font-face 指定的可以直接下载的字体。应当至少在使用的 font-family 列表中添加一个通用的字体族名`<generic-name>`作为降级处理，因为既不能保证用户计算机内已经安装了指定的字体，也不能保证使用 @font-face 提供的字体能够正确地下载。对字体的选择是逐字进行的。也就是说即使某个字符周围都在某个字体中可以显示，但该字符在当前的字体文件中没有适合的图形，那么会继续尝试列表中靠后的字体。

![](/front-end/basics/css/53.png)

**font-size属性**指定字体大小，以两种方式之一指定：
1. 作为一个从绝对大小absolute-size 关键字列表（xx-small, x-small, small, medium, large, x-large, xx-large）或相对大小relative-size 关键字列表（larger, smaller，分别指的是比父元素的字体大或小）中选择的单个关键字。
2. 作为一个 `<length-percentage>[px, rem, em]` 值。

px 像素（Pixel），是相对于显示器屏幕分辨率而言的相对长度单位。对于只需要适配少部分手机设备，且分辨率对页面影响不大的，使用px即可；

em 是相对长度单位。**在 font-size 中使用是相对于父元素的font-size，在其他属性中使用是相对于自身的font-size，如 width**。如在网页中任何地方都没有设置文字大小的话，那它将等于浏览器默认文字大小，通常是16px。em的值并不是固定的，会继承父级元素的字体大小；font-size属性的 em 和 ex 单位值是相对于父元素的字体大小（不像其他属性，它们指的是相对当前元素的字体大小），这意味对于font-size属性来说，em 单位和百分比单位的作用是一样的。**一个流行的技巧是设置 body 元素的字体大小为 62.5% (即默认大小 16px 的 62.5%)，等于 10px。现在你可以通过计算基准大小10px 的倍数，在任何元素上方便的使用 em 单位。这样有 6px即 0.6em = 6px / 10px, 12px 即1.2em = 12px / 10px（em = 希望得到的像素大小 / 父元素字体像素大小）**。

rem（root em）为元素设定字体大小时，是只相对于HTML根元素，因此设置好根元素的font-size，那么其他元素上的 1rem = 根元素的font-size。对于不支持的浏览器可以多写一个绝对单位px的声明做降级处理。rem 适合适配各种移动设备。

**font-weight属性**指定了字体的粗细程度。一些字体只提供 normal 和 bold 两种值，因此，若指定粗细值为 100-500 时，实际渲染时将使用 normal，指定粗细值为 600-900 时，实际渲染时将使用 bold 。

![](/front-end/basics/css/54.png)

**font-variant 属性**用于定义元素的文本是否为小型的大写字母。normal——正常的字体；small-caps——小型的大写字母。 

**font-style属性**允许选择 font-family 字体下元素的文本是否为斜体。normal 样式指定文本字体样式为正常的字体，italic 样式一般是指书写体，相比无样式的字体，通常会占用较少的高度，而 oblique 字形一般只是常规字形的倾斜版本。如果当前字体没有italic（或oblique，会选用倾斜体oblique（italic ）替代。

**font-stretch 属性**用于定义元素的文字是否横向拉伸变形。

![](/front-end/basics/css/55.png)

**@font-face**（CSS3）用于指定在线字体，消除对用户电脑字体的依赖。

![](/front-end/basics/css/56.png)

如果提供了 local() 函数，从用户本地查找指定的字体名称，并且找到了一个匹配项，本地字体就会被使用。否则，字体就会使用 url() 函数（顺序依次进行加载，若失败再加载后面的）下载的资源（存在跨域限制）。**@font-face 不仅可以放在在 CSS 的最顶层，也可以放在@规则的条件规则组（包括@media、@support、@ducument）中，但不能放在CSS选择器内**。

字体预加载，以便更快的加载字体：
```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

关于字体是否下载，IE8 只要定义了 font-face，就会去下载字体，不论实际有没有应用该字体。Firefox, IE 9+ 只有定义了 font-face 并且页面有元素应用了该字体，就会去下载，不论该元素是否有文本内容。Chrome, Safari 只有定义了 font-face 并且页面有元素应用了该字体，并且该元素有文本内容，才会去下载字体：

```JavaScript
/**
 * 动态插入 DOM 时的不同浏览器的字体下载时机
 */
const el = document.createElement('div'); 
el.style.fontFamily = 'open_sansregular';
// 到这里，IE8 就会开始下载字体
document.body.appendChild(el);
// 而到这里，FireFox 和 IE9+ 才会开始下载字体
el.innerHTML = 'This is content.';
// 只有到这里，Chrome, Safari 才会开始下载字体
```

## transform变换属性（CSS3）

**transform属性**允许对元素进行2D和3D空间的线性仿射变形（affine linear transformations）：旋转，缩放，倾斜或平移。这是通过修改 **CSS 视觉格式化模型**的坐标空间来实现的，因此只能转换由盒模型定位的元素。根据经验，如果元素具有display: block或者inline-block，则由盒模型定位元素。

![](/front-end/basics/css/58.png)

![](/front-end/basics/css/59.png)

**transform-origin（CSS3） 属性**定义指定原点的位置。默认值为元素的中心（center）。

**backface-visibility（CSS3）** 指定当元素背面朝向观察者时是否可见。visible 指定元素背面（指元素内表面）可见，允许显示正面的镜像，hidden指定元素背面不可见。

![](/front-end/basics/css/60.png)

transform 可以用来尝试处理移动端1px的问题（画0.5px的线）：

```css
/* 绝对定位伪元素 + transform */
.after-scale {
  position: relative;
}
.after-scale::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-bottom: 1px solid #E7E7E7;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}

```

## @media媒体查询（CSS3）

媒体查询允许基于设备的不同特性来应用不同的样式申明。媒体查询可以有以下的表现和使用形式：
1. 通过 @media 和 @import 有条件的使用 CSS 样式，如：
    ```CSS
    /* @import 规则用于指定导入的外表样式表及目标媒体 */
    @import "out-style.css" screen, projection;
    ```
    1. @import 语句末尾的分号是必需的；
    2. @import 规则一定先于除了 @charset的其他任何规则，且使用 @import 无法引入超过 35 条的样式表。
2. 用media= 属性为`<style>, <link>, <source>`和其他HTML元素指定特定的媒体类型。如：
```html
<link rel="stylesheet" src="styles.css" media="screen" />
<link rel="stylesheet" src="styles.css" media="print" />
```
3. 在JavaScript中使用Window.matchMedia() 和MediaQueryList.addListener() 方法来测试和监控媒体状态。

![](/front-end/basics/css/63.png)


使用@media规则指定一个媒体查询和一个 CSS 块，当且仅当该媒体查询与正在使用其内容的设备匹配时，该 CSS 块才能应用于该文档。@media可以放在在 CSS 的最顶层，也可以放在@规则的条件规则组中。

每条**媒体查询语句**都由一个**可选的媒体类型**和**任意数量的媒体特性表达式**构成。可以使用多种逻辑操作符（not、and、only和逗号“，”，其中逗号相当于or；**not 只能用于一整条媒体查询语句而不能用于媒体特性表达式即not关键字只能放在单条最前面**：not(hover)、@media not all and (monochrome)）**合并**多条媒体查询语句。当不使用only时，旧版本的浏览器会将screen and (max-width: 500px)简单地解释为screen，这对于防止较早的浏览器应用所选样式很有用。**媒体查询语句不区分大小写**。CSS2中只包括媒体类型，而且CSS3废弃了一些媒体类型（tty, tv, projection, handheld, braille, embossed, 以及 aural）。

**媒体类型与媒体特性嵌套**:

![](/front-end/basics/css/64.png)



当**媒体类型**（可选且默认为all，使用not 或 only 逻辑操作符则必须指定）与在其上显示文档的**设备匹配并且所有媒体功能表达式都计算为 true** 时，媒体查询将计算为 true，CSS内容才适用。涉及未知媒体类型的查询始终为 false。即使媒体查询返回 false，带有媒体查询附加到其`<link>`标记的样式表仍将下载。**媒体类型有**：
1. all：用于所有设备；
2. print：用于在打印预览模式下在屏幕上查看分页材料和文档；
3. screen：用于屏幕；
4. speech：用于语音合成器。

**媒体特性（Media features）描述了 user agent、输出设备，或是浏览环境的具体特征是否存在、值为多少。媒体特性表达式是完全可选的，但都必须置于括号中**。在测试接受范围的任何特性时允许更简洁的媒体查询（比如 400px <= width <= 700px、height > 600px），或者利用支持添加 max- 和 min- 前缀的媒体特性来进行范围检测：

![](/front-end/basics/css/65.png)

为了最好地调整网站文本大小，当使用长度值`<length>[em,rem,px]`进行媒体查询时，单位建议使用rem。

![](/front-end/basics/css/66.png)

![](/front-end/basics/css/67.png)

由于媒体查询可以洞察用户正在使用的设备的功能（以及扩展的功能和设计），因此有可能滥用它们来构造“指纹”来识别设备，或者至少 将其分类为某些细节，这可能是用户不希望看到的。因此，浏览器可能会选择以某种方式捏造返回的值，以防止它们被用来精确地标识计算机。浏览器可能还会在此区域提供其他措施。例如，如果启用了 Firefox 的“抵抗指纹”设置，则许多媒体查询会报告默认值，而不是代表实际设备状态的值。

![](/front-end/basics/css/68.png)

**利用媒体查询实现自适应**：

![](/front-end/basics/css/69.png)

**background-image用 image-set() 设置响应式的背景图片**：

![](/front-end/basics/css/70.png)

**`<img>`标签用 srcset 和 sizes 实现更好的图片自适应**：
1. 带x的由浏览器只是计算出正在显示的显示器的分辨率，然后提供srcset引用的最适合的图像
2. 带w的由浏览器根据媒体查询为真的size，然后提供srcset引用中最相近的图像。

![](/front-end/basics/css/71.png)

**Bootstrap中使用媒体查询**：

![](/front-end/basics/css/72.png)

**媒体查询可以用来尝试处理移动端1px的问题（画0.5px的线）**：

![](/front-end/basics/css/73.png)

**any-hover媒体特性**可以用来测试是否有任意可用的输入机制可以在元素上 hover。取值有：
1.none：可用的输入机制里没有机制可以方便地 hover，或者不存在定点输入机制；
2.hover：一个或多个可用的输入机制可以方便地在元素上 hover。

## 多列属性（CSS3）

**多列布局**（通常称为 multicol）用于将内容布置到一组列框中，就像报纸中的列一样。通过给元素添加且必须添加column-count 或 column-width之一变成多列容器，或简称为 multicol 容器，容器内的列都是匿名的盒子，称为列盒子。多列容器会创建新的块格式上下文（BFC），因此子元素的margin不会与多列容器的margin互相重叠。

![](/front-end/basics/css/74.png)

**如何处理溢出的列取决于是片段化的媒体上下文（比如打印）还是在连续的媒体上下文（比如 web 页面）中**。前者中一旦碎片（例如页面）中充满了列，多出的列将移至新页面。后者中列将沿横向溢出，意味着水平滚动条的出现。

**columns 属性**用来设置元素的列宽和列数，是column-count 和 column-width的简写属性。

**column-count 属性**设置元素的列数。auto——表示列的数量由其他 CSS 属性指定，比如column-width。`<number>`——严格正`<integer>`元素内容被划分的理想列数，若column-width也被设置为非零值，此参数仅表示所允许的最大列数。

**column-width属性**设置多列布局中的理想列宽，容器将具有尽可能多的列，而其中任何列的宽度都不会小于该值，除非容器宽小于该值。auto——列的宽度由其他 CSS 属性决定，比如column-count；`<length>`——列宽值，不能是百分比和负数。如果想要一个图像尺寸缩小到适合列框而不是溢出当前列盒子，标准的响应式的解决方案是设置最大宽度：100%。

**column-gap 属性**设置元素列之间的间隔大小。目前该属性已不是多列容器中的特有属性，在该属性已经可以在Flexible Box（弹性盒子）以及 Grid layouts（网格布局）中也可使用。normal——默认值，多列容器中为 1em，其他类型布局盒子中为0；`<length>`或`<percentage>`——必须是非负数。

**column-rule属性**设置列与列之间的分割线（也称为规则）的宽度、样式和颜色，是column-rule-width（宽度，值为thin，medium, 或thick三个关键字或`<length>`，类似border-width）、column-rule-style（样式，类似border-style）、column-rule-color（颜色，`<color>`）的简写属性。

**column-fill属性**控制元素的内容在分成列时如何平衡。balance——默认值，内容在列之间平均分配。auto——按顺序填充列。内容只占用它需要的空间，可能导致某些列保持空白。balance-all——内容在列之间平均分配。

**column-span属性**设置为all（默认为none即不跨越多个列）时，可以让一个元素跨越多列容器的所有的列，该元素（称为spanning element）建立了一个新的块格式上下文，因此，在该元素对多列容器进行中断，该元素之后再重新启动多列。

**break-inside 属性**描述了在多列布局页面下的内容盒子如何中断，如果多列布局没有内容盒子，这个属性会被忽略，设置 `break-*`属性的同时增加一个旧属性 **`page-break-*`**能够获得更好的浏览器支持。默认值是auto——既不强制也不禁止。每一个断点由前一个元素的 break-after 值、后一个元素的 break-before 值以及当前元素自身的 break-inside 值定义：		
1. 若有一个设置的是强制中断值（ always, left, right, page, column, region），则该	属性值具有优先权。如果存在多个属性是强制中断值，则使用流中最新出现的元素的值，	即break-before 优先于 break-after，而本身break-after优先于break-inside。
2. 若任何一个设置的是禁止中断值（avoid,avoid-page,avoid-region,avoid-column），则禁止该类型的中断。

**widows属性**设置在一个片段打断后，新的片段顶部需要结合在一起的最小行数。该值必须为正值。

**orphans属性**设置在片段中断之前，可以单独停留在片段底部的最小行数。该值必须为正。

![](/front-end/basics/css/75.png)

## flex弹性盒子布局（CSS3）

弹性盒子（Flexbox）（即CSS弹性盒子布局模型）是一种用于在单个维度（行或列）中显示项目的布局模型，关键特性是 flex 布局中的项目可以增大以填满未使用的空间和缩小以避免从父元素溢出，也可以将空间分配到项目本身、项目之间或项目周围，还支持在主轴或交叉轴上对齐项目，从而对一组项目的大小和对齐方式提供高级别的控制，通过嵌套这些盒子（水平盒子在垂直盒子内，或垂直盒子在水平盒子内）就可以实现在两个维度上构建布局。弹性盒子的真正价值可以体现在它的灵活性/响应性，无论是调整浏览器窗口的大小或增加元素。

Flex项（Flex Item）是Flex 容器（块级元素设置display: flex或行内级元素设置 display: inline-flex）的一级子元素。弹性容器内的连续文本，也将成为Flex项。

![](/front-end/basics/css/76.png)

当元素表现为Flex 项时，它们沿着两个轴来布局：
1. 主轴（main axis）是沿着 flex 项放置的方向延伸的轴。该轴的开始和结束被称为 main start 和 main end。 
2. 交叉轴（cross axis）是垂直于 flex 项放置方向的轴。该轴的开始和结束被称为 cross start 和 cross end。

**flex容器属性**：

**flex-direction属性**指定主轴的方向。显然，flex-direction不会更改绘制顺序。

![](/front-end/basics/css/77.png)

**flex-wrap属性**指定 flex 项单行或多行显示，允许在换行条件下控制行的堆叠方向。

![](/front-end/basics/css/78.png)

**flex-flow属性**是 flex-direction 和 flex-wrap 的简写（不区分两个属性的顺序）。

**justify-content 属性**指定浏览器如何沿着 flex 容器的主轴（网格容器的行内轴）在flex项（grid项）之间和周围分配空间。在弹性盒子和网格容器中normal表现和stretch一样，但弹性盒子（flexbox）不支持设置为stretch。Flex容器中，初始值是flex-start。flex容器中所有的对齐方法，属性值 flex-start 和 flex-end 都会受到文本书写方向影响。

![](/front-end/basics/css/79.png)

**align-items 属性**将所有flex项的align-self设置为相同值。在 Flex容器，它控制Cross Axis上flex项的对齐方式。在grid容器中，它控制块轴上grid项在其网格区域内的对齐方式。如果flex容器不设置高度，则最高的元素定义了容器的高度（多行则是行高度）。初始值是stretch。

![](/front-end/basics/css/80.png)

**align-content属性**设置浏览器如何沿着flex容器的交叉轴（或grid容器的主轴）在内容项之间和周围分配空间，对单行弹性盒子模型无效（即flex-wrap：nowrap）。取值上以及表现上和justify-content相同。

**flex项属性**：

**flex属性**是flex-grow、flex-shrink、flex-basis的简写属性，用于设置flex项如何增大或缩小以适应其flex容器中可用的空间。如果空间加到flex项上，则应该使用margin或justify-content来处理多余空间。初始值是flex-grow: 0；flex-shrink: 1；flex-basis: auto。建议使用简写属性，以确保都被设置，除非真的需要单独修改覆盖之前设置的。

![](/front-end/basics/css/81.png)

**flex-grow属性**设置 flex 项主尺寸（main size）的增长系数，即分配剩余空间的相对比例。取值为 `<number>`，初始值为0，负值无效。剩余空间是 flex 容器的大小减去所有 flex 项（不包括flex-basis为0的flex项）的大小加起来的大小。如果所有的兄弟项目都有相同的 flex-grow 系数，那么所有的项目将剩余空间按相同比例分配，否则将根据不同的 flex-grow 定义的比例进行分配。

**flex-shrink属性**指定flex 项在初始主尺寸（main size）之和（不包括flex-basis为0的flex项）大于容器时的收缩大小。取值为`<number>`，初始值为1，不允许负值，在flex属性中省略则默认为1。min-主轴方向尺寸优先级大于flex-shrink收缩后的尺寸，如果没设置，元素默认不会缩短至小于最小内容尺寸（width/height: min-content）尺寸。

**flex-basis属性**指定flex项的初始主尺寸（main size），标准盒模型是内容盒（content-box）的尺寸，替代盒模型是边框盒（border-box）的尺寸。初始值为auto，非auto的flex-basis值相比width/height优先，否则即auto的flex-basis值参考width/height的值且如果没有设定width/height（即auto），则采用元素内容（width/height：max-content）的尺寸。flex-basis值为0，则该flex项的尺寸所用空间也可以被用来分配。均分布局需要给所有的flex项的flex-basis属性设置为0。

![](/front-end/basics/css/82.png)

**align-self 属性**覆盖flex容器或grid容器设置的align-items值。在grid容器中在网格区域内对齐gird项，在Flex容器中设置该flex项在交叉轴如何对齐，不适用非gird项或flex项（比如table-cell和块级盒子）。如果flex项的交叉轴方向的 margin 值设置为 auto，则会忽略 align-self。

![](/front-end/basics/css/83.png)

**order属性**规定了flex容器中的flex项在布局时的顺序。元素按照 order 属性的值的增序进行布局绘制，默认值为 0。拥有相同 order 属性值的元素按照它们在源代码中出现的顺序进行布局。order 仅仅对元素的视觉顺序产生作用，并不会影响元素的逻辑或标签顺序。 order 适用于flex 项、grid项，不可以用于非视觉媒体（比如speech）。

Flex容器创建Flex格式上下文，内部浮动失效，排除外部浮动，不存在外边距折叠。浏览器兼容方面，IE 10需要使用 -ms- 前缀，webkit内核比如UC 浏览器需要使用 -webkit- 前缀。

**Flexbox应用梳理**：

![](/front-end/basics/css/84.png)

![](/front-end/basics/css/85.png)

##  grid网格布局（CSS3）

CSS 网格是由一系列水平及垂直的线（行与列）构成的二维的布局模式，可以将网格元素（grid项）放置在这些行和列定位的位置上，CSS 网格可用于布局页面主要的区域或小型组件。

![](/front-end/basics/css/86.png)

grid 容器（块级元素设置display: grid或行内级元素设置 display: inline-grid）会创建一个grid格式上下文，它的直接子元素是gird项（grid item）。网格列（grid column）/网格行（grid row）是grid容器中的垂直/水平轨道（水平书写模式下），即两个垂直/水平网格线之间的空间。一个网格通常具有许多的列与行，以及行与行、列与列之间的间隙即沟槽（gutter）。单独声明display: grid默认只是创建了一个单列网格。

![](/front-end/basics/css/87.png)

**grid-template-columns/grid-template-rows属性**是基于网格列/行的维度定义网格线的名称和网格轨道的尺寸大小。通过 grid-template-columns/grid-template-rows属性定义出来的是显式网格。可以给同一网格线定义多个名称，方法就是在中括号内用空格将多个名称分开。每一个网格线名都可以被引用，以用来定位grid项。在选择名字时，如果把一个区域周围的线都用 -start 和 -end 作为后缀，那么就会创建一个以前缀作为名字的区域，后面就可以使用grid-area直接指定grid项的位置。单位 fr 和其它长度单位混合使用时，fr 的计算基于其它单位分配后的剩余空间。repeat(12, [col-start] 1fr)可以得到有相同名字的多条线，由于网格线名字相同，指定时应该为 col-start / col-start m。repeat函数的第一个参数还可以是auto-fill和auto-fit，前者表示如果网格容器在相关的轴上有一个确定的或最大的尺寸，那么轨道列表的重复次数就是最大可能的正整数，不会导致轨道列表溢出其网格容器，后者表现一样，不同在于任何空的重复轨道（包括两侧的沟槽）都会被折叠起来，推荐使用auto-fit。

![](/front-end/basics/css/88.png)

**grid-auto-rows/grid-auto-columns 属性**用于指定**没有使用**grid-template-rows/ grid-template-columns明确规定大小的隐式创建的行/列轨道（**显式定位到超出范围的行/列或由自动放置算法额外创建的行/列**）的尺寸大小，默认只是auto，即这些轨道将自动定义尺寸，所以会根据它里面的内容改变尺寸。简写属性时grid-auto-flow

![](/front-end/basics/css/89.png)

无论是grid-auto-rows/grid-auto-columns 或grid-template-columns/grid-template-rows，只有在取值为auto时可配合align-content 和justify-content 属性使用。

**grid-template-areas属性**指定命名的网格区域（网格中由一个或者多个网格单元格（网格中的最小单元。它是四条网格线之间的空间，概念上非常像表格单元格）组成的一个矩形区域）。被命名的网格区域也会隐式的创建”名字- -start ”和”名字 -end”的网格线。

![](/front-end/basics/css/90.png)

**grid-area属性**是grid-row-start、grid-column-start、grid-row-end 和 grid-column-end的简写，通过网格线序号，span跨度或auto或对应grid-template-areas中的网格区域来指定grid项在网格中的位置和大小，开始与结束的网格线序号之间或网格线与跨度之间要使用/符号分开，可以用负数倒数定位网格线。设置顺序是grid-row-start / grid-column-start / grid-row-end / grid-column-end。**grid-row属性**则是grid-row-start、grid-row-end属性的简写。grid-column属性则是grid-column-start、grid-column-end的简写，这些属性的语法类似。如果只指定开始而没有指定**结束或span跨度**，默认延伸一个轨道。在从左到右的文本水平书写方向中，序号为1的第一条列/行网格线在网格的最左/上面。网格线也会在隐式网格中被创建，但无法通过网格线序号定位到。网格线可以在轨道大小信息之前或之后的方括号中进行命名。

![](/front-end/basics/css/91.png)

IE11 不支持网格单元的自动布置。除非显式地注释 -ms-grid-column 和 -ms-grid-row，否则所有单元都会在网格的第一行/列结束，可以使用提供自动注释的工具：**![css_grid_annotator](https://github.com/motine/css_grid_annotator)**。

**gap 属性**是用来设置网格行与列之间的间隙（gutters），该属性是 row-gap 和 column-gap 的简写形式。<'column-gap'> 是可选的，假如 <'column-gap'> 缺失的话，则会被设置成跟 <'row-gap'> 一样的的值。其他布局中row-gap和column-gap初始值normal的间隔为0，多列布局中column-gap默认值normal的默认间隔为 1em。间隙距离可以用任何长度单位包括百分比来表示，但不能使用fr单位。间距所使用的空间会在使用弹性长度fr的轨道的空间计算前就被留出来。gap属性曾经有一个grid-前缀，可加可不加。

多个网格项目可以占用同一个网格单位，其覆盖顺序默认遵循文档流的原始顺序（后来居上），也可以发生重叠时使用 z-index 属性控制重叠的顺序。

**grid-auto-flow属性**控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。当有一些字符串或文本被包含在网格容器中，但却没有被其他元素包装，它们就会被创建为匿名grid项，由于不能被选定则只能由自动布局算法处理。

![](/front-end/basics/css/92.png)

网格布局方式下共有两条轴线用于对齐——块轴和行轴。块方的轴是采用块布局时块的排列方向。行轴与块方向的轴垂直，它的方向和常规行内流中的文本方向一致。属性 align-self 和 align-items 用于控制在块轴上对齐**元素**，justify-items 和 justify-self 用于控制在行轴上对齐元素。由于默认对齐方式是 stretch，会拉伸覆盖网格区域，除非元素具有固定宽高比对齐行为表现为start（块轴起点），其他取值则会按照内容自动大小。

而针对网格轨道整体占据的空间小于网格容器情况下，分别使用 align-content 在块轴上**对齐网格轨道**，使用 justify-content 在行轴上对齐网格轨道，网格布局中默认的行为是对齐到块/行轴起点（start），行轴起点（start）和终点（end）会受到书写方向direction的影响，块轴和行轴受到书写模式属性writing-mode的影响。**place-content 属性**则是对 align-content 和 justify-content 的简写。而对于与分配空间有关的值会使网格元素变大。

在网格区域内若grid项未设置或者宽高小于网格区域，则可以使用auto的margin在网格区域内对齐元素。

上述对齐属性的具体值说明参考flex弹性盒子布局，大体上类似。

**浏览器支持情况**：

![](/front-end/basics/css/93.png)

只需要按行或者列控制布局就用弹性盒子（Flexbox），需要同时按行和列控制布局就用网格（Grid）。弹性盒子从内容出发。网格则从布局入手，先创建网格，然后再把元素放入网格中，或者根据自动放置规则把元素按照网格排列。

grid布局应用：

![](/front-end/basics/css/94.png)

![](/front-end/basics/css/95.png)

![](/front-end/basics/css/96.png)

## 隐藏元素、内容

屏幕阅读器：一种可以将电脑、手机屏幕上的内容通过文本转语音（TTS）朗读出的软件，该类软件的受众人群主要是视力障碍人群。
判断指标：

![](/front-end/basics/css/97.png)

1. **display:none**

完全隐藏元素，元素会从渲染树、无障碍树中移除，仅存在于DOM树上，导致该元素和其所有后代元素无法被屏幕阅读器访问，隐藏过程不支持动画，会触发页面的重排和重绘，性能较差。隐藏后不会渲染也不影响布局，无法触发绑定的事件（比如点击）。如果作用的是img标签，由于解析到标签的时候，样式还没应用，所以图像会下载，相反使用background设置的图像，图像不会下载，同样是因为样式没应用。

2. **position：absolute; left: -9999px;**

absolute绝对定位，使用top、bottom、left、right 将元素移除屏幕来隐藏。隐藏过程会触发重排和重绘制，支持动画。隐藏后脱离文档正常流渲染不影响布局，无法被点击，屏幕阅读器可访问。

3. **visibility: hidden;**

视觉上隐藏元素而不更改文档的布局，隐藏过程支持动画，会触发重绘。隐藏后无法触发事件，无法被屏幕阅读器访问。

4. **opacity: 0和filter: opacity(0)和rgba(255,255,255,0)**

设置透明度为0来隐藏元素，不更改文档的布局，隐藏过程支持动画，会触发重绘。隐藏后可以触发事件和被屏幕阅读器访问。

5. **z-index: -9999px;**

对已经定位的元素（position不是static）设置负层级来隐藏，隐藏过程支持动画，会触发重排和重绘，隐藏后无法触发事件，可以被屏幕阅读器访问。

6. **transform: scale(0, 0);**

对元素进行缩放到0进行隐藏，隐藏过程支持动画，会触发重排和重绘，隐藏后无法触发事件，可以被屏幕阅读器访问。

7. **clip-path：circle(0)**

裁剪出元素可见区域，隐藏过程支持动画，触发重绘，隐藏后占据空间，无法触发事件，可以被屏幕阅读器访问。

## 继承与层叠

### 继承

继承决定了当没有为元素的属性指定值时该如何计算值。当元素的一个继承属性没有指定值时，则取父元素的同属性的计算值（根元素没有父元素，取初始值initial）；当元素的一个非继承属性没有指定值时，则取属性的初始值initial。通常情况下，可以通过常识来判断哪些属性属于默认支持继承的，比如可继承属性有font-size, font-family, color，不可继承属性有border, padding, margin, width, height。

控制继承的相关属性值：

![](/front-end/basics/css/98.png)

### 层叠

**层叠**是CSS的基本特征，定义了如何合并来自多个源的属性值的算法。只有 CSS 声明，就是属性名值对，会参与层叠计算。包含在大多数@规则的 CSS 声明是参与层叠计算的，比如包含于@media、@documents或者@supports的 CSS 声明，但是包含于@keyframes/@font-face/@import / @charset 的声明不参与计算。
关键帧不参与层叠，意味着在任何时候 CSS 都是取单一的 @keyframes 的值而不会是某几个 @keyframe 的混合；用@keyframes @规则定义的值会覆盖全部普通值，但会被 !important 的值覆盖。

**CSS声明的来源**包括：
1. 用户代理样式即浏览器给任何网页设置的默认样式。
2. 页面作者样式即网页开发人员设置的样式。
3. 用户自定义样式即网页浏览者自定义的样式。

**对将要应用在相同元素上的CSS声明，首先**根据**重要性**进行排序：用户代理中的!important 值 > 用户自定义的!important 值 > 页面作者的!important 值 > 页面作者样式普通值 > 用户自定义样式普通值 > 用户代理样式普通值。

**然后重要性相同时根据优先级排序**。首先**内联样式**比页面作者定义的样式的优先级都要高，不受级联层规则的影响。

**级联层（@layer）规则**：在所有层之外声明的CSS会被认为处于一个最后声明的未命名的层中，后面的层中的普通值比先前定义的层的优先级高，先前定义的层中的 !important 值比后面的层的优先级要高。

**最后**优先级相同时后面声明属性值覆盖前面的。

**选择器列表**：

![](/front-end/basics/css/99.png)

1. **选择器表达式从右至左解析，最右为关键选择器**，持续左移直到和规则匹配或当不匹配而放弃该规则：

![](/front-end/basics/css/100.png)

因为，从右向左匹配一开始就在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点）；而从左向右的匹配规则的性能都浪费在了失败的查找上面。的确，如果叶子节点存在过多的不符合的span标签时，就需要考虑CSS选择器的优化了。

2. **避免**使用通配符选择器、避免使用子选择器、避免使用多层元素选择器、避免使用元素选择器限制 class 选择器、避免使用元素或 class 选择器限制 id 选择器；**可继承属性使用继承**。

**优先级计算比较规则**：

![](/front-end/basics/css/101.png)

**!important相关**：

![](/front-end/basics/css/102.png)

## 伪类与伪元素

**伪类（:pseudo-class）**是添加到选择器的开头为冒号关键字，用于指定所选元素的特殊状态（比如鼠标悬停、链接状态、表单状态、第几个元素等）。

![](/front-end/basics/css/103.png)

为了可以正确地渲染链接元素的样式，:link，:hover，:active，:visited这四个伪类选择器需要遵循 LVHA 的先后顺序。而:focus伪类选择器常伴随在:hover伪类选择器左右，需要根据想要实现的效果确定它们的顺序。

**伪元素（::pseudo-element）**是附加至选择器末的开头为双冒号的关键字，允许对被选择元素的特定部分应用样式。一条选择器语句之后只能使用一个伪元素，伪元素选择器不能匹配任何真实存在的 html 元素。早期的伪元素曾使用单冒号的语法，现代的浏览器为了保持向后兼容，也支持早期的带有单双冒号语法的伪元素。::before、::after、::marker伪元素与content属性的共同使用，在 CSS 中被叫做“生成内容”。

![](/front-end/basics/css/104.png)

## 滚动条

可以使用以下伪元素选择器去修改基于 webkit 的浏览器的滚动条样式（即firefox不支持）：

![](/front-end/basics/css/105.png)

## 交互

touch-action 属性用于设置触摸屏用户如何操纵元素的区域（例如，浏览器内置的缩放功能）。

![](/front-end/basics/css/106.png)

### CSS动画

### 贝塞尔曲线
贝塞尔曲线由控制点定义（2个，3个，甚至更多）
特点：
1. 控制点不总在曲线上  
2. 曲线的阶次 = 控制点的数量 - 1 
3. 曲线总在控制点的**凸包**内部

![](/front-end/basics/css/107.png)

由控制点表示的曲线方程式（其中t 属于 [0, 1]）：

1. 两个点的曲线方程：P = (1-t)P1 + tP2
2. 三个点的曲线方程：P = (1−t)^2 * P1 + 2(1−t)tP2 + t^2 * P3
3. 四个点的曲线方程：P = (1−t)^3 * P1 + 3(1−t)^2 * t * P2 +3(1−t)t^2 * P3 + t^3 * P4

例如3个点的曲线：

x = (1−t)^2 * x1 + 2(1−t)tx2 + t^2 * x3

y = (1−t)^2 * y1 + 2(1−t)ty2 + t^2 * y3

绘制贝塞尔曲线方法：

![](/front-end/basics/css/108.png)

1. 控制点通过线段连接得到 n - 1 条线段：1 → 2、2 → 3 和 3 → 4，
2. 对于[0, 1] 的每个t，在第一步的线段分别距起点距离比例为 t 的位置取点，连接比例点，得到n - 2条线段
3. 第二步得到的线段上同样按比例 t 取点，得到 n - 3 条线段
4. 不断重复，直到只得到一个点，该点即位于曲线上。

### 动画最小时间间隔

多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60*1000ms ＝ 16.7ms

### transition（过渡，CSS3）

只需要为某个属性定义如何动态地表现其不同状态切换（比如伪元素:hover，:active和JavaScript实现的状态变化）的变化（过渡动画由浏览器生成），而不必使用Flash或JavaScript。可以为一个或多个 CSS 属性指定过渡效果，多个属性的过渡动画用逗号分隔：transition: font-size 3s, color 2s。

一个过渡transition属性是以下四个属性的简写属性：
1. transition-property：none 表示无动画，all 表示应用在所有可动画的属性上（检查所有属性，耗费性能，不推荐）。
2. transition-duration：动画持续的时间（单位：s或ms），默认为0。
3. transition-timing-function：
    1. 默认值是ease，可设置为贝塞尔曲线（Bezier curve）或者阶跃函数（steps），
    2. **贝塞尔曲线**横轴为时间(0 —— 开始时刻，1 —— transition-duration的结束时刻），纵轴为过渡动画的完成度（0 —— 属性的起始值，1 —— 属性的最终值。贝塞尔曲线时间函数的y取值可以为负数或很大，即反向运动（即曲线相当于位移，一阶导数相当于速度，二阶导数相当于加速度）。贝塞尔曲线表示的时间函数有四个控制点，固定的第一个点（0,0）和最后一个点（1,1），设置剩下的第二个点（x2，y2），第三个点（x3，y3），对应时间函数cubic-bezier(x2, y2, x3, y3)，内置的贝塞尔曲线有：linear（线性）、ease（慢快慢）、ease-in（由慢到快）、ease-out（由快到慢） 和 ease-in-out（很慢-慢-快-慢-很慢）
    3. **阶跃函数`steps(n, <jumpterm>)`** 定义了将输出值域分为等距步长的阶跃函数，也称为阶梯函数，比如时钟转动，按照 n 个定格在过渡中显示动画迭代，每个定格等长时间显示，每个停留点的持续时间为总动画时间的 1/n。具体如何跳跃取决于跳跃项 `<jumpterm>`。例如，如果 n 为 5，则有 5 个步骤：
        1. jump-start跳过初始位置，即在20%、40%、60%、80% 和 100% 处暂停。
        2. jump-end是默认值，跳过结束位置，因此最后一个跳跃发生在动画结束时，即在0%、20%、40%、60% 和 80% 处暂停。
        3. jump-none两端都没有跳过，即在包括 0% 和 100% 的情况下设置 5 个定格（在 0%、25%、50%、75% 和 100% 处）。
        4. jump-both两端都跳过，即在 0% 和 100% 之间设置 5 个定格（在 100 / 6 %、100 / 6 * 2%、100 / 6 * 3%、100 / 6 * 4% 和 100 / 6 * 5% 处）。
        5. start等同于 jump-start。
        6. end等同于 jump-end。
        7. step-start等同于 steps(1, jump-start)。
        8. step-end等同于 steps(1, jump-end)。

        ![](/front-end/basics/css/109.png)

4. transition-delay：动画开始前的延迟时间（单位：s或ms）（若为负数，动画会被截断，从动画的“-delay”的阶段立刻开始）。

动画完成触发transitionend 事件：具有event对象，**属性1. event.propertyName**：当前完成动画的属性，**属性2,.event.elapsedTime**：动画完成的时间（按秒计算），不包括 transition-delay。**每个transition完成都会触发一次transitionend事件**，如果需要防止多次触发，可以采用短间隔防抖或addEventListener设置once。如果在某个transition 完成前，该 transition 已从目标节点上移除，那么 transitionend 将不会被触发。一种可能的情况是修改了目标节点的 transition-property 属性，另一种可能的情况是 display 属性被设为 "none"。

**transition注意事项？**
1. 改变 display: none或插入元素（.appendChild()）可能不能和transition一起使用。因为元素将视为没有开始状态，始终处于结束状态，后续对属性改变则不会有过渡动画，解决办法是用 window.setTimeout() 延迟几毫秒再改变后续属性。

![](/front-end/basics/css/110.png)

2. 解决闪动问题，使用3D属性perspective、backface-visibility、translate3d(0,0,0)
3. 缺点适合简单动画，JavaScript动画更灵活实现任何动画逻辑

### animation（帧动画，CSS3）

一个关键帧动画由animation属性设置，可以指定一组或多组动画，每组之间用逗号相隔，animation 属性是以下属性的简写：
1. animation-name关键字动画名称由@keyframes指定。需同时配置 animation-duration 属性，否则时长为 0，动画不会播放。

![](/front-end/basics/css/111.png)

![](/front-end/basics/css/112.png)

![](/front-end/basics/css/113.png)

2. **animation-duration属性**规定元素动画播放完成一个周期所持续时间，以秒或毫秒计量。默认为 0 表示没有动画效果。
3. **animation-delay 属性**规定执行动画前的等待时间，默认为 0。负值，表示跳过对应时长进入动画 。
4. **animation-timing-function属性**动画播放的速度曲线，同transition-timing-function，其中timing function 作用于一个关键帧周期而非整个动画周期，即从关键帧开始开始，到关键帧结束结，包括`steps(n, <jumpterm>)` 阶跃函数也是如此。
5. **animation-iteration-count属性**规定动画的播放次数，可选具体次数或者无限（infinite），默认为 1。可以用小数定义循环，来播放动画周期的一部分：例如，0.5 将播放到动画周期的一半。不可为负值。
6. **animation-direction属性**规定动画是否在下个周期逆向播放。

![](/front-end/basics/css/114.png)

7. **animation-play-state 属性规定动画的播放状态，用此来控制动画的暂停和继续。running 指定运行的动画（默认值）；pause 指定暂停的动画**；
8. **animation-fill-mode 属性**规定在执行之前和之后如何将样式应用于其目标。

![](/front-end/basics/css/115.png)

**动画事件**：

**onanimationstart事件**会在 CSS 动画开始时触发。如果有animation-delay 延时，事件会在延迟时效过后立即触发。为负数的延时时长会致使事件被触发时事件的elapsedTime属性值（动画运行时长）等于该时长的绝对值（并且，相应地，动画将直接播放该时长绝对值之后的动画）。

**onanimationend**当CSS动画完成时事件被触发。如果动画在完成之前终止，例如元素从DOM中删除或动画从元素中删除，则不会触发animationend事件。

**onanimationiteration** 当CSS动画的一个迭代结束，另一个迭代开始时，animationiteration事件被触发。此事件不会与animationend事件同时发生，因此对于动画迭代计数为1的动画不会发生。

**CSS animation支持性检测**：

![](/front-end/basics/css/116.png)

## 属性书写顺序

推荐属性顺序：all > 定位 > 盒模型 > 排版 > 可访问性与交互 > 视觉 > 动画；
除了 all以外，定位是第一位的，因为它可以从正常的文档流中移除一个元素并覆盖与盒子模型相关的样式。盒模型——无论是 flex、float、grid 还是 table——都遵循规定了盒的尺寸、放置和对齐方式。其他一切都发生在盒内部或不影响前两个部分，因此它们排在最后。
all：

![](/front-end/basics/css/117.png)

定位：

![](/front-end/basics/css/118.png)

盒模型：

![](/front-end/basics/css/119.png)

排版：

![](/front-end/basics/css/120.png)

可访问性与交互：

![](/front-end/basics/css/121.png)

视觉：

![](/front-end/basics/css/122.png)

动画：

![](/front-end/basics/css/123.png)

## 兼容性与hack

hack是为了处理不同浏览器之间差异的兼容性写法，带前缀的属性写在前，标准属性写在后面。缺点是难理解、难维护、易失效，替代方案有：

1. 特性检测
2. 针对性加class;

常见兼容性问题：

![](/front-end/basics/css/124.png)

## 图片

![](/front-end/basics/css/125.png)

**CSS Sprites（雪碧图）**：将多个小图片合并成一张图，通过CSS的background-position来定位展示需要显示的图片部分。优缺点如下：

![](/front-end/basics/css/126.png)

**base64编码图片（Data URI Scheme）**：对于编码后数据量不大的图采用，成为HTML内的静态资源，不会发起http请求，不存在图片更新需要重新上传的问题和清理缓存的问题。缺点：base64会增加图片大小，使整体下载量增加；由于是内联在页面中，不会被缓存。不适合用于懒加载中。移动端性能优先并不适宜用，解码会耗费 CPU。

Base64（基底64）是一种基于64个可打印字符来表示二进制数据的表示方法。而64个可打印字符需要 log264 = 6bit进行表示，因此，3 字节（一字节是 8 比特，3 字节也就是 24 比特）的字符串/二进制文件可以转换成 4 个 Base64 字符（4x6 = 24 比特）。这意味着 Base64 格式的字符串或文件的尺寸约是原始尺寸的 133%（增加了大约 33%）。如果编码的数据很少，增加的比例可能会更高。例如：长度为 1 的字符串 "a" 进行 Base64 编码后是 "YQ=="，长度为 4，尺寸增加了 3 倍。Base64 编码常见应用是对二进制数据进行编码，以便将其纳入 data: URL 中。

压缩或拉伸图片：用CSS调整一张图片的尺寸时，如果纵横比与图片的原始宽高不一致，则图片会被压缩或拉伸。解决办法是使用**object-fit属性**。

**object-fit 属性**指定可替换元素（例如：`<img>` 或 `<video>`）的内容应该如何适应到其使用高度和宽度确定的框（有些类似于 background-size）。

![](/front-end/basics/css/127.png)

**object-position属性**指定可替换元素的内容对象内容框中的位置，（类似于 background-position ），允许被替换元素的对象被定位到内容框外部，可替换元素的内容框中未被对象所覆盖的部分，则会显示该元素的背景。

### 图片加载异常处理方案

**原理**：img 和 srcipt 标签的 error 并不会冒泡，但是会经历捕获阶段和处于目标阶段。直接给 img元素添加 onerror 监听的方案就是利用处于目标阶段触发事件函数，但onerror已经废弃，因此可以在捕获阶段截获并触发函数，从而减少性能损耗。

**具体实现**：为每个img标签额外添加一个data-retry-times计数属性，捕获到错误，当重试超过限制次数后就用表示网络异常的base64图片作为兜底。

![](/front-end/basics/css/128.png)

如果图片使用CDN，也就可能是CDN存在节点覆盖不全的问题，使得DNS查询超时导致图片加载失败，可以通过切换domain来尝试：

![](/front-end/basics/css/129.png)

而对于背景图像background-image，背景图元素没有 error 事件，本身也就无法捕获 error 事件，或者可以使用合适的background-color，在背景图像加载失败时兜底。或者创建自定义事件，嗅探图片资源嗅的情况并抛出错误事件即可：

![](/front-end/basics/css/130.png)

##  CSS 预编译器（Less）/ 后处理器（PostCSS）

### Less

**预编译器**：将类CSS语言（Less（.less）、Sass（.scss）、Stylus等）编译处理成浏览器可解析的真正CSS。增强了css代码的复用性，还有嵌套、变量、循环、函数、mixin等，具有很方便的UI组件模块化开发能力。

在 Node.js 环境中使用 Less：1. 安装less，npm install -g less；2. 转换编写好的less文件为CSS，lessc styles.less styles.css。

在浏览器环境中使用 Less ：

`<link rel="stylesheet/less" type="text/css" href="styles.less" />`

`<script src="https://cdn.jsdelivr.net/npm/less@4" ></script>`

采用变量定义属性值让属性值更具语义化，@定义变量，@{}变量插值，其中选择器中、属性名中、部分片段中：必须使用变量插值。

![](/front-end/basics/css/131.png)

![](/front-end/basics/css/132.png)

**混合mixin**，可理解为可复用的样式片段。mixin在编译后是否在CSS中输出取决于定义是否带括号。

![](/front-end/basics/css/133.png)

![](/front-end/basics/css/134.png)

@media 或 @supports 等 at 规则能以与选择器相同的方式嵌套。编译后，at 规则位于顶部，并且与同一规则集中的其他元素的相对顺序保持不变。这称为冒泡。

![](/front-end/basics/css/135.png)

**函数（Function）**：包括多种转换颜色、操作字符串、进行数学运算、参数检测的函数。

![](/front-end/basics/css/136.png)

**注释（comments）**：less支持块注释（即css注释）和行注释，但在编译LESS代码时，行注释不会出现在CSS文件中，因此更多推荐在less中使用行注释。

### PostCSS

Postcss是一个用 JavaScript 工具和插件转换 CSS 代码的工具。通过完成的插件化，Postcss可以具有以下能力：
1. 增强代码的可读性：利用从 Can I Use 网站获取的数据为 CSS 规则添加特定厂商的前缀。Autoprefixer 自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。
2. 将未来的 CSS 特性带到今天：PostCSS Preset Env 帮你将最新的 CSS 语法转换成大多数浏览器都能理解的语法，并根据你的目标浏览器或运行时环境来确定你需要的 polyfills，此功能基于 cssdb 实现。
3. 终结全局 CSS：CSS 模块使得永远不用担心命名太大众化而造成冲突，只要用最有意义的名字就行了。
4. 避免 CSS 代码中的错误：通过使用 stylelint 强化一致性约束并避免样式表中的错误。

PostCSS，通常被视为在完成的样式表中根据CSS规范处理CSS，让其更有效。它的初始功能只有源文件生成AST树，AST树生成新文件，借助插件机制实现定制化的功能，目前最常做的是给CSS属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

![](/front-end/basics/css/137.png)

![](/front-end/basics/css/138.png)

## 设备与视口

设备屏幕尺寸是指屏幕的对角线长度。像素是计算机屏幕能显示一种特定颜色的最小区域，分为设备像素和逻辑像素。

![](/front-end/basics/css/139.png)

在 Apple 的视网膜屏（Retina）中，默认每 4 个设备像素为一组，渲染出普通屏幕中一个像素显示区域内的图像，即1 CSS像素跨越2设备像素，从而实现更为精细的显示效果。如果用户进行放大，一个 CSS 像素还将跨越更多的物理像素。屏幕可显示的像素越多，同样的屏幕区域内能显示的信息也越多。

![](/front-end/basics/css/140.png)

图像分辨率是单位英寸中所包含的像素点数，单位是PPI（Pixels Per Inch）表示每英寸所拥有的像素数目，即像素密度。

设备像素比是默认缩放为 100%的情况下，设备像素和逻辑像素的比值，即设备像素比 DPR = 物理像素数 / 逻辑像素数。设备像素比可以通过 window.devicePixelRatio 来获取。

Web 浏览器包含两个视口，布局视口（layout viewport）和可视视口（visual viewport）。可视视口指当前浏览器中可见的部分，不包括屏幕键盘、缩放外的区域，并且可以变化。当使用键盘对页面进行缩放时，操作的时布局视口。而当使用双指缩放，或键盘在手机上弹出的时候，或者之前隐藏的地址栏变得可见的时候，可视视口缩小了，但是布局视口却保持不变。可视视口要么跟布局视口相同，要么更小。

CSS 像素单位表示的布局视口宽高获取：

![](/front-end/basics/css/141.png)

移动设备的布局视口的默认值为 980px，比如在一个宽 320px 的移动设备显示一个布局视口宽为 980px 的页面，移动设备浏览器会对这个页面进行缩放直至其布局视口宽度为 320px，使得缩放后的页面显示效果都不会很理想。使用 `<meta>` 标签可以显式设置布局视口的宽度：

![](/front-end/basics/css/142.png)

## CSS换肤方案

![](/front-end/basics/css/143.png)

### 多套CSS样式动态切换

**原理**：实现多套 CSS 样式，根据用户切换操作，通过动态修改 link 标签的 href来加载不同的模式的样式，主要解决了多个模式被编译到一个文件中导致单个文件过大。

**优缺点**：

![](/front-end/basics/css/144.png)

**实现示例**：

![](/front-end/basics/css/145.png)

### CSS 变量切换

**原理**：通过 body.style.setProperty(key, value) 动态修改 body 上的 CSS 变量（颜色，字体，宽高等），使得页面上的其他部分可以根据CSS变量应用最新的 CSS 变量对应的样式。

**优缺点**：优点是简单，缺点是存在兼容性（IE不支持），可通过 css-vars-ponyfill 对 CSS 变量进行兼容处理，只需要导入该 ponyfill。

**实现示例**：

![](/front-end/basics/css/146.png)

![](/front-end/basics/css/147.png)

### CSS 样式覆盖

在保留不变的样式，抽离变化的样式；给不同的皮肤/模式定义一个对应的 class；根据不同皮肤/模式切换成对应class来设置不同的样式。缺点明显，多种皮肤/模式样式都要引入，导致代码量增大；样式不易管理，查找复杂；开发效率低，拓展性差。不太推荐使用。

### 已有项目快速支持

对于已有项目，要支持换肤，若采用颜色变量的方式，需要手动将项目中所有颜色值手动替换为对应颜色变量，工作量巨大，有必要实现自动化替换。

![](/front-end/basics/css/148.png)

![](/front-end/basics/css/149.png)

**原理**：使用 PostCSS 或者 Stylelint 解析识别 css/scss/stylus/less/Sass 等样式文件中的**颜色字面量（包括 颜色关键字、Hex、rgb, rgba, hsl, hsla,hwb,gray等函数）**。然后，使用chorma-js的chroma.distance计算识别出的颜色字面量和颜色变量对应的颜色值是否相同或相近来判断识别出的颜色字面量是否可以替换为某个颜色变量。

![](/front-end/basics/css/150.png)

**如何使用**：

![](/front-end/basics/css/151.png)

或者通过 Stylelint VSCode 编辑器插件，代码编写过程中提示颜色字面量需要用颜色变量来替代，可设置保存时自动替换。

![](/front-end/basics/css/152.png)

## 自定义属性

带有前缀 -- 的属性名，表示的是带有值的自定义属性（有时也被称为“CSS 变量”），其可以通过 var() 函数在全文档范围内复用的。 自定义属性名区分大小写，自定义属性是可继承的；自定义属性是可以级联的：每一个自定义属性可以多次出现，并且变量的值将会借助级联算法和自定义属性值运算出来。自定义属性在某个地方存储一个值，然后在其他许多地方引用它。自定义属性具有语义化的标识的优点。

通常的最佳实践是定义在根伪类 :root 下，这样就可以在 HTML 文档的任何地方访问到它，但如果需要，则应该限制在特定的选择器及及其子孙下。

自定义属性的前缀 var- 是早期标准规定的，后期改为了 --。Firefox 31 和以后的版本遵循新的标准。

在 JavaScript 中获取（getPropertyValue方法）或者修改 （setProperty方法）CSS 变量和操作普通 CSS 属性是一样的。

`var(<custom-property-name>, <declaration-value>?)` 函数可以插入一个自定义属性的值，用来代替非自定义属性中值的任何部分。var() 函数不能作为属性名、选择器或者其他除了属性值之外的值：
1. 第一个参数`<custom-property-name>`是要替换的自定义属性的名称。
2. 函数的第二个参数`<declaration-value>`是可选的，用作回退值。如果第一个参数引用的自定义属性无效（概念：计算时有效性），则该函数将使用第二个值。自定义属性的回退值允许使用逗号，即是说任何在第一个逗号之后到函数结尾前的值都会被考虑为回退值，但是部分有特殊含义的字符除外，例如换行符、不匹配的右括号（如 )、] 或 }）、感叹号以及顶层分号（不被任何非 var() 的括号包裹的分号。 回退值并不是用于实现浏览器兼容性的。如果浏览器不支持 CSS 自定义属性，回退值也没什么用。它仅对支持 CSS 自定义属性的浏览器提供了一个回退机制，该机制仅当给定值未定义或是无效值的时候生效。

传统的 CSS 概念里，有效性和属性是绑定的，这对自定义属性来说并不适用。当自定义属性值被解析，浏览器不知道它们什么时候会被使用，所以必须认为这些值都是有效的。但当通过 var() 函数调用时，它在特定上下文环境下也可能不会奏效。因此，当浏览器遇到无效的 var() 时，会使用继承值或初始值代替，即非var计算的 CSS 属性 - 值对中存在语法错误，该行则会被忽略，然而如果自定义属性的值无效，它并不会被忽略，从而会导致该值被覆盖为默认初始值。

## 逻辑属性与逻辑值

传统的 CSS 根据屏幕的实体尺度设置物体尺寸。而逻辑属性与逻辑值规范定义了从这些实体值到与之等价的逻辑值（即相对于流的值）的对应关系——如 left 和 right，或者 top 和 bottom 对应于 start 和 end。

在使用逻辑属性与逻辑值即相对于流的属性和值时，一个关键的概念是块向与行向这两个方向。**块向**是指另一方向，即块——例如段落——依次显示的方向。在英文和阿拉伯文中，块沿竖直方向依次排列，而块在任意竖排书写模式中沿水平方向依次排列。**行向**是指在所用的书写模式中，一行文本延伸的方向。因此在从左到右横排的英文文档，或者从右到左横排的阿拉伯文文档中，行向为水平方向。若切换至竖排书写模式（如日文文档）则行向变为竖直方向，这是因为文本在这种书写模式中竖直延伸。

逻辑属性 margin-block-start / margin-block-end定义了元素的逻辑**块首/块末**外边距，并根据元素的书写模式、行内方向和文本朝向对应至实体外边距，其取值与 margin-left 属性相同。

## 其他CSS属性

**-webkit-box-reflect属性**可使得元素内容在特定方向上进行轴对称反射。语法：`-webkit-box-reflect: [above|below|right|left] <length> <image>`；其中，[above、below、right、left] 关键字指示反射发生的方向，`<length>`指示反射的大小，`<image>`描述要应用于反射的遮罩。Firefox不支持此属性。

**mask简写**（mask-image，mask-mode、mask-repeat、mask-position、mask-clip、mask-origin、mask-size、mask-composite）属性通过在特定点遮罩或剪切图像来**隐藏部分或全部元素**。mask会将 mask-border 重置为其初始值。使用 mask 优于使用其他简写或者各自属性的设置来覆盖，这能保证 mask-border 也会重新设置为新的效果样式。

**mask-image属性**设置了用作元素遮罩层的图像。**默认情况下，这意味着遮罩图像的 alpha 通道将与元素的 alpha 通道相乘**。可以使用 mask-mode 属性对此进行控制。取值：
1. none初始值，即透明的黑色图像层，也就是没有遮罩层，
2. `<mask-source>` 对 `<mask>` 或 CSS 图像的 url() 引用 
3. `<image>` 用作mask图像层的图像值

**mask-mode属性**指示由mask-image 指向的遮罩被视为亮度或阿尔法遮罩。目前仅firefox和sarfari支持。取值：
1. alpha指示应使用遮罩层图像的透明度（阿尔法通道）值作为遮罩值。
2. luminance指示遮罩层图像的亮度值应用作遮罩值。
3. match-source如果mask-image属性是`<mask-source>`类型，遮罩层图像的亮度值会被作为遮罩值。如果它是类型`<image>`，遮罩层图像的 alpha 值应用作遮罩值。

**mask-composite属性**表示对当前遮罩层与其下方的遮罩层使用的合成操作。目前仅firefox和sarfari支持。对于合成，当前遮罩层称为源，而其下方的所有层称为目标。取值：
1. add源放置在目标上方。
2. subtract源被放置在目标之外的位置。
3. intersect源中与目标重叠的部分将替换目标。
4. Exclude源和目的地的不重叠区域被组合。

**inset简写属性**，对应于 top、right、bottom 和 left 属性。此属性虽然为 CSS 逻辑属性规范的一部分，但是无论元素的书写模式、行内方向和文本朝向如何，其所定义的都不是逻辑偏移而是实体偏移。
aspect-ratio属性为盒子规定了首选纵横比，该纵横比可以用于计算 auto 尺寸以及其他布局函数。取值：
1. auto初始值，具有固有纵横比的可替换元素将使用此纵横比，否则盒子无首选纵横比。涉及固有纵横比的尺寸计算始终使用内容盒的尺寸。
2. `<ratio>` 盒子的**首选纵横比**为指定的 width / height 比率。如果省略 height 和前面的斜杠字符，则 height 默认为 1。涉及首选纵横比的尺寸计算使用由 box-sizing 所指定的盒子的尺寸。

**scroll-behavior属性**当用户手动导航或者 CSSOM scrolling API 触发滚动操作时为一个滚动框指定滚动行为，其他任何的滚动，例如那些由于用户行为而产生的滚动，不受这个属性的影响。在根元素中指定这个属性时，它反而适用于视窗。取值：
1. auto初始值，滚动框瞬间完成滚动。
2. smooth滚动框通过一个用户代理预定义的时长、使用预定义的时间函数，来实现平稳的滚动，如果有的话用户代理应遵循其平台的约定。

**writing-mode 属性**定义了文本水平或垂直排布以及在块级元素中文本的行进方向。为整个文档设置该属性时，应在根元素上设置它（对于 HTML 文档，应该在 html 元素上设置）。此属性指定块流动方向，即块级容器堆叠的方向，以及行内内容在块级容器中的流动方向。因此，它也确定块级内容的顺序。水平流动方向也受文本的方向影响，从左到右（ltr，例如英语和大多数其他语言）或从右到左（rtl，例如希伯来语或阿拉伯语）。取值：
1. horizontal-tb：对于左对齐（ltr）文本，内容从左到右水平流动。对于右对齐（rtl）文本，内容从右到左水平流动。下一水平行位于上一行下方。
2. vertical-rl：对于左对齐（ltr）文本，内容从上到下垂直流动，下一垂直行位于上一行左侧。对于右对齐（rtl）文本，内容从下到上垂直流动，下一垂直行位于上一行右侧。
3. vertical-lr：对于左对齐（ltr）文本，内容从上到下垂直流动，下一垂直行位于上一行右侧。对于右对齐（rtl）文本，内容从下到上垂直流动，下一垂直行位于上一行左侧。

**cursor属性**设置光标的类型（如果有），在鼠标指针悬停在元素上时显示相应样式。cursor 属性为可以有零个或多个`<url>`值，指向图片文件，它们之间用逗号分隔，最后必填一个关键字值作为备用。每个`<url>`指向一个图像文件。浏览器将尝试加载指定的第一个图像，如果无法加载则返回下一个图像，如果无法加载图像或未指定图像，则使用关键字值代表的指针类型。每个`<url>`后面都可选跟一对空格分隔的小于 32 的无单位非负数字`<x>` `<y>`表示偏移。它们用来设置指针的热点 (即自定义图标的实际点击位置)，位置相对于图标的左上角。

![](/front-end/basics/css/153.png)

**clip-path属性**使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。该属性指定为下面列出的值的一个或多个值的组合：
1. none：默认初始值，不创建剪切路径。当计算值不为 none 时，会创建新的层叠上下文，就像opacity 的值不为 1 时那样。
2. `<clip-source>`：用 url() 引用 SVG 的 `<clipPath>` 元素。
3. `<basic-shape>`：一种形状，其大小和位置由 `<geometry-box>` 的值定义。如果没有指定 `<geometry-box>`，则将使用 border-box 用为参考盒。取值可为以下值中的任意一个：
    1. `inset(<length-percentage>{1,4}, <border-radius> ?)` ：定义一个 inset 矩形。当四个参数`<length-percentage>`都被提供时，它们代表了从参考盒向内的上、右、下和左的偏移量，定义了嵌入矩形的边缘位置。这些参数遵循margin速记的语法。可选的 `<border-radius>` 参数使用 border-radius 简写语法定义插入矩形的圆角。
    2. `circle(<shape-radius> [at <position>]?)` ：使用半径`<shape-radius>`（可以是`<length>` 或 `<percentage>` 或closest-side（从中心出发的最短距离，对于圆来说就是半径）和 farthest-side（从中心出发的最长距离，对于圆来说就是半径））和圆心位置`<position>`定义一个圆形。
    3. `ellipse(<shape-radius> [at <position>]?)` ：使用两个半径`<shape-radius>`（可以是`<length>` 或 `<percentage>` 或closest-side（从中心出发的最短距离，对于椭圆来说就是短半轴）和 farthest-side（从中心出发的最长距离，对于椭圆来说就是长半轴））和圆心位置`<position>`定义一个椭圆。
    4. `polygon(<fill-rule> [<length-percentage><length-percentage>]#)` ：使用一个 SVG 填充规则`<fill-rule>`和一组顶点`[<length-percentage><length-percentage>]`（三对或更多对值（多边形必须至少绘制一个三角形）。这些值是参考参考框绘制的坐标。）定义一个多边形。
    5. `path([<'fill-rule'>,]?<string>)`：使用一个可选的 SVG 填充规则<'fill-rule'>（路径内部的填充规则。可能的值是nonzero或evenodd。默认值为nonzero）和一个 SVG 路径`<string>`定义定义一个任意形状。
4. `<geometry-box>`：如果同 `<basic-shape>` 一起声明，它将为基本形状提供相应的参考盒。通过自定义，它将利用确定的盒子边缘包括任何形状边角。
    1. margin-box：使用 margin box 作为参考盒。
    2. border-box：使用 border box 作为参考盒。
    3. padding-box：使用 padding box 作为参考盒。
    4. content-box：使用 content box 作为参考盒。
    5. fill-box：利用对象边界框（object bounding box）作为参考盒。
    6. stroke-box：使用笔触边界框（stroke bounding box）作为参考盒。
    7. view-box：使用最近的 SVG 视口（viewport）作为参考盒。如果 viewBox 属性被指定来为元素创建 SVG 视口，参考盒将会被定位在坐标系的原点，参考盒位于由 viewBox 属性建立的坐标系的原点，参考盒的尺寸用来设置 viewBox 属性的宽高值。

**box-decoration-break 属性**用来定义当元素跨多行、多列或多页时，元素的片段应如何呈现。指定的值将影响元素background、border、border-image、box-shadow、clip-path、margin、padding属性的表现。除firefox之外，需要添加前缀-webkit-。取值有：
1. slice：默认值，元素被按照盒子被切割前的原始样式渲染，之后，针对每个行/列/页面将此假设框渲染成片段。请注意，假设框对于每个片段可以是不同的，因为如果中断发生在行内方向，则它使用自己的高度，如果中断发生在块方向，则它使用自己的宽度。
2. clone：每个盒片段与指定的border、padding和margin独立呈现。border-radius、border-image、box-shadow独立地应用于每个片段，每个片段的background也是独立绘制的，这意味着使用 background-repeat: no-repeat 的背景图片仍然可能重复多次。

## CSS Houdini
Houdini 是一组底层 API，它们公开了 CSS 引擎的各个部分，从而使开发人员能够通过加入浏览器渲染引擎的样式和布局过程来扩展 CSS。Houdini 是一组 API，它们使开发人员可以直接访问CSS 对象模型 （CSSOM），使开发人员可以编写浏览器可以解析为 CSS 的代码，从而创建新的 CSS 功能，而无需等待它们在浏览器中本地实现。

### CSS 属性和值 API
CSS 属性和值 API允许开发者显式地定义它们的 **CSS 自定义属性**（值使用var() 函数访问），允许设置属性类型检查、默认值以及是否可继承其值。

## 几何图形绘制

## 布局

### 居中布局

水平且垂直居中只需要将同时满足水平居中和垂直居中即可。

#### 水平居中

1. 行内级元素（inline， inline-block， inline-flex， inline-table）和文本在设置 text-align；center的非inline元素内水平居中。
2. 设置 margin-left：auto；margin-right：auto；的固定宽度的块级元素，在父容器内水平居中。
3. 设置 position：absolute; left：0; right：0；margin-left：auto；margin-right：auto的固定宽度块级元素，在 position：relative 的父容器内水平居中。
4. 单个 flex 项在设置 justify-content：center；的 flex 容器内水平居中。
5. 设置 margin-left：auto；margin-right：auto 的flex 项在 flex 容器内水平居中。
6. 设置 position：absolute；left： 50%；margin-left：-0.5 * width；的固定宽度块级元素，在position：relative；的父容器内水平居中。
7. 设置 position：absolute； left：50%；transform：translateX（-50%）；的块级元素，在position：relative；的父容器内水平居中。
8. 设置margin-left：auto；margin-right：auto；的grid 项在网格区域内水平居中。
9. grid项在设置为 justify-items：center；的 grid 容器的网格区域内水平居中。
10. 设置 justify-self：center；的grid 项 在网格区域内水平居中。

#### 垂直居中

1. 单行文本或行内级元素在设置 line-height：height；的固定高度块级元素内垂直居中。
2. 设置position；absolute；top：50%；margin-top：-0.5 * height；的固定高度块级元素在设置position：relative的父元素内垂直居中。
3. 单行 flex 项在设置 align-items：center 的flex 容器内垂直居中。
4. 设置 margin-top：auto；margin-bottom：auto；的单行 flex 项在 flex 容器内垂直居中。
5. 设置 position：absolute；top：50%；transform：translateY（-50%）；的块级元素在设置position：relative；的父元素内垂直居中。
6. 设置 display：table-cell；vertical-align：middLe的元素在设置 display：table 的父元素内垂直居中。
7. 设置 position：absolute；top：0；bottom：0；margin-top：auto；margin-bottom；auto的固定高度块级元素在设置position：relative的父元素内垂直居中。
8. 设置vertical-align：middle的行内级元素与高度100%，宽度为0的伪元素对齐，在父元素内垂直居中。
9. 设置vertical-align：middle的行内级元素在设置 line-height：height；font-size：0；的父元素内垂直居中。
10. 设置 margin-top：auto；margin-bottom：auto；的 grid 项在网格区域内垂直居中
11. grid项在设置align-items：center的网格区域内垂直 。

### 三栏布局

指实现两侧栏固定宽度，中间栏自适应。

#### 浮动（float）实现

第一个为左栏元素左浮动float：left和设置固定宽度width；

第二个为右栏元素右浮动float: right和设置固定宽度width；

最后一个为中间栏元素设置外边距margin = 左或右的固定宽度 + 额外外边距：

```html
<style>
.left,
.right,
.center {
  height: 100%;
}
.left {
  float: left;
  width: 20%;
  background-color: red;
}
.right {
  float: right;
  width: 25%;
  background-color: blue;
}
.center {
  margin-left: 20%;
  margin-right: 25%;
  background-color: green;
}
</style>
 
<!-- 中间区域放在最后，因为靠后的正常流块盒会无视前面的浮动元素，否则中间区域会独占一行导致右侧区域到下面去了 -->
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="center"></div>
</div>
```

当 container 宽度 < 左侧区域宽度 + 右侧区域宽度时，右侧区域会被挤到左侧区域下方。

#### 浮动实现（圣杯布局）

容器设置左右padding分别为左右栏的宽度；

三栏均设置左浮动float：left和相对定位position: relative; 中间栏为第一个元素优先加载。

左侧栏设置margin-left为-100%（和中间栏同一行并左侧对齐） 和 right为自己负宽度向左移动而不挡住中间栏。

右侧元素设置margin-left为自己负宽度（和中间栏同一行并右侧对齐）和left设置为自己负宽度向右移动而不挡住中间栏。

**注意：当中间栏部分比两边的任一侧栏宽度小布局就会乱掉（要用双飞翼布局来解决）**

```html
<style>
.container {
  padding: 0 200px 0 100px;
}
.left,
.right,
.center {
  position: relative;
  float: left;
}
.center {
  width: 100%;
  background: green;
}
.left {
  width: 100px;
  margin-left: -100%; /* 包含块的内容区宽度，使得和 center 同一行且左侧对齐 */
  right: 100px;   /* 再利用相对定位与 right，移动自身宽度 */
  background: red;
}
.right {
  width: 200px;
  margin-left: -200px; /* 负自身宽度的外边距，和 center 同一行且右侧对齐） */
  left: 200px; /* 再利用相对定位与 left，移动自身宽度 */
  background: blue;
}
</style>
 
<div class="container">
  <div class="center"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

#### 浮动实现（双飞翼布局）

与圣杯布局不同的是，双飞翼布局不在父元素设置padding，而是在中间栏内创建一个子容器放中间栏的内容，使用子容器的margin来给左右两侧栏留出空间。

三栏均设置左浮动float：left；中间栏为第一个元素优先加载。

左侧栏设置margin-left为-100%（和中间栏同一行并与三栏的父容器左侧对齐）;

右侧元素设置margin-left为自己负宽度（和中间栏同一行并与三栏的父容器右侧对齐）；

```html
<style>
.left,
.right,
.center {
  float: left;
}
.center {
  width: 100%;
}
.center .content {
  margin-left: 100px;
  margin-right: 200px;
  background: green;
}
.left {
  width: 100px;
  margin-left: -100%; /* 包含块的内容区宽度，使得和 center 同一行且和容器左侧对齐 */
  background: red;
}
.right {
  width: 200px;
  margin-left: -200px; /* 负自身宽度的外边距，和 center 同一行且和容器右侧对齐） */
  background: blue;
}
</style>
 
<div class="container">
  <div class="center">
    <div class="content"></div> <!-- 实际存放中间区域内容，利用 margin 避开左右区域 -->
  </div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

#### 绝对定位（absolute）实现

外部容器设置相对定位 position: relative

左右两侧设置绝对定位 position: absolute 和 top: 0;

两侧栏设置固定宽度 width;

两侧分别设置至两侧边距 left: 0 和 right: 0

中间栏左右设置外边距margin = 左或右的固定宽度 + 额外外边距：

```html
<style>
.container {
  position: relative;
}
.left,
.right {
  position: absolute;
  top: 0;
}
.left {
  left: 0;
  width: 20%;
  background-color: red;
}
.center {
  margin-left: 20%;
  margin-right: 25%;
  background-color: green;
}
.right {
  right: 0;
  width: 25%;
  background-color: blue;
}
</style>
 
<div class="container">
  <div class="left"></div>
  <div class="center"></div>
  <div class="right"></div>
</div>
```

#### 表格（table）实现

容器设置 display: table和width: 100%；

三栏设置 display: table-cell

两侧栏设置固定宽度 width

注意：table-cell的子元素margin是无效的。

```html
<style>
.container {
  display: table;
  width: 100%;
}
.left,
.right,
.center {
  display: table-cell;
  top:0;
}
.left {
  width: 20%;
  background-color: red;
}
.center {
  background-color: green;
}
.right {
  width: 25%;
  background-color: blue;
}
</style>
 
<div class="container">
  <div class="left"></div>
  <div class="center"></div>
  <div class="right"></div>
</div>
```

#### Flex实现

容器弹性布局 display: flex

两侧栏设置固定宽度 width

中间栏设置占主轴空间 flex: 1

```html
<style>
.container {
  display: flex;
}
.left {
  width: 20%;
  background-color: red;
}
.center {
  flex: 1;
  background-color: green;
}
.right {
  width: 25%;
  background-color: blue;
}
</style>
 
<div class="container">
  <div class="left"></div>
  <div class="center"></div>
  <div class="right"></div>
</div>
```

#### 网格grid实现

容器设置 display: grid

容器设置两侧栏固定，中间栏自适应 grid-template-columns: width auto width

```html
<style>
.container {
  display: grid;
  grid-template-columns: 20% 1fr 25%;
}
.left {
  background-color: red;
}
.center {
  background-color: green;
}
.right {
  background-color: blue;
}
</style>
 
<div class="container">
  <div class="left"></div>
  <div class="center"></div>
  <div class="right"></div>
</div>
```

### 响应式布局

响应式布局（responsive web design，RWD）是一套允许网页改变其布局和外观以适应不同分辨率、屏幕宽度等的实践。而自适应布局的特点是分别为不同的屏幕分辨率定义布局，即创建多个静态布局，每个静态布局对应一个屏幕分辨率范围。

为了处理移动端，首先页面头部必须有 `<meta>` 声明 viewport：

![](/front-end/basics/css/154.png)

```html
<!-- 
  width 定义布局视口的宽度
  initial-scale 定义初始缩放比例
  maximum-scale 定义最大缩放比例
  minimum-scake 定义最小缩放比例
  user-scalable 定义是否允许用户手动缩放页面
 -->
<meta 
  name="viewport"
  content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, width=device-width, user-scalable=no"  
/>
```

#### 百分比布局实现

当浏览器的宽度或者高度发生变化时，通过百分比单位，可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。但是如果过多的使用百分比，会照成布局的复杂度，所以不建议使用百分比来实现响应式。

#### 网格布局实现

Grid 布局可以自动判断容器大小，无论大小，屏幕自动撑满并均分。

```css
/* 
  repeat: 用以 N 整分
  auto-fit: 表示自动填充
  minmax: 轨道最小宽度为 300px
 */
.container {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

#### 媒体查询实现：

通过 CSS3 @media 规则设置不同分辨率下的样式属性，来适配不同尺寸的屏幕设备。

```css
/* iPhone6 iPhone7 iPhone8 */
body {
  background-color: yellow;
}
/* iPhone5 */
@media screen and (max-width: 320px) {
  body {
    background-color: black;
  }
}
/* iPhoneX */
@media screen and (min-width: 375px) and (-webkit-device-pixel-ratio: 3) {
  body {
    background-color: orange;
  }
}
/* iPhone6Plus iPhone7Plus iPhone8Plus */
@media screen and (min-width: 414px) {
  body {
    background-color: black;
  }
}
/* iPad */
@media screen and (min-width: 768px) {
  body {
    background-color: black;
  }
}
/* iPad Pro */
@media screen and (min-width: 1024px) {
  body {
    background-color: black;
  }
}
/* PC */
@media screen and (min-width: 1100px) {
  body {
    background-color: black;
  }
}
```

#### REM 布局实现

由于页面的 rem 单位的样式值都是根据 `<html>` 元素的 font-size 样式属性值进行动态计算，因此可以利用媒体查询或JavaScript，在不同分辨率下给 `<html>` 元素的 font-size 赋值。

```css
html {
  font-size: 24px;
}
@media (max-width: 320px) {
  html {
    font-size: 16px;
  }
}
@media (max-width: 375px) {
  html {
    font-size: 20px;
  }
}
```

标准分辨率或低分辨率显示 dpr  = 1，高分辨率显示，dpr = 2 或 3 或者更高，其中 dpr = 设备像素 ：CSS 像素。

**对于图片高清显示**，高分辨率的屏幕（dpr = 2），单个位图像素对应于4个设备像素，由于单个位图像素不可以再进一步分割，所以只能就近取色，从而导致图片模糊；因此，为了使这张图高清显示，最好的解决方案是借助scrset在不同的dpr下加载不同dpr的图片。

**对于网页高清显示**，就需要对视口进行缩放，使得视觉视口的像素和理想视口的像素1：1。此时的缩放比例也就是scale = 1 / dpr。设置缩放比以后，获取的视口宽度 dpr * 理想视口，计算根元素上的基准font-size即可。

**对于文本的显示**，不建议使用rem，因为希望文本能够流动，使得在大屏手机能看到更多的文本，而不是文本因为 rem 等比缩放使得大字号显得突兀；同样也不希望在小屏手机字体因为等比缩放显得太小，所以应该根据不同的 dpr 动态设置固定字号的字体：

```css
div {
  width: 1rem;
  height: 0.4rem;
  font-size: 12px; /* DPR 为 1 的设备的 font-size 默认值 */
}
[data-dpr="2"] div {
  font-size: 16px;
}
[data-dpr="3"] div {
  font-size: 20px;
}
```

#### vw/vh实现

1vw/vh是布局视口宽度 window.innerWidth /布局视口高度 window.innerHeight 的1%，1vmin/vmax则分别是当前 vw 和 vh 中较小值的1%和较大值的1%。postcss-loader的postcss-px-to-viewport可以自动实现 px 到 vw/vh 的转化。因此，px 转换成 vw/vh  不一定能完整整除，因此有一定的像素差。

### 两栏布局

指其中一栏固定，另外一栏自适应。

#### 浮动实现

固定宽度一栏浮动，自适应一栏触发BFC 即可，或者使用浮动侧margin大于固定宽度栏。

```css
/* 1. 浮动 + BFC 实现两栏布局 */
.float-bfc-two-columns .left {
  float: left;
  width: 25%; /* 左侧宽度固定 */
  background-color: red;
}
 
.float-bfc-two-columns .right {
  display: flow-root; /* 或 overflow: hidden */
  background-color: green;
}
 
/* 2. 浮动 + margin 实现两栏布局 */
.float-margin-two-columns .left {
  float: left;
  width: 25%; /* 左侧宽度固定 */
  background-color: red;
}
 
.float-margin-two-columns .right {
  margin-left: 25%;
  background-color: green;
}
```

#### 绝对定位实现

父元素设置 position：relative；

固定宽度栏放在left侧，另一自适应栏left: 固定宽度放在right侧。

```css
/* 绝对定位实现两栏布局 */
.absolute-two-columns {
  position: relative;
}
.absolute-two-columns .left,
.absolute-two-columns .right {
  position: absolute;
  top: 0;
}
.absolute-two-columns .left {
  left: 0;
  width: 25%;
  background-color: red;
}
.absolute-two-columns .right {
  left: 25%;
  right: 0;
  background-color: green;
}
```

#### 表格实现

父容器设置 display：table; 且宽度100%；

两栏均设置 display：table-cell；

其中一栏固定宽度即可。

```css
.table-two-columns {
  display: table;
  width: 100%;
}
.table-two-columns .left,
.table-two-columns .right {
  display: table-cell;
}
.table-two-columns .left {
  width: 25%;
}
```

#### flex实现

父容器display：flex；

自适应栏flex：1；

```css
/* flex 实现两栏布局 */
.flex-two-columns {
  display: flex; 
}
.flex-two-columns .left {
  width: 25%; /* 左边栏宽度固定 */
}
  
.flex-two-columns .right {
  flex: 1; /* 全分父容器剩余空间 */
  margin-left: 5%;
}
```

#### grid实现：

父元素设置 display: grid; grid-template-columns: 固定宽度 1fr；即可

```css
/* grid 实现两栏布局 */
.grid-two-columns {
  display: grid;
  grid-template-columns: 25% 1fr;
}
```

### 瀑布流布局

瀑布流布局分为等宽瀑布流和等高瀑布流，实现方式类似。以等宽瀑布流为例

![](/front-end/basics/css/155.png)

#### 多列实现

```css
/* 多列实现瀑布流：顺序是先从上往下，再从左往右，因此不适合滚动动态加载添加数据 */
.multi-columns-masonry {
  column-count: 3;
  column-gap: 10px;
}
.multi-columns-masonry .item {
  margin-bottom: 10px;
  border: 1px solid #999;
  break-inside: avoid; /* 内容在列与列之间不强制断开 */
}
.multi-columns-masonry .item img {
  width: 100%;
}
```

#### flex实现

```html
<!-- flex 实现瀑布流布局 -->
<script type="text/javascript">
  const column = 3;
  const data = new Array(column).map(item => []);
  imgList.forEach((img, index) => {
    data[index % column].push(img);
  });
</script>
 
<style>
.flex-masonry {
  display: flex;
  flex-direction: row;
}
.flex-masonry .column {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 2px;
}
.flex-masonry .column .item {
  margin-bottom: 5px;
  width: 100%;
}
</style>
 
<div class="flex-masonry">
    <!-- 第一列放 data[0] -->
    <div class="column">
        <div class="item"></div>
        <!-- more items-->
    </div>
    <!-- 第二列放 data[1] -->
    <div class="column">
        <div class="item"></div>
        <!-- more items-->
    </div>
    <!-- 第三列放 data[2] -->
    <div class="column">
        <div class="item"></div>
        <!-- more items-->
    </div>
</div>
```

#### grid实现

使用grid-template-rows: masonry可直接grid中实现等宽瀑布流布局（grid-template-columns: repeat(3,1fr)）；但是此功能仅在 Firefox 中实现，且需要通过在 about:config 中将标志 layout.css.grid-template-masonry-value.enabled 设置为 true 来启用。

```html
<!-- grid 实现瀑布流布局 -->
<script type="text/javascript">
  // js 动态设置图片占据单元格数：imgElements 是设置 url 为图片资源地址的图片元素集合
  Array.from(imgElements).forEach((imgElement, index) => {
    const url = imgElement.getAttribute('url');
    // 加载图片
    const image = new Image();
    image.src = url;
    image.onload = () => {
      // 根据图片元素的宽高等比例计算显示高度；
      const height = Math.round(image.height * imgElement.width / image.width);
      imgElement.src = url;
      // 设置当前跨越几个单元格（每个单元格 10px)
      imgElement.style.gridRowEnd = `span ${~~(height / 10)}`;
    }
  });
</script>
 
<style>
.grid-masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 5px;
  grid-auto-rows: 10px; /* 隐式网格行尺寸 */
}
.grid-masonry .item {
  grid-row-start: auto; /* 网格起始线设置为自动*/
}
</style>
 
<div class="grid-masonry">
    <div class="item"></div>
    <!-- more items-->
</div>
```

#### 绝对定位实现

首先根据整个容器宽度和设置的图片宽度与间隙计算出能展示的列数。使用一个长度为列数的数组存储每一列当前已放图片的高度和。图片设置为绝对定位，然后计算出每个图片的top，left值：每张图片都放到最短的一列下面即对应于数组中高度和最小的那一项，**top = 数组中首个最小值所在列的值，left = 数组中首个最小值所在列索引 * 列宽 + 间隙**。然后增加数组中此列高度，此时列的高度发生变化，下张图片又会寻找其他最短的列。最后就是监听窗口的改变，重新计算一遍所有图片top，left值。


### 九宫格布局（自适应）

#### grid实现

```css
/* grid 实现九宫格 */
.grid-nine-grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  background-color: red;
}
.grid-nine-grid-container .item {
  position: relative; /* item 的子元素使用绝对定位 */
  padding-bottom: 100%;
  text-align: center;
  background-color: coral;
}
```

#### flex实现

```css
/* flex 实现九宫格 */
.flex-nine-grid-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: red;
}
.flex-nine-grid-container .item {
  position: relative; /* item 的子元素使用绝对定位 */
  width: calc(calc(100% - 10px * 2) / 3);
  padding-bottom: calc(calc(100% - 10px * 2) / 3);
  padding-bottom: 100%;
  margin-right: 10px;
  margin-bottom: 10px;
}
/* n = 0, 1, 2... 则 3n = 3, 6..., 其中 n=0 时，3n=0，而第 0 个元素不存在*/
.flex-nine-grid-container .item::nth-of-type(3n) {
  margin-right: 0;
}
/* n = 0, 1, 2... 则 n+7 = 7, 8, 9..., 其中 n > 2 时，n+7 > 9，而只有 9 个元素存在*/
.flex-nine-grid-container .item:nth-of-type(n+7) {
  margin-bottom: 0;
}
```

#### table实现

```css
/* table 实现九宫格 */
.table-nine-grid-container {
  width: 100%;
  height: 100%;
  display: table;
  border-spacing: 10px; /* border-spacing 属性指定相邻单元格边框之间的距离 */
  background-color: red;
}
.table-nine-grid-container .row {
  width: 100%;
  display: table-row;
}
.table-nine-grid-container .row .item {
  position: relative; /* item 的子元素使用绝对定位 */
  width: calc(calc(100% - 10px * 2) / 3);
  padding-bottom: calc(calc(100% - 10px * 2) / 3);
  display: table-cell;
  text-align: center;
  background-color: coral;
}
```

## 几何图形绘制

### 三角形

#### border 实现

首先将元素内容宽高设置为 0，设置每个border 宽和样式后是四个三角形。

```css
.border-triangle {
  width: 0;
  height: 0;
  border-top: 20px solid green;
  border-right: 20px solid blue;
  border-bottom: 20px solid red;
  border-right: 20px solid black;
}
```
![Alt text](/front-end/basics/css/image-1.png)

然后删除指定方向对侧的 border：

```css
.border-triangle {
  width: 0;
  height: 0;
  /* border-top: 20px solid green; */
  border-right: 20px solid blue;
  border-bottom: 20px solid red;
  border-right: 20px solid black;
}
```
![Alt text](/front-end/basics/css/image-2.png)

最后将非指定方向上的 border 设置为透明： 

```css
.border-triangle {
  width: 0;
  height: 0;
  /* border-top: 20px solid green; */
  border-left: 20px solid transparent;
  border-bottom: 20px solid red;
  border-right: 20px solid transparent;
}
```
![Alt text](/front-end/basics/css/image-3.png)

**等边三角形**：通过设置border宽度比为：指定方向 / 非指定方向 = ![Alt text](/front-end/basics/css/image.png) 即可。

**角落三角形**：只设置相邻两个border的宽度，且其中一个设置为transparent。

#### 线性渐变实现

实现一个45°方向的线性渐变容器，在50%的位置向后设置为透明：

```css
.linear-gradient-triangle {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff1493, #ff1493 50%, transparent 50%, transparent 100%);
}
```
![Alt text](/front-end/basics/css/image-4.png)

#### 圆锥渐变实现

首先圆心点设置于 50% 0即 center top（容器最上方的中间），设置转动初始方向是90deg。转动45deg即可，后面都是透明（多出来的 0.1deg 是为了简单消除渐变产生的锯齿的影响）：

```css
.conic-gradient-triangle {
  width: 100px;
  height: 50px;
  background: conic-gradient(from 90deg at 50% 0, deeppink 0, deeppink 45deg, transparent 45.1deg)
}
```

![Alt text](/front-end/basics/css/image-5.png)

#### rotate旋转实现

首先父容器设置相对定位，子元素绝对定位，设置子元素的旋转中心在左下角 left bottom，然后进行旋转到相应角度即可

```css
.transform-rotate-triangle {
  position: relative;
  width: 100px;
  height: 50px;
  overflow: hidden;
}
.transform-rotate-triangle::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: deeppink;
  transform-origin: left bottom;
  transform: rotate(45deg);
}
```

![Alt text](/front-end/basics/css/image-6.png)

#### clip-path剪切实现

clip-path创建剪切区域。区域内的显示，区域外的隐藏。

```css
.clip-path-triangle {
  width: 50px;
  height: 50px;
  background-color: deeppink;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
```

![Alt text](/front-end/basics/css/image-7.png)

#### 十进制 Unicode字符实现

通过transform旋转 （rotate ）或者缩放（scale） ，来改变三角形的方向和大小。

```css
/*
  三角形字符：
    ◄ : &#9668;
    ► : &#9658;
    ▼ : &#9660;
    ▲ : &#9650;
    ⊿ : &#8895;
    △ : &#9651;
*/
.unicode-triangle {
  font-size: 50px;
  color: deeppink;
}
```

![Alt text](/front-end/basics/css/image-8.png)

#### 阴影三角形

利用十进制 Unicode 字符实现三角形，并添加文字阴影。

```css
.shadow-triangle {
  display: inline-block;
  transform: scaleX(2.5);
  color: #bada55;
  text-shadow: 0 2px 2px rgba(255, 255, 255, 0.7), 0 10px 4px rgba(0, 0, 0, 0.5);
  font-size: 32px;
  cursor: pointer;
}
 
.shadow-triangle:hover {
  transition: all 0.2s ease;
  transform: scaleX(2.5) translateY(4px);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}
```

![Alt text](/front-end/basics/css/image-9.png)

### 梯形

#### border实现

在三角形border实现中，通过只修改元素的一个方向的尺寸（宽或高）可以将该方向上的border变成梯形：

```css
.trapezoid {
  width: 100px;
  height: 0;
  border-left: 20px solid transparent;
  border-bottom: 20px solid #ff6b6b;
  border-right: 20px solid transparent;
}
```

![Alt text](/front-end/basics/css/image-10.png)

通过设置元素的宽度，可以同时修改梯形的上下底长度；通过设置 border-left-width 和 border-right-width 可以修改底角大小，border 越宽，底角越小。另外还可以设置 border-bottom-width，从而控制梯形的高度。如果要改变梯形的方向，则应该改变元素 height 的值，元素 width 保持为 0。

### 正方形

#### vw 实现

将盒子的宽高设置为相同的数值和计量单位 vw 或 vh（一般使用 vw）。

```css
.vw-square {
  width: 10vw;
  height: 10vw;
  background-color: skyblue
}
```

![Alt text](/front-end/basics/css/image-11.png)

#### padding 实现

由于 margin 和 padding 的百分比数值是相对于包含块的宽度的。将元素垂直方向的一个 padding 值设定为与 width 相同的百分比即可。但是会导致在元素上设置 max-height 属性失效。

```css
.padding-square {
  width: 10%;
  /* 解决内容将元素撑高的问题 */
  height: 0;
  padding-bottom: 10%;
  background-color: skyblue;
}
```

![Alt text](/front-end/basics/css/image-13.png)

#### 伪元素实现

若利用 margin，容器与伪元素在垂直方向发生了外边距折叠，需要在父元素即容器上触发 BFC，padding 则不需要：

```css
.pseudo-square {
  width: 10%;
  /* 伪元素使用 margin-top 时，需要触发 BFC, padding 则不需要 */
  overflow: hidden; /* 最好使用 display: flow-root */
  background-color: skyblue;
}
 
.pseudo-square::before {
  content: '';
  display: block;
  /* margin 百分比相对于包含块宽度计算 */
  margin-top: 100%;
}
```

![Alt text](/front-end/basics/css/image-12.png)

### 同心圆

#### 单个元素 box-shadow 实现

```css
.box-shadow-circle {
  width: 20px;
  height: 20px;
  margin: 16px;
  border-radius: 50%;
  box-shadow: 0 0 0 10px red, 0 0 0 10px blue, 0 0 0 10px green;
}
```

![Alt text](/front-end/basics/css/image-15.png)

#### 单个元素 repeat-radial-gradient 重复径向渐变实现

```css
.repeat-radial-gradient-circle {
  width: 20px;
  height: 20px;
  margin: 16px;
  border-radius: 50%;
  background: repeat-radial-gradient(red, yellow 10%, green 15%);
}
```

![Alt text](/front-end/basics/css/image-16.png)

### 五角星

五角星可以看作是由三个三角形拼接而成的。

```css
.vw-square {
  width: 10vw;
  height: 10vw;
  background-color: skyblue
}
.pseudo-pentagram {
  width: 0;
  height: 0;
  color: red;
  margin: 50px 0;
  position: relative;
  display: block;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 70px solid red;
  transform:rotate(35deg);
}
 
.pseudo-pentagram::before {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 80px solid red;
  position: absolute;
  top: -45px;
  left: -65px;
  color: white;
  display: block;
  content: "";
  transform:rotate(-35deg);
}
 
.pseudo-pentagram::after {
  width: 0;
  height: 0;
  display: block;
  position: absolute;
  color: red;
  top: 3px;
  left: -105px;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 70px solid red;
  content: "";
  transform:rotate(-70deg);
}
```

![Alt text](/front-end/basics/css/image-17.png)

### 正六边形

**方法一**：把正六边形分成三部分，左中右分别是：before 伪元素部分，div 部分，after 伪元素部分：

```css
.pseudo-hexagon {
  position: relative;
  width: 50px;
  height: 86.6px;
  margin: 0 auto;
  background-color: red;
}
.pseudo-hexagon::before,
.pseudo-hexagon::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  border-top: 43.3px solid transparent;
  border-bottom: 43.3px solid transparent;
}
.pseudo-hexagon::before {
  right: 50px;
  border-right: 43.3px solid transparent;
}
.pseudo-hexagon::after {
  left: 50px;
  border-left: 43.3px solid transparent;
}
```

![Alt text](/front-end/basics/css/image-18.png)

**方法二**：正六边形分成三个宽高相同的 div，然后使用定位以及 css3 transform:rotate 分别向左右旋转 60deg 形成正六边形。

```css
.transform-hexagon {
  position: relative;
  width: 100px;
  margin: 0 auto;
}
.transform-hexagon .rectangle1,
.transform-hexagon .rectangle2,
.transform-hexagon .rectangle3 {
  width: 50px;
  height: 86.6px;
  border-top: 1px solid red;
  border-bottom: 1px solid red;
}
.transform-hexagon .rectangle2,
.transform-hexagon .rectangle3 {
  position: absolute;
  top: 0;
  left: 25px;
}
.transform-hexagon .rectangle2 {
  transform: rotate(60deg);
}
.transform-hexagon .rectangle3 {
  transform: rotate(-60deg);
}
```

![Alt text](/front-end/basics/css/image-19.png)