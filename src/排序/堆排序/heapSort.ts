// #region docs
// 堆排序
function heapSort(nums: number[]): number[] {
  const len = nums.length;
  // 对非叶子节点下沉进行堆调整
  function heapfiy(nums: number[], index: number, heapSize: number) {
    // 交换节点位置，大顶堆：子节点中的较大者
    let exchange = index * 2 + 1;
    while (exchange < heapSize) {
      const right = index * 2 + 2;
      if (right < heapSize && nums[right] > nums[exchange]) {
        exchange = right;
      }
      if (nums[exchange] <= nums[index]) {
        // 子节点中较大者小于当前节点
        break;
      }
      [nums[index], nums[exchange]] = [nums[exchange], nums[index]];
      index = exchange;
      exchange = index * 2 + 1;
    }
  }
  // 对待排序数组构建具有数组长度的初始大根堆
  for (let i = Math.floor(len / 2) - 1; i > 0; i--) {
    heapfiy(nums, i, len);
  }
  // 第i趟将堆顶元素与倒数第 i 个元素交换，再调整堆顶元素
  for (let i = len - 1; i > 0; i--) {
    [nums[0], nums[i]] = [nums[i], nums[0]];
    heapfiy(nums, 0, i);
  }
  return nums;
}
// #endregion docs
