/**
 * 题目描述：
 *      输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。
 *  分析：
 *      递归，两个有序链表的合并结果等于头部值较小的一个节点与两个链表剩下节点的合并结果进行链接，边界条件是其中一个链表为空，则直接返回另一个链表即可。
 *      迭代，首先，若其中一个链表为空，则直接返回另一个链表即可，否则构建一个虚拟头结点新链表，双指针分别遍历两个链表，将较小的节点链接到新链表，并移动该较小节点所在指针，直到其中一个链表遍历结束。
 */
import { LinkNode } from '../设计链表/linkList';

// 递归
function mergeTwoLists<T extends number>(l1: LinkNode<T> | null, l2: LinkNode<T> | null): LinkNode<T> | null {
  // 其中一个链表为空，则返回另一个即可
  if (l1 === null || l2 === null) {
    return l1 || l2;
  }
  // 合并后的链表头结点
  let l: LinkNode<T> | null = null;
  if (l1.val <= l2.val) {
    l = l1;
    l.next = mergeTwoLists(l1.next, l2);
  } else {
    l = l2;
    l.next = mergeTwoLists(l1, l2.next);
  }
  return l;
}

// 双指针遍历
function mergeTwoLists1<T extends number>(l1: LinkNode<T> | null, l2: LinkNode<T> | null): LinkNode<number> | null {
  // 其中一个链表为空，则返回另一个即可
  if (l1 === null || l2 === null) {
    return l1 || l2;
  }
  // 新链表的虚拟头结点
  const preHead = new LinkNode(-1);
  let prev = preHead;
  while (l1 !== null && l2 !== null) {
    // 遍历到其中一个末尾
    if (l1.val <= l2.val) {
      prev.next = l1;
      l1 = l1.next;
    } else {
      prev.next = l2;
      l2 = l2.next;
    }
    prev = prev.next;
  }
  // 将另一链表直接添加到末尾
  prev.next = l1 === null ? l2 : l1;

  return preHead.next;
}
