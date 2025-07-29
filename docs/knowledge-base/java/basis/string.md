---
title: String
star: 10
sticky: 1
category:
  - Java
tag:
  - Java基础
---

# String

## 不可变性

Java 中的 `String` 代表了不可变的字符序列，下面是 `String` 类声明的源码(Java 8 版本)：

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];

    /** Cache the hash code for the string */
    private int hash; // Default to 0
    ...
    ...
    ...
}
```

1、`String` 类是 `final` 的，这意味着它不能被子类继承

2、`String` 类使用 `private` 和 `final` 关键字修饰的字符数组来保存字符串，并且 `String` 类没有提供任何可以修改 `value` 数组内容的公共方法，这意味着 `String` 对象一旦被创建，`value` 引用本身以及它的值不能被改变，`value` 变量的引用永远指向同一个字符串数组，并且外部代码无法直接访问或修改 `value` 数组，所有看似“修改”字符串的方法（如 `substring()`, `replace()`, `concat()` 等），实际上都是创建并返回一个新的 String 对象，而原始对象的内容保持不变。以上这种手段确保了 `String` 对象的完全不可变性。

```java
String s = "Hello";
System.out.println("s的地址:" + System.identityHashCode(s));

s = s + " World";

System.out.println("s的地址:" + System.identityHashCode(s)); // s 的地址会发生变化
System.out.println(s);
```

输出结果如下：

```tex
s的地址:356573597
s的地址:1735600054
Hello World
```
## JDK 9 的改进

在 JDK 9 及后面的版本中，Java 的 `String` 类的内部实现确实从 `char[] value` 变成了 `byte[] value`，并且新增了一个 `byte coder` 字段。这项重要的改进被称为 `"Compact Strings"` (紧凑字符串)，其主要目的是为了节省内存空间。

下面是 JDK 11 版本中 `String` 类的源码，注意和 JDK 8 版本的不同：

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    @Stable
    private final byte[] value;
    private final byte coder;
    private int hash;
}
```

在 JDK 9 之前，Java 的 `char` 类型是 16 位的，这意味着每个字符占用 `2` 个字节（因为它基于 `UTF-16` 编码）。然而，在实际应用中，大部分字符串（尤其是在西方语言环境中）只包含 `ISO-8859-1 (Latin-1)` 字符，这些字符只需要 `8` 位（`1` 个字节）就能表示。JDK 官方也说了绝大部分字符串对象只包含 `Latin-1` 可表示的字符。

![JDK 的官方说明](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/jdk9-string-latin1.png)


这意味着，对于只包含 `Latin-1` 字符的字符串，旧的 `char[]` 实现会浪费一半的内存空间，因为它为每个字符都分配了 `2` 个字节，即使只需要 `1` 个字节。考虑到 `String` 对象在 Java 应用程序中是使用最频繁的对象之一，这种内存浪费是非常巨大的。

为了解决这个问题，JDK 9 引入了 `Compact Strings` 特性：

1. `String` 类的内部字符数组类型从 `char[]` 变为了 `byte[]`。

2. 新增了一个 `byte coder` 字段来记录字符串的编码方式。这个字段有两个可能的值：
    - `String.LATIN1` (值为 `0`)：表示字符串中的所有字符都可以用 `ISO-8859-1 (Latin-1)` 编码表示，每个字符占用 `1` 个字节。

    - `String.UTF16` (值为 `1`)：表示字符串中包含需要 `UTF-16` 编码的字符（比如中文字符、表情符号等），每个字符占用 `2` 个字节。

3. 当创建一个新的 `String` 对象时，`JVM` 会检查字符串中的所有字符：
    - 如果所有字符都在 `Latin-1` 范围内（即它们的 `Unicode` 码点小于等于 `255`），那么字符串就会以 `Latin-1` 编码存储在 `byte[]` 数组中，每个字符占用 `1` 字节。此时 `coder` 字段设置为 `LATIN1`。

    - 如果字符串中包含任何 `Latin-1` 范围之外的字符，那么字符串就会以 `UTF-16` 编码存储在 `byte[]` 数组中，每个字符占用 `2` 字节（即 `char` 数组的等价形式）。此时 `coder` 字段设置为 `UTF16`。

这样改进的主要目的就是为了节省字符串占用的内存空间。内存占用减少带来的另外一个好处，就是 `JVM GC` 的次数也会减少，另外，这个改动是 `JVM` 内部的实现细节，对于 Java 应用程序的开发者而言是透明的。我们仍然像以前一样使用 `String` 类，无需修改代码。

## 字符串常量池

Java 虚拟机（`JVM`）为了优化性能，维护了一个特殊的内存区域，称为字符串常量池。

当我们使用字符串字面量创建 `String` 对象时，`JVM` 会首先在字符串常量池中查找是否已经存在内容相同的字符串。

如果存在，则直接返回该字符串在常量池中的引用，而不会创建新的对象。

如果不存在，则在常量池中创建这个新的字符串对象，并返回其引用。

当我们使用 `new String("hello")` 创建对象时，总会在堆内存中创建一个新的 `String` 对象。如果字面量 `"hello"` 不在常量池中，`JVM` 还会把它放入常量池。

```java
String str1 = "hello"; // 在常量池中创建 "hello" (如果不存在)，str1 指向它
String str2 = "hello"; // str2 直接指向常量池中已有的 "hello"

System.out.println(str1 == str2); // true (引用相同，因为指向同一个常量池对象)

String str3 = new String("world"); // 在堆中创建 "world" 对象，str3 指向它
                                   // 如果常量池中没有"world"，也会在常量池中创建
String str4 = new String("world"); // 在堆中创建另一个新的 "world" 对象，str4 指向它

System.out.println(str3 == str4); // false (引用不同，是两个不同的堆对象)
System.out.println(str3.equals(str4)); // true (内容相同)

String str5 = "world"; // str5 指向常量池中的 "world"

System.out.println(str3 == str5); // false (一个在堆，一个在常量池)
System.out.println(str3.equals(str5)); // true (内容相同)
```

![字符串常量池](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%B8%B8%E9%87%8F%E6%B1%A0.png)

**字符串常量池**是 `JVM` 为了提升性能和减少内存消耗针对字符串（`String` 类）专门开辟的一块区域，主要目的是为了避免字符串的重复创建。

## `itern()` 方法 
`String` 类的 `itern()` 方法可以强制将堆中的 `String` 对象添加到字符串常量池中。如果常量池中已经存在内容相同的字符串，则返回常量池中该字符串的引用。

```java
String s1 = new String("abc"); // 在堆中创建对象
String s2 = "abc";             // 在常量池中创建或获取对象

System.out.println(s1 == s2); // false

String s3 = s1.intern(); // s3 会指向常量池中的"abc"
String s4 = s2.intern();

System.out.println(s3 == s2); // true
System.out.println(s3 == s1); // false (s1 依然是堆中的那个对象)
```
## `StringBuffer` / `StringBuilder`

由于 String 的不可变性，频繁地对字符串进行修改（如拼接操作）会创建大量的中间 String 对象，这会消耗额外的内存和 CPU 资源，影响性能。因此，Java 提供了两个可变的字符序列类 `StringBuffer` 和 `StringBuilder` 来解决这个问题。

| 字符序列类      | 线程安全性                                                   | 性能                                                         |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `StringBuffer`  | 线程安全，它的所有公共方法都已同步（`synchronized`），因此在多线程环境下是安全的。 | 相对于 `String` 的频繁拼接，`StringBuffer` 效率更高，但因为同步开销，比 `StringBuilder` 略慢。 |
| `StringBuilder` | 非线程安全，它的方法没有同步，因此在多线程环境下不安全。     | 在单线程环境下，`StringBuilder` 的性能优于 `StringBuffer` 和 `String` 的拼接。 |

## 常用方法

`String` 类提供了大量用于操作字符串的方法：

| 方法                                                         | 作用                                  |
| ------------------------------------------------------------ | ------------------------------------- |
| `length()`                                                   | 返回字符串长度                        |
| `isEmpty()`                                                  | 判断字符串是否为空                    |
| `charAt(int index)`                                          | 返回指定索引处的字符                  |
| `substring(int beginIndex)` / `substring(int beginIndex, int endIndex)` | 截取子字符串                          |
| `indexOf(String str)` / `lastIndexOf(String str)`            | 查找子字符串第一次/最后一次出现的位置 |
| `contains(CharSequence s)`                                   | 判断是否包含子字符串                  |
| `startsWith(String prefix)` / `endsWith(String suffix)`      | 判断是否以指定前缀/后缀开头或结尾     |
| `replace(char oldChar, char newChar)` / `replace(CharSequence target, CharSequence replacement)` | 替换字符或子字符串                    |
| `trim()`                                                     | 去除字符串两端的空白字符              |
| `toUpperCase()` / `toLowerCase()`                            | 转换为大写/小写                       |
| `split(String regex)`                                        | 根据正则表达式拆分字符串              |
| `equals(Object anObject)`                                    | 比较字符串内容是否相等                |
| `equalsIgnoreCase(String anotherString)`                     | 忽略大小写比较内容                    |
| `compareTo(String anotherString)`                            | 按字典顺序比较字符串                  |
| `getBytes()` / `toCharArray()`                               | 转换为字节数组/字符数组               |
| `valueOf()`                                                  | 将其他数据类型转换为 `String`         |

## 编译优化

对于编译期可以确定值的字符串，也就是常量字符串 ，JVM 会将其存入字符串常量池。并且，字符串常量拼接得到的字符串常量在编译阶段就已经被存放字符串常量池

在编译过程中，Javac 编译器会进行一个叫做常量折叠(Constant Folding)的代码优化。《深入理解 Java 虚拟机》中有介绍到：

![常量折叠](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241014130535051.png)

常量折叠会把常量表达式的值求出来作为常量嵌在最终生成的代码中，这是 Javac 编译器会对源代码做的极少量优化措施之一(代码优化几乎都在即时编译器中进行)。

并不是所有的常量都会进行折叠，只有编译器在程序编译期就可以确定值的常量才可以：

- 基本数据类型( `byte`、`boolean`、`short`、`char`、`int`、`float`、`long`、`double`)以及字符串常量
- `final` 修饰的基本数据类型和字符串变量
- 字符串通过 `“+”` 拼接得到的字符串、基本数据类型之间算数运算（加减乘除）、基本数据类型的位运算（<<、>>、>>> ）

```java
final String s1 = "Hello";
final String s2 = " World";

String str1 = "Hello World";

String str2 = "Hello" + " World"; // 编译器会优化成 String str2 = "Hello World";
System.out.println(str1 == str2); // true，指向常量池中同一个字符串常量

String str3 = s1 + s2; // 字符串使用 final 关键字声明之后，可以让编译器当做常量来处理，其效果就相当于访问常量
System.out.println(str1 == str3); // true
```

如果编译器在运行时才能知道其确切值的话，就无法对其优化，比如以下实例代码，`str2` 在运行时才能确定其值：

```java
final String str1 = "str";
final String str2 = getStr();
String c = "str" + "ing"; // 常量池中的对象
String d = str1 + str2; // 在堆上创建的新的对象
System.out.println(c == d); // false

public static String getStr() {
      return "ing";
}
```

**无 `final` 修饰的引用的值在程序编译期是无法确定的，编译器也无法对其进行优化。**

对象引用和 `“+”` 的字符串拼接方式，实际上是通过 `StringBuilder` 调用 `append()` 方法实现的，拼接完成之后调用 `toString()` 得到一个 `String` 对象 。

```java
String s1 = "Hello";
String s2 = " World";
String s3 = "Hello World";

String str = s1 + s2; // str 是堆上的一个字符串对象
System.out.println(s3 == str); // false
```

上面的代码对应的字节码如下：

![字节码](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/image-20250714162214566.png)



