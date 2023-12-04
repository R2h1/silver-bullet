/**
 * 题目描述：
 *      hex颜色值时一个以#开头，后面跟着6位或3位16进制数字的字符串。写一个函数将hex颜色值转换为rgb()形式的颜色值。
 *      给的字符串不合法，则返回原始字符串。
 *  分析：
 *      首先使用正则判断是否时一个hex颜色值，如果不是直接返回，
 *      否则使用 parseInt(str, radix = 16)计算 # 后面值存放在数组中，根据数组长度是3或6计算rgb值即可。
 */
// #region docs
function hex2rgb(hex: string): string {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (!reg.test(hex)) {
    return hex;
  }
  let red = 0;
  let green = 0;
  let blue = 0;
  let h = hex.substring(1);
  if (h.length === 3) h = [...h].map((x) => x + x).join('');
  const hexValues = h.split('').map((item) => {
    return parseInt(item, 16);
  });
  red = hexValues[0] * 16 + hexValues[1];
  green = hexValues[2] * 16 + hexValues[3];
  blue = hexValues[4] * 16 + hexValues[5];
  return `rgb(${red}, ${green}, ${blue})`;
}
// #endregion docs
