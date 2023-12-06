/**
 * 题目描述：
 *     如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。例如，
 *      [2,3,4] 的中位数是 3
 *      [2,3] 的中位数是 (2 + 3) / 2 = 2.5
 *  分析：
 *      冒泡/二分插入有序法，首先对于每个插入的元素，在插入时使其有序，取出时只需要取中间的数或中间两个数和的一半即可。
 *      大小根堆划分法，使用大根堆和小根堆分别保存较小和较大的一半，且在插入时保证，且小根堆比大根堆中元素个数多1或相等，如此一来，在取出时若两个堆元素个数相等，则中位数是两个堆顶元素的一半，否则是中位数是小根堆的堆顶。
 */
// #region docs
import Heap from '../堆的设计与实现/heap';

// 二分查找插入法
class MedianFinder {
  data: number[];

  // 或者使用一个大根堆和一个小根堆分别保存一半的元素
  minPart: Heap; // 较小的一半使用大根堆保存

  maxPart: Heap; // 较大的一半使用小根堆保存

  constructor() {
    this.data = [];
    this.minPart = new Heap('max');
    this.maxPart = new Heap('min');
  }

  /**
   * 从数据流中添加一个整数到数据结构中: 大小根堆法
   * @param num
   */
  addNumHeap(num: number): void {
    if (this.minPart.isEmpty() || num <= this.minPart.top()) {
      // 小于较小的一半
      this.minPart.insert(num);
      if (this.maxPart.getSize() + 1 < this.minPart.getSize()) {
        // 较小的一半中元素个数比较大的一半中元素少2个
        this.maxPart.insert(this.minPart.delete());
      }
    } else {
      this.maxPart.insert(num);
      if (this.maxPart.getSize() > this.minPart.getSize()) {
        // 较小的一半中元素个数比较大的一半中元素多1个
        this.minPart.insert(this.maxPart.delete());
      }
    }
  }

  /**
   * 从数据流中添加一个整数到数据结构中: 二分法
   * @param num
   */
  addNumBinary(num: number): void {
    const size = this.data.length;
    if (size === 0) {
      // 数据结构为空
      this.data.push(num);
      return;
    }
    let left = 0;
    let right = size - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2); // （left + right) >> 1;
      const midNum = this.data[mid];
      if (midNum === num) {
        // 在该位置插入
        this.data.splice(mid, 0, num);
        return;
      }
      if (midNum > num) {
        // 插入位置在 [left, mid - 1];
        right = mid - 1;
      } else {
        // 插入位置在 [mid + 1, right];
        left = mid + 1;
      }
    }
    this.data.splice(left, 0, num);
  }

  /**
   * 从数据流中添加一个整数到数据结构中: 冒泡法
   * @param num
   * @returns
   */
  addNumBubble(num: number): void {
    this.data.push(num);
    const size = this.data.length;
    for (let i = size - 2; i >= 0 && this.data[i] > this.data[i + 1]; i -= 1) {
      // 交换
      [this.data[i], this.data[i + 1]] = [this.data[i + 1], this.data[i]];
    }
  }

  /**
   * 返回目前所有元素的中位数: 二分法。
   */
  findMedianBinary(): number {
    const size = this.data.length;
    const mid = Math.floor(size / 2);
    if (size & 1) {
      // 奇数
      return (this.data[mid - 1] + this.data[mid]) / 2;
    }
    return this.data[mid];
  }

  /**
   * 返回目前所有元素的中位数。大小根堆法
   */
  findMedianHeap(): number {
    if (this.minPart.getSize() > this.maxPart.getSize()) {
      return this.minPart.top();
    }
    return (this.minPart.top() + this.maxPart.top()) / 2.0;
  }
}
// #endregion docs
