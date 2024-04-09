// #region docs
/**
 * 实现 assign
 * @param
 * @returns
 */
export function myAssign(target: object, ...source: any[]) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const ret = Object(target);
  source.forEach(function (obj) {
    if (obj != null) {
      // 非 null 和 非 undefined
      for (let key in obj) {
        // 可枚举属性
        if (obj.hasOwnProperty(key)) {
          // 自有属性
          // 使用后面的覆盖前面的
          // 对于不可写属性，默认会失败，严格模式下才会抛出TypeError
          // 由于严格模式下不能使用剩余参数，如果要实现需要使用arguments
          ret[key] = obj[key];
        }
      }
    }
  });
  return ret;
}
// #endregion docs