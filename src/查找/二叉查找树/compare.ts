// #region docs
// 比较结果的枚举值
export enum Compare {
  LESS_THAN = -1,
  BIGGER_THAN = 1,
  EQUALS = 0
}

// 规定自定义Compare的类型
export type ICompareFunction<T> = (a: T, b: T) => number;

/**
 * 默认的大小比较函数
 * @param {T} a
 * @param {T} b
 * @return {Compare} 返回 -1 0 1 代表 小于 等于 大于
 */
export function defaultCompare<T>(a: T, b: T): Compare {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}
// #endregion docs
