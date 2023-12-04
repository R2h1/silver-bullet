// 观察者模式
// 目标
class Subject {
  private state: number = 0;
  private observers: Observer[] = [];

  getState(): number {
    return this.state;
  }

  setState(newState: number) {
    this.state = newState;
    this.notify(); // 通知
  }
  // 添加观察者
  attach(observer: Observer) {
    this.observers.push(observer);
  }

  // 通知
  private notify() {
    this.observers.forEach((o) => o.update(this.state));
  }
}

// 观察者
class Observer {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  update(state: number) {
    console.log(`${this.name} updated, state is ${state}`);
  }
}

const sub = new Subject();
const observer1 = new Observer('A');
const observer2 = new Observer('B');
sub.attach(observer1);
sub.attach(observer2);
sub.setState(1);
