/**
 * 题目描述：
 *      输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。
 *  分析：
 *      反转法，从尾到头将链表节点值打印成数组array，比如 1 -> 2 -> 3 -> 4 -> 5 -> null, 打印为 [5, 4, 3, 2, 1]，遍历节点并将节点值依次放入数组中，直到遍历完成，最后反转数组即可。
 *      也可以利用栈后进先出的特点，将节点从头到尾一次入栈，然后再依次出栈即可。
 */
// #region docs
import LinkNode from '../设计链表/linkNode';

// 遍历 + 反转法
function reversePrint1<T extends number>(head: LinkNode<T> | null): number[] {
  let node = head;
  const res: number[] = [];
  while (node !== null) {
    res.push(node.val);
    node = node.next;
  }
  return res.reverse();
}

// 栈
function reversePrint2<T extends number>(head: LinkNode<T> | null): number[] {
  let node = head;
  // 栈
  const stack: LinkNode<T>[] = [];
  const res: number[] = [];
  while (node !== null) {
    stack.push(node);
    node = node.next;
  }
  const size = stack.length;
  for (let i = 0; i < size; i += 1) {
    res.push(stack.pop()?.val as number);
  }
  return res;
}
// #endregion docs
