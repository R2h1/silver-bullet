/**
 * 题目描述：
 *      地上有一个m行n列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。
 *      例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。但它不能进入方格 [35, 38]，因为3+5+3+8=19。请问该机器人能够到达多少个格子？
 *  分析：
 *      深度优先搜索法，因为随着限制条件 k 的增大，(0, 0) 所在的蓝色方格区域内新加入的非障碍方格都可以由上方或左方的格子移动一步得到。而其他不连通的蓝色方格区域会随着 k 的增大而连通，
 *      且连通的时候也是由上方或左方的格子移动一步得到，因此我们可以将我们的搜索方向缩减为向右或向下。用一个相同维度的二维数组记录是否可以到达，而递归退出条件则是，机器人到达不了 或 已经访问过 或 超出边界，此时返回0，否则可以到达，返回 1 + 向右和向下搜索的结果
 */
// #region docs
// 深度优先搜索法(dfs)
function movingCount(m: number, n: number, k: number): number {
  // 计算一个数的各位之和
  function sumOfEvery(num: number) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    return sum;
  }
  // 标志当前遍历的位置是否访问过
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  function dfs(i: number, j: number): number {
    // 机器人到达不了，或已经访问过 或 超出边界
    if (sumOfEvery(i) + sumOfEvery(j) > k || i >= m || j >= n || visited[i][j]) return 0;
    // 机器人可到达
    visited[i][j] = true;
    return 1 + dfs(i + 1, j) + dfs(i, j + 1);
  }
  return dfs(0, 0);
}
// #endregion docs
