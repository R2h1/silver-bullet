/**
 * 题目描述：
 *      输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。
 *      输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
 *      如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
 *  分析：
 *      trim + split + reverse + join，trim 去掉首尾空格，用单个或多个空格进行split划分为单词数组，随后进行 reverse 翻转，最后使用 join以空格拼接, 其中 reverse 如果自己实现，可以使用双指针首尾交换。而 join, split，trim 都是遍历即可
 *      遍历法，首先去掉首尾空格再遍历字符串，若当前字符是空格说明单词边界，更新反转字符串，遍历结束后再更新一次反转字符串即可。
 */
// #region docs
// trim + split + reverse + join
function reverseWords1(s: string): string {
  return s.trim().split(/\s+/).reverse().join(' ');
}

// 遍历
function reverseWords2(s: string): string {
  const len = s?.length;
  let left = 0;
  let right = len - 1;
  // 去掉前面空格
  while (left <= right && s[left] === ' ') {
    left += 1;
  }
  // 去掉尾部空格
  while (right >= left && s[right] === ' ') {
    right -= 1;
  }
  let word = '';
  let words = '';
  // 遍历找到单词边界，入队首
  while (left <= right) {
    const char = s[left];
    if (char === ' ' && word.length) {
      words = word + (words.length ? ' ' : '') + words;
      word = '';
    } else if (char !== ' ') {
      word += char;
    }
    left += 1;
  }
  words = word + (words.length ? ' ' : '') + words;
  return words;
}
// #endregion docs
