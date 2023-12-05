/**
 * 题目描述：
 *      一个整型数组 nums 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。
 *  分析：
 *      哈希计数，首遍遍历在哈希表中统计所有数字的出现次数，二次遍历找到哈希表中只出现一次的两个数字即可。
 *      indexOf + lastIndexOf，遍历数组的元素，找到首次和最后一次出现下标相同的元素即可。
 *      异或运算，相同数组的异或结果为0，而任意数字和0的异或结果为本身，因此遍历数组计算所有元素的异或结果即为不同的两个元素的异或结果，
 *                该异或结果中为1的位可以用来区分这两个不同的数字。将异或结果依次从低位到高位进行与运算找到任意一个为1的位divider，
 *                再次遍历数组元素，利用divider 和每个元素与运算来进行分组异或得到最终结果。
 */
// #region docs
// 哈希计数
function singleNumbers1(nums: number[]): number[] {
  const len = nums?.length;
  // 进行计数
  const countMap: Record<number, number> = {};
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    const count = countMap[element];
    if (count) {
      countMap[element] = count + 1;
    } else {
      countMap[element] = 1;
    }
  }
  // 二次遍历找到出现次数为1的
  const singles: number[] = [];
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (countMap[element] === 1) {
      singles.push(element);
    }
  }
  return singles;
}

// indexOf + lastIndexOf（耗时过长)
function singleNumbers2(nums: number[]): number[] {
  const len = nums?.length;
  const singles: number[] = [];
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (nums.indexOf(element) === nums.lastIndexOf(element)) {
      // 首次出现与最后一次出现的下标相同
      singles.push(element);
    }
  }
  return singles;
}

// 异或运算
function singleNumbers3(nums: number[]): number[] {
  const len = nums?.length;
  // 对所有数字进行异或，得到这两个不同数字的异或结果
  let singlesXor = 0;
  for (let i = 0; i < len; i++) {
    singlesXor ^= nums[i];
  }
  if (singlesXor === 0) return [];
  // 将异或结果与 1 依次进行按位与运算，找到任意位为 1 的 divider
  let divider = 1;
  while ((singlesXor & divider) === 0) {
    divider <<= 1;
  }
  let first = 0;
  let second = 0;
  // 与 divider 进行与运算，进行分组,
  // 相同数字在 divider 中 为 1的那一位 是相同的，肯定分在同一组
  // 不同的那两个数字，由于异或结果 singleXor 在 divider 为 1 的位置也为 1，表示这个位置处两个数字必是不同的 0 和 1
  // 如此一来，与 divider 与运算的结果必然不同而分在不同的组
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if ((element & divider) === 0) {
      first ^= element;
    } else {
      second ^= element;
    }
  }
  return [first, second];
}
// #endregion docs
