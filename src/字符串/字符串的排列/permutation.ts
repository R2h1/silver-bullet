/**
 * 题目描述：
 *      输入一个字符串，打印出该字符串中字符的所有排列。你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。
 *  分析：
 *      如输入字符串abc,则打印出由字符a,b,c所能排列出来的所有字符串[abc, acb, bac, bca, cab, cba]。
 *      实现思路是原问题划分为小的子问题，即遍历每个字母，该字母依次连接除该字母的子字符串的排列结果，
 *      比如：‘a’ +  [‘ bc’,  ‘cb’]。子字符串只有一个字母的时候直接返回当前字母[str]。
 */

// 递归 + set去重
function permutation(s: string): string[] {
  const len = s?.length;
  const res: string[] = [];
  // 长度为 1 时， 排列为本身
  if (len === 1) return [s];
  for (let i = 0; i < len; i++) {
    // 子串
    const subStr = s.slice(0, i) + s.slice(i + 1);
    // 子串的全排列结果
    const subRes = permutation(subStr);
    const subResLen = subRes.length;
    for (let j = 0; j < subResLen; j++) {
      subRes[j] = subRes[j] + s[i];
    }
    res.push(...subRes);
  }
  return [...new Set(res)];
}
