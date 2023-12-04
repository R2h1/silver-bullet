/**
 * 题目描述：
 *      给定一个字符串 s ，请你找出其中不含有重复字符的最长子串的长度。
 *  分析：
 *      滑动窗口法，遍历字符串，判断当前字符是否在子串中，
 *              如果不在，将当前字符添加到子串末尾
 *              如果存在，将子串更新为存在所在位置后面的加上当前字符
 *              更新最长子串值
 */
// #region docs
function lengthOfLongestSubstring(s: string): number {
  const sLen = s.length;
  let subStr = '';
  let max = 0;
  for (let i = 0; i < sLen; i += 1) {
    // 当前字符
    const letter = s[i];
    // 当前字符在子串中的位置
    const pos = subStr.indexOf(letter);
    // 当前字符存在于子串中，更新子串 [pos + 1,]
    if (pos !== -1) {
      subStr = subStr.substring(pos + 1) + letter;
    } else {
      subStr += letter;
    }
    max = Math.max(subStr.length, max);
  }
  return max;
}
// #endregion docs
