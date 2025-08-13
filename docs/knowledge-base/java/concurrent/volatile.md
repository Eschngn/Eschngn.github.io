---
title: volatile
category:
  - Java
tag:
  - Java 并发编程
---

在 Java 中，`volatile` 关键字是一个非常重要的非访问控制修饰符，它用于修饰类的成员变量。在多线程环境中，`volatile` 可以保证变量的可见性，如果我们将变量声明为 **`volatile`** ，这就指示 JVM，这个变量是共享且不稳定的，每次使用它都到主存中进行读取。

在 JDK 5 之后 `volatile` 关键字还具备一定的有序性（Ordering）。

在了解 `volatile` 实现原理之前，我们先来看下与其实现原理相关的 CPU 术语与说明，下图摘自 《Java 并发编程的艺术》：

![相关 CPU 术语与说明](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/cpu-terminology-and-description.png)

## 可见性

在多核处理器架构下，每个线程在执行时为了提高效率，通常会从主内存 `（Main Memory）`中读取共享变量的副本到自己的**工作内存 `（Working Memory)`** 或 CPU 缓存中。线程对变量的所有操作，都是在工作内存中进行的，操作完成后再择机写入主内存。

内存模型的简单结构如下图所示：

![线程工作内存和主内存](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/thread-memory.png)

这就带来了一个问题：如果一个线程修改了变量的值，但这个修改还没有被写回主内存，其他线程从自己的工作内存中读取的变量值依然是旧的，这就是可见性问题。

`volatile` 关键字就是用来解决这个问题的。当一个变量被 `volatile` 修饰后：

- 对 `volatile` 变量的写入操作：会强制将修改后的值立即写回主内存。

- 对 `volatile` 变量的读取操作：会强制从主内存中读取最新的值，而不是从线程的本地缓存中读取。

### 原理

在 Java 中，对被 `volatile` 修饰的共享变量进行写操作时，JVM 会生成带 `lock` 前缀的 CPU 指令，`lock` 指令会触发缓存一致性协议（比如 MESI 协议），将当前处理器缓存行的数据回写到系统内存并使其他 CPU 中缓存的该变量副本失效。

缓存一致性协议工作原理：处理器通过总线嗅探 `（bus snooping）` 监听其他处理器对内存的读写，当检测到其他处理器修改了自己缓存行对应的内存地址时，会将该缓存行标记为无效`（Invalid）`，下次访问时会强制从内存重新读取最新数据。

早期的 Intel486 和 Pentium 会直接在总线上发出 `LOCK#` 信号，锁住总线，开销大，新的处理器（ P6 及以后）通常是锁缓存行（缓存锁定）并写回内存，然后利用缓存一致性协议来保证修改的原子性和可见性。

感受 `volatile` 可见性的示例代码如下：

```java
public class VolatileVisibilityDemo {
    private static volatile boolean ready = false;
    private static int number = 0;

    static class ReaderThread extends Thread {
        @Override
        public void run() {
            // 当 ready 变为 true 时，跳出循环
            while (!ready) {
                // 如果 ready 没有被 volatile 修饰，这里的循环可能永远不会停止
                // 因为 ReaderThread 无法感知到主线程对其的修改
            }
            System.out.println("ReaderThread 结束循环，number = " + number);
        }
    }

    public static void main(String[] args) throws InterruptedException {
        new ReaderThread().start();
        Thread.sleep(1000); // 确保 ReaderThread 先运行

        number = 42;
        ready = true; // 写入 volatile 变量，强制刷新到主内存

        System.out.println("主线程已修改了 number 和 ready 的值");
    }
}
```

输出如下：

```tex
主线程已修改了 number 和 ready 的值
ReaderThread 结束循环，number = 42
```

如果 `ready` 变量没有使用 `volatile` 修饰，主线程即使修改了 `ready` 的值，`ReaderThread` 也无法感知到，会因为其 CPU 缓存中的 `ready` 一直是 `false` 而陷入死循环，永远无法结束。

`ready` 变量使用 `volatile` 修饰后，主线程线程对 `ready` 的修改会立即被同步到主内存，`ReaderThread` 会感知到这个变化，从而结束循环。

## 有序性

为了提高性能，编译器和处理器可能会对指令进行重排序 `（Reordering）`。在单线程环境下，这种重排序不会影响最终结果，但在多线程环境下可能会导致意想不到的错误。

`volatile` 除了保证可见性，还通过在底层插入内存屏障 `（Memory Barrier）` 来保证有序性，它会禁止特定类型的指令重排序：

- 当写入一个 `volatile` 变量时，所有在它之前的普通写操作，都必须先完成，并且将结果刷新到主内存中。

- 当读取一个 `volatile` 变量时，所有在它之后的普通读写操作，都必须等到读取 `volatile` 变量的操作完成后才能执行。

这个特性保证了在 `volatile` 变量之前执行的操作，对其他线程是可见的。

比如在上面的例子中，`number = 42;` 的赋值操作，会先于 `ready = true;` 的写入操作完成，并对 `ReaderThread` 可见。

## 与 `synchronized` 的区别

`volatile` 和 `synchronized` 都是用于解决多线程问题的，但它们有本质上的区别：

| 特性         | `volatile`                                                   | `synchronized`                                               |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **作用**     | 主要解决**可见性**和**有序性**问题。                         | 解决**可见性、有序性**，同时还具备**原子性**。               |
| **原子性**   | **不保证**原子性。对 `volatile` 变量的自增（`i++`）操作不是原子的，它包含读、改、写三个步骤。 | **保证**原子性。确保同一时间只有一个线程可以执行同步代码块。 |
| **锁机制**   | **不提供**任何锁机制，不会阻塞线程。                         | **提供**锁机制，会阻塞其他线程，开销较大。                   |
| **适用范围** | 只能修饰**成员变量**。                                       | 可以修饰**方法**和**代码块**。                               |
| **使用场景** | 适用于那些**一个线程写入、多个线程读取**的**状态标记**或**标志量**。 | 适用于需要保证**原子操作**、**数据完整性**的复杂业务逻辑。   |

## `volatile` 的正确使用场景

`volatile` 关键字非常轻量，它不能替代 `synchronized` 来保证线程安全。它适用于以下两种情况：

1. 作为状态标志量： 某个线程需要不断检查一个标志位，而另一个线程会改变这个标志位来通知它。

2. 单次写入、多次读取的计数器或状态值： 确保一个线程对某个值的修改能立即被其他线程看到，但这个修改本身不需要是原子性的（例如，`volatile int status`）。

不能使用 `volatile` 的场景：

`volatile` 不适用于需要原子性的复合操作，例如 `i++`。因为 `i++` 操作分为读取、修改、写入三个步骤，而 `volatile` 只能保证读和写的可见性，无法保证整个复合操作是原子的。如果多个线程同时执行 `i++`，仍然会发生竞态条件。在这种情况下，我们需要使用 `synchronized`、`AtomicInteger` 等原子类来确保线程安全。

⚠️注意：上面 `volatile` 缓存一致性的原子性是 CPU 层面的，在缓存行锁住期间，别的 CPU 对该地址的读写会被阻塞或失效，这样能保证这个变量的读 - 改 - 写是不可被打断的，这种原子性是硬件层面保证单条或少数几条机器指令不可分割。

而 `synchronized` 的原子性是 JVM 层面的，属于更高层次的并发控制。

举个例子🌰：

假设我们有个共享变量 `count`，多个线程要做 `count++`：

- **`volatile` 修饰的 `count`**
  - 每次写都会让 CPU 把缓存行回写内存，并让其他 CPU 缓存失效。
  - 但是 `count++` 本质是三个步骤：
    1. 读 `count`
    2. 加 1
    3. 写回 `count`
  - 如果两个线程同时执行，可能都先读到同一个旧值，然后覆盖彼此的结果（数据竞争）。
  - 因此 `volatile` 保证可见性，但不能保证这个复合操作的原子性。
- **`synchronized` 包裹 `count++`**
  - 一个线程进锁执行完 `count++` 整个过程后才释放锁。
  - 另一个线程必须等到锁释放后才能执行，所以结果不会丢失。
  - 因此 `synchronized` 保证了整个临界区的原子性。