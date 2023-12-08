// #region docs
// 冒泡排序
function bubbleSort(nums: number[]): number[] {
  const len = nums.length;
  let firstOrderedIndex = len - 1; // 有序区的左边界
  let lastExchangeIndex = 0; // 每一趟最后一次交换的位置；
  for (let i = 0; i < len; i += 1) {
    let isExchange = false;
    for (let j = 0; j < firstOrderedIndex; j += 1) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
        lastExchangeIndex = j; // 发生交换，更新有序去边界
        isExchange = true;
      }
    }
    firstOrderedIndex = lastExchangeIndex;
    if (!isExchange) break; // 若没发生交换，说明一件有序
  }
  return nums;
}
// #endregion docs
