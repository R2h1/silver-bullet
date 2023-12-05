/**
 * 题目描述：
 *      实现两个函数，分别用来序列化(serialize)和反序列化(deserialize)二叉树。你需要设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。
 *  分析：
 *      JSON法，直接使用JSON.stringify 和 JSON.parse 进行序列化和反序列化即可。
 *      递归遍历法，
 *          序列化, 对二叉树树进行先序遍历，如果节点是 node。则序列化为'None,',否则序列化为'该节点值,该节点左子树的序列化结果该节点右子树的序列化结果'。
 *          反序列化，首先将序列化字符串按照分割符 split 成数组，再不断取出首节点。然后分别对左子树、右子树递归进行反序列化。
 */
// #region docs
import TreeNode from '../二叉树设计实现和遍历/treeNode';

// JSON法
function serialize1(root: TreeNode<number> | null) {
  return JSON.stringify(root);
}
function deserialize1(data: string) {
  return JSON.parse(data);
}

// 递归遍历法
function serialize2(root: TreeNode<number> | null): string {
  if (root === null) {
    return 'None,';
  }
  const { left, right } = root;
  return `${root.val},${serialize2(left) + serialize2(right)}`;
}
function deserialize2(data: string) {
  // 递归进行反序列化
  function reDeserialize(dataArray: string[]) {
    const item = dataArray.shift();
    if (item === 'None') return null;
    const root: TreeNode<number> = new TreeNode(Number(item), reDeserialize(dataArray), reDeserialize(dataArray));
    return root;
  }
  const dataArray = data.split(',');
  return reDeserialize(dataArray);
}
// #endregion docs
