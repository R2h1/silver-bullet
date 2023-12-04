/**
 * 题目描述：
 *      给定一个数组 A[0,1,…,n-1]，请构建一个数组 B[0,1,…,n-1]，其中 B[i] 的值是数组 A 中除了下标 i 以外的元素的积, 即 B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]。不能使用除法。
 *  分析：
 *      暴力法，直接两层循环遍历，内层循环计算累乘并排除当前元素（超时）。
 *      两次遍历（前 -> 后 + 后 -> 前）法，先遍历从前往后一次数组，计算当前元素之前的累乘放到目标数组对应位置；再从后往前遍历数组用一个变量存储计算当前元素之后的累乘，并将其与目标数组对应位置相乘即可。
 */

// 暴力法(超时)
function constructArr1(a: number[]): number[] {
  const len = a?.length;
  const b = new Array(len).fill(1);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i !== j) {
        b[i] = b[i] * a[j];
      }
    }
  }
  return b;
}

// 两次遍历（前 -> 后 + 后 -> 前）法
function constructArr2(a: number[]): number[] {
  const len = a?.length;
  const b = new Array(len).fill(1);
  // 首次从前向后遍历，计算 i 之前的累积  b[i] = b[i-1] * a[i-1] （b[i-1]不包括 a[i-1])
  for (let i = 1; i < len; i++) {
    b[i] = b[i - 1] * a[i - 1];
  }
  let multiply = 1; // 用于存储 i 之后的累积
  // 二次从后向前遍历，计算 i 之后的乘积 b[i] = b[i] * a[i+1] * a[i+2] *... * a[n - 1];
  for (let i = len - 2; i >= 0; i--) {
    multiply = multiply * a[i + 1];
    b[i] = b[i] * multiply;
  }
  return b;
}
