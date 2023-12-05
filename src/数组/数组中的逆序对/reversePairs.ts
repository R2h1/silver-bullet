/**
 * 题目描述：
 *      在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。
 *  分析：
 *      暴力法，遍历数组元素，与其后的所有元素对比，满足逆序条件统计（超时）。
 *      归并排序法，使用归并排序，在排序过程中，当左子序列的当前元素大于右边子序列当前元素时，此时左子序列当前元素及其后均为逆序对。
 */
// #region docs
// 暴力法(超时)
function reversePairs1(nums: number[]): number {
  let count = 0;
  const len = nums?.length;
  for (let i = 0; i < len; i += 1) {
    const base = nums[i];
    for (let j = i + 1; j < len; j += 1) {
      const compare = nums[j];
      if (compare < base) {
        count += 1;
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
    for (let i = left; i <= right; i += 1) {
      temp[i] = nums[i];
    }
    for (let i = left; i <= right; i += 1) {
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
// #endregion docs
