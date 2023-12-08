/**
 * 题目描述：
 *      求 1+2+...+n ，要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。
 *  分析：
 *      递归法，使用短路表达式，当 n !== 0 的时候进行递归累加
 */
// #region docs
// 短路递归法
function sumNums(n: number): number {
  let sum = n;
  n && (sum += sumNums(n - 1));
  return sum;
}
// #endregion docs
