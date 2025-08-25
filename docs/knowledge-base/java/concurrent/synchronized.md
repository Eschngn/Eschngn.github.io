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

## Java 对象头

HotSpot 虚拟机中，对象在内存中存储的布局可以分为三块区域：对象头 `（Header）`、实例数据 `（Instance Data）` 和对齐填充 `（Padding）`。

- 对象头：关于堆对象的布局、类型、GC 状态、同步状态和标识哈希码的基本信息；

- 实例数据：是对象存储其实际字段值的地方，包含了对象的所有成员变量。JVM 在存储实例数据时，遵循一定的对齐策略，通常先是父类的实例变量，然后是子类的实例变量。字段通常按 `longs`、`doubles`、`ints`、`shorts`、`chars`、`bytes`、`booleans`、`oops` （普通对象指针）的顺序存放。

- 对其填充：当对象头和实例数据的大小加起来不是 8 字节的倍数时，JVM 会在对象末尾添加一些额外的字节（这些字节内容是无意义的，只是为了对齐），直到总大小满足 8 字节的倍数。现代 CPU 都是以字 `（Word）` 为单位读取内存，通常是 8 字节。如果对象不是 8 字节的倍数，CPU 可能需要多次读取才能获取完整的对象，影响性能。除此之外，某些操作需要对齐来保证原子性。

![Java 对象组成](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/java-object.png)



## 实现原理

1. 加锁和释放锁的原理：

   加锁：当线程进入同步块或同步方法时，线程需要获得该对象的监视器锁 （`Monitor Lock`）。这个锁是由 JVM 内部的对象头中的锁标志位来实现的。当一个线程获得锁后，其他线程就无法进入同一个对象的同步块或同步方法，必须等待锁被释放。

   释放锁：线程退出同步块或同步方法后，会自动释放锁（无论是正常退出还是因异常退出）。锁的释放通知其他等待该锁的线程可以竞争锁，等待线程按照一定的顺序重新获得锁并进入同步块。

   锁的获取和释放过程涉及到 JVM 的 `MonitorEnter` 和 `MonitorExit` 指令：

   - `MonitorEnter` 指令：当线程进入同步块时，尝试获取锁。
   - `MonitorExit` 指令：当线程退出同步块时，释放锁。

   这两个指令我们可以通过查看字节码看到：

   ```java
   public static void main(String[] args) {
       Object object = new Object();
       int count = 0;
       synchronized (object) {
           count++;
       }
   }
   ```

   以上 Java 代码的字节码如下图所示：

   ![`synchronized` 字节码](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/synchronized-bytecode.png)

2. 可重入原理：

   `synchronized` 是可重入的，这意味着同一个线程在持有某个对象的锁时，可以再次进入这个对象上其他被 `synchronized` 修饰的同步方法或同步块，而不会发生死锁。

   这是通过为每个锁维护一个计数器和线程持有者来实现的：

   - 当线程第一次获得锁时，计数器加 `1`，并且记录持有该锁的线程。
   - 如果同一个线程再次进入同步方法，计数器会再次递增，而不是阻塞。
   - 当线程退出同步方法时，计数器会递减，直到计数器为 `0` 时，线程才真正释放锁，其他线程才能获取锁。

3. 保证可见性原理

   `synchronized` 还通过内存屏障 （`Memory Barrier`） 机制确保可见性。当一个线程对共享变量进行修改后，其他线程可以看到最新的值，而不会读取到旧值。

   - 进入同步块前：JVM 会将当前线程对共享变量的所有缓存内容刷新到主内存（对应 `MonitorEnter` 指令）。

   - 退出同步块后：JVM 会将修改过的变量从工作内存同步回主内存，并使其他线程的工作内存中这些变量的缓存失效（对应 `MonitorExit` 指令）。

`synchronized` 同步语句块的实现使用的是 `monitorenter` 和 `monitorexit` 指令，其中 `monitorenter` 指令指向同步代码块的开始位置，`monitorexit` 指令则指明同步代码块的结束位置。

`synchronized` 修饰的方法并没有 `monitorenter` 指令和 `monitorexit` 指令，取而代之的是 `ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法。如果是实例方法，JVM 会尝试获取实例对象的锁。如果是静态方法，JVM 会尝试获取当前 `class` 的锁

不过两者的本质都是对对象监视器 `monitor` 的获取。

