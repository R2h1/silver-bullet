/**
 * 题目描述：
 *      输入一棵二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点（含根、叶节点）形成树的一条路径，最长路径的长度为树的深度。
 *  分析：
 *      对于树的相关问题，一般可以使用迭代法和递归法进行求解；递归法比较简单，可以自底向上或自顶向下计算二叉树的深度，
 *          自底向上递归法，由于每个树节点的深度等于其左子树深度和右子树深度的较大者+1。
 *          自顶向下递归法，设定初始树深度depth为0，通过自根节点向下遍历，其中每向下遍历即更新当前路径的深度count，直到叶节点时更新初始深度depth为当前路径的深度count和depth的较大值。同时，每个路径达到当前节点为null，跳出当前递归路径。
 *          层序遍历迭代法，可以利用队列来保存[当前节点，该节点层数root节点为1]信息数组，层序遍历至最下层，队列中最后一个节点的层数即最大的depth。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 自底向上递归法，
export function maxDepth1<T>(root: TreeNode<T> | null): number {
  if (root === null) return 0;
  const { left } = root;
  const { right } = root;
  return 1 + Math.max(maxDepth1(left), maxDepth1(right));
}

// 自顶向下递归法
export function maxDepth2<T>(root: TreeNode<T> | null): number {
  let depth = 0;
  function traversal<K>(node: TreeNode<K> | null, count: number) {
    if (root === null) return;
    const { left } = root;
    const { right } = root;
    if (left === null && right === null) {
      // 当前节点是叶节点, 更新深度为该叶节点的路径长count与当前深度depth的较大值
      depth = Math.max(depth, count);
    }
    // 当前节点非空，遍历其左子树和右子树
    traversal(left, count + 1);
    traversal(right, count + 1);
  }
  return depth;
}

// 层次遍历迭代法
export function maxDepth3<T>(root: TreeNode<T> | null): number {
  if (root === null) return 0;
  const queue: [TreeNode<T>, number][] = [[root, 1]];
  let depth = 0;
  while (queue.length) {
    const [node, layer] = queue.shift() as [TreeNode<T>, number];
    const { left } = node;
    const { right } = node;
    if (left) {
      // 存在左子树
      queue.push([left, layer + 1]);
    }
    if (right) {
      // 存在右子树
      queue.push([right, layer + 1]);
    }
    depth = layer; // 队列中最后一个元素的层即深度
  }
  return depth;
}
// #endregion docs
