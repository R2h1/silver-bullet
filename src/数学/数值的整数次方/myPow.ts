/**
 * 题目描述：
 *      实现 pow(x, n) ，即计算 x 的 n 次幂函数（即，xn）。不得使用库函数，同时不需要考虑大数问题。
 *  分析：
 *      直接计算法，通过判断 n 的正负，若为负数， x 即为倒数，然后累计计算 abs(x) 次即可。
 *      快速幂递归法，当我们要计算 x^n时，我们可以先递归地计算出 y=x ⌊n/2⌋，其中 ⌊a⌋ 表示对 a 进行下取整；根据递归计算的结果，如果 n 为偶数，那么 x^n = y^2；如果 n 为奇数，那么 x^n = y^2 * x；
 *      快速幂迭代法，根据幂的二进制展开，因此每次舍弃 指数 n 的最低二进制位，如果从右往左的二进制位是 1，将贡献 x ^ 2 ^ m - 1累乘上即可。
 */
// #region docs
// 直接计算法(指数过大会超时)
function myPow1(x: number, n: number): number {
  if (x === 0) return 0;
  if (n === 0) return 1;
  x = n > 0 ? x : 1 / x;
  let res = 1;
  for (let i = 0; i < Math.abs(n); i += 1) {
    res *= x;
  }
  return res;
}

// 快速幂 + 递归
function myPow2(x: number, n: number): number {
  if (n === 0) return 1;
  const y = myPow2(x, Math.floor(Math.abs(n) / 2));
  const res = n % 2 === 0 ? y * y : y * y * x;
  return n < 0 ? 1 / res : res;
}

// 快速幂 + 迭代
function myPow3(x: number, n: number): number {
  if (x === 0) return 0;
  let res = 1;
  let nAbs = Math.abs(n);
  while (nAbs !== 0) {
    // 指数的二进制最后一位为 1，需要将贡献累乘上
    if (nAbs & 1) {
      res *= x;
    }
    // 舍弃掉指数二进制的最后一位
    nAbs = Math.abs(nAbs >> 1); // 或者 Math.floor(nAbs / 2)
    // 将贡献不断地平方
    x *= x;
  }
  return n > 0 ? res : 1 / res;
}
// #endregion docs
