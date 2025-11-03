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

锁定的对象通常为一个普通的 `private` 成员变量，如 `private Object object = new Object()`，这样使用了所有该 `object` 对象的同步代码块，在任何时候只能存在一个线程访问。

⚠️注意：

- 一把锁只能同时被一个线程获取，没有获得锁的线程只能等待；
- 每个实例都对应有自己的一把锁 (`this`),不同实例之间互不影响；例外：锁对象是 `*.class` 以及 `synchronized` 修饰的是 `static` 方法的时候，所有对象公用同一把锁；
- `synchronized` 修饰的方法，无论方法正常执行完毕还是抛出异常，都会释放锁。

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

## Java 对象头

HotSpot 虚拟机中，对象在内存中存储的布局可以分为三块区域：对象头 `（Object Header）`、实例数据 `（Instance Data）` 和对齐填充 `（Padding）`。

- 对象头：关于堆对象的布局、类型、`GC` 状态、同步状态和标识哈希码的基本信息；

- 实例数据：是对象存储其实际字段值的地方，包含了对象的所有成员变量。JVM 在存储实例数据时，遵循一定的对齐策略，通常先是父类的实例变量，然后是子类的实例变量，字段通常按 `longs`、`doubles`、`ints`、`shorts`、`chars`、`bytes`、`booleans`、`oops` （普通对象指针）的顺序存放。

- 对齐填充：当对象头和实例数据的大小加起来不是 `8` 字节的倍数时，JVM 会在对象末尾添加一些额外的字节（这些字节内容是无意义的，只是为了对齐），直到总大小满足 `8` 字节的倍数。现代 CPU 都是以字 `（Word）` 为单位读取内存，通常是 `8` 字节。如果对象不是 `8` 字节的倍数，CPU 可能需要多次读取才能获取完整的对象，影响性能。除此之外，某些操作需要对齐来保证原子性。

![Java 对象组成](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/java-object.png)

其中，具体对象头的详情如下：

### 标记字段 `（Mark Word）`

标记字段是对象头的核心，用于存储对象的运行时数据，如哈希码 `（HashCode）`、`GC` 分代年龄、锁状态标志、线程持有的锁、偏向线程 `ID`、偏向时间戳等等。

这部分数据的长度在 `32` 位和 `64` 位的虚拟机中分别为 `32 bit` 和 `64 bit`。

在运行期间，`Mark Word` 里存储的数据会随着锁标志位的变化而变化。

其中，在 `32` 位虚拟机下，`Mark Word` 可能变化存储的数据如下所示:

![`32` 位虚拟机下 `Mark Word` 的存储结构](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/java-object-32-bit-jvm.png)

`32` 位标记字的详情如下：

```
|-------------------------------------------------------|--------------------|
|                  Mark Word (32 bits)                  |       State        |
|-------------------------------------------------------|--------------------|
| identity_hashcode:25 | age:4 | biased_lock:1 | lock:2 |       Normal       |
|-------------------------------------------------------|--------------------|
|  thread:23 | epoch:2 | age:4 | biased_lock:1 | lock:2 |       Biased       |
|-------------------------------------------------------|--------------------|
|               ptr_to_lock_record:30          | lock:2 | Lightweight Locked |
|-------------------------------------------------------|--------------------|
|               ptr_to_heavyweight_monitor:30  | lock:2 | Heavyweight Locked |
|-------------------------------------------------------|--------------------|
|                                              | lock:2 |    Marked for GC   |
|-------------------------------------------------------|--------------------|
```

在 `64` 位虚拟机下，`Mark Word` 可能变化存储的数据如下所示:


![`64` 位虚拟机下 `Mark Word` 的存储结构](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/java-object-64-bit-jvm.png)

`64` 位标记字的详情如下：

```
|------------------------------------------------------------------------------|--------------------|
|                                  Mark Word (64 bits)                         |       State        |
|------------------------------------------------------------------------------|--------------------|
| unused:25 | identity_hashcode:31 | unused:1 | age:4 | biased_lock:1 | lock:2 |       Normal       |
|------------------------------------------------------------------------------|--------------------|
| thread:54 |       epoch:2        | unused:1 | age:4 | biased_lock:1 | lock:2 |       Biased       |
|------------------------------------------------------------------------------|--------------------|
|                       ptr_to_lock_record:62                         | lock:2 | Lightweight Locked |
|------------------------------------------------------------------------------|--------------------|
|                     ptr_to_heavyweight_monitor:62                   | lock:2 | Heavyweight Locked |
|------------------------------------------------------------------------------|--------------------|
|                                                                     | lock:2 |    Marked for GC   |
|------------------------------------------------------------------------------|--------------------|
```
> `Epoch` 的本质是一个时间戳，代表了偏向锁的有效性。
### 类型指针 `（Klass Pointer）`

这是一个指针，指向该对象所属类的元数据 （`Class` 对象），通过这个指针，JVM 可以确定对象是哪个类的实例，从而找到其方法、字段等信息。

该指针的位长度为 JVM 的一个字大小，即 `32` 位的 JVM 为 `32` 位，`64` 位的 JVM 为 `64` 位。

如果应用的对象过多，使用 `64` 位的指针将浪费大量内存，统计而言， `64` 位的 JVM 将会比 `32` 位的 JVM 多耗费 `50%` 的内存。为了节约内存可以使用选项 `+UseCompressedOops` 开启指针压缩，其中，`oop` 即 `ordinary object pointer` 普通对象指针。开启该选项后，下列指针将压缩至 `32` 位：

- 每个 `Class` 的属性指针（即静态变量）

- 每个对象的属性指针（即对象变量）

- 普通对象数组的每个元素指针

当然，也不是所有的指针都会压缩，一些特殊类型的指针 JVM 不会优化，比如指向 `PermGen` 的 `Class` 对象指针 (JDK 中指向元空间的 `Class` 对象指针)、本地变量、堆栈元素、入参、返回值和 `NULL` 指针等。

### 数组长度 `（Array Length）`

如果对象是一个数组，那么对象头还需要有额外的空间用于存储数组的长度。

这部分数据的长度也随着 JVM 架构的不同而不同：32 位的 JVM 上，长度为 32 位；64 位 JVM 则为 64 位。

64 位 JVM 如果开启 `+UseCompressedOops` 选项，该区域长度也将由 64 位压缩至 32 位。

## 锁升级

Java SE 1.6 为了减少获得锁和释放锁带来的性能消耗，引入了“偏向锁”和“轻量级锁”，在 Java SE 1.6 中，锁一共有 `4` 种状态，级别从低到高依次是：无锁状态、偏向锁状态、轻量级锁状态和重量级锁状态，这几个状态会随着竞争情况逐渐升级。锁可以升级但不能降级，意味着偏向锁升级成轻量级锁后不能降级成偏向锁。这种锁升级却不能降级的策略，目的是为了提高获得锁和释放锁的效率。

### 偏向锁

HotSpot 的作者经过研究发现，大多数情况下，锁不仅不存在多线程竞争，而且总是由同一线程多次获得，为了让线程获得锁的代价更低而引入了偏向锁。

#### 偏向锁的获取

- 当一个线程访问同步块并获取锁时，会在对象头和栈帧中的锁记录里存储锁偏向的线程 `ID`；

- 以后该线程在进入和退出同步块时不需要进行 CAS 操作来加锁和解锁，只需简单地测试一下对象头的 `Mark Word` 里是否存储着指向当前线程的偏向锁；

- 如果测试成功（ `Mark Word` 中已存储当前线程 ID），表示线程已经获得了锁。如果测试失败（ `Mark Word` 中没有存储当前线程的 ID），则当前线程会尝试使用 CAS 将对象头的偏向锁指向当前线程，如果 CAS 操作成功，那么获取偏向锁成功，执行同步代码块；如果 CAS 操作失败，那么表示有竞争，当前抢锁的线程被挂起，撤销占锁线程的偏向锁，然后将偏向锁膨胀为轻量级锁。

为了更好的理解，我们使用代码并配合 OpenJDK 官网提供的查看对象内存布局的工具 [JOL (java object layout)] (https://github.com/openjdk/jol)来展示偏向锁的获取过程，通过 Maven 引入到项目中：

```xml
<dependency>
  <groupId>org.openjdk.jol</groupId>
  <artifactId>jol-core</artifactId>
  <version>0.16</version>
</dependency>
```

示例代码如下：

```java
@Slf4j
public class BiasedLockDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(5000);
        Lock lock = new Lock();
        log.info("抢占锁前 lock 的状态：\n{}",lock.getObjectStruct());
        Thread thread = new Thread(() -> {
            synchronized (lock) {
                log.info("占有锁 lock 的状态：\n{}", lock.getObjectStruct());
            }

        }, "biased-lock-thread");
        thread.start();
        thread.join();
        log.info("释放锁后 lock 的状态：\n{}", lock.getObjectStruct());

    }

    @Data
    public static class Lock {
        private String name;

        public String getObjectStruct() {
            return ClassLayout.parseInstance(this).toPrintable();
        }
    }
}
```

运行结果如下：

![MarkWord 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-lock-markword.png)

为什么主线程获取锁对象之前，这个锁对象是无锁状态 `（non-biasable）` 呢？

我们知道 JDK 1.6 之后默认是开启偏向锁的，但是开启了延迟。原因是 JVM 内部的代码有很多地方用到了 `synchronized`，由于 JVM 启动阶段会创建很多对象，如果一开始就启用偏向锁，会导致频繁撤销偏向锁 `（revocation）`，增加 `safepoint` （全局停顿）次数，反而拖慢启动速度。

我们可以通过参数 `-XX:BiasedLockingStartupDelay=0` 将延迟改为 `0`，但是不建议这么做。

延迟开启偏向锁的源码如下：

![延迟开启偏向锁源码](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-locking-cpp-biased-locking-init.png)

修改示例代码，延迟 5 s 创建对象：

```java
public static void main(String[] args) throws InterruptedException {
    Thread.sleep(5000);
    Object lock=new Object();
    log.info("未进入同步块，MarkWord 为：");
    log.info(ClassLayout.parseInstance(lock).toPrintable());
    synchronized (lock) {
        log.info("进入同步块，MarkWord 为：");
        log.info(ClassLayout.parseInstance(lock).toPrintable());
    }
    log.info("退出同步块，MarkWord 为：");
    log.info(ClassLayout.parseInstance(lock).toPrintable());

    Thread thread = new Thread(() -> {
        log.info("子线程未进入同步块，MarkWord 为：");
        log.info(ClassLayout.parseInstance(lock).toPrintable());
        synchronized (lock) {
            log.info("子线程进入同步块，MarkWord 为：");
            log.info(ClassLayout.parseInstance(lock).toPrintable());
        }
        log.info("子线程退出同步块，MarkWord 为：");
        log.info(ClassLayout.parseInstance(lock).toPrintable());
    });
    thread.start();
}
```

运行结果如下：

```bash
22:09:53.300 [main] INFO com.shawn.test.Test - 主线程未进入同步块，MarkWord 为：
22:09:56.159 [main] INFO com.shawn.test.Test - java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000005 (biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

22:09:56.160 [main] INFO com.shawn.test.Test - 主线程进入同步块，MarkWord 为：
22:09:56.160 [main] INFO com.shawn.test.Test - java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x000002339885f005 (biased: 0x000000008ce6217c; epoch: 0; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

22:09:56.160 [main] INFO com.shawn.test.Test - 主线程退出同步块，MarkWord 为：
22:09:56.161 [main] INFO com.shawn.test.Test - java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x000002339885f005 (biased: 0x000000008ce6217c; epoch: 0; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

22:09:56.162 [Thread-2] INFO com.shawn.test.Test - 子线程未进入同步块，MarkWord 为：
22:09:56.162 [Thread-2] INFO com.shawn.test.Test - java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x000002339885f005 (biased: 0x000000008ce6217c; epoch: 0; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

22:09:56.163 [Thread-2] INFO com.shawn.test.Test - 子线程进入同步块，MarkWord 为：
22:09:56.163 [Thread-2] INFO com.shawn.test.Test - java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x000000ec111ff600 (thin lock: 0x000000ec111ff600)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

22:09:56.163 [Thread-2] INFO com.shawn.test.Test - 子线程退出同步块，MarkWord 为：
22:09:56.163 [Thread-2] INFO com.shawn.test.Test - java.lang.Object object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0xf80001e5
 12   4        (object alignment gap)    
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

这样的运行结果是符合上面说的逻辑的：

1. 主线程进入同步代码块之前，`lock` 对象锁已是可偏向状态 （`biasable`），但 `Mark Word` 中没有存储具体的线程 ID
2. 主线程进入同步代码块之后，`lock` 对象锁变为已偏向状态 （`biased`），偏向当前主线程，`Mark Word` 中存储当前主线程的 ID
> 上面这两种状态 `lock` 对象锁的 `Mark Word` 的后三位都是 `101`
3. 在主线程退出同步代码块后，到子线程（其他新线程）进入同步代码块前，`lock` 对象锁一直都是偏向主线程的状态
4. 在子线程进入同步代码块、获取 `lock` 对象锁时，由于 `Mark Word` 中存储的不是当前子线程的线程 ID 并且偏向锁标识为 `1`，

偏向锁的撤销：

偏向锁使用了一种等到竞争出现才释放锁的机制，所以当其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁。偏向锁的撤销，需要等待全局安全点（在这个时间点上没有正在执行的字节码）。

- 首先会暂停拥有偏向锁的线程，然后检查持有偏向锁的线程是否活着；

- 如果线程不处于活动状态，则将对象头设置成无锁状态；

- 如果线程仍然活着，拥有偏向锁的栈会被执行，遍历偏向对象的锁记录，栈中的锁记录和对象头的 `Mark Word` 要么重新偏向于其他线程，要么恢复到无锁或者标记对象不适合作为偏向锁，最后唤醒暂停的线程。


