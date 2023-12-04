class RealImg {
  fileName: string;
  constructor(fileName: string) {
    this.fileName = fileName;
    this.loadFromDist();
  }
  display() {
    console.log('display...', this.fileName);
  }
  private loadFromDist() {
    console.log('loading...', this.fileName);
  }
}
class ProxyImg {
  readImg: RealImg;
  constructor(fileName: string) {
    this.readImg = new RealImg(fileName);
  }
  display() {
    this.readImg.display();
  }
}
const proxImg = new ProxyImg('xxx.png'); // 使用代理
proxImg.display();
