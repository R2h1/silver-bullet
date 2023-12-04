/**
 *  题目描述：
 *      设计单向链表的实现。单链表中的节点应该具有两个属性：val 和 next。val 是当前节点的值，next 是指向下一个节点的指针/引用。假设链表中的所有节点都是 0 ~ index 的。
 */

// #region docs
import LinkNode from './linkNode';

export default class MyLinkedList<T> {
  size: number; // 链表长度

  head: LinkNode<T> | null; // 头结点

  constructor() {
    this.size = 0;
    this.head = null;
  }

  /**
   * 获取链表中 index 位置的节点。如果索引无效，则返回 null。
   * @param index
   */
  getNode(index: number): LinkNode<T> | null {
    if (index < 0 || index >= this.size) {
      return null;
    }
    // index 有效，所以 node.next 和 node.val 是存在的。
    let node = this.head as LinkNode<T>;
    for (let i = 0; i < index; i += 1) {
      node = node.next as LinkNode<T>;
    }
    return node;
  }

  /**
   * 获取链表中 index 位置的节点值。如果索引无效，则返回-1。
   * @param index
   */
  get(index: number): T | -1 {
    const node = this.getNode(index);
    return node?.val ?? -1;
  }

  /**
   * 在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点。
   * @param val
   */
  addAtHead(val: T): void {
    const newHead = new LinkNode(val);
    newHead.next = this.head;
    this.head = newHead;
    this.size += 1;
  }

  /**
   * 将值为 val 的节点追加到链表的最后一个元素。
   * @param val
   */
  addAtTail(val: T): void {
    const oldTailNode = this.getNode(this.size - 1);
    const newTailNode = new LinkNode(val);
    this.size += 1;
    if (oldTailNode === null) {
      this.head = new LinkNode(val);
      return;
    }
    oldTailNode.next = newTailNode;
  }

  /**
   * 在链表中的 index 位置之前添加值为 val 的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果 index 小于0，则在头部插入节点。
   * @param index
   * @param val
   */
  addAtIndex(index: number, val: T): void {
    if (index > this.size) return;
    // 尾插
    if (index === this.size) {
      this.addAtTail(val);
      return;
    }
    // 头插
    if (index < 0) {
      this.addAtHead(val);
      return;
    }
    const prevNode = this.getNode(index - 1) as LinkNode<T>;
    const node = new LinkNode(val);
    node.next = prevNode.next;
    prevNode.next = node;
    this.size += 1;
  }

  /**
   * 如果索引 index 有效，则删除链表中的第 index 个节点。
   * @param index
   */
  deleteAtIndex(index: number): void {
    // index 无效
    if (index < 0 || index >= this.size || this.size === 0) return;
    this.size -= 1;
    // 删除头节点
    if (index === 0) {
      this.head = this.head?.next as LinkNode<T> | null;
      return;
    }
    const prevNode = this.getNode(index - 1) as LinkNode<T>;
    const deleteNode = prevNode.next as LinkNode<T>;
    prevNode.next = deleteNode.next;
  }
}

// #endregion docs
