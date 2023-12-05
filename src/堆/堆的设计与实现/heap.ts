// #region docs
class Heap {
  container: number[];

  cmp: Function;

  /**
   * 默认是大顶堆
   * @param type
   */
  constructor(type: 'max' | 'min' = 'max') {
    this.container = [];
    this.cmp = type === 'max' ? (x: number, y: number) => x > y : (x: number, y: number) => x < y;
  }

  /**
   * 对堆中的两个节点进行交换
   * @param i
   * @param j
   */
  swap(i: number, j: number) {
    [this.container[i], this.container[j]] = [this.container[j], this.container[i]];
  }

  /**
   * 插入节点，在堆末尾插入，并对节点进行上浮操作
   * @param data
   * @returns
   */
  insert(data: number) {
    this.container.push(data);
    // 上浮操作
    let index = this.container.length - 1;
    while (index) {
      // 直到遍历到堆顶
      // 父节点位置
      const parent = Math.floor((index - 1) / 2);
      if (!this.cmp(this.container[index], this.container[parent])) {
        // 大顶堆：当前节点不大于父节点，到达最终位置
        return;
      }
      // 交换
      this.swap(index, parent);
      index = parent;
    }
  }

  /**
   * 删除节点，删除堆顶元素与堆尾元素后的堆尾所在元素，再对堆顶元素执行下沉操作
   * @returns
   */
  delete(): number {
    if (this.isEmpty()) return NaN;
    // 将堆顶元素与堆尾元素进行交换，并删除堆尾元素
    const size = this.getSize();
    this.swap(0, size - 1);
    const top = this.container.pop()!;
    // 当前节点位置
    let index = 0;
    // 交换节点位置，大顶堆：子节点中的较大者
    let exchange = index * 2 + 1;
    while (exchange < size) {
      // 右子节点位置
      const right = index * 2 + 2;
      if (right < this.container.length && this.cmp(this.container[right], this.container[exchange])) {
        // 大顶堆：存在右节点且右节点较大
        exchange = right;
      }
      if (!this.cmp(this.container[exchange], this.container[index])) {
        // 大顶堆：子节点较大者小于当前节点
        return NaN;
      }
      // 交换
      this.swap(exchange, index);
      index = exchange;
      exchange = index * 2 + 1;
    }
    return top;
  }

  /**
   * 获取堆顶元素，堆空则返回 NaN
   * @returns
   */
  top(): number {
    if (this.isEmpty()) return NaN;
    return this.container[0];
  }

  /**
   * 判断堆是否为空
   * @returns
   */
  isEmpty(): boolean {
    return this.getSize() === 0;
  }

  /**
   * 堆中元素个数
   * @returns
   */
  getSize(): number {
    return this.container.length;
  }
}
// #endregion docs
export default Heap;
