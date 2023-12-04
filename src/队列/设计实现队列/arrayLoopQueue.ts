// #region docs
// 数组循环队列
export default class LoopQueue {
  // 存放元素的数组
  values: (number | undefined)[];

  // 当前元素个数
  count: number;

  // 队的长度
  capacity: number;

  // 队尾
  head: number;

  // 队尾
  tail: number;

  constructor(capacity: number) {
    this.head = 0;
    this.tail = 0;
    this.capacity = capacity;
    this.count = 0;
    this.values = new Array(capacity);
  }

  /**
   * 入队
   * @param item
   */
  enQueue(val: number) {
    if (this.isFull()) {
      throw new Error('队满');
    }
    this.values[this.tail] = val;
    this.tail = (this.tail + 1) % this.capacity;
    this.count += 1;
    return true;
  }

  /**
   * 出队
   * @returns
   */
  deQueue(): number {
    if (this.isEmpty()) {
      throw new Error('队空');
    }
    const value = this.values[this.head] as number;
    this.values[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count -= 1;
    return value;
  }

  /**
   * 获取队头元素
   * @returns
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('队空');
    }
    const value = this.values[this.head];
    return value;
  }

  /**
   * 判空
   * @returns
   */
  isEmpty() {
    // 或 return this.head === this.tail
    return this.count === 0;
  }

  /**
   * 判满
   * @returns
   */
  isFull() {
    // 或 return this.head === (this.tail + 1) % this.capacity
    return this.count === this.capacity - 1;
  }

  /**
   * 获取队元素的个数
   * @returns
   */
  getSize() {
    return this.count;
  }

  /**
   * 清空队列
   * @returns
   */
  clear() {
    this.head = 0;
    this.tail = 0;
    this.count = 0;
    this.values = new Array(this.capacity);
    return true;
  }
}
// #endregion docs
