// #region docs
// 函数组合
function compose(...fns) {
  return (initialValue) => {
    return fns.reduceRight((acc, fn) => {
      return fn(acc);
    }, initialValue);
  };
}

// 函数管道
function pipe(...fns) {
  return (initialValue) => {
    return fns.reduce((acc, fn) => {
      return fn(acc);
    }, initialValue);
  };
}
// #endregion docs
