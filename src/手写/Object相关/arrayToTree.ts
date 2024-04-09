// #region docs
export function arrayToTree(
  data: ({
    id: number;
    pid: number;
  } & Partial<{
    [propName: string]: any;
  }>)[]
) {
  const map = new Map();
  const res = [];
  for (let item of data) {
    const { id, pid } = item;
    map.set(item.id, { ...item, children: [] });
    const itemInMap = map.get(id);
    if (map.has(pid)) {
      map.get(pid).children.push(itemInMap);
    } else {
      res.push(itemInMap);
    }
  }
  return res;
}
// #endregion docs