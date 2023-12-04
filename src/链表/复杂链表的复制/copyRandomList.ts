/**
 * 题目描述：
 *      请实现 copyRandomList 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 next 指针指向下一个节点，还有一个 random 指针指向链表中的任意节点或者 null
 *  分析：
 *      三次遍历+拆分，首先对复杂链表进行遍历，在每个节点后面复制一个与当前节点相同的节点（先不理会random指针），即1 -> 2->3-->4->5->null 变成 1 -> 1-> 2->2->3-->3->4->4->5->5->null；然后是再遍历一次原链表（即遍历步长为2），将random指针进行复制；最后再遍历一次，将原链表的节点指向原来的下一个节点，复制链表的节点指向下一个复制的节点，分离成原链表和复制链表，注意判断最后一个复制节点是否为null。
 *      两次遍历+哈希，可以在初次遍历的时候用哈希保存原节点到复制节点（只复制值）的映射，二次遍历时更新复制节点的next 和 random 指针为与原节点next和random指针对应的复制节点即可。
 */
// #region docs
import RandomLinkNode from '../设计链表/randomLinkNode';

// 三次遍历 + 拆分
function copyRandomList(head: RandomLinkNode | null) {
  // 复制每个节点插入到节点后面
  let node = head;
  while (node !== null) {
    const copyNode = new RandomLinkNode(node.val, node.next);
    node.next = copyNode;
    node = copyNode.next;
  }
  // 复制 random 指针
  node = head;
  while (node !== null && node.next !== null) {
    if (node.random !== null) {
      // 复制节点的 random 指针应该指向原节点的 random 指针指向的节点的下一节点
      node.next.random = node.random.next;
    }
    node = node.next.next;
  }
  // 将两个链表断开
  // 复制链表头结点
  const copyHead = head?.next;
  // 恢复原始链表
  node = head;
  while (node !== null && node.next !== null) {
    const copyNode = node.next;
    node.next = node.next.next;
    copyNode.next = copyNode.next?.next ?? null;
    node = node.next;
  }
  return copyHead;
}

// 哈希 + 两次遍历
function copyRandomList2(head: RandomLinkNode | null) {
  const map = new Map<RandomLinkNode, RandomLinkNode>();
  let node = head;
  while (node !== null) {
    map.set(node, new RandomLinkNode(node.val));
    node = node.next;
  }
  node = head;
  while (node !== null) {
    const copyNode = map.get(node) as RandomLinkNode;
    copyNode.next = node.next ? (map.get(node.next) as RandomLinkNode) : null;
    copyNode.random = node.random ? (map.get(node.random) as RandomLinkNode) : null;
    node = node.next;
  }
  return head !== null ? map.get(head) : null;
}
// #endregion docs
