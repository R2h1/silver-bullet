/**
 * 题目描述：
 *      输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。
 *  分析：
 *      排序法，因为对于任意两个数 x 与 y， 若 xy > yx，说明 y应该在 x 前面，反之 y 应该在 x 前面；
 *             而且若 xy < yx 且 yz < zy 且 xz < zx, 则 xyz 最小: 因为 xyz < yxz < yzx < zyx,  xyz < xzy < zxy < zyx;
 */

// sort + join
function minNumber1(nums: number[]): string {
  // sort 的比较函数，当返回值大于 0 时 b 在前， a在后；小于 0 时 a 在前，b 在后
  return nums
    .sort((a, b) => {
      const strA = String(a);
      const strB = String(b);
      return strA + strB > strB + strA ? 1 : -1;
    })
    .join('');
}
