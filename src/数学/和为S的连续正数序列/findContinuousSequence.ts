/**
 * 题目描述：
 *      输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。
 *  分析：
 *      枚举法，连续序列至少两个数，序列起点不大于 target / 2，起点从 1 开始遍历到 不大于 target / 2结束，不断累加序列，若大于 target 跳出循环；若等于 target, 将 i 到 j 的所有数字构成的序列添加到结果数据中即可。
 *      求和公式法，target = （i + j）* (j - i + 1) / 2，其中 i , j 分别为序列的起点和终点。在已知 target 和 i 的情况下，通过求根公式计算出 j，当计算出的 j > i 且 j 是整数0，将 i 到 j 的所有数字构成的序列添加到结果数据中即可。
 *      滑动窗口法，使用双指针，设连续正整数序列的左边界 i 和右边界 j ，则可构建滑动窗口从左向右滑动。循环中，
 *          每轮判断滑动窗口内元素和与目标值 target 的大小关系，若相等则记录结果并移动左边界 i （以减小窗口内的元素和），若大于 target 则移动左边界 i （以减小窗口内的元素和），若小于 target 则移动右边界 j （以增大窗口内的元素和）。
 */
// #region docs
// 枚举法
function findContinuousSequence1(target: number): number[][] {
  // 连续序列至少两个数，序列起点 不大于 target / 2
  const limit = target / 2;
  const res: number[][] = [];
  for (let i = 1; i < limit; i += 1) {
    let j = i;
    let sum = 0;
    while (true) {
      sum += j;
      if (sum > target) {
        break;
      } else if (sum === target) {
        res.push(
          new Array(j - i + 1).fill(i).map((item, index) => {
            return item + index;
          })
        );
        break;
      }
      j += 1;
    }
  }
  return res;
}

// 公式法
function findContinuousSequence2(target: number): number[][] {
  // 连续序列至少两个数，序列起点 不大于 target / 2
  const limit = target / 2;
  const res: number[][] = [];
  for (let i = 1; i < limit; i += 1) {
    const j = (-1 + Math.sqrt(1 + 4 * (2 * target + i * i - i))) / 2;
    const sum = 0;
    if (j > i && j === Math.floor(j)) {
      res.push(
        new Array(j - i + 1).fill(i).map((item, index) => {
          return item + index;
        })
      );
    }
  }
  return res;
}

// 滑动窗口法（双指针）
function findContinuousSequence3(target: number): number[][] {
  // 滑动窗口左右指针初始值
  let left = 1;
  let right = 2;
  let sum = 3;
  const res: number[][] = [];
  while (left < right) {
    if (sum === target) {
      res.push(
        new Array(right - left + 1).fill(left).map((item, index) => {
          return item + index;
        })
      );
    }
    if (sum >= target) {
      sum -= left;
      left += 1;
    } else {
      right += 1;
      sum += right;
    }
  }
  return res;
}
// #endregion docs
