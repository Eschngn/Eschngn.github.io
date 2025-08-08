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

## 标题 2

这里是内容。

### 标题 3

这里是内容。
