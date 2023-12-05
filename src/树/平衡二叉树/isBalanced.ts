/**
 * 题目描述：
 *     输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。
 *  分析：
 *     首先，平衡二叉树的平衡性即，左子树与右子树的高度差的绝对值不大于1。即在遍历二叉树节点的过程中需要求该节点的左子树和右子树的高度差，自底向上的递归求树高度更为简单。
 */
// #region docs
import { maxDepth1 } from '../二叉树的深度/maxDepth';
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 深度计算法
function isBalanced<T>(root: TreeNode<T> | null): boolean {
  if (root === null) return true;
  const leftTree = root.left;
  const rightTree = root.right;
  // 左右子树高度差大于1，不平衡
  if (Math.abs(maxDepth1(leftTree) - maxDepth1(rightTree)) > 1) return false;
  // 否则取决于左子树与右子树分别是否平衡
  return isBalanced(leftTree) && isBalanced(rightTree);
}
// #endregion docs
