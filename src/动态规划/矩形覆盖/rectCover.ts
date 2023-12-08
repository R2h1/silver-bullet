/**
 * 题目描述：
 *      我们可以用2*1的小矩形横着或者竖着去覆盖更大的矩形。请问用n个2*1的小矩形无重叠地覆盖一个2*n的大矩形，总共有多少种方法？比如n=3时，2*3的矩形块有3种覆盖方法
 *  分析：
 *      和斐波那契数列一样，
 *      n个2*1的小矩形无重叠地覆盖一个2*n的大矩形的方法数等于 n - 1 个2*1的小矩形无重叠地覆盖一个2*（n - 1）的大矩形的方法数 与  n - 2 个2*1的小矩形无重叠地覆盖一个2*（n - 2）的大矩形的方法数 之和
 *      即，f(n) = f(n - 1) + f(n-2)只是初始值不同， f(0) = 0,  f(1) = 1, f (2) = 2。
 */
// #region docs
// 动态规划迭代法
function rectCover(n: number): number {
  if (n < 0) {
    throw new Error('the input number is invalid');
  }
  if (n <= 2) {
    return n;
  }
  let a = 1;
  let b = 2;
  let res = 0;
  const mod = 1000000007;
  for (let i = 2; i < n; i += 1) {
    res = (a + b) % mod;
    a = b;
    b = res;
  }
  return res;
}
// #endregion docs
