/**
 * 给定一个能承受最大重量为 bagWeight 的背包，和 m 件物品的价值列表 value 和重量列表 weights
 * 求背包中能包含物品的最大价值
 * @param weights
 * @param bagWeight
 */
// #region docs
function package01(values: number[], weights: number[], bagWeight: number): number {
  // 动态规划问题，状态转移方程：
  // dp[i][j] = Math.max(value[i] + dp[i-1][j - weights[i]], dp[i-1][j]); 前提是 j >= weights[i]
  // 利用滚动数组，优化空间复杂度：dp[j] = Math.max(value[i] + dp[j - weights[i], dp[j])
  // dp[i][j] 表示最大重量为 j 的背包中所能包含的 [0, i]区间内的物品的最大价值。
  const maxValues = new Array(bagWeight + 1).map((_, index) => {
    if (index >= weights[0]) {
      return values[0];
    }
    return 0;
  });
  const m = weights.length;
  for (let i = 1; i < m; i += 1) {
    for (let j = 0; j <= bagWeight; j += 1) {
      if (j >= weights[i]) {
        // 背包的空间足够放下第 i 个物品
        maxValues[j] = Math.max(values[i] + maxValues[j - weights[i]], maxValues[j]);
      }
    }
  }
  return maxValues[bagWeight];
}
// #endregion docs
