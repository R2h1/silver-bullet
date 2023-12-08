/**
 * 恶魔们抓住了公主并将她关在了地下城 dungeon 的 右下角 。地下城是由 m x n 个房间组成的二维网格。我们英勇的骑士最初被安置在 左上角 的房间里，他必须穿过地下城并通过对抗恶魔来拯救公主。
 * 骑士的初始健康点数为一个正整数。如果他的健康点数在某一时刻降至 0 或以下，他会立即死亡。
 * 有些房间由恶魔守卫，因此骑士在进入这些房间时会失去健康点数（若房间里的值为负整数，则表示骑士将损失健康点数）；其他房间要么是空的（房间里的值为 0），要么包含增加骑士健康点数的魔法球（若房间里的值为正整数，则表示骑士将增加健康点数）。
 * 为了尽快解救公主，骑士决定每次只 向右 或 向下 移动一步。
 * 返回确保骑士能够拯救到公主所需的最低初始健康点数。
 * 注意：任何房间都可能对骑士的健康点数造成威胁，也可能增加骑士的健康点数，包括骑士进入的左上角房间以及公主被监禁的右下角房间。
 * m = dungeon.length
 * n = dungeon[i].length
 * 1 <= m, n <= 200
 * -1000 <= dungeon[i][j] <= 1000
 * @param dungeon
 * @returns 最低初始健康点数
 * @example
 *   calculateMinimumHP([[-2,-3,3],[-5,-10,1],[10,30,-5]]); // 7
 *   calculateMinimumHP([[0]]); // 1
 */
// #region docs
import isMatrix from '../最小路径和/isMatrix';

function calculateMinimumHP(dungeon: number[][]): number {
  // 动态规划问题，状态转移方程：
  // dp[i][j] = Math.max(1, Math.min(dp[i][j + 1], dp[i + 1][j]) - dungeon[i][j]); i < m - 1; j < n - 1; 因为需要满足 dp[i][j] ≥ 1 且 dp[i][j] + dungeon[i][j] >= Math.min(dp[i][j + 1], dp[i + 1][j])
  // dp[i][j] = Math.max⁡(1, dp[i][j+1] − dungeon[i][j])；i = m - 1; j < n - 1; 因为需要满足 dp[i][j] ≥ 1 且 dp[i][j] + dungeon[i][j] ≥ dp[i][j+1]：表示进入第i行第j列后健康点数dp[i][j] + dungeon[i][j]需要不小于进入下一个格子之前的最低健康点数dp[i][j+1]
  // dp[i][j] = Math.max⁡(1, dp[i + 1][j] − dungeon[i][j])；i < m - 1; j = n - 1; 因为需要满足 dp[i][j] ≥ 1 且 dp[i][j] + dungeon[i][j] ≥ dp[i+1][j];
  // dp[m − 1][n − 1] = Math.max(1, 1 - dungeon[m - 1][n - 1]); 因为需要满足 dp[m−1][n−1] ≥ 1 且 dp[m−1][n−1] + dungeon[m−1][n−1] ≥ 1

  // dp[i][j]表示骑士进入第i行第j列之前保证能完成拯救公主所需的最低健康点数（i, j 均从0开始）
  // 骑士进入第i行第j列后健康点数为dp[i][j] + dungeon[i][j]

  if (!isMatrix(dungeon)) {
    throw new TypeError('dungeon 必须是行列均不小于1的二维数组');
  }
  const rows = dungeon.length;
  const cols = dungeon[0].length;
  const minimumHps: number[][] = new Array(rows).fill(0).map(() => new Array(cols)); // dp表
  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      if (i === rows - 1 && j === cols - 1) {
        minimumHps[i][j] = Math.max(1, 1 - dungeon[rows - 1][cols - 1]);
      } else if (i === rows - 1) {
        minimumHps[i][j] = Math.max(1, minimumHps[i][j + 1] - dungeon[i][j]);
      } else if (j === cols - 1) {
        minimumHps[i][j] = Math.max(1, minimumHps[i + 1][j] - dungeon[i][j]);
      } else {
        minimumHps[i][j] = Math.max(1, Math.min(minimumHps[i][j + 1], minimumHps[i + 1][j]) - dungeon[i][j]);
      }
    }
  }
  return minimumHps[0][0];
}
// #endregion docs
