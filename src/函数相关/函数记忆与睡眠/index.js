/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/first */
// #region docs1
// 函数记忆
export const memoize = function (func, hasher) {
  const memoizedFn = function (...args) {
    const { cache } = memoizedFn;
    const address = JSON.stringify(args);
    if (!cache.has(address)) {
      cache.set(address, func(...args));
    }
    return cache.get(address);
  };
  memoizedFn.cache = new Map();
  return memoizedFn;
};
// #endregion docs1

// #region docs2
// 函数睡眠
// setTimeout 回调实现
const sleep1 = (cb, time) => setTimeout(cb, time);

sleep1(() => {
  console.log('Hello world!');
}, 1000);

// Promise 实现
export function sleep2(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

sleep2(2000).then(() => {
  console.log('Hello world!');
});

async function test() {
  const res = await sleep2(1000);

  console.log('Hello world!');
  return res;
}

// 使用 node-sleep
import sleep3 from 'sleep';
const sec = 10;

sleep3.sleep(sec); // 休眠 {sec}s
sleep3.msleep(sec); // 休眠 {sec}ms
sleep3.usleep(sec); // 休眠 {sec}us
// #endregion docs2
