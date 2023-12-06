// #region docs
import MyLinkedList from '../../链表/设计链表/linkList';
import defaultToString from './defaultToString';

// 单独链接法（链表）
export default class HashTableSeparateChaining<K, V> {
  protected table: Map<number, MyLinkedList<{ key: K; value: V }>>;

  constructor(protected toStrFn: (key: K) => string = defaultToString) {
    this.table = new Map();
  }

  /**
   * @description: 哈希函数（djb2函数（或者loselose函数）
   */
  private hashCodeHelper(key: K): number {
    if (typeof key === 'number') {
      return key;
    }
    const tableKey = this.toStrFn(key);
    let hash = 5381;
    for (let i = 0; i < tableKey.length; i += 1) {
      hash = hash * 33 + tableKey.charCodeAt(i);
    }
    return hash % 1013;
  }

  /**
   * @description: 哈希函数封装
   */
  hashCode(key: K): number {
    return this.hashCodeHelper(key);
  }

  /**
   * @description: 更新散列表
   */
  put(key: K, value: V): boolean {
    if (key !== null && value !== null) {
      const position = this.hashCode(key);
      // 当该 hashcode 不存在时，先创建一个链表
      if (this.table.get(position) == null) {
        this.table.set(position, new MyLinkedList<{ key: K; value: V }>());
      }
      // 再给链表push值
      this.table.get(position)!.addAtTail({ key, value });
      return true;
    }
    return false;
  }

  /**
   * @description: 根据键获取值
   */
  get(key: K): V | undefined {
    const position = this.hashCode(key);
    const linkedList = this.table.get(position);
    if (linkedList && linkedList.size !== 0) {
      let current = linkedList.head;
      // 去链表中迭代查找键值对
      while (current !== null) {
        if (current.val.key === key) {
          return current.val.value;
        }
        current = current.next;
      }
    }
  }

  /**
   * @description: 根据键移除值
   */
  remove(key: K): boolean {
    const position = this.hashCode(key);
    const linkedList = this.table.get(position);
    if (linkedList && linkedList.size !== 0) {
      let current = linkedList.head;
      let index = 0;
      while (current !== null) {
        if (current.val.key === key) {
          break;
        }
        index += 1;
        current = current.next;
      }
      linkedList.deleteAtIndex(index);
      // 关键的一点，当链表为空以后，需要在 table 中删除掉 hashcode
      if (linkedList.size === 0) {
        this.table.delete(position);
      }
      return true;
    }
    return false;
  }

  /**
   * @description: 返回是否为空散列表
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * @description: 散列表的大小
   */
  size(): number {
    let count = 0;
    // 迭代每个链表，累计求和
    for (const [hashCode, linkedList] of this.table) {
      count += linkedList.size;
    }
    return count;
  }

  /**
   * @description: 清空散列表
   */
  clear() {
    this.table.clear();
  }

  /**
   * @description: 返回内部table
   */
  getTable() {
    return this.table;
  }

  /**
   * @description: 替代默认的toString
   */
  toString(): string {
    if (this.isEmpty()) {
      return '';
    }
    const objStringList: string[] = [];
    for (const [hashCode, linkedList] of this.table) {
      let node = linkedList.head;
      while (node) {
        objStringList.push(`{${node.val.key} => ${node.val.value}}`);
        node = node.next;
      }
    }
    return objStringList.join(',');
  }
}
// #endregion docs
