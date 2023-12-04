/**
 * 题目描述：
 *      输入两个链表，找出它们的第一个公共节点。
 *  分析：
 *      长短diff遍历法，两个链表的公共节点是指从公共节点开始的所有节点是两个链表的共有部分（节点的存储地址相同，因此判断节点对象是否相等）。既然公共节点及其之后的节点完全相同，即不同的是公共节点之前的部分，
 *      也就可能存在一个长度差 diff，通过遍历两个链表的长度可以求出diff，让长的链表先遍历diff个节点，以此开始的两个链表的长度相同，那么当遍历到相同节点即第一个公共节点。
 *
 */
// #region docs
import LinkNode from '../设计链表/linkNode';

// 长短diff遍历法
function getIntersectionNode(headA: LinkNode<number> | null, headB: LinkNode<number> | null): LinkNode<number> | null {
  // 求链表长度
  function getSize<T>(head: LinkNode<T> | null): number {
    let node: LinkNode<T> | null = head;
    let size = 0;
    while (node !== null) {
      node = node.next;
      size += 1;
    }
    return size;
  }
  const lenA = getSize(headA);
  const lenB = getSize(headB);
  // 短链表和长链表
  let short = lenA > lenB ? headB : headA;
  let long = lenA > lenB ? headA : headB;
  const diff = Math.abs(lenA - lenB);
  // 长链表先走 diff 步
  for (let i = 0; i < diff && long !== null; i += 1) {
    long = long.next;
  }
  while (short !== null && long !== null && short !== long) {
    short = short.next;
    long = long.next;
  }
  return short;
}
// #endregion docs
