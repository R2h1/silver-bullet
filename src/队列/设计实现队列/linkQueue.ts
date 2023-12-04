// #region docs
import LinkNode from '../../链表/设计链表/linkNode';

// 链表顺序队列
export default class LinkQueue<T> {
  // 队的长度
  size: number;

  // 队尾指针
  head: LinkNode<T> | null;

  // 队尾指针
  tail: LinkNode<T> | null;

  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  /**
   * 入队
   * @param item
   */
  enQueue(val: T) {
    const node = new LinkNode(val);
    if (this.size === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = this.tail!.next;
    }
    this.size += 1;
  }

  /**
   * 出队
   * @returns
   */
  deQueue() {
    if (this.size === 0) {
      // 队空
      throw new Error('队空');
    } else {
      // 队非空
      const node = this.head;
      this.head = node!.next;
      this.size -= 1;
      return node!.val;
    }
  }

  /**
   * 获取队头元素
   * @returns
   */
  peek() {
    if (this.size === 0) {
      // 队空
      throw new Error('队空');
    } else {
      return this.head!.val;
    }
  }

  /**
   * 判空
   * @returns
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * 获取队元素的个数
   * @returns
   */
  getSize() {
    return this.size;
  }
}
// #endregion docs
