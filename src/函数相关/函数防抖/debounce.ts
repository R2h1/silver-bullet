// #region docs
/**
 * 设置一个定时器，约定在xx毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到xx毫秒内无第二次操作
 * @param {*} fn 被防抖函数
 * @param {*} wait 等待时间
 * 场景：频繁的事件响应只需执行一次回调
 *    1. 按钮提交场景：防止多次点击提交按钮，只执行最后提交的一次
 *    2. 服务端验证场景：表单验证需要服务端配合，只执行一段连续的输入事件的最后一次，还有搜索联想词功能类似
 */
export default function debounce<T extends any[], K>(
  fn: (...args: T) => K,
  wait = 500,
  leading = false,
  tailing = true
): (...args: T) => void {
  // 计时器
  let timer: number | NodeJS.Timeout | null = null;
  // 事件触发后实际执行的函数(监听的已经是这个函数了，所以timer是实际执行函数的外层作用域)
  // 此处不能使用箭头函数，否则 fn 的 this 和实际执行的函数不同
  return function (this: any, ...args) {
    if (!timer && leading) {
      fn.apply(this, args);
    }
    // 函数被调用，清除定时器
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    // 箭头函数不用保存this
    timer = setTimeout(() => {
      timer = null;
      if (tailing) {
        fn.apply(this, args);
      }
    }, wait);
  };
}
// 示例：npm i jsdoc -g; 命令 jsdoc ./ 在当前目录下生成文档页面（out文件夹）
// #endregion docs
