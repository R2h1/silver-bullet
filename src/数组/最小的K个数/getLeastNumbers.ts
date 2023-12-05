/**
 * 题目描述：
 *      输入整数数组 arr ，找出其中最小的 k 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。
 *  分析：
 *      排序法，排序后取前 k 个。
 *      分区法，以k为界限，遍历后半部分元素，若当前元素大于前 k 个元素中的最大值 max ，当前元素替换掉最大值 max。
 *      大根堆法，维护一个 k 个 大小的大根堆，现将前k个元素入堆，然后遍历其余元素，若当前元素小于堆顶，就将堆顶元素弹出，当前元素入堆即可。
 */
// #region docs
import Heap from '../../堆/堆的设计与实现/heap';

// 排序法
function getLeastNumbers1(arr: number[], k: number): number[] {
  arr.sort((a, b) => a - b);
  return arr.slice(0, k);
}

// 分区法
function getLeastNumbers2(arr: number[], k: number): number[] {
  const len = arr.length;
  // 数组长度不大于 k，直接输出该数组
  if (len <= k) return arr;
  const indexOfMax = (array: number[]): number => array.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0);
  const help = arr.slice(0, k);
  // k 个元素中最大元素的下标和值
  let maxIndex = indexOfMax(help);
  let max = help[maxIndex];
  for (let i = k; i < len; i += 1) {
    if (arr[i] < max) {
      // 当前元素比堆中最大元素更小，替换掉前k个元素中的最大元素
      help[maxIndex] = arr[i];
      maxIndex = indexOfMax(help);
      max = help[maxIndex];
    }
  }
  return help;
}

// 大根堆法
function getLeastNumbers3(arr: number[], k: number): number[] {
  const len = arr.length;
  // 数组长度不大于 k，直接输出该数组
  if (len <= k) return arr;
  if (k === 0) return [];
  const res: number[] = [];
  const heap = new Heap(); // 大根堆
  for (let i = 0; i < len; i += 1) {
    const element = arr[i];
    if (i < k) {
      heap.insert(element);
    } else if (element < heap.top()) {
      heap.delete();
      heap.insert(element);
    }
  }
  for (let i = 0; i < k; i += 1) {
    res.push(heap.delete());
  }
  return res;
}
// #endregion docs
