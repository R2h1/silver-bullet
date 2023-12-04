/**
 * 题目描述：
 *      字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。
 *  分析：
 *      拼接法，将 [n,] 与 [0, n - 1] 的字符串拼接起来即可，n 超出 字符串长度 即 [0, n - 1]
 */
// #region docs
// 拼接法
function reverseLeftWords(s: string, n: number): string {
  // 考虑到 n >= len 以及 s 为空的情况
  return s.slice(n) + s.slice(0, n);
}
// #endregion docs
