/**
 * 题目描述：
 *     给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
 *     你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
 *     提示：
 *     1. 1 <= nums.length <= 3 * 104
 *     2. -3 * 104 <= nums[i] <= 3 * 104
 *     3. 除了某个元素只出现一次以外，其余每个元素均出现两次。
 * 分析：
 *     位运算法，任何数和 0 做异或运算，结果仍然是原来的数；任何数和其自身做异或运算，结果是 0；异或运算满足交换律和结合律。因此数组中的全部元素的异或运算结果即为数组中只出现一次的数字。
 */
// #region docs
/**
 * @param nums 数字数组
 * @example
 *  singleNumber([2,2,1]) // 1;
 *  singleNumber([1]) // 1;
 *  singleNumber([4,1,2,1,2]) // 4;
 */
function singleNumber(nums: number[]): number {
  return nums.reduce((acc, cur) => acc ^ cur, 0);
}
// #endregion docs
