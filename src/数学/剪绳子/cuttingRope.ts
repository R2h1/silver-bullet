/**
 * 题目描述：
 *      给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1 并且 m>1），每段绳子的长度记为 k[0],k[1]...k[m-1] 。请问 k[0]*k[1]*...*k[m-1] 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。
 *  分析：
 *      贪心法，首先，显然将绳子以相等的长度等分为多段 ，得到的乘积最大，而且
 *          最优： 3 。把绳子尽可能切为多个长度为 3 的片段，留下的最后一段绳子的长度可能为 0,1,2 三种情况。
 *          次优： 2 。若最后一段绳子长度为 2 ；则保留，不再拆为 1+1。
 *          最差： 1 。若最后一段绳子长度为 1 ；则应把一份 3+1 替换为 2 + 2，因为 2×2 > 3×1
 */
// #region docs
// 贪心法
function cuttingRope(n: number): number {
  // 当 n ≤ 3 时，按照规则应不切分，但由于题目要求必须剪成 m > 1 段，因此必须剪出一段长度为 1 的绳子，即返回 n - 1。
  if (n <= 3) return n - 1;
  // 商
  const quotient = Math.floor(n / 3);
  const mod = 1000000007;
  // 余数
  const remainder = n % 3;
  if (remainder === 0) {
    return 3 ** quotient % mod;
  }
  if (remainder === 1) {
    return (2 * 2 * 3 ** (quotient - 1)) % mod;
  }
  return (2 * 3 ** quotient) % mod;
}
// #endregion docs
