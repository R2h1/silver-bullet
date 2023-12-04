class DataIterator {
  private data: number[];
  private index = 0;
  constructor(container: DataContainer) {
    this.data = container.data;
  }
  next(): number | null {
    if (this.hasNext()) {
      return this.data[this.index++];
    }
    return null;
  }
  hasNext() {
    return this.index < this.data.length;
  }
}
class DataContainer {
  data: number[] = [10, 20, 30, 40];
  getIterator() {
    return new DataIterator(this);
  }
}

const iterator = new DataContainer().getIterator();
while (iterator.hasNext()) {
  const num = iterator.next();
  console.log(num);
}

/**
 * 自定义迭代器
  interface IteratorRes {
    value: number | undefined
    done: boolean
  }

  class CustomIterator {
    private length = 3
    private index = 0
    next(): IteratorRes {
      this.index++
      if (this.index <= this.length) {
        return { value: this.index, done: false }
      }
        return { value: undefined, done: true }
      }
      [Symbol.iterator]() {
        return this
    }
  }
  const iterator = new CustomIterator()
  console.log(iterator.next())
  console.log(iterator.next())
  console.log(iterator.next())
  console.log(iterator.next())
 */
