// #region docs
// 选择排序
function selectSort(nums: number[]): number[] {
  const len = nums.length;
  for (let i = 0; i < len; i += 1) {
    // 从 n - i 个元素中找出最小值
    let minIndex = i; // 初始化最小元素下标为 n - i 个元素 中的第一个
    for (let j = i + 1; j < len; j += 1) {
      if (nums[j] < nums[minIndex]) {
        // 当前元素更小，更新下标
        minIndex = j;
      }
    }
    // 交换
    [nums[i], nums[minIndex]] = [nums[minIndex], nums[i]];
  }
  return nums;
}
// #endregion docs
