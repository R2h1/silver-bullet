/**
 * 题目描述：
 *      输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)；B是A的子结构， 即 A中有出现和B相同的结构和节点值。
 *  分析：
 *      先序遍历法，子结构与子树不同，子结构可以在叶子节点不完全相同，即子树一定是子结构，子结构不一定是子树。首先，任何树不是空树的子结构，空树也不是任何树的子结构；其次判以当前节点为根的树是否包含断 B 树；如果不包含，再判断B是否是其左子树或其右子树的子结构。
 *      序列化法，由于树是对象，可以将其序列化成字符串，判断序列化A中是否包含序列化B。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 先序遍历法
function isSubStructure1(A: TreeNode<number> | null, B: TreeNode<number> | null): boolean {
  // 任何树不是空树的子结构，空树也不是任何树的子结构
  if (A === null || B === null) return false;
  // 判断当前树是否包含 B
  function recur(A: TreeNode<number> | null, B: TreeNode<number> | null): boolean {
    if (B === null) return true;
    if (A === null || A.val !== B.val) return false;
    return recur(A.left, B.left) && recur(A.right, B.right);
  }
  return recur(A, B) || isSubStructure1(A.left, B) || isSubStructure1(A.right, B);
}

// 序列化法
function isSubStructure2(A: TreeNode<number> | null, B: TreeNode<number> | null): boolean {
  return JSON.stringify(A).includes(JSON.stringify(B));
}
// #endregion docs
