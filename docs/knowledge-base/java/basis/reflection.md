---
title: 反射
category:
  - Java
tag:
  - Java基础
---

Java 的反射 `(Reflection)` 允许 Java 程序在运行时检查、操作类、接口、字段和方法。

反射赋予了我们在运行时分析类以及执行类中方法的能力，我们可以在不知道它们的具体类型或名称的情况下，动态地创建对象、调用方法、访问或修改字段，

反射是 Java 动态性的体现，是许多高级框架（如 `Spring、Hibernate、JUnit` 等）和工具（如 IDE）能够正常工作的基础。

反射功能主要通过 `java.lang.reflect` 包中的类来实现。

## 获取 `Class` 对象

一切反射操作都始于获取一个类的 `Class` 对象，有三种主要方式：

1. 如果知道类的全限定名，可以使用 `Class.forName(String className)` 去获取：

   ```java
   try {
       Class<?> myClass = Class.forName("java.lang.String");
       System.out.println("Class Name: " + myClass.getName());
   } catch (ClassNotFoundException e) {
       e.printStackTrace();
   }
   ```

2. 如果编译时知道具体的类，可以使用这种方式：

   ```java
   Class<String> stringClass = String.class;
   System.out.println("Class Name: " + stringClass.getName());
   ```

3. 如果已经有了某个类的实例对象，可以通过它获取其 `Class` 对象：

   ```java
   String s = "Hello";
   Class<?> stringClassFromObject = s.getClass();
   System.out.println("Class Name: " + stringClassFromObject.getName());
   ```

4. 如果知道类的全限定名，可以通过类加载器去获取：

   ```java
   try {
       Class<?> myClass = ClassLoader.getSystemClassLoader().loadClass("java.lang.String");
       System.out.println("Class Name: " + myClass.getName());
   } catch (ClassNotFoundException e) {
       e.printStackTrace();
   }
   ```

以上输出均为：

```tex
Class Name: java.lang.String
```

## 创建实例对象

有了 `Class` 对象后，我们可以创建该类的实例：

假设有以下 `Person` 类：

```java
public class Person {
    private String name;
    private Integer age;
    public Integer height;

    // 无参构造器
    public Person() {
        name = "zhangsan";
        age = 18;
        height = 180;
    }

    // 有惨构造器
    public Person(String name, Integer age, Integer height) {
        this.name = name;
        this.age = age;
        this.height = height;
    }

    // 公共方法
    public void publicMethod() {
        System.out.println("publicMethod");
    }

    public String saySomething(String word) {
        return word;
    }

    // 私有方法
    private void privateMethod() {
        System.out.println("privateMethod");
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", height=" + height +
                '}';
    }
}
```

1. `Class.newInstance()`： 它只能调用无参构造器，并且如果构造器是私有的或抛出异常，会直接抛出。

   ```java
   try {
       Class<?> personClass = Class.forName("com.shawn.Person");
       // 适用于旧代码（Java 9+ 不推荐使用）或明确知道有无参公共构造器的情况
       Person person = (Person) personClass.newInstance();
       System.out.println(person);
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
            e.printStackTrace();
   }
   ```
   输出如下，可以发现调用的是 `Person` 类的无参构造器:
   
   ```tex
   Person{name='zhangsan', age=18, height=180}
   ```

2. `Constructor.newInstance(Object... initargs)`： 通过获取 `Constructor` 对象来创建实例，可以调用任何访问修饰符的构造器（需要设置可访问性）。

   ```java
   try {
       Class<?> personClass = Class.forName("com.shawn.Person"); 
       // 获取无参构造器
       Constructor<?> constructor = personClass.getConstructor();
       Person person1 = (Person) constructor.newInstance();
   
       // 获取带参数的构造器
       Constructor<?> constructorWithArgs = personClass.getConstructor(String.class, Integer.class, Integer.class);
       Person person2 = (Person) constructorWithArgs.newInstance("Alice", 18, 168);
   
       System.out.println("person1:" + person1); // 打印 Person 对象信息
       System.out.println("person2:" + person2); // 打印 Person 对象信息
   
   } catch (Exception e) {
       e.printStackTrace();
   }
   ```

   输出如下：

   ```tex
   person1:Person{name='zhangsan', age=18, height=180}
   person2:Person{name='Alice', age=18, height=168}
   ```

## 获取和操作字段

我们可以通过反射获取类的字段信息，并对其进行读写操作。

```java
try {
    Class<?> personClass = Class.forName("com.shawn.Person");
    Person person = (Person) personClass.getConstructor().newInstance(); // 创建一个 Person 实例

    // Field nameField = personClass.getField("name"); // 如果 name 是private，会抛异常

    // 获取 Person 类所有的公共字段 (包括继承的公共字段)
    Field[] fields = personClass.getFields();
    System.out.println("Person 类的所有公有字段如下：");
    for (Field field : fields) {
        System.out.println(field.getName());
    }
    System.out.println("===========================");

    // 获取 Person 类所有声明的字段 (包括私有、保护、默认访问权限，但不包括继承的)
    Field[] declaredFields = personClass.getDeclaredFields();
    System.out.println("Person 类的所有字段如下：");
    for (Field declaredField : declaredFields) {
        System.out.println(declaredField.getName());
    }
    System.out.println("===========================");

    // 获取 Person 的 name 私有字段
    Field nameField = personClass.getDeclaredField("name");
    nameField.setAccessible(true); // 允许访问私有字段
    // 设置字段的值
    nameField.set(person, "Bob");
    // 获取字段的值
    String name = (String) nameField.get(person);
    System.out.println("Name: " + name);
} catch (Exception e) {
    e.printStackTrace();
}
```

输出如下：

```tex
Person 类的所有公有字段如下：
height
===========================
Person 类的所有字段如下：
name
age
height
===========================
Name: Bob
```

- `getFields()`：返回所有公共字段（包括继承的）。
- `getDeclaredFields()`：返回类自身声明的所有字段（包括私有，不包括继承的）。
- `setAccessible(true)`：可以突破 `private` 访问限制，但会带来安全风险和性能下降。

2.4 获取和调用方法 `(Methods)`

我们可以通过反射获取类的方法信息，并动态调用它们。

```java
try {
    Class<?> personClass = Class.forName("com.shawn.Person");
    Person person = (Person)personClass.getConstructor(String.class, Integer.clasInteger.class).newInstance("Charlie", 28,185);

    // 获取 Person 类的所有公有方法（包括继承的）
    Method[] methods = personClass.getMethods();
    System.out.println("Person 类的所有公有方法如下：");
    for (Method method : methods) {
        System.out.println(method.getName());
    }
    System.out.println("===========================");

    // getMethod 可以获取公共方法，包括继承的，getMethod (方法名, 参数类型列表)
    Method saySomethingMethod = personClass.getMethod("saySomething", String.class);
    // 调用方法 (invoke(对象实例, 参数列表))
    String result = (String) saySomethingMethod.invoke(person, "Greeting");
    System.out.println("Method result: " + result);
    System.out.println("===========================");

    // 获取 Person 类的私有方法 (getDeclaredMethod)
    Method privateMethod = personClass.getDeclaredMethod("privateMethod");
    privateMethod.setAccessible(true); // 允许访问私有方法
    privateMethod.invoke(person); // 执行私有方法

} catch (Exception e) {
    e.printStackTrace();
}
```

输出如下：

```tex
Person 类的所有公有方法如下：
toString
saySomething
publicMethod
wait
wait
wait
equals
hashCode
getClass
notify
notifyAll
===========================
Method result: Greeting
===========================
privateMethod
```

- `getMethods()`：返回所有公共方法（包括继承的）。
- `getDeclaredMethods()`：返回类自身声明的所有方法（包括私有，不包括继承的）。






