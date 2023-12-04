/**
 * 题目描述：
 *      数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。
 *      你可以假设数组是非空的，并且给定的数组总是存在多数元素（如果不存在，返回NaN)
 *  分析：
 *      排序计数，首先对数组进行排序，遍历记录是否存在超过一半的数字，遇到不同的数字重置出现次数即可。
 *      哈希计数，使用哈希表记录所有数字出现的次数，当遇到超过一半的数字返回即可。
 *      摩尔投票，众数记为 +1，把其他数记为 -1，将它们全部加起来，如果最终的和大于0，说明存在多数，否则不存在。
 */

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
