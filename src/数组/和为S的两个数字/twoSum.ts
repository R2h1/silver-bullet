/**
 * 题目描述：
 *      输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。
 *  分析：
 *      哈希法（set，对象，map），一次遍历数组，哈希中若不存在目标值与当前元素的差值，则将其加入哈希，否则返回即可。
 *      双指针法，由于数组递增有序，可使用首尾指针向中间移动，如果相等则返回，否则分情况向中间移动指针——小于目标值移动首指针，否则移动右指针。
 *      二分查找，遍历元素，计算目标值与当前元素的差值，在该元素右侧二分查找是否存在即可。假如使用 indexOf （顺序遍历）进行查找会超时。
 */
// #region docs
// 哈希表 或者 set
function twoSum1(nums: number[], target: number): number[] {
  const len = nums?.length;
  const res: number[] = [];
  // 递增排序的数组，不存在相同元素，哈希表存储（元素，下标）
  const hash = new Map<number, number>(); // 可以使用 const hash = {} const set = new Set<number>();
  // 遍历元素，找到和为 target 的元素
  // i < len 考虑到 nums 非数组或长度小于2 的情况
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    const sub = target - element;
    // 由于遍历时加入存储中的是 i 之前的元素，自然排出当前元素。
    if (hash.has(sub)) {
      // 可以使用 set.has(sub) 或  hash[sub] !== undefined (考虑到差值是0)
      res.push(element, sub);
      return res;
    }
    // 设置为(数组元素， i)
    hash.set(element, i); // 可以 集合 set.add(element);  或者 对象 hash[element] = i;
  }
  return res;
}

// 双指针
function twoSum3(nums: number[], target: number): number[] {
  const res: number[] = [];
  let left = 0;
  let right = nums.length - 1; // 长度只访问一次，没必要缓存
  // 递增排序，计算首尾指针指向元素之和，如果相等则返回，否则分情况向中间移动指针
  // left < right 可以考虑到 nums 非数组或长度小于2 的情况
  while (left < right) {
    const leftNum = nums[left];
    const rightNum = nums[right];
    const sum = leftNum + rightNum;
    if (sum === target) {
      res.push(leftNum, rightNum);
      break;
    } else if (sum < target) {
      // 小于目标值，说明需要增加加数的值，移动左指针
      left += 1;
    } else {
      // 大于目标值，说明需要减少加数的值，移动右指针
      right -= 1;
    }
  }
  return res;
}

// 二分查找差值
function twoSum4(nums: number[], target: number): number[] {
  const len = nums?.length;
  const res: number[] = [];

  function binarySearch(left: number, right: number, target: number) {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] > target) {
        right = mid - 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        return mid;
      }
    }
    return -1;
  }

  // i < len 考虑到 nums 非数组或长度小于2 的情况
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    const sub = target - nums[i];
    if (binarySearch(i + 1, len - 1, sub) !== -1) {
      // 在当前元素右侧寻找即可
      res.push(element, sub);
      return res;
    }
  }
  return res;
}

// 遍历 + indexOf (超时，因为 indexOf 是 O（n）)
function twoSum5(nums: number[], target: number): number[] {
  const len = nums?.length;
  const res: number[] = [];
  // i < len 考虑到 nums 非数组或长度小于2 的情况
  for (let i = 0; i < len; i += 1) {
    const element = nums[i];
    const sub = target - nums[i];
    const indexOfSub = nums.indexOf(sub);
    if (![-1, i].includes(indexOfSub)) {
      // 存在且不等于当前下标
      res.push(element, sub);
      return res;
    }
  }
  return res;
}
// #endregion docs
