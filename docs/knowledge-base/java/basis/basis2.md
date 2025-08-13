---
title: 基础知识2
sticky: true
category:
  - Java
tag:
  - Java基础
---

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

## 接口与抽象类

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

   ![接口中的 `static` 方法要有方法体](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/interface-static-method-should-have-body.png)

4. 从 **Java 8** 开始，接口中允许定义 `default` 方法，比如上例中的 `printBasketball()` 方法。

   为什么需要 `default` 方法？

   > 在 Java 8 之前，如果我们修改了一个接口（例如，添加了一个新方法），所有实现该接口的类都必须同时修改，以实现这个新方法。这在大型项目中，尤其是当接口被许多不同的模块或第三方库实现时，会成为一个巨大的问题，因为这将导致大量的代码修改和兼容性问题。
   >
   > `default` 方法的出现解决了这个问题。它允许我们在接口中定义带有默认实现的方法。这意味着，如果一个实现类没有提供自己的实现，它将自动继承接口中提供的默认实现，而不需要修改代码。这使得接口的演进变得更加平滑和安全。

   因此，接口中的 `default` 方法也必须要有方法体：

   ![接口中的 `default` 方法要有方法体](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/interface-%20default-method-should-have-body.png)

5. 从 **Java 9** 开始，接口中允许定义 `private` 方法来封装一些重复的逻辑，供默认方法和静态方法调用，提高代码的可读性和可维护性。

6. 接口不可以被实例化，也就是说接口不能有静态代码块和构造方法。

### 两者的区别

1. 语法层面：

   - 继承和实现：一个类只能继承一个类（包括抽象类），因为 Java 不支持多继承。但一个类可以实现多个接口，一个接口也可以继承多个其他接口。
   - 成员变量：接口中的成员变量只能是 `public static final` 类型的，不能被修改且必须有初始值。抽象类的成员变量可以有任何修饰符（`private`, `protected`, `public`），可以在子类中被重新定义或赋值。
   - 方法：Java 8 之前，接口中的方法默认是 `public abstract` ，也就是只能有方法声明。自 Java 8 起，可以在接口中定义 `default`（默认） 方法和 `static` （静态）方法。 自 Java 9 起，接口可以包含 `private` 方法。抽象类可以包含抽象方法和非抽象方法。抽象方法没有方法体，必须在子类中实现。非抽象方法有具体实现，可以直接在抽象类中使用或在子类中重写。

2. 设计层面：

   - 接口的核心设计理念是**契约**或者**能力**，它定义了一组对象可以拥有的公共行为的规范（`What`），而不关心这些行为是如何实现的。接口的关注点是行为的抽象，它描述了一个类能做什么，通常用于标识一种  `has-a` 的关系。

   - 抽象类的核心设计理念是**模版**或者**骨架**，它提供了一个部分实现的基类（可能包含具体方法和抽象方法），旨在被子类继承和扩展（`How + What`）。抽象类通常用于标识一种 `is-a` 的关系，即子类是抽象类的一种特殊类型。它不仅定义了 “我能做什么”，还可能提供了 “我如何做一部分”。

   - 举个栗子🌰：

     比如一个物流派送系统中，有多种类型的运输工具，比如：卡车、货轮、飞机、无人机等等。

     我们可以用接口定义 “能力” —— 比如 “可以飞”（`Flyable`）、“可以装货”（`Loadable`），我们不用关心对象是飞机还是无人机，只要能飞，就实现 `Flyable`；只要能装货，就实现 `Loadable`。

     ```java
     public interface Flyable {
         void fly();
     }
     
     public interface Loadable {
         void loadCargo(double weight);
     }
     ```

     我们可以用抽象类定义 “模版” —— 比如 “运输工具”（`TransportVehicle`），这个抽象类描述的是 “所有运输工具的通用部分”，比如都有一个司机、都需要执行送货操作，属于 “是一种运输工具” 的类型关系，是一个继承体系。

     ```java
     public abstract class TransportVehicle {
         protected String id;
         protected String driver;
     
         public void assignDriver(String driverName) {
             this.driver = driverName;
         }
     
         public abstract void deliver(String destination);
     }
     ```

     🚛卡车 Truck：

     ```java
     public class Truck extends TransportVehicle implements Loadable {
         @Override
         public void deliver(String destination) {
             System.out.println("Truck delivering to " + destination);
         }
     
         @Override
         public void loadCargo(double weight) {
             System.out.println("Truck loaded with " + weight + "kg");
         }
     }
     ```

     🚁无人机：

     ```java
     public class Drone extends TransportVehicle implements Flyable, Loadable {
         @Override
         public void deliver(String destination) {
             System.out.println("Drone flying to " + destination);
         }
     
         @Override
         public void fly() {
             System.out.println("Drone taking off...");
         }
     
         @Override
         public void loadCargo(double weight) {
             System.out.println("Drone loaded with " + weight + "kg");
         }
     }
     ```
## 深拷贝和浅拷贝

### 浅拷贝

浅拷贝会在堆上创建一个新的对象（区别于引用拷贝：两个不同的引用指向同一个对象），这个新对象里的基本数据类型和对应的包装数据类型以及不可变对象 `String` 成员是原对象值的副本，而引用类型成员（比如对象、数组）仅仅是复制了引用地址，这意味着原对象和新对象会共享这些引用类型成员指向的内存空间（指向同一个堆内容中的引用类型成员）。

```java
class Subject {
    String name;

    public Subject(String name) {
        this.name = name;
    }
}

class Student implements Cloneable {
    String studentName; // 不可变对象
    Subject subject;    // 引用类型成员
    int age;            // 基本数据类型
    Integer height;     // 包装数据类型

    public Student(String studentName, String subjectName, int age, Integer height) {
        this.studentName = studentName;
        this.subject = new Subject(subjectName);
        this.age = age;
        this.height = height;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // 执行浅拷贝
    }

    public void display() {
        System.out.println("学生姓名: " + studentName + ", 科目: " + subject.name + ", 年龄: " + age + ", 身高: " + height);
        System.out.println("Subject 对象内存地址: " + subject.hashCode());
    }
}

public class ShallowCopyDemo {
    public static void main(String[] args) {
        try {
            Student originalStudent = new Student("张三", "数学", 18, 175);
            System.out.println("原始学生信息:");
            originalStudent.display();

            Student clonedStudent = (Student) originalStudent.clone(); // 浅拷贝
            System.out.println("\n拷贝学生信息 (浅拷贝后):");
            clonedStudent.display();

            // 修改拷贝对象的引用类型成员
            clonedStudent.studentName = "李四";  // 不可变类型修改，互不影响
            clonedStudent.subject.name = "物理"; // 引用类型修改，会影响原对象
            clonedStudent.age = 21;             // 基本类型修改，互不影响
            clonedStudent.height = 180;         // 包装类型修改，互不影响

            System.out.println("\n修改拷贝对象后:");
            System.out.println("原始学生信息:");
            originalStudent.display(); // 注意：原对象的科目也变成了“物理”
            System.out.println("拷贝学生信息:");
            clonedStudent.display();

        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```tex
原始学生信息:
学生姓名: 张三, 科目: 数学, 年龄: 18, 身高: 175
Subject 对象内存地址: 356573597

拷贝学生信息 (浅拷贝后):
学生姓名: 张三, 科目: 数学, 年龄: 18, 身高: 175
Subject 对象内存地址: 356573597

修改拷贝对象后:
原始学生信息:
学生姓名: 张三, 科目: 物理, 年龄: 18, 身高: 175   <-- 原对象的科目也变成了“物理”
Subject 对象内存地址: 356573597
拷贝学生信息:
学生姓名: 李四, 科目: 物理, 年龄: 21, 身高: 180
Subject 对象内存地址: 356573597
```
可以看到，`originalStudent` 和 `clonedStudent` 的 `subject` 成员指向了同一个 `Subject` 对象，所以修改其中一个会导致另一个也受影响；而 `studentName`、`age` 和 `height` 则相互独立，互不影响。

![浅拷贝 —— 引用的 `Subject` 对象共享](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/shallow-copy.png)

### 深拷贝

深拷贝不仅会复制对象本身，还会递归地复制其内部所有引用的对象。这意味着原对象和新对象在内存中是完全独立的，没有任何共享的引用。

常见的深拷贝的实现方式：

1. 递归实现 `clone()`： 在 `clone()` 方法中，除了调用 `super.clone()` 进行浅拷贝外，还要手动对其所有引用类型成员调用它们的 `clone()` 方法，确保它们也被完全复制。这种方式要求所有涉及到拷贝的类都实现 `Cloneable` 接口。

2. 序列化和反序列化： 将对象先序列化成字节流，再从字节流反序列化回来。这种方式会创建全新的对象图，是实现深拷贝的一种简单有效的方法，但需要类实现 `Serializable` 接口，并且会有一定的性能开销。

3. 构造器或工厂方法： 手动编写代码，在构造新对象时，创建所有引用类型成员的新实例并拷贝数据。

下面是使用递归的方式实现的深拷贝：

```java
class SubjectDeep implements Cloneable {
    String name;

    public SubjectDeep(String name) {
        this.name = name;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // SubjectDeep 自身也需要浅拷贝
    }
}

class StudentDeep implements Cloneable {
    String studentName;
    SubjectDeep subject; // 引用类型成员
    int age;
    Integer height;

    public StudentDeep(String studentName, String subjectName, int age, Integer height) {
        this.studentName = studentName;
        this.subject = new SubjectDeep(subjectName);
        this.age = age;
        this.height = height;
    }

    // 深拷贝实现
    @Override
    protected Object clone() throws CloneNotSupportedException {
        StudentDeep clonedStudent = (StudentDeep) super.clone(); // 首先进行浅拷贝

        // 关键步骤：手动对引用类型成员进行深拷贝
        clonedStudent.subject = (SubjectDeep) subject.clone();
        return clonedStudent;
    }

    public void display() {
        System.out.println("学生姓名: " + studentName + ", 科目: " + subject.name + ", 年龄: " + age + ", 身高: " + height);
        System.out.println("SubjectDeep 对象内存地址: " + subject.hashCode());
    }
}

public class DeepCopyDemo {
    public static void main(String[] args) {
        try {
            StudentDeep originalStudent = new StudentDeep("张三", "数学", 18, 175);
            System.out.println("原始学生信息:");
            originalStudent.display();

            StudentDeep clonedStudent = (StudentDeep) originalStudent.clone(); // 深拷贝
            System.out.println("\n拷贝学生信息 (深拷贝后):");
            clonedStudent.display();

            // 修改拷贝对象的引用类型成员
            clonedStudent.studentName = "李四";
            clonedStudent.subject.name = "物理";
            clonedStudent.age = 21;
            clonedStudent.height = 180;

            System.out.println("\n修改拷贝对象后:");
            System.out.println("原始学生信息:");
            originalStudent.display(); // 注意：原对象的科目**没有**被修改
            System.out.println("拷贝学生信息:");
            clonedStudent.display();

        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

运行结果：

```tex
原始学生信息:
学生姓名: 张三, 科目: 数学, 年龄: 18, 身高: 175
SubjectDeep 对象内存地址: 356573597

拷贝学生信息 (深拷贝后):
学生姓名: 张三, 科目: 数学, 年龄: 18, 身高: 175
SubjectDeep 对象内存地址: 1735600054   <-- 地址不同了

修改拷贝对象后:
原始学生信息:
学生姓名: 张三, 科目: 数学, 年龄: 18, 身高: 175   <-- 原始对象的科目未被修改
SubjectDeep 对象内存地址: 356573597
拷贝学生信息:
学生姓名: 李四, 科目: 物理, 年龄: 21, 身高: 180
SubjectDeep 对象内存地址: 1735600054
```

现在，修改 `clonedStudent` 的 `subject` 不会影响 `originalStudent` 的 `subject`，因为 `clonedStudent.subject` 是一个全新的 `SubjectDeep` 对象，在内存中与原对象是完全独立的。

![深拷贝 —— 引用的 `Subject` 对象不共享](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/deep-copy.png)

### 两者对比

| 特性       | 浅拷贝（Shallow Copy）                                       | 深拷贝（Deep Copy）                                          |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 拷贝深度   | 只拷贝对象本身，不拷贝其内部引用的对象。                     | 递归地拷贝对象本身及其所有内部引用的对象。                   |
| 独立性     | 原始对象和拷贝对象共享引用类型成员。                         | 原始对象和拷贝对象完全独立。                                 |
| 修改影响   | 修改拷贝对象的引用类型成员，会影响原始对象。                 | 修改拷贝对象的任何成员，不影响原始对象。                     |
| 适用场景   | 1. 对象只包含基本数据类型及其对应包装类型。  2. 对象包含不可变对象（如 String）。 3. 你可以接受共享引用类型成员的风险，或不需要修改它们。 | 1. 对象包含可变的引用类型成员。  2. 需要确保原对象和拷贝对象完全隔离，修改互不影響。 |
| 实现复杂性 | 简单，直接调用 super.clone()。                               | 复杂，需要递归拷贝所有层级的引用对象。                       |


