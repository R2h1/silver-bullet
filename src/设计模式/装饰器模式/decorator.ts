class Circle {
  draw() {
    console.log('画一个圆');
  }
}
class Decorator {
  private circle: Circle;
  constructor(circle: Circle) {
    this.circle = circle;
  }
  draw() {
    this.circle.draw();
    this.setBorder();
  }
  private setBorder() {
    console.log('设置边框颜色');
  }
}
const circle = new Circle();
circle.draw();
const decorator = new Decorator(circle);
decorator.draw();
