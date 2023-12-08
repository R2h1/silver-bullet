// #region docs
export default class BinarySearchTreeNode<T> {
  constructor(
    public key: T,
    public value: any = key,
    public left: BinarySearchTreeNode<T> | null = null,
    public right: BinarySearchTreeNode<T> | null = null
  ) {}

  get isLeaf() {
    return this.left === null && this.right === null;
  }

  get hasChildren() {
    return !this.isLeaf;
  }

  get hasBothChildren() {
    return this.left !== null && this.right !== null;
  }

  get hasLeftChild() {
    return this.left !== null;
  }
}
// #endregion docs
