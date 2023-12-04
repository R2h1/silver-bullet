/**
 * 题目描述：
 *      输入一个字符串，打印出该字符串中出现次数最多的字符和次数。
 *  分析：
 *      哈希计数，首先遍历字符串，统计所有字符的出现次数，然后再遍历哈希，将其中等于最大出现次数的字符放入结果数组中。
 */
// #region docs
function mostRepeatedChar(s: string): [string[], number] {
  const repeated: string[] = [];
  const map = new Map<string, number>();
  let maxCount = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const count = map.has(char) ? (map.get(char) as number) + 1 : 1;
    map.set(char, count);
    if (count > maxCount) maxCount = count;
  }
  for (const [key, value] of map) {
    if (value === maxCount) {
      repeated.push(key);
    }
  }
  return [repeated, maxCount];
}
// #endregion docs
