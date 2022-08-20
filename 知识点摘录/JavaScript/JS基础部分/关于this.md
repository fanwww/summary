this 是什么
this是包含它的函数作为方法被调用时所属的对象。1、包含它的函数。2、作为方法被调用时。3、所属的对象。

随着函数使用场合的不同，this的值会发生变化。this指向什么，完全取决于什么地方以什么方式调用，而不是创建时。

this 的四种绑定规则
this的4种绑定规则分别是：默认绑定、隐式绑定、显式绑定、new 绑定。优先级从低到高。

new 绑定 > 显式绑定> 隐式绑定 > 默认绑定

new 绑定

```js
function foo (a) {
    this.a = a
}
var bar = new foo(2)
console.log(bar.a) // 2
```

使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。

这里之所以对象bar可以点出函数foo里面的a是因为new关键字可以改变this的指向，使用new时会自动调用一个函数apply方法将这个this指向对象bar，为什么我说bar是对象，因为用了new关键字就是创建一个对象实例，我们这里用变量bar创建了一个foo的实例（相当于复制了一份foo到对象bar里面），此时仅仅只是创建，并没有执行，而调用这个函数foo的是对象bar，那么this指向的自然是对象bar，那么为什么对象bar中会有user，因为你已经复制了一份foo函数到对象bar中，用了new关键字就等同于复制了一份。

特别注意 : 如果原函数返回一个对象类型，那么将无法返回新对象,你将丢失绑定this的新对象，例:

```js
function foo () {
    this.a = 10
    return new String('fx')
}
var obj = new foo()
```

显式绑定
this绑定的是 call,apply,bind 的第一个参数

call()方法

```js
var a = {
    user: 'fx',
    fn: function () {
        console.log(this.user) // fx
    }
}
var b = a.fn
b.call(a)
```

通过在call方法，第一个参数表示要把b添加到哪个环境中，简单来说，this就会指向那个对象。

call方法除了第一个参数以外还可以添加多个参数，如下

```js
var a = {
    user: 'fx',
    fn: function (x, xx) {
        console.log(this.user) // fx
        console.log(x + xx) // 520
    }
}
var b = a.fn
```

apply()方法

apply方法和call方法有些相似，它也可以改变this的指向

```js
var a = {
    user: 'fx',
    fn: function () {
        console.log(this.user) // fx
    }
}
var b = a.fn
b.apply(a)
```

同样apply也可以有多个参数，但是不同的是，第二个参数必须是一个数组，如下：

```js
var a = {
    user: 'fx',
    fn: function (x, xx) {
        console.log(this.user) // fx
        console.log(x + xx) // 520
    }
}
var b = a.fn
```

bind()方法

bind方法和call、apply方法有些不同，但是不管怎么说它们都可以用来改变this的指向。

先看下面一段代码：

```js
var a = {
    user:"fx",
    fn:function(){
        console.log(this.user);
    }
}
var b = a.fn;
b.bind(a);
```

我们发现代码没有被打印，对，这就是bind和call、apply方法的不同，实际上bind方法返回的是一个修改过后的函数。不会立即调用，而是将函数返回

```js
var a = {
    user:"fx",
    fn:function(){
        console.log(this.user); // fx
    }
}
var b = a.fn;
var c = b.bind(a);
c();
```

如果要调用的话必须还要加上()

同样bind也可以有多个参数，并且参数可以执行的时候再次添加，但是要注意的是，参数是按照形参的顺序进行的。

```js
var a = {
    user:"fx",
    fn:function(e,d,f){
        console.log(this.user); // fx 
        console.log(e,d,f); // 10 1 2
    }
}
var b = a.fn;
var c = b.bind(a,10);
c(1,2);
```

回调函数的中使用bind

```js
var obj = {
    name: 'fx'
}

setTimeout(function () {
    console.log(this) // Object {name: "fx"}
}.bind(obj), 1000)

========

var obj = {
    name: 'fx'
}

setTimeout(function () {
    console.log(this) // Window
}, 1000)
```

如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值在调用时会被忽略，实际应用的是默认绑定规则：

```js
var a = {
    user:"fx",
    fn:function(){
        console.log(this); // Window
    }
}
var b = a.fn;
b.apply(null);
```

总结：call和apply（参数为数组）都是改变上下文中的this并立即执行这个函数，bind方法可以让对应的函数想什么时候调就什么时候调用，并且可以将参数在执行的时候添加，这是它们的区别。

间接引用

你有可能（有意或者无意地）创建一个函数的“间接引用”，调用这个函数会应用默认绑定规则，间接引用最容易在赋值时发生

```js
function foo() {
    console.log( this.a );
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
(p.foo = o.foo)(); // 2
```

赋值表达式 p.foo = o.foo 的返回值是目标函数的引用，因此调用位置是 foo() 而不是

p.foo() 或者 o.foo()。根据我们之前说过的，这里会应用默认绑定。

隐式绑定
函数是在某个上下文对象下被调用

```js
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo(); // 2
```

foo() 被调用时，它的落脚点确实指向 obj 对象。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。因为调用 foo() 时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的

如果一个函数中有this，这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象

```js
function foo() {
    console.log( this.a );
}
var obj2 = {
    a: 42,
    foo: foo
};
var obj1 = {
    a: 2,
    obj2: obj2
};
obj1.obj2.foo(); // 42
```

```js
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); // 12
        }
    }
}
o.b.fn(); // 12

var o = {
    a:10,
    b:{
        // a:12,
        fn:function(){
            console.log(this.a); //undefined
        }
    }
}
o.b.fn(); // undefined
```



```js
this永远指向的是最后调用它的对象，
也就是看它执行的时候是谁调用的，
虽然函数fn是被对象b所引用，
但是在将fn赋值给变量j的时候并没有执行所以最终指向的是window

var o = {
    a: 10,
    b: {
        a: 12,
        fn: function () {
            console.log(this.a) //undefined
            console.log(this) //window
        }
    }
}
var j = o.b.fn
j()
```

```js
function foo () {
    console.log(this.a)
}
var a = 2
var obj = {
    a: 3,
    foo: foo
}
setTimeout(obj.foo, 100) // 2
```

隐式丢失

一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式。

```js
function foo () {
    console.log(this.a)
}
var obj = {
    a: 2,
    foo: foo
}
var bar = obj.foo // 函数别名！
var a = 'oops, global' // a 是全局对象的属性
bar() // "oops, global"
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

传入回调函数时：

```js
function foo () {
    console.log(this.a)
}
function doFoo (fn) {
    // fn 其实引用的是 foo
    fn() // <-- 调用位置！
}
var obj = {
    a: 2,
    foo: foo
}
var a = 'oops, global' // a 是全局对象的属性
doFoo(obj.foo) // "oops, global"
```

如果把函数传入语言内置的函数而不是传入你自己声明的函数

```js
function foo () {
    console.log(this.a)
}
var obj = {
    a: 2,
    foo: foo
}
var a = 'oops, global' // a 是全局对象的属性
setTimeout(obj.foo, 100) // "oops, global"
// JavaScript 环境中内置的 setTimeout() 函数实现和下面的伪代码类似：
function setTimeout (fn, delay) {
    // 等待 delay 毫秒
    fn() // <-- 调用位置！
}
```

默认绑定
独立函数调用。可以把这条规则看作是无法应用 其他规则时的默认规则。

```js
function foo () {
    console.log(this.a)
}
var a = 2
foo() // 2
```

在代码中，foo() 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用 默认绑定，无法应用其他规则。

如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定 到 undefined：

```js
function foo () {
    'use strict'
    console.log(this.a)
}
var a = 2
foo() // TypeError: this is undefined
```

当this碰到return时

```js
function fn () {
    this.user = 'fx'
    return {}
}
var a = new fn

console.log(a.user) // undefined
======

function fn () {
    this.user = 'fx'
    return function () {
    }
}
var a = new fn

console.log(a.user) // undefined
======

function fn () {
    this.user = 'fx'
    return 1
}
var a = new fn

console.log(a.user) // fx
======

function fn () {
    this.user = 'fx'
    return undefined
}
var a = new fn
console.log(a.user) // fx
```

如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向函数的实例。

还有一点就是虽然null也是对象，但是在这里this还是指向那个函数的实例，因为null比较特殊。

```js
function fn () {
    this.user = 'fx'
    return null
}
var a = new fn
console.log(a.user) // fx
```

题1

```js
var x = 10
var obj = {
    x: 20,
    f: function () {
        console.log(this.x) // 20
        function foo () {
            console.log(this.x)
        }
        foo()  // 10 默认绑定,这里this绑定的是window
    }
}
obj.f()
```

题2

```js
function foo (arg) {
    this.a = arg
    return this
}
var a = foo(1)
var b = foo(10)
console.log(a.a) // undefined 
console.log(b.a) // 10
```

foo(1)执行，应该不难看出是默认绑定吧 , this指向了window，函数里等价于 window.a = 1,return window;
var a = foo(1) 等价于 window.a = window , 很多人都忽略了var a 就是window.a?，将刚刚赋值的 1 替换掉了。
所以这里的 a 的值是 window , a.a 也是window ， 即window.a = window ; window.a.a = window;
foo(10) 和第一次一样，都是默认绑定，这个时候，将window.a 赋值成 10?，注意这里是关键，原来window.a = window ,现在被赋值成了10，变成了值类型，所以现在 a.a = undefined。(验证这一点只需要将var b = foo(10);删掉，这里的 a.a 还是window)
var b = foo(10); 等价于 window.b = window;
本题中所有变量的值，a = window.a = 10 , a.a = undefined , b = window , b.a = window.a = 10;
题3

```js
var x = 10
var obj = {
    x: 20,
    f: function () {
        console.log(this.x)
    }
}
var bar = obj.f
var obj2 = {
    x: 30,
    f: obj.f
}
obj.f() // 20
bar() // 10
obj2.f() // 30
```

题4

```js
function foo () {
    getName = function () {
        console.log(1)
    }
    return this
}
foo.getName = function () {
    console.log(2)
}
foo.prototype.getName = function () {
    console.log(3)
}
var getName = function () {
    console.log(4)
}
function getName () {
    console.log(5)
}
foo.getName()                // ?
getName()                    // ?
foo().getName()              // ?
getName()                    // ?
new foo.getName()            // ?
new foo().getName()          // ?
new new foo().getName()      // ?
```

答案：2 4 1 1 2 3 3 
详解

```js
function foo () {
    getName = function () { // 这里的getName将创建到全局window上
        console.log(1)
    }
    return this
}
foo.getName = function () { // 这个getName和上面的不同，是直接添加到foo上的
    console.log(2)
}
foo.prototype.getName = function () { // 这个getName直接添加到foo的原型上，在用new创建新对象时将直接添加到新对象上
    console.log(3)
}
var getName = function () { // 和foo函数里的getName一样, 将创建到全局window上
    console.log(4)
}
// 同上，但是这个函数不会被使用，因为函数声明的提升优先级最高，所以上面的函数表达式将永远替换这个同名函数，除非在函数表达式赋值前去调用getName()，但是在本题中，函数调用都在函数表达式之后，所以这个函数可以忽略了
function getName () {
    console.log(5)
}
```

通过上面对 getName的分析基本上答案已经出来了

foo.getName (); // 2

getName ();  // 4  这里涉及到函数提升的问题，不知道的小伙伴只需要知道 5 会被 4 覆盖，虽然 5 在 4 的下面，其实 js 并不是完全的自上而下

foo().getName (); // 1 这里的foo函数执行完成了两件事, 1. 将window.getName设置为1,返回window , 故等价于 window.getName(); 输出 1

getName (); // 1刚刚上面的函数刚把window.getName设置为1,故同上 输出 1

new foo.getName (); // 2 new 对一个函数进行构造调用 , 即 foo.getName ,构造调用也是调用啊  该执行还是执行，然后返回一个新对象，输出 2 (虽然这里没有接收新 创建的对象但是我们可以猜到，是一个函数名为 foo.getName 的对象  且__proto__属性里有一个getName函数，是上面设置的 3 函数)

new foo().getName ();// 3 这里特别的地方就来了,new 是对一个函数进行构造调用,它直接找到了离它 最近的函数,foo(),并返回了应该新对象,等价于 var obj = new foo();obj.getName(); 这样就很清晰了,输出的是之前绑定到prototype上的 那个getName  3 ,因为使用new后会将函数的prototype继承给 新对象

new new foo().getName (); // 3 让我们来分解一下： var obj = new foo();  var obj1 = new obj.getName();  好了，仔细看看, 这不就是上两题的合体吗,obj 有getName 3, 即输出3 obj 是一个函数名为 foo的对象,obj1是一个函数名为obj.getName的对象
