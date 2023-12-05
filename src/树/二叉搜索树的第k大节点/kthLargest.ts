/**
 * 题目描述：
 *      给定一棵二叉搜索树，请找出其中第 k 大的节点的值。
 *  分析：
 *      中序倒序遍历 + 提前返回法，二叉搜索树即二叉查找树或二叉排序树，它的中序倒序遍历是递减的，因此可以在遍历的过程中用一个变量来记录遍历的次序，当遍历到第k个节点即可。或者可以直接遍历得到遍历结果数组，取第k个值。
 *      如果需要求的是第k小的则是采用中序遍历。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 中序倒序遍历 + 提前返回法
function kthLargest(root: TreeNode<number> | null, k: number): number {
  // 遍历次数
  let count = 0;
  let result = NaN;
  function dfs(root: TreeNode<number> | null) {
    if (root === null) return;
    const { val, left, right } = root;
    if (right) dfs(right); // 先遍历右子树
    count += 1;
    if (count === k) {
      // 遍历次数等于 k
      result = val;
      return;
    }
    if (left) dfs(left); // 再遍历左子树
  }
  dfs(root);
  return result;
}
// #endregion docs
