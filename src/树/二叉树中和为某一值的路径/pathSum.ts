/**
 * 题目描述：
 *      给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。叶子节点 是指没有子节点的节点。
 *  分析：
 *    深度优先搜素(dfs)法，枚举每一条从根节点到叶子节点的路径。当我们遍历到叶子节点，且此时路径和恰为目标和时，就找到了一条满足条件的路径，
 *      路径是根节点开始到叶节点结束的，目的是需要找出的所有符合条件（即路径节点和等于给定整数）的路径。一般考虑使用DFS（深度优先搜索），对于新每个节点：
 *          1.新节点进栈；
 *          2.当前节点是叶节点且路径和等于目标值，加入路径数组；
 *          3.遍历左子树和右子树，目标值减少为target - val；
 *          4. 递归出来后，回退到该节点的上层（新节点出栈）。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 深度优先搜素(dfs)法
function pathSum1(root: TreeNode<number> | null, target: number): number[][] {
  // 当前遍历的路径
  const path: number[] = [];
  // 所有满足条件的路径
  const result: number[][] = [];
  function dfs(root: TreeNode<number> | null, target: number) {
    if (root === null) {
      return;
    }
    const { left, right, val } = root;
    target -= val;
    path.push(val);
    if (left === null && right === null && target === 0) {
      // 叶节点的值等于目标值
      result.push([...path]);
    }
    // 递归左右子树
    dfs(left, target);
    dfs(right, target);
    // 递归左右子树将当前节点剔除，保证路径唯一
    path.pop();
  }
  dfs(root, target);
  return result;
}
// #endregion docs
