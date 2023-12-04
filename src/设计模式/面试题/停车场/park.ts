/**
 * 某停车场，分 3 层，每层 100 车位
 * 每个车位可以监控车辆的进入和离开
 * 车辆进入前，显示每层的空余车位数量
 * 车辆进入时，摄像头可识别车牌号和时间
 * 车辆出来时，出口显示器显示车牌号和停车时长
 */

// 停车信息
interface IEntryInfo {
  licensePlate: string; // 车牌号
  inTime: number; // 进入时间
  place?: Place; // 车位
}

class Place {
  isEmpty = true;
  getInto() {
    this.isEmpty = false;
  }
  out() {
    this.isEmpty = true;
  }
}

export class Car {
  licensePlate: string;
  constructor(licensePlate: string) {
    this.licensePlate = licensePlate;
  }
}

// 入口摄像头
class Camera {
  // 拍照
  shot(car: Car): IEntryInfo {
    return {
      licensePlate: car.licensePlate,
      inTime: Date.now()
    };
  }
}
// 出口显示器
class Screen {
  show(info: IEntryInfo) {
    const { inTime, licensePlate } = info;
    const duration = Date.now() - inTime;
    console.log(`车牌号：${licensePlate} ，停留时间：${duration}`);
  }
}

// 层
class Floor {
  index: number;
  places: Place[];
  constructor(index: number, places: Place[]) {
    this.index = index;
    this.places = places;
  }
  get emptyPlaceNum(): number {
    let num = 0;
    for (const place of this.places) {
      if (place.isEmpty) num++;
    }
    return num;
  }
}

// 停车场
class Park {
  floors: Floor[];
  camera = new Camera();
  screen = new Screen();
  entryInfoList: Map<string, IEntryInfo> = new Map(); // key 是 car.licensePlate
  constructor(floors: Floor[]) {
    this.floors = floors;
  }
  getInto(car: Car) {
    // 获取摄像头的信息：车牌号，时间
    const entryInfo = this.camera.shot(car);
    // 某个车位
    const i = Math.round((Math.random() * 100) % 100);
    const place = this.floors[0].places[i]; // 停在第一层的某个车位（想要第二层，第三层，也可以用随机数获取）
    // 进入车位
    place.getInto();
    // 记录停车信息
    entryInfo.place = place;
    this.entryInfoList.set(car.licensePlate, entryInfo);
  }
  out(car: Car) {
    // 获取停车信息
    const entryInfo = this.entryInfoList.get(car.licensePlate);
    if (!entryInfo) return;
    const { place } = entryInfo;
    if (!place) return;
    // 从车位离开
    place.out();
    // 出口显示屏，显示
    this.screen.show(entryInfo);
    // 删除停车信息
    this.entryInfoList.delete(car.licensePlate);
  }
  // 当前停车场的空余车位
  get emptyInfo(): string {
    return this.floors
      .map((floor) => {
        return `${floor.index} 层还有 ${floor.emptyPlaceNum} 个车位`;
      })
      .join('\n');
  }
}

// ---------- 初始化停车场 ----------
const park = new Park(
  new Array(3).map(
    (_, i) =>
      new Floor(
        i + 1,
        new Array(100).map(() => new Place())
      )
  )
);
// ---------- 模拟车辆进入、离开 ----------
const car1 = new Car('A1');
document.getElementById('btn-car1-into')?.addEventListener('click', () => {
  console.log('第一辆车即将进入');
  console.log(park.emptyInfo);
  park.getInto(car1);
});
document.getElementById('btn-car1-out')?.addEventListener('click', () => {
  console.log('第一辆车离开');
  park.out(car1);
});
