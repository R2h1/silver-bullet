/**
 * 题目描述：
 *      输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分
 *  分析：
 *      目标是奇数在前，偶数在后。
 *          首先，可以使用一个额外数组，遍历两次原始数据，分别将奇偶元素放入其中，如此可以保证奇偶相对位置不变；
 *          其次，可以采用左右指针向中间移动，左指针偶数，右指针奇数，进行交换；否则左指针移动直到遇到偶数，右指针移动直到遇到奇数；不过无法保证奇偶相对位置不变
 *          最后，可以采用快慢指针法，快指针向前搜索奇数，慢指针搜索偶数位置，不过这样不能保证偶的相对位置；
 */
// #region docs
// 暴力解法(支持)
function exchange1(nums: number[]): number[] {
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < nums.length; i += 1) {
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
      left += 1;
      right -= 1;
      continue;
    }
    while (nums[left] & 1 && left < right) {
      // 左指针是奇数
      left += 1;
    }
    while (!(nums[right] & 1) && left < right) {
      // 右指针是偶数
      right -= 1;
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
      slow += 1;
    }
    fast += 1;
  }
  return nums;
}

export { exchange1, exchange2, exchange3 };
// #endregion docs
