/**
 * 题目描述：
 *      把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
 *      给你一个可能存在重复元素值的数组 numbers，它原来是一个升序排列的数组，并按上述情形进行了一次旋转。请返回旋转数组的最小元素。
 *  分析：
 *      例如，数组 [3,4,5,1,2] 为 [1,2,3,4,5] 的一次旋转，该数组的最小值为 1。
 *      注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
 *      前一段的元素一定大于等于后一段的元素，因此，最小数字一定是第一段升序元素末尾的下一个元素。
 */
// #region docs
// 暴力解法
function minArray1(numbers: number[]): number {
  const len = numbers?.length;
  if (!len) return NaN;
  for (let i = 1; i < len; i += 1) {
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
      left += 1;
      right -= 1;
    }
  }
  return numbers[left];
}
// #endregion docs
