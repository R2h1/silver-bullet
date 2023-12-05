/**
 * 题目描述：
 *      输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 true，否则返回 false。假设输入的数组的任意两个数字都互不相同。
 *  分析：
 *      中序判断法，因为二叉搜索树满足左子树 < 根节点 < 右子树，其中序遍历是有序的，而且中序、后序分别对应栈的压入、弹出序列（首先左子树入栈，左子树弹出，然后根节点、右子树入栈，右子树、根节点弹出），因此可以通过将当前后序遍历排序，
 *      然后判断中序，后序是否满足栈的压入、弹出即可。
 */
// #region docs
import validateStackSequences from '../../栈/栈的压入、弹出序列/validateStackSequences';

// 中序判断法
function verifyPostorder(postorder: number[]): boolean {
  const inorder = [...postorder].sort((a, b) => a - b);
  return validateStackSequences(inorder, postorder);
}
// #endregion docs
