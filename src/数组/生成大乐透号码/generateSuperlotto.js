/**
 * 按步长 step 创建指定范围的递增数字数组, 不包括 max
 * @param min
 * @param max
 * @returns
 * @example
 *   range(5, 10); // [5, 6, 7, 8, 9]
 *   range(5, 10, 3); // [5, 9]
 */
const range = (min, max, step = 1) => Array.from({ length: Math.ceil((max - min) / step) }, (_, i) => min + i * step);
/**
 * 生成给定范围内的随机数
 * @param min 最小值
 * @param max 最大值
 * @param includeMax 如果true，范围是 [min, max], 如果为false, 范围是 [min, max)
 * @param isInt 是否取整
 * @returns
 */
const randomInRange = (
  min,
  max,
  options = {
    includeMax: false,
    isInt: true
  }
) => {
  const { includeMax = true, isInt = false } = options;
  if (isInt) {
    return Math.floor(Math.random() * (max - min + (includeMax ? 1 : 0))) + min;
  }
  return Math.random() * (max - min + (includeMax ? 1 : 0)) + min;
};

/**
 * 获取一个随机项
 * @param arr
 * @param needRemove 是否将随机项删除
 * @returns
 * @example
 *   const arr = [1, 3, 5, 7, 9];
 *   randomItem(arr, true); // 7
 *   // arr = [1, 3, 5, 9]
 *   randomItem(arr); // 5
 *   // arr = [1, 3, 5, 9]
 */
const randomItem = (arr, needRemove = false) => {
  const index = randomInRange(0, arr.length);
  if (needRemove) {
    return arr.splice(index, 1)[0];
  }
  return arr[index];
};

// 获取多个不重复的随机项
function getRandomUniqueItems(arr, num) {
  const res = new Array(num)
    .fill(0)
    .map(() => {
      return String(randomItem(arr, true)).padStart(2, '0');
    })
    .sort();
  return res;
}

export default function generateSuperLotto() {
  const front = getRandomUniqueItems(range(1, 36), 5);
  const back = getRandomUniqueItems(range(1, 13), 2);
  return [front, back];
}
