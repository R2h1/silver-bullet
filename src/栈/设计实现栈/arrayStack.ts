/**
 * 设计实现栈
 */
// #region docs
// 数组栈
export default class ArrayStack<T> {
  items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * 入栈
   * @param item
   */
  push(item: T) {
    this.items.push(item);
  }

  /**
   * 出栈
   * @returns
   */
  pop() {
    if (this.isEmpty) throw new Error('栈空');
    return this.items.pop();
  }

  /**
   * 获取栈顶元素
   * @returns
   */
  peek() {
    if (this.isEmpty) throw new Error('栈空');
    return this.items[this.size - 1];
  }

  /**
   * 判空
   * @returns
   */
  get isEmpty() {
    return this.size === 0;
  }

  /**
   * 获取栈元素的个数
   * @returns
   */
  get size() {
    return this.items.length;
  }
}
// #endregion docs
