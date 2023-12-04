/**
 * 题目描述：
 *     用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )。
 *  分析：
 *      栈用数组模拟，队列只允许在队首进行出队（即delete/pop删除 ）操作，队尾进行入队（即insert/push插入）操作，因此其中一个栈用于入队，另一个栈用于出队，出队时判断出队栈是否为空：
 *          1.空则将入队栈中的元素全部转移至出队栈，然后出队栈栈顶元素出队即可。
 *          2.非空，则出队栈栈顶元素直接出队。
 */
// #region docs
// 数组模拟
class CQueue {
  pushStack: number[];

  popStack: number[];

  constructor() {
    this.pushStack = [];
    this.popStack = [];
  }

  appendTail(value: number): void {
    this.pushStack.push(value);
  }

  deleteHead(): number {
    if (this.pushStack.length === 0 && this.popStack.length === 0) {
      // 队列为空
      return -1;
    }
    // 出队的栈为空时，依次将入队的栈中元素先入出队的栈
    if (this.popStack.length === 0) {
      while (this.pushStack.length) {
        this.popStack.push(this.pushStack.pop()!);
      }
    }
    return this.popStack.pop()!;
  }
}
// #endregion docs
