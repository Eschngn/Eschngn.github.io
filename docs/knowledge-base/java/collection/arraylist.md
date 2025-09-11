---
title: ArrayList
category:
  - Java
tag:
  - Java集合
---

## 创建 `ArrayList`

```java
// 此时会调用无参构造方法（见下面的代码）创建一个空的数组，常量 DEFAULTCAPACITY_EMPTY_ELEMENTDATA 的值为 {}。
List<String> list = new ArrayList<>(); 

public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

// 如果非常确定 ArrayList 中元素的个数，在创建的时候还可以指定初始大小。
List<String> list = new ArrayList<>(20);
// 这样做的好处是，可以有效地避免在添加新的元素时进行不必要的扩容。
```

## 添加元素

```java
list.add("橙留香");
```

堆栈过程图示：

```bash
add(element)
└── if (size == elementData.length) // 判断是否需要扩容
    ├── grow(minCapacity) // 扩容
    │   └── newCapacity = oldCapacity + (oldCapacity >> 1) // 计算新的数组容量
    │   └── Arrays.copyOf(elementData, newCapacity) // 创建新的数组
    ├── elementData[size++] = element; // 添加新元素
    └── return true; // 添加成功
```

`add()` 方法的源码：

```java
/**
 * 将指定元素添加到 ArrayList 的末尾
 * @param e 要添加的元素
 * @return 添加成功返回 true
 */
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // 确保 ArrayList 能够容纳新的元素
    elementData[size++] = e; // 在 ArrayList 的末尾添加指定元素
    return true;
}
```

参数 `e` 为要添加的元素，此时的值为“橙留香”，`size` 为 `ArrayList` 的长度，此时为 `0`。

继续跟下去，来看看 `ensureCapacityInternal()` 方法：

```java
/**
 * 确保 ArrayList 能够容纳指定容量的元素
 * @param minCapacity 指定容量的最小值
 */
private void ensureCapacityInternal(int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) { // 如果 elementData 还是默认的空数组
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity); // 使用 DEFAULT_CAPACITY 和指定容量的最小值中的较大值
    }

    ensureExplicitCapacity(minCapacity); // 确保容量能够容纳指定容量的元素
}
```

此时：

- 参数 `minCapacity` 为 `1`（`size+1` 传过来的）
- `elementData` 为存放 `ArrayList` 元素的底层数组，前面声明 `ArrayList` 的时候讲过了，此时为空 `{}`
- `DEFAULTCAPACITY_EMPTY_ELEMENTDATA` 前面也讲过了，为 `{}`

所以，`if` 条件此时为 `true`，`if` 语句 `minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity)` 要执行。

`DEFAULT_CAPACITY` 为 `10`（见下面的代码），所以执行完这行代码后，`minCapacity` 为 `10`，`Math.max()` 方法的作用是取两个当中最大的那个。

```java
private static final int DEFAULT_CAPACITY = 10;
```

接下来执行 `ensureExplicitCapacity()` 方法，来看一下源码：

```java
/**
 * 检查并确保集合容量足够，如果需要则增加集合容量。
 *
 * @param minCapacity 所需最小容量
 */
private void ensureExplicitCapacity(int minCapacity) {
    // 检查是否超出了数组范围，确保不会溢出
    if (minCapacity - elementData.length > 0)
        // 如果需要增加容量，则调用 grow 方法
        grow(minCapacity);
}
```

此时：

- 参数 `minCapacity` 为 `10`
- `elementData.length` 为 `0`（数组为空）

所以 `10-0>0`，`if` 条件为 `true`，进入 `if` 语句执行 `grow()` 方法，来看源码：

```java
/**
 * 扩容 ArrayList 的方法，确保能够容纳指定容量的元素
 * @param minCapacity 指定容量的最小值
 */
private void grow(int minCapacity) {
    // 检查是否会导致溢出，oldCapacity 为当前数组长度
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1); // 扩容至原来的1.5倍
    if (newCapacity - minCapacity < 0) // 如果还是小于指定容量的最小值
        newCapacity = minCapacity; // 直接扩容至指定容量的最小值
    if (newCapacity - MAX_ARRAY_SIZE > 0) // 如果超出了数组的最大长度
        newCapacity = hugeCapacity(minCapacity); // 扩容至数组的最大长度
    // 将当前数组复制到一个新数组中，长度为 newCapacity
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

## 向指定位置添加元素

`add(int index, E element)` 方法的源码如下：

```java
/**
 * 在指定位置插入一个元素。
 *
 * @param index   要插入元素的位置
 * @param element 要插入的元素
 * @throws IndexOutOfBoundsException 如果索引超出范围，则抛出此异常
 */
public void add(int index, E element) {
    rangeCheckForAdd(index); // 检查索引是否越界

    ensureCapacityInternal(size + 1);  // 确保容量足够，如果需要扩容就扩容
    System.arraycopy(elementData, index, elementData, index + 1,
            size - index); // 将 index 及其后面的元素向后移动一位
    elementData[index] = element; // 将元素插入到指定位置
    size++; // 元素个数加一
}
```

`add(int index, E element)` 方法会调用到一个非常重要的本地方法 `System.arraycopy()`，它会对数组进行复制（要插入位置上的元素往后复制）。

来细品一下。

这是 `arraycopy()` 的语法：

```java
System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length);
```

在 `ArrayList.add(int index, E element)` 方法中，具体用法如下：

```java
System.arraycopy(elementData, index, elementData, index + 1, size - index);
```

- `elementData`：表示要复制的源数组，即 `ArrayList` 中的元素数组。
- `index`：表示源数组中要复制的起始位置，即需要将 `index` 及其后面的元素向后移动一位。
- `elementData`：表示要复制到的目标数组，即 `ArrayList` 中的元素数组。
- `index + 1`：表示目标数组中复制的起始位置，即将 `index` 及其后面的元素向后移动一位后，应该插入到的位置。
- `size - index`：表示要复制的元素个数，即需要将 `index` 及其后面的元素向后移动一位，需要移动的元素个数为 `size - index`。

## 更新元素

来看一下 `set()` 方法的源码：

```java
/**
 * 用指定元素替换指定位置的元素。
 *
 * @param index   要替换的元素的索引
 * @param element 要存储在指定位置的元素
 * @return 先前在指定位置的元素
 * @throws IndexOutOfBoundsException 如果索引超出范围，则抛出此异常
 */
public E set(int index, E element) {
    rangeCheck(index); // 检查索引是否越界

    E oldValue = elementData(index); // 获取原来在指定位置上的元素
    elementData[index] = element; // 将新元素替换到指定位置上
    return oldValue; // 返回原来在指定位置上的元素
}
```

## 删除元素

`remove(int index)` 方法用于删除指定下标位置上的元素，`remove(Object o)` 方法用于删除指定值的元素。

```java
list.remove(1);
list.remove("橙留香");
```

先来看 `remove(int index)` 方法的源码：

```java
/**
 * 删除指定位置的元素。
 *
 * @param index 要删除的元素的索引
 * @return 先前在指定位置的元素
 * @throws IndexOutOfBoundsException 如果索引超出范围，则抛出此异常
 */
public E remove(int index) {
    rangeCheck(index); // 检查索引是否越界

    E oldValue = elementData(index); // 获取要删除的元素

    int numMoved = size - index - 1; // 计算需要移动的元素个数
    if (numMoved > 0) // 如果需要移动元素，就用 System.arraycopy 方法实现
        System.arraycopy(elementData, index+1, elementData, index,
                numMoved);
    elementData[--size] = null; // 将数组末尾的元素置为 null，让 GC 回收该元素占用的空间

    return oldValue; // 返回被删除的元素
}
```

需要注意的是，在 `ArrayList` 中，删除元素时，需要将删除位置后面的元素向前移动一位，以填补删除位置留下的空缺。如果需要移动元素，则需要使用 `System.arraycopy` 方法将删除位置后面的元素向前移动一位。最后，将数组末尾的元素置为 `null`，以便让垃圾回收机制回收该元素占用的空间。

再来看 `remove(Object o)` 方法的源码：

```java
/**
 * 删除列表中第一次出现的指定元素（如果存在）。
 *
 * @param o 要删除的元素
 * @return 如果列表包含指定元素，则返回 true；否则返回 false
 */
public boolean remove(Object o) {
    if (o == null) { // 如果要删除的元素是 null
        for (int index = 0; index < size; index++) // 遍历列表
            if (elementData[index] == null) { // 如果找到了 null 元素
                fastRemove(index); // 调用 fastRemove 方法快速删除元素
                return true; // 返回 true，表示成功删除元素
            }
    } else { // 如果要删除的元素不是 null
        for (int index = 0; index < size; index++) // 遍历列表
            if (o.equals(elementData[index])) { // 如果找到了要删除的元素
                fastRemove(index); // 调用 fastRemove 方法快速删除元素
                return true; // 返回 true，表示成功删除元素
            }
    }
    return false; // 如果找不到要删除的元素，则返回 false
}
```

该方法通过遍历的方式找到要删除的元素，null 的时候使用 == 操作符判断，非 null 的时候使用 `equals()` 方法，然后调用 `fastRemove()` 方法。

注意：

- 有相同元素时，只会删除第一个。

继续往后面跟，来看一下 `fastRemove()` 方法：

```java
/**
 * 快速删除指定位置的元素。
 *
 * @param index 要删除的元素的索引
 */
private void fastRemove(int index) {
    int numMoved = size - index - 1; // 计算需要移动的元素个数
    if (numMoved > 0) // 如果需要移动元素，就用 System.arraycopy 方法实现
        System.arraycopy(elementData, index+1, elementData, index,
                numMoved);
    elementData[--size] = null; // 将数组末尾的元素置为 null，让 GC 回收该元素占用的空间
}
```

同样是调用 `System.arraycopy()` 方法对数组进行复制和移动。

## 查找元素

如果要正序查找一个元素，可以使用 `indexOf()` 方法；如果要倒序查找一个元素，可以使用 `lastIndexOf()` 方法。

来看一下 `indexOf()` 方法的源码：

```java
/**
 * 返回指定元素在列表中第一次出现的位置。
 * 如果列表不包含该元素，则返回 -1。
 *
 * @param o 要查找的元素
 * @return 指定元素在列表中第一次出现的位置；如果列表不包含该元素，则返回 -1
 */
public int indexOf(Object o) {
    if (o == null) { // 如果要查找的元素是 null
        for (int i = 0; i < size; i++) // 遍历列表
            if (elementData[i]==null) // 如果找到了 null 元素
                return i; // 返回元素的索引
    } else { // 如果要查找的元素不是 null
        for (int i = 0; i < size; i++) // 遍历列表
            if (o.equals(elementData[i])) // 如果找到了要查找的元素
                return i; // 返回元素的索引
    }
    return -1; // 如果找不到要查找的元素，则返回 -1
}
```

如果元素为 `null` 的时候使用 `==` 操作符，否则使用 `equals()` 方法。

`lastIndexOf()` 方法和 `indexOf()` 方法类似，不过遍历的时候从最后开始。

```java
/**
 * 返回指定元素在列表中最后一次出现的位置。
 * 如果列表不包含该元素，则返回 -1。
 *
 * @param o 要查找的元素
 * @return 指定元素在列表中最后一次出现的位置；如果列表不包含该元素，则返回 -1
 */
public int lastIndexOf(Object o) {
    if (o == null) { // 如果要查找的元素是 null
        for (int i = size-1; i >= 0; i--) // 从后往前遍历列表
            if (elementData[i]==null) // 如果找到了 null 元素
                return i; // 返回元素的索引
    } else { // 如果要查找的元素不是 null
        for (int i = size-1; i >= 0; i--) // 从后往前遍历列表
            if (o.equals(elementData[i])) // 如果找到了要查找的元素
                return i; // 返回元素的索引
    }
    return -1; // 如果找不到要查找的元素，则返回 -1
}
```

`contains()` 方法可以判断 `ArrayList` 中是否包含某个元素，其内部就是通过 `indexOf()` 方法实现的：

```java
public boolean contains(Object o) {
    return indexOf(o) >= 0;
}
```

## 增删改查的时间复杂度

（1）查询

时间复杂度为 `O(1)`，因为 `ArrayList` 内部使用数组来存储元素，所以可以直接根据索引来访问元素。

```java
/**
 * 返回列表中指定位置的元素。
 *
 * @param index 要返回的元素的索引
 * @return 列表中指定位置的元素
 * @throws IndexOutOfBoundsException 如果索引超出范围（index < 0 || index >= size()）
 */
public E get(int index) {
    rangeCheck(index); // 检查索引是否合法
    return elementData(index); // 调用 elementData 方法获取元素
}

/**
 * 返回列表中指定位置的元素。
 * 此方法不进行边界检查，因此只应由内部方法和迭代器调用。
 *
 * @param index 要返回的元素的索引
 * @return 列表中指定位置的元素
 */
E elementData(int index) {
    return (E) elementData[index]; // 返回指定索引位置上的元素
}
```

（2）插入

添加一个元素（调用 `add()` 方法时）的时间复杂度最好情况为 `O(1)`，最坏情况为 `O(n)`。

- 如果在列表末尾添加元素，时间复杂度为 `O(1)`。
- 如果要在列表的中间或开头插入元素，则需要将插入位置之后的元素全部向后移动一位，时间复杂度为 `O(n)`。

（3）删除

删除一个元素（调用 `remove(Object)` 方法时）的时间复杂度最好情况 `O(1)`，最坏情况 `O(n)`。

- 如果要删除列表末尾的元素，时间复杂度为 `O(1)`。
- 如果要删除列表中间或开头的元素，则需要将删除位置之后的元素全部向前移动一位，时间复杂度为 `O(n)`。

（4）修改

修改一个元素（调用 `set()` 方法时）与查询操作类似，可以直接根据索引来访问元素，时间复杂度为 `O(1)`。

```java
/**
 * 用指定元素替换列表中指定位置的元素。
 *
 * @param index 要替换元素的索引
 * @param element 要放入列表中的元素
 * @return 原来在指定位置上的元素
 * @throws IndexOutOfBoundsException 如果索引超出范围（index < 0 || index >= size()）
 */
public E set(int index, E element) {
    rangeCheck(index); // 检查索引是否合法

    E oldValue = elementData(index); // 获取原来在指定位置上的元素
    elementData[index] = element; // 将指定位置上的元素替换为新元素
    return oldValue; // 返回原来在指定位置上的元素
}
```


