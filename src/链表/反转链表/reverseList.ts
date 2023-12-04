/**
 * 题目描述：
 *      定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。
 *  分析：
 *      原地反转，定义前驱节点，当前节点，遍历链表，然后缓存后驱节点，将当前节点链接到前驱节点，然后先更新前驱节点为当前节点，再更新当前节点为后驱节点，直到遍历结束返回前驱节点即可。
 */

import { LinkNode } from '../设计链表/linkList';

// 原地反转
function reverseList1<T extends number>(head: LinkNode<T> | null): LinkNode<T> | null {
  // 当前节点
  let currentNode = head;
  // 上一节点
  let prevNode: LinkNode<T> | null = null;
  while (currentNode !== null) {
    // 首先缓存下一节点
    const nextNode = currentNode.next;
    // 当前节点指向上一节点
    currentNode.next = prevNode;

    // 更新当前节点和上一节点, 直到当前节点变成 null， 上一节点即为尾节点
    prevNode = currentNode;
    currentNode = nextNode;
  }
  return prevNode;
}

// 递归
function reverseList2<T extends number>(head: LinkNode<T> | null): LinkNode<T> | null {
  if (head == null || head.next == null) {
    return head;
  }
  const newHead = reverseList2(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
