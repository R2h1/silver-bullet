/**
 * 题目描述：
 *      给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
 *      单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
 *  分析：
 *      深度优先搜索法（回溯），典型的矩阵搜索问题，可使用 深度优先搜索（DFS）+ 剪枝 解决。
 *          深度优先搜索： 可以理解为暴力法遍历矩阵中所有字符串可能性。DFS 通过递归，先朝一个方向搜到底，再回溯至上个节点，沿另一个方向搜索，以此类推。
 *          剪枝： 在搜索中，遇到 这条路不可能和目标字符串匹配成功 的情况（例如：此矩阵元素和目标字符不同、此元素已被访问），则应立即返回，称之为 可行性剪枝
 *              1. 递归参数： 当前元素在矩阵 board 中的行列索引 i 和 j ，当前目标字符在 word 中的索引 k 。
 *              2. 超过行、列边界，或 当前遍历的字母不等于当前单词中的字母 或 当前字母已经访问过（后面两者可合并，在该路径开始之初，设置字母为空字符，回溯到当前节点时, 改回原来的字母）
 *              3. 朝当前元素的 上、下、左、右 四个方向开启下层递归，使用 或 连接 （代表只需找到一条可行路径就直接返回，不再做后续 DFS ）
 */
// #region docs
// 深度优先搜索
function dfs(board: string[][], i: number, j: number, word: string, index: number): boolean {
  // 超过行、列边界，或 当前遍历的字母不等于 当前单词中的字母
  if (i >= board.length || i < 0 || j >= board[0].length || j < 0 || board[i][j] !== word[index]) return false;
  // board[i][j] === word[index]才会走到这里，
  // 遍历到单词末尾都相等
  if (index === word.length - 1) return true;
  // 标记当前节点访问过
  board[i][j] = '';
  // 向四个方向对比
  const res =
    dfs(board, i + 1, j, word, index + 1) ||
    dfs(board, i, j + 1, word, index + 1) ||
    dfs(board, i - 1, j, word, index + 1) ||
    dfs(board, i, j - 1, word, index + 1);
  // 回溯到当前节点时, 改回原来的字母
  // 以便从其他字母出发的能访问到该字母
  board[i][j] = word[index];
  return res;
}

// 深度优先搜索法(dfs)
function exist(board: string[][], word: string): boolean {
  const row = board?.length;
  const col = board?.[0]?.length;
  for (let i = 0; i < row; i += 1) {
    for (let j = 0; j < col; j += 1) {
      if (dfs(board, i, j, word, 0)) {
        return true;
      }
    }
  }
  return false;
}
// #endregion docs
