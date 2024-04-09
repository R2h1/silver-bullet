// #region docs
/**
 * 实现字符串的 repeat
 */
function repeat(str: string, numberOfTimes: number): string {
  return Array(numberOfTimes + 1).join(str);
}
// #endregion docs
export default repeat;