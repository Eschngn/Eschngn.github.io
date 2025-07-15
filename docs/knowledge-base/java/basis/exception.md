---
title: 异常
star: 10
sticky: 10
category:
  - Java
tag:
  - Java基础
---

## 分类

Java 的异常体系是一个完善的类层次结构，其基类是 `java.lang.Throwable`。`Throwable` 又派生出两个主要子类：`Error` 和 `Exception`。

### `Error`

`Error` 代表了程序中严重的问题，通常是由 JVM 自身、操作系统或硬件问题引起的，比如内存溢出（`OutOfMemoryError`）、栈溢出（`StackOverflowError`）等。

通常，应用程序不应该尝试捕获或处理 `Error`，因为它们表示 JVM 处于一种不可恢复的状态。

### `Exception`

程序本身可以合法处理的异常，这些异常通常是由程序逻辑、外部资源（文件、网络）或用户输入等问题引起的，可以通过 `catch` 来进行捕获。`Exception` 又可以分为 `Checked Exception` (受检查异常，必须处理) 和 `Unchecked Exception` (不受检查异常，可以不处理)。

- 受检异常 (`Checked Exception`)：继承自 `Exception` 类，但不继承 `RuntimeException`。编译器会强制开发者预见并处理这些可能发生的外部问题，提高代码的健壮性。
如果我们在方法中调用了可能抛出受检异常的方法，那么必须使用 `try-catch` 块来捕获它，或者在方法签名中使用 `throws` 关键字声明它。否则，程序将无法通过编译。
常见的有：
    - `IOException` (文件找不到、网络中断等)
    - `SQLException` (数据库操作错误)
    - `ClassNotFoundException`

- 非受检异常 (`Unchecked Exception`) / 运行时异常 (`Runtime Exception`):继承自 RuntimeException，而 RuntimeException 继承自 Exception）。
编译器不会强制我们处理这类异常。即使我们不捕获或声明它们，程序也能编译通过。但如果在运行时发生这类异常而没有被捕获，程序会终止。
常见的有：
    - `NullPointerException` (空指针引用)
    - `ArrayIndexOutOfBoundsException` (数组越界)
    - `ClassCastException` (类型转换错误)
    - `ArithmeticException` (算术错误，如除以零)

## 处理机制

Java 提供了以下关键字来处理异常：

- `try`：用于监听。将要被监听的代码(可能抛出异常的代码)放在 `try` 语句块之内，当 `try` 语句块内发生异常时，异常就被抛出。

- `catch`：用于捕获异常。`catch` 用来捕获 `try` 语句块中发生的异常。

- `finally`：`finally` 语句块总是会被执行。它主要用于回收在try块里打开的物力资源(如数据库连接、网络连接和磁盘文件)。只有 `finally` 块，执行完成之后，才会回来执行 `try` 或者 `catch` 块中的 `return` 或者 `throw` 语句，如果 `finally` 中使用了 `return` 或者 `throw` 等终止方法的语句，则就不会跳回执行，直接停止。

- `throw`：用于抛出异常。

- `throws`：用在方法签名中，用于声明该方法可能抛出的异常。

### `throws`

在 Java 中，`throws` 关键字用于声明一个方法可能抛出的异常类型。这是一种让调用者知道该方法在执行过程中可能会遇到的异常，从而使得调用者可以采取相应的处理措施。

```java
public static void method() throws IOException, FileNotFoundException{
    //something statements
}
```

⚠️注意：
- 若是父类的方法没有声明异常，则子类继承后，也不能声明异常。
- 如果是非受检异常（`unchecked exception`），即 `Error、RuntimeException` 或它们的子类，那么可以不使用 `throws` 关键字来声明要抛出的异常，编译仍能顺利通过，但在运行时会被系统抛出。
- 如果是受检查异常（`checked exception`），要么用 `try-catch` 语句捕获，要么用 `throws` 子句将它抛出，否则会导致编译时错误。
- 某个方法抛出了异常，那么该方法的调用者必须处理或者重新抛出该异常。

### `throw`

在 Java 中，`throw` 关键字用于显式地抛出一个异常。这意味着程序员可以在代码的特定位置主动触发异常，以指示出现了某种错误或不正常的状态。 

```java
public static double method(int value) {
    if(value == 0) {
        throw new ArithmeticException("参数不能为0"); //抛出一个运行时异常
    }
    return 11.0 / value;
}
```

⚠️注意：

- 必须是 `Throwable` 的子类：`throw` 后面跟的是一个 `Throwable` 对象，这可以是一个异常（如 `IllegalArgumentException、NullPointerException` 等）或错误（如 `OutOfMemoryError`）。
- 使用位置：`throw` 通常在方法体内使用，在代码的逻辑流中，当满足特定条件时，可以抛出异常。
- 控制流影响：抛出异常会立即终止当前方法的执行，控制流会转到调用该方法的地方，直到找到合适的 `catch` 块处理异常。

### `try-catch`

在一个 `try - catch` 语句块中可以捕获多个异常类型，并对不同类型的异常做出不同的处理：

```java
public static void method() {
    try {
        // 抛出异常
    } catch (NullPointerException e) {
        System.out.println("捕获到 NullPointerException: " + e.getMessage());
    } catch (ArithmeticException e) {
        System.out.println("捕获到 ArithmeticException: " + e.getMessage());
    }
}
```

同一个 `catch` 也可以捕获多种类型异常，用 `|` 隔开：

```java
public static void method() {
    try {
        // 抛出异常
    } catch (NullPointerException | ArithmeticException e) {
        System.out.println("捕获到异常: " + e.getMessage());
    }
}
```

### `try - catch - finally`

- `try` 块：用于捕获异常。其后可接零个或多个 `catch` 块，如果没有 `catch` 块，则必须跟一个 `finally` 块。

- `catch` 块：用于处理 `try` 捕获到的异常。

- `finally` 块：无论是否捕获或处理异常，`finally` 块里的语句都会被执行。当在 `try` 块或 `catch` 块中遇到 `return` 语句时，`finally` 语句块将在方法返回之前被执行。

常规语法：

```java
try {                        
    //执行程序代码，可能会出现异常                 
} catch(Exception e) {   
    //捕获异常并处理   
} finally {
    //必执行的代码
}
```
执行顺序：

- 当 `try` 没有捕获到异常时：`try` 语句块中的语句逐一被执行，程序将跳过 `catch` 语句块，执行 `finally` 语句块和其后的语句；
- 当 `try` 捕获到异常，`catch` 语句块里没有处理此异常的情况：此异常将会抛给 `JVM`，语句块里的语句还是会被执行，但 `finally` 语句块后的语句不会被执行；
- 当 `try` 捕获到异常，`catch` 语句块里有处理此异常的情况：在 `try` 语句块中是按照顺序来执行的，当执行到某一条语句出现异常时，程序将跳到 `catch` 语句块，并与 `catch` 语句块逐一匹配，找到与之对应的处理程序，其他的 `catch` 语句块将不会被执行，而 `try` 语句块中，出现异常之后的语句也不会被执行，`catch` 语句块执行完后，执行 `finally` 语句块里的语句，最后执行 `finally` 语句块后的语句。

⚠️注意：

- 若 `catch` 语句块和 `finall` 语句块里同时存在 `return` 语句时，代码 `try` 语句块中的 `return` 语句会被忽略。这是因为 `try` 语句中的 `return` 返回值会先被暂存在一个本地变量中，当执行到 `finally` 语句中的 `return` 之后，这个本地变量的值就变为了 `finally` 语句中的 `return` 返回值。 
另外， 如果 `try` 块中抛出了一个异常，并且 `finally` 块中又有一个 `return` 语句，那么这个 `return` 语句会阻止异常的传播，导致异常被静默地吞噬掉，外部调用者将无法感知到异常的发生。
所以不要在 `finally` 语句块中使用 `return` ！

- 在某些情况下，`finally` 中的代码不会被执行。在以下 4 种特殊情况下，`finally` 块的代码不会被执行：
    - 程序所在的线程死亡。
    - 关闭 CPU。
    - 在前面的代码中用了 `System.exit()` 退出程序。
    - `finally` 语句块中发生了异常。

### `try - finally`

`try` 块中引起异常，异常代码之后的语句不再执行，直接执行 `finally` 语句。`try` 块没有引发异常，则执行完 `try` 块就执行 `finally` 语句。 

`try-finally` 可用在不需要捕获异常的代码，可以保证资源在使用后被关闭。例如 `IO` 流中执行完相应操作后，关闭相应资源；使用 `Lock` 对象保证线程同步，通过 `finally` 可以保证锁会被释放；数据库连接代码时，关闭连接操作等等。

```java
//以 Lock 加锁为例，演示 try - finally
ReentrantLock lock = new ReentrantLock();
try {
    //需要加锁的代码
} finally {
    lock.unlock(); //保证锁一定被释放
}
```

