/**
 * 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。1 <= m, n <= 100
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
 * 问总共有多少条不同的路径？
 * @param {number} m 行数
 * @param {number} n 列数
 * @returns 路径数
 * @example
 *   uniquePaths(3, 7); // 28
 *   uniquePaths(3, 2); // 3
 *   uniquePaths(7, 3); // 28
 *   uniquePaths(3, 3); // 6
 */
// #region docs
export function uniquePaths(m: number, n: number): number {
  // 动态规划问题， 其状态转移方程为  dp(i, j) = dp(i - 1, j) + dp(i, j - 1);  dp(i, 0) = 1; dp(j, 0) = 1;
  // dp(i, j)表示到达第i行第j列有多少条路径（i, j 均从0开始）
  if (m < 1 || n < 1) {
    throw new TypeError('m, n 必须均不小于1');
  }
  const cache = new Map<string, number>();
  const getPaths = (i: number, j: number): number => {
    if (i === 0 || j === 0) {
      return 1;
    }
    const key = `${i}-${j}`;
    const cachePaths = cache.get(key);
    if (cachePaths) {
      return cachePaths;
    }
    const paths = getPaths(i, j - 1) + getPaths(i - 1, j);
    cache.set(key, paths);
    return paths;
  };
  return getPaths(m - 1, n - 1);
}

export function uniquePaths2(m: number, n: number): number {
  // 动态规划问题， 其状态转移方程为  dp(i, j) = dp(i - 1, j) + dp(i, j - 1);  dp(i, 0) = 1; dp(j, 0) = 1;
  // dp(i, j)表示到达第i行第j列有多少条路径（i, j 均从0开始）
  if (m < 1 || n < 1) {
    throw new TypeError('m, n 必须均不小于1');
  }
  const paths: number[][] = new Array(m).fill(0).map(() => new Array(n)); // dp表
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (i === 0 || j === 0) {
        paths[i][j] = 1;
      } else {
        paths[i][j] = paths[i - 1][j] + paths[i][j - 1];
      }
    }
  }
  return paths[m - 1][n - 1];
}

// 优化空间复杂度：降维打击
export function uniquePaths3(m: number, n: number): number {
  // 动态规划问题， 其状态转移方程为  dp(i, j) = dp(i - 1, j) + dp(i, j - 1);  dp(i, 0) = 1; dp(j, 0) = 1;
  // dp(i, j)表示到达第i行第j列有多少条路径（i, j 均从0开始）
  if (m < 1 || n < 1) {
    throw new TypeError('m, n 必须均不小于1');
  }
  const paths: number[] = new Array(n).fill(1); // dp表，滚动数组，初始均为 1
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      paths[j] += paths[j - 1]; // 总是等于当前列上一行（paths[j]） + 当前行上一列（paths[j - 1]）
    }
  }
  return paths[n - 1];
}
// #endregion docs
