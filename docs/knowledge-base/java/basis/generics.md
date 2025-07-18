---
title: 泛型
star: 10
sticky: 1
category:
  - Java
tag:
  - Java基础
---

# 泛型

在 Java 中，泛型 (`Generics`) 是 JDK 5 引入的一项强大特性，它允许我们在定义类、接口和方法时，使用类型参数 (`type parameters`)。泛型的核心目的是为了在编译时捕获类型错误，提高代码的类型安全性和可读性，并消除强制类型转换的麻烦。

编译器可以对泛型参数进行检测，并且通过泛型参数可以指定传入的对象类型。

比如 `ArrayList<String> lists = new ArrayList<String>()` 这行代码就指明了该 `ArrayList` 对象只能传入 `String` 对象，如果传入其他类型的对象就会报错。

```java
ArrayList<E> extends AbstractList<E>
```

并且，原生 `List` 返回类型是 `Object` ，需要手动转换类型才能使用，使用泛型后编译器自动转换。

## 泛型参数

泛型使用尖括号 `<>` 来定义类型参数，通常使用单个大写字母表示，如 `E (Element)`, `T (Type)`, `K (Key)`, `V (Value)` 等。

## 泛型类

我们可以定义一个类，使其操作的某些类型在实例化时才确定。

```java
// 泛型类，T 是类型参数
public class Box<T> {
    private T content; // content 的类型由 T 决定

    public Box(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    public static void main(String[] args) {
        // 实例化时指定具体的类型参数
        Box<String> stringBox = new Box<>("Hello Generics");
        String s = stringBox.getContent(); // 无需强制类型转换
        System.out.println(s);

        Box<Integer> integerBox = new Box<>(123);
        Integer i = integerBox.getContent(); // 无需强制类型转换
        System.out.println(i);

        // integerBox.setContent("abc"); // 编译错误！类型不匹配
    }
}
```

输出如下：

```tex
Hello Generics
123
```

## 泛型接口

接口也可以使用泛型，定义了操作类型的规范。

```java
public interface Pair<K, V> {
    K getKey();
    V getValue();
}

public class OrderedPair<K, V> implements Pair<K, V> {
    private K key;
    private V value;

    public OrderedPair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    @Override
    public K getKey() { return key; }

    @Override
    public V getValue() { return value; }

    public static void main(String[] args) {
        Pair<String, Integer> p1 = new OrderedPair<>("MyAge", 30);
        System.out.println(p1.getKey() + ": " + p1.getValue());
    }
}
```

输出如下：

```tex
MyAge: 30
```


## 泛型方法

方法也可以独立于其所在的类而具有泛型能力。

```java
public class GenericMethodDemo {

    // 泛型方法，T 是方法级别的类型参数
    public static <T> void printArray(T[] inputArray) {
        for (T element : inputArray) {
            System.out.printf("%s ", element);
        }
        System.out.println();
    }

    // 另一个泛型方法，返回类型为 T
    public static <T> T getFirstElement(T[] array) {
        if (array != null && array.length > 0) {
            return array[0];
        }
        return null;
    }

    public static void main(String[] args) {
        Integer[] intArray = { 1, 2, 3, 4, 5 };
        Double[] doubleArray = { 1.1, 2.2, 3.3, 4.4 };
        String[] stringArray = { "Hello", "World", "Java" };

        printArray(intArray);
        printArray(doubleArray);
        printArray(stringArray);

        System.out.println("First Integer: " + getFirstElement(intArray));
        System.out.println("First String: " + getFirstElement(stringArray));
    }
}
```

输出如下：

```tex
1 2 3 4 5 
1.1 2.2 3.3 4.4 
Hello World Java 
First Integer: 1
First String: Hello
```

⚠️注意：
- 泛型方法的类型参数 `<T>` 放在返回类型之前。
- `public static <T> void printArray(T[] inputArray)` 一般被称为静态泛型方法;在 Java 中泛型只是一个占位符，必须在传递类型后才能使用。类在实例化时才能真正的传递类型参数，由于静态方法的加载先于类的实例化，也就是说类中的泛型还没有传递真正的类型参数，静态的方法的加载就已经完成了，所以静态泛型方法是没有办法使用类上声明的泛型的。只能使用自己声明的 `<T>`

## 类型通配符

泛型通配符 `?` 用于在方法签名中，表示一种不确定的类型，但可以对其进行限制。

### 上界通配符 `(? extends T)`

上界通配符 `(Upper Bounde Wildcard)`，顾名思义，存在一个最上级的界限，即指定一个最高级别的父类，它表示对于该上界类型以及其子类都适用，类型可以是 `T` 或 `T` 的任何子类。用于限制泛型类型为某个类的子类或其自身。主要用于读取`(get)` 数据。

```java
public static void printList(List<? extends Number> list) {
    // 可以从列表中读取 Number 或其子类的对象
    for (Number n : list) {
        System.out.println(n);
    }
    // list.add(new Integer(10)); // 编译错误！不能往List中添加元素（除了null）
                               // 因为不知道确切的子类型是什么
}

public static void main(String[] args) {
    List<Integer> integers = Arrays.asList(1, 2, 3);
    List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
    printList(integers); // 接收 Integer 列表
    printList(doubles);  // 接收 Double 列表
}
```

输出如下：

```tex
1
2
3
1.1
2.2
3.3
```

我们可以从列表中安全地读取 `Number` 对象，因为任何 `Number` 的子类都可以向上转型为 `Number`。但不能往里面添加元素（除了 `null`），因为不知道确切的子类型是什么。

![添加元素运行会报错](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/picgo/image-20250718092443903.png)

### 下界通配符 `(? super T)`

与上界通配符相反，下界通配符 `(Lower Bound Wildcard)`，顾名思义，存在一个最低级的界限，即指定一个最低级别的子类，它表示对于该下界类型以及其父类都适用，类型可以是 `T` 或 `T` 的任何超类（父类）。用于限制泛型类型为某个类的超类或其自身。主要用于写入 `(put)` 数据。

```java
public static void addNumbers(List<? super Number> list) {
    // 可以向列表中添加 Number 或 Number 的子类（如果有的话）
    list.add(10);
    list.add(20);
    list.add(new Integer(30));

    // Number x = list.get(0); // 编译错误！无法保证取出的具体类型，只能保证是 Object

public static void main(String[] args) {
    List<Number> numbers = new ArrayList<>();
    List<Object> objects = new ArrayList<>();
    addNumbers(numbers); // 接收 Number 列表
    addNumbers(objects); // 接收 Object 列表
    System.out.println(numbers);
    System.out.println(objects);
}
```

输出如下：

```tex
[10, 20, 30]
[10, 20, 30]
```

我们可以安全地往列表中添加 `Integer` 对象或其子类（如果有的话），因为 `Integer` 及其子类都可以向上转型为 `Integer` 的任何超类。但不能安全地从中读取，因为只知道它至少是 `Integer` 的一个超类，具体是哪个父类不确定。

### 无界通配符 `(<?>)`

表示类型可以是任何类型。等同于 `<? extends Object>`。通常用于：

- 不关心列表中元素的具体类型时。

- 只读取元素而不修改它们时。

- 当需要与传统非泛型代码兼容时。

```java
public static void printUnknownList(List<?> list) {
    for (Object o : list) { // 只能按 Object 类型处理
        System.out.println(o);
    }
    // list.add("something"); // 编译错误！不能添加元素（除了null）
}
```

### PECS 原则

Producer Extends, Consumer Super

关于何时使用 `extends` 和 `super` 的助记符：

Producer Extends： 如果是生产（提供/读取）数据，使用 `extends`（上界通配符）。

Consumer Super： 如果是消费（接收/写入）数据，使用 `super`（下界通配符）。

## 泛型擦除

Java 泛型在编译时通过类型擦除来实现。在编译后的字节码中，所有的泛型类型参数都会被替换成它们的上界（通常是 `Object`）。

- `List<String>` 在运行时会变成 `List`。

- `T` 会被替换为 `Object`。

- `T extends Number` 会被替换为 `Number`。





