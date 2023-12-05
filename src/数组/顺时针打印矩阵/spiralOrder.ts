/**
 * 题目描述：
 *       输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。
 * 分析：
 *      分层遍历，每层按从左到右，从上到下，从右到左，从下到上进行遍历打印。从 0层开始，每打印完一层行和列均减去2，因此层数 * 2应该同时小于行数与列数，注意打印到最后一层，如果只剩下一行，则不需要从右到左，同理，只剩下一列，则不需要从下到上。
 *      移除首行 + 变相转置（向左翻转），先将矩阵的第一行打印，对剩下的矩阵进行向左翻转（变相转置），依次打印翻转后的第一行，直到矩阵为空。
 */
// #region docs
// 按层遍历
function spiralOrder1(matrix: number[][]): number[] {
  const row = matrix?.length;
  const col = matrix?.[0]?.length;
  let layer = 0;
  const printResult: number[] = [];
  while (layer * 2 < row && layer * 2 < col) {
    // 每遍历一次，行和列均减去了2，
    const endRowIndex = row - 1 - layer;
    const endColIndex = col - 1 - layer;
    for (let j = layer; j <= endColIndex; j += 1) {
      // 从左向右
      printResult.push(matrix[layer][j]);
    }
    for (let i = layer + 1; i <= endRowIndex; i += 1) {
      // 从上到下
      printResult.push(matrix[i][endColIndex]);
    }
    if (layer < endRowIndex) {
      // 排除只剩下一行，不需要从右到左
      for (let i = endColIndex - 1; i >= layer; i -= 1) {
        // 从右到左
        printResult.push(matrix[endRowIndex][i]);
      }
    }
    if (layer < endColIndex) {
      // 排除只剩下一列，不需要从下到上
      for (let j = endRowIndex - 1; j > layer; j -= 1) {
        // 从下到上
        printResult.push(matrix[j][layer]);
      }
    }
    layer += 1;
  }
  return printResult;
}

// 移除首行 + 变相转置（向左翻转）
function spiralOrder2(matrix: number[][]): number[] {
  const printResult: number[] = [];
  function transpose(mtr: number[][]): number[][] {
    const transposedMatrix: number[][] = [];
    const row = mtr?.length;
    const col = mtr?.[0]?.length;
    for (let j = col - 1; j >= 0; j -= 1) {
      const tmp: number[] = [];
      for (let i = 0; i < row; i += 1) {
        tmp.push(mtr[i][j]);
      }
      transposedMatrix.push(tmp);
    }
    return transposedMatrix;
  }
  while (matrix.length) {
    const firstRow = matrix.shift() as number[];
    printResult.push(...firstRow); // 每次将第一行放入结果数组中
    matrix = transpose(matrix); // 对矩阵进行变相转置（向左翻转）
  }
  return printResult;
}
// #endregion docs
const i = 0;
const j = 0;
// n = 4, m = 4
// 00(1)   01(2)   02(3)  03(4)
// 10(12)  11(13)  12(14) 13(5)
// 20(11)  21(16)  22(15) 23(6)
// 30(10)  31(9)   32(8)  33(7)

/**
 * 总层数
 */
const totalLayer = Math.ceil(Math.min(n, m) / 2);
/**
 * 由外向内第 k 层的需要加的数量: k = 1, 2, ..., totalLayer;
 */
const kthLayer = 2 * (m + n) - 8 * k + 4;

/**
 * 判断一个第 i 行第 j 列的数在第几层, i = 0, 1,..., n - 1; j = 0, 1,...,m - 1;
 * 距离上侧是 i, 距离下侧是 (n - 1) - i;
 * 距离左侧是 j, 距离右侧是 (m - 1) - j;
 */
const layerOfIJ = Math.min(i, j, n - 1 - i, m - 1 - j) + 1;
