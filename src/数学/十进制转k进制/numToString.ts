// #region docs
function createNumOfRadix(radix: number, cases = 'upper') {
  if (radix < 2 || radix > 36) {
    throw new TypeError('radix must be 2 ~ 36');
  }
  const base = cases === 'upper' ? 55 : 87;
  return new Array(radix).fill(0).map((_, index) => {
    if (index < 10) {
      return String(index);
    }
    return String.fromCharCode(index + base);
  });
}

// 除k取余逆序排列法
function numToString(intValue: number, radix = 10) {
  if (typeof intValue !== 'number') {
    throw new TypeError('intValue must be a number');
  }
  const numOfRadix = createNumOfRadix(radix);
  let res = '';
  while (intValue) {
    /** 除 k 取 余，逆序排列 */
    res = numOfRadix[intValue % radix] + res;
    intValue = Math.floor(intValue / radix);
  }
  return res;
}
// #endregion docs
