// #region docs
// 简单插入排序
function insertSort(nums: number[]): number[] {
  const len = nums.length;
  for (let i = 1; i < len; i += 1) {
    const element = nums[i];
    // 查找插入位置
    let left = 0;
    let right = i - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (element < nums[mid]) {
        // 插入点在左半区
        right = mid - 1;
      } else {
        // 值相同时, 切换到右半区，保证稳定性
        left = mid + 1;
      }
    }
    // 插入位置 left 之后的元素全部后移一位
    for (let j = i; j > left; j -= 1) {
      nums[j] = nums[j - 1];
    }
    nums[left] = element;
  }
  return nums;
}
// #endregion docs
