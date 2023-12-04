/**
 * 1. 创建原型接口，并在其中声明克隆方法。如果你已有类层次结构，则只需在其所有类中添加该方法即可。
 * 2. 原型类必须另行定义一个以该类对象为参数的构造函数。构造函数必须复制参数对象中的所有成员变量值到新建实体中。如果你需要修改子类，则必须调用父类构造函数，让父类复制其私有成员变量值。
 * 3. 如果编程语言不支持方法重载，那么你可能需要定义一个特殊方法来复制对象数据。在构造函数中进行此类处理比较方便，因为它在调用 new 运算符后会马上返回结果对象。
 * 4. 克隆方法通常只有一行代码：使用 new 运算符调用原型版本的构造函数。 注意，每个类都必须显式重写克隆方法并使用自身类名调用 new 运算符。否则，克隆方法可能会生成父类的对象。
 */
class ComponentWithBackReference {
  public prototype;

  constructor(prototype: Prototype) {
    this.prototype = prototype;
  }
}
class Prototype {
  public primitive: any;
  public component!: object;
  public circularReference!: ComponentWithBackReference;

  public clone(): this {
    const clone = Object.create(this);

    clone.component = Object.create(this.component);

    // 克隆具有反向引用嵌套对象的对象需要特殊处理。克隆完成后，嵌套对象应该指向克隆对象，而不是原始对象。对于这种情况，扩展运算符很方便。
    clone.circularReference = {
      ...this.circularReference,
      prototype: { ...this }
    };

    return clone;
  }
}
