/**
 * 题目描述：
 *      输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。
 *      例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。
 *  分析：
 *      两次循环法，倒数第k个节点，即顺数第length - k + 1 个节点，由于是单链表，没有链表长度信息，因此第一步遍历链表，计算出链表长度。第二步，遍历链表到第length - k + 1个节点（index = length - k），需要遍历n + n - k +1步
 *      快慢指针法，快指针先走k步，然后快慢指针以相同的速度移动，直到快指针到null，只需要遍历n步（因为快指针走了n步）
 */
import { LinkNode } from '../设计链表/linkList';

// 两次遍历
function getKthFromEnd<T extends number>(head: LinkNode<T> | null, k: number): LinkNode<T> | null {
  let node = head;
  // 计算链表长度
  let size = 0;
  while (node !== null) {
    node = node.next;
    size = size + 1;
  }
  // 倒数第 k 个 节点，对应于正数第 size - k + 1 个节点，即 index = size - k
  const index = size - k;
  if (index < 0) return null;
  node = head;
  for (let i = 1; i <= index; i++) {
    node = node?.next as LinkNode<T>;
  }
  return node;
}

// 快慢指针
function getKthFromEnd2<T extends number>(head: LinkNode<T> | null, k: number): LinkNode<T> | null {
  let fast = head;
  let slow = head;
  let i = 0;
  while (i < k) {
    if (fast === null) {
      // 超出链表长度
      return null;
    }
    fast = fast.next;
    i = i + 1;
  }
  while (fast !== null) {
    // 快指针走到 null 的时候，慢指针即为倒数第 k 个 节点
    slow = slow?.next as LinkNode<T>;
    fast = fast.next;
  }
  return slow;
}
