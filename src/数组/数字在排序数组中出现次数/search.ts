/**
 * 题目描述：
 *      统计一个数字在排序数组中出现的次数。
 *  分析：
 *      indexOf + lastIndexOf，找到排序数组中出现该数字的首尾下标，计算即可，需要使用indexOf 判断是否存在该数字。
 *      遍历计数，通过一次遍历设置一个标志flag，初始为 false，当和目标值相等置为true，再次不等于目标值时，即可跳出循环。
 *      正则法，使用join函数以#分割转换为字符串，在末尾新增一个 #，正则match匹配 ’目标数字#’的结果数组的长度即可。
 *      二分法，首先找到目标数字，然后向两边进行搜索即可。
 */

// indexOf + lastIndexOf
function search1(nums: number[], target: number): number {
  const startIndex = nums?.indexOf(target);
  const endIndex = nums?.lastIndexOf(target);
  if (startIndex === -1) return 0;
  return endIndex - startIndex + 1;
}

// 遍历计数
function search2(nums: number[], target: number): number {
  const len = nums?.length;
  let count = 0;
  // 是否是 target, 用于恰好大于target的时候退出循环；
  let flag = false;
  for (let i = 0; i < len; i++) {
    const element = nums[i];
    if (element === target) {
      count = count + 1;
      flag = true;
    } else if (flag) {
      break;
    }
  }
  return count;
}

// 正则 + join
function search3(nums: number[], target: number): number {
  const reg = new RegExp(target + '#', 'g');
  const numsStr = nums.join('#') + '#';
  const count = numsStr.match(reg)?.length ?? 0;
  return count;
}

// 二分法
function search4(nums: number[], target: number): number {
  const len = nums?.length;
  let left = 0;
  let right = len - 1;
  let count = 0;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2); // ( left + right ) >> 1
    const element = nums[mid];
    if (element > target) {
      // 在 [mid + 1, right]
      left = mid + 1;
    } else if (element < target) {
      // 在[left, mid - 1]
      right = mid - 1;
    } else {
      // 在 [mid] 两侧
      count = 0;
      let low = mid;
      let high = mid + 1;
      while (low >= left) {
        if (nums[low] === target) {
          count = count + 1;
        }
        low = low - 1;
      }
      while (high <= right) {
        if (nums[high] === target) {
          count = count + 1;
        }
        high = high + 1;
      }
      break;
    }
  }
  return count;
}
