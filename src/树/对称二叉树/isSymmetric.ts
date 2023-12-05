/**
 * 题目描述：
 *      请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。
 *  分析：
 *    递归法，如果一个树的左子树与右子树镜像对称，那么这个树是对称的。即两个树在什么情况下互为镜像，满足以下条件：
 *          1. 它们的两个根结点具有相同的值；
 *          2. 每个树的右子树都与另一个树的左子树镜像对称。
 *    因此，通过「同步移动」两个指针的方法来遍历这棵树， p 指针和 q 指针一开始都指向这棵树的根，
 *    随后 p 右移时，q 左移，p 左移时，q 右移。每次检查当前 p 和 q 节点的值是否相等，如果相等再判断左右子树是否镜像对称。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 递归法
function isSymmetric(root: TreeNode<number> | null): boolean {
  // 检查两个树是否互为镜像
  function check(p: TreeNode<number> | null, q: TreeNode<number> | null): boolean {
    // 节点均为null，对称
    if (p === null && q === null) return true;
    // 节点只有其中一个为 null，不对称
    if (p === null || q === null) return false;
    // 节点均不为null, 是否对称由根节点值相同且每个树的左子树与另一个树右子树对称
    return p.val === q.val && check(p.left, q.right) && check(p.right, q.left);
  }
  // 检查自己和自己是否互为镜像
  return check(root, root);
}
// #endregion docs
