// #region docs
/**
 * @description: 将 item 也就是 key 统一转换为字符串
 */
export default function defaultToString(item: any): string {
  // 对于 null undefined和字符串的处理
  if (item === null) {
    return 'NULL';
  }
  if (item === undefined) {
    return 'UNDEFINED';
  }
  if (typeof item === 'string' || item instanceof String) {
    return `${item}`;
  }
  // 其他情况时调用数据结构自带的 toString 方法
  return item.toString();
}
// #endregion docs
