/**
 * 题目描述：
 *     一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。
 *  分析：
 *      迭代法，f(n) 指的是 跳上 n 级台阶，那么如果第一步跳 1 级，那么剩下 n - 1 级台阶即有 f(n - 1) 种跳法，如果第一步跳 2 级，那么剩下 n - 2 级台阶即有 f(n - 2) 种跳法，
 *          依次类推，第一次跳 n - 1 级，有 f(1) 种跳法，第一次跳 n 级，有 f (0) = 1 中跳法，将其累加 ，f(n) =  f(n-1) + f(n-2) + f(n-3) + ... + f(1) + f(0);
 *          同理 f(n - 1) = f(n-2) + f(n-3) + f(n-4) + ... + f(1) + f(0)，其中 f (0) = 1。
 *          两式相减 得到 f(n) = 2 * f(n-1) 其中 f(0) = 1, f(1) = 1;
 */
// #region docs
// 迭代法
function numWays(n: number): number {
  if (n < 0) {
    throw new Error('the input number is invalid');
  }
  if (n < 2) {
    return 1;
  }
  let res = 1;
  const mod = 1000000007;
  for (let i = 1; i < n; i += 1) {
    res = (2 * res) % mod;
  }
  return res;
}
// #endregion docs
