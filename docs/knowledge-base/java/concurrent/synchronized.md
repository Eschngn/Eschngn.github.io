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

注意：JDK 1.6 之后默认是开启偏向锁的，但是开启了延迟。原因是 JVM 内部的代码有很多地方用到了 `synchronized`，由于 JVM 启动阶段会创建很多对象，如果一开始就启用偏向锁，会导致频繁撤销偏向锁 `（revocation）`，增加 `safepoint` （全局停顿）次数，反而拖慢启动速度。

我们可以通过参数 `-XX:BiasedLockingStartupDelay=0` 将延迟改为 `0`，但是不建议这么做。

延迟开启偏向锁的源码如下：

![延迟开启偏向锁源码](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-locking-cpp-biased-locking-init.png)

示例代码如下，延迟 5 s 创建对象，保证偏向锁开启：

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

分析结果：

- 抢占锁前：锁对象头中的 `Mark Word` 的最后一个字节是 `05`，对应着 `biased+lock` 状态组合，倒数三个 `bit` 是 `101`，也就是偏向锁状态。但是打印出来的结果显示的是 `biasable`，表示锁对象还未锁定、未偏向，也就是“可偏向”的状态；

- 占有锁之后：锁对象头中的 `Mark Word` 的最后一个字节还是 `05`，但是输出已经是 `biased`，也就是偏向锁状态了，锁对象头中的 `MarkWord` 已经记录了占有锁的线程 `id`；

- 释放锁之后：锁对象头中的 `Mark Word` 的最后一个字节还是 `05`，还是偏向锁状态，这是因为锁释放需要一定的开销，而偏向锁是一种乐观锁，它认为还是有很大可能偏向锁的持有线程会继续获取锁，所以不会主动撤销偏向锁状态。

思考一个问题：同一个线程重复获取相同的锁，`lock` 对象锁会变成偏向锁，那么如果当前线程结束后，新建一个线程并重新获取 `lock` 锁，`lock` 锁中记录的线程 `id` 是否会被更新成新线程的线程 `id` 实现重偏向呢？

我们直接来看例子：

```java
@Slf4j
public class BiasedLockDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(5000);
        Lock lock = new Lock();
        Thread threadA = runThread(lock, "A");
        Thread threadB = runThread(lock, "B");
        threadA.start();
        threadA.join();
        threadB.start();
        threadB.join();
    }

    private static Thread runThread(Lock lock, String threadName) throws InterruptedException {
        Thread thread = new Thread(() -> {
            log.info("抢占锁前 lock 的状态：\n{}", lock.getObjectStruct());
            synchronized (lock) {
                log.info("占有锁 lock 的状态：\n{}", lock.getObjectStruct());
            }
            log.info("释放锁后 lock 的状态：\n{}", lock.getObjectStruct());
        }, threadName);
        return thread;
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

线程 `A` 执行结果：

![线程 A 中对象锁的 Mark Word 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/thread-a-lock-markword.png)

线程 `B` 执行结果：

![线程 B 中对象锁的 Mark Word 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/thread-b-lock-markword.png)

可以看到，线程 `B` 等到线程 `A` 结束之后获取到了 `lock` 锁，但是锁的状态并没有预想中的仍然保持偏向锁状态，线程 `id` 变为指向线程 `B`，而是直接锁升级成了轻量级锁。

从运行结果上来看，偏向锁更像是“一锤子买卖”，只要偏向了某个线程，后续其他线程尝试获取锁，都会变为轻量级锁，这样的偏向非常局限。事实上并不是这样，接下来我们来看“批量重偏向”。

#### 批量重偏向

批量重偏向（Bulk Rebias）是 JVM 针对类级别（`Class`）的一种偏向锁优化机制。当某个类的很多对象都被不同线程当作锁来使用时，每个对象在第一次被线程获取锁后，都会进入偏向锁状态，并在释放后仍保持偏向状态，这样做有两个目的：

- 一是为了防止短时间内同一个线程再次获取锁时产生额外开销；

- 二是因为撤销偏向锁虽然开销小，但如果要撤销的对象很多，累积起来系统负担也会变大。

现在假设这些已经释放、但仍保持偏向锁状态的对象，又频繁被另一个线程 `B` 来访问。

JVM 这时就面临一个问题：

> 我是否应该立刻把这些对象的 `Mark Word` 改成偏向线程 B 呢？

显然，直接让这些对象重偏向线程 `B` 并不合理 —— 因为 JVM 还不能确定想成 `B` 是否会频繁访问这些对象。

于是 JVM 会先观察一段时间：

假设阈值设为 `20`，那么：

- 当线程 `B` 第 `1～19` 次访问这些对象时，JVM 不会立即重偏向，而是暂时撤销偏向、让锁以轻量级方式运行；

- 当线程 `B` 第 `20` 次再访问时，JVM 认为线程 `B` 很可能会持续访问这个类的对象，于是就触发批量重偏向（`Bulk Rebias`） —— 将该类的所有对象都允许重新偏向新线程。

这样做既能避免频繁撤销偏向锁带来的性能损耗，又能让系统根据运行情况动态调整锁的偏向策略，实现性能与灵活性的平衡。

在命令行中运行命令：`java -XX:+PrintFlagsFinal | grep BiasedLock` 查看偏向锁相关的配置参数:

```bash
ShawndeMacBook-Pro:~ Shawn$ java -XX:+PrintFlagsFinal | grep BiasedLock
     intx BiasedLockingBulkRebiasThreshold          = 20                                  {product}
     intx BiasedLockingBulkRevokeThreshold          = 40                                  {product}
     intx BiasedLockingDecayTime                    = 25000                               {product}
     intx BiasedLockingStartupDelay                 = 4000                                {product}
     bool TraceBiasedLocking                        = false                               {product}
     bool UseBiasedLocking                          = true                                {product}
```

其中，`UseBiasedLocking` 以及 `BiasedLockingStartupDelay` 参数之前在延迟开启偏向锁的源码中有看到过，是用来控制系统启动时是否启用偏向锁并且设置偏向锁启动延迟时间的，现在则重点关注 `BiasedLockingBulkRebiasThreshold` 参数：


| 参数                                | 释义                   |
| ----------------------------------- | ---------------------- |
| BiasedLockingBulkRebiasThreshold=20 | 批量偏向阈值，默认值20 |

如果 JVM 发现同一个类的 `20` 个不同对象的偏向锁都被撤销或重新偏向到了另一个线程，它会触发批量重偏向，让整个类的所有偏向锁都处于重偏向的状态，即这时偏向锁一旦被其他线程获取就立即偏向该线程。

下面通过代码来验证：

```java
@Slf4j
public class BiasedLockBulkRebiasDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(5000);
        final List<Lock> list = new ArrayList<>();
        Thread threadA = new Thread(() -> {
            for (int i = 0; i < 21; i++) {
                // 生成 21 个锁对象
                Lock lock = new Lock();
                list.add(lock);
                // 获取锁之后都变成了偏向锁，偏向线程 A
                synchronized (lock) {

                }
            }
        });

        Thread threadB = new Thread(() -> {
            for (int i = 0; i < 20; i++) {
                Lock lock = list.get(i);
                // 从 list 当中拿出前 20 个锁对象，都是偏向线程 A
                log.info("B 加锁前第 {} 次{}", i + 1, ClassLayout.parseInstance(lock).toPrintable());
                synchronized (lock) {
                    // 前 19 次撤销偏向锁偏向线程 A，然后升级轻量级锁指向线程 B 线程栈当中的锁记录
                    // 第 20 次开始重偏向线程 B
                    log.info("B 加锁中第 {} 次{}", i + 1, ClassLayout.parseInstance(lock).toPrintable());
                }
                // 因为前 19 次是轻量级锁，释放之后为无锁不可偏向
                // 但是第 20 次是偏向锁 偏向线程 B 释放之后依然是偏向线程 B
                log.info("B 加锁结束第 {} 次{}", i + 1, ClassLayout.parseInstance(lock).toPrintable());
            }
        });

        threadA.start();
        Thread.sleep(1000);
        threadB.start();
        Thread.sleep(10000);

        new Thread(() -> {
            // 从 list 中拿到第 21 个锁对象
            Lock lock = list.get(20);
            log.info("C 加锁前{}", Class
                log.info("C 加锁中{}", ClassLayout.parseInstance(lock).toPrintable());
            }
            log.info("C 加锁后{}", ClassLayout.parseInstance(lock).toPrintable());
        }).start();

        log.info("新产生的对象：{}", ClassLayout.parseInstance(new Lock()).toPrintable());
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

线程 `B` 前 `19` 次循环运行的结果：

![前 19 把对象锁的 Mark Word 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-lock-bulk-rebias-b-markword.png)

线程 `B` 第 `20` 次运行结果：

![第 20 把对象锁的 Mark Word 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-lock-bulk-rebias-b-20-markword.png)

线程  `C` 的运行结果：

![第 21 把对象锁的 Mark Word 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-lock-bulk-rebias-c-markword.png)

通过结果我们可以发现，在达到批量重偏向阈值后，其他线程再去获取偏向锁，则锁对象会重偏向自己。

生成新的 `Lock` 对象的运行结果：

![新生成的对象锁的 Mark Word 布局](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/biased-lock-bulk-rebias-new-lock-markword.png)

在新生成的的 `Lock` 锁对象中，包括第 20 个和第 21 个锁对象中，在发生批量重偏向后，`epoch` 字段都变成了 1

#### epoch













