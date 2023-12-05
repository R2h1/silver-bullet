/**
 * 题目描述：
 *      输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。
 *      链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。“head” 表示指向链表中有最小元素的节点。
 *      特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。
 *  分析：
 *      中序遍历递归法，二叉搜索树的中序遍历即递增有序。
 *          1. 首先递归遍历左子树；
 *          2. 遍历到当前节点时，判断若是最左节点，说明是双向链表的头结点，否则将前驱节点的后驱指向当前遍历节点，当前节点的前驱指向 pre，更新前驱节点 pre 为 当前遍历节点。
 *          3. 然后递归遍历右子树；
 *          4. 最后递归结束，将头结点 head 的前驱指向最后一个节点 pre，将最后一个节点 pre 的后驱指向头结点 head。
 *      中序遍历迭代法，利用栈来迭代中序遍历，出栈时执行和递归中遍历当前节点相同的操作，同样，遍历结束后，将头结点 head 的前驱指向最后一个节点 pre，将最后一个节点 pre 的后驱指向头结点 head。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 中序遍历递归法
function treeToDoublyList1(root: TreeNode<number> | null): TreeNode<number> | null {
  // 空树 返回 null
  if (root === null) return null;
  // 执行双向链表的头结点
  let head: any = null;
  // 当前遍历节点的前驱节点
  let pre: any = null;
  function dfs(node: TreeNode<number> | null): void {
    if (node === null) return;
    const { left, right } = node;
    // 遍历左子树
    dfs(left);
    // 处理当前节点
    if (pre === null) {
      // 最左节点 （或者用 head === null 判断)
      head = node;
    } else {
      // 前驱节点的后驱指向当前遍历节点
      pre.right = node;
    }
    // 当前节点的前驱节点为 pre
    node.left = pre;
    // 更新当前遍历节点的前驱节点
    pre = node;
    // 遍历右子树
    dfs(right);
  }
  dfs(root);
  // 设置头结点的前驱指向最后一个节点
  if (head) {
    head.left = pre;
  }
  // 设置最后一个节点的后驱指向头结点
  if (pre) {
    pre.right = head;
  }
  return head;
}

// 中序遍历迭代法
function treeToDoublyList2(root: TreeNode<number> | null): TreeNode<number> | null {
  // 空树 返回 null
  if (root === null) return null;
  // 执行双向链表的头结点
  let head: any = null;
  // 当前遍历节点的前驱节点
  let pre: any = null;
  const stack: (TreeNode<number> | null)[] = [];
  let curNode: TreeNode<number> | null = root;
  while (stack.length || curNode !== null) {
    while (curNode !== null) {
      // 一直遍历到最左孩子节点
      stack.push(curNode);
      curNode = curNode.left;
    }
    if (stack.length !== 0) {
      // 栈非空
      const node = stack.pop()!;
      if (head === null) {
        // 最左节点
        head = node;
      } else {
        // 前驱节点的后驱指向当前遍历节点
        pre.right = node;
      }
      // 当前节点的前驱节点为 pre
      node.left = pre;
      // 更新当前遍历节点的前驱节点
      pre = node;
      curNode = node.right; // 继续遍历当前节点的右子树
    }
  }
  // 设置头结点的前驱指向最后一个节点
  if (head) {
    head.left = pre;
  }
  // 设置最后一个节点的后驱指向头结点
  if (pre) {
    pre.right = head;
  }
  return head;
}
// #endregion docs
