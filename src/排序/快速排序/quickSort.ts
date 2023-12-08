// #region docs
// 快速排序
function quickSort1(nums: number[]) {
  function partition(nums: number[], left: number, right: number) {
    let index = left + 1; // 最左边元素为基准元素，index 是为了找到大于基准元素的第一个元素位置
    for (let i = index; i <= right; i++) {
      if (nums[i] < nums[left]) {
        // 区域内的值小于基准值
        i !== index && ([nums[i], nums[index]] = [nums[index], nums[i]]);
        index += 1; // 每发现一个比基准元素小的，index 右移一位
      }
    }
    [nums[left], nums[index - 1]] = [nums[index - 1], nums[left]];
    return index - 1;
  }
  function quickSortCore(nums: number[], left: number, right: number) {
    if (left < right) {
      const partitionIndex = partition(nums, left, right);
      quickSortCore(nums, left, partitionIndex - 1);
      quickSortCore(nums, partitionIndex + 1, right);
    }
  }
  quickSortCore(nums, 0, nums.length - 1);
  return nums;
}

function quickSort2(nums: number[]): number[] {
  const len = nums.length;
  if (len <= 1) return nums; // 递归退出条件
  const pivot = nums.splice(Math.floor(len / 2), 1)[0]; // 中间为基准元素
  const left: number[] = [];
  const right: number[] = [];
  for (const item of nums) {
    // 分成左右两部分
    if (item < pivot) {
      left.push(item);
    } else {
      right.push(item);
    }
  }
  // 递归进行左右两部分排序
  return quickSort2(left).concat(pivot, quickSort2(right));
}

function quickSort3(nums: number[]): number[] {
  function partition(nums: number[], left: number, right: number) {
    const pivot = nums[left];
    while (left < right) {
      while (left < right && nums[right] >= pivot) {
        right -= 1;
      }
      nums[left] = nums[right];
      while (left < right && nums[left] <= pivot) {
        left += 1;
      }
      nums[right] = nums[left];
    }
    nums[left] = pivot;
    return left;
  }
  function quickSortCore(nums: number[], left: number, right: number) {
    if (left < right) {
      const partitionIndex = partition(nums, left, right);
      quickSortCore(nums, left, partitionIndex - 1);
      quickSortCore(nums, partitionIndex + 1, right);
    }
  }
  quickSortCore(nums, 0, nums.length - 1);
  return nums;
}
// #endregion docs
