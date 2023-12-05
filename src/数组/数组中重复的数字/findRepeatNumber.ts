/**
 * 题目描述：
 *      在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。
 *  分析：
 *      哈希计数，统计元素出现次数，在统计的过程中，如果哈希表中已经存在该元素则说明重复。
 *      indexOf + lastIndexOf，遍历数组，找到首次出现和最后一次出现不同的元素。
 *      数组原地交换，数字范围在 0～n-1，且数组长度为 n, 说明不重复的数字均可以在等于下标的位置上，遍历数组将不等于下标的元素a与以该元素值a作为下标的元素值b进行对比，若相等，说明该元素值a重复，否则交换两个元素值再寻找以b为下标的元素值c进行对比，直到原a位置的元素等于下标。
 *      集合，遍历数组将集合中没有的元素放入集合中，若集合中已经存在该元素，说明重复。
 */
// #region docs
// 哈希计数
function findRepeatNumber1(nums: number[]): number {
  const len = nums?.length;
  // 进行计数
  const countMap: Record<number, number> = {};
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    const count = countMap[element];
    if (count) {
      return element;
    }
    countMap[element] = 1;
  }
  return NaN;
}

// indexOf + lastIndexOf
function findRepeatNumber2(nums: number[]): number {
  const len = nums?.length;
  for (let i = 0; i < len; i += 1) {
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
  for (let i = 0; i < len; i += 1) {
    // 如果 0 ~ n -1 的数字都只出现一次，那么排序后就会满足 element === i
    // element !== i 说明可能是重复的数字，
    while (nums[i] !== i) {
      const element = nums[i];
      const target = nums[element]; // 而当前数字应该存在的位置所对应的元素值
      if (element === target) {
        // 相等说明一定重复
        return element;
      }
      // 不等，交换, 直到应该存在的位置所对应的元素值也放到正确位置
      [nums[i], nums[element]] = [nums[element], nums[i]];
    }
  }
  return NaN;
}

// 集合
function findRepeatNumber4(nums: number[]): number {
  const len = nums?.length;
  const set = new Set();
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    if (set.has(element)) {
      // 集合中存在该元素
      return element;
    }
    // 不存在，则加进去
    set.add(element);
  }
  return NaN;
}
// #endregion docs
