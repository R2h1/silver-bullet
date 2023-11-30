# 数据结构与算法

## 面向对象、面向过程、面向函数？

**面向对象（Object Oriented）**：它将程序看作是一组对象的集合，每个对象都可以接收消息、处理数据并和其他对象交互。在OOP（Object Oriented Programming）中，对象具有状态和行为，并且对象之间可以建立继承和关联关系。OOP通常适用于处理与现实世界有关的问题。

**面向过程（Procedure Oriented）**：它将程序看作是一系列过程或函数的集合，这些过程按照特定的顺序执行，每个过程都可以操作共享的数据。在POP中，函数是可变的，可能会引起副作用，例如修改全局变量。POP（Procedural Oriented Programming）通常适用于处理简单、线性的问题。

**面向函数（Function Oriented）**：即函数式编程。它将程序看作是函数的集合，强调函数的使用和复用，将函数作为程序的基本构建块，通过组合和转换函数实现复杂的计算过程，并且不会对外部状态进行修改。FOP（Functional Oriented Programming）通常适用于处理数学运算、数据转换等问题。

## 数组

### 集合、列表、数组

**集合**：由一个或多个确定的元素所构成的整体。**类型不一定相同、确定、无序、互异**。

**列表（又称线性列表）**：按照一定的线性顺序，排列而成的数据项的集合。**类型不一定相同、有序、不一定互异。包括数组、栈、队列、链表等**。

**数组（Array）**：是一种元素在**内存中连续存储**的线性列表数据结构。**类型相同（静态语言）或类型可不同（动态语言）、有序、不一定互异**。

![](../public/basics/dsa-1.png)

### 数组基本操作

**读取元素**：通过数组的 **索引（下标）**访问数组中的元素。**随机访问即时间复杂度O(1)**。

#### 为什么数组下标从 0 开始？

因为，下标从 0 开始的计算机寻址公式（$a[i]\_address=base\_address+i*data\_type\_size$）相比下标从 1 开始，a[1]表示数组的首地址的寻址公式（$a[i]\_address=base\_address+(i-1)*data\_type\_size$）访问数组元素少一次减法运算，这对于 CPU 来说，就是少了一次减法指令。

**查找元素**：从索引 0 处开始，逐步向后查询。**时间复杂度 O(n)**;

**插入元素**：
1. **尾部插入**，通过数组的长度计算出即将插入元素的内存地址，然后将该元素插入到尾部。**时间复杂度 O(1)**;
2. **非尾部插入**，将尾部到索引下标之间的元素依次后移，将元素插入索引对应的空出空间。**时间复杂度 O(n)**。
3. JavaScript 超出数组长度范围插入，对超出部分会自动设置为 undefined。

**删除元素**：
1. **尾部删除**，直接删除。**时间复杂度 O(1)**;
2. **非尾部删除**，删除指定索引元素，后续元素依次向前填补，**时间复杂度为 O(n)**;

**更改元素**：通过数组的**索引（下标）赋值更改。时间复杂度 O(1)**;
**二维数组**的本质上仍然是一个一维数组，内部的一维数组仍然从索引 0 开始。m * n 的二维数组寻址公式为：$a[i][j]\_address=base\_address+(i*n+j)*data\_type\_size$，其中第 k 个一维数组的首元素的地址为：$a[k][0]\_address=base\_address+(k*n)*data\_type\_size$。

### 数组的优劣
高效 O(1) 的随机访问，低效 O（n）的查找、插入和删除元素。因此，数组所适合的是读、改操作多，查、删操作少的场景。

### 算法题
<br>  

#### 1. 二维数组的查找

**题目描述**：在一个二维数组中（每个一维数组的长度相同），每一行、列分别按照从左到右、从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

**分析**：数组的规律是行元素从左到右递增，列元素从上到下递增，比如：
$$ arr = [[1, 7, 13, 19], [3, 9, 15, 21], [5, 11, 17,23]] $$

因此最小值和最大值在左上角和右下角。  假如对于整数 15，可以从左下角开始，向右上角进行遍历（也可以从右上角开始，向左下角进行遍历），如果大于 arr[i][j]，向右走（超过列边界退出，找不到），如果小于 arr[i][j] 向上走（超过行边界退出，找不到）。

**求解**：

```typescript
/** 暴力解法 */
function findNumberIn2DArray1(matrix: number[][], target: number): boolean {
  const row = matrix?.length;
  const col = matrix?.[0]?.length;
  // 二位数组为空
  if (!row || !col) return false;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const element = matrix[i][j];
      if (element === target) return true;
      // 当前一维数组大了
      if (element > target) break;
    }
  }
  return false;
}

/** 优化解法 */
function findNumberIn2DArray2(matrix: number[][], target: number): boolean {
  const row = matrix?.length;
  const col = matrix?.[0]?.length;
  // 二位数组为空
  if (!row || !col) return false;

  // 从左下角元素出发，向右上进行遍历
  let i = row - 1;
  let j = 0;
  while (i >= 0 && j < col) {
    const element = matrix[i][j];
    if (element === target) return true;
    // 当前行已经都比目标元素大
    if (element > target) {
      i--;
    } else {
      // 当前行不大于目标元素
      j++;
    }
  }
  return false;
}
```

#### 2. 旋转数组的最小数字

**题目描述**：把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个存在重复元素的升序数组的一个旋转，输出旋转数组的最小元素。

**分析**：旋转数组由前后两段非递减元素组成，比如 **[3, 4, 5, 1, 2]** 是 [1, 2, 3, 4, 5] 的前两个数旋转到数组末尾得到的旋转数组。

首先，**前一段的元素一定大于等于后一段的元素，最小数字一定是第一段非递减元素末尾的下一个，遍历即可**。 

而且使用**二分法**比较中间元素与右侧元素的大小关系，由于 left < right 时只能是mid <= right，说明最小在left。所以可以分成以下情况：
1. left < right , 最小在 left;
2. left >=right：
    1. mid > right, 最小在 [mid + 1, right]；
    2. mid < right, 最小在 [left, mid]；
    3. mid = right，最小在[left+1, right -1]。

```typescript
// 暴力解法
function minArray1(numbers: number[]): number {
  const len = numbers?.length;
  if (!len) return NaN;
  for (let i = 1; i < len; i++) {
    const cur = numbers[i];
    const pre = numbers[i - 1];
    // 上一个元素比当前元素大;
    if (pre > cur) {
      return cur;
    }
  }
  return numbers[0];
}

// 优化解法（二分查找）
function minArray2(numbers: number[]): number {
  const len = numbers?.length;
  if (!len) return NaN;
  let left = 0;
  let right = len - 1;
  // 旋转数组的前一部分均大于等于后一部分
  while (left < right) {
    const leftNum = numbers[left];
    const rightNum = numbers[right];
    // 子数组有序，最小元素在 left
    if (leftNum < rightNum) {
      return leftNum;
    }
    // 中间元素的下标；
    const mid = Math.floor((left + right) / 2);
    const midNum = numbers[mid];
    if (midNum > rightNum) {
      // 中间数大于右边数， 最小元素在[mid + 1, right]
      left = mid + 1;
    } else if (midNum < rightNum) {
      // 中间数小于右边数， 最小元素在[left, mid]
      right = mid;
    } else {
      // 中间的数等于右边，而且左边大于等于右边 left >= mid = right, 最小元素在[left + 1, right - 1]
      left = left + 1;
      right = right - 1;
    }
  }
  return numbers[left];
}
```