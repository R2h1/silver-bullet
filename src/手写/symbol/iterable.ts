//#region docs
/**
 * 判断一个值是否可迭代
 * @param val 
 * @returns 
 */
function isIterable(val: any) {
  return (typeof Symbol !== "undefined" 
    && Symbol 
    && 'iterator' in Symbol 
    && val != null 
    && typeof val[Symbol.iterator] === 'function');
}

//#endregion docs