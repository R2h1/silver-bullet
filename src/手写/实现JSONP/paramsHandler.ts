export default function paramsHandler(data) {
  let url = '';
  for (const k in data) {
    const value = data[k] != undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponet(value)}`;
  }
  return url ? url.substring(1) : '';
}
