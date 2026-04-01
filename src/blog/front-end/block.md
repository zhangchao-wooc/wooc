---
title: 一道关于 ‘区块’ 的题目
theme: condensed-night-purple
meta:
  - name: description
    content: javascript 一道关于 ‘区块’ 的题目
  - name: keywords
    content: 区块、作用域、作用域链、变量提升、严格模式、ES6、wooc
createTime: 2022 年 3 月 15 日
updateTime: 2022 年 4 月 1 日
---

# 一道关于 ‘区块’ 的题目
最近一个交流群里发出的一个前端面试题，大家都在讨论这种现象的原因，我也比较感兴趣就去了解了一下这题相关的一些定义，蛮有意思🤡。

<br>

## 开始解题

<br>

### 题目
```javascript
// 大家可以先看下结果，然后再运行🤖
var a = 0

if(true){
  a = 1
  function a () {}
  a = 21
  console.log(a);
}
console.log(a);

// 安装正常逻辑看 if（true） 形成了一个区块，function a () {}
// 也因为函数声明会有提升，相当于在区块顶部 let a = function a () {}
// 这时候所有对于 a 的操作都应该是在区块内起作用，
// 内部 log 输出：21
// 外部 log 输出：0
// 然而并不是，具体执行顺序、结果、原因继续向下看

```

<br>

### Debug👨‍💻‍
遇到什么执行问题都不如直接执行一个 Debug 来的得快

![1.gif](/src/blog/front-end/img/block/1.gif)

#### 结果
非严格模式下的输出结果为：21、1。🤔

严格模式下输出结果为：21、0。🤔


<br>

### 解题
  了解这题前先了解以下几点

#### 变量提升、函数提升👆
发生在其自身所在区块中的函数提升级别更高

  >MDN：https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting
 
#### 区块💁
es6 提出的
区块内是否执行分为隐式和显示的声明 如 if（true）则会生成并解析区块，如 if（false） 则不会生成区块、不会解析内容。但是，这种声明方式在不同的浏览器里可能有不同的效果。因此，不应该在生产环境代码中使用这种声明方式。
>ES6区块：https://es6.ruanyifeng.com/#docs/let#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F
>
>MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function
>
>MDN:https://developer.mozilla.org/zh-CN/docs/Glossary/Block/Scripting

#### 执行模式🏃‍♂️
  
在区块的定义只建议在ES6及以上的严格模式下使用，而**非严格模式下就一个建议：不要使用，因为表现很奇怪。**

>MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions

 在非严格模式下：区块内的 '常量和函数' 会影响上层同名的常量、函数。在严格模式下：区块内的 '常量' 会影响上层同名的常量、函数且**会逐级向上影响**。
>MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block
  
#### 执行顺序🤏

  (1)首先这是在非严格模式下，这是一个非常重要的前提。

  (2)函数声明同时也创建了一个和函数名相同的变量。在这个位置形成了一个块级的变量 a
  
  (3)a = 1 修改块内 a，function a(){} 时将全局 a = 1
  
  (4)a = 21 时修改的是区块内的 a, log 区块内的 a 输出 21，该区块执行完毕，出栈销毁
  
  (5)log 全局的 a 输出 1，执行完毕


<br>

# 为什么是这个结果？🤷

其实我和同事对这个问题进行了激烈的讨论，最后结合 MDN、阮一峰的ES6入门 和 同事找的到的一篇貌似是这个题目的原出处的文章解解释了这个问题👇

>貌似原题：https://stackoverflow.com/questions/58619924/function-declaration-in-block-moving-temporary-value-outside-of-block/58620404#58620404
>
>MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions#%E5%9D%97%E7%BA%A7%E5%87%BD%E6%95%B0
>
>阮一峰的ES6：https://es6.ruanyifeng.com/#docs/let#%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F

<br>

## 我综合资料得出以下结论👽

1、ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。虽然这种写法是违法的，但是👀，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数。

2、ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于`let`，在块级作用域之外不可引用。显然会对老代码产生很大影响。💅为了减轻因此产生的不兼容问题，ES6 在[附录 B](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics)里面规定，浏览器的实现可以不遵守上面的规定，有自己的[行为方式](https://stackoverflow.com/questions/31419897/what-are-the-precise-semantics-of-block-level-functions-in-es6)。

-   允许在块级作用域内声明函数。
-   函数声明类似于`var`，即会提升到全局作用域或函数作用域的头部。
-   同时，函数声明还会提升到所在的块级作用域的头部。

注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作`let`处理。

**这就解释了为什么执行 function a(){} 时会改变全局的 a 变量**

**考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。**

另外，还有一个需要注意的地方。**ES6 的块级作用域必须有大括号**，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

**想要更细的了解，建议去看上方提供的三篇文章**👆👆👆

<br>

# 结语


不要在非严格模式下用区块，产生的古怪现象很多，不值得去探究结果，因为官方就很不建议你用。了解产生这个现象的原因还是很有意思的。出这个题的人也是骚~~~~🤏🤏🤏



