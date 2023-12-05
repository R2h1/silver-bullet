/**
 * 题目描述：
 *      给定一个二叉树的其中一个结点，请找出中序遍历顺序的下一个结点并且返回。注意，树中的结点不仅包含左右子结点，同时包含指向父结点的 next 指针。
 *  分析：
 *     迭代遍历法，
 *          1. 若该节点 node 是 null，显然不存在下一节点；
 *          2. 若该节点 node 有右子树，下一节点为右子树中的最左节点，向左遍历直到左子树为空的节点即为下一节点；
 *          3. 若该节点 node 不存在右子树，则向上不断遍历父节点，直到当前节点的父节点的左孩子是该节点，返回此父节点; 若找不到（遍历到根节点），说明节点 node 已是中序遍历的最后一个节点。返回 null;
 */
// #region docs
class TreeLinkNode {
  val: number;

  left: TreeLinkNode | null;

  right: TreeLinkNode | null;

  next: TreeLinkNode | null;

  constructor(val?: number, left?: TreeLinkNode | null, right?: TreeLinkNode | null, next?: TreeLinkNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
    this.next = next === undefined ? null : next;
  }
}

// 遍历
function GetNext(node: TreeLinkNode | null) {
  // 该节点 null 不存在下一节点
  if (node === null) return null;
  if (node.right !== null) {
    // 该节点有右子树，下一节点为右子树中的最左节点
    let nextNode = node.right;
    while (nextNode.left !== null) {
      // 向左遍历直到左子树为空
      nextNode = nextNode.left;
    }
    return nextNode;
  }
  // 该节点没有右子树
  while (node.next !== null) {
    // 向上不断找父节点
    if (node.next.left === node) {
      // 直到当前节点的父节点的左孩子是该节点，返回当前节点父节点
      return node.next;
    }
    node = node.next;
  }
  // 找到根节点，其没有父节点，说明 node 是中序遍历的最后一个节点
  return null;
}
// #endregion docs
