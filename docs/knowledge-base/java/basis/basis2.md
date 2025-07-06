---
sticky: true
category:
  - Java
tag:
  - Java基础
---

# 基础知识2

## 面向对象

面向过程编程（Procedural-Oriented Programming，POP）和面向对象编程（Object-Oriented Programming，OOP）是两种常见的编程范式，两者对比如下：

| 比较项         | 面向过程（POP）      | 面向对象（OOP）          |
| ----------- | -------------- | ------------------ |
| **核心思想**    | 以过程（函数）为中心     | 以对象（类）为中心          |
| **组织方式**    | 程序 = 函数 + 数据   | 程序 = 对象（属性 + 方法）   |
| **关注点**     | 关注流程和步骤        | 关注数据和行为            |
| **数据访问**    | 数据是公开的，函数直接操作  | 数据封装在对象中，通过方法访问    |
| **扩展性和维护性** | 结构紧密，修改难度大     | 模块化强，易于扩展与维护       |
| **重用性**     | 通过函数复用         | 通过类继承、接口、多态复用      |
| **适用场景**    | 小程序、算法流程清晰的系统  | 中大型系统、复杂业务逻辑建模     |
| **代表语言**    | C、汇编、早期 Pascal | Java、C++、Python、C# |

OOP 的三大特征

- 封装：把数据和操作封装在对象中，不允许外部对象直接访问对象内部的信息，但对外暴露接口，提供一些可以被外界访问的方法来操作属性。

- 继承：使用已存在的类的定义作为基础建立新类的技术，新类的定义可以增加新的数据或新的功能，也可以用父类的功能，但不能选择性地继承父类。

  ⚠️关于继承，注意以下几点：

  1. 子类拥有父类对象所有的属性和方法（包括私有属性和私有方法），但是父类中的私有属性和方法子类是无法访问，**只是拥有**。
  2. 子类可以拥有自己属性和方法，即子类可以对父类进行扩展。
  3. 子类可以用自己的方式实现父类的方法。

- 多态：一个对象具有多种的状态，具体的表现为父类的引用指向子类对象的实例，动态绑定调用方法。

  ```java
  Animal animal = new Dog(); // Animal 是父类，Dog 是它的子类
  ```

  ⚠️关于多态，注意以下几点：

  1. 对象类型和引用类型之间具有继承（类）/实现（接口）的关系；
  2. 引用类型变量发出的方法调用的到底是哪个类中的方法，必须在程序运行期间才能确定；
  3. 多态不能调用“只在子类存在但在父类不存在”的方法；
  4. 如果子类重写了父类的方法，真正执行的是子类重写的方法，如果子类没有重写父类的方法，执行的是父类的方法。

### 抽象类

抽象类（`abstract class`） 是一种不能被实例化的类，用来被子类继承并扩展，其主要作用是为一组子类提供共同的属性、行为或接口定义。子类继承抽象类时，子类必须实现父类中定义的抽象方法。

如果一个抽象类 A，继承一个抽象类 B，此时不需要重写 B 中的抽象方法，但当 A 被继承时，A 的子类还是要重写 B 中的抽象方法。

```java
abstract class 类名 {
    // 成员变量
    // 构造方法（可有）
    // 普通方法（可实现）
    // 抽象方法（无方法体，至少有一个）
}
```

### 接口

接口通过 interface 关键字来定义，它可以包含一些常量和方法，如下所示：

```java
public interface BasketballPlayer {
    // 常量
    String NAME = "Shawn";

    // 抽象方法
    String getName();

    // 静态方法
    static boolean isTrue(String name) {
        return name.equals(NAME);
    }

    // 默认方法
    default void printBasketball(){
        System.out.println("篮球");
    }

}
```

反编译这段代码的字节码后，如下所示：

```java
public interface BasketballPlayer {
  public static final String NAME;
  public abstract String getName();
  public static boolean isTrue(String);
  public void printBasketball();
}
```

可以发现以下几点：

1. 没有 `private`、`default` 或者 `static` 修饰的方法是隐式抽象的，会自动加上 `public abstract` 修饰符，正如上例中的 `getName` 方法，其实是一个抽象方法 —— 这便是定义接口的意义。

2. 接口中定义的变量默认是用 `public static final` 修饰的。

   Java 官方文档上有这样的声明：

   > Every field declaration in the body of an interface is implicitly public, static, and final.

   因此，接口可以用来作为常量类使用，还能省略掉 `public static final`。

3. 从 **Java 8** 开始，接口中允许引入静态方法，比如上例中的 `isTrue()` 方法，这允许我们可以在接口中提供一些与接口本身紧密关联的实用的辅助方法，而不必创建一个单独的工具类来存放这些方法，从而提高提高内聚性。

   因此，接口中的 `static` 方法必须要有方法体：

   ![接口中的 `static` 方法要有方法体](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/image-20250706153005671.png)

4. 从 **Java 8** 开始，接口中允许定义 `default` 方法，比如上例中的 `printBasketball()` 方法。

   为什么需要 `default` 方法？

   > 在 Java 8 之前，如果我们修改了一个接口（例如，添加了一个新方法），所有实现该接口的类都必须同时修改，以实现这个新方法。这在大型项目中，尤其是当接口被许多不同的模块或第三方库实现时，会成为一个巨大的问题，因为这将导致大量的代码修改和兼容性问题。
   >
   > `default` 方法的出现解决了这个问题。它允许我们在接口中定义带有默认实现的方法。这意味着，如果一个实现类没有提供自己的实现，它将自动继承接口中提供的默认实现，而不需要修改代码。这使得接口的演进变得更加平滑和安全。

   因此，接口中的 `default` 方法也必须要有方法体：

   ![接口中的 `default` 方法要有方法体](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/image-20250706153111078.png)

5. 从 **Java 9** 开始，接口中允许定义 `private` 方法来封装一些重复的逻辑，供默认方法和静态方法调用，提高代码的可读性和可维护性。

6. 接口不可以被实例化，也就是说接口不能有静态代码块和构造方法。

