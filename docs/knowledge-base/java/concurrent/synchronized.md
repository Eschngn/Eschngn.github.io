---
title: synchronized
category:
  - Java
tag:
  - Java 并发编程
---

`synchronized` 是 Java 中用于实现同步的关键字，它是解决多线程并发访问共享资源时，保证数据一致性的重要手段。`synchronized` 提供了一种排他性锁的机制，确保同一时间只有一个线程可以访问被同步的代码块或方法。

## 作用

`synchronized` 关键字的作用主要体现在三个方面：

1. 原子性 （`Atomicity`）：确保一段代码作为一个整体执行，中间不会被其他线程中断。例如，`i++` 这样的操作看似简单，实际上是读 - 改 - 写三个步骤，不是原子性的。`synchronized` 可以将这个复合操作锁定，使其成为一个不可分割的原子操作。

2. 可见性 （`Visibility`）：确保当一个线程修改了共享变量后，这个修改能够立即被其他线程看到。`synchronized` 在释放锁时，会将线程工作内存中的变量刷新到主内存中，在获取锁时，又会从主内存中读取最新的变量值。

3. 有序性 （`Ordering`）：阻止指令重排序。`synchronized` 提供的内存语义可以防止编译器和处理器对同步代码块内的指令进行重排序。

## 用法

`synchronized` 可以用来修饰方法和代码块。

1.同步方法（`Synchronized Method`）

```java
public synchronized void increment() {
    this.count++;
}
```

当在成员方法声明中使用了 `synchronized` 关键字，就表示该方法是同步的，也就是说，线程在执行这个方法的时候，其他线程不能同时执行，需要等待锁释放，使用的是**类的对象实例**作为监视器对象 `monitor`。

如果是静态方法的话，锁的是这个**类的 Class 对象**，因为静态方法是属于类级别的。

```java
public static synchronized void increment() {
    count++;
}
```

2.同步代码块 (`Synchronized Block`)

```java
public void increment() {
    synchronized (this) {
        this.count++;
    }
}
```

同步代码块可以减少需要同步的代码量，颗粒度更低，更灵活。

`synchronized` 后面的括号中指定了要锁定的对象，可以是 `this`，也可以是自定义对象或者类的 `Class` 对象（`ClassName.class`）。

通常为一个普通的 `private` 成员变量，如 `private Object object = new Object()`，这样使用了所有该 `object` 对象的同步代码块，在任何时候只能存在一个线程访问。

⚠️注意：

- 一把锁只能同时被一个线程获取，没有获得锁的线程只能等待；
- 每个实例都对应有自己的一把锁 (`this`),不同实例之间互不影响；例外：锁对象是 `*.class` 以及 `synchronized` 修饰的是 `static` 方法的时候，所有对象公用同一把锁；
- `synchronized` 修饰的方法，无论方法正常执行完毕还是抛出异常，都会释放锁。

## 实现原理