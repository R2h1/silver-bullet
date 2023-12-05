/**
 * 题目描述：
 *     输入某二叉树的前序遍历和中序遍历的结果，请构建该二叉树并返回其根节点。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。
 *  分析：
 *      在中序遍历序列中找到前序遍历序列的第一个节点，该节点将中序遍历序列分成左子树（中序遍历序列）和右子树（中序遍历序列）两个部分，
 *      而在前序遍历序列中紧接着的和左子树相同长度的序列即为左子树的前序遍历序列以及余下的为右子树的前序遍历序列，如此递归下去。
 *      如果给出的是后序和中序，同理，只不过后序的根节点在最后。
 *      但是只给出前序和后序是无法确定一颗二叉树的。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 前序 + 中序
function buildTree1(preorder: number[], inorder: number[]): TreeNode<number> | null {
  const size = preorder.length;
  if (size === 0) return null;
  // 前序遍历的首个节点将中序遍历该节点前后划分为左子树和右子树
  // 前序遍历中首个节点紧接着的和左子树相同长度的序列即为左子树的前序遍历序列，余下的为右子树
  const rootVal = preorder[0];
  const divider = inorder.indexOf(rootVal);
  const leftPreorder = preorder.slice(1, divider + 1);
  const rightPreorder = preorder.slice(divider + 1);
  const leftInorder = inorder.slice(0, divider);
  const rightInorder = inorder.slice(divider + 1);
  const leftTree = buildTree1(leftPreorder, leftInorder);
  const rightTree = buildTree1(rightPreorder, rightInorder);
  return new TreeNode(rootVal, leftTree, rightTree);
}

// 后序 + 中序
function buildTree2(postorder: number[], inorder: number[]): TreeNode<number> | null {
  const size = postorder.length;
  if (size === 0) return null;
  // 后序遍历的最后节点将中序遍历该节点前后划分为左子树和右子树
  // 前序遍历中和左子树相同长度的序列即为左子树的前序遍历序列，余下的出最后一个节点之外的即为右子树
  const rootVal = postorder[size - 1];
  const divider = inorder.indexOf(rootVal);
  const leftPostorder = postorder.slice(0, divider);
  const rightPostorder = postorder.slice(divider, -1);
  const leftInorder = inorder.slice(0, divider);
  const rightInorder = inorder.slice(divider + 1);
  const leftTree = buildTree2(leftPostorder, leftInorder);
  const rightTree = buildTree2(rightPostorder, rightInorder);
  return new TreeNode(rootVal, leftTree, rightTree);
}
// #endregion docs
