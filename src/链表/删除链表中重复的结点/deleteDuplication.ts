/**
 * 题目描述：
 *      1. 给定一个已排序的链表的头head， 删除所有重复的元素，使每个元素只出现一次 。返回 已排序的链表 例如，链表 1->2->3->3->4->4->5 处理后为 1->2->3->4->5.
 *      2. 给定一个已排序的链表的头head， 删除原始链表中所有重复数字的节点，只留下不同的数字。返回已排序的链表。 例如，链表1->2->3->3->4->4->5 处理后为 1->2->5.
 *  分析：
 *      均为一次遍历，
 *          对于重复节点保留的情况，从头节点开始遍历，判断当前节点下一个节点是否等于当前节点，如果相等，则当前节点的下一节点为下下节点，直到不等于或者当前节点下一节点为空。
 *          对于重复节点不保留的情况，考虑到头节点可能重复，在链表前添加一个虚节点，从该节点开始遍历，当next节点和 next.next节点不为空时，若next节点和next.next节点的值相等，记录该值，不断将当前节点的next指向为next.next节点，直到next节点值不等于该值或next为空
 *
 */
// #region docs
import LinkNode from '../设计链表/linkNode';

// 保留重复节点
function deleteDuplicates1(head: LinkNode<number> | null): LinkNode<number> | null {
  let node = head;
  while (node !== null) {
    while (node.next !== null && node.val === node.next.val) {
      node.next = node.next.next;
    }
    node = node.next;
  }
  return head;
}

// 不保留重复节点
function deleteDuplicates2(head: LinkNode<number> | null): LinkNode<number> | null {
  // 虚头节点
  const dummy = new LinkNode(-1, head);
  let node = dummy;
  while (node.next !== null && node.next.next !== null) {
    if (node.next.val === node.next.next.val) {
      const { val } = node.next;
      while (node.next !== null && node.next.val === val) {
        node.next = node.next.next;
      }
    } else {
      node = node.next;
    }
  }
  return dummy.next;
}
// #endregion docs
