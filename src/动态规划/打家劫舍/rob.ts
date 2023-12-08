/**
 * 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，
 * 影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，
 * 如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 * 给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
 * 1 <= nums.length <= 100
 * 0 <= nums[i] <= 400
 * @param nums 代表每个房屋存放金额的非负整数数组
 * @returns 一夜之内能够偷窃到的最高金额
 * @example
 *   rob([1,2,3,1]); // 4
 *   rob([2,7,9,3,1]); // 12
 */
// #region docs
function rob(nums: number[]): number {
  // 动态规划问题，状态转移方程：
  // dp[i] = Math.max(nums[i] + dp[i - 2], dp[i - 1]);
  // dp[1] = Math.max(dp[0], dp[1]);
  // dp[0] = nums[0];
  // dp[i] 表示从[0, i] 区间内房屋能偷窃到的最高金额
  if (!Array.isArray(nums)) {
    throw new TypeError('nums 必须是数组');
  }
  const len = nums.length;
  if (len === 0) {
    throw new TypeError('nums 数组的长度必须不小于1');
  }
  const maxRobMoney = new Array(len);
  for (let i = 0; i < len; i += 1) {
    if (i === 0) {
      maxRobMoney[i] = nums[0];
    } else if (i === 1) {
      maxRobMoney[i] = Math.max(nums[0], nums[1]);
    } else {
      maxRobMoney[i] = Math.max(nums[i] + maxRobMoney[i - 2], maxRobMoney[i - 1]);
    }
  }
  return maxRobMoney[len - 1];
}
// #region docs
