/**
 * 题目描述：
 *      编写一个函数，输入是一个无符号整数（以二进制串的形式），返回其二进制表达式中数字位数为 '1' 的个数（也被称为 汉明重量).）。
 *  分析：
 *      循环检查二进制位法，当检查第 i位时，我们可以让 n 与 2^i 进行与运算，当且仅当 n 的第 i 位为 1 时，运算结果不为 0。
 *      位运算优化法，n & (n−1)会将n 的最右边的那个1变成0，直到 n 等于0，运算次数就等于 n 的二进制位中 1 的个数。
 */
// #region docs
// 位运算优化法
function hammingWeight1(n: number): number {
  let count = 0;
  while (n !== 0) {
    // n & n - 1的按位与会将最右边的那个 1 变为 0
    const m = n - 1;
    n &= m;
    count += 1;
  }
  return count;
}

// 循环检查二进制位法
function hammingWeight2(n: number): number {
  let count = 0;
  for (let i = 0; i < 32; i += 1) {
    if ((n & (1 << i)) !== 0) {
      // 和 2^i 进行与运算，不等于 0 说明该位置是 1
      count += 1;
    }
  }
  return count;
}
// #endregion docs
