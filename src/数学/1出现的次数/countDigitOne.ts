/**
 * 题目描述：
 *      输入一个整数 n ，求1～n这n个整数的十进制表示中1出现的次数。例如，输入12，1～12这些整数中包含1 的数字有1、10、11和12，1一共出现了5次。
 *  分析：
 *      枚举优化法，
 *          以 n = 1234567 为例，假设我们统计百位上1出现的次数， 等于从 567 到 1234567 这个范围和 从 0 到 567 百位出现 1 的次数之和。
 *          而从 567 到 1234567 这个范围内，百位上1出现的次数为 出现的 1 的次数为：⌊ n / 1000 ⌋ × 100,
 *          而 从 0 到 567 百位出现 1 的次数为: min(max(n mod 1000 - 100 + 1, 0), 100)，因为 若 n mod 1000 > 200 则出现 100 次，小于 200 则出现 n mod 1000 - 100 + 1， 小于100 则出现 0 次。
 *          因此，通过遍历 n 的每一位(从个位开始），计算即可。
 */
// #region docs
// 枚举优化法
function countDigitOne(n: number): number {
  // 初始为个位，即 i = 0, 10^i = 1;
  let i = 0;
  let res = 0;
  let digital = 10 ** i;
  while (digital <= n) {
    res =
      res +
      Math.floor(n / (digital * 10)) * digital +
      Math.min(Math.max((n % (digital * 10)) - digital + 1, 0), digital);
    i += 1;
    digital = 10 ** i;
  }
  return res;
}
// #endregion docs
