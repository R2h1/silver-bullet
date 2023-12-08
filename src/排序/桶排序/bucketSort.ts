// #region docs
// 桶排序
function bucketSort(nums: number[]): number[] {
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const bucketCount = nums.length;
  // 桶的间隔 = （最大值 - 最小值）/ 元素个数
  const bucketSize = (max - min) / (bucketCount - 1);
  const buckets: number[][] = new Array(bucketCount);
  for (let i = 0; i < bucketCount; i += 1) {
    buckets[i] = [];
  }
  // 将每个元素放到桶里
  for (let i = 0; i < bucketCount; i += 1) {
    // 计算需要将元素放到哪个桶中，公式为: 当前遍历到的元素值与数组的最小值的差值 / 桶间隔
    buckets[Math.floor((nums[i] - min) / bucketSize)].push(nums[i]);
  }
  // 对每个桶内部进行排序(使用内部算法)
  for (let i = 0; i < bucketCount; i += 1) {
    buckets[i].sort((a, b) => a - b);
  }
  const sortedNums: number[] = [];
  for (let i = 0; i < bucketCount; i += 1) {
    sortedNums.push(...buckets[i]);
  }
  return sortedNums;
}
// #endregion docs
