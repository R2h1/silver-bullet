// #region docs
// 归并排序
function mergeSort(nums: number[]): number[] {
  const len = nums.length;
  // 只有一个元素，说明有序
  if (len < 2) return nums;
  // 划分成两个等长的子区域
  const mid = Math.floor(len / 2);
  // 合并两个有序数组
  function merge(left: number[], right: number[]): number[] {
    // 存放合并后的结果
    const merged: number[] = [];
    // 两个子序列的遍历指针
    let i = 0;
    let j = 0;
    const leftSize = left.length;
    const rightSize = right.length;
    while (i < leftSize && j < rightSize) {
      const leftElement = left[i];
      const rightElement = right[j];
      if (leftElement <= rightElement) {
        merged.push(leftElement);
        i += 1;
      } else {
        merged.push(rightElement);
        j += 1;
      }
    }
    while (i < leftSize) {
      merged.push(left[i]);
      i += 1;
    }
    while (j < rightSize) {
      merged.push(right[j]);
      j += 1;
    }
    return merged;
  }
  return merge(mergeSort(nums.slice(0, mid)), mergeSort(nums.slice(mid)));
}
// #endregion docs
