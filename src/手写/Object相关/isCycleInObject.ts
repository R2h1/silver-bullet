// #region docs
export function isCycleInObject(obj: any, parents = [obj]): boolean {
  for (let value of Object.values(obj)) {
    if (value !== null && typeof value === 'object') {
      for (let parent of parents) {
        if (parent === value) {
          return true;
        }
      }
      return isCycleInObject(value, [...parents, value]);
    }
  }
  return false;
}
// #endregion docs