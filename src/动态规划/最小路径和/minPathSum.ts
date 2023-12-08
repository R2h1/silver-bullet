/**
 * 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
 * 说明：每次只能向下或者向右移动一步。
 * m == grid.length
 * n == grid[i].length
 * 1 <= m, n <= 200
 * 0 <= grid[i][j] <= 100
 * @param grid 二维网格
 * @returns 最小路径和
 * @example
 *   minPathSum([[1,3,1],[1,5,1],[4,2,1]]); // 7
 *   minPathSum([[1,2,3],[4,5,6]]); // 12
 */
// #region docs
import isMatrix from './isMatrix';

export function minPathSum(grid: number[][]): number {
  // 动态规划问题, 状态转移方程：dp(i, j) = Min.min(dp(i-1, j), dp(i, j - 1)) + grid[i][j];
  // dp(0, j) = dp(0, j - 1) + grid[0][j];
  // dp(i, 0) = dp(i - 1, 0) + grid[i][0];
  // dp(0, 0) = grid[0][0];
  // dp(i, j) 表示到达第i行第j列的最小路径和 （i, j 均从0开始）
  if (!isMatrix(grid)) {
    throw new TypeError('grid 必须是行列均不小于 1 的二维数组');
  }
  const rows = grid.length;
  const cols = grid[0].length;
  const cache = new Map<string, number>();
  const getPathSum = (i: number, j: number): number => {
    const key = `${i}-${j}`;
    const cachePathSum = cache.get(key);
    if (cachePathSum) {
      return cachePathSum;
    }
    let pathSum;
    if (i === 0 && j === 0) {
      return grid[0][0];
    }
    if (i === 0) {
      pathSum = getPathSum(0, j - 1) + grid[0][j];
    } else if (j === 0) {
      pathSum = getPathSum(i - 1, 0) + grid[i][0];
    } else {
      pathSum = Math.min(getPathSum(i - 1, j), getPathSum(i, j - 1)) + grid[i][j];
    }
    cache.set(key, pathSum);
    return pathSum;
  };
  return getPathSum(rows - 1, cols - 1);
}

export function minPathSum2(grid: number[][]): number {
  // 动态规划问题, 状态转移方程：dp(i, j) = Min.min(dp(i-1, j), dp(i, j - 1)) + grid[i][j];
  // dp(0, j) = dp(0, j - 1) + grid[0][j];
  // dp(i, 0) = dp(i - 1, 0) + grid[i][0];
  // dp(0, 0) = grid[0][0];
  // dp(i, j) 表示到达第i行第j列的最小路径和（i, j 均从0开始）
  if (!isMatrix(grid)) {
    throw new TypeError('grid 必须是行列均不小于 1 的二维数组');
  }
  const rows = grid.length;
  const cols = grid[0].length;
  const pathSums: number[][] = new Array(rows).fill(0).map(() => new Array(cols)); // dp表
  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      if (i === 0 && j === 0) {
        pathSums[i][j] = grid[0][0];
      } else if (i === 0) {
        pathSums[i][j] = pathSums[0][j - 1] + grid[0][j];
      } else if (j === 0) {
        pathSums[i][j] = pathSums[i - 1][0] + grid[i][0];
      } else {
        pathSums[i][j] = Math.min(pathSums[i - 1][j], pathSums[i][j - 1]) + grid[i][j];
      }
    }
  }
  return pathSums[rows - 1][cols - 1];
}
// #endregion docs
