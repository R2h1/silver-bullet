/**
 * 题目描述：
 *      从若干副扑克牌中随机抽 5 张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。
 *  分析：
 *      需要保证 除 0 以外的最大值与最小值差值需要小于 5 且不能有非 0 以外的重复元素。
 *          Set +遍历，遍历数组，遇到 0 跳过，若Set中存在元素，不是顺子，否则加入集合中，求集合中的最大值最小值之差。
 *          排序 + 遍历，排序后遍历数组，统计大小王的个数即0的个数，计算最大值（最后一个元素）与最小值（第一个非0元素）之差。
 *          遍历，遍历统计 0 的个数，超过3个0 说明一定是顺子，若当前元素不是0，更新最大最小值，若最大值与最小值差值大于等于 5 或者后续元素存在重复与当前元素相同，则不是顺子。
 */

// 排序 + 遍历
function isStraight1(nums: number[]): boolean {
  const len = nums?.length;
  nums.sort((a, b) => a - b);
  const max = nums[len - 1];
  // 记录大小王的数量
  let joker = 0;
  for (let i = 0; i < len; i++) {
    const current = nums[i];
    const next = nums[i + 1];
    if (current === 0) {
      // 计算大小王的个数
      joker = joker + 1;
    } else if (current === next) {
      // 重复且非0, 不是顺子
      return false;
    }
  }
  const min = nums[joker];
  return max - min < 5; // 最差情况是全为 0 或者 4个 0 或者 少于4 个 0时差值不能大余5
}

// set + 遍历
function isStraight2(nums: number[]): boolean {
  const len = nums?.length;
  const set = new Set<number>();
  for (let i = 0; i < len; i++) {
    const current = nums[i];
    if (current === 0) continue;
    // 重复
    if (set.has(current)) return false;
    set.add(current);
  }
  return Math.max(...set) - Math.min(...set) < 5;
}

// 只遍历
function isStraight3(nums: number[]): boolean {
  const len = nums?.length;
  let joker = 0;
  let max = 0;
  let min = 14;
  for (let i = 0; i < len; i++) {
    const current = nums[i];
    if (current === 0) {
      joker = joker + 1;
      if (joker > 3) return true;
    } else {
      max = Math.max(current, max);
      min = Math.min(current, min);
      // 非0重复 或者 最大最小值之差大于等于5
      if (nums.lastIndexOf(current) > i || max - min >= 5) return false;
    }
  }
  return true;
}
