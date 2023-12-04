/**
 * 题目描述：
 *      请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。
 *      数值（按顺序）可以分成以下几个部分：若干空格 + 一个小数或者整数 + （可选）一个'e'或'E'，后面跟着一个整数 + 若干空格
 *          其中，小数（按顺序）可以分成以下几个部分：（可选）一个符号字符（'+' 或 '-'） + 至少一位数字，后面跟着一个点 '.' 或者 至少一位数字，后面跟着一个点 '.' ，后面再跟着至少一位数字 或者 一个点 '.' ，后面跟着至少一位数字
 *                整数（按顺序）可以分成以下几个部分：（可选）一个符号字符（'+' 或 '-'）+ 至少一位数字
 *      部分数值列举如下：["+100", "5e2", "-123", "3.1416", "-1E-16", "0123"]
 *      部分非数值列举如下：["12e", "1a3.14", "1.2.3", "+-5", "12e+5.4"]
 *  分析：
 *      trim + Number + isNaN, 去掉首位空格，若字符串为空，或者是一些无穷大数值字符串，则不是数值，否则用isNaN判断是否为数值。
 *      正则，使用正则表达式判断是否为数值：一个或多个空格开头，（+ | -），数字（.一个或多个数字）| .数字，(e | E (+ | -) 数字)，一个或多个空格结尾。
 *      遍历，去掉首位空格，分为以下几种情况，若当前字符为 e | E，则前面不能有 e | E，而且之前的必须满足是小数或者整数，小数点前面不能有 e | E 或 小数点，符号只能出现在首位和 e 后面的首位置
 */
// #region docs
// trim + Number + isNaN
function isNumber1(s: string): boolean {
  s = s.trim();
  if (s.length === 0) {
    return false;
  }
  if (['+Infinity', 'Infinity', '-Infinity'].includes(s)) return false;
  return !Number.isNaN(Number(s));
}

// 正则
function isNumber2(s: string): boolean {
  // 一个或多个空格开头，（+ | -），数字（.一个或多个数字）| .数字，(e | E (+ | -) 数字)，一个或多个空格结尾
  const reg = /^\s*[+-]?((\d+(\.\d*)?)|\.\d+)([eE][+-]?\d+)?\s*$/;
  return reg.test(s);
}

// 遍历
function isNumber3(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  // 去掉前面空格
  while (left <= right && s[left] === ' ') {
    left += 1;
  }
  // 去掉尾部空格
  while (right >= left && s[right] === ' ') {
    right -= 1;
  }
  // 当前是否为数字
  let isNum = false;
  // 表示之前是否出现过 eE | .
  let hasE = false;
  let hasDot = false;
  const first = left;
  while (left <= right) {
    const char = s[left];
    if (char >= '0' && char <= '9') {
      // 当前是数字
      isNum = true;
    } else if (['e', 'E'].includes(char)) {
      if (hasE || !isNum) {
        // 之前必须是数值 且不能有 e | E
        return false;
      }
      hasE = true;
      isNum = false; // 包括 e | E 在内的已经不是数值，若继续遍历下一个是（+ | -）数字，则才能是数值，所以需要置为false
    } else if (char === '.') {
      // 遇到 . 的时候不需要改变 isNum
      if (hasDot || hasE) {
        // 小数点前面不能有小数点和 e | E
        return false;
      }
      hasDot = true;
    } else if (['+', '-'].includes(char)) {
      // 只能出现在首位和 e 后面的首位置
      if (left !== first && !['e', 'E'].includes(s[left - 1])) {
        return false;
      }
    } else {
      return false;
    }
    left += 1;
  }
  return isNum;
}
// #endregion docs
