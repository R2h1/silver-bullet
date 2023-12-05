/**
 * 题目描述：
 *     从上到下打印出二叉树的每个节点。
 *      分为三种情况： 1. 顺序打印一维数组（同层从左往右） 2. 顺序打印二维数组（同层从左往右为一维数组） 3. 之字形打印二维数组
 *  分析：
 *      由题目分析，是层序遍历的过程，因此直接层序遍历即可，
 *      如果要求返回的是二维数组，即每一层节点数组构成的数组，仅仅需要在每一层遍历开始构建数组，遍历完该层后将数组加入到外层数组中。
 *      还有就是可能要求之字形的打印（即偶数层的打印是从右到左），使用一个层遍历初始方向标志变量，对于每一层true则push，false则unshift，该变量初始为true,每打印一层取反，遍历完该层后将数组加入到外层数组中即可。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// 一维数组
function levelOrder1(root: TreeNode<number> | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const queue = [root]; // 队列（先入先出）
  while (queue.length !== 0) {
    // 队列非空
    const current = queue.shift()!; // 队首出队
    result.push(current.val);
    const leftChild = current.left;
    const rightChild = current.right;
    if (leftChild !== null) queue.push(leftChild);
    if (rightChild !== null) queue.push(rightChild);
  }
  return result;
}

// 二维数组
function levelOrder2(root: TreeNode<number> | null): number[][] {
  if (root === null) return [];
  const result: number[][] = [];
  const queue = [root]; // 队列（先入先出）
  while (queue.length !== 0) {
    const size = queue.length;
    // 当前层的节点
    const arr: number[] = [];
    for (let i = 0; i < size; i += 1) {
      const node = queue.shift()!;
      const leftChild = node.left;
      const rightChild = node.right;
      arr.push(node.val);
      if (leftChild !== null) queue.push(leftChild);
      if (rightChild !== null) queue.push(rightChild);
    }
    result.push(arr);
  }
  return result;
}

// 之字形打印（二维数组）
function levelOrder3(root: TreeNode<number> | null): number[][] {
  if (root === null) return [];
  const result: number[][] = [];
  const queue = [root]; // 队列（先入先出）
  let isOrderLeft = true;
  while (queue.length !== 0) {
    const size = queue.length;
    // 当前层的节点
    const arr: number[] = [];
    for (let i = 0; i < size; i += 1) {
      const node = queue.shift()!;
      const leftChild = node.left;
      const rightChild = node.right;
      isOrderLeft ? arr.push(node.val) : arr.unshift(node.val);
      if (leftChild !== null) queue.push(leftChild);
      if (rightChild !== null) queue.push(rightChild);
    }
    result.push(arr);
    isOrderLeft = !isOrderLeft;
  }
  return result;
}
// #endregion docs
