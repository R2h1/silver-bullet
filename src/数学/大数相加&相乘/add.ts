/**
 * 题目描述：
 *      给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和并同样以字符串形式返回。
 *  分析：
 *      由于最大的安全整数是16位，因此从后往前每15位转换为数字相加并且考虑进位，
 *      然后再将每部分字符串拼接。
 *        1. 某一部分相加的结果如果位数为16位，说明需要进位，
 *        2. 某一部分相加的结果位数如果小于等于15位时, 如果存在一个加数的位数等于15位，这部分的结果前面需要补0。
 */
// #region docs
/**
 * 两个大正整数（字符串）相加
 * @param num1
 * @param num2
 * @param every
 * @returns
 */
export default function addBigDigit(num1: string, num2: string, every = 15): string {
  let i = num1.length;
  let j = num2.length;
  let res = '';
  let carry = 0;
  // 如果传递的 every 小于 1 或 大于 15，说明参数有问题，则使用默认值 15
  every = every > 15 || every < 1 ? 15 : every;
  while (i > 0 || j > 0) {
    const subOfNum1 = num1.substring(i - every, i);
    const subOfNum2 = num2.substring(j - every, j);
    const sum = String(Number(subOfNum1) + Number(subOfNum2) + carry);
    // 当前部分相加结果位数超过指定位数: 15
    if (sum.length > every) {
      res = sum.substring(1) + res;
      carry = 1;
    } else {
      if (i < every && j < every) {
        res = sum + res;
      } else {
        // 如果存在一个加数的位数等于15位，这部分的结果如果不够15需要补0
        res = sum.padStart(every, '0') + res;
      }
      carry = 0;
    }
    j -= every;
    i -= every;
  }
  return carry === 1 ? carry + res : res;
}
// #endregion docs
