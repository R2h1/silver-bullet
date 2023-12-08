/**
 * 题目描述：
 *      我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。
 *  分析：
 *      枚举法，从 1 开始判断遍历，判断是否丑数（只有 2， 3， 5 作为因子），若是丑数 n 自减，直到 n 等于 1，返回即可。
 *      动态规划法，定义数组dp，其中 dp[i - 1] 表示第 i 个丑数，第 nn 个丑数即为 dp[n]。由于最小的丑数是 1，因此 dp[0]=1。
 *          然后定义三个指针 p2,p3,p5，表示下一个丑数是当前指针指向的丑数乘以对应的质因数。初始时，三个指针的值都是 0。当 1≤ i ≤ n-1 时，令 dp[i]=min(dp[p2]×2,dp[p3]×3,dp[p5]×5)，
 *          然后分别比较 dp[i] 和 dp[p2]×2,dp[p3]×3,dp[p5]×5 是否相等，如果相等则将对应的指针加 1。最终 dp[n - 1]即是第 n 个 丑数。
 */
// #region docs
// 枚举法
function nthUglyNumber1(n: number): number {
  if (n <= 0) return 0;
  function isUglyNumber(num: number): boolean {
    while (num % 2 === 0) {
      num /= 2;
    }
    while (num % 3 === 0) {
      num /= 3;
    }
    while (num % 5 === 0) {
      num /= 5;
    }
    return num === 1;
  }
  let num = 1;
  while (true) {
    if (isUglyNumber(num) && n === 1) {
      n -= 1;
      break;
    }
    num += 1;
  }
  return num;
}

// 动态规划法
function nthUglyNumber2(n: number): number {
  if (n <= 0) return 0;
  const dp = new Array(n).fill(0);
  dp[0] = 1; // 第一个丑数是 1
  let factor2 = 0;
  let factor3 = 0;
  let factor5 = 0;
  for (let i = 1; i < n; i += 1) {
    const num2 = dp[factor2] * 2;
    const num3 = dp[factor3] * 3;
    const num5 = dp[factor5] * 5;
    dp[i] = Math.min(num2, num3, num5);
    // 选取 2、3、5 其中的那个因子下标加 1
    if (dp[i] === num2) {
      factor2 += 1;
    }
    if (dp[i] === num3) {
      factor3 += 1;
    }
    if (dp[i] === num2) {
      factor5 += 1;
    }
  }
  return dp[n - 1];
}
// #endregion docs
