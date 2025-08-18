---
title: 代理
category:
  - Java
tag:
  - Java基础
---

在 Java 中，代理（`Proxy`） 是一种重要的设计模式，它允许我们为另一个对象提供一个替身或占位符，以控制对这个对象的访问。代理模式的核心思想是：客户端通过代理对象来间接访问真实对象，而代理对象可以在客户端和目标对象之间插入额外的逻辑，比如权限控制、日志记录、性能监控等。

从 JVM 层面来说，静态代理在编译时就将接口、实现类、代理类这些都变成了一个个实际的 `class` 文件。

在 Java 中，代理主要有两种实现方式：静态代理和动态代理。

## 静态代理

在静态代理中，我们对目标对象的每个方法的增强都是手动完成的，非常不灵活，比如接口一旦新增加方法，目标对象和代理对象都要进行修改且麻烦，因为静态代理需要对每个目标类都单独写一个代理类。

静态代理实现步骤:

1. 定义一个接口及其实现类；
2. 创建一个代理类同样实现这个接口
3. 将实现类对象注入进代理类，然后在代理类的对应方法调用实现类中的对应方法。
4. 在代理类的业务方法中，调用实现类的方法，并在调用前后添加自己的逻辑。

这样的话，我们就可以通过代理类屏蔽对目标对象的访问，并且可以在目标方法执行前后做一些自己想做的事情。

代码示例：

1.定义发送短信的接口

```java
public interface SmsService {
    String send(String message);
}
```

2.实现发送短信的接口

```java
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

3.创建代理类并同样实现发送短信的接口

```java
public class SmsProxy implements SmsService {

    private final SmsService smsService;

    public SmsProxy(SmsService smsService) {
        this.smsService = smsService;
    }

    @Override
    public String send(String message) {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method send()");
        // 调用目标类方法
        smsService.send(message);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method send()");
        return null;
    }
}
```

4.实际使用

```java
public class Main {
    public static void main(String[] args) {
        SmsService smsService = new SmsServiceImpl();
        SmsProxy smsProxy = new SmsProxy(smsService);
        smsProxy.send("java");
    }
}
```

![短信发送的静态代理例子](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/static-proxy-sms-example.png)

输入如下：

```tex
before method send()
send message:java
after method send()
```

从输出结果可以看出，我们已经增加了 `SmsServiceImpl` 的`send()`方法。

如果 `SmsService` 接口新增了方法，`SmsServiceImpl` 和 `SmsProxy` 都需要修改。如果有很多像 `SmsService` 这样的接口，就需要创建很多静态代理类，维护成本很高。

其实，`Thread` 类与 `Runnable` 接口的设计使用的也是静态代理的设计模式，`Thread` 类是 `Runnable` 接口的一个代理类。

`Runnable` 接口：

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

`Thread` 类：

```java
public class Thread implements Runnable {
    private Runnable target;
    public Thread(Runnable target) {
        init(null, target, "Thread-" + nextThreadNum(), 0);
    }
    // 省略...
    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }
}
```

自定义 `MyTask` 类实现 `Runnbale` 接口：

```java
public class MyTask implements Runnable{
    @Override
    public void run() {
        System.out.println("子线程...");
    }
}
```

实际使用：

```java
public static void main(String[] args) {
    Thread thread = new Thread(new MyTask());
    thread.start();
    System.out.println("主线程...");
}
```

![`Thread` 与 `Runnable` 的静态代理](https://chengliuxiang.oss-cn-hangzhou.aliyuncs.com/blog/static-proxy-thread-runnable.png)

输出如下：

```tex
主线程...
子线程...
```

## 动态代理

相比于静态代理来说，动态代理更加灵活。我们不需要针对每个目标类都单独创建一个代理类，并且也不需要我们必须实现接口，我们可以直接代理实现类(CGLIB 动态代理机制)。

从 JVM 角度来说，动态代理是在运行时动态生成类字节码，并加载到 JVM 中的。

Java 中，实现动态代理的方式主要是 JDK 动态代理和 CGLIB 动态代理。

### JDK 动态代理

在 JDK 动态代理机制中 `InvocationHandler` 接口和 `Proxy` 类是核心。

`Proxy` 类中使用频率最高的方法是：`newProxyInstance()` ，这个方法主要用来生成一个代理对象。

```java
public static Object newProxyInstance(ClassLoader loader,
                                        Class<?>[] interfaces,
                                        InvocationHandler h)
    throws IllegalArgumentException
{
    ......
}
```

这个方法一共有 3 个参数：

1. `loader`:类加载器，用于加载代理对象。
2. `interfaces`: 被代理类实现的一些接口；
3. `h`:实现了 `InvocationHandler` 接口的对象；

要实现动态代理的话，还必须需要实现 `InvocationHandler` 来自定义处理逻辑。当我们的动态代理对象调用一个方法时，这个方法的调用就会被转发到实现 `InvocationHandler` 接口类的 `invoke` 方法来调用。

```java
public interface InvocationHandler {
    /**
     * 当我们使用代理对象调用方法的时候实际会调用到这个方法
     */
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
```

`invoke()` 方法有下面三个参数：

1. `proxy`:动态生成的代理类
2. `method`: 与代理类对象调用的方法相对应
3. `args`: 当前 `method` 方法的参数

我们通过 `Proxy` 类的 `newProxyInstance()` 创建的代理对象在调用方法的时候，实际会调用到实现 `InvocationHandler` 接口的类的 `invoke()` 方法。

我们可以在 `invoke()` 方法中自定义处理逻辑，比如在方法执行前后做什么事情。

代码示例：

1.定义发送短信的接口

```java
public interface SmsService {
    String send(String message);
}
```

2.实现发送短信的接口

```java
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

3.定义一个 JDK 动态代理类

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class SmsInvocationHandler implements InvocationHandler {
    /**
     * 代理类中的真实对象
     */
    private final Object target;

    public SmsInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        // 调用目标对象的方法
        Object result = method.invoke(target, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return result;
    }
}
```

`invoke()` 方法: 当我们的动态代理对象调用原生方法的时候，最终实际上调用到的是 `invoke()` 方法，然后 `invoke()` 方法代替我们去调用了被代理对象的原生方法。

4.获取代理对象的工厂类

```java
public class JdkProxyFactory {
    public static Object getProxy(Object target) {
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(), // 目标类的类加载器
                target.getClass().getInterfaces(),  // 代理需要实现的接口，可指定多个
                new SmsInvocationHandler(target)   // 代理对象对应的自定义 InvocationHandler
        );
    }
}
```

5.实际使用

```java
SmsService smsService = (SmsService) JdkProxyFactory.getProxy(new SmsServiceImpl());
smsService.send("java");
```

输出如下：

```tex
before method send
send message:java
after method send
```

### CGLIB 动态代理

JDK 动态代理有一个最致命的问题是其只能代理实现了接口的类。为了解决这个问题，我们可以用 CGLIB 动态代理机制来避免。

[CGLIB](https://github.com/cglib/cglib) (`Code Generation Library`) 是一个基于 [ASM](http://www.baeldung.com/java-asm) 的字节码生成库，它允许我们在运行时对字节码进行修改和动态生成。

CGLIB 通过继承方式实现代理。很多知名的开源框架都使用到了 CGLIB， 例如 Spring 中的 AOP 模块中：如果目标对象实现了接口，则默认采用 JDK 动态代理，否则采用 CGLIB 动态代理。

在 CGLIB 动态代理机制中 `MethodInterceptor` 接口和 `Enhancer` 类是核心。

我们需要自定义 `MethodInterceptor` 并重写 `intercept` 方法，`intercept` 用于拦截增强被代理类的方法。

```java
public interface MethodInterceptor
extends Callback{
    // 拦截被代理类中的方法
    public Object intercept(Object obj, java.lang.reflect.Method method, Object[] args,MethodProxy proxy) throws Throwable;
}
```

1. `obj`:被代理的对象（需要增强的对象）
2. `method`:被拦截的方法（需要增强的方法）
3. `args`:方法入参
4. `proxy`:用于调用原始方法

我们可以通过 `Enhancer`类来动态获取被代理类，当代理类调用方法的时候，实际调用的是 `MethodInterceptor` 中的 `intercept` 方法。

代码示例：

不同于 JDK 动态代理不需要额外的依赖。CGLIB 实际是属于一个开源项目，如果我们要使用它的话，需要手动添加相关依赖。

```xml
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```

1.实现一个使用阿里云发送短信的类

```java
public class AliSmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

2.自定义 `MethodInterceptor`（方法拦截器）

```java
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import java.lang.reflect.Method;

/**
 * 自定义MethodInterceptor
 */
public class DebugMethodInterceptor implements MethodInterceptor {

    /**
     * @param o           被代理的对象（需要增强的对象）
     * @param method      被拦截的方法（需要增强的方法）
     * @param args        方法入参
     * @param methodProxy 用于调用原始方法
     */
    @Override
    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object object = methodProxy.invokeSuper(o, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return object;
    }
}
```

3.获取代理类

```java
import net.sf.cglib.proxy.Enhancer;

public class CglibProxyFactory {

    public static Object getProxy(Class<?> clazz) {
        // 创建动态代理增强类
        Enhancer enhancer = new Enhancer();
        // 设置类加载器
        enhancer.setClassLoader(clazz.getClassLoader());
        // 设置被代理类
        enhancer.setSuperclass(clazz);
        // 设置方法拦截器
        enhancer.setCallback(new DebugMethodInterceptor());
        // 创建代理类
        return enhancer.create();
    }
}
```

4.实际使用

```java
AliSmsService aliSmsService = (AliSmsService) CglibProxyFactory.getProxy(AliSmsService.class);
aliSmsService.send("java");
```

运行上述代码之后，控制台打印出：

```tex
before method send
send message:java
after method send
```

### JDK 与 CGLIB 动态代理对比

- JDK 动态代理只能代理实现了接口的类或者直接代理接口，而 CGLIB 可以代理未实现任何接口的类。

- CGLIB 动态代理是通过生成一个被代理类的子类来拦截被代理类的方法调用，因此不能代理声明为 `final` 类型的类和方法。

- 就二者的效率来说，大部分情况都是 JDK 动态代理更优秀，随着 JDK 版本的升级，这个优势更加明显。

## 静动态代理对比

- 动态代理更加灵活，不需要必须实现接口，可以直接代理实现类，并且可以不需要针对每个目标类都创建一个代理类。另外，静态代理中，接口一旦新增加方法，目标对象和代理对象都要进行修改，这是非常麻烦的。

- 静态代理在编译时就将接口、实现类、代理类这些都变成了一个个实际的 class 文件。而动态代理是在运行时动态生成类字节码，并加载到 JVM 中的。



