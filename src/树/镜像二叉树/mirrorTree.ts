/**
 * 题目描述：
 *     请完成一个函数，输入一个二叉树，该函数输出它的镜像。
 *  分析：
 *     其镜像二叉树，即左右子树进行对调，递归对调即可：先分别递归求得左右子树的镜像，然后将左子树镜像与右子树镜像分别挂着右左子树上，即对调
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 递归
function mirrorTree<T>(root: TreeNode<T> | null): TreeNode<T> | null {
  if (root === null) return null;
  // 先分别递归求得左右子树的镜像
  const left = mirrorTree(root.left);
  const right = mirrorTree(root.right);
  // 将左子树镜像与右子树镜像分别挂着右左子树上，即对调
  root.left = right;
  root.right = left;
  return root;
}
// #endregion docs
