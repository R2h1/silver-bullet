/**
 * 题目描述：
 *      输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。
 *      要求时间复杂度为O(n)。
 *  分析：
 *      暴力法，直接遍历两遍进行计算，记录所有连续子数组的和来更新最大值。
 *      动态规划（剔除）法，遍历一遍数组，计算到当前数字的子数组的和，如果比当前数字小，说明之前的连续子数组的和为负数，可将其剔除掉，此时记录和为当前数字。
 */
// #region docs
// 暴力法
function maxSubArray1(nums: number[]): number {
  const len = nums?.length;
  let maxSum = nums[0];
  for (let i = 0; i < len; i += 1) {
    let sum = 0;
    for (let j = i; j < len; j += 1) {
      sum += nums[j];
      if (sum > maxSum) {
        maxSum = sum;
      }
    }
  }
  return maxSum;
}

// 优化解法（动态规划）
function maxSubArray2(nums: number[]): number {
  const len = nums?.length;
  let maxSum = nums[0];
  let sum = 0;
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    sum += element;
    // 当前位置之前构成的连续子数组 subNums计算出来的和小于当前元素
    // 说明 subNums 除当前元素的和为负数，可以剔除；
    if (sum <= element) {
      sum = element;
    }
    if (sum > maxSum) {
      maxSum = sum;
    }
  }
  return maxSum;
}

// 优化解法（动态规划）
function maxSubArray3(nums: number[]): number {
  const len = nums.length;
  // 记录到当前位置的子数组的连续子数组的最大和
  const maxSums: number[] = [];
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    if (i === 0) {
      // 单元素的最大和为本身
      maxSums.push(element);
    } else if (maxSums[i - 1] <= 0) {
      // 前一个最大值是非正数，最大值为当前值
      maxSums.push(element);
    } else {
      // 否则最大值 为 前一个最大值 加上当前值
      maxSums.push(maxSums[i - 1] + element);
    }
  }
  return Math.max(...maxSums);
}
// #endregion docs
