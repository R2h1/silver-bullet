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

#### 3. 调整数组顺序使奇数位于偶数前面

**题目描述**：输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有的奇数位于数组的前半部分，所有的偶数位于数组的后半部分（**扩展**：并保证奇数和奇数，偶数和偶数之间的相对位置不变）。

**分析**：目标是奇数在前，偶数在后。

首先，可以使用一个额外数组，遍历两次原始数据，分别将奇偶元素放入其中，如此可以保证奇偶相对位置不变；

其次，可以采用左右指针向中间移动，左指针偶数，右指针奇数，进行交换；否则左指针移动直到遇到偶数，右指针移动直到遇到奇数；不过无法保证奇偶相对位置不变；

最后，可以采用快慢指针法，快指针向前搜索奇数，慢指针搜索偶数位置，不过这样不能保证偶的相对位置；

**求解**：

```typescript
// 暴力解法(支持)
function exchange1(nums: number[]): number[] {
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    element & 1 ? left.push(element) : right.push(element);
  }
  return left.concat(right);
}

// 左右指针
function exchange2(nums: number[]): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    if (!(nums[left] & 1) && nums[right] & 1) {
      // 左边是偶数，右边是奇数，进行交换
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left = left + 1;
      right = right - 1;
      continue;
    }
    while (nums[left] & 1 && left < right) {
      // 左指针是奇数
      left = left + 1;
    }
    while (!(nums[right] & 1) && left < right) {
      // 右指针是偶数
      right = right - 1;
    }
  }
  return nums;
}

// 快慢指针
function exchange3(nums: number[]): number[] {
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[fast] & 1) {
      // 快指针是奇数
      slow !== fast && ([nums[slow], nums[fast]] = [nums[fast], nums[slow]]); // 排除自我交换
      slow = slow + 1;
    }
    fast = fast + 1;
  }
  return nums;
}
```
#### 4. 数组中出现次数超过一半的数字

**题目描述**：数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。你可以假设数组是非空的，并且给定的数组总是存在多数元素，如果不存在，返回 NaN。

**分析**：

**排序计数**，首先对数组进行排序，遍历记录是否存在超过一半的数字，遇到不同的数字重置出现次数即可。

**哈希计数**，使用哈希表记录所有数字出现的次数，当遇到超过一半的数字返回即可。

**摩尔投票**，众数记为 +1，把其他数记为 -1，将它们全部加起来，如果最终的和大于 0，说明存在多数，否则不存在。[1,2,3,2,2,2,5,4,2] 遇到不一样的数字，对投票计数器进行 - 1，直到 count 为 0 刚好剔除，重新开始投票，不改变多数性质，比如遍历到 3 的时候 count 为 0，相当于剔除了 1,2, 从 [3,2,2,2,5,4,2] 重新开始。

**求解**：

```typescript
// 排序后计数
function majorityElement1(nums: number[]): number {
  nums.sort();
  const len = nums?.length;
  let majority = nums[0];
  let count = 0;
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (element === majority) {
      count = count + 1;
    } else {
      count = 1;
      majority = nums[i];
    }
    // 大于一半
    if (count > len / 2) {
      return majority;
    }
  }
  return NaN;
}

// 哈希计数
function majorityElement2(nums: number[]): number {
  const len = nums?.length;
  const counter: Record<number, number> = {};
  for (let i = 0; i < len; i++) {
    const count = counter[nums[i]];
    const element = nums[i];
    if (count) {
      counter[element] = count + 1;
    } else {
      counter[element] = 1;
    }
    if (counter[element] > len / 2) {
      return element;
    }
  }
  return NaN;
}

// 摩尔投票法
function majorityElement3(nums: number[]): number {
  const len = nums?.length;
  let majority = nums[0];
  let count = 0;
  // [1,2,3,2,2,2,5,4,2]  遇到不一样的数字，对投票计数器进行 - 1，直到 count 为 0 刚好剔除，重新开始投票，不改变多数性质，
  // 比如遍历到 3 的时候 count 为 0，相当于剔除了 1,2, 从[3,2,2,2,5,4,2]重新开始；
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (count === 0) {
      majority = element;
    }
    count = element === majority ? count + 1 : count - 1;
  }
  return count === 0 ? NaN : majority;
}
```

#### 5. 连续子数组的最大和

**题目描述**：输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。要求时间复杂度为 O(n)。

**分析**：

**暴力法**，直接遍历两遍进行计算，记录所有连续子数组的和来更新最大值。

**动态规划（剔除）法**，遍历一遍数组，计算到当前数字的子数组的和，如果比当前数字小，说明之前的连续子数组的和为负数，可将其剔除掉，此时记录和为当前数字。

**求解**： 

```typescript
// 暴力法
function maxSubArray1(nums: number[]): number {
  const len = nums?.length;
  let maxSum = nums[0];
  for (let i = 0; i < len; i++) {
    let sum = 0;
    for (let j = i; j < len; j++) {
      sum = sum + nums[j];
      if (sum > maxSum) {
        maxSum = sum;
      }
    }
  }
  return maxSum;
}

// 优化解法（动态规划）
function maxSubArray2(nums: number[]): number {
  const len = nums?.length;
  let maxSum = nums[0];
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    sum = sum + element;
    // 当前位置之前构成的连续子数组 subNums计算出来的和小于当前元素
    // 说明 subNums 除当前元素的和为负数，可以剔除；
    if (sum <= element) {
      sum = element;
    }
    if (sum > maxSum) {
      maxSum = sum;
    }
  }
  return maxSum;
}

// 优化解法（动态规划）
function maxSubArray3(nums: number[]): number {
  let len = nums.length;
  // 记录到当前位置的子数组的连续子数组的最大和
  let maxSums: number[] = [];
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (i === 0) {
      // 单元素的最大和为本身
      maxSums.push(element);
    } else if (maxSums[i - 1] <= 0) {
      // 前一个最大值是非正数，最大值为当前值
      maxSums.push(element);
    } else {
      // 否则最大值 为 前一个最大值 加上当前值
      maxSums.push(maxSums[i - 1] + element);
    }
  }
  return Math.max(...maxSums);
}
```

#### 6. 把数组排成最小的数

**题目描述**：输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

**分析**：

**排序法**，因为对于任意两个数 x 与 y，对于拼接，若 xy > yx，说明 y 应该在 x 前面，反之 y 应该在 x 前面；而且若 xy < yx 且 yz < zy 且 xz < zx, 则 xyz 最小: 因为 xyz < yxz < yzx < zyx,  xyz < xzy < zxy < zyx; 因此，对[ x, y, z] 进行排序，保证 xy < yx 且 yz < zy 且 xz < zx 即可。

**求解**：

```typescript
// sort + join
function minNumber1(nums: number[]): string {
  // sort 的比较函数，当返回值大于 0 时 b 在前， a 在后；小于 0 时 a 在前，b 在后
  return nums
    .sort((a, b) => {
      const strA = String(a);
      const strB = String(b);
      return strA + strB > strB + strA ? 1 : -1;
    })
    .join('');
}
```

#### 7. 数组的逆序对

**题目描述**：在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数

**分析**：

**暴力法**，遍历数组元素，与其后的所有元素对比，满足逆序条件统计（超时）。

**归并排序法**，使用归并排序，在排序过程中，当左子序列的当前元素大于右边子序列当前元素时，此时左子序列当前元素及其后均为逆序对。

**求解**：

```typescript
// 暴力法(超时)
function reversePairs1(nums: number[]): number {
  let count = 0;
  const len = nums?.length;
  for (let i = 0; i < len; i++) {
    const base = nums[i];
    for (let j = i + 1; j < len; j++) {
      const compare = nums[j];
      if (compare < base) {
        count = count + 1;
      }
    }
  }
  return count;
}

// 归并排序法
function reversePairs2(nums: number[]): number {
  const len = nums?.length;
  const temp = new Array(len);
  function getCount(left: number, right: number) {
    if (left >= right) return 0;
    let count = 0;
    const mid = Math.floor((left + right) / 2); // (left + right) >> 1;
    // 进行分解
    count = getCount(left, mid) + getCount(mid + 1, right);
    let low = left; // 左边有序子序列的起始位置
    let hight = mid + 1; // 右边有序子序列的起始位置
    // 先将左右子序列缓存起来，用于对比合并
    for (let i = left; i <= right; i++) {
      temp[i] = nums[i];
    }
    for (let i = left; i <= right; i++) {
      if (temp[low] > temp[hight] && low <= mid && hight <= right) {
        // 左边指向元素大于右边指向元素
        nums[i] = temp[hight++];
        count = count + mid - low + 1;
      } else if (low > mid) {
        // 左边遍历完，说明右边剩余元素均大于左边，直接拷贝 不形成逆序对
        nums[i] = temp[hight++];
      } else if (hight > right || temp[low] <= temp[hight]) {
        // 右边遍历完，左边还剩余元素 或者 左边小于右边，不形成逆序对
        nums[i] = temp[low++];
      }
    }
    return count;
  }
  const count = getCount(0, len - 1);
  return count;
}
```

#### 8. 数字在排序数组的出现次数
**题目描述**：统计一个数字在排序数组中出现的次数。

**分析**：

**indexOf + lastIndexOf**，找到排序数组中出现该数字的首尾下标，计算即可，需要使用indexOf 判断是否存在该数字。

**遍历计数**，通过一次遍历设置一个标志flag，初始为 false，当和目标值相等置为true，再次不等于目标值时，即可跳出循环。

**正则法**，使用join函数以#分割转换为字符串，在末尾新增一个 #，正则match匹配 ’目标数字#’的结果数组的长度即可。

**二分法**，首先找到目标数字，然后向两边进行搜索即可。

**求解**：

```typescript
// indexOf + lastIndexOf
function search1(nums: number[], target: number): number {
  const startIndex = nums?.indexOf(target);
  const endIndex = nums?.lastIndexOf(target);
  if (startIndex === -1) return 0;
  return endIndex - startIndex + 1;
}

// 遍历计数
function search2(nums: number[], target: number): number {
  const len = nums?.length;
  let count = 0;
  // 是否是 target, 用于恰好大于target的时候退出循环；
  let flag = false;
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (element === target) {
      count = count + 1;
      flag = true;
    } else if (flag) {
      break;
    }
  }
  return count;
}

// 正则 + join
function search3(nums: number[], target: number): number {
  const reg = new RegExp(target + '#', 'g');
  const numsStr = nums.join('#') + '#';
  const count = numsStr.match(reg)?.length ?? 0;
  return count;
}

// 二分法
function search4(nums: number[], target: number): number {
  const len = nums?.length;
  let left = 0;
  let right = len - 1;
  let count = 0;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2); // ( left + right ) >> 1
    const element = nums[mid];
    if (element > target) {
      // 在 [mid + 1, right]
      left = mid + 1;
    } else if (element < target) {
      // 在[left, mid - 1]
      right = mid - 1;
    } else {
      // 在 [mid] 两侧
      count = 0;
      let low = mid;
      let high = mid + 1;
      while (low >= left) {
        if (nums[low] === target) {
          count = count + 1;
        }
        low = low - 1;
      }
      while (high <= right) {
        if (nums[high] === target) {
          count = count + 1;
        }
        high = high + 1;
      }
      break;
    }
  }
  return count;
}
```

#### 9. 数组中只出现一次的两个数字（其余出现均两次）

**题目描述**：一个整型数组 nums 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

**分析**：

**哈希计数**，首遍遍历在哈希表中统计所有数字的出现次数，二次遍历找到哈希表中只出现一次的两个数字即可。

**indexOf + lastIndexOf**，遍历数组的元素，找到首次和最后一次出现下标相同的元素即可。

**异或运算**，相同数组的异或结果为0，而任意数字和0的异或结果为本身，因此遍历数组计算所有元素的异或结果即为不同的两个元素的异或结果，该异或结果中为1的位可以用来区分这两个不同的数字。将异或结果与 1 依次进行按位与运算，找到任意位为 1 的 divider。再次遍历数组元素，利用divider 和每个元素与运算来进行分组异或得到最终结果。

**求解**：

```typescript
// 哈希计数
function singleNumbers1(nums: number[]): number[] {
  const len = nums?.length;
  // 进行计数
  const countMap: Record<number, number> = {};
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    const count = countMap[element];
    if (count) {
      countMap[element] = count + 1;
    } else {
      countMap[element] = 1;
    }
  }
  // 二次遍历找到出现次数为1的
  const singles: number[] = [];
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (countMap[element] === 1) {
      singles.push(element);
    }
  }
  return singles;
}

// indexOf + lastIndexOf（耗时过长)
function singleNumbers2(nums: number[]): number[] {
  const len = nums?.length;
  const singles: number[] = [];
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (nums.indexOf(element) === nums.lastIndexOf(element)) {
      // 首次出现与最后一次出现的下标相同
      singles.push(element);
    }
  }
  return singles;
}

// 异或运算
function singleNumbers3(nums: number[]): number[] {
  const len = nums?.length;
  // 对所有数字进行异或，得到这两个不同数字的异或结果
  let singlesXor = 0;
  for (let i = 0; i < len; i++) {
    singlesXor = singlesXor ^ nums[i];
  }
  if (singlesXor === 0) return [];
  // 将异或结果与 1 依次进行按位与运算，找到任意位为 1 的 divider
  let divider = 1;
  while ((singlesXor & divider) === 0) {
    divider = divider << 1;
  }
  let first = 0;
  let second = 0;
  // 与 divider 进行与运算，进行分组,
  // 相同数字在 divider 中 为 1的那一位 是相同的，肯定分在同一组
  // 不同的那两个数字，由于异或结果 singleXor 在 divider 为 1 的位置也为 1，表示这个位置处两个数字必是不同的 0 和 1
  // 如此一来，与 divider 与运算的结果必然不同而分在不同的组
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if ((element & divider) === 0) {
      first = first ^ element;
    } else {
      second = second ^ element;
    }
  }
  return [first, second];
}
```

#### 10. 数组中重复的数字

**题目描述**：在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

**分析**：

**哈希计数**，统计元素出现次数，在统计的过程中，如果哈希表中已经存在该元素则说明重复。

**indexOf + lastIndexOf**，遍历数组，找到首次出现和最后一次出现不同的元素。

**数组原地交换**，数字范围在 0～n-1，且数组长度为 n, 说明不重复的数字均可以在等于下标的位置上，遍历数组将不等于下标的元素a与以该元素值a作为下标的元素值b进行对比，若相等，说明该元素值a重复，否则交换两个元素值再寻找以b为下标的元素值c进行对比，直到原a位置的元素等于下标。

**集合**，遍历数组将集合中没有的元素放入集合中，若集合中已经存在该元素，说明重复。

**求解**：

```typescript
// 哈希计数
function findRepeatNumber1(nums: number[]): number {
  const len = nums?.length;
  // 进行计数
  const countMap: Record<number, number> = {};
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    const count = countMap[element];
    if (count) {
      return element;
    } else {
      countMap[element] = 1;
    }
  }
  return NaN;
}

// indexOf + lastIndexOf
function findRepeatNumber2(nums: number[]): number {
  const len = nums?.length;
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (nums.indexOf(element) !== nums.lastIndexOf(element)) {
      return element;
    }
  }
  return NaN;
}

// 数组原地交换
function findRepeatNumber3(nums: number[]): number {
  const len = nums?.length;
  for (let i = 0; i < len; i++) {
    // 如果 0 ~ n -1 的数字都只出现一次，那么排序后就会满足 element === i
    // element !== i 说明可能是重复的数字，
    while (nums[i] !== i) {
      const element = nums[i];
      const target = nums[element]; // 而当前数字应该存在的位置所对应的元素值
      if (element === target) {
        // 相等说明一定重复
        return element;
      } else {
        // 不等，交换, 直到应该存在的位置所对应的元素值也放到正确位置
        [nums[i], nums[element]] = [nums[element], nums[i]];
      }
    }
  }
  return NaN;
}

// 集合
function findRepeatNumber4(nums: number[]): number {
  const len = nums?.length;
  const set = new Set();
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (set.has(element)) {
      // 集合中存在该元素
      return element;
    } else {
      // 不存在，则加进去
      set.add(element);
    }
  }
  return NaN;
}
```

#### 11. 构建乘积数组

**题目描述**：给定一个数组 A[0,1,…,n-1]，请构建一个数组 B[0,1,…,n-1]，其中 B[i] 的值是数组 A 中除了下标 i 以外的元素的积, 即 B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]。不能使用除法。

**分析**：

**暴力法**，直接两层循环遍历，内层循环计算累乘并排除当前元素（超时）。

**两次遍历（前 -> 后 + 后 -> 前）法**，先遍历从前往后一次数组，计算当前元素之前的累乘放到目标数组对应位置；再从后往前遍历数组用一个变量存储计算当前元素之后的累乘，并将其与目标数组对应位置相乘即可。

**求解**：

```typescript
// 暴力法(超时)
function constructArr1(a: number[]): number[] {
  const len = a?.length;
  const b = new Array(len).fill(1);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i !== j) {
        b[i] = b[i] * a[j];
      }
    }
  }
  return b;
}

// 两次遍历（前 -> 后 + 后 -> 前）法
function constructArr2(a: number[]): number[] {
  const len = a?.length;
  const b = new Array(len).fill(1);
  // 首次从前向后遍历，计算 i 之前的累积  b[i] = b[i-1] * a[i-1] （b[i-1]不包括 a[i-1])
  for (let i = 1; i < len; i++) {
    b[i] = b[i - 1] * a[i - 1];
  }
  let multiply = 1; // 用于存储 i 之后的累积
  // 二次从后向前遍历，计算 i 之后的乘积 b[i] = b[i] * a[i+1] * a[i+2] *... * a[n - 1];
  for (let i = len - 2; i >= 0; i--) {
    multiply = multiply * a[i + 1];
    b[i] = b[i] * multiply;
  }
  return b;
}
```

#### 12. 顺时针打印矩阵

**题目描述**：输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

**分析**：

**分层遍历**，每层按从左到右，从上到下，从右到左，从下到上进行遍历打印。从 0 层开始，每打印完一层行和列均减去 2，因此层数 * 2 应该同时小于行数与列数，注意打印到最后一层，如果只剩下一行，则不需要从右到左，同理，只剩下一列，则不需要从下到上。

**移除首行 + 变相转置（向左翻转）**，先将矩阵的第一行打印，对剩下的矩阵进行向左翻转（变相转置），依次打印翻转后的第一行，直到矩阵为空。

**求解**：

```typescript
// 按层遍历
function spiralOrder1(matrix: number[][]): number[] {
  const row = matrix?.length;
  const col = matrix?.[0]?.length;
  let layer = 0;
  const printResult: number[] = [];
  while (layer * 2 < row && layer * 2 < col) {
    // 每遍历一次，行和列均减去了2，
    const endRowIndex = row - 1 - layer;
    const endColIndex = col - 1 - layer;
    for (let j = layer; j <= endColIndex; j++) {
      // 从左向右
      printResult.push(matrix[layer][j]);
    }
    for (let i = layer + 1; i <= endRowIndex; i++) {
      // 从上到下
      printResult.push(matrix[i][endColIndex]);
    }
    if (layer < endRowIndex) {
      // 排除只剩下一行，不需要从右到左
      for (let i = endColIndex - 1; i >= layer; i--) {
        // 从右到左
        printResult.push(matrix[endRowIndex][i]);
      }
    }
    if (layer < endColIndex) {
      // 排除只剩下一列，不需要从下到上
      for (let j = endRowIndex - 1; j > layer; j--) {
        // 从下到上
        printResult.push(matrix[j][layer]);
      }
    }
    layer = layer + 1;
  }
  return printResult;
}

// 移除首行 + 变相转置（向左翻转）
function spiralOrder2(matrix: number[][]): number[] {
  const printResult: number[] = [];
  function transpose(matrix: number[][]): number[][] {
    const transposedMatrix: number[][] = [];
    const row = matrix?.length;
    const col = matrix?.[0]?.length;
    for (let j = col - 1; j >= 0; j--) {
      const tmp: number[] = [];
      for (let i = 0; i < row; i++) {
        tmp.push(matrix[i][j]);
      }
      transposedMatrix.push(tmp);
    }
    return transposedMatrix;
  }
  while (matrix.length) {
    const firstRow = matrix.shift() as number[];
    printResult.push(...firstRow); // 每次将第一行放入结果数组中
    matrix = transpose(matrix); // 对矩阵进行变相转置（向左翻转）
  }
  return printResult;
}
```

#### 13. 最小的 K 个数

**题目描述**：输入整数数组 arr ，找出其中最小的 k 个数。例如，输入 4、5、1、6、2、7、3、8 这 8 个数字，则最小的 4 个数字是 1、2、3、4。

**分析**：

**排序法**，排序后取前 k 个。

**分区法**，以 k 为界限，遍历后半部分元素，若当前元素大于前 k 个元素中的最大值 max ，当前元素替换掉最大值 max。

**大根堆法**，维护一个 k 个大小的大根堆，现将前 k 个元素入堆，然后遍历其余元素，若当前元素小于堆顶，就将堆顶元素弹出，当前元素入堆即可（堆的实现参考 1.8.2 设计堆）。

**求解**：

```typescript
// 排序法
function getLeastNumbers1(arr: number[], k: number): number[] {
  arr.sort((a, b) => a - b);
  return arr.slice(0, k);
}

// 分区法
function getLeastNumbers2(arr: number[], k: number): number[] {
  const len = arr.length;
  // 数组长度不大于 k，直接输出该数组
  if (len <= k) return arr;
  const indexOfMax = (arr: number[]): number => arr.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0);
  const help = arr.slice(0, k);
  // k 个元素中最大元素的下标和值
  let maxIndex = indexOfMax(help);
  let max = help[maxIndex];
  for (let i = k; i < len; i++) {
    if (arr[i] < max) {
      // 当前元素比堆中最大元素更小，替换掉前k个元素中的最大元素
      help[maxIndex] = arr[i];
      maxIndex = indexOfMax(help);
      max = help[maxIndex];
    }
  }
  return help;
}

// 大根堆法
function getLeastNumbers3(arr: number[], k: number): number[] {
  const len = arr.length;
  // 数组长度不大于 k，直接输出该数组
  if (len <= k) return arr;
  if (k === 0) return [];
  const res: number[] = [];
  const heap = new Heap(); // 大根堆
  for (let i = 0; i < len; i++) {
    const element = arr[i];
    if (i < k) {
      heap.insert(element);
    } else if (element < heap.top()) {
      heap.delete();
      heap.insert(element);
    }
  }
  for (let i = 0; i < k; ++i) {
    res.push(heap.delete());
  }
  return res;
}
```

#### 14. 和为S的两个数字

**题目描述**：输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。

**分析**：

**哈希法（set，对象，map）**，一次遍历数组，哈希中若不存在目标值与当前元素的差值，则将其加入哈希，否则返回即可。

**双指针法**，由于数组递增有序，可使用首尾指针向中间移动，如果相等则返回，否则分情况向中间移动指针——小于目标值移动首指针，否则移动右指针。

**二分查找**，遍历元素，计算目标值与当前元素的差值，在该元素右侧二分查找是否存在即可。假如使用 indexOf （顺序遍历）进行查找会超时。

**求解**：

```typescript
// 哈希表 或者 set
function twoSum1(nums: number[], target: number): number[] {
  const len = nums?.length;
  const res: number[] = [];
  // 递增排序的数组，不存在相同元素，哈希表存储（元素，下标）
  const hash = new Map<number, number>(); // 可以使用 const hash = {} const set = new Set<number>();
  // 遍历元素，找到和为 target 的元素
  // i < len 考虑到 nums 非数组或长度小于2 的情况
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    const sub = target - element;
    // 由于遍历时加入存储中的是 i 之前的元素，自然排出当前元素。
    if (hash.has(sub)) {
      // 可以使用 set.has(sub) 或  hash[sub] !== undefined (考虑到差值是0)
      res.push(element, sub);
      return res;
    }
    // 设置为(数组元素， i)
    hash.set(element, i); // 可以 集合 set.add(element);  或者 对象 hash[element] = i;
  }
  return res;
}

// 双指针
function twoSum3(nums: number[], target: number): number[] {
  const res: number[] = [];
  let left = 0;
  let right = nums?.length - 1; // 长度只访问一次，没必要缓存
  // 递增排序，计算首尾指针指向元素之和，如果相等则返回，否则分情况向中间移动指针
  // left < right 可以考虑到 nums 非数组或长度小于2 的情况
  while (left < right) {
    const leftNum = nums[left];
    const rightNum = nums[right];
    const sum = leftNum + rightNum;
    if (sum === target) {
      res.push(leftNum, rightNum);
      break;
    } else if (sum < target) {
      // 小于目标值，说明需要增加加数的值，移动左指针
      left = left + 1;
    } else {
      // 大于目标值，说明需要减少加数的值，移动右指针
      right = right - 1;
    }
  }
  return res;
}

// 二分查找差值
function twoSum4(nums: number[], target: number): number[] {
  const len = nums?.length;
  const res: number[] = [];

  function binarySearch(left: number, right: number, target: number) {
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (nums[mid] > target) {
        right = mid - 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        return mid;
      }
    }
    return -1;
  }

  // i < len 考虑到 nums 非数组或长度小于2 的情况
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    const sub = target - nums[i];
    if (binarySearch(i + 1, len - 1, sub) !== -1) {
      // 在当前元素右侧寻找即可
      res.push(element, sub);
      return res;
    }
  }
  return res;
}

// 遍历 + indexOf (超时，因为 indexOf 是 O（n）)
function twoSum5(nums: number[], target: number): number[] {
  const len = nums?.length;
  const res: number[] = [];
  // i < len 考虑到 nums 非数组或长度小于2 的情况
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    const sub = target - nums[i];
    const indexOfSub = nums.indexOf(sub);
    if (![-1, i].includes(indexOfSub)) {
      // 存在且不等于当前下标
      res.push(element, sub);
      return res;
    }
  }
  return res;
}
```

#### 15. 扑克牌中的顺子

**题目描述**：从若干副扑克牌中随机抽 5 张牌，判断是不是一个顺子，即这 5 张牌是不是连续的。2～10 为数字本身，A 为 1，J 为 11，Q 为 12，K 为 13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

**分析**：需要保证 除 0 以外的最大值与最小值差值需要小于 5 且不能有非 0 以外的重复元素。

**Set +遍历**，遍历数组，遇到 0 跳过，若 Set 中存在元素，不是顺子，否则加入集合中，求集合中的最大值最小值之差。

**排序 + 遍历**，排序后遍历数组，统计大小王的个数即0的个数，计算最大值（最后一个元素）与最小值（第一个非 0 元素）之差。

**遍历**，遍历统计 0 的个数，超过3个0 说明一定是顺子，若当前元素不是0，更新最大最小值，若最大值与最小值差值大于等于 5 或者后续元素存在重复与当前元素相同，则不是顺子。 

**求解**：

```typescript
// 排序 + 遍历
function isStraight1(nums: number[]): boolean {
  const len = nums?.length;
  nums.sort((a, b) => a - b);
  const max = nums[len - 1];
  // 记录大小王的数量
  let joker = 0;
  for (let i = 0; i < len; i++) {
    const current = nums[i];
    const next = nums[i + 1];
    if (current === 0) {
      // 计算大小王的个数
      joker = joker + 1;
    } else if (current === next) {
      // 重复且非0, 不是顺子
      return false;
    }
  }
  const min = nums[joker];
  return max - min < 5; // 最差情况是全为 0 或者 4个 0 或者 少于4 个 0时差值不能大余5
}

// set + 遍历
function isStraight2(nums: number[]): boolean {
  const len = nums?.length;
  const set = new Set<number>();
  for (let i = 0; i < len; i++) {
    const current = nums[i];
    if (current === 0) continue;
    // 重复
    if (set.has(current)) return false;
    set.add(current);
  }
  return Math.max(...set) - Math.min(...set) < 5;
}

// 只遍历
function isStraight3(nums: number[]): boolean {
  const len = nums?.length;
  let joker = 0;
  let max = 0;
  let min = 14;
  for (let i = 0; i < len; i++) {
    const current = nums[i];
    if (current === 0) {
      joker = joker + 1;
      if (joker > 3) return true;
    } else {
      max = Math.max(current, max);
      min = Math.min(current, min);
      // 非0重复 或者 最大最小值之差大于等于5
      if (nums.lastIndexOf(current) > i || max - min >= 5) return false;
    }
  }
  return true;
}
```

#### 16. 滑动窗口的最大值

**题目描述**：给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。

**分析**：

**遍历**，依次遍历每个滑动窗口，其中最后一个窗口的起始下标为 len - k，使用 Math.max 计算每个窗口的最大值即可（可能超时）。

**单调递减双端队列**，维护一个初始为空的单调递减队列，其值为滑动窗口中元素的下标；首先，如果队头下标在滑动窗口之外，则对头出队；否则将当前元素与队尾元素不断比较大小，若当前元素更大，则队尾出队，而后再将当前元素下标加入队列。最后当遍历到 k - 1 时，开始获取队头元素作为当前滑动窗口的最大值。

**求解**：

```typescript
// 遍历
function maxSlidingWindow1(nums: number[], k: number): number[] {
  const len = nums?.length;
  if (len === 0 || k < 1) return []; // 滑动窗口小于1 或 数组为空
  if (k === 1) return nums; // 滑动窗口等于1
  if (k >= len) return [Math.max(...nums)]; // 滑动窗口大于等于数组长度
  const res: number[] = [];
  for (let i = 0; i <= len - k; i++) {
    const window = nums.slice(i, i + k);
    res.push(Math.max(...window));
  }
  return res;
}

// 单掉队列(双端队列)
function maxSlidingWindow2(nums: number[], k: number): number[] {
  const len = nums?.length;
  if (len === 0 || k < 1) return []; // 滑动窗口小于1 或 数组为空
  if (k === 1) return nums; // 滑动窗口等于1
  if (k >= len) return [Math.max(...nums)]; // 滑动窗口大于等于数组长度
  const res: number[] = [];
  // 单调递减队列，存放的数组元素下标
  const queue: number[] = [];
  for (let i = 0; i < len; i++) {
    // 对头元素如果不是滑动窗口之内的需要弹出 （滑动窗口范围是 [i - k + 1, i] => queue[0] < i - k + 1 => queue[0] <= i - k)
    while (queue.length && queue[0] <= i - k) {
      queue.shift();
    }
    const element = nums[i];
    // 将队尾小于当前值的弹出，保证单调性
    while (queue.length && nums[queue[queue.length - 1]] <= element) {
      queue.pop();
    }
    queue.push(i); // 加入当前元素的下标
    if (i >= k - 1) {
      // 当遍历到 k - 1，加入最大元素(队头)
      res.push(nums[queue[0]]);
    }
  }
  return res;
}
```

## 字符串

字符串是由零个或多个字符组成的有限序列。用成对双引号或成对单引号的形式存在。

### 字符串基本操作

与数组类似，通过下标访问其中字符。

字符串可能是可变（C++），也可能是不可变的（python，JavaScript），不可变意味着初始化后不能修改其中字符。对于不可变的字符串，连接操作意味着首先为新字符串分配足够的空间，复制旧字符串中的内容并附加到新字符串，时间复杂度为 O(N)。

### 算法题

#### 1. 字符串的排列

**题目描述**：输入一个字符串，打印出该字符串中字符的所有排列。你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。

**分析**：

如输入字符串abc,则打印出由字符a,b,c所能排列出来的所有字符串[abc, acb, bac, bca, cab, cba]。实现思路是原问题划分为小的子问题，即遍历每个字母，该字母依次连接除该字母的子字符串的排列结果，比如：‘a’ +  [‘ bc’,  ‘cb’]。
子字符串只有一个字母的时候直接返回当前字母[str]。

**求解**：

```typescript
// 递归 + set去重
function permutation(s: string): string[] {
  const len = s?.length;
  const res: string[] = [];
  // 长度为 1 时， 排列为本身
  if (len === 1) return [s];
  for (let i = 0; i < len; i++) {
    // 子串
    const subStr = s.slice(0, i) + s.slice(i + 1);
    // 子串的全排列结果
    const subRes = permutation(subStr);
    const subResLen = subRes.length;
    for (let j = 0; j < subResLen; j++) {
      subRes[j] = subRes[j] + s[i];
    }
    res.push(...subRes);
  }
  return [...new Set(res)];
}
```

#### 2. 字符串的空格替换

**题目描述**：实现一个 replaceSpace 函数，替换给定字符串中的空格为“%20”。例如，当字符串为’We Are Happy’.则经过替换之后的字符串为’We%20Are%20Happy’。

**分析**：对于一个字符串，空格可能出现在开头，末尾，或者不含空格的子串之间，最直观的方法是遍历字符串，遇到空格即替换，由于字符串在 JavaScript 中属于不可变，需使用新字符串进行连接操作。

**正则表达式方法**：str.replace(pattern, replaceStr)。

**数组 map 方法**：
1. 原字符串变成数组  
2. map数组替换空格  
3. 替换后数组变成字符串。

**双指针算法**：
1. 遍历原字符串计算出替换后的字符串长度，并生成该长度数组 newStrArr；
2. 两个指针：i 指向原字符串， j 指向新字符串；
3. str[i] 非空格即将 str[i++] 放入 newStrArr[j++]; str[i] 是空格，将’%20’三个字符依次放入 newStrArr[j++]；
4. 数组变成字符串 newStrArr.join('')。从过程看，方法和**数组 map** 类似。

**求解**：

```typescript
// 正则表达式
function replaceSpace1(s: string): string {
  return s.replace(/ /g /* new RegExp(' ', 'g') */, '%20');
}

// 暴力法
function replaceSpace2(s: string): string {
  let res = '';
  const len = s.length;
  for (let i = 0; i < len; i += 1) {
    res += s[i] === ' ' ? '%20' : s[i];
  }
  return res;
}

// split + map + join
function replaceSpace3(s: string): string {
  return s
    .split('')
    .map((item) => {
      return item === ' ' ? '%20' : item;
    })
    .join('');
}
```

#### 3. 第一个只出现一次的字符

**题目描述**：在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

**分析**：

**哈希计数**，首先遍历一遍字符串，若哈希中存在该字符则设置为false，说明重复，否则设置为true。然后可以二次遍历字符，若哈希值为true即可，或者map会记住插入顺序，遍历map找到值为true的即可。

**indexOf + lastIndexOf**，遍历字符串，当前字符首次出现和最后一次出现的位置相同的即为第一个只出现一次的字符。

**求解**：

<<< ../../src/字符串/第一个只出现一次的字符/firstUniqChar.ts#docs

#### 4. 左旋字符串

**题目描述**：字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字 2，该函数将返回左旋转两位得到的结果"cdefgab"。

**分析**：

**拼接法**，将 [n,] 与 [0, n - 1] 的字符串拼接起来即可，n 超出 字符串长度 即 [0, n - 1]。

**求解**：

<<< ../../src\字符串\左旋字符串\reverseLeftWords.ts#docs

#### 5. 翻转单词顺序

**题目描述**：输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

**分析**：

**trim + split + reverse + join**，trim 去掉首尾空格，用单个或多个空格进行split划分为单词数组，随后进行 reverse 翻转，最后使用 join以空格拼接, 其中 reverse 如果自己实现，可以使用双指针首尾交换。而 join, split，trim 都是遍历即可。

**遍历法**，首先去掉首尾空格再遍历字符串，若当前字符是空格说明单词边界，更新反转字符串，遍历结束后再更新一次反转字符串即可。

**求解**：

<<< ../../src\字符串\翻转单词顺序\reversWords.ts#docs

#### 6. 把字符串转换成数字

**题目描述**：写一个函数 StrToInt，实现把字符串转换成整数这个功能。不能使用 atoi 或者其他类似的库函数。 首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。在任何情况下，若函数不能进行有效的转换时，请返回 0。说明：假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−2^31,  2^31 − 1]。如果数值超过这个范围，请返回  INT_MAX (231 − 1) 或 INT_MIN (−231) 。

**分析**：

**遍历法**，首先取代首尾空格，以第一个不为空的字符是否为 + 、 - 确定符号，遍历余下字符串，若遇到非数字跳出循环，否则累计计算数字值，当大于 Math.pow(2, 31) - 1 时返回边界值即可。

**求解**：

<<< ../../src\字符串\把字符串转换成整数\strToInt.ts#docs

#### 7. 正则表达匹配

**题目描述**：请实现一个函数用来匹配包含'. '和'\*'的正则表达式。模式中的字符'.'表示任意一个字符，而'\*'表示它前面的字符可以出现任意次（含0次）。在本题中，匹配是指字符串的所有字符匹配整个模式。例如，字符串"aaa"与模式"a.a"和"ab\*ac\*a"匹配，但与"aa.a"和"ab*a"均不匹配。

**分析**：

**正则**，由于匹配是指字符串的所有字符匹配整个模式，所以正则表达式应该将模式串使用 ^ $来限制即可。

**递归**， 
1. 若模式字符串为空，是否匹配取决于原字符串是否为空；
2. 若模式字符串前两个为 字符 x + *，有以下几种情况：
    1. 匹配字符x 0 次，则是否匹配由 * 后面的子模式决定；
    2. 匹配字符x 多次，则由模式字符串中首个字符与字符串中的首个字符是否匹配（即该模式字符为 . 或者两字符相等）且 字符串除首个字符以外的后续字串与模式字符串是否匹配决定；
3. 模式字符串前两个不是字符 x + * 时，由模式字符串中首个字符与字符串中的首个字符是否匹配（即该模式字符为 . 或者两字符相等）且字符串除首个字符以外的后续字串与模式字符串除首个字符以外的模式是否匹配决定；

**求解**：

<<< ../../src\字符串\正则表达式匹配\isMatch.ts#docs

#### 8. 表示数值的字符串

**题目描述**：请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。 数值（按顺序）可以分成以下几个部分：若干空格 + 一个小数或者整数 + （可选）一个'e'或'E'，后面跟着一个整数 + 若干空格。其中，小数（按顺序）可以分成以下几个部分：（可选）一个符号字符（'+' 或 '-'） + 至少一位数字，后面跟着一个点 '.' 或者 至少一位数字，后面跟着一个点 '.' ，后面再跟着至少一位数字 或者 一个点 '.' ，后面跟着至少一位数字
。整数（按顺序）可以分成以下几个部分：（可选）一个符号字符（'+' 或 '-'）+ 至少一位数字。部分数值列举如下：["+100", "5e2", "-123", "3.1416", "-1E-16", "0123"]。部分非数值列举如下：["12e", "1a3.14", "1.2.3", "+-5", "12e+5.4"]。

**分析**：

**trim + Number + isNaN**, 去掉首位空格，若字符串为空，或者是一些无穷大数值字符串，则不是数值，否则用isNaN判断是否为数值。

**正则**，使用正则表达式判断是否为数值：一个或多个空格开头，（+ | -），数字（.一个或多个数字）| .数字，(e | E (+ | -) 数字)，一个或多个空格结尾。

**遍历**，去掉首位空格，分为以下几种情况，若当前字符为 e | E，则前面不能有 e | E，而且之前的必须满足是小数或者整数，小数点前面不能有 e | E 或 小数点，符号只能出现在首位和 e 后面的首位置。

**求解**：

<<< ../../src\字符串\表示数值的字符串\isNumber.ts#docs

#### 9. 字符串中重复次数最多的字符

**题目描述**：输入一个字符串，打印出该字符串中出现次数最多的字符和次数。

**分析**：

**哈希计数**，首先遍历字符串，统计所有字符的出现次数，然后再遍历哈希，将其中等于最大出现次数的字符放入结果数组中。

**求解**：

<<< ../../src\字符串\字符串中重复次数最多的字符\mostRepeatedChar.ts#docs

#### 10. Hex颜色值转 rgb

**题目描述**：hex 颜色值时一个以#开头，后面跟着 6 位或 3 位 16 进制数字的字符串。写一个函数将 hex 颜色值转换为 rgb() 形式的颜色值。 给的字符串不合法，则返回原始字符串。

**分析**：首先使用正则判断是否时一个 hex 颜色值，如果不是直接返回，否则使用 parseInt(str, radix = 16)计算 # 后面值存放在数组中，根据数组长度是 3 或 6 计算 rgb 值即可。

**求解**：

<<< ../../src\字符串\16进制颜色转rgb\hex2rgb.ts#docs

#### 11. 无重复字符的最长子串

**题目描述**：给定一个字符串 s ，请你找出其中不含有重复字符的最长子串的长度。

**分析**：

**滑动窗口法**，遍历字符串，判断当前字符是否在子串中，如果不在，将当前字符添加到子串末尾； 如果存在，将子串更新为存在所在位置后面的加上当前字符；更新最长子串值。

**求解**：

<<< ../../src\字符串\无重复字符的最长子串\lengthOfLongestSubstring.ts#docs

#### 11. 千分位分隔数字

**题目描述**：给定一个浮点数，使用指定分隔符对其进行千分位分隔。

**分析**：

**字符串截取拼接法**，首先考虑数字的有效性，其次是将数字转化为字符串，获取使用变量存储符号，以及使用结果变量存储小数部分，更新字符串为无符号的整数部分。每三位循环截取添加分隔符，循环退出后将三个部分（符号、剩余不大于 3 的部分、循环结果）拼接即可。

**正则表达式法**，使用前瞻断言?=，正则表达式为 `(?=\B(\\d{${every}})+$)`，表示在后面是"非单词边界的 every 个数字结尾出现一次或多次"匹配空字符，然后利用 string.prototype.replace 将匹配到的空字符替换为分隔符即可。

**求解**：

<<< ../../src\字符串\千分位分隔数字\splitNum.ts#docs

## 链表

链表是线性数据结构（数据元素之间存在着“一对一”关系），链表中的每个元素是一个包含数据 data 和引用字段的对象，引用字段只有 next 为单向链表，同时有 prev 和 next 为双向链表。

### 链表基本操作

**链表读取第 i 个节点或查找指定值的节点**，均需要从头遍历，时间复杂度为 O(n)。

**在不考虑查找节点的过程的情况下，更新（替换 data），插入（新节点 next 指针指向插入位置节点，前一节点的 next 指针指向新节点）、删除（前一节点 next 指针指向下一节点，当前节点置空）**，时间复杂度均为 O(1)。

### 设计链表

设计单向链表的实现。单链表中的节点应该具有两个属性：val 和 next。val 是当前节点的值，next 是指向下一个节点的指针/引用。假设链表中的所有节点都是 0 ~ size - 1 的。

::: code-group

<<< ../../src\链表\设计链表\linkList.ts#docs[linkList.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

### 算法题

#### 1. 从尾到头打印链表

**题目描述**：输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

**分析**：

**遍历 + 反转**，从尾到头将链表节点值打印成数组 array，比如 1 -> 2 -> 3 -> 4 -> 5 -> null 打印为 [5, 4, 3, 2, 1]，遍历节点并将节点值依次放入数组中，直到遍历完成，最后反转数组即可。也可以利用栈后进先出的特点，将节点从头到尾一次入栈，然后再依次出栈即可。

**求解**：

::: code-group

<<< ../../src\链表\从尾到头打印链表\reversePrint.ts#docs[reversePrint.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

#### 2. 链表倒数第 k 个节点

**题目描述**：输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。
例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

**分析**：

**两次循环法**，倒数第 k 个节点，即顺数第 length - k + 1 个节点，由于是单链表，没有链表长度信息，因此第一步遍历链表，计算出链表长度。第二步，遍历链表到第 length - k + 1 个节点（index = length - k），需要遍历 n + n - k + 1 步。

**快慢指针法**，快指针先走 k 步，然后快慢指针以相同的速度移动，直到快指针到 null，只需要遍历 n 步（因为快指针走了 n 步）。

**求解**：

::: code-group

<<< ../../src\链表\链表中倒数第k个节点\getKthFromEnd.ts#docs[getKthFromEnd.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

#### 3. 反转链表

**题目描述**： 定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

**分析**：

**原地反转**，定义前驱节点，当前节点，遍历链表，然后缓存后驱节点，将当前节点链接到前驱节 3 点，然后先更新前驱节点为当前节点，再更新当前节点为后驱节点，直到遍历结束返回前驱节点即可。

**递归**，假设链表的其余部分已经被反转，现在是要反转前面的部分，则需要将当前节点的下一节点的next指针指向当前节点，然后将当前节点的next 置为null;

**求解**：

::: code-group

<<< ../../src\链表\反转链表\reverseList.ts#docs[reverseList.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

#### 4. 合并两个排序链表

**题目描述**：输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

**分析**：

**递归法**，对比节点值的大小，小的作为头节点，下一个节点是除去小的节点的链表和另一链表的合并，边界条件是其中一个链表为空，则直接返回另一个链表即可。

**迭代法**，首先，若其中一个链表为空，则直接返回另一个链表即可，否则初始化一个虚假的头结点，当前节点初始化为虚假节点，不断对比节点值大小，将小节点连接在新链表后面，然后更新新链表的尾节点。直到其中一个链表遍历结束，将另一个链表直接链接在末尾。

**求解**：

::: code-group

<<< ../../src\链表\合并两个排序的链表\mergeTwoLists.ts#docs[mergeTwoLists.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

#### 5. 复杂链表的复制

**题目描述**：<font color='red'>输入一个复杂链表（每个节点中有节点值，以及两个指针，一个指向下一个节点，另一个特殊指针 random 指向一个随机节点），</font>请对此链表进行深拷贝，并返回拷贝后的头结点。（注意，输出结果中请不要返回参数中的节点引用，否则判题程序会直接返回空）。

**分析**：

**三次遍历+拆分**，首先对复杂链表进行遍历，在每个节点后面复制一个与当前节点相同的节点（先不理会 random 指针），即 1 -> 2 -> 3 -> 4 -> 5 -> null 变成 1 -> 1 -> 2 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5 -> 5 -> null；然后是再遍历一次原链表（即遍历步长为 2），将 random 指针进行复制；最后再遍历一次，将原链表的节点指向原来的下一个节点，复制链表的节点指向下一个复制的节点，分离成原链表和复制链表，注意判断最后一个复制节点是否为 null。

**两次遍历+哈希**，可以在初次遍历的时候用哈希保存原节点到复制节点（只复制值）的映射，二次遍历时更新复制节点的 next 和 random 指针为与原节点 next 和 random 指针对应的复制节点即可。

**求解**：

::: code-group

<<< ../../src\链表\复杂链表的复制\copyRandomList.ts#docs[copyRandomList.ts]

<<< ../../src\链表\设计链表\randomLinkNode.ts#docs[randomLinkNode.ts]

:::

#### 6. 删除链表中的重复节点

**题目描述**：在一个排序的链表中，存在重复的结点，请删除该链表中重复的结点，分为重复结点保留（链表 1->2->3->3->4->4->5 处理后为 1->2->3->4->5）和重复的结点不保留（链表 1->2->3->3->4->4->5 处理后为 1->2->5）两种情况，返回链表头指针。

**分析**：

**对于重复节点保留的情况**，从头节点开始遍历，判断当前节点下一个节点是否等于当前节点，如果相等，则当前节点的下一节点为下下节点，直到不等于或者当前节点下一节点为空。

**对于重复节点不保留的情况**，考虑到头节点可能重复，在链表前添加一个虚节点，从该节点开始遍历，当 next 节点和 next.next 节点不为空时，若 next 节点和 next.next 节点的值相等，记录该值，不断将当前节点的 next 指向为 next.next节点，直到 next 节点值不等于该值或 next 为空。

**求解**：

::: code-group

<<< ../../src\链表\删除链表中重复的结点\deleteDuplication.ts#docs[copyRandomList.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

#### 7. 两个链表的第一个公共节点

**题目描述**：输入两个链表，找出它们的第一个公共结点。

**分析**：

**遍历法**，两个链表的公共节点是指从公共节点开始的所有节点是两个链表的共有部分（节点的存储地址相同，因此判断节点对象是否相等）。既然公共节点及其之后的节点完全相同，即不同的是公共节点之前的部分，也就可能存在一个长度差 diff，通过遍历两个链表的长度可以求出 diff，让长的链表先遍历 diff 个节点，以此开始的两个链表的长度相同，那么当遍历到相同节点即第一个公共节点。

**求解**：

::: code-group

<<< ../../src\链表\两个链表的第一个公共节点\findFirstCommonNode.ts#docs[findFirstCommonNode.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::

#### 8. 链表中环的入口节点

**题目描述**：给定一个链表，返回链表开始入环的第一个节点。 从链表的头节点开始沿着 next 指针进入环的第一个节点为环的入口节点。如果链表无环，则返回 null。为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。说明：不允许修改给定的链表。

**分析**：

**哈希法**，遍历链表，将节点不存在 map 中，放入 map 中，若已存在说明是环的入口节点，返回该节点，若遍历到链表末尾 null 若还无环，返回 null。

**快慢指针法**，遍历链表，快指针走两步，慢指针每次走一步，快慢指针必定在环内相遇，此时快指针走过 a + n(b + c) + b = a + (n+1)b + nc， 而慢指针走过的路程 a + b (因为一定还没走完环的第一圈)，两者满足 a + (n+1)b + nc = 2(a + b)， 所以 a = c + (n − 1)(b + c)，即链表头结点到环入口节点的距离 = 相遇点到环入口距离 + （n - 1）* 环，只需要让两新指针分别从头结点和相遇节点单步出发，直到相遇即可。

**求解**：

::: code-group

<<< ../../src\链表\链表中环的入口节点\detectCycle.ts#docs[detectCycle.ts]

<<< ../../src\链表\设计链表\linkNode.ts#docs[linkNode.ts]

:::
