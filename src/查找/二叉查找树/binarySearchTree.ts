// #region docs
import BinarySearchTreeNode from './binarySearchTreeNode';
import { Compare, defaultCompare, type ICompareFunction } from './compare';

function cb<T>(node: BinarySearchTreeNode<T>) {
  console.log(node);
  return node;
}

export default class BinarySearchTree<T> {
  protected root: BinarySearchTreeNode<T> | null;

  constructor(
    key: T,
    value = key,
    protected compareFn: ICompareFunction<T> = defaultCompare
  ) {
    this.root = new BinarySearchTreeNode(key, value);
  }

  *inOrderTraversal(node = this.root, callback: (node: BinarySearchTreeNode<T>) => BinarySearchTreeNode<T>) {
    if (node) {
      const { left, right } = node;
      if (left) yield* this.inOrderTraversal(left, callback);
      yield callback(node);
      if (right) yield* this.inOrderTraversal(right, callback);
    }
  }

  *postOrderTraversal(node = this.root, callback: (node: BinarySearchTreeNode<T>) => BinarySearchTreeNode<T>) {
    if (node) {
      const { left, right } = node;
      if (left) yield* this.postOrderTraversal(left, callback);
      if (right) yield* this.postOrderTraversal(right, callback);
      yield callback(node);
    }
  }

  *preOrderTraversal(node = this.root, callback: (node: BinarySearchTreeNode<T>) => BinarySearchTreeNode<T>) {
    if (node) {
      const { left, right } = node;
      yield callback(node);
      if (left) yield* this.preOrderTraversal(left, callback);
      if (right) yield* this.preOrderTraversal(right, callback);
    }
  }

  /**
   * 插入元素
   */
  insert(key: T, value = key) {
    if (this.root == null) {
      // 边界情况：插入到根节点
      this.root = new BinarySearchTreeNode(key, value);
    } else {
      // 递归找到插入位置
      this.insertNode(this.root, key, value);
    }
  }

  /**
   * 递归插入方法
   */
  protected insertNode(node: BinarySearchTreeNode<T>, key: T, value = key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      // key 比 node.key 小就向左查
      if (node.left == null) {
        // 基线条件：左面为空直接赋值
        node.left = new BinarySearchTreeNode(key, value);
      } else {
        // 否则就接着递归
        this.insertNode(node.left, key);
      }
    } else {
      // key 比 node.key 大就向右查
      if (node.right == null) {
        // 基线条件：右面为空直接赋值
        node.right = new BinarySearchTreeNode(key, value);
      } else {
        // 否则就接着递归
        this.insertNode(node.right, key, value);
      }
    }
  }

  /**
   * 是否存在某个节点
   * @param key
   * @returns
   */
  has(node: BinarySearchTreeNode<T> | null, key: T) {
    for (const current of this.postOrderTraversal(node, cb)) {
      if (current.key === key) return true;
    }
    return false;
  }

  /**
   * 搜索某个节点
   * @param key
   * @returns
   */
  find(node: BinarySearchTreeNode<T> | null, key: T) {
    for (const current of this.postOrderTraversal(node, cb)) {
      if (current.key === key) return current;
    }
    return undefined;
  }

  /**
   * 移除指定元素
   */
  remove(key: T) {
    this.root = this.removeNode(this.root, key);
  }

  /**
   * 移除某个节点
   * @param key
   * @returns
   */
  protected removeNode(node: BinarySearchTreeNode<T> | null, key: T): BinarySearchTreeNode<T> | null {
    let current = this.find(node, key);
    if (!current) return null;
    if (current.isLeaf) {
      // 删除叶子节点
      current = null;
      return current;
    }
    if (current.hasBothChild) {
      // 有两个节点
      const aux = this.minNode(current.right)!;
      current.key = aux.key;
      this.removeNode(current.right, aux.key);
    }
    if (current.hasLeftChild) {
      // 只有左节点
      current = current.left;
      return current;
    }
    // 只有右节点
    current = current.right;
    return current;
  }

  /**
   * 返回根节点
   */
  getRoot(): BinarySearchTreeNode<T> | null {
    return this.root;
  }

  /**
   * 返回树中的最小元素
   */
  min(): BinarySearchTreeNode<T> | null {
    // 调用迭代方法
    return this.minNode(this.root);
  }

  /**
   * 返回指定子树下的最小元素
   */
  protected minNode(node: BinarySearchTreeNode<T> | null): BinarySearchTreeNode<T> | null {
    let current = node;
    // 不断向左查
    while (current != null && current.left != null) {
      current = current.left;
    }
    return current;
  }

  /**
   * 返回树中的最大元素
   */
  max(): BinarySearchTreeNode<T> | null {
    // 调用迭代方法
    return this.maxNode(this.root);
  }

  /**
   * 返回指定子树下的最大元素
   */
  protected maxNode(node: BinarySearchTreeNode<T> | null): BinarySearchTreeNode<T> | null {
    let current = node;
    // 不断向右查
    while (current != null && current.right != null) {
      current = current.right;
    }
    return current;
  }

  /**
   * 搜索元素
   */
  search(key: T): boolean {
    // 调用递归方法
    return this.searchNode(this.root, key);
  }

  /**
   * 递归搜索
   */
  private searchNode(node: BinarySearchTreeNode<T> | null, key: T): boolean {
    // 查到尽头返回 false
    if (node == null) {
      return false;
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      // key 比 node.key 小，向左查
      return this.searchNode(node.left, key);
    }
    if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      // key 比 node.key 大，向右查
      return this.searchNode(node.right, key);
    }
    return true;
  }
}
// #endregion docs
