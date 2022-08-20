# 如何使用Math对象快速计算数组中的最大值或最小值

Math 对象下包含 min() 和 max() 方法 用于确定一组数值中的最大值和最小值。这两个方法都可以接收任意多个数值参数。

```
var max = Math.max(1,2,3,4,5,6);
console.log(max);   // 6

var min  = Math.min(1,2,3,4,5,6);
console.log(min);    // 1
```

而如果我们要取出[数组](https://so.csdn.net/so/search?q=数组&spm=1001.2101.3001.7020)中的最大值或最小值,该怎么做呢?(以取出数组中的最大值为例)

先看代码

```
var testArr = [1,2,3,4,5,6];
var max = Math.max.apply(Math,testArr);
console.log(max);   // 6
```

这里用到了一个apply()方法,把Math对象作为apply()的第一个参数, 从而正确的设置this值,

而我们知道apply()的第二个参数必须是 类数组arguments 或者 数组, 所以就可以将我们需要操作的数组作为第二个参数了。

转载于:https://www.cnblogs.com/yanyiyi/p/6185998.html