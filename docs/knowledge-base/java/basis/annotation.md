---
title: 注解
category:
  - Java
tag:
  - Java基础
---

在 Java 中，注解（`Annotation`） 是一种特殊的元数据，它为代码提供额外的信息，但本身并不会直接影响代码的执行逻辑。注解可以应用于类、方法、字段、参数、局部变量、构造器等程序元素上。

注解在 Java 5 中引入，主要目的是简化配置、减少样板代码，并提供在编译期或运行时处理代码的机制。

## 本质和作用

注解本质上是 Java 代码中的一种标记或元数据，它不包含业务逻辑，但能够被工具、框架或编译器读取和解析，并根据这些信息执行相应的操作。

其主要作用如下：

1. 编译期检查： 编译器可以根据注解进行错误检查或发出警告。例如，`@Override` 注解可以确保子类方法正确地重写了父类方法。

2. 代码生成： 在编译期或运行时，基于注解信息生成额外的代码（例如，Lombok 使用注解自动生成 `getter/setter`）。

3. 运行时处理： 许多框架（如 Spring、Hibernate、JUnit）在运行时通过反射读取注解信息，并据此调整其行为。例如，Spring 的 `@Autowired` 注解用于自动装配依赖。

4. 简化配置： 相较于 XML 等配置文件，注解将配置信息直接嵌入到代码中，减少了配置的复杂性，提高了可读性。

## 内置注解

Java 语言自身提供了一些标准注解，用于编译器或 JVM 的特定行为：

1. `@Override`：标记一个方法是重写（覆盖）父类或实现接口中的方法，如果被标记的方法没有正确地重写父类方法（例如，方法名拼写错误、参数不匹配），编译器会报错，以此来帮助开发者避免常见的重写错误，提高代码的健壮性。
2. `@Deprecated`：标记一个类、方法或字段是已过时的，当代码中使用了被 `@Deprecated` 标记的元素时，编译器会发出警告，以此来告知开发者该元素将来可能会被移除或有更好的替代方案，建议不再使用。
3. `@SuppressWarnings`：指示编译器抑制（不显示）特定的警告信息，可以接受一个字符串数组作为参数，指定要抑制的警告类型（如 `"unchecked"`、`"rawtypes"`、`"deprecation"` 等）。 在我们确定某些警告是安全且可以忽略时，用于清除编译器的警告，使编译输出更干净。
4. `@FunctionalInterface` (Java 8 引入)： 标记一个接口是函数式接口，即只包含一个抽象方法的接口，如果一个接口被 `@FunctionalInterface` 标记但包含多个抽象方法，编译器会报错。
5. `@SafeVarargs` (Java 7 引入)：标记一个方法或构造器使用了可变长参数 （`Varargs`），并且这些可变长参数在处理时是类型安全的。

## 元注解

元注解 `(Meta-Annotations)` 是用来注解其他注解的注解。它们定义了自定义注解的行为和属性。

`java.lang.annotation` 中提供了元注解，可以使用这些注解来定义自己的注解。

![Java 元注解](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/meta-annotations.png) 

1. `@Target` ：指定自定义注解可以应用于哪些程序元素上，接受一个 `ElementType` 枚举数组，如 `ElementType.TYPE` (类、接口、枚举)、`ElementType.METHOD` (方法)、`ElementType.FIELD` (字段) 等。
2. `@Retention` ： 指定自定义注解的生命周期，即注解信息在何时可用，接受一个 `RetentionPolicy` 枚举值：
   - `RetentionPolicy.SOURCE`：注解只保留在源代码中，编译后会被丢弃（如 `@Override`）。
   - `RetentionPolicy.CLASS`：注解保留在 `.class` 文件中，但在运行时无法通过反射获取（默认值）。
   - `RetentionPolicy.RUNTIME`：注解保留在 `.class` 文件中，并且在运行时可以通过反射获取和处理（如 Spring 的 `@Autowired`）。
3. `@Documented`：标记一个自定义注解，表示该注解会被包含在 Javadoc 文档中。
4. `@Inherited`：标记一个自定义注解，表示如果一个类被该注解标记，则其子类会继承这个注解，只能应用于类，不能应用于方法或字段。
5. `@Repeatable` (Java 8 引入)：标记一个自定义注解，表示该注解可以在同一个程序元素上重复使用。


## 自定义注解

我们可以根据自己的需求创建自定义注解 `（Custom Annotations）`。

`java.lang.reflect.AnnotationElement` 接口则提供了拿到我们自定义注解的功能。注解的处理是通过 Java 反射来处理的.
反射相关的类 `Class, Method, Field` 都实现了 `AnnotationElement` 接口,如下图所示:

![`AnnotationElement` 实现类图](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/annotation-element-implementation-class.png)

`java.lang.reflect.AnnotationElement` 接口中的方法如下,只要我们通过反射拿到 `Class, Method, Field` 类，就能够通过 `getAnnotation(Class)` 拿到我们想要的注解并取值。

![`AnnotationElement` 中的方法](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/annotation-element-methods.png)

例如下面,自定义一个注解 `MyCustomAnnotation`,在其中定义了3个元素:

```java
@Target(ElementType.METHOD) // 应用于方法
@Retention(RetentionPolicy.RUNTIME) // 运行时可见
@Documented // 包含在 Javadoc 中
public @interface MyCustomAnnotation {
    // 元素（成员变量)
    String value() default "默认值";
    int count() default 1;
    String[] tags() default {}; // 数组类型的元素
}
```

然后可以将其注解在方法上:

```java
public class MyService {

    @MyCustomAnnotation(value = "这是一个重要的操作", count = 5, tags = {"core", "business"})
    public void performOperation() {
        System.out.println("执行了 MyService 的 performOperation 方法。");
    }

    @MyCustomAnnotation("另一个操作") // 只有一个 value 元素时可省略元素名
    public void anotherOperation() {
        System.out.println("执行了 MyService 的 anotherOperation 方法。");
    }

    public static void main(String[] args) throws NoSuchMethodException {
        // 通过反射获取注解信息
        Class<MyService> serviceClass = MyService.class;
        Method method = serviceClass.getMethod("performOperation");

        if (method.isAnnotationPresent(MyCustomAnnotation.class)) {
            MyCustomAnnotation annotation = method.getAnnotation(MyCustomAnnotation.class);
            System.out.println("方法名: " + method.getName());
            System.out.println("注解 value: " + annotation.value());
            System.out.println("注解 count: " + annotation.count());
            System.out.print("注解 tags: ");
            for (String tag : annotation.tags()) {
                System.out.print(tag + " ");
            }
            System.out.println();
        }
    }
}
```

输出如下:

```tex
方法名: performOperation
注解 value: 这是一个重要的操作
注解 count: 5
注解 tags: core business 
```

在实际开发应用中,自定义注解通常配合拦截器实现登录校验或者配合 AOP 实现日志打印。