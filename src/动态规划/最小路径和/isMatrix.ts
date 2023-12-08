/**
 * 判断一个是否为 m * n 的矩阵
 * @param value
 * @returns
 */
export default function isMatrix(value: unknown) {
  if (!Array.isArray(value)) {
    return false;
  }
  const rows = value.length;
  if (rows === 0) {
    return false;
  }
  for (const item of value) {
    // 每个子元素必须是数组且长度不小于1且长度相等
    if (!Array.isArray(item) || item.length < 1 || item.length !== value[0].length) {
      return false;
    }
  }
  return true;
}
