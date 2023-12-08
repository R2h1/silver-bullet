/**
 * 题目描述：
 *      一只青蛙一次可以跳上1级台阶，也可以跳上 2 级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
 *  分析：
 *      和斐波那契数列一样，只是初始值不同， f(0) = 0,  f(1) = 1, f (2) = 2
 */
// #region docs
// 递归法
function numWays1(n: number): number {
  if (n < 0) {
    throw new Error('the input number is invalid');
  }
  if (n <= 2) {
    return n;
  }
  const mod = 1000000007;
  return (numWays1(n - 1) + numWays1(n - 2)) % mod;
}

// 动态规划迭代法
function numWays2(n: number): number {
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
