/**
 * 题目描述：
 *      输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。
 *      例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。
 *  分析：
 *      辅助栈模拟法，借用一个辅助栈 stack ，模拟压入/弹出操作的排列。根据是否模拟成功，即可得到结果。首先按照压栈序列的顺序执行辅助栈入栈操作，每次压栈序列中的元素入栈时，若栈不为空且栈顶元素等于弹出序列当前应弹出元素，即对栈进行出栈操作并更新弹出元素，最终判断栈是否为空即可。
 */
// #region docs
// 辅助栈模拟法
export default function validateStackSequences(pushed: number[], popped: number[]): boolean {
  const stack: number[] = [];
  const size = pushed.length;
  // 弹出序列当前应该弹出元素的下标
  let poppedIndex = 0;
  // 出栈和入栈序列不全为空
  for (let i = 0; i < size; i += 1) {
    const element = pushed[i];
    // 将入栈序列元素入栈
    stack.push(element);
    while (stack.length && stack[stack.length - 1] === popped[poppedIndex]) {
      // 栈不为空 且 栈顶元素等于弹出序列当前应弹出元素
      stack.pop();
      // 下一个应该弹出元素的下标
      poppedIndex += 1;
    }
  }
  return stack.length === 0; // 弹出与压入对应说明满足
}
// #endregion docs
