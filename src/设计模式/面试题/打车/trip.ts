/**
 * 打车时，你可以打快车和专车
 * 无论什么车，都有车牌号和车辆名称
 * 打不同的车价格不同，快车每公里 1 元，专车每公里 2 元
 * 打车时，你要启动行程并显示车辆信息
 * 结束行程，显示价格（假定行驶了 5 公里）
 */
// 抽象类，必须被子类实现，不能直接 new
abstract class Car {
  name: string;
  licensePlate: string; // 车牌号
  abstract price: number; // 抽象属性，必须被子类重写
  constructor(name: string, licensePlate: string) {
    this.name = name;
    this.licensePlate = licensePlate;
  }
}

class ExpressCar extends Car {
  price = 1;
  constructor(name: string, licensePlate: string) {
    super(name, licensePlate);
  }
}

class SpecialCar extends Car {
  price = 2;
  constructor(name: string, licensePlate: string) {
    super(name, licensePlate);
  }
}

class Trip {
  car: Car; // 依赖倒置原则
  constructor(car: Car) {
    this.car = car;
  }

  start() {
    console.log(`行程开始：${this.car.name}-${this.car.licensePlate}`);
  }

  end() {
    console.log(`行程结束，价格：${this.car.price * 5}`);
  }
}

// const car = new ExpressCar('大众', 'A111222');
const car = new SpecialCar('奔驰', 'B333444');
const trip = new Trip(car);
trip.start();
trip.end();
