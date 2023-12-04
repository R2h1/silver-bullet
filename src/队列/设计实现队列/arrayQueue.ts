// #region docs
// 数组实现顺序队列
export default class ArrayQueue<T> {
  items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * 入队
   * @param item
   */
  push(item: T) {
    this.items.push(item);
  }

  /**
   * 出队
   * @returns
   */
  pop() {
    if (this.isEmpty()) throw new Error('队列空');
    return this.items.shift();
  }

  /**
   * 获取队顶元素
   * @returns
   */
  peek() {
    if (this.isEmpty()) throw new Error('队列空');
    return this.items[0];
  }

  /**
   * 判空
   * @returns
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * 获取队元素的个数
   * @returns
   */
  getSize() {
    return this.items.length;
  }
}
// #endregion docs
