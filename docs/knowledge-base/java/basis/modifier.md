---
title: 修饰符
star: 10
sticky: 10
category:
  - Java
tag:
  - Java基础
---

# 修饰符

Java 的修饰符主要分为两大类：

访问控制修饰符（`Access Control Modifiers`）：用于控制类、方法和字段的可见性。

非访问控制修饰符（`Non-Access Modifiers`）：用于指定程序元素的特殊行为和特性。

## 访问控制修饰符

### `public`

公开的，被 `public` 修饰的类、方法或字段，可以在任何包中的任何类被访问。

### `protected`

受保护的，不能修饰类（除了内部类），被 `protected` 修饰的方法或字段，可以在同一个包内以及不同包的子类中被访问。

### `default`

包访问权限，如果不指定任何访问修饰符，那么它就是 `default` 访问级别，默认访问模式下的类、方法和变量可以被同一包中的其他类访问。

### `private`

私有的，不能修饰类（除了内部类），被 `private`  修饰的方法或字段，只能在声明它们的类内部被访问,通常用于封装类的内部实现细节，对外提供公共方法（`getter/setter`）进行访问。

## 非访问控制修饰符

### `static`

静态的，`static` 成员（字段或方法）属于类本身，而不是类的任何特定实例。

- 静态变量（类变量）：定义在类中的变量，如果用 `static` 修饰，则该变量是所有对象共享的。

  ```java
  public class MyClass {
      public static int staticVar = 0;
  
      public void incrementStaticVar() {
          staticVar++;
      }
  }
  
  public class Main {
      public static void main(String[] args) {
          MyClass obj1 = new MyClass();
          MyClass obj2 = new MyClass();
          
          obj1.incrementStaticVar();
          obj2.incrementStaticVar();
  
          System.out.println(MyClass.staticVar); // 输出：2
      }
  }
  ```

- 静态方法：静态方法可以直接通过类名调用，不需要创建类的实例。静态方法不能访问实例变量和实例方法，只能访问静态变量和静态方法。

  ```java
  public class MyClass {
      public static void staticMethod() {
          System.out.println("This is a static method.");
      }
  }
  
  public class Main {
      public static void main(String[] args) {
          MyClass.staticMethod(); // 调用静态方法
      }
  }
  ```

- 静态代码块：静态代码块用于初始化静态变量，在类加载时执行。

  ```java
  public class MyClass {
      static {
          System.out.println("Static block executed.");
      }
  }
  
  public class Main {
      public static void main(String[] args) {
          MyClass obj = new MyClass(); // 静态块在类加载时执行
      }
  }
  ```

### `final`

最终的，`final` 修饰符用于表示不可改变的常量、不可继承的类或不可重写的方法。


- `final` 变量：使用 `final` 修饰的变量不可改变，必须在声明时或通过构造方法初始化。

  ```java
  public class MyClass {
      public final int finalVar = 10;
  
      public void changeFinalVar() {
          // finalVar = 20; // 错误：无法改变 final 变量
      }
  }
  ```

- `final` 方法：使用 `final` 修饰的方法不能被子类重写。

  ```java
  public class Parent {
      public final void finalMethod() {
          System.out.println("This method cannot be overridden.");
      }
  }
  
  public class Child extends Parent {
      // public void finalMethod() { // 错误：无法重写 final 方法
      // }
  }
  ```

- `final` 类：使用 `final` 修饰的类不能被继承。

  ```java
  public final class MyClass {
      // Class implementation
  }
  
  // public class SubClass extends MyClass { // 错误：无法继承 final 类
  // }
  ```

### `abstract`

抽象的，用于声明抽象类和抽象方法。

- `abstract` 类：不能被直接实例化。它通常包含抽象方法，需要子类去实现。

- `abstract` 方法：只有方法签名，没有方法体。子类必须实现所有继承的抽象方法，除非子类也是抽象类。 

### `sychronized`

同步的，用于方法和代码块，确保在多线程环境下，同一时间只有一个线程可以访问该方法或代码块，用于实现线程安全。

### `volatile`

易变的，用于字段。它确保多线程环境下，对该字段的修改总是被立即写入主内存，并且每次读取都从主内存中获取最新值，防止编译器或处理器进行缓存优化，从而保证了可见性。

### `transient`

瞬态的，用于字段，当一个对象被序列化（转换为字节流，如保存到文件或网络传输）时，被 `transient` 修饰的字段将不会被序列化。反序列化时，这些字段将恢复为它们的默认值（例如，对象类型为 null，基本类型为 0）。

### `native`

本地的，用于方法。表示该方法是用非 Java 语言（如 C/C++）实现的，并通过 Java 本地接口（JNI）与 Java 代码进行交互。

### 可变长参数

`...`，可变长参数，它允许我们在方法中接受不定数量的同类型参数。这个特性在 Java 5 中引入，主要用于简化需要接受多个参数但数量不定的情况，例如打印日志、格式化字符串或处理一系列的数值。

⚠️注意：

- 一个方法中只能有一个可变长参数：这是因为编译器需要知道哪些参数是可变的。如果允许有多个，编译器将无法确定如何匹配传递的参数。

    ```java
    // 错误示例：不能有两个可变长参数
    // public void calculate(int... nums, String... names) {}
    ```

- 可变长参数必须是参数列表的最后一个参数：这是为了避免歧义。如果可变长参数后面还有其他参数，编译器将无法确定哪些参数属于可变长部分，哪些属于后面的常规参数。

    ```java
    // 正确示例：可变长参数放在最后
    public void doSomething(String prefix, int... numbers) { /* ... */ }

    // 错误示例：可变长参数后面还有其他参数
    // public void doSomethingElse(int... numbers, String suffix) { /* ... */ }
    ```

- 可变长参数在内部被当作数组处理：尽管我们在调用方法时可以传递一系列独立的参数，但在方法内部，这些参数会被自动封装成一个对应类型的数组。我们可以使用数组的所有操作（如 length 属性、循环遍历等）。
