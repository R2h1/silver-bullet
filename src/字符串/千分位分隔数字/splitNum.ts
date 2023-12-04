// #region docs
/**
 * 对浮点数进行千分位分隔
 * @param num 有效浮点数
 * @param divide 分割符号
 * @returns
 */
export function splitNum(num: number, divide = '.') {
  num = Number(num);
  if (isNaN(num)) {
    throw new TypeError('num 必须是一个有效数字');
  }
  let s = (num || 0).toString();
  let sign = '';
  // 处理负数
  if (s[0] === '-') {
    s = s.substring(1);
    sign = '-';
  }
  // 处理小数点
  const pointIdx = s.indexOf('.');
  let res = '';
  if (pointIdx !== -1) {
    res = s.substring(pointIdx);
    s = s.substring(0, pointIdx);
  }
  while (s.length > 3) {
    res = divide + s.substring(s.length - 3);
    s = s.substring(0, s.length - 3);
  }
  return sign + s + res;
}

/**
 * n 位分隔数字字符串（比如千分位分隔数字字符串）
 * @param num 数字字符串
 * @param every 每几位进行分隔
 * @param divide 分隔符号
 * @returns
 */
export function splitNumString(numString: string, every = 3, divide = ','): string {
  // RegExp需要加反斜杠转义反斜杠
  // (?=\B(\\d{${every}})+$) 前瞻断言在后面是"非单词边界的 every 个数字结尾出现一次或多次"匹配空字符
  const reg = new RegExp(`(?=\\B(\\d{${every}})+$)`, 'g');
  return numString.replace(reg, divide);
}
// #endregion docs
