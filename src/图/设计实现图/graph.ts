// #region docs
interface Edge {
  a: GraphNode; // 边的起始节点
  b: GraphNode; // 边的目标节点
  weight?: number; // 边的可选数字权重值
}

interface GraphNode {
  key: string; // 节点的键
  value: any; // 节点的值
}

class Graph {
  directed: boolean;

  nodes: GraphNode[];

  edges: Map<string, Edge>;

  constructor(directed = true) {
    this.directed = directed;
    this.nodes = [];
    this.edges = new Map();
  }

  /**
   * 插入具有特定键和值的新节点
   * @param key
   * @param value
   */
  addNode(key: string, value = key) {
    this.nodes.push({ key, value });
  }

  /**
   * 在两个给定节点之间插入一条新边，可选择设置其权重
   * @param a
   * @param b
   * @param weight
   */
  addEdge(a: GraphNode, b: GraphNode, weight?: number) {
    this.edges.set(JSON.stringify([a, b]), { a, b, weight });
    if (!this.directed) this.edges.set(JSON.stringify([b, a]), { a: b, b: a, weight });
  }

  /**
   * 删除具有指定键的节点
   * @param key
   */
  removeNode(key: string) {
    this.nodes = this.nodes.filter((n: { key: string }) => n.key !== key);
    [...this.edges.values()].forEach(({ a, b }) => {
      if (a.key === key || b.key === key) this.edges.delete(JSON.stringify([a, b]));
    });
  }

  /**
   * 删除两个给定节点之间的边
   * @param a
   * @param b
   */
  removeEdge(a: any, b: any) {
    this.edges.delete(JSON.stringify([a, b]));
    if (!this.directed) this.edges.delete(JSON.stringify([b, a]));
  }

  /**
   * 检索具有给定键的节点
   * @param key
   * @returns
   */
  findNode(key: string) {
    return this.nodes.find((x: { key: string }) => x.key === key);
  }

  /**
   * 检查图在两个给定节点之间是否有边
   * @param a
   * @param b
   * @returns
   */
  hasEdge(a: any, b: any) {
    return this.edges.has(JSON.stringify([a, b]));
  }

  /**
   * 设置给定边的权重
   * @param a
   * @param b
   * @param weight
   */
  setEdgeWeight(a: any, b: any, weight: any) {
    this.edges.set(JSON.stringify([a, b]), { a, b, weight });
    if (!this.directed) this.edges.set(JSON.stringify([b, a]), { a: b, b: a, weight });
  }

  /**
   * 获取给定边的权重
   * @param a
   * @param b
   * @returns
   */
  getEdgeWeight(a: any, b: any) {
    return this.edges.get(JSON.stringify([a, b]))?.weight;
  }

  /**
   * 从给定节点查找存在边的所有节点
   * @param key
   * @returns
   */
  adjacent(key: string) {
    return [...this.edges.values()].reduce((acc, { a, b }) => {
      if (a.key === key) acc.push(b);
      return acc;
    }, [] as GraphNode[]);
  }

  /**
   * 计算给定节点的总边数
   * @param key
   * @returns
   */
  inDegree(key: string) {
    return [...this.edges.values()].reduce((acc, { a, b }) => (b.key === key ? acc + 1 : acc), 0);
  }

  /**
   * 计算给定节点的总边数
   * @param key
   * @returns
   */
  outDegree(key: string) {
    return [...this.edges.values()].reduce((acc, { a, b }) => (a.key === key ? acc + 1 : acc), 0);
  }
}

const graph = new Graph();
// #endregion docs

export default Graph;
