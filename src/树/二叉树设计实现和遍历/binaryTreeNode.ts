export default class BinaryTreeNode {
  key: string | number; // 节点的键

  parent: BinaryTreeNode | null; // 节点的父节点

  value: any; // 节点的值

  left: BinaryTreeNode | null; // 指向节点左孩子的指针

  right: BinaryTreeNode | null; // 指向节点右孩子的指针

  constructor(key: string | number, value = key, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  get isLeaf() {
    return this.left === null && this.right === null;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}
