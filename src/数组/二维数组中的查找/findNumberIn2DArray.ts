/**
 * 题目描述：
 *      在一个二维数组中（每个一维数组的长度相同），每一行、列分别按照从左到右、从上到下递增的顺序排序。
 *      请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
 *  分析：
 *      数组的规律是行元素从左到右递增，列元素从上到下递增，比如：
 *          arr =  [[1, 7, 13, 19],
 *                 [3, 9, 15, 21],
 *                 [5, 11, 17,23]]
 *      因此最小值和最大值在左上角和右下角。
 *      假如对于整数 15,
 *      可以从左下角开始向右上角进行遍历（也可以从右上角开始，向左下角进行遍历），
 *      如果大于arr[i][j]，向右走（超过列边界退出，找不到），
 *      如果小于arr[i][j]向上走（超过行边界退出，找不到）。
 */
// #region docs
/** 暴力解法 */
function findNumberIn2DArray1(matrix: number[][], target: number): boolean {
  const row = matrix?.length;
  const col = matrix?.[0]?.length;
  // 二位数组为空
  if (!row || !col) return false;
  for (let i = 0; i < row; i += 1) {
    for (let j = 0; j < col; j += 1) {
      const element = matrix[i][j];
      if (element === target) return true;
      // 当前一维数组大了
      if (element > target) break;
    }
  }
  return false;
}

/** 优化解法 */
function findNumberIn2DArray2(matrix: number[][], target: number): boolean {
  const row = matrix?.length;
  const col = matrix?.[0]?.length;
  // 二位数组为空
  if (!row || !col) return false;

  // 从左下角元素出发，向右上进行遍历
  let i = row - 1;
  let j = 0;
  while (i >= 0 && j < col) {
    const element = matrix[i][j];
    if (element === target) return true;
    // 当前行已经都比目标元素大
    if (element > target) {
      i -= 1;
    } else {
      // 当前行不大于目标元素
      j += 1;
    }
  }
  return false;
}
// #endregion docs
