/**
 * 题目描述：
 *      给定一个链表，返回链表开始入环的第一个节点。 从链表的头节点开始沿着 next 指针进入环的第一个节点为环的入口节点。如果链表无环，则返回 null。
 *      为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。
 *      说明：不允许修改给定的链表。
 *  分析：
 *      哈希法，遍历链表，将节点不存在map中，放入map中，若已存在说明是环的入口节点，返回该节点，若遍历到链表末尾 null 若还无环，返回null。
 *      快慢指针法，遍历链表，快指针走两步，慢指针每次走一步，快慢指针必定在环内相遇，此时快指针走过 a + n(b + c) + b = a + (n+1)b + nc， 而慢指针走过的路程 a + b (因为一定还没走完环的第一圈)，
 *          两者满足 a + (n+1)b + nc = 2(a + b)，所以a = c + (n − 1)(b + c)，即链表头结点到环入口节点的距离 = 相遇点到环入口距离 + （n - 1）*环，只需要让两新指针分别从头结点和相遇节点单步出发，直到相遇即可。
 */
import { LinkNode } from '../设计链表/linkList';

// 哈希法
function detectCycle1(head: LinkNode<number> | null): LinkNode<number> | null {
  const map = new Map<LinkNode<number>, number>();
  let node = head;
  while (node !== null) {
    if (map.has(node)) {
      return node;
    }
    map.set(node, 1);
    node = node.next;
  }
  return null;
}

// 快慢指针法
function detectCycle2(head: LinkNode<number> | null): LinkNode<number> | null {
  let slow = head;
  let fast = head;
  while (slow !== null && fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // 相遇
      let nodeA = head;
      let nodeB = slow;
      while (nodeA !== null && nodeB !== null && nodeA !== nodeB) {
        // 两新指针再次相遇
        nodeA = nodeA.next;
        nodeB = nodeB.next;
      }
      return nodeA;
    }
  }
  return null;
}
