function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midNum = nums[mid];
    if (midNum === target) {
      return mid;
    } else if (midNum > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return -1;
}
