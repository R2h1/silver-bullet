/**
 * 题目描述：
 *      在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。
 *  分析：
 *      哈希计数，首先遍历一遍字符串，若哈希中存在该字符则设置为false，说明重复，否则设置为true。然后可以二次遍历字符，若哈希值为true即可，或者map会记住插入顺序，遍历map找到值为true的即可。
 *      indexOf + lastIndexOf，遍历字符串，当前字符首次出现和最后一次出现的位置相同的即为第一个只出现一次的字符。
 */
// #region docs
// 哈希 + 两次遍历
function firstUniqChar1(s: string): string {
  const map = new Map<string, boolean>();
  const len = s?.length;
  for (let i = 0; i < len; i += 1) {
    const char = s[i];
    if (map.has(char)) {
      // 哈希中存在该字符，说明出现超过一次，设为false
      map.set(char, false);
    } else {
      map.set(char, true);
    }
  }
  for (let i = 0; i < len; i += 1) {
    const char = s[i];
    if (map.get(char)) {
      // 二次遍历哈希中该字符对应值为 true
      return char;
    }
  }
  // // 由于map能记住键的原始插入顺序
  // for (let [key, value] of map.entries()) {
  //     if (value) {
  //         return key;
  //     }
  // }
  return ' '; // 找不到返回单空格
}

// indexof + lastIndexOf
function firstUniqChar2(s: string): string {
  const len = s?.length;
  for (let i = 0; i < len; i += 1) {
    const char = s[i];
    if (s.indexOf(char) === s.lastIndexOf(char)) {
      return char;
    }
  }
  return ' '; // 找不到返回单空格
}
// #endregion docs
