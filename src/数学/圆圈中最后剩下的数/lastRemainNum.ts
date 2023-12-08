/**
 * 题目描述：
 *      0,1,···,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字（删除后从下一个数字开始计数）。求出这个圆圈里剩下的最后一个数字。
 *      例如，0、1、2、3、4这5个数字组成一个圆圈，从数字0开始每次删除第3个数字，则删除的前4个数字依次是2、0、4、1，因此最后剩下的数字是3。
 *  分析：
 *      数学递归法，假设删除一个数后的序列 m + 1, m + 2, ... , n, 0, 1, 2, m - 1, 继续删除最后求得的解为 x = f(n -1, m) = f(n, m) - m; 那么 f(n, m) = (f(n- 1) + m) % n，其中 f (1, m) = 0;
 *      数学迭代法，由于 f(n, m) = (f(n- 1) + m) % n，其中 f (1, m) = 0; 可以使用动态规划，初始值为 f (1, m) = 0，从 2 到 n 开始遍历到 n 即可求得 f(n, m) = (f(n- 1) + m) % n。
 */
// #region docs
// 数学递推法
export function lastRemaining1(n: number, m: number): number {
  if (n < 0) return -1;
  if (n === 0) return 1;
  return (m + lastRemaining1(n - 1, m)) % n;
}

// 数学迭代法
export function lastRemaining2(n: number, m: number): number {
  if (n < 1) return -1;
  let res = 0; // f(1, m),
  // n 从 2 到 n;
  for (let i = 2; i <= n; i += 1) {
    res = (res + m) % i; // (f(n- 1) + m) % n
  }
  return res;
}
// #endregion docs
