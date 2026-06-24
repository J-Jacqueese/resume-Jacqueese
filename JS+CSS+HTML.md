# JavaScript

##  事件冒泡和事件捕获? 事件是什么？事件模型？

- <u>事件定义</u>：事件是`用户操作网页时发生的交互动作`，比如 click/move，事件除了用户触发的动作外，还可以是`文档加载，窗口滚动和大小调整`。事件被封装成一个 event 对象，包含了该事件发生时的所有相关信息event 的属性）以及可以对事件进行的操作（event 的方法)。
- <u>事件模型</u>：`事件捕获->事件触发->事件冒泡`
- *分类：*
- DOMO 级事件模型，这种模型不会传播，所以没有事件流的概念，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过js 属性来指定监听函数。所有浏览器都兼容这种方式。直接在dom对象上注册事件名称，就是DOMO写法。
- IE 事件模型，在该事件模型中，一次事件共有两个过程，事件处理阶段和事件冒泡阶段。`事件触发`阶段会首先`执行目标元素绑定的监听事件`。然后是`事件冒泡`阶段，冒泡指的是事件`从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数`，如果有则执行。这种模型通attachEvent 来添加监听函数，可以添加多个监听函数，会按顺序依次执行。
- `DOM2 级事件模型`，在该事件模型中，一次事件共有三个过程，第一个过程是`事件捕获`阶段。捕获指的是`事件从 document 一直向下传播到目标元素`，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模型，事件绑定的函数是addEventListener，其中第三个参数可以指定事件是否在捕获阶段执行。
- *优化：*
    - `事件委托`：`利用事件冒泡机制`，`通过父元素元素的监听事件控制子元素的事件`，可以减少事件处理程序的数量，提高性能和内存利用率。
    - 特点(优点)：减少内存消耗、动态绑定子元素的事件
    - 缺点：
        - focus、 blur 之类没有事件冒泡机制，所以无法实现事件委托：
        - mousemove、 mouseout 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托的。

- 优化：
    - 只在必须的地方，使用事件委托，比如：`ajax 的局部刷新区域`
    - 尽量的`减少绑定的层级`，不在 body 元素上，进行绑定
    - `减少绑定的次数`，如果可以，那么把多个事件的绑定，合并到一次事件委托中去，由这个事件委托的回调，来进行分发。
    - `节流和防抖`：对于一些频繁触发的事件（如滚动、调整窗口大小等），可以使用节流和防抖技术来控制事件处理程序的执行频率，以减少不必要的计算和操作。
    - `事件代理库`：有一些优化过的事件代理库可用于更好地管理和处理事件，如`jQuery、Lodash`等。这些库提供了方便的事件处理方法和工具，可以简化事件管理，并提供性能优化。
- 阻止事件冒泡：
    - 普通浏览器使用：event.stopPropagation()
    - IE浏览器使用：event.cancelBubble = true;

## DOM和BOM

![Image.png](/Users/lucismarvin/Desktop/简历+资料/面试/前端面经.assets/Image (22).png)

**DOM和BOM的区别：**

- DOM ：`文档对象模型`，它指的是把文档当做一个对象(处理网页的方法和接口)
- BOM：`浏览器对象模型`，把浏览器当做一个对象(与浏览器进行交互的方法和接口)，BOM的`核心是 window`（js访问浏览器的接口+全局对象）

**DOM的事件模型和事件机制：**

- 事件模型：
- `事件：`浏览器中发生的一些动作（鼠标点击、键盘输入）
- `事件目标：`接收事件的 DOM 元素，也称事件源（可以是文档、窗口、元素或者其他对象）
- `事件处理函数：`处理事件的函数
    - `捕获阶段`：事件从文档根节点向事件目标传递，依次触发每个祖先元素的事件处理函数。
    - 可以被中断：方法：stopPropagation()
    - 场景：在事件处理函数中使用 preventDefault() 方法可以阻止默认的事件行为，例如*阻止链接跳转、表单提交*等。
    - `目标阶段`：事件到达事件目标，触发事件处理函数。
    - `冒泡阶段`：事件从事件目标向文档根节点传递，依次触发每个祖先元素的事件处理函数。可以被中断：同上

**DOM常见操作，怎么绑定事件：**

*操作：*

- 获取元素：getElement：ById、ByClassName、ByTagName、querySelector、querySelectorAll
- 修改元素：innerHTML、setAttribute、createElement(创建)
- 添加删除元素：append、remove

*绑定事件：*

- 直接在元素标签上绑定事件
- 使用js为元素添加事件监听

## ⭐️**数据类型划分：**

- 基本数据类型：`Number、String、Boolean、Null、Undefined、Symbol(全局变量冲突)、BigInt`
- 引用数据类型：`Object（Array、Date、Function、Map、RegExp等)`

## ⭐️**基本数据类型和引用数据类型的区别**

|                             | **基本数据类型**                             | **引用数据类型**                                   |
| --------------------------- | -------------------------------------------- | -------------------------------------------------- |
| 赋值                        | 赋 **值**                                    | 赋 **引用（内存地址、对象）**                      |
| 比较                        | 比较 **值** 是否相等                         | 比较 **引用** 是否指向同一对象                     |
| 函数传参（值传递/引用传递） | 函数操作 **不影响实参的值**                  | 函数操作 **会影响实参的值**                        |
| 存放位置、大小、形式        | **栈内存**，占用空间小，先进后出、**值拷贝** | **堆内存**，占用空间大，需要引用访问、**引用拷贝** |

## **Null和Undefined区别**

- `undefined` 代表的含义是`未定义`，`null` 代表的含义是`空对象`。
- <u>type of null = object</u>：`null的类型标签也是000，和Object的类型标签一样。`
- <u>安全获得undefined的值</u>：`void 0`(void __ 没有返回值)
- null转数字=0，转字符串为“null”
- undefined转数字为NaN，字符串转“undefined”

## **BigInt出现的原因**

- Number类型`最大安全整数为2*53-1`(`Number.MAX_SAFE_INTEGER`IEE754双精度浮点数，浮点数(使用字面量定义即可)),`超过范围的数字会出错/不准确`

## ⭐️**数据类型检测**

- ***typeof***：`判断基本的数据类型`，其中<u>数组、对象、null都会被判断为object</u>（null 底层是 null 指针历史遗留bug，判断 null 用=== ），其他判断都正确。
- ***instanceof***: 可以`正确判断引用的类型，无法判断基本数据类型`，其内部运行机制是`判断在其原型链中能否找到该类型的原型`。
    - 原理：判断`构造函数的 prototype 属性是否出现在对象的原型链中`
    
    - ```js
      function myInstanceof(left, right) {
        // 获取对象的原型
        let proto = Object.getPrototypeOf(left);
        // 获取构造函数的 prototype 对象
        let prototype = right.prototype;
        // 判断构造函数的 prototype 对象是否在对象的原型链上
        while (true) {
          if (!proto) return false;
          if (proto === prototype) return true;
          // 继续往上查找原型链
          proto = Object.getPrototypeOf(proto);
        }
      }
      function Person(name) {
        this.name = name;
      }
      // 用例
      const person = new Person("John");
      
      console.log(myInstanceof(person, Person)); // true
      console.log(myInstanceof(person, Object)); // true
      console.log(myInstanceof(person, Array));  // false
      ```
    
    - 
- ***constructor***:
    - `判断数据的类型`：Number、String、Boolean、Array、Function、Object
    - 对象实例.constrcutor访问它的构造函数、如果创建一个对象来改变它的原型，`constructor`就不能用来判断数据类型了：
- ***Object.prototype.toString.call()***:Object对象的原型方法
- 为什么不能用实例.toString？：因为toString是Object的原型方法，而`Array、function等类型作为Object的实例，都重写了toString方法`。`先调用重写方法，再去找原型方法（原型链）。`

## 数组

### **JavaScript 类数组对象的定义？**

- 定义：拥有 `length 属性`和若干`索引属性`的对象就可以被称为类数组对象
- 类数组转数组：
  - Array.prototype.slice.call(arrayLike)
  - Array.prototype.splice.call(arrayLike,0);
  - Array. prototype.concat.apply( [], arrayLike);
  - Array. from(arrayLike)；
  - 展开运算符

### **数组方法？**

- **迭代方法：**forEach（返回 undefined、无返回值操作、不可以链式调用）、map（返回新数组、数据转换、可以链式调用）、filter、reduce（需要提供初始值，空数组直接使用会异常）、some、every
- **修改原数组**：push、pop(返回被删元素)、unshift(返回数组长度)、shift(返回被删元素)、splice（修改原数组）、reverse、sort、splice
  - 避免直接在 React State 使用。创建新状态首选。
- **返回新数组**：slice、concat、map、filter、flatMap、reduce、from
- **其他数组方法：**find、findIndex、incudes、join、reverse、indexOf、lastIndexOf

### **数组去重方法：**

- ES6:Set
- 遍历原数组，includes/indexOf判断新数组有没有
- 排序后相邻去重
- Map
- reduce和indexOf

### **判断是否是数组**：

- ES6：`Array.isArray()`
- 最精确：`Object.prototype.toString.call()`
- 原型链：`obj._proto==Array.prototype`
- `instance of`
- Array.prototype.isPrototypeof

## 对象

### 遍历对象（for in/Object.keys()/Reflect.ownKeys()）

**Object.keys()**：只返回**自身可枚举**的字符串属性（没有原型链）

**forin**：遍历**自身及原型链**上的**可枚举**字符串属性（不支持 Symbol）

**Object.getOwnPropertyNames** ：返回自身的全部字符串属性（含不可枚举）

**Object.getOwnPropertySymbols**：返回自身的全部 SYMBOL 属性
**Reflect.ownKeys（底层）**：返回自身的所有属性，不问出处（不返回原型链）

### **for..in和for...of的区别**

- 区别： for...of遍历含有iterator的数据结构
- 对象：
  - `for..of 遍历对象报错`，`for..in` 获取的是`对象的键`；
  - `for..in` 会`遍历对象的整个原型链`，性能非常差不推荐使用, 配合 hasOwnProperty 使用，而 `for…of 只遍历当前对象`不会遍历原型链；
- 数组：
  - `for..in` 会返回数组中`所有可枚举的属性`(包括原型链上可枚举的属性)，`for..of` 只返回数组的`下标+属性值`；
- 总结：for..in 循环主要是为了遍历对象而生，不适用于遍历数组；for..of 数组、类数组对象，字符串、Set、 Map 以及 Generator 对象。

**如何使用for..of遍历对象？**

- 如果需要遍历的对象是类数组对象，用Array.from转成数组即可。
- `给对象添加一个[Symbol.iterator]属性`

### **判断是否是空对象**：

- `JSON.stringify(0bj) ==‘{}'`
- 判断键的长度:Object.keys(Obj).length<0

### **判断一个对象是否属于某个类？**

- instanceof
- 对象的 constructor
- Object.prototype.toString()

### Map和Object的区别？

|          | **Map**                                         | **Object**                                     |
| -------- | ----------------------------------------------- | ---------------------------------------------- |
| 意外的键 | 默认不包含任何键，只包含显式插入的键            | 有原型，原型链上的键可能与对象自身的键产生冲突 |
| 键的类型 | 键可以是任意值，包括 `函数、对象、任意基本类型` | 键必须是 `String` 或 `Symbol`                  |
| 键的顺序 | `有序`，迭代时按插入顺序返回键值                | `无序`                                         |
| Size     | 可直接通过 `size` 属性获取键值对个数            | 需手动计算：`Object.keys(obj).length`          |
| 迭代     | `可直接迭代`，支持 `for...of`                   | 需先获取键再迭代                               |
| 性能     | 频繁增删键值对时表现更好                        | 频繁增删键值对未优化                           |

### Set、Map、weakMap、weakSet

**Set和Map：**

- **Set**:Set是一种`无序且不重复的集合`，它的成员唯一且不可重复。可以用于去重、查找和过滤数据等操作。
- **Set API**：
  - add(value)：向集合中添加一个新元素
  - delete(value)：从集合中删除一个元素
  - has(value)：判断集合中是否包含某个元素
  - clear()：清空集合中的所有元素
  - size：获取集合中元素的数量。
  - Map是一种`键值对的集合，它的键唯一且不可重复`。不使用不可以被回收掉,可以用于存储和管理数据、快速查找和更新数据等操作 `任意键类型`
- **Map API**：
  - set(key, value)：向Map中添加一个新的键值对
  - get(key)：获取指定键对应的值
  - delete(key)：从Map中删除指定键的键值对
  - has(key)：判断Map中是否包含指定键的键值对
  - clear()：清空Map中的所有键值对
  - size：获取Map中键值对的数量。

Set和Map都是*可迭代的对象*，支持for each和for of遍历

**weakMap, weakSet 和 weakRef**：

- weakMap: WeakMap 对象包含键/值对,但其中的键key只能是弱引用（对象，null除外）的,即可被垃圾回收器回收(<u>不使用就被回收掉</u>)，不可迭代。
- weakSet: WeakSet 对象包含值为弱引用的元素,其元素是不可枚举(遍历)的。
- weakRef: 弱引用,对象的生命周期不受该引用的影响。弱引用主要用于缓存,不影响对象生命周期。

## 常见题目（隐式转换）

- **['1', '2', '3'].map(parseInt)**： 结果 ` [1, NaN, NaN]` 原因：ParseInt的进制转换问题
- **parseInt('1', 0)**; // radix为0时，使用默认的10进制。
- **parseInt('2', 1)**; // radix值在2-36，无法解析，返回NaN
- **parseInt('3', 2)**; // 基数为2，2进制数表示的数中，最大值小于3，无法解析，返回NaN
- +运算符
    - 1+‘2’ //“12”
    - true+true //2 1+1
    - 1+null //1 （1+0）
    - 1+undefined // NaN（1+NaN）

- **0.1+0.2!==0.3**？:
    - `计算二进制和再转化成十进制和`，会出现0.30000000004
    - `解决：.toFixed(2)/0.1+0.2-0.3<Number.EPSILON是否成立即可`
- **type of NAN**：`number`
    - NaN：not a number
- `NaN == NaN // true`
- **isNaN 和 Number.isNaN 函数的区别？**
    - isNaN: 先参数转数字，非数字，或者不能被转换数字都返回true
    - **Number.isNaN**：先判断数字，再继续判断NaN
- **以下转boolean均为false**
    - undefined、null、false、+0、-0 和 NaN、”“
- **Object.is() 与比较操作符”==“，”===“的区别？**
    - ”==“：**强转再比较类型**（宽松相等、类型不同时，会先转换类型、再比较值、转换规则复杂，易出错）
      - null == undefined // true
      - boolean == any //true
      - string == number //true
      - boolean == any // []==![] ==> 0=0 []先转字符串
    - ”===“：**直接比较类型**（严格相等、类型相同、值相同、从不进行类型转换）
    - Object.is：和”===“相同，但-0!==+0, NaN===NaN

## ES6新增特性

- let、const来定义变量
- 解构赋值(数组对象)
- 箭头函数
- Promise
- 模版字符串
- 新的数据结构：Set、Map

## ⭐️ let、const、var的区别？

var 函数作用域/全局作用域，let 块级作用域（解决了 var 在if/for 中变量泄露的问题）

var：变量提升（Hoisting）声明前可访问，值为undefined，let / const：存在暂时性死区 （TDZ）声明前访问，直接抛出ReferenceError

var：可重复声明，可重新赋值 Let：不可重复声明，可重新赋值   const：不可重复声明，不可重新赋值
• 加分点：解释 const 对引用类型（对象/数组）的含义

**全局变量 Var出现的问题**：

1. **命名冲突**：
2. **安全性问题**：全局变量可以被任何函数和模块访问和修改，可能被恶意代码滥用，从而导致程序的安全性问题。
3. **可维护性问题**：全局变量很难跟踪和维护，尤其是在大型项目中，可能会出现全局变量过多、命名混乱、互相依赖等问题。
4. **性能问题**：全局变量的访问速度比局部变量慢，因为全局变量需要在作用域链中查找，而局部变量则可以直接访问。

| **区别**               | **var** | **let** | **const** |
| -------------------- | ------- | ------- | --------- |
| 是否有 `块级作用域`          | ×       | ✔️      | ✔️        |
| 是否存在 `变量提升`          | ✔️      | ×       | ×         |
| 是否添加为全局属性            | ✔️      | ×       | ×         |
| 能否 `重复声明变量`          | ✔️      | ×       | ×         |
| 是否存在 `暂时性死区`（先声明后使用） | ×       | ✔️      | ✔️        |
| 是否必须设置 `初始值`         | ×       | ×       | ✔️        |
| 能否改变指针指向             | ✔️      | ✔️      | ×         |

## 为什么需要块级作用域？

ES5 只有**全局作用域和函数作用域**，没有块级作用域，这带来很多不合理的场景：

- 内层变量可能会覆盖外层变量
- 用来计数的循环变量泄露为全局变量

IIFE:立即执行函数表达式：用于创建私有作用域，避免全局污染。

**let 实际上为 JavaScript 新增了块级作用域。**块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了。

## 函数能不能在块级作用域之中声明？

ES5 规定，**函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。**但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面**两种情况实际都能运行**，不会报错。

ES6 引入了块级作用域，**明确允许在块级作用域之中声明函数**。ES6 规定，块级作用域之中，函数声明语句的行为类似于let，**在块级作用域之外不可引用**。

如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录 B里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

- 允许在块级作用域内声明函数。
- 函数声明类似于 var，即会提升到全局作用域或函数作用域的头部。
- 同时，函数声明还会提升到所在的块级作用域的头部。

## 什么是 DOM 和 BOM？

- `DOM` 指的是`文档对象模型`，它指的是把文档当做一个对象，这个对象主要定义了处理网页内容的方法和接口。
- 常见DOM操作：
- DOM 节点的获取：getElementById、 getElementsByTagName、getElementsByClassName、querySelectorAll
- DOM 节点的创建：createElement、.appendChild
- DOM 节点的删除：.removeChild
- 修改 DOM 元素：.insertBefore
- `BOM` 指的是`浏览器对象模型`，它指的是把浏览器当做一个对象来对待，这个对象主要定义了与浏览器进行交互的法和接口。`BOM的核心是 window`，而 window 对象具有双重角色，它既是通过 js 访问浏览器窗口的一个接口，又是一个 Global（全局）对象。这意味着在网页中定义的任何对象，变量和函数，都作为全局对象的一个属性或者方法存在。window 对象含有 location 对象、navigator 对象、screen 对象等子对象，并且 DOM 的最根本的对象 document 对象也是 BOM 的 window 对象的子对象。

## 纯函数、副作用与函数式编程、函数组合、函数记忆化

**纯函数：**满足两个条件： 1给定相同输入 2.总是返回相同输出 并且： 执行过程中没有任何可观察的副作用

**副作用：**指函数执行时除了返回显而易见的计算结果外，还对外部世界产生了可观察的影响是不可
避免的，但应被控制和隔离。

**函数式编程：**一种编程范式，倡导使用纯函数、最小化副作用、避免状态改变，提升代码的可测试性、可
预测性和可维护性。

**函数组合**：将多个函数连接起来，创建一个新的函数。前一个输出作为后一个输入，形成处理链条

1. Compose函数：从右到左函数依次执行
2. Pipe

函数记忆化：一种优化技术，缓存函数调用结果，**相同输入 返回缓存结果**，避免重复计算(memoize原理 cache 缓存命中)

## ⭐️深、浅拷贝？

- **深、浅拷贝定义**：创建一个新的对象或数组（引用类型），在内存中新开辟存放空间
- **浅拷贝**:`复制了原始对象或数组的引用，复制简单数据类型和复杂数据类型的引用`。也就是只能遍历复制第一层，复制复杂数据类型的指针，修改newobj也会改变oldobj
    - *实现*：<u>Object.assign()、...扩展运算符</u>
- **深拷贝**：其中包含原始对象或数组的所有值和属性的副本。对所有类型元素进行深度遍历复制。`创建一个新对象 , 递归地复制所有层级的属性所有引用类型属性都会被重新创建,新旧对象 完全独立，互不干扰`
    - *注意*：需要考虑函数、正则、日期、ES6新对象、需要考虑循环引用问题
- ***实现*：**
    - **JSON**：JSON.stringify() 和 JSON.parse()、有很多坑
        - 忽略 undefined
        - 忽略 Symbol
        - 忽略 Function
        - Date 对象会变成字符串
        - 无法处理循环引用（会报错）
    - **第三方库**，Lodash库的 _.cloneDeep()
        - *缺点*：不能复制函数或循环引用、Date会转化为字符串、Set会转化为{}、忽略Undefined值
    - structuredClone（推荐）：原生 API ，无限嵌套的对象和数组、循环引用、 JavaScript 类型，**不能拷贝函数和方法、Dom、对象原型**

**拷贝的意义**

- **避免意外的副作用**
  - 修改副本时，不污染原始数据
- 实现状态的不可变性
  - React/Vue 等框架的核心机制
- **隔离数据**
  - 创建完全独立的数据快照

**手写深拷贝**

```js
1.处理边界：如果是 null或非 object 类型，直接返回。
2.处理循环引用：用WeakMap存储已拷贝过的对象，避免死循环。
3.创建新容器：判断是数组还是对象，创建对应的空容器［］或你。
4.递归拷贝：遍历原始对象的属性，递归调用deepClone 赋值给新容器。
function deepClone(obj, hash = new WeakMap()) {
    // 1. 处理边界：如果是 null 或非 object 类型，直接返回该值。
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 2. 处理循环引用：如果已经拷贝过该对象，直接返回拷贝结果。
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    // 3. 创建新容器：判断是数组还是对象，创建对应的空容器
    let cloneObj = Array.isArray(obj) ? [] : {};
    // 将当前对象存入哈希表，以处理循环引用
    hash.set(obj, cloneObj);
    // 4. 递归拷贝：遍历原始对象的属性，递归调用 deepClone 赋值给新容器
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloneObj[key] = deepClone(obj[key], hash);
        }
    }
    return cloneObj;
}
// 示例用法
const obj = {
    name: 'Alice',
    age: 30,
    hobbies: ['reading', 'gaming'],
    address: {
        city: 'New York',
        zip: '10001'
    }
};
const clonedObj = deepClone(obj);
console.log(clonedObj);

```



## 防抖和节流？(HOF 高阶函数)

- 防抖：函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。
    - 短时间内事件触发次数过多，抖的时候不执行函数，不抖的时候再执行函数(延迟)
    
- 应用：这可以使用在一些点击请求的事件上，`避免因为用户的多次点击向后端发送多次请求`。
    - 监听事件：表单输入
    - 执行函数：搜索
    - 拖拽事件
    
- 手写
  
    ```js
    • 设定一个延迟时间（delay）
    • 使用 setTimeout 创建一个定时器
    • 每次事件触发时，清除之前的定时器
    • 然后重新设置一个新的定时器
    function debounce(func, delay) {
        let timer; // 定义一个定时器变量
        return function (...args) {
            const context = this; // 保存上下文
            // 清除上一个定时器
            clearTimeout(timer);
            // 设置一个新的定时器
            timer = setTimeout(() => {
                func.apply(context, args); // 以上下文和参数调用原函数
            }, delay);
        };
    }
    ```
    
- 节流：规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。
  
    - `指定的时间间隔内函数只执行一次称为节流 `
    - 核心：控制事件触发频率
    
- 应用：节流可以使用在 scroll 函数的事件监听上，通过事件节流来`降低事件调用的频率。`
    - 监听事件：鼠标移动（Scroll）
    - 执行函数：输出坐标
    - 输出量过于庞大，页面卡顿
    
- 手写
  
    ```js
    • 设定一个固定的时间间隔（delay）
    • 记录上次事件触发的时间
    • 每次事件触发时，检查当前时间
    • 如果当前时间 - 上次时间>= delay，则执行回调
    function throttle(func, delay) {
        let lastTime = 0; // 上一次调用的时间戳
        return function (...args) {
            const context = this; // 保存上下文
            const now = Date.now(); // 获取当前时间
            // 检查距离上次调用是否经过了足够的时间
            if (now - lastTime >= delay) {
                lastTime = now; // 更新上次时间为当前时间
                func.apply(context, args); // 使用上下文和参数调用函数
            }
        };
    }
    ```
    
    

## JavaScript内置全局对象？

- **值属性**，这些全局属性返回一个简单值，这些值没有自己的属性和方法。
    - 例如 Infinity、 NaN、 undefined、 null 字面量
- **函数属性**，全局函数可以直接调用，不需要在调用时指定所属对象，执行结束后会将结果直接返回给调用者。
    - 例如 eval()、 parseFloat(、 parselnt() 等
- **基本对象**，基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。
    - 例如 Object、 Function、 Boolean、 Symbol、 Error 等
- **数字和日期对象**，用来表示数字、日期和执行数学计算的对象。
    - 例如 Number、 Math、 Date
- **字符串**，用来表示和操作字符串的对象。
    - 例如 String、 RegExp
- **可索引的集合对象**，这些对象表示按照索引值来排序的数据集合，包括数组和类型数组，以及类数组结构的对象。
    - 例如 Array
- **使用键的集合对象**，这些集合对象在存储数据时会使用到键，支持按照插入顺序来迭代元素。
    - 例如 Map、 Set、 WeakMap、 WeakSet
- **矢量集合**，SIMD 矢量集合中的数据会被组织为一个数据序列。
    - 例如SIMD 等
- **结构化数据**，这些对象用来表示和操作结构化的缓冲区数据，或使用 JSON 编码的数据。
    - 例如 JSON 等
- **控制抽象对象**
    - 例如 Promise、 Generator 等
- **反射**
    - 例如 Reflect、 Proxy
- **国际化**，为了支持多语言处理而加入 ECMAScript 的对象。
    - 例如 Intl、 Intl.Collete生
- WebAssen、arguments

## 前端跨⻚⾯通信

**前端跨⻚⾯通信实现方法：**

- Cookie
- LocalStorage 和 SessionStorage
- Broadcast Channel：浏览器API，不同页面消息的广播和接收
- Window.postMessage

## Proxy与Reflect

- Proxy定义：Proxy是一个特殊的”包装器〞对象，它可以用于修改或扩展某些基本操作的行为，比如属性读取、函数调用等。这种修改或扩展的行为是`通过所谓的"traps"实现`的，这些"traps"定义了如何拦截和改变基本操作。
- 用途：
    - 数据校验：对对象的数据类型进行校验
    - 数据绑定和观察：set方法
    - 函数参数的默认值：
- Reflect定义：提供了⼀组⽤于执⾏JavaScript基本操作的⽅法，例如Reﬂect.get()、Reﬂect.set() 等 。这些⽅法与 proxy的 traps⼀⼀对应。 这 使 得 Proxy的 traps可以使⽤对应的Reﬂect⽅法来执⾏被拦截的操作 ：
- 优点：总是返回一个期望的值，使得代码更易于理解和调试。Reflect.set()可以`正确处理设置只读属性`的情况。

## ⭐️作用域链/闭包

## 执行上下文

### 表现

javaScript 引擎不是一行行执行的，而是一段段执行的。当执行一段代码的时候，会进行一个 **“准备工作”**，比如**变量提升**（var 声明的变量）或**函数提升**（函数表达式不会提升，函数声明可以提升），这个“准备工作”就是**构建执行上下文**。

定义：执行上下文是`JavaScript代码执行时的环境`。它包含了变量、函数声明、作用域链等信息。当⼀个`函数被调⽤时，就会创建⼀个新的执⾏上下⽂`。每 的 词 法 环 境 （ Lexical Environment） ， ⽤ 于 存 储 变 量 和 函 数 的 声 明 。然后这个新的执行上下文就会被推入执行上下文栈（先入后出）中。`函数执行完毕，其执行上下文就会从栈中弹出并销毁`。

### JavaScript 的可执行代码

- 全局代码(表达式,赋值语句等)
- 函数代码
- eval代码

JS 引擎在解释代码时，最先遇到全局代码，所以初始化的时候首先就会向执行上下文压入全局执行上下文(globalContext)，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前，**ECStrack 底部永远有一个 globalContext**。

`当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。（堆栈处理）`

- 创建阶段，执行上下文会创建变量对象（VO），建立作用域链（scope chain），以及确定 this 的指向
- 代码执行阶段，创建完成后，才会开始执行代码，这个过程就是变量赋值（AO），函数引用，以及执行其他代码

### 变量对象

1. 全局上下文的变量对象初始化是 **全局对象**。
2. 函数上下文的变量对象初始化 **只包括 Arguments 对象**。
3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值。
4. 在代码执行阶段，会 **再次修改变量对象的属性值**。
5. 在进入执行上下文时，首先会处理函数声明，其次会处理变量声明，**如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性**。
6. AO（活动对像） = VO（变量对象） + function parameters + arguments
7. AO 实际上是包含了 VO 的。因为除了 VO 之外，AO 还包含函数的 parameters，以及 arguments 这个特殊对象。也就是说 AO 的确是在进入到执行阶段的时候被激活，但是激活的除了 VO 之外，还包括函数执行时传入的参数和 arguments 这个特殊对象。
8. **同一作用域下，函数提升比变量提升得更靠前**。
9. 一个执行上下文的生命周期可以分为两个阶段:
   - **创建阶段**：在这个阶段中，执行上下文会分别创建变量对象，建立作用域链，以及确定 this 的指向。
   - **代码执行阶段**：创建完成之后，就会开始执行代码，这个时候，会完成变量赋值，函数引用，以及执行其他代码。
10. 进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。 即，函数提升优先级高于变量提升，且不会被同名变量声明时覆盖，但是会被同名变量赋值后覆盖。

### 作用域、作用域链？

每个函数都有自己的作用域及作用域链，它决定了变量的可见性。当代码执行时，会**创建一个执行上下文**（execution context-代码运行环境 包含变量、函数、this 指向等信息），其中包括一个作用域链。作用域链包含了函数的局部变量、父函数的变量，以及全局变量。**闭包因为保留了这个作用域链**，所以可以访问定义这个闭包函数时，它所在位置的外部函数的变量（词法作用域）。

**作用域：**

- **词法作用域**：因为 JavaScript 采用的是词法作用域（静态作用域），**函数的作用域在函数定义的时候就决定了**。**函数的作用域基于函数创建的位置**。**词法作用域是通过作用域链来实现的**。
- **动态作用域**：而与词法作用域相对的是动态作用域，**函数的作用域是在函数调用的时候才决定的**。
- 全局作用域：最外层函数的外层变量和最外层函数、window对象的属性、所有未定义直接赋值的变量（缺点：命名冲突）
- 函数作用域：函数内部的变量，内层作用域可以访问外层作用域变量，反之不行
- 块级作用域(在花括号里的)：let、const，被{}包裹 循环适合使用

**作用域链（单向性、从内到外、从底到上）：**作用域链是在执行上下文被创建时构建的

- 在当前作用域中变量找不到了，就去父作用域找，一直到访问到window对象终止，没有找到就报错undefined
- 作用：对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，可以访问到外层环境的变量和函数。

## 对闭包理解？

**定义与特点：**

- 定义：闭包是指有权访问另一个函数作用域中变量的函数，**闭包是指一个函数能够访问其定义时的作用域中的变量，即使在其定义的作用域已经执行完毕后。这意味着闭包可以让函数“记住”它被创建时的环境，即使它在另一个环境被调用，而这种“记住”正是通过作用域链实现**。 形式：函数嵌套函数，内部函数就是闭包（目的是通过外部函数间接访问内部函数变量，所以内部函数创建闭包。）
- 表现：一个函数记住了创建它的外部环境（作用域）。
- 特性：
    - 正常情况下：函数执行完成后，函数内部变量就会释放
    - **闭包**：内部函数没有执行完成，外部函数变量不会被销毁
- 形成：当一个内部函数，被暴露到其词法作用域之外时，闭包就形成了
- 判断： 一个函数能否访问并记住其**词法作用域外部定义的变量**，即使外部作用域的函数已执行完毕

**原理：**

函数执行分成两个阶段(预编译阶段和执行阶段)。

在**预编译阶段**，如果发现内部函数使用了外部函数的变量，则会在内存中**创建一个“闭包”对象并保存对应变量值**，如果已存在“闭包”，则只需要增加对应属性值即可。

执行完后，函数执行上下文会被销毁，函数对“闭包”对象的引用也会被销毁，但其内部函数还持用该“闭包”的引用，所以内部函数可以继续使用“外部函数”中的变量。

**利用了函数作用域链的特性**，**一个函数内部定义的函数会将包含外部函数的活动对象添加到它的作用域链中**，函数执行完毕，其执行作用域链销毁，但因内部函数的作用域链仍然在引用这个活动对象，所以其活动对象不会被销毁，直到内部函数被烧毁后才被销毁。

**用途、使用场景：**

- 创建私有变量数据封装，**延长变量的生命周期**

- **实现高阶函数（HOF）**：将A函数作为参数传给B函数，B函数内部调用A函数。

  - 比如 map 方法

- **函数柯里化**：多参数函数转换为只接受单参数函数

  - ```js
    function curry(fn, args) {
      let length = fn.length;
      args = args || [];
      return function() {
        let subArgs = args.slice(0);
        // 拼接得到现有的所有参数
        for (let i = 0; i < arguments.length; i++) {
          subArgs.push(arguments[i]);
        }
        // 判断参数的长度是否已经满足函数所需参数的长度
        if (subArgs.length >= length) {
          // 如果满足，执行函数
          return fn.apply(this, subArgs);
        } else {
          // 如果不满足，递归返回柯里化的函数，等待参数的传入
          return curry.call(this, fn, subArgs);
        }
      };
    }
    ```

- 模块化封装编程：返回暴露出去的函数

- 缓存记忆化：当输⼊相同的参数时，直接从缓存中读取结果，避免重复计算。

- 防止全局变量污染。典型应用是模块封装，在各模块规范出现之前，都是用这样的方式防止变量污染全局

- 延迟执行

**优点**：

- 变量长期存储在内存中，实现变量数据共享。
- 避免全局变量的污染。
- 把变量存到独立的作用域，作为私有成员存在。

**缺点：**

- 使用不当会很容易造成内存泄露。
- 闭包在处理速度和内存消耗方面对脚本性能具有负面影响。
- 避免：
    - **及时释放不需要的闭包变量**:在函数中及时delete不需要维持的闭包变量,避免过多的闭包变量占用内存。
    - **将闭包包装在一个立即执行的函数表达式中（IFE)**,这样就创建了一个独立的作用域,闭包变量不会污染全局作用域。
    - **避免循环中创建闭包**:在循环中创建闭包时需要特别注意,每次循环都会生成一个新的闭包,很容易造成内存泄漏。

## 内存泄漏、垃圾回收机制

#### **内存泄漏的原因**

- **意外的全局变量**：由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
- **被遗忘的计时器或回调函数**：设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。
- **脱离 DOM 的引用**：获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。
- **闭包**：不合理的使用闭包，从而导致某些变量一直被留在内存当中。

#### **垃圾回收机制**

- **垃圾回收**：JavaScript代码运行时，需要分配内存空间来储存变量和值。当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。
- **回收机制**：Javascript 具有自动垃圾回收机制，会定期对那些不再使用的变量、对象所占用的内存进行释放

#### **处理内存泄漏的方法**

- **标记清除**：变量到执行环境中就标记“进入”，此时不能被释放，离开时会标记为“离开”，从内存中释放掉
- **引用计数（闭包）**：记录每个值被引用的次数,如果一个值的引用次数是0，就表示这个值不再用到了，因此可以将这块内存释放。（容易引起循环引用，两个对象各自引用对方的属性值）

#### **检测内存泄漏**

- 在Chrome DevTools中，可以通过**Memory面板来查看JavaScript代码的内存使用情况**。如果发现某个对象的内存使用一直在增加，就可能存在内存泄漏的问题。
- Performance API中，可以使用Memory属性来查看JavaScript代码的内存使用情况。



## ⭐️对this对象的理解

- 理解：this既不指向函数自身，也不指向函数的词法作用域，是在函数被调用时发生的绑定，**指向啥完全取决于函数在哪里被调用**(**函数的调用方法的位置**)，this 是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。
- 区分方法（绑定原则、优先级高到低）：
    - ***构造器调用模式(new绑定)***：如果一个函数用 new 调用时，函数执行前会新创建一个对象，this 指向这个新创建的对象。
    - ***apply、call 和 bind 调用模式（显示绑定）***，这三个方法都可以显示改变调用函数的 this 指向。
        - apply 入参： `this 绑定的对象`，和`参数数组`，并`立即调用`。
        - call 入参：`this绑定的对象`，和`参数列举`，并`立即调用`。
        - bind入参：`this绑定的对象`，和`参数列举`，`不会立即调用`。`返回一个 this 绑定了传入对象的新函数`。这个函数的this 指向除了使用 new 时会被改变，其他情况下都不会改变。
    - ***方法调用模式(隐式绑定)***：this放在对象的方法中，**this指向调用这个方法的对象**
    - ***函数调用模式(默认绑定)***：当一个函数不是一个对象的属性时，**直接作为普通函数来调用时**，this 指向全局对象（严格模式下undefined，**setTimeout**传递普通函数this指向全局对象，箭头函数指向当前函数所在对象）。

##  ⭐️call() 和 apply()以及bind() 的区别（显示绑定）？

|                                          | **call**       | **apply**         | **bind**                                                     |
| ---------------------------------------- | -------------- | ----------------- | ------------------------------------------------------------ |
| 入参（第一个参数都是要绑定的 this 对象） | 参数枚举       | 参数数组 / 类数组 | 参数枚举                                                     |
| 是否立即调用原函数                       | 立即调用原函数 | 立即调用原函数    | 返回新函数（永久绑定 this），可稍后调用（使用 new 作为函数thisArg 会失效）<br />`底层通过将函数作为对象方法模拟this 指向` |

手写 bind

```js
在 Function.prototype 上添加方法（如 myBind）
该方法 必须返回一个新函数
新函数内部要能调用到 原函数
新函数被调用时，确保this 和参数传递正确
需要特殊处理通过 new 关键字 调用新函数的场景
Function.prototype.myBind = function(context, ...args) {
    const fn = this; // 保存原函数
    const boundFunction = function(...newArgs) {
        // 处理 new 调用的情况
        if (this instanceof boundFunction) {
            return new fn(...args, ...newArgs); // 使用 new 语法时，创建新的实例
        } else {
            return fn.apply(context, [...args, ...newArgs]); // 否则使用指定的上下文
        }
    };
    return boundFunction; // 返回新函数
};
// 测试
function greet(greeting) {
    return `${greeting}, ${this.name}!`;
}
const person = {
    name: 'Alice'
};
const boundGreet = greet.myBind(person, 'Hello');
console.log(boundGreet()); // "Hello, Alice!"
// 处理 new 调用的情况
function Person(name) {
    this.name = name;
}
const BoundPerson = Person.myBind(null); // 绑定到 null，因为 new 语法下 this 会被忽略
const alice = new BoundPerson('Alice');
console.log(alice.name); // "Alice"
```



## ⭐️箭头函数和普通函数的区别？

- 区别：`this指向不同`
    - `普通函数：谁调用这个函数，this指向谁。`
    - `箭头函数：在哪里定义的，this指向谁。`
    - 在定时器中写`普通函数，this指向windows`，箭头函数中`this指向所在上下文的this=>当前作用域的外层`
- 箭头函数特点：
    - `没有自己的this`、继承来的this指向永远不会改变。
    - call()、apply()、bind()等方法`不能改变箭头函数中this的指向`、
    - `不能作为构造函数使用`
    - `没有自己的arguments`(访问的外层的arguments使用剩余参数语法 `...args` 来访问参数)
    - `没有prototype`
    - `不能用作Generator函数，不能使用yeild关键字`
    - 箭头函数没有 super
    - 箭头函数不支持重命名函数参数，普通函数的函数参数支持重命名

## new操作符的实现原理？

- 执行过程：
  - `创建空对象`
  - `将对象的原型设置为函数的 prototype 对象`。
  - `让函数的 this 指向这个对象`，执行构造函数的代码（为这个新对象添加属性）
  - `判断函数的返回值类型`（隐式返回 this），如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

```js
function objectFactory() {
  let newObject = null;//创建一个变量 newObject 并将其初始化为 null，用于存储新创建的对象。
  let constructor = Array.prototype.shift.call(arguments);//从 arguments 对象中获取第一个参数，并将其赋值给变量 constructor。这里的目的是获取构造函数。
  if (typeof constructor !== "function") {//检查 constructor 是否为函数类型
    console.error("type error");
    return;
  }
  newObject = Object.create(constructor.prototype);//创建一个新对象，并将其原型设置为 constructor.prototype
  let result = constructor.apply(newObject, arguments);//将 this 指向新创建的对象 newObject，并调用构造函数 constructor，传递剩余的参数给构造函数。
  let flag =
    result && (typeof result === "object" || typeof result === "function");//检查 result 是否存在且为对象或函数类型。

  return flag ? result : newObject;//根据 flag 的值，如果 result 符合条件，则返回 result，否则返回新创建的对象 newObject。
}
// 定义一个构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
// 使用对象工厂函数创建对象
var person1 = objectFactory(Person, "John", 30);
// 输出对象属性
console.log(person1.name); // 输出 "John"
console.log(person1.age); // 输出 30
```



## 事件循环

**JS单线程**：一个任务结束之后才能执行另一个。等到异步任务完成再回过头处理

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(8).png" alt="Image.png" style="zoom: 50%;" />

### 事件循环定义（浏览器）

**同步和异步的区别：**

- 同步：执行请求时，如果这个请求需要等待一段时间才能返回，会一直等待下去，**直到消息返回为止再继续向下执行。**
- 异步：执行请求时，如果这个请求需要等待一段时间才能返回，**会继续往下执行，不会阻塞等待消息的返回，当消息返回时系统再通知进程进行处理。**

**事件循环定义**：`同步任务进主线程(运行栈)，异步任务进（任务队列），同步任务执行完成，异步任务推进主线程，不断重复就是事件循环。`

- 理解：因为 js是单线程运行的，在代码执行时，通过将不同函数的执行上下文压入执行栈中来保证代码的有序执行。在执行同步代码时，如果遇到异步事件，js引擎并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务。当异步事件执行完毕后，再将异步事件对应的回调加入到一个任务队列中等待执行。任务队列可以分为宏任务队列和微任务队列，当当前执行栈中的事件执行完毕后**，js引擎首先会判断微任务队列中是否有任务可以执行**，如果有就**将微任务队首的事件压入栈中执**行。当微任务队列中的任务都执行完成后再去执行宏任务队列中的任务。
- 执行顺序：`同步、process.nextTick(Node)、异步(微任务、宏任务)、setImediate(Node,当前事件循环结束时执行)`
- 宏任务：
  - **script**(整体代码)
  - **setTimeout**：delay 不是精确时间
  - **setInterval**：导致任务堆积
  - setImmediate(Node 环境)
  - **I/O，事件队列** （如fs、http等Node.js模块的回调函数）
  - UI render
  - postMessage
  - **MessageChannel**
  - **requestAnimationFrame**(用于在下一次重绘（repaint）之前更新动画，有争议，处于渲染阶段，不在微任务队列，也不在宏任务队列)

- 微任务
  - process.nextTick(Node 环境)
  - **Promise**.[ then/catch/finally ] Promise 回调
  - Async 中 Await 的回调(实际就是 promise 的回调)
  - **queueMicrotask**（一个用于在当前宏任务的事件循环结束前执行的微任务）
  - **MutationObserver**(异步监测 DOM 树的变化，并在发生变化时执行相应的操作，回调不会立即执行，而是被添加到当前宏任务的微任务队列中)

- **微任务拥有更高的优先级**，当事件循环遍历队列时，先检查微任务队列，如果里面有任务，就全部拿来执行，执行完之后再执行一个宏任务。执行每个宏任务之前都要检查下微任务队列是否有任务，如果有，优先执行微任务队列。

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(9).png" alt="Image.png" style="zoom:50%;" />

**异步任务：**宏任务和微任务，运行结构类似栈，宏任务在任务队列，微任务在事件队列，执行完宏任务清空事件队列

**核心：**同步-->所有微任务-->宏任务依次执行（单个宏任务中的同步、微任务、宏任务）-->下一个宏任务..



### NodeJS 和浏览器中的事件循环有什么区别？

**Node.js 事件循环的主要特点：**

1. **阶段性结构**： Node.js 的事件循环分为多个阶段，每个阶段都有其特定的任务队列：
    - timers：执行 setTimeout() 和 setInterval() 的回调
    - pending callbacks：执行延迟到下一个循环迭代的 I/O 回调
    - idle, prepare：仅系统内部使用
    - poll：检索新的 I/O 事件，执行 I/O 相关的回调
    - check：执行 setImmediate() 回调
    - close callbacks：执行 close 事件的回调
1. 执行顺序： Node.js 按照上述顺序依次执行每个阶段的任务，而不是像浏览器那样简单地区分宏任务和微任务。
2. process.nextTick()： 这是 Node.js 特有的函数，**其回调会在当前操作完成后立即执行，优先于其他微任务。**
3. 微任务处理： 在 Node.js 中，微任务（如 Promise 回调）会在每个阶段结束后立即执行，而不是在所有宏任务之后。
4. I/O 处理： Node.js 更加关注 I/O 操作，poll 阶段专门用于处理 I/O 回调。
5. setImmediate()： 这是 Node.js 特有的定时器函数，其回调会在 poll 阶段结束后的 check 阶段执行。
6. 可自定义性： Node.js 允许开发者通过 process.nextTick() 和 setImmediate() 更灵活地控制代码执行顺序。

这种结构使得 Node.js 的事件循环更加复杂和精细，有助于更好地处理服务器端的各种异步操作和 I/O 任务。理解这些特点对于编写高效的 Node.js 应用程序至关重要。

**Node.js 和浏览器中的事件循环主要区别：**

1. **执行环境**：
    - 浏览器主要处理 DOM 操作、用户交互和网络请求等。
    - Node.js 主要处理服务器端操作，如文件系统操作、网络通信等。
1. **事件循环的阶段**：
    - 浏览器的事件循环相对简单，主要分为宏任务和微任务两种。
    - Node.js 的事件循环更复杂，分为多个阶段（timers、pending callbacks、idle/prepare、poll、check、close callbacks）。
1. **微任务执行时机**：
    - 浏览器在每个宏任务执行完后，会清空所有微任务队列。
    - Node.js 在每个阶段结束时会执行微任务，而不是在所有宏任务之后。
1. **API 差异**：
    - 浏览器特有 API：如 setTimeout、setInterval、requestAnimationFrame。
    - Node.js 特有 API：如 setImmediate、process.nextTick。
1. **process.nextTick**：
    - Node.js 独有，优先级高于所有微任务，在每个阶段结束时立即执行。
    - 浏览器中没有对应的机制。
1. **setImmediate vs setTimeout**：
    - Node.js 中 setImmediate 在 check 阶段执行，setTimeout 在 timers 阶段执行。
    - 浏览器中没有 setImmediate，只能使用 setTimeout。
1. **I/O 处理**：
    - Node.js 更关注 I/O 操作，有专门的 poll 阶段处理 I/O 回调。
    - 浏览器主要关注用户交互和 DOM 操作，I/O 操作相对较少。
1. **任务优先级**：
    - 浏览器中，微任务总是优先于宏任务执行。
    - Node.js 中，不同阶段的任务优先级不同，process.nextTick 的优先级最高。
1. **渲染时机**：
    - 浏览器在每轮事件循环结束后可能会进行页面渲染。
    - Node.js 不涉及 UI 渲染。

## 异步编程的实现方式？

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(10).png" alt="Image.png" style="zoom:35%;" />

- 回调函数：异步实现同步效果，通过在函数中传递一个回调函数并执行
    - 问题1：多个回调函数嵌套会造成回调地狱
    - 问题2：回调会把中间的控制权交给第三方工具(AJAX)，从而调用后边代码。
- Promise对象：一定程度上解决了回调地狱问题，将嵌套的回调函数结果作为`链式调用`。
    - 问题：多个 then 的链式调用，可能会造成代码的语义不够明确。
- Generator：函数的执行过程中，将函数执行权转移出去，在函数外部将执行权转移回来。 Generator 内部对于异步操作的方式，可以以同步的顺序来书写
    - 这个函数里面都是yield语句，当使用next才会逐行执行yield语句
- async 函数：**Generator 和 Promise 实现的一个自动执行的语法糖**，当函数内部执行到一个 await 语句的时候，如果语句返回一个 promise 对象，那么函数将会等待 promise 对象的状态变为 resolve 后再继续向下执行，最后返回resolve的数据。因此可以将异步逻辑，转化为同步的顺序来书写，并且这个函数可以自动执行。
    - async 函数返回一个 Promise 对象，其return的值就是resolve的值传递的是then的形参，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。
    - await的含义为等待，也就是 async 函数需要等待await后的函数执行完成并且有了返回结果（Promise对象）之后，才能继续执行下面的代码。await通过返回一个Promise对象来实现同步的效果。
    - 后接Promise对象，等其resolve的值，阻塞后续代码
    - 后接非Promise对象，直接返回值
- 异常捕获：try-catch

## 对Promise的理解？

- Promise理解：
    - 它是一个对象，可以获取异步操作的消息。保存异步操作的结果，在任意时刻利用回调函数处理结果，解决了传统ajax回调地域。
    - 简单说就是**一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。**

![Image.png](%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(11).png)

- 优点：
    - 回调函数的指定时机更灵活
    - 支持链式调用，解决回调地狱问题**（promise.then()返回一个新的Promise实例**，回调地狱嵌套回调函数）
    
- 缺点：
    - **无法取消Promise**，一旦新建它就会立即执行，无法中途取消。
    - 如果不设置回调函数，**Promise内部抛出的错误，不会反应到外部。**
    - 当处于pending状态时，无法得知目前进展到哪一个阶段（刚开始还是即将完成）
    
- Promise的实例有两个过程（特点）：
    - pending -> fulfilled : Resolved（已完成）
    - pending -> rejected：Rejected（已拒绝）
    - 注意：一旦从进行状态变成为其他状态就永远不能更改状态了（**状态不可逆**）。
    
- 手写：
  
    - ```js
        1.定义Promise对象的三个状态、和 resolve与reject 的回调函数
        2.定义构造函数函数并传入一个函数
        3.在定义函数内分别定义resolved（修改状态pending 时才能转变、调用回调函数）和rejected方法
        4.传入函数调用(resolved,rejected)并用try-catch包含
        
        const PENDING = "pending";
        const RESOLVED = "resolved";
        const REJECTED = "rejected";
        
        function MyPromise(fn) {
          var self = this;
          // 初始化状态
          this.state = PENDING;
          // 保存 resolve 或 reject 的值
          this.value = null;
          // 保存回调
          this.resolvedCallbacks = [];
          this.rejectedCallbacks = [];
          // 状态转变为 resolved
          function resolve(value) {
            // 如果是 MyPromise 实例，等待前一个完成
            if (value instanceof MyPromise) {
              return value.then(resolve, reject);
            }
            // 放到事件循环末尾
            setTimeout(() => {
              if (self.state === PENDING) {
                self.state = RESOLVED;
                self.value = value;
                self.resolvedCallbacks.forEach(callback => callback(value));
              }
            }, 0);
          }
          // 状态转变为 rejected
          function reject(value) {
            setTimeout(() => {
              if (self.state === PENDING) {
                self.state = REJECTED;
                self.value = value;
                self.rejectedCallbacks.forEach(callback => callback(value));
              }
            }, 0);
          }
          // 执行传入的函数
          try {
            fn(resolve, reject);
          } catch (e) {
            reject(e);
          }
        }
        
        MyPromise.prototype.then = function (onResolved, onRejected) {
          // 参数可选
          onResolved = typeof onResolved === "function" ? onResolved : value => value;
          onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
        
          if (this.state === PENDING) {
            this.resolvedCallbacks.push(onResolved);
            this.rejectedCallbacks.push(onRejected);
          }
        
          if (this.state === RESOLVED) {
            onResolved(this.value);
          }
        
          if (this.state === REJECTED) {
            onRejected(this.value);
          }
        };
        ```
    
- Promise方法：
    - *resolve（）*：new Promise方法的语法糖,**立即 resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。**
    - *reject（）*：类似resolve只不过传递到then的第二个参数
    - *then()*: then方法可以接受两个回调函数作为参数。第一个resolve成功、第二个rejected失败 返回的是一个新的Promise实例。如果传递的不是函数是null/promise.resolve(),发生`穿透` ,只返回真正resolve的结果
    - *catch():* 等价于then方法的第二个参数，指向reject的回调函数。执行resolve回调函数时出现错误，不会停止运行，而是进入catch方法中。
        - 优点：能捕获到then第一个回调函数的异常
    - Promise.all：所有 Promise 全部成功时返回成功结果数组；若有一个失败则立即返回 rejected
    - Promise.allSettled：无论成功或失败，都返回每个 Promise 的状态结果数组（fulfilled 或 rejected）
    - Promise.race：无论 `fulfilled` 或 `rejected`，返回**第一个**有结果（成功或失败）的 Promise
    - Promise.any：返回**第一个 fulfilled** 的 Promise；若全部 rejected，则返回 AggregateError

**限制并发**（10 个请求只能跑三个）

1. 使用集合存储正在执行的任务：使用 Set 结构来追踪当前正在执行的 Promise，当一个 Promise 完成后，从集合中移除它

2. 任务调度：利用 Promise.race 来等待最快完成的任务。这将让我们在达到并发限制时，可以及时释放空间来执行新的任务。

3. 保证所有任务完成：在循环结束后，使用 Promise.allSettled 来确保所有尚未完成的任务都已经被处理。

## 对Generator的理解？

- 状态机，封装了多个内部状态；
- 返回一个遍历器对象，通过改对象可以一次遍历 Generator 函数内部的每一个状态
- 带 `*` (async)号，yeild(await) 表达式定义不同的内部状态；
- 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象；
- Generator 函数是分段执行的，**yield 表达式是暂停执行的标记，而 next 方法可以恢复执行**

### 为什么 Promsie 要引入微任务?

因为同步任务和宏任务都不行。

- 同步任务：难道代码执行一半去发送一个 Ajax 请求然后等待响应吗？
- 宏任务：我们知道发送 Ajax，操作 DOM，定时器都属于宏任务，假设此时我们增加了 100 个 DOM 难道等待 DOM 操作完成之后我们再来发送下一个 Ajax 请求（异步链式调用情况）？

### new Promise() 返回的实例和实例 then 方法执行后返回的 promise 是一个吗?

**实例 then 返回的是一个新的 Promise 对象**，这个新 Promsie 的状态由 then 中的返回值决定，如果 then 内部 return 一个 Promsie 对象，那么返回的 Promsie 对象状态便是 return 的 Promise 的状态，如果 return 一段字符串那么便是一个 resolve 状态的 Promsie 对象。

### promise 和 async 差异点是什么？

**async 是 Generator 函数的语法糖，不同的是 Generator 函数是手动调用的，而 async 函数是 await 执行完之后才会自动执行下一个 await 前面的语句**，无论 await 前面是异步方法还是同步方法。

await 后面可以跟很多值，如基本数据类型、（字符，数值，布尔等会被自动转换为立即 resolved 的 Promsie 对象）Promise 对象。

- **async 函数本质可以看成是多个异步操作包装成的 Promise 对象**
- **async 函数在处理多个异步串行请求时更方便**

### try/catch 捕获多个错误并做不同的处理时，如何优化？

尽管我们可以使用 try catch 捕获错误，但是当我们需要捕获多个错误并做不同的处理时，很快 `try catch` 就会导致代码杂乱。

为了简化这种错误的捕获，我们可以**给 await 后的 promise 对象添加 catch 函数**，为此我们需要写一个 helper:

```javascript
// to.js
export default function to(promise) {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}

async function asyncTask() {
  let err, user, savedTask;
  [err, user] = await to(UserModel.findById(1));
  if (!user) throw new CustomerError("No user found");
  [err, savedTask] = await to(
    TaskModel({ userId: user.id, name: "Demo Task" })
  );
  if (err) throw new CustomError("Error occurred while saving task");
  if (user.notificationsEnabled) {
    const [err] = await to(
      NotificationService.sendNotification(user.id, "Task Created")
    );
    if (err) console.error("Just log the error and continue flow");
  }
}
```

## 原型、原型链的理解

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(5).png" alt="Image.png" style="zoom:50%;" />

### 原型：实现继承的机制

 每一个 JavaScript 对象( null 除外)在创建时会与之关联另一个对象，这个被关联的对象称之为 **原型**(原型对象)，每个对象都有它的原型对象，并且可以使用对象的原型的属性和方法

- 当使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造函数的 prototype 属性对应的值，这个指针被称为对象的原型。

**获取原型：**

- 对象实例.__proto__ ：__proto__ 来自 Object.prototype 通过原型链委托返回Object.getPrototypeOf(obj)
- `构造函数的prototype`
- `ES6：类的prototype`
- Object.getPrototypeOf() 方法

### Constrcutor：

**每个原型都有一个 constructor 属性指向关联的构造函数。**

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(6).png" alt="Image.png" style="zoom:50%;" />

### **原型链：**继承关系的链条，用于属性查找

当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个`原型对象又会有自己的原型`，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype 所以这就是新建的对象为什么能够使用 toString() 等方法的原因。

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(7).png" alt="Image.png" style="zoom:50%;" />

**原型链用途：**

- `继承`：原型链允许对象通过继承获取其他对象的属性和方法。
- `代码复用和共享`：通过原型链，我们可以在原型对象
- `扩展和修改`：通过`在原型对象上添加新的方法和属性实例上访问和使用这些扩展`。这样可以方便地对现有以在整个原型链中的所有对象功能扩展和修改。

特点：JavaScript 对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改 原型时，与之相关的对象也会继承这一改变。

```js
p.__proto__ // Person.prototype 指向该对象的原型。指向原型对象
Person.prototype.__proto__ // Object.prototype
p.__proto__.__proto__ //Object.prototype
p.__proto__.constructor.prototype.__proto__ // Object.prototype
Person.prototype.constructor.prototype.__proto__ // Object.prototype
p1.__proto__.constructor // Person
Person.prototype.constructor // Person
```



## JavaScript实现继承？实现类？

**实现继承:**

- <u>原型链继承</u>：将一个对象的原型设置为另一个对象的实例 `Child.prototype = new Parent();`
- <u>构造函数继承</u>：子类构造函数中调用父类构造函数 `Parent.call(this);`
- <u>组合继承：</u>通过将`子类的原型设置为父类的实例`，并在`子类构造函数中调用父类构造函数`来实现继承。`Child.prototype = new Parent() Child.prototype.constructor = Child;`
- <u>原型式继承:</u> 通过已有对象创建新对象来实现继承 `child = Object.create(parent);`
- <u>寄生式继承(实例化方法)</u>：在原型式继承的基础上，增强了新对象
- <u>寄生组合继承：</u>优化版的组合继承实现方式，它通过寄生式继承来避免组合继承中重复调用父类构造函数。借助一个空对象作为中介，将父类型的原型（Parent.prototype） 赋给中介的prototype，再将子类型的原型（Child.prototype） 指向这个中介对象

**实现类：**class 是构造函数+原型链的语法糖

- <u>构造函数和原型链组合方式</u>：使用构造函数来定义实例属性，使用原型链来定义共享的属性和方法
- <u>工厂函数方式</u>：使用一个工厂函数来创建对象，可以通过闭包封装私有变量和方法。
- <u>原型式继承方式</u>：通过 Object.create 方法来实现对象的继承，可以方便地创建新对象并继承原型对象的属性和方法



## 装饰器

装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。**装饰器是一种函数，写成 `@ + 函数名`。它可以放在类和类方法的定义前面**。

装饰器主要用于：

- 装饰类
- 装饰方法或属性

### 装饰类

装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰的目标类。装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，**装饰器本质就是编译时执行的函数**。

```other
@annotation
class MyClass { }

function annotation(target) {
   target.annotated = true;
}
```

### 装饰方法或属性

```other
class MyClass {
  @readonly
  method() { }
}

function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
```

装饰器第一个参数是类的原型对象，装饰器的本意是要 “装饰” 类的实例，但是这个时候实例还没生成，所以只能去装饰原型（这不同于类的装饰，那种情况时 target 参数指的是类本身）；第二个参数是所要装饰的属性名，第三个参数是该属性的描述对象。

### 类和方法的扩展

装饰器可以用来为类或其方法添加额外的功能，而不需要改变原始的类定义。这在创建通用功能（如日志记录、性能监控、事务处理、缓存等）时非常有用。

### 权限控制和访问管理

装饰器可以用于实现权限控制，例如，检查用户是否有权访问特定的类方法。

### 属性注入

装饰器可以用于属性注入，例如，依赖注入框架中，自动注入依赖的服务或组件。

### 问题

### 为什么装饰器不能用于函数？

装饰器只能用于类和类的方法，**不能用于函数，因为存在函数提升。**

由于存在函数提升，使得装饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。

如果一定要装饰函数，可以采用高阶函数的形式直接执行。


# CSS

## CSS3 有哪些新特性？

- rgba（元素的颜色或背景色） 和 opacity（元素+所有子元素）
- background-image、background-origin、background-size、background-repeat
- word-wrap: break-word（对长的不可分割的单词换行）
- 文字特效 text-shadow 文字渲染 text-decoration
- font-face属性，定义自己的字体
- 圆角属性 border-radius
- 边框图片 border-image
- 盒阴影 box-shadow
- 媒体查询：定义多套 css，当浏览器尺寸发生变化时采用不同的属性
- 新增各种CSS选择器（：not(.input)： 所有 class 不是“input”的节点）`层次选择器、属性选择器`
- 多列布局： multi-column layout
- 线性渐变：gradient
- 旋转：transform 旋转、缩放、定位、倾斜、动画、多背景

## CSS变量、选择器、其权重、盒模型、降级

### **变量**

- 全局变量：在:root中定义的变量，在整个文档中使用
- 局部变量：在选择器中定义的变量，只能在选择器中内部使用
- 变量继承inherit和动态计算变量calc()函数

### **CSS中可继承与不可继承属性有哪些**

- 无继承性的属性
    - `display`：规定元素应该生成的框的类型
    - `文本属性`：vertical-align、text-decoration、text-shadow
    - `盒子模型的属性`：width、 height. margin、 border、 padding
    - `背景属性`：background
    - `定位属性`：float、 clear、 position、 top、 right、 bottom、 left、 min-width、 min-height、 max-width、max-height. overflow、 clip、 Z-index
    - `生成内容属性`：content、 counter-reset、 counter-increment
    - `轮廓样式属性`：outline-style、 outline-width、 outline-color、 outline
    - `页面样式属性`：size、 page-break-before、 page-break-after
    - `声音样式属性`：pause-before、 pause-after、 pause、 cue-before、 cue-after、 cue、 play-during
- 有继承属性
    - `字体系列属性`：font-family、font-weight、font-size、font-style
    - `文本系列属性`：text-indent、text-align、line-height、color
    - `元素可见性`：visibility、list-style
    - `列表属性`：list-style-type、list-style-position、list-style
    - `光标属性`：cursor
- 对于其他默认不继承的属性也可以通过以下几个属性值来控制继承行为：
    - inherit：继承父元素对应属性的计算值
    - initial：应用该属性的默认值，比如 color 的默认值是 #000
    - unset：如果属性是默认可以继承的，则取 inherit 的效果，否则同 initial
    - revert：效果等同于 unset，兼容性差

### **选择器权重：**

- `标签选择器`(div, h1, p)、`伪元素选择器`(p::first-line)：1
- `类选择器`(.myclass)、`伪类选择器`(a:hover, li:nth-child)、`属性选择器`(a[rel="external"])：10
- `id 选择器`(#myid)：100
- 内联样式：1000
- 相邻(+)兄弟、子(>)、后代( )、通配符选择器：0

### **选择器优先级排序：**

!important > 内联样式> id选择器>类=属性=伪类>标签=伪元素>相邻兄弟=子=后代=通配 > 继承 > 浏览器默认属性

### **css 盒模型：**

- 定义：盒模型都是由四个部分组成的，分别是margin、 border、 padding和content。
- **标准盒模型**（box-sizing:content-box）：width = content 部分的宽度，总宽度 = width + border(左右) + padding（左右）+ margin（左右）；高度同理。
- **怪异盒模型**（IE盒模型 box-sizing:border-box），width = content + border（左右） + padding（左右）三部分的宽度，因此，总宽度 = width + margin（左右）；高度同理。

### **优雅降级和渐进增强有什么区别：**

要解决的问题：CSS在高低版本浏览器的兼容问题

- 优雅降级：一开始就构建完整的功能，然后针对浏览器测试和修复。
- 渐进增强：一开始就针对低版本浏览器进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能以达到更好的体验。

## display

### display的属性值及作用

| **属性值**      | **作用**                        |
| ------------ | ----------------------------- |
| none         | 元素不显示，并且会从文档流中移除。             |
| block        | 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。    |
| inline       | 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。 |
| inline-block | 默认宽度为内容宽度，可以设置宽高，同行显示。        |
| list-item    | 像块类型元素一样显示，并添加样式列表标记。         |
| table        | 此元素会作为块级表格来显示。                |
| inherit      | 规定应该从父元素继承 display 属性的值。      |

### display的block、inline和inline-block的区别

<u>block(块元素)</u>：会独占一行，多个元素会另起一行，可以设置width、 height、 margin和padding属性；

<u>inline(行内元素)</u>：元素不会独占一行，设置width、height属性无效。但可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin;

<u>inline-block(行内块元素)</u>：将对象设置为inline对象，但对象的内容作为block对象呈现，之后的内联对象会被排列在同一行内。

**对于行内元素和块级元素，其特点如下：**

- <u>行内元素</u>
- 设置宽高无效；
- 可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin；
- 不会自动换行；
- <u>块级元素</u>
- 可以设置宽高；
- 设置margin和padding都有效；
- 可以自动换行；
- 多个块状，默认排列从上到下。

### 隐藏元素方法：

- display: none：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。
- visibility: hidden：元素在页面中仍占据空间，但是不会响应绑定的监听事件。
- opacity:0：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
- position:absolute：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
- Z-index:负值：来使其他元素遮盖住该元素，以此来实现隐藏。
- clip/clip-path：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
- transform: scale(0,0)：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。

### display:none和visibility: hidden之间的区别

|       | **display: none**             | **visibility: hidden**                  |
| ----- | ----------------------------- | --------------------------------------- |
| 渲染树   | 从渲染树中消失，渲染时不会占据任何空间           | 不从渲染树中消失，渲染时仍占据空间（内容不可见）                |
| 继承性   | 非继承属性，随父元素消失而消失，子元素设置显示也不奏效   | 父元素设置属性后，子元素也会继承，但如果子元素设置 `visible` 可显示 |
| 重排、重绘 | 影响重排                          | 只影响重绘                                   |
| CSS3  | `transition` 不支持 `display` 属性 | `transition` 支持 `visibility` 属性         |
| 读屏器   | 内容不会被读取                       | 内容会被读取                                  |

### display:inline-block 什么时候会显示间隙？

- 有空格时会有间隙，可以删除空格解决；
- margin 正值时，可以让 margin 使用负值解决；
- 使用 font-size 时，可通过设置 font-size:0、letter-spacing、word-spacing 解决；

## CSS动画

### CSS实现动画

- `Transition`（过渡）：用于设置元素的`样式过渡效果`。
- `Transform`（变形）：用于对元素进行`旋转、缩放、移动或倾斜`等变形操作。`配合Transition`
- `Animation（动画）+keyframes`：用于`自定义复杂的动画效果`。
- Canvas：
- **实现动画方法：**
- <u>Javascript 中可以通过定时器 setTimeout</u>
- 缺点：它通过设定间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿、抖动的现象；
- 原因：settimeout任务被放入异步队列，只有当主线程任务执行完后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；`settimeout的固定时间间隔不一定与屏幕刷新间隔时间相同，会引起丢帧。`
- <u>CSS3 中可以使用 transition和 animation</u>
- <u>HTML5 中的 canvas 也可以实现。</u>除此之外，HTML5 提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是*请求动画帧*。
- **CSS3实现动画的步骤：**
- 使用 `@keyframes` 规则来定义动画关键帧。使用百分比（0%、50%、100%）或关键字（from、to）来定义动画效果、
- 使用 `animation` 属性将动画关联到元素

### 简述 transform，transition，animation 的作用

- `transform`：描述了元素的静态样式，本身不会呈现动画效果，可以对元素进行旋转 rotate、扭曲 skew、缩放 scale 和移动 translate 以及矩阵变形 matrix。`transition` 和 `animation` 两者都能实现动画效果。`transform` 常配合`transition` 和 `animation` 使用。
- `transition`：样式过渡，从一种效果逐渐改变为另一种效果，它是一个合写属性。transition: transition-property transition-duration transition-timing-function transition-delay 从左到右，依次是：过渡效果的css属性名称、过渡效果花费时间、速度曲线、过渡开始的延迟时间 `transition` 通常和 hover 等事件配合使用，需要由事件来触发过渡。
- `animation`：动画属性，有 `@keyframes` 来描述每一帧的样式。

区别：

- `transform` 仅描述元素的静态样式，常配合`transition` 和 `animation` 使用。
- `transition` 通常和 hover 等事件配合使用(需要触发事件)；`animation` 是自发的，立即播放。(无需触发事件)
- `animation` 可以设置循环次数。
- `animation` 可以设置每一帧的样式和时间，`transition` 只能设置头尾。
- `transition` 可以与 js 配合使用， js 设定要变化的样式，`transition` 负责动画效果。

### 为什么有时候用translate来改变位置而不是定位？

translate 是 transform 属性的一个值。`改变transform或opacity不会触发浏览器重新布局（reflow）或重绘`

`(repaint)，只会触发复合 (compositions)。`而改变绝对定位会触发重新布局，进而触发重绘和复合。

transform使浏览器为元素创建一个 GPU 图层，但改变绝对定位会使用到 CPU。因此translate()更高效，可以缩短平滑动画的绘制时间。而translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发生这种情况。

### 对requestAnimationframe的理解

- <u>定义</u>：浏 览 器 提 供 的 ⼀ 个 ⽤ 于 优 化 动 画 和 渲 染 的 API。 它 可 以 协 调 浏 览 器 的 刷 新 率 ， 帮 助 开 发 者 实 现 流 畅 的 动 画 效 果 ， 并 提 供 更 ⾼ 效 的 渲 染 ⽅ 式 。`开发者可以在每个浏览器刷新帧之前请求执行一个函数。`
- <u>属性：</u>
- callback：在下一次浏览器刷新帧之前执行的回调函数。
- id：整数，用于取消回调函数执行
- 场景应用：动画效果、游戏开发、数据可视化、UI动效
- **定义：**需要传入一个回调函数作为参数，会在浏览器下一次重绘之前执行该回调函更新动画
- **语法：**window. requestAnimationFrame(callback)；该回调函数会被传入DOMHighResTimeStamp参数，它表示

requestAnimationFrame() 开始去执行回调函数的时刻。该方法属于`宏任务`，所以会在执行完微任务之后再去执

行。

- **取消动画**：使用`cancelAnimationFrame()`来取消执行动画，该方法接收一个参数——`requestAnimationFrame默认返回的id`，只需要传入这个id就可以取消动画了。
- **优点**：
- <u>CPU节能</u>：使用SetTinterval 实现的动画，当页面被隐藏或最小化时，SetTinterval 仍然在后台执行动画任

务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。RequestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂

停，因此跟着系统走的RequestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方

继续执行，有效节省了CPU开销。

- <u>函数节流</u>：在高频率事件( resize，scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，

RequestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节

省函数执行的开销，一个刷新间隔内函数执行多次时没有意义的，因为多数显示器每16.7ms刷新一次，多次

绘制并不会在屏幕上体现出来。

- <u>减少DOM操作</u>：requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就

完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。

## 浮动

### 为什么需要清除浮动？清除浮动的方式

- 浮动的定义：非IE浏览器下，`容器不设高度且子元素浮动`时，容器高度不能被内容撑开。此时，内容会溢出到容器外面而影响布局。这种现象被称为浮动（溢出）。
- 浮动的工作原理：
    - 浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）
    - 浮动元素碰到包含它的边框或者其他浮动元素的边框停留
- 浮动引起的问题：
    - 父元素的高度无法被撑开，影响与父元素同级的元素
    - 与浮动元素同级的非浮动元素会跟随其后
    - 若浮动的元素不是第一个元素，则该元素之前的元素也要浮动，否则会影响页面的显示结构
- 清除浮动：BFC 清除浮动的原理就是：计算 BFC 的高度时，浮动元素也参与计算。只要触发父元素的 BFC 即可。
    - 给父级div定义 height 属性
    - 最后一个浮动元素之后添加一个空的div标签，并添加 clear:both (避免浮动的影响，而不是清除浮动)样式
    - 包含浮动元素的父级标签添加 overflow:hidden 或者 overflow: auto
    - 使用：after 伪元素。由于IE6-7不支持：after，使用 zoom:1 触发 hasLayout

### BFC是什么？

- BFC块级格式化上下文：BFC是一种独立的渲染区域，具有自己的布局规则，它内部的元素和外部的元素相互独立，不会影响到外部的布局。
- 怎么开启BFC：
    - 根元素，HTML 元素本身就是 BFC
    - 浮动元素，float 属性不为 none(脱离文档流，浮动元素)
    - 定位元素(absolut、fixed)
    - overflow：hidden、auto、scroll（不为 visible）
    - display：inline-block、table-cell、table-caption、flex、grid
- 作用
    - 解决margin的重叠问题：上下两个元素均有margin取max
    - 解决高度塌陷的问题：子元素设置浮动，父元素高度塌陷 overflow:hidden
    - 创建自适应两栏布局：左元素浮动，右自适应，会导致左右左边框重合，在自适应的块元素身上创建BFC
    - 清除浮动：父元素没高度，子元素浮动。
- 原理
    - 内部的 Box 会在垂直方向一个个排列
    - 垂直方向上的距离由 margin 决定。（完整的说法是：属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠（塌陷），与方向无关。margin 水平方向不会发生重叠）
    - 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明 BFC 中子元素不会超出他的包含块，而 position 为 absolute 的元素可以超出他的包含块边界）
    - BFC 的区域不会与 float 的元素区域重叠
    - 计算 BFC 的高度时，浮动子元素也参与计算
    - BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然



### 什么是margin重叠问题？如何解决？

- 问题描述：两个块级元素的上外边距和下外边距可能会合并（折叠）为一个外边距，其大小会取其中外边距值大的那个。注意的是，浮动的元素和绝对定位这种脱离文档流的元素的外边距不会折叠。重叠只会出现在垂直方向。防止垂直 margin 合并，让 2 个元素不在同一个 BFC 中即可阻止垂直 margin 合并。
- 计算原则：
    - 如果两者都是正数，那么就去最大者
    - 如果是一正一负，就会正值减去负值的绝对值
    - 两个都是负值时，用0减去两个中绝对值大的那个
- 解决办法：对于折叠的情况，主要有两种：兄弟之间重叠和父子之间重叠
    - 兄弟之间重叠
        - 底部元素变为行内盒子：display: inline-block
        - 底部元素设置浮动：float
        - 底部元素的position的值为 abso lute/fixed
    - 父子之间重叠
        - 父元素加入：overfLow: hidden
        - 父元素添加透明边框： border: 1px solid transparent
        - 子元素变为行内盒子：display:inline-block
        - 子元素加入浮动属性或定位

## 定位

### position的属性有哪些，区别么

- **static**：默认定位。元素出现在正常的文档流中（忽略top，bottom，left，right 或 z-index声明）
- **relative**：相对定位。相对于其原来的位置进行定位。使用相对定位时，无论是否移动，元素仍然占据原来的空间；移动元素会导致其覆盖其他元素。
    - 永远是`相对于元素自身位置的，和其他元素没关系`，也不会影响其他元素。
- **absolute**：绝对定位。相对于static定位以外的一个父元素定位元素进行定位
    - 绝对定位时,浏览器会`递归查找该元素的所有父元素`，如果找到一个设置了 `position: relative/absolute/fixed 的元素，就以该元素为基准定位`，如果没找到，就以`浏览器边界定位`。
    - 脱离文档流，不占据空间，会与其他元素重叠。
- **fixed**：固定定位。元素的位置`相对于浏览器窗口`是固定位置，即使窗口滚动它也不会移动。
    - 脱离文档流，不占据空间，会与其他元素重叠。
- **sticky**：粘性定位。粘性定位理解为`基于用户滚动位置定位`、在 position:relative 与 position:fixed 定位之间切换。
    - `页面滚动超出目标区域`(top, right, bottom 或 left)时，等价为 `position:fixed`;，它会固定在目标位置。
    - `页面滚动未超出目标区域`,它的行为就像`position:relative`；
- **inherit**：规定应该`从父元素继承 position 属性值`。

### absolute与 fixed共同点与不同点

- **共同点：**
    - 改变行内元素的呈现方式，将display置为inline-block
    - 使元素脱离普通文档流，不再占据文档物理空间
    - 覆盖非定位文档元素
- **不同点：**
    - 根元素不同，absolute的根元素可以设置，fixed根元素是浏览器。
    - 在有滚动条的页面中，absolute会跟着父元素进行移动，fixed固定在页面的具体位置。

## 布局

### 常见的布局

- **水平垂直居中**：
    - 行内元素：
        - 行内元素`text-align: center;`
        - (块级元素转行内元素)inline-block 实现：`display: inline-block; text-align: center;`
    - 绝对定位：
        - 子绝父相，子四个方向全部为0，margin设置为auto（不需要盒子的宽高）
        - top：50%，left：50% + margin的负自身宽高的一半（需要盒子的宽高）
        - top：50%，left：50% + transform: translate(-50%, -50%)(不需要知道元素的宽高)
    - flex布局、grid布局、table布局：
    - flex：align-items: center;justify-content: center;(不需要知道元素的宽高)
    - grid： display: grid; place-items: center; (不需要知道元素的宽高)
    - table：父display:table-cell 子display: inline-block+vertical/text-align
- **水平居中：**
    - 定宽：margin:0 auto
    - 绝对定位+left:50%+margin:负自身的一半
- **垂直居中：**
    - position: absolute设置left、 top、 margin-left、 margin-top（定高）
    - display: table-cell
    - transform: translate(x, y)
    - flex(不定高，不定宽）
    - grid(不定高，不定宽)，兼容性相对比较差
- **两栏布局**：左边一栏宽度固定，右边一栏宽度自适应
    - 浮动：左浮动+width:200px，右margin-left:200px width:auto或直接右overflow: hidden（BFC）
    - flex布局：左width:200px，右flex:1
    - 绝对定位：子绝父相，左为子width:200px，右margin-left:200px
    - 绝对定位: 子绝父相，左正常width:200px，右为绝对 其余方向都设置为0 top: 0; right: 0; bottom: 0; left: 0;
    - 三栏布局：左右两栏宽度固定，中间自适应的布局
    - 绝对定位：左右绝对定位，中间设置对应方向大小的margin的值
    - flex布局：左右两栏设置固定大小，中间一栏设置为flex:1
    - 浮动：左右两栏设置固定大小，并设置对应方向的浮动，中间一栏设置左右两个方向的margin值（中间一栏必须放到最后）
- **圣杯布局**：利用浮动和负边距来实现。父级元素设置左右的 padding，三列均设置向左浮动，中间一列放在最前面，宽度设置为父级元素的宽度，因此后面两列都被挤到了下一行，通过设置 margin 负值将其移动到上一行，再利用相对定位，定位到两边。
- **双飞翼布局**：双飞翼布局相对于圣杯布局来说，左右位置的保留是通过中间列的 margin 值来实现的，而不是通过父元素的 padding 来实现的。本质上来说，也是通过浮动和外边距负值来实现的。
- **九宫格布局：**
    - flex布局：设置一个flex-wrap: wrap;使得盒子在该换行的时候进行换行。
    - grid布局：grid-template-columns属性用来设置每一行中单个元素的宽度(30%)，grid-template-rows属性用来设置每一列中单个元素的高度(30%)，grid-gap属性用来设置盒子之间的间距。(5%)
    - table布局：父元素设置为table布局(display:table)，使用border-spacing设置单元格之间的间距，最后将li设置为表格行，将div设置为表格单元格：
    - 浮动：父元素的div设置一个宽度，`宽度值为：盒子宽*3+间距*2`；然后给每个盒子设置固定的宽高，为了让他换行，可以使用float来实现，由于子元素的浮动，形成了BFC，所以父元素ul使用overflow:hidden；来消除浮动带来的影响。

### Flex布局

- 定义：flex (`一维`)布局，是一种弹性盒布局模型，给子元素提供了空间分布和对齐能力，由`container`（容器）及`item`（项目）组成。通过将一个元素的display属性值设置为flex从而使它成为一个`container`，它的所有子元素都会成为它的项目。通过属性排列，为盒状模型提供最大的灵活性。`注意子元素的float、clear、vertical-algin将失效`
- flex属性是flex-grow、flex-shrink和flex-basis的简写，默认值为`0 1 auto`。该属性有两个快捷值：`auto (1 1 auto)` 和 `none (0 0 auto)`。
- 属性值：
    - flex-direction：控制主轴方向
    - justify-content：元素在主轴上的排列方式
    - align-item：在次轴上的排列方式
    - flex-wrap：换行方式
    - order：制定项目的排列方式、默认0，越小越靠前
    - flex-grow：子项目的放大比例
    - flex-shrink：子项目缩小比例
- flex:1: 代表1 1 0px
    - flex-grow: 1 元素在剩余空间中所占的比例
    - flex-shrink: 1 元素在空间不足时的缩小比例
    - flex-basis: 0px 设置元素的初始大小，flex-basis给上面两个属性分配多余空间之前，计算项目是否有多余空间，默认值为 auto,即项目本身大小
    - 实现的效果是*所有元素等分* justify-content：space-between + 每个项目设置为flex:1
- flex布局原理
    - 假设外部container:500px
    - flex-basis：设置每个元素的大小(一共5个item) 每个 50px 共计5*50=250px
    - flex-grow：将剩余元素分到每个item `元素个数*（basis+growX）=container`
    - grow设置成1 5*(50+X)=500 X=50 即每个Item在basis+50px
    - 五个元素第一个grow设置成6 其他元素设置成1 `4*(50+X)+1*(50+6X)=500` 解得X=25 即`第一个元素加上6*25 px 其余每个元素+1*25px`
    - flex-shrink:空间不足时的缩小比例 `子项目总宽度-元素个数*shrinkX = container`
    - container:500px、5个item每个200px 超了500px
    - 每个item里shrink:2、计算公式： `1000 - 5*(2X) = 500` 解得 X=50 则每个元素都要减掉2X=100px
    - 第一个shrink:1 计算公式： `1000 - 1*X - 4*(2X) = 500` 解得 X=? 则第一个减？ 其他元素都要减掉2？

### Grid布局：

- 布局方式：`二维`布局，在container创建二维网格，定义大小、位置、层次关系
- 使用：display:grid或display:inline-grid
- Grid布局属性：
- *容器属性*：
    - grid-template-columns 和 grid-template-rows：设置网格的列宽和行高。
    - grid-gap：设置行间距和列间距。等价于grid-row-gap和grid-column-gap。
    - grid-template-areas：定义网格区域，将多个单元格组成一个命名区域
    - grid-auto-flow：用于`指定项目的放置顺序`，默认为 row(先行后列)
    - justify-items 和 align-items：设置单元格内容在水平和垂直方向上的对齐方式。
- *项目属性：*
    - grid-column-start 和 grid-column-end：用于指定项目左边框和右边框所在的垂直网格线，定义项目在列方向的位置。
    - grid-row-start 和 grid-row-end：用于指定项目上边框和下边框所在的水平网格线，定义项目在行方向的位置。
    - grid-area：用于指定项目放置在哪一个命名区域。
    - justify-self和 align-self：分别用于设置单元格内容在水平和垂直方向上的对齐方式，只作用于单个项目。
- 应用场景：
    - 网格导航菜单栏
    - `居中布局`
    - 多栏布局：新闻列表
    - 自适应布局：设置项目放大和缩小比例
    - 等高布局：设置项目高度为1fr，卡片布局
    - `响应式布局`：不同尺寸显示不同的布局

### margin设置负值会是什么情况：

margin-left,margin-right为负值：

- 元素本身没有宽度，会增加元素宽度
- 元素本身有宽度，会产生位移，元素会**向左或者向上**移动

margin-top为负值，不管是否设置高度，都不会增加高度，而是会*产生向上的位移*

margin-bottom为负值的时候不会位移,而是会减少自身供css读取的高度.

设置margin-top/left为负数时，元素自身会进行移动，但原先所占的位置依然有。

设置margin-bottom/right为负数，元素并不会向下/右移动，而是将后续的元素拖拉进来，覆盖本来的元素。

padding-bottom：50%会是什么情况？

50%是盒子的`高宽比例`，切记是相对于`父元素宽度`的50%的宽高，不是相对于自己的width

## 移动端适配，响应式布局？

### 如何根据设计稿进行移动端适配？

**像素相关单位：**

- 设备像素：物理像素显示设备上的最小物理单位，屏幕上的一个点，显示不同的颜色和图像。
- css像素(px)：web长度单位，CSS是相对单位，1CSS像素等于对应一个设备独立像素
- 设备独立像素（DIP):与设备无关的抽象单位，逻辑像素或密度无关像素，`解决不同设备分辨率`，使用window.screen.width 和 window.screen.height来获取。
- 设备像素比（DPR）：DPR=设备像素/设备独立像素，用于`适配不同分辨率的屏幕`
- 每英寸像素(PPI):屏幕每英寸所包含的像素点数目(屏幕像素密度)，越高屏幕显示越清晰

**常用移动端适配方案：**

- `使用rem单位`：rem 单位是相对于根元素（html元素）的字体大小进行计算的长度单位。通过动态设置根元素的字体大小，可以`根据不同设备的DPR进行适配。`
- `使用viewport标签`：通过设置viewport标签，可以控制页面的缩放和布局。设置 `<meta name="viewport" content="width=device-width,initial-scale=1.0"＞`可以让`页面宽度等于设备宽度`，并且不进行缩放。
- `使用媒体查询`：媒体查询可以`根据不同设备的宽度、高度、DPR等条件来应用不同的CSS样式`，从而实现页面的适配。
- `使用flexbox和grid布局`：flexbox和grid布局可以更加灵活地进行页面布局，适应不同设备的屏幕尺寸和分辨率。
- 使用图片的@2x和@3x版本：对于高分辨率设备，提供相应的高清晰度图片，以确保图片显示效果清晰。

### px、em、rem、vm、vh、%单位区别?

- <u>px</u>：`固定单位像素`，其余均是相对单位元素
- 对于只需要适配少部分移动设备，且分辦率对页面影响不大，px即可，
- <u>em</u>：文本相对长度单位，`相对于当前对象内的fontSize进行计算`(没设置会继承父元素的fontSize)
- <u>rem</u>：只是相`当于HTML根元素的font-size`，
- 利用html元素中字体的大小与屏幕间的比值来设置font-size的值(默认16px)，实现简单`响应式布局`，屏幕分辨率变化随元素变化
- 适配iPhone和iPad等分辨率差别比较挺大的设备。
- <u>vh、vw</u>：其实就是`相当于视图窗口的宽高`，最大值为100vh、vw。
- 相对于视窗尺寸
- <u>%</u>：容易混淆的是百分比,`百分比是相当于父元素的`。
- 大部分相对于祖先元素，也有相对于自身的情况比如 (border-radius、 translate等）

### 响应式布局

- `viewport`（推荐）：**「viewport」**是CSS3中新增的视口单位，包含**「vw」**和**「vh」**两个部分。其中**「vw」**是相对于视口宽度的百分比，**「vh」**是相对于视口高度的百分比。
- **可以借助scss和less来编写一个统一的单位换算函数，然后在具体的scss、less等页面css文件中引用使用：**
- 以尺寸为750px的设计稿为例:100vw = 750px，那么75px = (75px / 750px) * 100vw = 10vw
- `rem`：rem是一种相对长度单位，它相对于根元素（即html元素）的字体大小来计算当前元素的实际大小。大多数浏览器的默认字号都为16px，那么1rem = 16px。
- `media媒体查询`：@media媒体查询实现移动端适配是通过给不同尺寸的设备定制不同的样式。
- 可以发现，采用 **「@media媒体查询」**来适配移动端存在以下几个问题：
- **「代码冗余」**：由于需要使用多个媒体查询来适配不同的设备，代码量会随之增加，导致代码冗余和维护成本增加，页面加载速度也会变慢。
- **「非精确适配」**：只能适配一些常见的设备尺寸，而不能精确适配所有的设备，可能会出现适配不完全或者适配不准确的情况。
- **「难以维护」**：需要手动设置每个元素的样式，而且样式之间可能存在交叉和冲突，导致维护难度增加。

## 重排（回流）和重绘？

**重绘**

`不会改变任意一个盒子的布局` 称为浏览器重绘。如 改变元素的背景颜色、visibility等CSS

**重排**

会`改变每一个盒子的布局`，如 改变某一盒子大小、添加或删除某一元素等

**重溯和回流的时机**

`浏览器有一个特殊队列 据估计每隔16ms左右 将队列中所有触发重溯和回流的操作一起执行 优化体验`

特殊**部分操作一旦触发会立刻引起重溯或回流 如下：**

- *导致重排*：页面的首次渲染、浏览器的窗口大小发生变化、元素的尺寸或者位置发生变化、查询某些属性或者调用某些方法、添加或者删除可见的DOM元素
- *导致重绘*：color、 background 相关属性、outline 相关属性： text-decoration、border-radius、 visibility、 box-shadow、`transform`

**如何减少重排**

- 操作DOM时，尽量在低层级的DOM节点进行操作
- 使用 transform 代替 top
- 避免使用CSS的表达式
- 不要频繁操作元素的样式，对于静态页面，可以修改类名，而不是样式。
- 使用 absolute 或 fixed 使元素脱离文档流
- 不要使用 table 布局，可能很小的一个改动会造成整个 table 的重新布局
- 把 DOM 离线后修改。如：使用 documentFragment 对象在内存里操作 DOM
- 浏览器的自身优化——渲染队列
- 浏览器会将所有的回流、重绘的操作放在一个队列中，当队列中的操作到了一定的数量或者到了一定的时间间隔，浏览器就会对队列进行批处理。这样就会让多次的回流、重绘变成一次回流重绘。

**原因：**

**因为队列中可能会有影响到这些属性或方法返回值的操作，即使你希望获取的信息与队列中操作引发的改变无关，浏览器也会强行清空队列，确保你拿到的值是最精确的。**

## 伪类、伪元素

### 伪元素和伪类的区别和作用？

- 伪元素：在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成。它们只在外部显示可见，但不会在文档的源代码中找到它们。
- `添加额外元素，但是不会在文档源码中找到`
- 伪类：将特殊的效果添加到特定选择器上。它是已有元素上添加类别的，不会产生新的元素。

### ::before 和:after 的双冒号和单冒号有什么区别？

- ::伪类、:伪元素
- ::before 就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并`不存在于 dom 之中，只存在在页面之中。`

## 优化CSS性能

- 减少CSS文件的大小：通过使用CSS压缩工具(Webpack、rollup)来压缩CSS文件，可以减少文件大小。
- 避免使用@import：将所有CSS代码放在一个文件中，并使用link标签引用它，影响浏览器的并行下载
- 使用外部CSS文件：将CSS代码放在外部文件中，可以使浏览器缓存CSS文件，从而提高网页加载速度。(首屏使用内联)
- 避免使用过多的CSS选择器：过多的CSS选择器(选择器嵌套)会导致浏览器需要花费更多的时间来匹配样式，从而降低渲染性能。
- 避免使用过多的嵌套：过多的嵌套会增加CSS的复杂性，从而降低渲染性能。因此，尽可能地减少嵌套的层数。
- 使用CSS预处理器：CSS预处理器如Sass和Less可以帮助开发人员编写更有效率的CSS代码。
- 避免使用过多的重复代码：重复的CSS代码会增加文件大小，降低加载速度。
- 使用浏览器缓存：使用浏览器缓存可以使浏览器缓存CSS文件，从而提高网页加载速度。

## 图片、精灵图

### 常见图片格式：

- BMP，是无损的、既支持索引色也支持直接色的点阵图。这种图片格式几乎没有对数据进行压缩，所以BMP格式的图片通常是较大的文件。
- GIF是无损的、采用索引色的点阵图。采用LZW压缩算法进行编码。文件小，是GIF格式的优点，同时，GIF格式还具有支持动画以及透明的优点。但是GIF格式仅支持8bit的索引色，所以GIF格式适用于对色彩要求不高同时需要文件体积较小的场景。
- JPEG是有损的、采用直接色的点阵图。JPEG的图片的优点是采用了直接色，得益于更丰富的色彩，JPEG非常适合用来存储照片，与GIF相比，JPEG不适合用来存储企业Logo、线框类的图。因为有损压缩会导致图片模糊，而直接色的选用，又会导致图片文件较GIF更大。
- PNG-8是无损的、使用索引色的点阵图。PNG是一种比较新的图片格式，PNG-8是非常好的GIF格式替代者，在可能的情况下，应该尽可能的使用PNG-8而不是GIF，因为在相同的图片效果下，PNG-8具有更小的文件体积。除此之外，PNG-8还支持透明度的调节，而GIF并不支持。除非需要动画的支持，否则没有理由使用GIF而不是PNG-8。
- PNG-24是无损的、使用直接色的点阵图。PNG-24的优点在于它压缩了图片的数据，使得同样效果的图片，PNG-24格式的文件大小要比BMP小得多。当然，PNG24的图片还是要比JPEG、GIF、PNG-8大得多。
- SVG是无损的矢量图。SVG是矢量图意味着SVG图片由直线和曲线以及绘制它们的方法组成。当放大SVG图片时，看到的还是线和曲线，而不会出现像素点。SVG图片在放大时，不会失真，所以它适合用来绘制Logo、Icon等。
- WebP是谷歌开发的一种新图片格式，WebP是同时支持有损和无损压缩的、使用直接色的点阵图。从名字就可以看出来它是为Web而生的，什么叫为Web而生呢？就是说相同质量的图片，`WebP具有更小的文件体积`。现在网站上充满了大量的图片，如果能够降低每一个图片的文件大小，那么将大大减少浏览器和服务器之间的数据传输量，进而降低访问延迟，提升访问体验。目前只有Chrome浏览器和Opera浏览器支持WebP格式，兼容性不太好。
- 在`无损压缩`的情况下，相同质量的WebP图片，文件大小要`比PNG小26%`；
- 在`有损压缩`的情况下，具有相同图片精度的WebP图片，文件大小要`比JPEG小25%~34%`；
- WebP图片格式支持图片透明度，一个无损压缩的WebP图片，如果要支持透明度只需要22%的格外文件大小。

### CSSprite：

- 定义：CSSSprites(精灵图），将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的 background-image, background-repeat, background-position属性的组合进行背景定位。
- 优点：
    - 利用 CSS Sprites 能很好地减少网页的http请求，从而大大提高了页面的性能
    - CSS Sprites 能减少图片的字节，把3张图片合并成1张图片的字节总是小于这3张图片的字节总和。
- 缺点：
    - 在图片合并时，要把多张图片有序的、合理的合并成一张图片，还要留好足够的空间，防止板块内出现不必要的背景。在宽屏及高分辨率下的自适应页面，如果背景不够宽，很容易出现背景断裂；
    - CSSSprites 在开发的时候相对来说有点麻烦，需要借助 photoshop 或其他工具来对每个背景单元测量其准确的位置。
    - 维护方面：CSS Sprites 在维护的时候比较麻烦，页面背景有少许改动时，就要改这张合并的图片，无需改的地方尽量不要动，这样避免改动更多的 CSS，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字节就增加了，还要改动 CSS。

## CSS场景应用：

- **实现一个三角形**：宽高为0，通过`上下左右边框来控制三角形的方向`，用`边框的宽度`比来`控制三角形角度`（使用伪元素也可以）
- **实现一个扇行:** 用CSS实现扇形的思路和三角形基本一致，就是多了一个圆角的样式，实现一个90°的扇形：
- **实现圆和半圆**: 圆：border-radius: 50% 半圆：左上右上 border-radius: 50% 高度为宽度一半
- **实现一个宽高自适应的正方形:**
    - vw单位
    - 元素的margin/padding百分比是相对父元素width
    - 子元素的margin-top
- **实现一个梯形**：height: 0;width: 100px;border-bottom: 100px solid red; border-right: 40px solid transparent
- **画一条0.5px的线**
    - 采用transform：scale(0.5,0.5)的方式，该方法用来定义元素的2D 缩放转换：
    - 采用meta viewport的方式(移动端)：initial-scale=0.5/minimum,maximum-scale=0.5
- **设置小于12px的字体**:在谷歌下css设置字体大小为12px及以下时，显示都是一样大小，都是默认12px。
    - 使用`Webkit的内核`的`text-size-adjust:none`的私有CSS属性来解决(高版本谷歌不适用)
    - 使用`CSS3的transform`缩放属性`-webkit-transform:scale(0.5)`：注意-webkit-transform:scale(0.75);收缩的是整个元素的大小，这时候，如果是内联元素，必须要将内联元素转换成块元素，可以使用display:block/inline-block
    - 使用`zoom:50%/0.5`(火狐不支持)
- **如何解决 1px 问题？**
    - 原因：CSS 中的 1px 并不能和移动设备上的 1px 划等号，iPhone6：`1px像素实际会用两个物理像素单元渲染` window.devicePixelRatio=设备物理像素/CSS像素
    - 解决：
    - `直接写0.5px`：先在 JS 中拿到 window.devicePixelRatio 的值，然后把这个值通过模板语法写到 CSS 的 data里，然后直接在样式写0.5px (兼容性问题:IOS8以上，不兼容安卓)
    - `伪元素先放大再缩小`：在目标元素的后面追加一个::after 伪元素，display:absolute ,宽和高都设置为目标元素的两倍，border:1px，利用`transform:scale(0.5)`缩小为原来50%。border 也缩小为了 1px 的二分之一,间接地实现了 0.5px 的效果。
    - `viewport 缩放来解决`：在meta标签的 initial、minimum、maximum=1/window.devicePixelRatio(整个页面被缩放，副作用文字、图片也被无差别缩小)
- **如何判断元素是否到达可视区域？**
    - window. innerHeight 是浏览器可视区的高度；
    - document.body.scrollTop 是浏览器滚动的过的距离；
    - imgs.offsetTop是元素顶部距离文档顶部的高度（包括滚动条的距离）；
    - 内容达到显示区域的：img.offsetTop ≤ window. innerHeight + document.body. ScrollTop:
    - 单行文本溢出：white-space:nowrap、overflow:hidden、text-overflow:ellipsis
    - 多行文本溢出：display: -webkit-box、-webkit-box-orient: vertical、-webkit-line-clamp:3、overflow: hidden

## CSS预处理/后处理、工程化

### CSS预处理器/后处理器是什么？为什么要使用它们？

- 预处理器：将`类CSS代码通过预处理器编译成CSS代码`
- less，sass，stylus，用来预编译 Sass 或者 Less，增加了 css 代码的复用性。
- 层级，mixin，变量，循环，函数等对编写以及开发UI组件都极为方便。
- 后处理器：将`旧的CSS代码转化成新的CSS代码`（自动额外增加浏览器语法前缀）
- postCss（工程化插件），通常是在完成的样式表中根据 css规范处理 css，让其更加有效。
- 目前最常做的是`给 css属性添加浏览器私有前缀`，实现`跨浏览器兼容性`的问题。
- 优点：
- 结构清晰，便于扩展
- 可以很方便的屏蔽浏览器私有语法的差异
- 可以轻松实现多重继承
- 完美的兼容了 CSS 代码，可以应用到老项目中

### Sass、Less 是什么？为什么要使用他们？

- 本质：`动态CSS样式语言`，通过变量、继承、运算、函数等赋予动态语言的特性，`可以在客户端也可以在服务端运行`
- 优点：
- 结构清晰便于扩展，减少重复书写
- 实现多继承：完全兼容css代码、可以与旧css代码进行一同编译



# HTML

## HTML5有哪些更新？

- 语义化标签
    - nav、header、footer、aside、section、article
- 媒体标签：audio、video
- 表单类型、属性、事件：email
- DOM查询操作
- Web存储（localStorage、sessionStorage）
- 拖拽、画布、SVG、websocket（通信协议）
- history API：go、forward、back、pushstate

### HTML5的**优点：**

- 有利于架构良好的HTML结构，便于团队开发和维护
- 方便其他设备解析、盲人阅读（如：屏幕阅读器）
- 有利于搜索引擎优化（SEO），搜索引擎爬虫会根据不同的标签来赋予不同的权重

## DOCTYPE 的作用是什么？

**<!DOCTYE>** 声明一般位于文档的第一行，它的作用主要是**告诉浏览器以什么样的模式来解析文档**。一般指定了之后会以“标准模式”进行文档解析，否则就以“兼容模式”进行解析。

- 在标准模式（Strick mode）**按照最新的标准**进行解析的。
- 而在兼容模式（Quick mode）**向后兼容的方式来模拟老式浏览器**的行为，以保证一些老的网站能正常访问。

## 常⽤的meta标签有哪些？

**meta** 标签由 name 和 content 属性定义，**用来描述网页文档的属性**。

**常见标签：**

- charset：HTML文档的编码类型
- keywords：页面关键词
- description：页面描述
- viewport：适配移动端

## script标签中defer和async的区别？（html中资源加载方式）

- script 会阻碍 HTML 解析，只有下载好并执行完脚本才会继续解析 HTML
- defer：不会阻碍 HTML 解析，延迟加载，脚本加载和文档解析同步，html解析完成后执行，多个defer按照顺序执行
    - 脚本在文档解析后执行
- async：不会阻碍 HTML 解析，异步加载，下载完成后立即执行（并行），多个async执行顺序不确定
    - 脚本下载完毕立即执行

|            |                                                              |
| ---------- | ------------------------------------------------------------ |
| 默认         | 会阻碍 HTML 解析，只有下载好并执行完脚本才会继续解析 HTML。<br/>                     |
| defer<br/> | 不会阻碍 HTML 解析，延迟加载。脚本加载和文档解析同步，HTML 解析完成后执行，多个 defer 按顺序执行。   |
| async<br/> | 不会阻碍 HTML 解析，异步加载。下载完成后立即执行（并行），多个 async 执行顺序不确定，脚本下载完毕立即执行。 |

![b0a8a139519f46dfa2d1992c58eb5397~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.jpeg](%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/b0a8a139519f46dfa2d1992c58eb5397~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.jpeg)

## Web Worker

在 HTML 页面中，如果在执行脚本时，页面的状态是不可相应的，直到脚本执行完成后，页面才变成可相应。

web worker 是**运行在后台的 js，独立于其他脚本，不会影响页面的性能**。

并且**通过 postMessage 将结果回传到主线程**。这样在进行复杂操作的时候，就**不会阻塞主线程**了。

如何创建 web worker：

- 检测浏览器对于 web worker 的支持性
- 创建 web worker 文件（js，回传函数等）
- 创建 web worker 对象

## 两个页面通信

- localStorage 或 sessionStorage
- URL 参数
- WebSocket
- postMessage
- 第三方状态管理库