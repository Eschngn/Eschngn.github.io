---
title: 值传递
category:
  - Java
tag:
  - Java基础
---

程序设计语言将实参传递给方法（或函数）的方式分为两种：

- 值传递：方法接收的是实参值的拷贝，会创建副本。
- 引用传递：方法接收的直接是实参所引用的对象在堆中的地址，不会创建副本，对形参的修改将影响到实参。

很多程序设计语言（比如 C++、 Pascal ）提供了两种参数传递的方式，不过，在 Java 中只有值传递。

值传递是指在方法调用时，将实际参数的副本传递给形式参数。方法内部对形式参数的任何修改，都只会影响该副本，而不会影响到原始的实际参数。

- 对于基本数据类型： 传递的是值的字面量副本。

- 对于引用数据类型： 传递的是引用（内存地址）的副本。

## 基本数据类型

当传递一个基本数据类型时，方法接收的是该值的拷贝。

```java
public class PrimitivePassByValue {
    public static void changeValue(int x) {
        System.out.println("修改值方法内部开始时 x 的值: " + x);
        x = 20; // 改变的是 x 的副本
        System.out.println("修改值方法内部结束时 x 的值: " + x);
    }

    public static void swap(int x, int y) {
        int temp = x;
        x = y;
        y = temp;
        System.out.println("交换值方法内部结束时 x 的值：" + x);
        System.out.println("交换值方法内部结束时 y 的值：" + y);
    }

    public static void main(String[] args) {
        System.out.println("===============修改值==================");
        int a = 10;
        System.out.println("调用修改值方法前 a 的值: " + a);

        changeValue(a); // 将 a 的值 (10) 拷贝给 x

        System.out.println("调用修改值方法后 a 的值: " + a); // a 的值依然是 10

        System.out.println("===============交换值==================");

        int num1 = 1;
        int num2 = 2;
        swap(num1, num2);
        System.out.println("调用交换值方法后 num1 的值：" + num1);
        System.out.println("调用交换值方法后 num2 的值：" + num2);
    }
}
```

输出如下：

```
===============修改值==================
调用修改值方法前 a 的值: 10
修改值方法内部开始时 x 的值: 10
修改值方法内部结束时 x 的值: 20
调用修改值方法后 a 的值: 10
===============交换值==================
交换值方法内部结束时 x 的值：2
交换值方法内部结束时 y 的值：1
调用交换值方法后 num1 的值：1
调用交换值方法后 num2 的值：2
```

`changeValue` 方法中的 `x` 只是 `a` 的一个独立副本，尽管 `x` 的值在方法内部被修改为 20，但它对 `main` 方法中的 `a` 没有任何影响。`x` 相当于是 `a` 的一个副本，副本的内容无论怎么修改，都不会影响到原件本身。

Java 基本数据类型是存储在虚拟机栈内存中，栈中存放着栈帧，方法调用的过程，就是栈帧在栈中入栈、出栈的过程。

当执行 `main` 方法的时候，就往虚拟机栈中压入一个栈帧，栈帧中存储的局部变量信息是 `a = 10`。

当执行 `changeValue` 方法的时候，再往虚拟机栈中压入一个栈帧，栈帧中存储的局部变量信息是 `a = 10`。

![值传递的方法栈帧](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/value-passing-method-stack-frame.png)

修改 `changeValue` 栈帧中数据，显然不会影响到 `main` 方法栈帧的数据。

同理，在 `swap` 方法中，`x` 和 `y` 的值是从 `num1`、`num2` 复制过来的，对副本的值的交换并不会影响原件本身。

![基本数据类型的值交换](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/basic-data-swap.png)

## 引用数据类型

当传递一个引用数据类型（如对象、数组）时，传递的是指向该对象的内存地址的副本，形式参数和实际参数都指向堆内存中的同一个对象。

- 修改对象内容：如果在方法内部通过引用修改了对象的内容，这些修改会反映到原始对象上，因为它们都指向同一个地址。

- 重新分配引用：如果在方法内部为形式参数重新分配了一个新的对象，这并不会影响原始参数的引用。

```java
public class ReferencePassByValue {
    public static void changeObjectName(Person p) {
        System.out.println("修改值方法内部开始时 p 的值: " + p);
        p.name = "Bob"; // 修改对象的内容
        System.out.println("修改值方法内部结束时 p 的值: " + p);
    }

    public static void reassignObject(Person p) {
        System.out.println("重新分配对象方法内部开始时 p 的值: " + p);
        p = new Person("Charlie"); // p 被重新赋值，指向了一个新的对象
        System.out.println("重新分配对象方法内部结束时 p 的值: " + p);
    }

    public static void swap(Person p1, Person p2) {
        Person temp = p1;
        p1 = p2;
        p2 = temp;
        System.out.println("交换值方法内部结束时 p1 的值：" + p1);
        System.out.println("交换值方法内部结束时 p2 的值:" + p2);
    }

    public static void main(String[] args) {
        System.out.println("===============修改值==================");
        Person alice = new Person("Alice");
        System.out.println("调用修改值方法前 alice 的值: " + alice);

        changeObjectName(alice); // 传递 Alice 引用的副本

        System.out.println("调用修改值方法后 alice 的值: " + alice);

        System.out.println("===============重新分配对象==================");
        Person mike = new Person("Mike");
        System.out.println("调用重新分配对象方法前 mike 的值: " + mike);

        reassignObject(mike); // 传递的是 mike 引用的副本

        System.out.println("调用重新分配对象方法后 mike 的值: " + mike); // mike 保持不变

        System.out.println("===============交换值==================");

        Person person1 = new Person("zhangsan");
        Person person2 = new Person("lisi");
        swap(person1, person2);
        System.out.println("调用交换值方法后 person1 的值：" + person1);
        System.out.println("调用交换值方法后 person2 的值：" + person2);


    }
}

class Person {
    String name;

    public Person(String name) {
        this.name = name;
    }

    public String toString() {
        return "Person{name='" + name + "'}";
    }
}
```

输出如下：

```
===============修改值==================
调用修改值方法前 alice 的值: Person{name='Alice'}
修改值方法内部开始时 p 的值: Person{name='Alice'}
修改值方法内部结束时 p 的值: Person{name='Bob'}
调用修改值方法后 alice 的值: Person{name='Bob'}
===============重新分配对象==================
调用重新分配对象方法前 mike 的值: Person{name='Mike'}
重新分配对象方法内部开始时 p 的值: Person{name='Mike'}
重新分配对象方法内部结束时 p 的值: Person{name='Charlie'}
调用重新分配对象方法后 mike 的值: Person{name='Mike'}
===============交换值==================
交换值方法内部结束时 p1 的值：Person{name='lisi'}
交换值方法内部结束时 p2 的值:Person{name='zhangsan'}
调用交换值方法后 person1 的值：Person{name='zhangsan'}
调用交换值方法后 person2 的值：Person{name='lisi'}
```

虽然 `p` 是 `alice` 引用的副本，但它们都指向堆中的同一个 `Person` 对象。因此，通过 `p` 修改对象的 `name` 字段，`alice` 也能看到这个变化。

但如果在方法内部，我们给 `p` 重新赋了一个新对象的引用。这个操作只改变了 `p` 副本的指向，对 `main` 方法中的 `mike` 毫无影响。

![引用数据类型的值传递](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/reference-data-pass-value.png)

`swap` 方法中也是同理，`p1` 和 `p2` 只是拷贝的是实参 `person1` 和 `person2` 的地址，因此交换也只是交换 `p1` 和 `p2` 的引用，并不会影响到实参 `person1` 和 `person2` 的引用。

![引用数据类型的值交换](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/reference-data-swap.png)