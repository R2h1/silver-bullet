# 布局

## 居中布局

水平且垂直居中只需要将同时满足水平居中和垂直居中即可。

### 水平居中

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

### 垂直居中

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

## 三栏布局

指实现两侧栏固定宽度，中间栏自适应。

### 浮动（float）实现

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

### 浮动实现（圣杯布局）

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

### 浮动实现（双飞翼布局）

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

### 绝对定位（absolute）实现

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

### 表格（table）实现

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

### Flex实现

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

### 网格grid实现

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

## 响应式布局

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

### 百分比布局实现

当浏览器的宽度或者高度发生变化时，通过百分比单位，可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。但是如果过多的使用百分比，会照成布局的复杂度，所以不建议使用百分比来实现响应式。

### 网格布局实现

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

### 媒体查询实现：

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

### REM 布局实现

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

### vw/vh实现

1vw/vh是布局视口宽度 window.innerWidth /布局视口高度 window.innerHeight 的1%，1vmin/vmax则分别是当前 vw 和 vh 中较小值的1%和较大值的1%。postcss-loader的postcss-px-to-viewport可以自动实现 px 到 vw/vh 的转化。因此，px 转换成 vw/vh  不一定能完整整除，因此有一定的像素差。

## 两栏布局

指其中一栏固定，另外一栏自适应。

### 浮动实现

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

### 绝对定位实现

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

### 表格实现

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

### flex实现

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

### grid实现：

父元素设置 display: grid; grid-template-columns: 固定宽度 1fr；即可

```css
/* grid 实现两栏布局 */
.grid-two-columns {
  display: grid;
  grid-template-columns: 25% 1fr;
}
```

## 瀑布流布局

瀑布流布局分为等宽瀑布流和等高瀑布流，实现方式类似。以等宽瀑布流为例

![](/front-end/basics/css/155.png)

### 多列实现

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

### flex实现

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

### grid实现

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

### 绝对定位实现

首先根据整个容器宽度和设置的图片宽度与间隙计算出能展示的列数。使用一个长度为列数的数组存储每一列当前已放图片的高度和。图片设置为绝对定位，然后计算出每个图片的top，left值：每张图片都放到最短的一列下面即对应于数组中高度和最小的那一项，**top = 数组中首个最小值所在列的值，left = 数组中首个最小值所在列索引 * 列宽 + 间隙**。然后增加数组中此列高度，此时列的高度发生变化，下张图片又会寻找其他最短的列。最后就是监听窗口的改变，重新计算一遍所有图片top，left值。


## 九宫格布局（自适应）

### grid实现

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

### flex实现

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

### table实现

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