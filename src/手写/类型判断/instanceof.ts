/**
 * 判断原型链 object.__proto__. ... .__proto__ 是否有 constructor.prototype
 * @param object 
 * @param constructor 
 * @returns 
 */
function myInstanceof(object: any, constructor: Function) {
  // 左侧为基本数据类型
  if (object === null || !['object', 'function'].includes(typeof object)) {
    return false;
  }

  // 右侧为非函数
  if (typeof constructor !== 'function') {
    return false;
  }

  // 构造函数的原型对象
  const constructorPrototype = constructor.prototype;
  // 实例 object 的 __proto__
  let objectPrototype = Object.getPrototypeOf(object);
  while (true) {
    // 原型链顶层
    if (objectPrototype === null) {
      return false;
    }
    // 构造函数出现在该实例对象的原型链上
    if (objectPrototype === constructorPrototype) {
      return true;
    }
    // 继续向上获取 object.__proto__ 的 __proto__
    objectPrototype = Object.getPrototypeOf(objectPrototype);
  }
}