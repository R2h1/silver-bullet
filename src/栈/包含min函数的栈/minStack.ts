/**
 * 题目描述：
 *      定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。
 *  分析：
 *      数据栈+最小栈法，利用一个最小栈存放当前数据栈的最小元素，保持两个栈的长度相同。从首个元素入数据栈开始，每个元素均入数据栈。同时，判断当前元素与最小栈栈顶元素的大小，将小的元素入最小栈即可。
 */
// #region docs
// 数据栈+最小栈法
class MinStack {
  dataStack: number[];

  minStack: number[];

  constructor() {
    this.dataStack = [];
    this.minStack = [];
  }

  push(x: number): void {
    const dataSize = this.dataStack.length;
    const minSize = this.minStack.length;
    if (dataSize === 0 || this.minStack[minSize - 1] > x) {
      this.minStack.push(x);
    } else {
      this.minStack.push(this.minStack[minSize - 1]);
    }
    this.dataStack.push(x);
  }

  pop(): void {
    const dataSize = this.dataStack.length;
    if (dataSize) {
      this.minStack.pop();
      this.dataStack.pop();
    }
  }

  top(): number {
    const dataSize = this.dataStack.length;
    if (dataSize) {
      return this.dataStack[dataSize - 1];
    }
    return NaN;
  }

  min(): number {
    const minSize = this.dataStack.length;
    if (minSize) {
      return this.minStack[minSize - 1];
    }
    return NaN;
  }
}
// #endregion docs
