// #region docs
// 节点
export default class LinkNode<T> {
  val: T;

  next: LinkNode<T> | null;

  constructor(val: T, next?: LinkNode<T> | null) {
    this.val = val;
    this.next = next ?? null;
  }
}
// #endregion docs
