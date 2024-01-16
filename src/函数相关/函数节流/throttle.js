// #region docs
/**
 * 实现原理为设置一个定时器，约定xx毫秒后执行事件，如果时间到了，那么执行函数并重置定时器
 * @param {*} fn 被节流函数
 * @param {*} wait 间隔时间
 */
const throttle = function (fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      clearTimeout(timer);
      fn.apply(this, args);
    }, wait);
  };
};

const throttle2 = function (fn, wait) {
  let timer = null;
  let previous;
  return function (...args) {
    const now = Date.now();
    // 上一次执行后，wait内再次触发
    if (previous && now - previous < wait) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        previous = Date.now();
        fn.apply(this, args);
      }, wait);
    } else {
      previous = now;
      fn.apply(this, args);
    }
  };
};
// #endregion docs
