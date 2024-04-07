# 几何图形绘制

## 三角形

### border 实现

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

### 线性渐变实现

实现一个45°方向的线性渐变容器，在50%的位置向后设置为透明：

```css
.linear-gradient-triangle {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff1493, #ff1493 50%, transparent 50%, transparent 100%);
}
```
![Alt text](/front-end/basics/css/image-4.png)

### 圆锥渐变实现

首先圆心点设置于 50% 0即 center top（容器最上方的中间），设置转动初始方向是90deg。转动45deg即可，后面都是透明（多出来的 0.1deg 是为了简单消除渐变产生的锯齿的影响）：

```css
.conic-gradient-triangle {
  width: 100px;
  height: 50px;
  background: conic-gradient(from 90deg at 50% 0, deeppink 0, deeppink 45deg, transparent 45.1deg)
}
```

![Alt text](/front-end/basics/css/image-5.png)

### rotate旋转实现

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

### clip-path剪切实现

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

### 十进制 Unicode字符实现

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

### 阴影三角形

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

## 梯形

### border实现

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

## 正方形

### vw 实现

将盒子的宽高设置为相同的数值和计量单位 vw 或 vh（一般使用 vw）。

```css
.vw-square {
  width: 10vw;
  height: 10vw;
  background-color: skyblue
}
```

![Alt text](/front-end/basics/css/image-11.png)

### padding 实现

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

### 伪元素实现

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

## 同心圆

### 单个元素 box-shadow 实现

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

### 单个元素 repeat-radial-gradient 重复径向渐变实现

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

## 五角星

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

## 正六边形

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