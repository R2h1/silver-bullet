/**
 * 题目描述：
 *    在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。
 * @param matrix
 * @returns
 * @example
 *   maximalSquare([["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]) // 4
 *   maximalSquare([["0","1"],["1","0"]]) // 1
 *   maximalSquare([["0"]]) // 0
 * */
// #region docs
function maximalSquare(matrix: string[][]): number {
  // 动态规划问题，状态转移方程：
  // dp[i][j] 表示以 (i, j) 为右下角，且只包含 1 的正方形的边长最大值。
  // matrix[i][j] = '1' => dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1; // 当前位置的元素值等于三个相邻位置的元素中的最小值加 1
  // matrix[i][j] = '0' => dp[i][j] = 0; // 当前位置不可能在由 1 组成的正方形中
  // i = 0 或 j = 0 => dp[i][j] = matrix[i][j]; // 首行或首列中以位置 (i,j) 为右下角的最大正方形的边长只能是 matrix[i][j]，即 0 或 1
  // 因此，可以直接在原始矩阵中进行计算，即 matrix 作为 dp
  const row = matrix.length;
  const col = matrix[0].length;
  let maxSide = 0;
  // 直接原矩阵上进行计算
  for (let i = 0; i < row; i += 1) {
    for (let j = 0; j < col; j += 1) {
      if (matrix[i][j] === '1') {
        // 非首行首列为 1，才需要进行更改
        if (i !== 0 && j !== 0) {
          matrix[i][j] = String(Math.min(+matrix[i - 1][j - 1], +matrix[i - 1][j], +matrix[i][j - 1]) + 1);
        }
        maxSide = Math.max(+matrix[i][j], maxSide);
      }
    }
  }
  return maxSide * maxSide;
}
// #endregion docs
