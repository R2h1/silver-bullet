// #region docs
import paramsHandler from './paramsHandler';

function jsonp({ url, onData, params }: { url: string; onData: (data: any) => void; params: any }) {
  // 1. 为了避免全局污染，使用一个随机函数名
  const cbFnName = `JSONP_PADDING_${Math.random().toString().slice(2)}`;
  // 2. 默认 callback 函数为 cbFnName
  let src = url;
  src +=
    (src.indexOf('?') === -1 ? '?' : '&') +
    paramsHandler({
      callback: cbFnName,
      ...params
    });
  // 防止拼接错误
  src = src.replace('?&', '');

  const script = document.createElement('script');
  script.src = src;
  // 3. 使用 onData 作为 cbFnName 回调函数
  window[cbFnName] = onData;
  document.body.appendChild(script); // 服务器返回的这个脚本的内容即 [cbFnName](data);
}

// 发送 JSONP 请求
jsonp({
  url: 'http://xxx.xxx.com/xxx.js',
  params: {
    id: 10000
  },
  onData(data: any) {
    console.log('Data: ', data);
  }
});
// #endregion docs
