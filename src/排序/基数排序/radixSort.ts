// #region docs
// 基数排序
function radixSort(nums: number[], radix = 10): number[] {
  const len = nums.length;
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  let significantDigit = 1;
  while ((max - min) / significantDigit >= 1) {
    // 对当前位进行计数排序
    const counter: number[] = [];
    for (let i = 0; i < radix; i += 1) {
      counter[i] = 0;
    }
    // 对当前位进行计数
    for (let i = 0; i < len; i += 1) {
      const index = Math.floor(((nums[i] - min) / significantDigit) % radix);
      counter[index] = counter[index] + 1;
    }
    // 计算累积值
    for (let i = 1; i < radix; i += 1) {
      counter[i] = counter[i] + counter[i - 1];
    }
    const aux = new Array(len);
    for (let i = 0; i < len; i += 1) {
      // 可以简化为 aux[--counter[Math.floor(((nums[i] - min) / significantDigit) % radix)]] = nums[i];
      const counterIndex = Math.floor(((nums[i] - min) / significantDigit) % radix);
      counter[counterIndex] = counter[counterIndex] - 1;
      const index = counter[counterIndex];
      aux[index] = nums[i];
    }
    nums = aux;
    significantDigit *= radix;
  }
  return nums;
}
// #endregion docs
