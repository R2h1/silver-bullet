/**
 * 题目描述：
 *      给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
 *  分析：
 *      对于两个相邻（只差了一个位置）的滑动窗口，它们共用着 k-1 个元素，而只有 1 个元素是变化的
 *      遍历，依次遍历每个滑动窗口，其中最后一个窗口的起始下标为 len - k，使用Math.max计算每个窗口的最大值即可（可能超时）。
 *      单掉队列(双端队列)，维护一个初始为空的单调递减队列，其值为滑动窗口中元素的下标；首先，如果队头下标在滑动窗口之外，则对头出队；否则将当前元素与队尾元素不断比较大小，若当前元素更大，则队尾出队，而后再将当前元素下标加入队列。最后当遍历到 k - 1时，开始获取队头元素作为当前滑动窗口的最大值。
 */

// 遍历
function maxSlidingWindow1(nums: number[], k: number): number[] {
  const len = nums?.length;
  if (len === 0 || k < 1) return []; // 滑动窗口小于1 或 数组为空
  if (k === 1) return nums; // 滑动窗口等于1
  if (k >= len) return [Math.max(...nums)]; // 滑动窗口大于等于数组长度
  const res: number[] = [];
  for (let i = 0; i <= len - k; i++) {
    const window = nums.slice(i, i + k);
    res.push(Math.max(...window));
  }
  return res;
}

// 单掉队列(双端队列)
function maxSlidingWindow2(nums: number[], k: number): number[] {
  const len = nums?.length;
  if (len === 0 || k < 1) return []; // 滑动窗口小于1 或 数组为空
  if (k === 1) return nums; // 滑动窗口等于1
  if (k >= len) return [Math.max(...nums)]; // 滑动窗口大于等于数组长度
  const res: number[] = [];
  // 单调递减队列，存放的数组元素下标
  const queue: number[] = [];
  for (let i = 0; i < len; i++) {
    // 对头元素如果不是滑动窗口之内的需要弹出 （滑动窗口范围是 [i - k + 1, i] => queue[0] < i - k + 1 => queue[0] <= i - k)
    while (queue.length && queue[0] <= i - k) {
      queue.shift();
    }
    const element = nums[i];
    // 将队尾小于当前值的弹出，保证单调性
    while (queue.length && nums[queue[queue.length - 1]] <= element) {
      queue.pop();
    }
    queue.push(i); // 加入当前元素的下标
    if (i >= k - 1) {
      // 当遍历到 k - 1，加入最大元素(队头)
      res.push(nums[queue[0]]);
    }
  }
  return res;
}
