/**
 * 题目描述：
 *  给出二叉树的中序遍历结果和前序遍历结果，编写算法将其转化为求和树，并返回求和树的中序遍历
 *    求和树：二叉树的求和树， 是一颗同样结构的二叉树，其树中的每个节点将包含原始树中的左子树和右子树的和。
 * 分析：
 *    递归法，
 *      1.如果是叶子节点(中序遍历只有一个节点)，对应求和树的中序遍历为[0];
 *      2.如果是 null 节点(中序遍历无节点)，对应求和树的中序遍历为[];
 *      3.如果是非 null 且非叶节，对应求和树的中序遍历为[右子树的求和树的中序遍历, 求和树根节点值, 右子树的求和树的中序遍历]
 *         3.1 前序遍历的第一个节点为根节点，在中序遍历中找到该节点下标 index，求和树根节点值为以该节点二叉树的中序遍历的和减去该节点
 *         3.1 中序遍历中该节点之前[0, index)为左子树的中序遍历，前序遍历中[1, rootIndex]为左子树的前序遍历。递归求左子和树的中序遍历
 *         3.2 中序遍历中该节点之后[index + 1, length)为右子树的中序遍历; 前序遍历中[rootIndex + 1, length) 为右子树的前序遍历。递归求右子和树的中序遍历
 * @param inOrderTravel 中序遍历
 * @param preOrderTravel 前序遍历
 * @returns
 */
// #region docs
function getSumTree(inOrderTravel: number[], preOrderTravel: number[]): number[] {
  const len = inOrderTravel.length;
  if (len === 1) {
    return [0];
  }
  if (len === 0) {
    return [];
  }
  const root = preOrderTravel[0];
  const sum = [inOrderTravel.reduce((prev, curr) => prev + curr, -root)]; // 树的左右子树之和
  const rootIndex = inOrderTravel.indexOf(root);
  const left = getSumTree(inOrderTravel.slice(0, rootIndex), preOrderTravel.slice(1, rootIndex + 1)); // 左子和树的中序遍历
  const right = getSumTree(inOrderTravel.slice(rootIndex + 1), preOrderTravel.slice(rootIndex + 1)); // 右子和树的中序遍历
  return left.concat(sum, right);
}

console.log(getSumTree([7, -2, 6, 6, 9], [6, 7, -2, 9, 6])); // [-2, 0, 20, 0, 6]
console.log(getSumTree([8, -2, -4, 10, 7, 6, 5], [10, -2, 8, -4, 6, 7, 5])); // [0, 4, 0, 20, 0, 12, 0]
// #endregion docs
