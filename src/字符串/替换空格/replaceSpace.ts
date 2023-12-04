/**
 * 题目描述：
 *      请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
 *  分析：
 *      对于一个字符串，空格可能出现在开头，末尾，或者不含空格的子串之间，
 *          1. 最直观的方法是遍历字符串，遇到空格即替换，由于字符串在JavaScript中属于不可变，需使用新字符串进行连接操作。
 *          2. 正则表达式方法：str.replace(pattern, replaceStr)
 *          3. 数组map方法：
 *               a. 原字符串变成数组
 *               b. map数组替换空格
 *               c. 替换后数组变成字符串
 *          4. 双指针算法：
 *               a. 遍历原字符串计算出替换后的字符串长度，并生成该长度数组newStrArr
 *               b. 两个指针：i指向原字符串， j指向新字符串
 *               c. str[i] 非空格即将str[i++]放入newStrArr[j++]; str[i]是空格，将’%20’三个字符依次放入newStrArr[j++]
 *               d. 数组变成字符串newStrArr.join('')。从过程看，方法和数组map类似。
 */

// 正则表达式
function replaceSpace1(s: string): string {
  return s.replace(/ /g /* new RegExp(' ', 'g') */, '%20');
}

// 暴力法
function replaceSpace2(s: string): string {
  let res = '';
  const len = s.length;
  for (let i = 0; i < len; i += 1) {
    res += s[i] === ' ' ? '%20' : s[i];
  }
  return res;
}

// split + map + join
function replaceSpace3(s: string): string {
  return s
    .split('')
    .map((item) => {
      return item === ' ' ? '%20' : item;
    })
    .join('');
}
