// #region docs
function getTypeof(value: any) {
  if (value == null) {
    return String(value);
  }
  // 判断数据是引用类型的情况
  if (typeof value === 'object') {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase;
  }
  return typeof value;
}
// #endregion docs

export default getTypeof;