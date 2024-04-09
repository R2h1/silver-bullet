// #region docs
/**
 * 实现 create
 * @param p
 * @returns
 */
export function myCreate(proto: object | null, propertiesObject?: PropertyDescriptorMap & ThisType<any>) {
  if (typeof proto !== 'object') {
    throw new TypeError('proto must be a object or null');
  }
  const F = <any>function () {};
  F.prototype = proto;
  const obj = new F();
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj;
}
// #endregion docs