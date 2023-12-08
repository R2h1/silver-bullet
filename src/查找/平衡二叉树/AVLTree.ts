// #region docs
import BinarySearchTree from '../二叉查找树/binarySearchTree';
import BinarySearchTreeNode from '../二叉查找树/binarySearchTreeNode';
import { Compare, defaultCompare, type ICompareFunction } from '../二叉查找树/compare';

// 平衡因子枚举
enum BalanceFactor {
  UNBALANCED_RIGHT = -2, // 右重
  SLIGHTLY_UNBALANCED_RIGHT = -1, // 轻微右重
  BALANCED = 0, // 完全平衡
  SLIGHTLY_UNBALANCED_LEFT = 1, // 轻微左重
  UNBALANCED_LEFT = 2 // 右重
}

class AVLTree<T> extends BinarySearchTree<T> {
  protected root: BinarySearchTreeNode<T> | null;

  constructor(
    key: T,
    value = key,
    protected compareFn: ICompareFunction<T> = defaultCompare
  ) {
    super(key, value, compareFn);
    this.root = new BinarySearchTreeNode(key, value);
  }

  /**
   * 获取节点高度
   * @param node
   * @returns
   */
  private getNodeHeight(node: BinarySearchTreeNode<T> | null): number {
    if (node === null) return 0;
    const { left, right } = node;
    return 1 + Math.max(this.getNodeHeight(left), this.getNodeHeight(right));
  }

  /**
   * 获取节点的平衡因子
   * @param node
   * @returns
   */
  private getBalanceFactor(node: BinarySearchTreeNode<T>): BalanceFactor {
    if (node === null) {
      return BalanceFactor.BALANCED;
    }
    const { left, right } = node;
    // 左子树重 减去 右子树重
    const heightDiff = this.getNodeHeight(left) - this.getNodeHeight(right);
    // 再返回对应的枚举值
    switch (heightDiff) {
      case -2:
        return BalanceFactor.UNBALANCED_RIGHT;
      case -1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
      case 1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT;
      case 2:
        return BalanceFactor.UNBALANCED_LEFT;
      default:
        return BalanceFactor.BALANCED;
    }
  }

  /**
   * 左子树的左子树上插入节点，左左情况: 向右单旋转
   * 左侧子节点的高度大于右侧子节点的高度时，并且左侧子节点也是平衡或左侧较重的，为左左情况
   *
   *         a                           b
   *        / \                         /   \
   *       b   c -> rotationLL(a) ->   d     a
   *      / \                         |      / \
   *     d   e                   插入节点    e   c
   *    |
   * 插入节点
   *
   * @param node  旋转前的子树根节点
   * @returns  返回旋转后的子树根节点
   */
  private rotationLL(node: BinarySearchTreeNode<T>): BinarySearchTreeNode<T> {
    const pivot = node.left;
    node.left = node.right;
    pivot!.right = node;
    return pivot!;
  }

  /**
   * 右子树的右子树上插入节点，右右情况: 向左单旋转
   * 右侧子节点的高度大于左侧子节点的高度，并且右侧子节点也是平衡或右侧较重的，为右右情况
   *     a                              c
   *    / \                            /  \
   *   b   c   -> rotationRR(a) ->    a    e
   *      / \                        / \    |
   *     d   e                      b   d 插入节点
   *         |
   *       插入节点
   *
   * @param node  旋转前的子树根节点
   * @returns  返回旋转后的子树根节点
   */
  private rotationRR(node: BinarySearchTreeNode<T>): BinarySearchTreeNode<T> {
    const pivot = node.right;
    node.right = pivot!.left;
    pivot!.left = node;
    return pivot!;
  }

  /**
   * 左子树的右子树上插入节点, 左右情况: 先左转子节点后右转
   * 左侧子节点的高度大于右侧子节点的高度，并且左侧子节点右侧较重
   *
   *       a                           a                              e
   *      / \                         / \                         /       \
   *     b   c -> rotationRR(b) ->   e   c -> rotationLL(a) ->   b         a
   *    / \                         /                          /     \      \
   *   d   e                       b                          d  插入节点     c
   *       |                     /  \
   *     插入节点               d  插入节点
   *
   * @param node
   */
  private rotationLR(node: BinarySearchTreeNode<T>): BinarySearchTreeNode<T> {
    // 先把节点左子左转
    node.left = this.rotationRR(node.left!);
    // 再把节点本身右转
    return this.rotationLL(node);
  }

  /**
   * 右子树的左子树上插入节点, 右左情况: 先右转子节点后左转
   * 右侧子节点的高度大于左侧子节点的高度，并且右侧子节点左侧较重
   *
   *       a                           a                              d
   *      / \                         / \                           /     \
   *     b   c -> rotationLL(c) ->   b   d -> rotationRR(a) ->    a        c
   *        / \                         |  \                    /   \       \
   *       d   e                   插入节点 c                   b  插入节点   e
   *       |                                \
   *     插入节点                            e
   *
   * @param node
   */
  private rotationRL(node: BinarySearchTreeNode<T>): BinarySearchTreeNode<T> {
    // 先把节点左子左转
    node.left = this.rotationRR(node.left!);
    // 再把节点本身右转
    return this.rotationLL(node);
  }

  /**
   * 对子树进行平衡
   */
  keepBalance(node: BinarySearchTreeNode<T> | null): BinarySearchTreeNode<T> | null {
    if (node === null) return node;
    // 校验树是否平衡
    const balanceState = this.getBalanceFactor(node);
    const { left, right } = node;

    if (left && balanceState === BalanceFactor.UNBALANCED_LEFT) {
      // 左左情况
      if (
        this.getBalanceFactor(left) === BalanceFactor.BALANCED ||
        this.getBalanceFactor(left) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
      ) {
        return this.rotationLL(node);
      }
      if (this.getBalanceFactor(left) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
        // 左右情况
        return this.rotationLR(node);
      }
    } else if (right && balanceState === BalanceFactor.UNBALANCED_RIGHT) {
      // 右右情况
      if (
        this.getBalanceFactor(right) === BalanceFactor.BALANCED ||
        this.getBalanceFactor(right) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      ) {
        return this.rotationRR(node);
      }
      if (this.getBalanceFactor(right) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
        // 右左情况
        return this.rotationRL(node);
      }
    }
    return node;
  }

  /**
   * @description: 插入节点的递归方法，递归插入完后，需要校验树是否仍然平衡，若不平衡则需要旋转
   * @param {Node} node 要插入到的节点
   * @param {T} key 要插入的键
   * @return {Node} 为了配合 insert 方法，一定要返回节点
   */
  protected insertNode(node: BinarySearchTreeNode<T> | null, key: T, value = key): BinarySearchTreeNode<T> | null {
    // 与二叉搜索树的插入方式一致
    if (node == null) {
      return new BinarySearchTreeNode<T>(key, value);
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.insertNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.insertNode(node.right, key);
    } else {
      return node; // 重复的 key
    }
    // 校验树是否平衡
    return this.keepBalance(node);
  }

  /**
   * @description:  删除节点的递归方法，递归完成后也需要再平衡
   * @param {Node} node 要从中删除的节点
   * @param {T} key 要删除的键
   * @return {Node} 同样为了配合remove方法，一定要返回节点
   */
  protected removeNode(node: BinarySearchTreeNode<T> | null, key: T): BinarySearchTreeNode<T> | null {
    // 与二叉搜索树的删除方式一致
    if (!node) return null;
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.removeNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.removeNode(node.right, key);
    } else if (node.isLeaf) {
      // 删除叶子节点
      node = null;
    } else if (node.hasBothChildren) {
      const aux = this.minNode(node.right)!;
      node.key = aux.key;
      node.right = this.removeNode(node.right, aux.key);
    } else if (node.hasLeftChild) {
      node = node.left;
    } else {
      node = node.right;
    }
    // 校验树是否平衡
    return this.keepBalance(node);
  }
}
// #endregion docs
