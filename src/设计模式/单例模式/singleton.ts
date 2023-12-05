/**
 * js 利用代理实现单例
 * @param className
 * @returns
 */
function singleton<T extends object>(className: Constructor<T>) {
  let instance: T | null = null;
  return new Proxy(className, {
    construct(target, args) {
      return instance || (instance = new target(...args));
    }
  });
}

/**
 * typescript 实现单例（不需要使用代理）
 * const s1 = Singleton.getInstance();
 * const s2 = Singleton.getInstance();
 * console.log(s1 === s2); // true
 */
class Singleton {
  private static instance: Singleton;

  private constructor() {}

  public static getInstance() {
    return Singleton.instance || (Singleton.instance = new Singleton());
  }

  someMethod() {}
}

/**
 * 模块化实现单例
 * 
  let instance // 闭包
  class Singleton {}
  // 外部只能 import 这个函数
  export default () => {
    return instance || (instance = new Singleton());
  }
 */

/**
 * 闭包实现单例
 * 
  function genGetInstance() {
    let instance // 闭包
    class Singleton {}
    return () => {
      return instance || (instance = new Singleton());
    }
  }
  const getInstance = genGetInstance()
  const s1 = getInstance()
  const s2 = getInstance()
 */
