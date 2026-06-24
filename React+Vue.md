# React

## Vue和React区别

| **对比维度**                | **Vue**                                                      | **React**                                                    |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **数据流**                  | 双向数据绑定（`v-model`），父子间可通过事件或 props 同步更新 | 单向数据流（`state`），数据由父传子，子通过回调通知父更新    |
| **模板编写**                | 接近原生 HTML 模板，增加指令属性（如 `v-if`、`v-for`）       | 使用 JSX（JavaScript XML）在 JS 中直接编写模板               |
| **监听数据变化原理**        | 基于 `getter/setter`（Vue 2）或 Proxy（Vue 3）进行数据劫持，精确追踪依赖 | 基于引用比较（浅比较），需要配合 `PureComponent` / `shouldComponentUpdate` / `memo` 优化 |
| **虚拟 DOM 更新策略**       | 渲染时跟踪组件依赖，只更新变化部分，默认优化                 | 状态变化时默认重新渲染子组件，通过 `PureComponent` / `shouldComponentUpdate` 控制优化 |
| **功能组合方式**            | `mixin`（Vue 3 中更推荐 Composition API）                    | 高阶组件（HoC）和自定义 Hooks                                |
| **组件传值**                | 父传子用 `props`，子传父常用自定义事件（`$emit`）或回调函数，倾向事件方式 | 父传子用 `props`，子传父主要用回调函数                       |
| **语法糖与工具**            | 提供 `v-model` 等语法糖；构建工具 vue-cli / Vite             | 无直接语法糖（用受控组件模式代替）；构建工具 Create React App / Vite |
| **跨平台方案**              | Weex、uni-app                                                | React Native                                                 |
| **diff 算法类型**           | 基于依赖追踪的优化 diff                                      | 深度优先遍历 + 分治策略，分为 **树比对**、**组件比对**、**元素比对** |
| **树比对**                  | 依赖追踪，只比较受影响部分                                   | 仅同层级节点比较，忽略跨层级移动，提升性能                   |
| **组件比对**                | 根据依赖判断是否更新                                         | 同类型组件 → 树比对，不同类型 → 直接替换                     |
| **元素比对**                | 精确追踪依赖变化                                             | 同层级子节点通过 `key` 提高列表对比效率                      |
| **Fiber 架构（React 16+）** | 不适用                                                       | 引入 FiberNode（双链表）和 FiberTree 实现可中断渲染；使用双缓冲（`current` / `workInProgress`）结构提升可控性与性能 |

#### 相同点

- 都是数据驱动视图 MVVM 框架，通过不同的机制实现响应式更新，优化用户体验。
- 都有组件化思想，提高代码的重用和开发过程的效率
- 都基于 Virtual DOM，实现跨平台、最小的代价更新变化的视图、避免手动操作真实 DOM
- 都专注于视图渲染，实现核心渲染器，像路由、状态管理等独立的部分都由其他库去完成。
- 都支持服务器端渲染
- 都有支持 native 的方案：`Vue`的`weex`、`React`的`React native`
- Diff 思想基本相同。vue 和 react 的 diff 算法都是进行同层次的比较，在处理老节点部分，都需要把节点处理 key - value 的 Map 数据结构，方便在往后的比对中可以快速通过节点的 key 取到对应的节点。同样在比对两个新老节点是否相同时，key 是否相同也是非常重要的判断标准。所以不论是 React, 还是 Vue，在写动态列表的时候，都需要设置一个唯一值 key，这样在 diff 算法处理的时候性能才最大化。

#### 区别

- **语法不同**。默认情况下，Vue 使用 SFC，React 使用 JSX。
- **数据流向的不同**。`react`从诞生开始就推崇单向数据流，而`Vue`是双向数据流，双向绑定。
- **数据变化的实现原理不同**。`react`使用的是不可变数据，而`Vue`使用的是可变的数据。
- **组件化通信的不同**。`react`中我们通过使用回调函数来进行通信的，而`Vue`中子组件向父组件传递消息有两种方式：事件和回调函数。
- **Diff 算法实现不同。react 会自顶向下全 diff**。vue 会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。在 react 中，当状态发生改变时，组件树就会自顶向下的全 diff，**重新 render 页面**，**重新生成新的虚拟 dom tree，新旧 dom tree 进行比较，进行 patch 打补丁方式，局部更新 dom。**所以 react 为了避免父组件更新而引起不必要的子组件更新，可以在 `shouldComponentUpdate` 做逻辑判断，减少没必要的 render，以及重新生成虚拟 dom，做差量对比过程。

    在 Vue2 中， 通过 `Object.defineProperty` 把 data 属性全部转为 getter/setter。同时 watcher 实例对象会在组件渲染时，将属性记录为 dep, 当 dep 项中的 setter 被调用时，通知 watch 重新计算，使得关联组件更新。**Vue2 的核心 Diff 算法采用了双端比较的算法，同时从新旧 children 的两端开始进行比较，借助 key 值找到可复用的节点，再进行相关操作。相比 React 的 Diff 算法，同样情况下可以减少移动节点次数，减少不必要的性能损耗，更加的优雅。**

- **React 重运行时，Vue 重编译时。Vue 的 Template 可以在编译时做静态分析和预编译优化，例如，静态 vdom 不做 diff，v-if 等做到了按需更新。而 React 采用 JSX 语法，动态灵活，导致它的渲染效率比 Template 低，无法在编译时做优化，只能寄希望于运行时，例如 fiber、并发模式。**但 Fiber 架构的复杂性导致 React 的虚拟 DOM 协调效率较低，这是系统性的问题。Vue 的架构里没有时间分片，也就没有 Fiber，因此简单了很多，这使得渲染可以更快。Vue 通过分析 template、简化协调过程，做了大量的 AOT 优化，性能测试结果表明大部分的 DOM 内容有 80% 属于静态内容，因此 Vue 3 的协调速度比 Svelte 快，花费的时间比 React 的 1/10 还少。
- **组件重复渲染处理填坑**。React Hooks 将大部分组件树的优化 API 暴露给开发者，开发者很多时候需要手动调用 useMemo 来优化渲染效率。这意味着 React 应用默认就有 render 过多的问题。更严重的是，这些优化在 React 里很难自动化，因为这些优化要求开发者正确设置依赖数组，盲目添加 useMemo 会导致应该 render 的没 render。**vue 通过数据响应式追踪，可以做到组件树级别的优化，比如把插槽编译为函数以避免 children 的变化引发 re-render**，比如自动缓存内联事件处理函数以避免 re-render。Vue 3 可以做到在不借助开发者的任何手动优化的情况下，防止子组件在非必要的情况下 re-render。这意味着同样一次更新，React 应用可能要 re-render 多个组件，而 Vue 应用很可能只 re-render 一个组件。
- **组件更新控制颗粒度不同。Vue3 通过静态标记 + 响应式 + 虚拟 dom 的方式，控制了 diff 的颗粒度，让 diff 的时间不会超过 16ms，但是 React 自上而下的 diff 过程，项目大了之后，一旦 diff 的时间超过 16.6ms，就会造成卡顿，对此 React 交出的解决方案就是时间切片。**时间分片解决的问题并不多，只解决了很少一部分场景的问题，比如动画和可视化。99% 的场景不需要时间分片，时间分片只会延长整个渲染时长。React 有很多问题，我这里补充一点，Fiber 的链表遍历制约了 React 的 diff 算法、让很多优化变得无法实施。总得来说，Vue 3 对利弊的权衡对我很有说服力。另外，时间分片，或者说并发模式，给 React 带来了另外一个问题：React 需要对所有更新任务进行调度和调和，这导致 React 还需要搞定任务优先级、任务失效处理、re-entry 等任务，这会使 React 变得更复杂，进而让源码的体积膨胀。就算 React 把 Suspense、Tree-shaking 等优化都加上，Vue 3 的运行时体积也只有 React + ReactDOM 的 1/4。
- **在生态建设上，React 和 Vue 的路线是不一样的**。Vue 的 Cli、路由和状态管理，都是 Vue 的核心库的一部分，受到官方支持和维护。但是 React 团队只负责维护 React 这一个项目，脚手架工具、路由和状态管理都来自于第三方的社区开发者。

## React生命周期(类组件)

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/Image%20(23).png" alt="Image.png" style="zoom: 33%;" />

### 一、挂载阶段（Mount）

- **constructor**：初始化 state、绑定事件、节流防抖、从路由取参数。
- **getDerivedStateFromProps**（静态方法）：将 props 映射到 state（初始化 & 更新都会触发）。
- **render**：纯函数，返回 React Element，禁止在这里直接操作 DOM 或调用 setState。
- **componentDidMount**：DOM 已经挂载，可进行 DOM 操作、事件监听、数据请求。

**Hooks 对应**

`useEffect(() => { ... }, [])` → 相当于 componentDidMount（空依赖只执行一次）。

### **二、更新阶段（Update）**

- **getDerivedStateFromProps**：props 变化时映射到 state。
- **shouldComponentUpdate**：性能优化，返回 false 可阻止渲染。
- **render**：重新渲染虚拟 DOM。
- **getSnapshotBeforeUpdate**：获取 DOM 更新前的快照（滚动位置等）。
- **componentDidUpdate**：DOM 已更新，可操作最新 DOM；需防止 setState 死循环。

**Hooks 对应**

- `useEffect(() => { ... })` → 相当于 componentDidUpdate + componentDidMount。
- `useLayoutEffect` → 同步执行，适合测量和同步 DOM。

### **三、卸载阶段（Unmount）**

- **componentWillUnmount**：清理定时器、取消请求、移除事件监听。

**Hooks 对应**

`useEffect(() => { return () => { ... } }, [])` → 清理函数相当于 componentWillUnmount。

## React 事件机制

```javascript
<div onClick={this.handleClick.bind(this)}>点我</div>
```

React并不是将click事件绑定到了div的真实DOM上，而是**在document处监听了所有的事件（事件代理），当事件发生并且冒泡到document处的时候**，**React将事件内容封装并交由真正的处理函数运行。**这样的方式不仅仅减少了内存的消耗，还能在组件挂在销毁时统一订阅和移除事件。

<img src="https://cdn.nlark.com/yuque/0/2021/jpeg/1500604/1611890469312-7504e85d-c6db-481e-b9d3-5307a3de708c.jpeg?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_25%2Ctext_5b6u5L-h5YWs5LyX5Y-377ya5YmN56uv5YWF55S15a6d%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fformat%2Cwebp" alt="77fa6b2a59c92e160bc171f9c80783e7.jpg" style="zoom:50%;" />

除此之外，冒泡到document上的事件**也不是原生的浏览器事件**，而是由**react自己实现的合成事件（SyntheticEvent）**。因此如果不想要是事件冒泡的话应该调用`event.preventDefault()`方法，而不是调用`event.stopProppagation()`方法。

![img](https://cdn.nlark.com/yuque/0/2021/jpeg/1500604/1611890469312-7504e85d-c6db-481e-b9d3-5307a3de708c.jpeg?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_25%2Ctext_5b6u5L-h5YWs5LyX5Y-377ya5YmN56uv5YWF55S15a6d%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

- 实现合成事件的目的如下：

  - 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力；


  - 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果**你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。**但是对于**合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象**，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

  - **优点：**
    - 兼容所有浏览器，更好的跨平台；
    - 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）。
    - 方便 react 统一管理和事务机制。


  - **原理：**
    - **事件委派：**React会把所有的事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部事件监听和处理函数。
    - **自动绑定：**React组件中，每个方法的上下文都会指向该组件的实例，即自动绑定this为当前组件。
    


- 与普通 HTML 的区别：

  - 对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰；
  - 对于事件函数处理语法，原生事件为字符串，react 事件为函数；
- react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地**调用`preventDefault()`来阻止默认行为。（使用 Stoppropagation 无效）**



## Fiber

### Q1. 为什么设计 Fiber，React 为什么需要 Fiber ？

**痛点**: React V15 在渲染时，会递归比对 VirtualDOM 树，找出需要变动的节点，然后同步更新它们， 一气呵成。这个过程期间， React 会占据浏览器资源，这会导致用户触发的事件得不到响应，并且会导致掉帧，**StackRecociler 是一个不可打断的渲染任务, 导致用户感觉到卡顿**。

- **递归对比虚拟 DOM 树，执行栈会越来越深。（没办法中断，用户会感觉卡顿）**
- **同步更新DOM，不能中断，中断后也不能恢复。**
- **JS 代码执行时间长，会持续占用主线程，出现渲染卡顿。**

**Fiber作用**:  保证贼应用持续复杂计算同时保证流畅的交互和视觉响应

- **实现虚拟 DOM 的增量渲染,避免主线程阻塞**
    - 能够将渲染工作拆分成块并将其分散到多个浏览器帧的能力。在新的更新到来时，能够暂停、中止和复用工作，能为不同类型的更新分配优先级顺序的能力，减少了单次执行JS执行时间
- **实现更新的优先级调度**
    - 任务可中断,为不同更新赋予不同优先级
        - 最高优先级:用户输入(打字、点击)
        - 中等优先级:动画更新
        - 低优先级:网络请求数据返回更新
- **为并发特性铺路**
    - useTransition/useDeferredVlaue 建立在Fiber可中断和可调度的能力之上

Fiber两阶段: 

- **渲染/调和阶段**: “可中断” 的异步阶段。
    - 构建“工作中”的 Fiber 树（work-in-progresstree）。
    - 计算出所有节点的变更。
    - 此过程可以被暂停、重做、丢弃，不会产生用户可见的副作用。

- 提交阶段: “不可中断”的同步阶段
    - 一旦调和阶段完成，进入提交阶段。
    -  将计算出的所有变更一次性应用到 DOM上。
    - 必须同步，以确保 UI的一致性，避免出现渲染了一半的界面。

### Q2. Fiber 为什么设计成链表结构？为什么中断执行后可以恢复？

fiber 对象中存储的元素上下文信息以及指针域构成的链表结构，使其能够**将执行到一半的工作保存在内存的链表中**。当 React 停止并完成保存的工作后，让出时间片去处理一些其他优先级更高的事情。之后，在重新获取到可用的时间片后，它能够根据之前保存在内存的上下文信息通过快速遍历的方式找到停止的 fiber 节点并继续工作。由于在此阶段执行的工作并不会导致任何用户可见的更改，因为并没有被提交到真实的 DOM。所以，**这种链表结构的 fiber 能让让调度能够实现暂停、中止以及重新开始等增量渲染的能力。**

### Q3. React Fiber 是如何实现更新过程可控？执行流程？

更新过程的可控主要体现在下面几个方面：

- 任务拆分
- 任务挂起、恢复、终止
- 任务具备优先级

**任务拆分**

在 React Fiber 机制中，它采用"化整为零"的思想，将**调和阶段（Reconciler）递归遍历 VDOM 这个大任务分成若干小任务**，每个任务只负责一个节点的处理。

**任务挂起、恢复、终止**

**workInProgress tree**： workInProgress 代表**当前正在执行更新的 Fiber 树**。在 render 或者 setState 后，会构建一颗 Fiber 树，也就是 workInProgress tree，这棵树在构建每一个节点的时候会收集当前节点的副作用，整棵树构建完成后，会形成一条完整的副作用链。

**currentFiber tree**：currentFiber 表示**上次渲染构建的 Filber 树**。在每一次更新完成后 workInProgress 会赋值给 currentFiber。在新一轮更新时 workInProgress tree 再重新构建，新 workInProgress 的节点通过 alternate 属性和 currentFiber 的节点建立联系。

在新 **workInProgress tree 的创建过程中，会同 currentFiber 的对应节点进行 Diff 比较，收集副作用**。同时也会复用和 currentFiber 对应的节点对象，减少新创建对象带来的开销。也就是说无论是创建还是更新、挂起、恢复以及终止操作都是发生在 workInProgress tree 创建过程中的。workInProgress tree 构建过程其实就是循环的执行任务和创建下一个任务。

**挂起**

当**第一个小任务完成后，先判断这一帧是否还有空闲时间，没有就挂起下一个任务的执行**，记住当前挂起的节点，让出控制权给浏览器执行更高优先级的任务。

**恢复**

**在浏览器渲染完一帧后，判断当前帧是否有剩余时间，如果有就恢复执行之前挂起的任务。**如果没有任务需要处理，代表调和阶段完成，可以开始进入渲染阶段。

1. 如何判断一帧是否有空闲时间的呢？

使用前面提到的 RIC (RequestIdleCallback) 浏览器原生 API，React 源码中为了兼容低版本的浏览器，对该方法进行了 Polyfill。

1. 恢复执行的时候又是如何知道下一个任务是什么呢？

答案是在前面提到的链表。在 React Fiber 中每个任务其实就**是在处理一个 FiberNode 对象，然后又生成下一个任务需要处理的 FiberNode。**

**终止**

其实并不是每次更新都会走到提交阶段。当在调和过程中触发了新的更新，在执行下一个任务的时候，判断是否有优先级更高的执行任务，如果有就终止原来将要执行的任务，开始新的 workInProgressFiber 树构建过程，开始新的更新流程。这样可以避免重复更新操作。这也是在 React 16 以后生命周期函数 componentWillMount 有可能会执行多次的原因。

### Q4. React 能否像 Vue 那样进行预编译优化

Vue3.0 提出动静结合的 DOM diff 思想，动静结合的 DOM diff其实是在预编译阶段进行了优化。之所以能够做到**预编译优化**，是因为 Vue core 可以**静态分析 template**，在解析模版时，整个 parse 的过程是利用**正则表达式**顺序解析模板，当解析到开始标签、闭合标签和文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。

**借助预编译过程**，Vue 可以做到的预编译优化就很强大了。比如在预编译时标记出模版中可能变化的组件节点，再次进行渲染前 diff 时就可以**跳过“永远不会变化的节点”**，而只需要对比“可能会变化的动态节点”。这也就是**动静结合的 DOM diff 将 diff 成本与模版大小正相关优化到与动态节点正相关的理论依据**。

Vue 需要做数据双向绑定，需要进行数据拦截或代理，那它就需要在**预编译阶段静态分析模版，分析出视图依赖了哪些数据，进行响应式处理**。而 React 就是**局部重新渲染**，React 拿到的或者说掌管的，所负责的就是一堆**递归 React.createElement** 的执行调用（参考下方经过Babel转换的代码），它无法从模版层面进行静态分析。[JSX 和手写的 render function是完全动态的，**过度的灵活性导致运行时可以用于优化的信息不足**。

- JSX 具有 JavaScript 的完整表现力，可以构建非常复杂的组件。但是**灵活**的语法，也意味着**引擎难以理解**，无法预判开发者的用户意图，从而难以优化性能。
- Template 模板是一种非常有**约束**的语言，你只能以某种方式去编写模板。

既然存在以上**编译时先天不足**，在运行时优化方面，React 一直在努力。比如，React15 实现了 batchedUpdates（批量更新）。即**同一事件回调函数上下文**中的多次 setState 只会触发一次更新。但是，如果单次更新就很耗时，页面还是会卡顿（这在一个维护时间很长的大应用中是很常见的）。这是因为 React15 的更新流程是同步执行的，一旦开始更新直到页面渲染前都不能中断。

### Q5. React hooks 的实现必须依赖 Fiber 吗?

React 的 hooks 是在 fiber 之后出现的特性，所以很多人误以为 hooks 是必须依赖 fiber 才能实现的，其实并不是，它们俩**没啥必然联系。**

在 React16 之前，会递归渲染这个 vdom，增删改真实 dom。而在 React16 引入了 fiber 架构之后就多了一步：首先把 vdom 转成 fiber，之后再渲染 fiber。**vdom 转 fiber 的过程叫做 reconcile**，最后增删改真实 dom 的过程叫做 commit。因为 vdom 只有子节点 children 的引用，没有父节点 parent 和其他兄弟节点 sibling 的引用，这导致了要一次性递归把所有 vdom 节点渲染到 dom 才行，不可打断。万一打断了会怎么样呢？因为没有记录父节点和兄弟节点，那只能继续处理子节点，却不能处理 vdom 的其他部分了。所以 React 才引入了这种 fiber 的结构，也就是有父节点 return、子节点 child、兄弟节点 sibling 等引用，可以打断，因为断了再恢复也能找到后面所有没处理过的节点。

所以 fiber 架构就分为了 schdule、reconcile（vdom 转 fiber）、commit（更新到 dom）三个阶段。

函数组件内可以用 hooks 来存取一些值，这些值就是存在 fiber 节点上的。不同的 hook 在 memorizedState 链表不同的元素上存取值，通过 next 串联起来，这就是 react hooks 的原理。

### Q7. Concurrent Mode

Concurrent Mode 指的就是 React 利用上面 Fiber 带来的新特性的开启的新模式 (mode)。react17开始支持concurrent mode，这种模式的根本目的是为了让应用保持cpu和io的快速响应，它是一组新功能，包括Fiber、Scheduler、Lane，可以根据用户硬件性能和网络状况调整应用的响应速度，核心就是为了实现异步可中断的更新。concurrent mode也是未来react主要迭代的方向。

目前 React 实验版本允许用户选择三种 mode：

1. Legacy Mode: 就相当于目前稳定版的模式
2. Blocking Mode: 应该是以后会代替 Legacy Mode 而长期存在的模式
3. Concurrent Mode: 以后会变成 default 的模式

Concurrent Mode 其实开启了一堆新特性，其中有两个最重要的特性可以用来解决我们开头提到的两个问题：

1. [Suspense (opens new window)](https://juejin.cn/post/6844903981999718407)：Suspense 是 React 提供的一种异步处理的机制, 它不是一个具体的数据请求库。它是React 提供的原生的组件异步调用原语。
2. [useTrasition (opens new window)](https://juejin.cn/post/6844903986420514823)：让页面实现 Pending -> Skeleton -> Complete 的更新路径, 用户在切换页面时可以停留在当前页面，让页面保持响应。 相比展示一个无用的空白页面或者加载状态，这种用户体验更加友好。

其中 Suspense 可以用来解决请求阻塞的问题，UI 卡顿的问题其实开启 concurrent mode 就已经解决的，但如何利用 concurrent mode 来实现更友好的交互还是需要对代码做一番改动的。

## JSX 是什么

JSX 是一个 JavaScript 的语法扩展，结构类似 XML。JSX 主要用于**声明 React 元素**，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，**通过 Babel 插件编译为 React.createElement**。所以 JSX 更像是 React.createElement 的一种语法糖。

## UI=f(State)

- 定义：UI = f（state） 精辟地概括了 React 的核心设计哲学：用户界面是应用状态的纯函数映射结果
- 逐一解释公式
  - state： 单一数据源，驱动UI 变化的唯一事实来源
  - f:（函数）组件，根据 state （和 props）返回UI描述
  - UI：虚拟 DOM，对 UI 的一种轻量级描述

- 通过对比凸显其价值
  - 命令式（如 jQuery）：手动逐步操作（.show()，addClass()）。
  - 声明式（React）：只声明特定状态下 UI 的样子，React负责更新。
    - 好处：可预测性、关注点分离。
- （加分项）提及 React 的工作机制：
  - state 变化->重新执行组件->比较虚拟DOM ->高效更新真实DOM。

## 虚拟 DOM

定义：`它本质上是一个轻量级的JavaScript对象，描述真实DOM的结构。`通过在内存中进行操作，`虚拟DOM减少了对真实DOM的直接操作，从而降低了重排和重绘的频率，提升了用户体验。`

- 核心思路：用JS对象模拟DOM，状态变化时，先在JS对象上计算和比较，找出最小差异，然后才将这些差异批量更新到真实DOM。
  - 关键步骤拆解：（最终效果：显著减少直接操作真实DOM的次数和范围，提升复杂应用下的渲染性能。）
    - `创建/更新虚拟DOM树`
    -  `Diff比较与Reconciliation（调和-找差异）`
    - `批量更新真实DOM`
- 核心强调：`虚拟DOM是在应用程序逻辑和浏览器真实DOM之间的一个重要抽象层和缓冲。`
- 对开发者的意义：
  - 大部分时间与轻量级JavaScript对象打交道。
  - 避免直接触碰和操作繁琐、昂贵的真实DOM。

- 核心价值：虚拟DOM 的核心在于`性能优化`
  - 减少 DOM 的操作次数与范围
  - 批量更新（Batching）多次合并到一次
  -  跨平台能力：
    - 基础：虚拟DOM是JS对象，不直接依赖浏览器环境
    - 应用案例：React Native、服务器端渲染SSR
  -  改善开发体验：
    - 编程范式：支持声明式编程，开发者更专注于数据和状态管
      理。
    - 降低复杂度：框架处理从数据到真实DOM的映射和高效更新，
      简化UI开发。

易错点：虚拟DOM并非总是更快！

**原因分析：**

- 简单应用或开发者能精确优化DOM操作时，直接操作可能更快。
-  虚拟DOM自身有JS计算开销

**虚拟DOM的真正优势：**

- 为复杂、动态、数据驱动应用提供声明式、易维护的UI更新方案。
- 保证多数复杂场景下有相对不错的性能下限。
- 用一定计算开销换取开发效率大幅提升和代码可维护性增强。

## 虚拟 Dom 的 Diff 算法原理/Key 的作用

![CgqCHl_qypGAZPuGAADYrK9nkJY878_mh1609406162857.jpg](https://cdn.nlark.com/yuque/0/2020/jpeg/1500604/1609406240365-40166729-9e07-43a2-a9f2-71838e830ad8.jpeg?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_33%2Ctext_5b6u5L-h5YWs5LyX5Y-377ya5YmN56uv5YWF55S15a6d%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fformat%2Cwebp%2Finterlace%2C1)

新旧 DOM 树之间快速找到对比差异，会进行以下策略

- `同层比较（Tree Diff）`：只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么 React 不会尝试复用他。 因为，Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
- `组件类型判断（Component Diff）`：div->p 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构
- **`元素类型判断（Element Diff）`**:递归比较子节点.对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。开发者可以通过 key 属性来暗示哪些子元素在不同的渲染下能保持稳定。
  - 列表节点的优化与key的重要性：渲染列表数据
- Key 的作用：借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系。

**缺点**

- 额外的JavaScript计算开销
- 首次渲染的轻微延迟
- 内存占用

## 函数组件和类组件本质的区别？

类组件（面向对象编程）：**底层只需要实例化一次，实例中保存了组件的 state 等状态。**对于**每一次更新只需要调用 render 方法以及对应的生命周期就可以了**。

- 核心机制
  - this 关键字（Class 处理 this 指向）
  - 生命周期方法（更新生命周期用于性能优化）
    - **装载阶段**（Mount），组件第一次在DOM树中被渲染的过程；
      - constructor：（初始化组件的 state、给事件处理方法绑定 this）
      - getDerivedStateFromProps：（返回一个对象用来更新当前的`state`对象，如果不需要更新可以返回 `null`。）
      - render：（只做一件事，就是返回需要渲染的内容）
      - componentDidMount：（执行DOM的操作、发送网络请求;(官方建议)、添加定时器、订阅消息（会在componentWillUnmount取消订阅）
    - **更新过程**（Update），组件状态发生变化，重新更新渲染的过程；
      - getDerivedStateFromProps：组件的props或state变化会触发更新
      - shouldComponentUpdate:(不让组件重新渲染进而提升性能,props和state均没发生变化、按理说会发生重新渲染)
      - getSnapshotBeforeUpdate：和componentDidUpdate一起使用，获取更新前的sate和props
      - componentDidUpdate：更新后会被立即调用，组件更新后，对 DOM 进行操作，对更新前后的props进行了比较,发送网络请求。
    - **卸载过程**（Unmount），组件从DOM树中被移除的过程；
      - componentWillUnmount() 会在组件卸载及销毁之前直接调用。（1. 清除 timer，取消网络请求或清除 2.取消在 componentDidMount() 中创建的订阅等）
  - 状态管理（state 异步更新）通过 props 获取
  - 组件实例

函数组件（面向函数编程）：**函数组件中，每一次更新都是一次新的函数执行，一次函数组件的更新，里面的变量会重新声明。**为了能让**函数组件可以保存一些状态，执行一些副作用钩子，React Hooks （处理副作用）应运而生，它可以帮助记录 React 中组件的状态，处理一些额外的副作用。**

- 核心机制
  - 函数 （Javascript）
  - 没有 this（不需要处理 this 问题）
  - Hooks（memo、callback 用于性能优化）

追问：使用 Hooks 时有没有什么需要特别注意的地方？比如所谓的闭包陷阱

- 什么是闭包陷阱：userEffect 回调
-  如何避免
  - 正确设置依赖项数组
  - 使用函数式更新
  - 使用 useRef

追问：从性能角度看，函数组件一定比类组件更好吗？

- 初始渲染和更新成本
- 关键在于"按需渲染“

## React Props的不可变性

- 不可变性：
  - 子组件接收到 Props 之后，不应该直接修改它。
  - Props 对象：“只读文件”，子组件可以读取，但不能涂改
  - 父组件数据变化，传递全新的 Props 给子组件

- 原因：
  - **保障清晰的单项数据流**
  - **性能优化 -浅比较**（使 React 调和过程更加高效）
    - 新旧 props 和 state 对比决定是否重新渲染
    - 父组件数据更新时，会传递一个全新的 Props 对象（引用地址不同）
    - 浅比较：比较新旧 Props 对象的内存地址是否相同
  - **提升组件的可预测性与调试效率**
  - **追踪变化和实现高级功能**：
    - 场景：撤销和重做
    - 提升组件的可预测：明确数据变化来源

### 子组件尝试直接修改 Props，会发生什么？

- **违反 React 设计原则**：这是一种反模式。
- **行为后果**：导致数据流混乱，组件行为不可预测。
- **性能影响**：破坏 React 依赖不可变性进行的性能优化。

### Props 不可变性如何帮助React 进行性能优化？

- 关键在于`"浅比较"`
- React.memo 或 PureComponent的优化手段依赖props浅比较
- 反面论证：如果 Props是可变的，浅比较将失效

### 子组件需改变父组件数据，正确做法是？

-  正确模式：“状态提升"
- 核心思想：数据的修改权始终在父组件，数据流依然单向，Props的不可变性得到遵守。

## 类组件中的 setState 和函数组件中的 useState 有什么异同？

**相同点**：

首先从原理角度出发，setState和 useState 更新视图，**底层都调用了 `scheduleUpdateOnFiber` 方法**，而且事件驱动情况下都有**批量更新规则**。

**不同点**：

- 在不是 `pureComponent` 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 **useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。**
- setState 有专门监听 state 变化的回调函数 callback，可以获取最新state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。
- setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。

## Hooks 

### UseState

- **保证状态更新的准确性**（异步操作和批量更新）

  - `setState(prevState => newState)函数式更新`：`prevState`参数是当前最新的状态。

  - `setState(value)`：这个 state 变量可能是异步回调或多次调用时的旧值。

- **适用于状态更新逻辑复杂或依赖先前状态的场景**
  - 如果新的状态需要基于前一个状态进行计算，函数式更新提供了一种更安全和声明式的方式来表达这种转换。

- 在某些情况下有助于 React 的批量更新优化（可选补充）
  - 函数式更新因为其纯粹性（不依赖外部变量，只依赖传入的 `prevState`），有时能更好地配合 React 的内部优化机制：例如处理“**stale closure**”（过时闭包 三次调用拿到都是一次的值）问题、快速连续事件、异步回调等。



### useEffect/useLayoutEffect 有什么区别？

useEffect和useLayoutEffect 最主要的区别是`执行时机`的不同， `useEffect： 浏览器完成渲染和绘制之后异步执行。不阻塞绘制，页面响应更快。useLayoutEffect: DOM 更新之后、浏览器实际绘制之前同步执行。会阻塞绘制，耗时操作可能导致卡顿。`

- useEffect：异步副作用处理
  - 用于处理**数据获取、订阅、手动 DOM** 更改等副作用。
  - 核心特点：`异步执行`
  - 好处：`不阻塞浏览器渲染`，应用更流畅。（浏览器完成布局后异步执行）
  - 典型场景：
    - 更通用，大部分副作用操作优先使用
    - 场景：数据请求（挂载后异步请求）、事件监听、设置和清除订阅、非严格绘制前 DOM 操作（聚焦输入框、集成第三方库、滚动高亮元素（滚动本身异步））。
    - 目的：避免阻塞渲染，提升用户体验
- useLayoutEffect：同步布局调整
  - 与"Layout”（布局）紧密相关，用于**DOM 操作后、绘制前**调整。
  -  核心特点：`同步执行`
  -  注意：`会阻塞浏览器绘制过程`
  - 典型场景
    - 主要用于需在浏览器绘制前同步完成的 DOM 操作。
    - 场景：读取 DOM 布局信息并同步更新 DOM（如动态计算Tooltip 位置、动态图表尺寸）。
    - 目的：**避免用户看到视图闪烁**

### UseEffect 依赖项数组原理与应用

现象：没有依赖项，但是在内部使用 setState 会造成无限循环的问题。

- 依赖项是空数组：1.获取初始数据 2.设置定时器或者订阅 3. 添加全局事件监听器
  - 过时闭包：

- 含依赖项数组：对比数组里面的依赖项和上一次对比如果有区分就执行函数
  - 原理：Object.is //比较 基础类型和引用类型 

回答：

1. 点明核心作用

- `'useEffect'`的依赖项数组，其核心目的是**精确控制副作用函数的执行时机**。
- 优化性能，避免不必要的计算或 API 调用。
- 确保 effect 内部能访问到最新的 props 和 state。

2. 分类讨论

- 不提供依赖项数组
  - effect 会在每次组件渲染（包括首次渲染和所有更新）后执行。
- 提供一个空数组 `[]`
  - effect 只会在组件首次挂载（mount）后执行一次，其**返回的清理函数会在组件卸载（unmount）时执行一次**。
- 提供一个包含依赖项的数组 `['dep1', 'dep2']`
  - 首次挂载后执行，后续的每一次渲染后，React 会使用 `Object.is()` 算法比较数组中每一个依赖项的当前值和上一次渲染时的值。

3. 强调关键概念和注意事项

- **`Object.is()` 比较机制**：
  - 原始类型，比较的是值；引用类型，比较的是引用地址。
- **过时闭包 (Stale Closure)**。在函数中使用 state 但是又没有在依赖项里面声明。
- **ESLint 插件**：
  - `eslint-plugin-react-hooks`。

4. （加分项）提及相关优化手段

- 依赖项是**函数**
  - 使用 `useCallback` 来记忆函数（依赖项是函数），以避免不必要的重新创建。
- 依赖项是**复杂对象或数组**
  - 使用 `useMemo` 来记忆计算结果，避免在每次渲染中重复计算。
- dispatch 函数
  - 引用是永久稳定的，所以可以安全地把它们加入依赖项数组。

### UseEffect 如何正确处理异步操作



**为何不能直接将回调定义为 `async`?**

- `useEffect` 的副作用回调期望**同步执行**，或者返回一个**清理函数**、或者返回 `undefined`。
- `async` 函数会隐式地返回一个 `Promise` 对象。
- 如果回调直接标记为 `async`，React 会错误地将该 `Promise` 当作返回值处理，导致错误或非预期行为。

关键点总结

- 将回调设置为 `async` 使得 `useEffect` 的行为不符合预期，可能导致未定义的副作用行为或错误。

- **结论**：`useEffect` 的回调函数本身不能是 `async` 函数。
- **正确做法**：在回调函数内部定义并调用 `async` 函数。

**竞态条件**

- 场景：**prop 变化触发请求 A**，当请求 A 未完成时，prop 再次变化触发请求 B。如何处理快速操作引发的多个异步请求，保证数据最新？
  - 组件卸载前异步完成，更新未挂载组件。
  - 依赖项变化，新请求发出，旧请求结果晚到导致数据陈旧日。

问题：请求 A（旧请求）比请求 B（新请求）更晚返回。

结果：界面数据可能被过时的请求 A 结果覆盖，从而导致数据不一致。

- **解决**：
  - `布尔标记`：
    - 机制：在 `useEffect` 内部维护一个局部布尔变量（如 `isActive`），初始值为 `true`。
    - 执行：在异步回调中检查此标记，仅当其为 `true` 时才更新状态。
    - 清理：在 `useEffect` 的清理函数中将该标记设为 `false`，以阻止过时回调的执行。
  - `AbortController`：
    - 创建 `AbortController` 实例：   - 在 `useEffect` 中创建一个 `AbortController` 实例。   - 通过调用 `controller.signal` 来获取信号。 
    -  发起请求：   - 将信号 (`controller.signal`) 作为选项传递给 `fetch` 等异步请求。   - 使得请求可以被中止。 
    -  清理函数：   - 在 `useEffect` 的清理函数中调用 `controller.abort()`，以取消任何未完成的请求。 这防止了旧请求的结果覆盖新请求的结果。 

### UseContext 的性能优化

`useContext` 的性能困境

- **核心问题**

  - 当 Provider 的 `value` 更新时，所有使用 `useContext` 的消费者组件均会重渲染，即使它们依赖的数据未发生变化。

- 背后原因

  - `useContext` 订阅的是完整的 Context 对象。

  - `React 通过比较 value 的引用来判断是否发生变更`，这导致即使数据未变化也触发重新渲染。

- 机制缺陷

  - 相较于 Redux 的 `useSelector`，`useContext` 不允许进行更细致的部分比较。

  - 这使得性能优化受到限制，特别是在 Context 中存储的值方面。

- 解决方案：
  - `拆分 Context：`
    - 将庞大、包罗万象的全局 Context 分解更小、职责更单一的Context
    - 组件按需订阅真正关心的 Context，减少无关更新的影响
    -  核心思想：让组件只订阅其所需的最少信息集合
  - `使用 useMemo 稳定 Provider`
    - **问题**：
      - 当 Provider自身重渲染时，若为 value创建新对象或数组，将导致不必要的重渲染。
    - **解决方案**：
      - 使用 useMemo包装传递给 Context.Provider的 value 属性。
    - **效果**：
      - 确保 `value` 的引用仅在其依赖项真正发生变化时才更新，从而减少不必要的渲染，提升性能。

### UseReducer 和 UseState 区别？--状态

`useState` 适合简单的、独立的局部状态，而 `useReducer` 适合复杂的、有内在逻辑联系的状态。

- **`useState` (指令式更新)**：你直接告诉 React “**我要把状态变成具体什么样**”。
    - *工作模式*: `const [state, setState] = useState(initialState)`
    - *更新动作*: `setState(newState)`
- **`useReducer` (声明式动作)**：你不直接修改状态，而是告诉 React “发生了什么事情（Action）”，然后由一个专门的函数（Reducer）集中处理这些事情，并决定状态该怎么变。
    - *工作模式*: `const [state, dispatch] = useReducer(reducer, initialState)`
    - *更新动作*: `dispatch({ type: 'INCREMENT' })`

- useReducer使用：当组件状态逻辑复杂时，如：
  - 状态对象含多个子值，或下一状态计算依赖前一状态，**状态依赖**。
  - **更新逻辑分散**在组件的多个事件处理函数中。
- useReducer 与 Redux 区别: 
  - useReducer 主要用于**组件内部或有限跨组件共享**，非全局状态管理方案。
- 优势
  - 代码结构更清晰，可维护性更好：**状态转换规则集中**。
  - 优化的dispatch 传递：**稳定的 dispatch 引用利于子组件性能优化。**
  - 易于单元测试：reducer 是纯函数，核心状态逻辑可独立测试。

`useReducer` 简介

- 基本语法

  ```javascript
  const [state, dispatch] = useReducer(reducer, initialArg, init?);  
  ```
  
  - 核心在于reducer 函数：（currentState, action）=> newState
  
  - action通常包含type（操作类型）和 payload（数据）。

- 优势 1：复杂状态逻辑的集中管理
  - 将复杂状态的更新逻辑集中到 reducer 函数中。
  - 所有状态转换规则清晰定义，通过 action.type 区分。
  - 增强代码意图明确性、可读性和可维护性。
- 优势 2：优化的dispatch传递
  - 传递给深层子组件时，只需传递一个 dispatch 函数。
  - React 保证 dispatch 函数的引用是稳定的。
  - 有助于性能优化，避免因 prop 引用变化导致不必要的重渲染（配合React.memo）。

- 核心优势3：可测试性增强
  - reducer 函数是一个纯函数。
  - 相同输入（currentstate,action）总返回相同输出（newState）
  - 状态管理逻辑易于进行单元测试，独立于组件渲染。

- 核心优势4：更清晰的 Action流
  - 通过 dispatch（{type:"INCREMENT",payload:10}）触发更新。
  - action 对象清晰描述了操作意图和所需数据。
  - 有助于调试和理解复杂状态的流转过程。

### UseCallback 和 Usememo

`useMemo` 和 `useCallback` 都是 React 提供的 Hooks，用于优化组件性能，但它们的用途和工作方式略有不同：

- **useMemo**：
  - `useMemo` 用于`计算一些复杂的值，缓存计算结果`，并且这些值在组件的渲染过程中可能被多次调用。
  - 它接受两个参数：一个函数和一个依赖数组。React 会缓存这个函数的返回值，并`仅在依赖项改变时重新计算`。
  - 通常用于性能优化，避免在每次渲染时都进行昂贵的计算。
- **useCallback**：（UseMemo 的语法糖）
  - `useCallback` 用于`缓存函数，缓存函数的引用`，避免在每次渲染时都重新创建函数实例。
  - 它接受两个参数：一个函数和一个依赖数组。React 会缓存这个函数，并仅在依赖项改变时重新创建。
  - 通常用于传递给子组件或传递给其他库，以避免不必要的重新渲染。
  - 应用场景：
    - 将回调传递给优化的子组件：特别是用React.memo 包裹的、依赖props 引用相等性的子组件。
    - 回调函数作为其他Hook 的依赖项：如 useEffect，useEffect，useMemo，确保函数依赖项稳定，避免不必要重复执行。

- 滥用的后果
  - 性能开销：Hook 自身有执行成本，可能超过收益，甚至拖慢性能。
  - 代码复杂度和可维护性：降低代码直观性和可读性，增加维护难度。
  - 不应盲目使用，关键在于识别真正的性能瓶颈并针对性优化。
    - 性能分析 （Profiling） 是王道：使用 React DevTools Profiler 定位瓶颈。
    - 经验法则：
      -  子组件因对象/函数 props 引用变化而频繁不必要重渲染。
      - useEffect 因其函数依赖引用频繁变化而重复执行。 -> useCallBack
      - 计算逻辑确实非常耗时（几十毫秒以上）且输入不常变化时 -> useMemo

### UseRef 常见用途

- 定义：
  - 调用 useRef（initialvalue）返回一个可变的 ref 对象。
  - 此对象有重要属性：.current。
  - useRef 返回的 ref 对象在组件整个生命周期内保持不变。
  - `关键点`：当你修改 myRef.current 的值时，React 并**不会触发组件的重新渲染**。（这是 useRef 和usestate 最根本的区别。）
    - useState：UI 自动更新，触发组件的重新渲染
    - useRef: 不希望变化而触发 UI 更新的可变值，修改.current，不会触发组件的重新渲染。

- UseState 和 UseRef 的区别
  - useRef 和 usestate 最根本的区别在于`是否会触发组件的重新渲染。`
    - useState 更新状态会触发渲染，界面反映最新状态。
    -  useRef 修改 .current 值本身不导致组件重渲染；ref 对象生命周期内不变。
  - useRef 设计目的和主要用途分类
    - **访问和操作 DOM元素**：最广为人知；`获取焦点、触发动画、测量尺寸`等。
    -  存储可变的、与渲染无关的值：持久化数据但不触发渲染；如定时器ID、追踪上次 props/state。

### React.forwardRef 和 UseImperativeHandle

- React.forwardRef 定义
  - 主要解决父组件需获取其子函数组件内部特定 DOM元素或子类组件实例 ref 的场景。
  - 默认情况下，函数组件不能直接通过 props 接收 ref，ref 属性会被 React 忽略。
  - forwardRef 允许函数组件接收ref 作为第二参数，并将其“转发”给内部子元素。

- React.forwardRef 价值
  - **核心价值**：**使自定义函数组件在ref 行为上能像原生 HTML元素或类组件一样。**
  - 允许父组件获取内部特定节点引用，进行命令式操作（如聚焦），同时保持封装性。
  - 比喻：forwardRef 像是给函数组件开了个“后门”，父组件传入“遥控器”（rref），子组件连接到特定“电器”（DOM）。

- UseImperativeHandle：解决直接暴露 DOM 全部控制权
  - `一个 React Hook，用于自定义暴露给父组件的 ref 实例值。`
  - `核心要求：必须和 React.forwardRef 一起使用。`
  - `工作流程：父组件传 ref-> 子组件 forwardRef 接收-> useImperativeHandle 定义 ref.current。`

- 为什么需要useImperativeHandle ？
  - `增强封装性`：避免直接暴露内部 DOM 或完整子组件实例。
  - `定义清晰的命令式 API`：允许子组件提供更明确、受控的方法。
  - `解耦`：父组件依赖抽象接口，而非具体 DOM 实现。
- 如何使用useImperativeHandle
  - 接收三个参数：ref、createHandle回调、可选的 dependencies 数组。
  - createHandle：返回一个对象，该对象赋值给父组件的ref.current
  - dependencies：控制 createHandle 何时重新执行，更新句柄。



React Hook

- **让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref ，也能做数据缓存。**
- **解决逻辑复用难的问题。**
- **放弃面向对象编程，拥抱函数式编程。**

## 自定义 Hooks

自定义 hooks 解决逻辑复用的问题，那么在正常的业务开发过程中，要明白哪些逻辑是**重复性强的逻辑**，这段逻辑主要功能是什么。

### 接收状态

自定义 hooks ，可以**通过函数参数来直接接收组件传递过来的状态**，也可以通过 useContext ，来隐式获取上下文中的状态。比如 React Router 中最简单的一个自定义 hooks —— useHistory ，用于获取 history 对象。

```js
export default function useHistory() {
    return useContext(RouterContext).history
}
```

注意：**如果使用了内部含有 useContext 的自定义 hooks ，那么当 context 上下文改变，会让使用自定义 hooks 的组件自动渲染。**

### 存储｜管理状态

**储存状态**

自定义 hooks 也可以用来储存和管理状态。本质上`应用 useRef 保存原始对象的特性`。

比如 `rc-form` 中的 `useForm` 里面就是用 useRef 来保存表单状态管理 Store 的。简化流程如下

**记录状态**

当然 `useRef 和 useEffect 可以配合记录函数组件的内部的状态`。举个例子，我编写一个自定义 hooks 用于记录函数组件执行次数，和是否第一次渲染。

### 更新状态

**改变状态**

`自定义 hooks 内部可以保存状态，可以把更新状态的方法暴露出去，来改变 hooks 内部状态。`而更新状态的方法可以是组合多态的。

比如实现一个防抖节流的自定义 hooks ：

```js
export function debounce(fn, time) {
    let timer = null;
    return function(...arg) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arg);
      }, time);
    };
}

function useDebounceState(defauleValue,time){
    const [ value , changeValue ] = useState(defauleValue)
    /* 对 changeValue 做防抖处理   */
    const newChange = React.useMemo(()=> debounce(changeValue,time) ,[ time ])
    return [ value , newChange ]
}
```

使用：

```js
export default function Index(){
    const [ value , setValue ] = useDebounceState('',300)
    return <div style={{ marginTop:'50px' }} >
        《React 进阶实践指南》
        <input placeholder="" onChange={(e)=>setValue(e.target.value)}  />
    </div>
}
```

**组合state**

自定义 hooks 可以维护多个 state ，然后可以组合更新函数。我这么说可能很多同学不理解，下面我来举一个例子，比如控制数据加载和loading效果，

```js
function useControlData(){
    const [ isLoading , setLoading ] = React.useState(false)
    const [ data,  setData ] = React.useState([])
    const getData = (data)=> { /* 获取到数据，清空 loading 效果  */
        setLoading(false)
        setData(data)
    }  
    // ... 其他逻辑
    const resetData = () =>{  /* 请求数据之前，添加 loading 效果 */
        setLoading(true)
        setData([])
    }
    return [ getData , resetData , ...  ] 
}
```

**合理state**

useState 和 useRef 都可以保存状态：

- useRef 只要组件不销毁，一直存在，而且可以随时访问最新状态值。
- useState 可以让组件更新，但是 state 需要在下一次函数组件执行的时候才更新，而且如果想让 useEffect 或者 useMemo 访问最新的 state 值，需要将 state 添加到 deps 依赖项中。

自定义 hooks 可以通过 useState + useRef 的特性，取其精华，更合理的管理 state。比如如下实现一个**同步的state**

- useRef 用于保存状态 ，useState 用于更新组件。
- 做一个 `dispatch` 处理参数为函数的情况。在 dispatch 内部用 forceUpdate 触发真正的更新。
- 返回的结构和 useState 结构相同。不过注意的是使用的时候要用 value.current 。

#### 执行副作用

自定义 hooks 也可以执行一些副作用，比如说`监听一些 props 或 state 变化而带来的副作用`。比如如下监听，当 `value` 改变的时候，执行 `cb`。



### 举例：倒计时

```js
import { useState, useEffect, useRef } from "react";

/**
 * 自定义倒计时 Hook
 * @param {number} initialSeconds 初始倒计时秒数
 * @param {boolean} autoStart 是否在挂载时自动开始
 * @returns {object} { seconds, isRunning, start, pause, reset }
 */
export function useCountdown(initialSeconds, autoStart = false) {
  // 当前剩余秒数
  const [seconds, setSeconds] = useState(initialSeconds);
  // 是否正在倒计时
  const [isRunning, setIsRunning] = useState(autoStart);

  // 保存定时器 ID，避免闭包问题
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      // 开始计时，每隔 1s 更新一次
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false); // 倒计时结束，停止
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // 清理定时器，防止内存泄漏
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  /** 开始倒计时 */
  const start = () => {
    if (seconds > 0) setIsRunning(true);
  };

  /** 暂停倒计时 */
  const pause = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  /** 重置倒计时 */
  const reset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(initialSeconds);
  };

  return { seconds, isRunning, start, pause, reset };
}
```

### 举例：自动上报 pv/click 的埋点 hooks

实现一个能够自动上报 点击事件 | pv 的自定义 hooks 。通过这个自定义 hooks ，将带来的收获是：

- 用 `useContext` 获取埋点的公共信息。当公共信息改变，会统一更新。
- 用 `useRef` 获取 DOM 元素。
- 用 `useCallback` 缓存上报信息 reportMessage 方法，里面获取 useContext 内容。把 context 作为依赖项。当依赖项改变，重新声明 reportMessage 函数。
- 用 `useEffect`监听 DOM 事件，把 reportMessage 作为依赖项，在 useEffect 中进行事件绑定，返回的销毁函数用于解除绑定。

**依赖关系：** context 改变 -> 让引入 context 的 reportMessage 重新声明 -> 让绑定 DOM 事件监听的 useEffect 里面能够绑定最新的 reportMessage 。

如果上述没有分清楚依赖项关系，那么 context 改变，会让 reportMessage 打印不到最新的 context 值。

### 在项目中，你如何保证自定义Hook的质量和稳定性？你会如何对一个封装了异步请求（如useFetch）的Hook进行测试？

**强调测试的重要性**
首先，明确自定义 `Hook 是封装核心逻辑和副作`
`用的载体`，其稳定性至关重要，因此单元测试
是必不可少的质量保障手段。

**引入核心测试库**（做法）
会引入社区主流的@testing-library/react-hooks这个库，因为它能提供一个隔离的宿主环境来渲染和测试 Hook，避免了手动创建测试组件的麻烦。

**分场景阐述测试策略**

- **初始状态**：`renderHook`渲染 Hook，通过`result.current（访问 Hook 的返回值）` 来断言

- **状态更新**：会触发状态变更的函数，必须将调用操作包裹在`act（）（包裹状态更新）`中，

- **Props 变更**：Hook 依赖于外部传入的props时，使用`rerender（模拟组件重渲染）` 函数来模拟组件的重渲染

- **异步逻辑**：包含异步操作，Mock真实请求，使用`waitFor（处理异步断言）` 等异步工具

## React 15/16/17/18 的架构有什么区别

React渲染页面的两个阶段

- 调度阶段（reconciliation）：在这个阶段 React 会更新数据生成新的 Virtual DOM，然后通过Diff算法，快速找出需要更新的元素，放到更新队列中去，**得到新的更新队列**。
- 渲染阶段（commit）：这个阶段 React 会遍历更新队列，**将其所有的变更一次性更新到DOM上**。

**React15 架构**

React15 架构可以分为两层：

- Reconciler（协调器）—— 负责找出变化的组件；
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上；

在 React15 及以前，Reconciler 采用递归的方式创建虚拟 DOM，**递归过程是不能中断的**。如果组件树的层级很深，递归会占用线程很多时间，递归更新时间超过了16ms，用户交互就会卡顿。

为了解决这个问题，React16 将递归的无法中断的更新重构为**异步的可中断更新**，由于曾经用于递归的虚拟 DOM数据结构已经无法满足需要。于是，全新的 Fiber 架构应运而生。

**React 16 架构**

为了解决同步更新长时间占用线程导致页面卡顿的问题，也为了探索运行时优化的更多可能，React 开始重构并一直持续至今。重构的目标是实现 Concurrent Mode（并发模式）。

从 v15 到 v16，React 团队花了两年时间将源码架构中的 Stack Reconciler 重构为 Fiber Reconciler。

React16 架构可以分为三层：

- Scheduler（调度器）—— **调度任务的优先级**，高优任务优先进入Reconciler；
- Reconciler（协调器）—— 负责找出变化的组件：**更新工作从递归变成了可以中断的循环过程。Reconciler内部采用了Fiber的架构**；
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上。

**React 17 优化**

React16 的 expirationTimes 模型只能区分是否 >=expirationTimes 决定节点是否更新。React17 的 lanes 模型可以选定一个更新区间，并且动态的向区间中增减优先级，可以处理更细粒度的更新。

Lane 用二进制位表示任务的优先级，方便优先级的计算（位运算），不同优先级占用不同位置的“赛道”，而且存在批的概念，优先级越低，“赛道”越多。高优先级打断低优先级，新建的任务需要赋予什么优先级等问题都是Lane 所要解决的问题。

Concurrent Mode的目的是实现一套可中断/恢复的更新机制。其由两部分组成：

- 一套协程架构：**Fiber Reconciler**
- 基于协程架构的[启发式更新算法 (opens new window)](https://zhuanlan.zhihu.com/p/182411298)：控制协程架构工作方式的算法

**React 18** 

- React 18之前的渲染：`同步、阻塞式。`
    - UI 卡顿：长时间占用主线程，界面无响应。
    - 交互延迟：用户操作响应缓慢。
    - 动画掉帧：无法及时绘制下一帧，动画不流畅。
- **React 18 并发**：渲染过程`可中断、可调度。（避免长时间调用主进程）`
    - 可中断性（Interruptibility）：渲染过程可以被打断。
    - 优先级调度（Priority Scheduling）：React 能区分任务的紧急程度。
    - 注意：并发非并行，JavaScript 仍是单线程，`并发是任务调度策略（分配主线程的任务）`。
- 核心痛点：提升复杂操作下的用户体验。（输入框搜索展示列表）

- **并发核心机制**：
    - 可中断的渲染 （Interruptible Rendering）：可暂停、恢复或放弃渲染
    - 时间分片（Time Slicing）：将工作分解成小块，间歇执行。
    - 优先级调度（Priority Scheduling）：高优任务可打断低优任务。
    - Transitions （ startTransition,useTransition）：标记非紧急更新。
        - 通过新 API 如 startTransition 和和 useTransition 利用并发。
        - 用startTransition标记非紧急 UI 更新（如数据获取后列表渲染）
        - “标记为'过渡”的更新，React 会低优处理，允许被用户交互打断。
    - UsedeferredValue：推迟值的更新，不阻塞当前渲染。

#### React18 UseId

面试回答

> [!NOTE]
>
> - 核心价值：useid 是 React 18的Hook，**解决客户端与服务端渲染时生成稳定且唯一ID 的问题**，对 SSR hydration 和 Web 可访问性（ARIA 辅助技术）至关重要。
> - SSR 问题：传统动态 ID（如 Math.random（））在SSR中易导致服务端与客户端ID 不匹配，引发 hydration 失败或警告。
> - useid 方案：确保相同组件层级下，服务端与客户端为同一useId，调用生成的ID 相同，避免 hydration mismatch。

- 定义
  - React 18 新增的一个 Hook
  - 用于生成在服务端和客户端之间都保持一致的、稳定的、唯一的ID
  - 其“一致性”和“稳定性”是解决特定问题的关键
- 解决痛点
  - **SSR**：动态 ID 可能导致 Hydration Mismatch问题：
    - 服务器渲染的 HTMLID 与客户端 hydration 时生成的ID 不一致（如使用 Math.random（）或简单计数器）
    - useId：通过确定性算法，保证相同组件树结构下，服务端和客户端
      为同一组件生成的ID 相同，解决不匹配问题。
  - **可访问性：**
    - Web 可访问性（Accessibility, a11y 残障人士）依赖于稳定的ID例如：<label>的htmlFor 指向 <input> 的id；
    - ARIA 属性的关联不稳定或冲突的ID 会破坏这些关联，影响辅助技术
    - useId：生成唯一且稳定的ID，非常适合创建可靠的可访问性链接
- 设计机制
  - ID 生成基于组件在 React 树中的路径和顺序只要组件树结构在服务端和客户端之间保持一致，ID 就能保证一致
  - 重要提示：useId 不应用于生成列表中的 key（列表 key 需基于数据本身稳定）

- 多个ID 的最佳实践
  - `避免多次调用`：当一个组件内部需要多个ID 时，不推荐为每个ID 都调用一次 useId（）。
  - 推荐做法：调用一次 useId（）获取一个基础ID。
  - 派生ID：通过`为基础ID 添加有意义的、唯一的后缀来生成其他相关的ID`，这样更高效，且ID 间的关联性更清晰。



#### React18 useTransition 和usedeferredValue

- 区别
  - **控制点不同**
    - useTransition：允许你**包裹状态更新的逻辑（setState）**。你明确指定哪个更新是低优先级的。
    - useDeferredValue：允许你**包裹一个值（通常是 props 或派生状态）**。关注的是值的延迟版本，而非更新过程。
  - **API与反馈机制**
    - useTransition：**返回 LsPending 状态和 startTransition 函数。**isPending 可直接用于展示加载 UI。
    - useDeferredValue：**仅返回一个延迟后的值。**如需加载状态，通常需自行比较原始值和延迟值（e.g. text ！== deferredText）。
  - 应用场景：
    - useTransition：当你能控制导致性能问题的状态更新代码，并希望明确**标记这些更新为低优先级时**。
      - 搜索/筛选大型列表
      - 编辑器草稿与实时预览（编辑器和预览内容是分别状态）
    - useDeferredValue：当你无法直接控制值的更新源头（如 props），但希望基于此**值的组件渲染能延迟执行时。**
      - 外部数据源的图表/可视化
      - 编辑器草稿与实时预览（编辑器和预览内容是相同状态）

- **memo vs 并发特性 Hooks**
  -  React.memo：通过 props 浅比较，避免组件不必要的重渲染。
  - useTransition / useDeferredValue ：处理必要的但耗时过长的渲染，调度其“时机”和“优先级”。
  - 可以协同工作：例如，列表项组件用 memo优化，整个列表的更新用useTransition调度。
- useTransition ：标记“不那么紧急”的更新
  - 允许将状态更新标记为“过渡（Transition）”，降低其优先级。
  - 返回 isPending（布尔值，指示过渡是否待处理）和 startTransition（函数，用于包裹低优先级状态更新）。
  - **核心**：`控制状态更新的“时机”或“优先级”`，避免阻塞高优先级交互。 
- useDeferredvalue：获取一个“延迟”的值
  - 接收一个值，并返回该值的“延迟（Deferred）”版本。
  - 延迟版本的值会在紧急更新（如用户输入）完成后才会更新。
  - 核心：**提供一个值的“副本”，此副本的更新被推迟**，以避免阻塞主渲染。

## 全局状态管理:Redux/Context API/Zustand/Jotai（原子化）

###  React 内置方案简介

- **`useState`**：
  - 用于在函数组件中管理局部状态。
- **`useReducer+useContext`**：**主题切换**
  - 更复杂的状态管理方案，适用于管理具有复杂更新逻辑的状态。
  -  核心："我会考虑使用 useContext 结合 useReducer。useReducer 负责定义和管理状态变更逻辑，useContext 则将产生的 state 和dispatch 函数轻松地共享给所有需要的子组件。"
  - 优点：代码简洁、React原生、易于理解和上手。
  - 局限性/注意事项：
    - Context 的value 变化会导致所有消费者重新渲染，注意优化。
    - 对于超大型应用，可能缺乏 Redux 的一些高级功能（如中间件、强大的 DevTools）。
- **Context API**：内置
  - 提供了一种在组件树中跨层级传递数据的方式，无需通过 props 一层一层传递。
  - 适用场景：
    - 中小型应用，全局状态数量有限。
    - 主题切换、用户认证信息等。
  - 缺点：
    - 性能问题：Context值频繁变更，所有消费者组件会重新渲染

### Redux

<img src="https://jonny-wei.github.io/blog/images/react/redux1.png" alt="redux1" style="zoom:33%;" />

- 核心
  - 可预测的状态容器：Redux 遵循 `Flux 架构`，旨在管理应用的状态。
    - 单向数据流
    - state 只读，通过 action 执行 reducer
    - 纯函数执行

- 适用场景
  - 多人协作：在需要严格数据流管理的应用中，Redux 特别有效。

- 优点

  - **强大的 DevTools**：提供时间旅行调试功能，让开发者能够方便地跟踪状态变化。**庞大成熟的生态系统**：丰富的**中间件**支持，如 Saga 和 Thunk，增强了 Redux 的灵活性与扩展能力。
  - **Redux Toolkit (RTK)**：大幅简化样板代码，提高开发效率，推荐在新项目中使用。
    - 特性：`减少 Redux 繁琐模板`
      - configureStore（）：`便捷性`
        - 简化配置：自动合并 reducers，默认集成 Redux Thunk 和 Redux DevTools。
      - createSlice（）
        - 告别冗余
        -  内置 Immer
        -  createAsyncThunk标准化异步
      - immerjs：生成不可变更新结果（基于 JS 的 proxy）
        - 核心机制
          - 草稿状态（Proxy with copy）
          - Proxy 拦截修改操作
          - 结构共享优化

- 缺点/注意点

  - 复杂性：即使有 RTK，对于简单的场景，Redux 的使用可能显得“重”。
  - 代码冗余 （Boilerplate）
  - Store 配置复杂：
    - 手动组合reducers
    - 手动应用 middleware（如 Thunk, Saga）
    -  手动配置 Redux DevTools
    - Immutable 更新易错：
    - 必须手动编写不可变更新逻辑异步操作处理：官方未内置

- 思想：

  - **发布订阅思想**: redux 可以作为发布订阅模式的一个具体实现。redux 都会创建一个 store ，里面保存了状态信息，改变 store 的方法 dispatch ，以及订阅 store 变化的方法 subscribe 。
  - **中间件思想**:  强化 dispatch ，传统的 dispatch 是不支持异步的，但是可以针对 Redux 做强化，于是有了 `redux-thunk`，`redux-actions` 等中间件(通过applyMiddleware 注册)，包括 dvajs 中，也写了一个 redux 支持 promise 的中间件。

- **原理**：

  - Provider 注入 Store

  - Subscription 订阅器

  - connect 控制更新（高阶函数）

    - connect 的 selector 有什么用？就是通过 mapStateToProps ，mapDispatchToProps ，`把 redux 中 state 状态合并到 props 中，得到最新的 props 。`
    - 每一个 connect 都会产生一个新的 Subscription ，和父级订阅器建立起关联，这样`父级会触发子代的 Subscription 来实现逐层的状态派发。`
    - 就是 Subscription 通知的是 checkForUpdates 函数，checkForUpdates 会形成新的 props ，与之前缓存的 props 进行浅比较，如果不想等，那么说明 state 已经变化了，直接触发一个useReducer 来更新组件。

  - <img src="https://jonny-wei.github.io/blog/images/react/redux3.png" alt="redux3" style="zoom:33%;" />

### Zustand

基于 Hooks 的状态管理

-  核心：轻量级、简洁的状态管理

- 适用场景：适用于从小型到大型项目，特别追求简洁高效的开发体验。

- 优点

  - **简单的 API**：使用非常简单，上手快，样板代码少。

  - **灵活性**：不强制特定目录结构，根据项目需求灵活组织。

  - **异步操作友好**：对异步操作支持良好，性能表现出色。

- 缺点/注意点

  - **生态系统较小**：
    - 相较于 Redux，相关的生态系统和工具支持相对较小。

  - **DevTools 体验较差**：
    - 调试工具的体验可能不如 Redux 完善，功能较为基础。

### 组件的强化方式

### 类组件继承

对于类组件的强化，首先想到的是继承方式，开源项目 react-keepalive-router 就是通过继承 React-Router 中的 Switch 和 Router ，来达到缓存页面的功能的。因为 React 中类组件，有良好的继承属性，所以可以针对一些基础组件，首先实现一部分基础功能，再针对项目要求进行有方向的改造、强化、添加额外功能。

类继承优势如下：

- 可以**控制父类 render**，还可以添加一些其他的渲染内容；
- 可以共享父类方法，还可以添加额外的方法和属性。

但是也有值得注意的地方，就是 **state 和生命周期会被继承后的组件**修改。像上述 demo 中，Person 组件中的 componentDidMount 生命周期将不会被执行。

### HOC高阶组件

#### HOC高阶组件能解决什么问题

HOC 的产生根本作用就是解决大量的**代码复用，逻辑复用**问题。既然说到了逻辑复用，那么具体复用了哪些逻辑呢？

- 首先第一种就是**拦截问题**，本质上是**对渲染的控制**，对渲染的控制可不仅仅指**是否渲染组件**，还可以像 dva 中 dynamic 那样**懒加载/动态加载组件**。
- 还有一种场景，比如项目中想让一个非 Route 组件，也能通过 props 获取路由实现跳转，但是**不想通过父级路由组件层层绑定 props** ，这个时候就需要一个 HOC 把改变路由的 history 对象混入 props 中，于是 withRoute 诞生了。所以 HOC 还有一个重要的作用就是**让 props 中混入一些你需要的东西**。
- 还有一种情况，如果不想改变组件，只是**监控组件的内部状态，对组件做一些赋能**，HOC 也是一个不错的选择，比如对组件内的点击事件做一些监控，或者加一次额外的生命周期，开源项目 react-keepalive-router，可以缓存页面，项目中的 keepaliveLifeCycle 就是通过 HOC 方式，给业务组件增加了额外的生命周期。

高阶函数就是一个**将函数作为参数并且返回值也是函数的函数**。高阶组件是以组件作为参数，返回组件的函数。返回的组件把传进去的组件进行功能强化。

具体功能

1. 强化 props ，可以通过 HOC ，向原始组件混入一些状态。
2. 渲染劫持，可以利用 HOC ，动态挂载原始组件，还可以先获取原始组件的渲染树，进行可控性修改。
3. 可以配合 import 等 api ，实现动态加载组件，实现代码分割，加入 loading 效果。
4. 可以通过 ref 来获取原始组件实例，操作实例下的属性和方法。
5. 可以对原始组件做一些事件监听，错误监控等。

### 两种不同的高阶组件

常用的高阶组件有**属性代理**和**反向继承**两种，两者之间有一些共性和区别

| **对比维度**     | **属性代理（Props Proxy）**                                  | **反向继承（Inheritance Inversion）**                        |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **实现方式**     | 返回一个新组件，包裹原组件并通过 props 注入额外逻辑与数据（**属性代理**） | 返回一个继承自原组件的新组件，覆盖或扩展其生命周期和渲染方法（**反向继承**） |
| **访问能力**     | 无法内部访问原组件的 state、生命周期、方法；仅能通过 props 传值 | 可通过 `this` 访问并操作原组件的 state、props、生命周期、render 等 |
| **静态方法继承** | 默认不继承原组件的静态属性，需要手动或借助 `hoist-non-react-statics` 处理 | ES6 继承自动继承静态属性，不容易丢失静态方法                 |
| **组件耦合度**   | 低耦合，不依赖原组件内部实现，也易于组合和嵌套使用           | 耦合度高，依赖原组件内部状态和行为，不建议频繁嵌套使用       |
| **适用组件类型** | 适用于类组件与函数组件                                       | 仅适用于类组件，不支持函数组件                               |
| **副作用风险**   | 安全性较高，对原组件影响较小                                 | 嵌套多个 HOC 容易覆盖生命周期方法（如多个 `componentDidMount`），并破坏调用顺序 |
| **典型应用场景** | 功能扩展、属性注入、条件渲染、逻辑抽象、维护开源 HOC 工具等  | 性能统计、渲染劫持、需要访问或覆盖原组件内部逻辑的场景       |

### ReactHookForm

**第一步：定性（核心差异）**

> React Hook Form 最大的优势在于 **性能和开发体验**。它采用 **非受控组件模式**，避免了传统受控组件（包括 Formik 这类库）里普遍存在的 **不必要的重渲染**。

**第二步：解释原理（为什么性能好？）**

- **传统受控表单**：每次输入都会触发 onChange → setState → 组件更新，整个表单组件树频繁渲染，性能开销大。

- **React Hook Form**：通过 ref 注册输入组件，把 **DOM 元素自身状态** 作为“单一数据源”。用户输入时，组件不会渲染，只有在 **提交 / 校验** 时才读取数据并更新状态。

  👉 这意味着：输入过程几乎 **零开销**，性能远优于受控方案。

### **第三步：带来的好处**

1. **更少代码量**

   - 不需要给每个输入写 value + onChange，减少样板代码。

2. **更简洁的 API**

   - register、handleSubmit、formState 等 API 直观易用，上手快。

3. **内置验证**

   - 内置 required、minLength、pattern 等校验规则，无需额外引入 Yup（当然也支持 Yup）。

4. **体积小 & 无依赖**

   - 核心库只有几 KB，比 Formik + Yup 轻量很多。

5. **性能最佳**

   - 大表单场景下，几乎没有额外渲染，交互流畅

   

## 组件通信

React 一共有 5 种主流的通信方式：

- **props 和 callback 方式**
- **event bus 事件总线**
- **ref 方式**
- **React-redux 或 React-mobx 等状态管理方式**
- **context 上下文方式**

### props 和 callback 方式

props 和 callback 可以作为 React 组件最基本的通信方式，父组件可以通过 props 将信息传递给子组件，子组件可以通过执行 props 中的回调函数 callback 来触发父组件的方法，实现父与子的消息通讯。

- 父组件 -> 通过自身 state 改变，重新渲染，传递 props -> 通知子组件
- 子组件 -> 通过调用父组件 props 方法 -> 通知父组件。

### event bus 事件总线

当然利用 eventBus 也可以实现组件通信，但是在 React 中并不提倡用这种方式，我还是更提倡用 props 方式通信。如果说非要用 eventBus，我觉得它更**适合用 React 做基础构建的小程序**，比如 Taro。接下来将上述 demo 通过 eventBus 方式进行改造。

**缺点：**

- 需要手动绑定和解绑。
- 对于小型项目还好，但是对于中大型项目，这种方式的组件通信，会造成牵一发动全身的影响，而且后期难以维护，组件之间的状态也是未知的。
- 一定程度上违背了 React 数据流向原则。

### ref 实现组件通信

如果有种场景不想通过父组件 render 改变 props 的方式，来触发子组件的更新，也就是**子组件通过 state 单独管理数据层**，针对这种情况父组件可以通过 ref 模式标记子组件实例，从而操纵子组件方法，这种情况通常发生在一些数据层托管的组件上，比如 `<Form/>` 表单，经典案例可以参考 **antd 里面的 form 表单，暴露出对外的 resetFields ， setFieldsValue 等接口**，可以通过表单实例调用这些 API 。

1. 类组件 ref
2. 函数组件 forwardRef + useImperativeHandle

#### 1. 类组件 ref

对于类组件可以通过 ref 直接获取组件实例，实现组件通信。

1. 子组件暴露方法 fatherSay 供父组件使用，父组件通过调用方法可以设置子组件展示内容。
2. 父组件提供给子组件 toFather，子组件调用，改变父组件展示内容，实现父 <-> 子 双向通信。

#### 2. 函数组件 forwardRef + useImperativeHandle

对于函数组件，本身是没有实例的，但是 React Hooks 提供了 useImperativeHandle 其第一个参数接受父组件传递的 ref 对象，第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。

useImperativeHandle 则是用来自定义暴露给父组件的 ref 对象。它通常与 forwardRef 一起使用，让你可以控制子组件暴露给父组件的哪些方法和值。通过 useImperativeHandle，你可以返回一个对象，该对象包含子组件想要暴露给父组件的方法和属性。useImperativeHandle 接受三个参数：

- 第一个参数 ref：接受 forwardRef 传递过来的 ref 。
- 第二个参数 createHandle：处理函数，返回值作为暴露给父组件的 ref 对象。
- 第三个参数 deps：依赖项 deps，依赖项更改形成新的 ref 对象。

<img src="%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/ref4.webp" alt="ref4.webp" style="zoom:33%;" />



### 状态管理库通信

关于状态管理库的组件通信方式及其原理详见以下章节：

- [React Rudex](https://jonny-wei.github.io/blog/react/warmup/react-redux.html)
- [React Mobx](https://jonny-wei.github.io/blog/react/warmup/react-mobx.html)

### Context 通信（生产者—+消费者）

#### context 与 props 和 react-redux 的对比？

context解决了：

1. **解决了 props 需要每一层都手动添加 props 的缺陷。**
2. **解决了改变 value ，组件全部重新渲染的缺陷。**

react-redux 就是通过 Provider 模式把 redux 中的 store 注入到组件中的。

#### 如何解决 Context Provider 提供的对象可能引起的重复渲染问题？

当 Context Provider 接收的 value 发生变化的时候，React 会向下深度优先遍历组件树，找到消费了该 Context 的组件并标志为需要更新，在组件更新的 render 阶段，这些消费了该 Context 的组件就会重新渲染，读取到最新的 Context 值。我们通常传递给 Context Provider 的 value 是一个对象，对象里包含多个字段，然而这种常见的场景却可能导致多次不必要的重复渲染。

解决方案： **[use-context-selector (opens new window)](https://www.npmjs.com/package/use-context-selector)，它可以让我们从 context value 中选择你会用到的状态，且只有在这些被选择的状态更新时，才会使组件重新渲染。**



## 受控组件和非控组件

核心区别：数据源不同（受控 state、非受控 Dom）

数据流向、实现方式（useState vs
useRef）。

表单校验、复杂交互、受业务逻辑控制 使用 受控

文件上传：使用非受控

场景驱动 （Cite Scenarios）

| 特性         | 受控组件（优先）（Controlled）               | 非受控组件（Uncontrolled）          |
| ------------ | -------------------------------------------- | ----------------------------------- |
| **数据源**   | React `state`                                | DOM 自身（表单元素内部状态）        |
| **数据流**   | 单向数据流（由 React 管控）                  | 无特定数据流（由 DOM 自己维护）     |
| **值获取**   | 实时，通过 `state`                           | 需要时，通过 `ref`                  |
| **使用Hook** | `useState` + `onChange`                      | `useRef`                            |
| **优点**     | - 值实时可控 <br> - 易于校验与逻辑处理       | - 代码更简洁 <br> - 性能稍好        |
| **缺点**     | - 代码较多 <br> - 对大量表单时可能性能开销大 | - 难以统一校验 <br> - 与 React 脱节 |
| **适用场景** | 表单校验、复杂交互、受业务逻辑控制           | 简单表单、无需频繁校验的输入场景    |

#### 受控组件（受状态控制）

- value 由 state 驱动
- 用户输入触发 onChange，onChange 回调更新 state。state 变更，UI 重新渲染

受控组件**缺陷**：表单元素的值都是由 React 组件进行管理，**当有多个输入框，或者多个这种组件时，如果想同时获取到全部的值就必须每个都要编写事件处理函数，这会让代码看着很臃肿，所以为了解决这种情况**，出现了非受控组件。

#### 非受控组件（不受状态控制）

如果一个表单组件没有 `value props`（单选和复选按钮对应的是`checked props`）时，就可以称为**非受控组件**。在非受控组件中，**可以使用一个 `ref`来从 `DOM` 获得表单值。而不是为每个状态更新编写一个事件处理程序。**

做法

- 使用 useRef创建一个引用
- 将 ref 附加到 DOM 元素
- 通过 ref.current.value 在需要时获取值

**总结：** 页面中所有**输入类的 DOM** 如果是现用现取的称为**非受控组件**，而通过 `setState` 将输入的值维护到了 `state` 中，需要时再从`state` 中取出，这里的数据就受到了 `state` 的控制，称为**受控组件**。





你提供的这篇笔记非常详实，不仅涵盖了理论，还有实践和代码验证，是非常好的复习材料。

在面试中，面试官不仅想知道你“懂不懂”概念，更想看你“会不会用”以及“知不知道坑在哪”。针对你的笔记，我们可以整理出一套“总-分-总”的结构化面试话术，让你在回答时逻辑清晰、直击痛点。

你可以按照以下四个层次来回答关于 `PureComponent` 的面试题：

## PureComponent和Component之间的区别

### 1. 核心定义

“`PureComponent` 和 `Component` 几乎完全相同，唯一的区别在于 `PureComponent` 内部自动实现了 `shouldComponentUpdate` 生命周期。它通过对 `state` 和 `props` 进行浅比较（shallow comparison）来决定组件是否需要重新渲染，从而在特定场景下提升页面性能。”

### 2. 工作原理与更新机制（体现深入理解）

“关于它的浅比较机制，主要分为两种数据类型的处理情况：”

- **基本数据类型（如 String、Number、Boolean）：** 只要值发生了改变，浅比较就会判定为不同，从而正常触发重新渲染。
- **引用数据类型（如 Object、Array）：** 浅比较只对比**对象的引用地址**，不对比内部属性的值。如果直接修改原对象（例如使用 `arr.push()` 或直接修改 `obj.name`），因为引用地址没变，组件**不会**重新渲染。必须使用扩展运算符（如 `[...arr]`）或 `Object.assign` 返回一个新的对象地址，才能触发页面更新。

### 3. 组件对比与适用场景（展现工程思维）

| **特性**     | **Component**                                      | **PureComponent**                                         |
| ------------ | -------------------------------------------------- | --------------------------------------------------------- |
| **更新控制** | 默认只要调用 `setState` 就会触发 `render`。        | 只有 `props` 或 `state` 的引用发生变化时才 `render`。     |
| **性能优化** | 需开发者手动编写 `shouldComponentUpdate` 逻辑。    | 框架代劳，自动拦截不必要的渲染。                          |
| **最佳场景** | 状态频繁剧烈变化、包含复杂嵌套层级数据的容器组件。 | 状态变化较少、依赖外层传入 `props` 的**纯展示型子组件**。 |

### 4. 踩坑经验与高级考点（抛出加分项）

“在实际开发中，使用 `PureComponent` 有几个需要特别注意的坑，这也是我在项目里总结出的经验：”

- **父子组件的阻断效应：** 如果父组件是 `PureComponent` 且因为浅比较没有更新，那么无论子组件是普通 `Component` 还是什么，子组件都**绝对不会**重新渲染。所以数据流设计必须严谨。
- **反向性能消耗：** 如果一个组件的 `props` 和 `state` 必定每次都会改变，那么用 `PureComponent` 反而会拖慢性能，因为每次它都要白白执行一遍浅比较的逻辑。
- **API 冲突：** 既然继承了 `PureComponent`，就绝对不要再手动去写 `shouldComponentUpdate` 方法，否则不仅多此一举，React 内部也会抛出警告。

## HOC

高阶组件（HOC）是 React 中用于**复用组件逻辑**的一种高级技巧。它是一种 React 的组合特性而形成的设计模式（该函数接受一个组件作为参数，并返回一个新的组件）。

**1）HOC的优缺点**

- 优点∶ 逻辑服用、不影响被包裹组件的内部逻辑。
- 缺点∶hoc传递给被包裹组件的props容易和被包裹后的组件重名，进而被覆盖

**2）适用场景**

- 代码复用，逻辑抽象 
- 渲染劫持 
- State 抽象和更改 
- Props 更改 

**3）具体应用例子** 

- **权限控制：**利用高阶组件的 **条件渲染** 特性可以对页面进行权限控制，权限控制一般分为两个维度：页面级别和 页面元素级别
- **组件渲染性能追踪：**借助父组件子组件生命周期规则捕获子组件的生命周期，可以方便的对某个组件的渲染时间进行记录∶
- **页面复用**：动态请求数据塞入组件

## 组件单一职责（SRP）

- SRP 定义：
  - 核心定义：一个组件（或模块、类）应该有且仅有一个引起它变化的原因。
  - 通俗理解：一个组件只做好一件事。
  - 目的：提高内聚性（Cohesion），降低耦合性 （Coupling）。

- 优点：
  - 提高可维护性：修改一个功能，只影响到负责该功能的组件。
  - 增强可复用性：功能单一的组件更容易在不同场景下复用。
  - 提升可测试性：职责清晰的组件更容易编写单元测试。
  - 代码更清晰：易于理解和团队协作。

## 容器组件和展示组件

- 理解：容器/展示组件模式
  - 核心思想：关注点分离（Separation of Concerns）。
  - 容器组件 （Container Components）：
    - 职责：如何运作-数据获取、状态管理、逻辑处理。
    - 特点：通常不包含复杂 UI，将数据和行为传递给展示么
  - 展示组件（Presentational Components）：
    - 职责：如何展示 -纯粹的 UI 渲染。
    - 特点：通过 props接收数据和回调，通常无自身状态）
  - 优点：提高复用性、可测试性、可维护性。

- 关键 Hooks： useState，useEffect，useContext，useReducer。
- **自定义 Hooks** （Custom Hooks）：**现代关注点分离、追求逻辑和视图的分离**
  - 核心变革：允许我们将组件逻辑提取到可重用的函数中。
  - 赋能函数组件：使其可以拥有状态、处理副作用、封装复杂逻辑。
- 带来的变化：
  - 组件逻辑组织更灵活。
  - 减少了对高阶组件（HOCs）和 Render Props 的依赖。
  - 一定程度上模糊了传统容器/展示组件的界限。

## 组合优于继承原则

> [!NOTE]
>
> - 核心观点：明确指出组合是实现代码复用和构建灵活组件结构的首选
> - 解释原因：
>   - React组件本质上更像函数，组合更符合这种模型。
>   - 组合提供了更好的灵活性、可维护性，降低了组件间的耦合度。
>   - 避免了传统继承可能带来的层级过深、方法覆盖混乱等问题。
> - 易错点提醒：
>   - 不是完全否定继承的价值，强调在React组件间复用代盈时，组合是压倒性的更优选择。
> - 实现：
>   - Hoc、hooks、props.children



- 理解：组合与继承是什么？
  - 继承 （Inheritance）：
    - "is-a" 关系（是一个）
    - 子类自动获得父类的属性和方法
    - 形成层级结构，通常耦合较紧
  - 组合 （Composition）：
    - "has-a" 关系（有一个）
    - 通过将简单对象或组件组合起来构建更复杂的对象或组件
    - 更灵活，组件间松耦合
- 组合的优势：
  - 高度灵活性与可维护性
  - 清晰的关注点分离（SoC）
  - Props的强大驱动
  - 避免不必要的耦合
- 继承的劣势：
  - 组件层级与数据流模糊：
    - React组件核心是UI单元，继承可能导致不直观的组件树。
    - 难以追踪 props 和 state 的来源和传递。
  - 逻辑复用的困境：
  - 通过继承复用组件逻辑，往往不如自定义Hooks或高阶组件（HOC）清晰和灵活。
  - 官方立场明确：React官方文档明确推荐使用组合而非继承来在组件之间复用

- **组合实现：**
  - **通过 props 传递特定内容/行为：**
    - 将组件实例作为 props 传递 （e.g. sidebar=｛<Sidebar />
    - 传递配置对象或渲染函数 （render props）。
  -  **万能的 props.children**：
    - 最常用、最直观的组合方式。
    - 构建通用容器组件
  - **高阶组件（Higher-Order Components - HOCs）**：
    - 函数接收一个组件，返回一个新的增强型组件。
    - 用于复用组件逻辑（如：**用户认证、权限控制、数据订通**）。
  - 自定义 Hooks（现代）

## React 错误边界（只在类组件）

> [!NOTE]
>
> - 错误边界：捕获子组件JS错误，展示降级UI
> - 核心方法：getDerivedStateFromError（更新state以渲染降级UI），componentDidCatch（记录错误）。
> - 重要性：提升用户体验，增强应用健壮性。
> - 注意：其捕获范围有限，需合理使用。

- 利用特定的生命周期方法（仅限类组件）：
  - static getDerivedStateFromError（error）：
    -  在子孙组件抛出错误后调用。
    - 返回一个对象来更新 state，从而在下一次渲染时展示降级 UI。
  - componentDidCatch（error, errorInfo）：
    - 在子孙组件抛出错误后调用。
    - error：抛出的错误。
    - errorInfo：带有 componentStack key 的对象，包含了组件抛错误的栈信息。

- 实现一个错误边界组件
  - 定义一个类组件。constructor 初始化 state（如 hasError:false ）。
  - 实现 static getDerivedstateFromError（）。
  - 实现 componentDidCatch（）。
  - render（）方法根据 state.hasError 决定渲染子组件还是降级 UI。

- 错误边界无法捕获的错误类型：
  -  事件处理器 （Event handlers）
  - 异步代码（例如 setTimeout 或 服务端渲染 （Server-side rendering）
  - 错误边界自身抛出的错误（而非其子组件）
  - requestAnimationFrame（回调）

## React 组件会重新渲染原因

- **状态更新** 当组件的状态（state）发生变化时，组件会重新渲染。这通常是通过调用 `setState` 方法（类组件）或 `useState` Hook 的设置函数（函数组件）来实现的。在函数组件中，如果使用了 `useReducer` 或 `useState` Hook，并触发了状态更新，组件会重新渲染。
- **属性变化** 当组件接收到新的属性（props），并且这些属性不同于上一次渲染的属性时，组件会重新渲染。
- **强制更新** 在类组件中，可以调用 `forceUpdate` 方法强制组件忽略 `shouldComponentUpdate` 的返回值并重新渲染。
- **父组件重新渲染** 当一个组件的父组件重新渲染时，即使子组件的状态和属性没有变化，子组件也会重新渲染。不过，如果子组件使用了 `React.memo` 或 `shouldComponentUpdate` 生命周期方法来优化性能，并且返回 `false`，则可以避免不必要的渲染。
- **使用 Hooks 的函数组件** 在函数组件中，如果使用了如 `useEffect`、`useMemo`、`useCallback` 等 Hooks，并且它们的依赖项发生变化，也会导致组件重新渲染。
- **Context 变化** 如果组件订阅了某个 Context 的变化，当 Context 的值发生变化时，订阅的组件会重新渲染。
- **错误边界** 如果组件树中发生了 JavaScript 错误，错误边界组件会捕捉到这个错误，并重新渲染以显示错误消息。
- **调用 `ReactDOM.render` 或 `hydrate`** 当你使用 `ReactDOM.render` 或 `ReactDOM.hydrate` 将组件挂载到 DOM 时，以及在后续调用这些函数时，会触发组件的重新渲染。
- **服务器端渲染（SSR）** 在服务器端生成 HTML 时，React 组件会进行渲染，生成的 HTML 字符串会被发送到客户端。
- **直接操作 DOM** 如果你直接修改了 DOM，React 无法检测到这些变化。在下一次组件重新渲染时，React 会覆盖掉这些变化，因为它会根据虚拟 DOM 重新渲染整个组件树。

解决

1. **使用 shouldComponentUpdate 生命周期方法**：比较前后 props 和 state 的值，可以决定是否进行下一次渲染。如果前后值相同，可以返回 false，避免不必要的渲染。
2. **使用 PureComponent**：在每次渲染时自动对比 props 和 state 的值，并根据比较结果决定是否进行渲染。使用 PureComponent 可以避免手动实现 shouldComponentUpdate 的逻辑。
3. **使用 React.memo**：React.memo 是 React 的一个高阶组件，它可以对组件进行浅比较，并在 props 没有变化时阻止不必要的渲染。只需要将组件作为参数传递给 React.memo 即可。
4. **使用 useCallback 和 useMemo**：这些 Hooks 可以缓存函数和计算结果，避免在每次渲染时重新创建或计算。
5. **避免在 render 方法中创建新的对象或函数**：由于 render 方法会频繁调用，如果在 render 方法中创建新的对象或函数，可能会导致频繁的垃圾回收。可以将这些对象或函数移到组件外部。避免在渲染方法或函数内部创建内联对象和箭头函数，因为这会导致在每次渲染时都创建新的引用，从而使子组件不必要的重新渲染。
6. **避免频繁的 setState 调用**：setState 是**异步**的，并且会进行批处理，但如果在短时间内多次调用 setState，可能会导致多次不必要的渲染。可以使用 setState 的回调函数或 setState 的函数参数来减少不必要的渲染。
7. 合理使用 key 属性，确保列表中每个元素的 key 是唯一的，并且稳定。这有助于 React 识别哪些元素是变化的，从而避免不必要的重新渲染。
8. 使用 React.Fragment 或 null 作为返回值。避免返回 null 或 false 值，这可能导致父组件的渲染中断。相反，使用 React.Fragment 可以包裹子元素，避免这个问题。

## React路由

<img src="https://jonny-wei.github.io/blog/images/react/reactRouter2.png" alt="reactRouter2" style="zoom:33%;" />

**路由模式：**

对于 BrowserRouter 或者是 HashRouter，实际上原理很简单，就是**React-Router-dom 根据 history 提供的 createBrowserHistory 或者 createHashHistory 创建出不同的 history 对象。**

- *BrowserRouter*：
    - 创建路由：通过 createBrowserHistory 创建一个 history 对象，并传递给 Router 组件。
    - 改变路由：本质上是调用 `window.history.pushState` 和 `window.history.replaceState` 方法。
    - 监听路由 popstate：同一个文档的 history 对象出现变化时，就会触发 popstate 事件。

- *HashRouter*： 是通过 URL 的 hash 属性来控制路由跳转的
    - 改变路由 `window.location.hash`：通过 `window.location.hash` 属性获取和设置 hash 值。
    - 开发者在哈希路由模式下的应用中，切换路由，本质上是改变 `window.location.hash` 。
    - 监听路由：hash 路由模式下，监听路由变化用的是 hashchange

**受保护的路由**

- 清晰定义：首先说明什么是 Protected Route 及其作用。
- 核心机制：解释认证检查和条件重定向的逻辑。
- 关键组件（React Router v6+）：提及 <Outlet /> 用于渲染子路由，<Navigate /> 用于重定向。状态管理：简述如何获取和管理认证状态。
- 优势：强调其带来的安全性与用户体验提升。

## 组件库设计/原子设计

> [!NOTE]
>
> 原子设计
>
> - **清晰定义**：解释它是一种构建UI的方法论，类比化学。
> - 阐述层级：依次介绍五个层级及其关系，并举例。
>   - 原子：基础，不可分。
>   - 分子：原子组合，简单功能。
>   - 组织：分子/原子组合，独立区域。
>   - 模板：页面骨架，布局。
>   - 页面：模板实例，真实内容。
> - **强调价值**：一致性、复用性、可维护性、团队协作。
> - **关联设计系统**：是构建设计系统的有效途径。

**目标：**

- 一致性（Consistency）：视觉风格、交互行为统一。
- 可复用性（Reusability）：减少重复代码，提高开发效率。
- 高效性（Efficiency）：快速搭建高质量界面。
- 可维护性（Maintainability）：易于理解、修改和扩展。

**设计与 API 规划**

- 视觉设计 （Visual Design）：
  - 设计规范 （Design System/Tokens）
  - 主题化能力（Theming）
  - 响应式设计
- API 设计 （API Design）：
  - Props：清晰、可预测、最少暴露。遵循 HTML标准
  - Events：命名一致（e.g.，onopen，onClose），参数明确。
  - Slots/Children：提供灵活的内容分发机制。

**组件库框架**（React、Vue、WebComponent）+样式方案（css/less/scss/tailwindcss）

- 模块化与打包 （Modularity & Bundling）：
  - ES Modules （ESM）优先
  - Tree-shaking 支持
  - 输出格式 （ESM, CJS, UMD）
  - 按需加载

**开发体验（DX）与流程：高效协作的保障**

-  文档 （Documentation）：
  - 清晰、全面、交互式 （e.g.， Storybook, Docz）
  - Props、Events、Slots 说明，用法示例，最佳实践
- 测试 （Testing）：
  - 单元测试 （Unit Tests）- Jest, Vitest
  - 集成测试 （Integration Tests）
  - 视觉回归测试 （Visual Regression）- Percy, Chromatic
  - 端到端测试（E2E）- Playwright, Cypress（针对复杂交互组件）

- 开发环境 （Development Environment）：
  - 实时预览、热更新
- Linting & Formatting （ESLint, Prettier）
- 贡献指南 （Contribution Guidelines）：
  - 代码风格、提交流程、分支策略

- 可访问性（A11y）：让所有人都能用
  - 标准遵循：WCAG （Web Content Accessibility Guidelines）
  - 键盘导航（Keyboard Navigation）：Tab 顺序、焦点管理、快捷键支持。
  - ARIA 属性（ARIA Attributes）：正确使用 role，aria-* 属性。
  - 屏幕阅读器兼容性 （Screen Reader Compatibility）.
  - 颜色对比度、字体大小 等视觉可访问性。
  - 语义化 HTML （Semantic HTML）.

**性能优化**

- 包体积（Bundle Size）：
  - 按需加载、Tree-shaking
  - 避免引入大型第三方依赖
- 运行时性能（Runtime Performance）：
  - 高效的更新机制（e.g.，React memo，PureComponent）
  - 避免不必要的重渲染
  - 事件委托
-  懒加载（Lazy Loading）：图片、非首屏组件。

**生命周期**

- 语义化版本 （Semantic Versioning - SemVer）： MAJOR. MINOR.PATCH
- 变更日志（Changelog）：清晰记录每次更新的内容。
- 弃用策略（Deprecation Strategy）：如何平滑过渡不再推荐使用的API。
- 长期支持（LTS - Long-Term Support）：对特定版本的维护周期。



## 服务端状态和客户端状态

- 客户端状态 vs.服务端状态：
- 核心区别
  - 所有权：客户端拥有 vs.服务端拥有
  - 持久性：浏览器会话vS.数据库持久存储
  - 同步性：通常同步 vs.必然异步
  - 控制权：UI直接控制 vs. 通过API间接影响
  - 复杂度：服务端状态管理通常更复杂（缓存、同步、过期、错误处

## RTL React 测试理念

阐述核心理念：“像用户一样测试”，关注软件的实际使用行为，而不是内部实现细节。

对比说明痛点：
提及传统测试（如Enzyme）**过度依赖实现细节**
**（state、props）**，导致测试脆弱、维护成本高

举例论证：（）

- **查询方式**：RTL优先使用 getByRole、getByText等面向用户的查询，而不是class或id 选择器。
- **断言方式**：RTL断言UI的最终结果（用户看到什么），而不是检查组件的 state。

优点（黑盒模测试）

- **信心更足**：测试通过，代表用户真实操作流程没问题。
- **重构友好**：只要功能不变，内部实现任意改，测试无需变动。
- **促进可访问性**：自然地引导开发者写出更accessible的代码。

## React 优先级管理

React 中的**可中断渲染，时间切片(time slicing)，异步渲染(suspense)**等特性, 在源码中得以实现都依赖于 React 的优先级管理。`React`内部对于 `优先级` 的管理, 根据功能的不同分为 `LanePriority`, `SchedulerPriority`, `ReactPriorityLevel`3 种类型（`2套优先级体系`和`1套转换体系`）：

- `fiber`优先级(`LanePriority`): 位于`react-reconciler`包, 也就是[`Lane(车道模型)` (opens new window)](https://github.com/facebook/react/pull/18796)。
- 调度优先级(`SchedulerPriority`): 位于`scheduler`包。
- 优先级等级(`ReactPriorityLevel`) : 位于`react-reconciler`包中的[`SchedulerWithReactIntegration.js` (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/SchedulerWithReactIntegration.old.js), 负责上述 2 套优先级体系的转换。

之前提到过`Scheduler`与`React`是两套`优先级`机制。在`React`中，存在多种使用不同`优先级`的情况，比如（`Concurrent Mode`开启情况）：

- 过期任务或者同步任务使用`同步`优先级
- 用户交互产生的更新（比如点击事件）使用高优先级
- 网络请求产生的更新使用一般优先级
- `Suspense`使用低优先级

所以，`React`需要设计一套满足如下需要的`优先级`机制：

- 可以表示`优先级`的不同
- 可能同时存在几个同`优先级`的`更新`，所以还得能表示`批`的概念
- 方便进行`优先级`相关计算

为了满足如上需求，`React`设计了`lane`模型。

### Lane (车道模型)

首先引入作者对`Lane`的解释([相应的 pr (opens new window)](https://github.com/facebook/react/pull/18796)), 这里简单概括如下:

1. `Lane`类型被定义**为二进制变量, 利用了位掩码的特性, 在频繁运算的时候占用内存少, 计算速度快。**
    - `Lane`和`Lanes`就是单数和复数的关系, 代表单个任务的定义为`Lane`, 代表多个任务的定义为`Lanes`
1. `Lane`是对于`expirationTime`的重构, 以前使用`expirationTime`表示的字段, 都改为了`lane`
2. 使用`Lanes`模型相比`expirationTime`模型有优势:
    - `Lanes`把任务优先级从批量任务中分离出来, 可以**更方便的判断单个任务与批量任务的优先级是否重叠**。
    - `Lanes`使用单个 32 位二进制变量即可代表多个不同的任务，也就是说一个变量即可代表一个组(`group`)，如果要在一个 group 中分离出单个 task，非常容易。
        - 在`expirationTime`模型设计之初， react 体系中还没有[Suspense 异步渲染 (opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)的概念。现在有如下场景: 有 3 个任务, 其优先级 `A > B > C`，正常来讲只需要按照优先级顺序执行就可以了。但是现在情况变了：A 和 C 任务是`CPU密集型`, 而 B 是`IO密集型`(Suspense 会调用远程 api, 算是 IO 任务)， 即 `A(cpu) > B(IO) > C(cpu)`。 此时的需求需要将任务`B`从 group 中分离出来，先处理 cpu 任务`A和C`。

通过上述伪代码, 可以看到`Lanes`的优越性，运用起来代码量少，简洁高效，这与其大量使用位运算脱不了关系。

1. `Lanes`是一个不透明的类型, 只能在[`ReactFiberLane.js` (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberLane.js)这个模块中维护. 如果要在其他文件中使用, 只能通过`ReactFiberLane.js`中提供的工具函数来使用.

分析车道模型的源码([`ReactFiberLane.js` (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberLane.js)中), 可以得到如下结论:

1. 可以使用的比特位一共有 31 位。
2. 共定义了[18 种车道(`Lane/Lanes`)变量 (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberLane.js#L74-L103), 每一个变量占有 1 个或多个比特位, 分别定义为`Lane`和`Lanes`类型.
3. 每一种车道(`Lane/Lanes`)都有对应的优先级, 所以源码中定义了 18 种优先级([LanePriority (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberLane.js#L12-L30)).
4. 占有低位比特位的`Lane`变量对应的优先级越高
    - 最高优先级为`SyncLanePriority`对应的车道为`SyncLane = 0b0000000000000000000000000000001`.
    - 最低优先级为`OffscreenLanePriority`对应的车道为`OffscreenLane = 0b1000000000000000000000000000000`

### 3 种优先级的联系

`React`内部对于`优先级`的管理, 根据功能的不同分为`LanePriority`, `SchedulerPriority`, `ReactPriorityLevel`3 种类型：

- `LanePriority`和`SchedulerPriority`从命名上看, 它们代表的是`优先级`
- `ReactPriorityLevel`从命名上看, 它代表的是`等级`而不是优先级, 它用于衡量`LanePriority`和`SchedulerPriority`的等级

#### LanePriority

`LanePriority`：属于`react-reconciler`，定义于`ReactFiberLane.js`([见源码 (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberLane.js#L46-L70)).

与 `fiber` 构造过程相关的优先级(如 `fiber.updateQueue`，`fiber.lanes`)都使用 `LanePriority`。

#### SchedulerPriority

`SchedulerPriority`，属于`scheduler`包，定义于`SchedulerPriorities.js`中([见源码 (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/scheduler/src/SchedulerPriorities.js)).

与 scheduler调度中心相关的优先级使用 SchedulerPriority。

#### ReactPriorityLevel

`reactPriorityLevel`， 属于`react-reconciler`，定义于 `SchedulerWithReactIntegration.js`中([见源码 (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/SchedulerWithReactIntegration.old.js#L65-L71)).

LanePriority与 SchedulerPriority 通过 ReactPriorityLevel进行转换。

#### 转换关系

为了能协同调度中心( `scheduler` 包)和 fiber 树构造( `react-reconciler` 包)中对优先级的使用， 则需要转换 `SchedulerPriority`和 `LanePriority`， 转换的桥梁正是 `ReactPriorityLevel`。

在[SchedulerWithReactIntegration.js中 (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/SchedulerWithReactIntegration.old.js#L93-L125), 可以互转SchedulerPriority 和 ReactPriorityLevel:

在[`ReactFiberLane.js`中 (opens new window)](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberLane.js#L196-L247), 可以互转 `LanePriority` 和 `ReactPriorityLevel`:




# Vue

## Vue3.0

### Vue2和Vue3的区别？有什么更新？

**数据劫持优化：**`利用新的语言特性、解决架构问题`

- 重写双向数据绑定（检测机制改变）：
- vue3基于`Proxy代理`的方式，特点就是`对象全覆盖的反应性跟踪`，可以**动态监听数组的变化以及对象属性值操作**等、省去for in 循环，丢掉麻烦的备份数据。
- 缺点：监听不到内部深层次对象变化--解决：在getter中递归调用响应式函数
- vue2基于`Object.defineProperty`的很多限制(只能检测属性，不能检测对象---解决：$set、$delete、1.`Vue.set`向响应式对象中添加一个`property`，并确保这个新 `property `同样是响应式的，且触发视图更新 2.Object.assign()创建新对象重新添加响应式)。
- 检测属性的添加和删除；
- 检测数组索引和长度的变更；
- 支持 Map、 Set、 WeakMap 和 WeakSet。

**编译优化：**

- 解决了vdom性能瓶颈 diff算法优化：优化的虚拟dom，**vue2每次更新diff算法都是全量对比，vue3则只对比带有标记的，减少了非动态内容的消耗。**
- 解释：通过需要动态创建dom的时候，增加了一个标记（patch flag），在diff算法中`针对动态的节点进行对比`（支持多层嵌套），从而提升渲染效率。
- 静态提升：对`不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用`
- <u>Block Tree</u>:基于动态节点指令切割的嵌套区块，将组件模版整体大小相关提升到只与动态内容的数量相关。

**源码体积优化：**

1. 移除一些冷门的feature。
2. <u>引入Tree-Shaking(体积变小)</u>：保持代码运行结果不变的前提下，去除无用的代码。在Vue2中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是Vue实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到，而`Vue3源码引入tree shaking特性，将全局 API 进行分块。如果你不使用其某些功能，它们将不会包含在你的基础包中。`

- 借助`ES6`模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量
- 编译阶段利用`ES6 Module`判断哪些模块已经加载
- 判断那些模块和变量未被使用或者引用，进而删除对应代码

**语法优化：**

- <u>Composition组合式API</u>：逻辑关注点全放在一个函数中去，不需要在文件中跳来跳去
- <u>Option API：</u>逻辑关注点分散

**优化逻辑复用：**

- Vue2主要使用minxins：混入大量不同minxins 缺点：变量命名冲突(每个mixin都有自己的props、data)、数据来源不清晰(不在当前组件定义的变量)
- 类型支持：调用函数时类型推导，options使用this

**引入RFC：使每个版本改动可控**

**其他：**

- <u>TypeScript(源码编写)</u>：`兼容ts，自动类型提示`（vue2会配合装饰器）
- <u>支持自定义渲染器</u>：使得 weex 可以通过`自定义渲染器的方式来扩展到其他平台`，而不是直接 fork 源码来改的方式。
- <u>增加了Fragments</u>：**支持多个根节点**。
- <u>作用域插槽</u>：2.x 的机制导致作用域插槽变了，父组件会重新渲染，而3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。同时，对于 render 函数的方面，vue3.0 直接使用 api 来生成 vdom

### Object.defineProperty和Proxy区别

**Object.defineProperty()：**`只能遍历对象属性进行劫持`

- <u>定义：</u>`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象
- <u>get:</u>属性的 getter 函数，`当访问该属性时，会调用此函数`。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值
- <u>set:</u>属性的 setter 函数，`当属性值被修改时，会调用此函数`。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。默认为 undefined
- <u>缺点：</u>
- `检测不到对象属性的添加和删除`
- 数组`API`方法无法监听到，pop，push
- 增加了`$set`、`$delete` API，并且对数组`api`方法进行一个重写
- `需要对每个属性进行遍历监听`，如果嵌套对象，需要深层监听，造成性能问题

**Proxy：**`直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的`

- <u>定义</u>：`Proxy`的`监听是针对一个对象的`，那么对这个对象的所有操作会进入监听操作，这就完全可以代理所有属性了
- 嵌套对象监听不到。`解决：可以在get之上再进行一层代理`
- `有多达13种拦截方法`,不限于`apply`、`ownKeys`、`deleteProperty`、`has`等等，这是`Object.defineProperty`不具备的
- `直接监听数组的变化`（push、shift、splice）

**defineProperty和proxy的区别**:`Object.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示`

Vue 在实例初始化时遍历 data 中的所有属性，并使用 Object.defineProperty 把这些属性全部转为getter/setter。这样当追踪数据发生变化时，setter 会被自动调用。

- 缺点：
- 添加或删除对象的属性时，Vue 检测不到。因为添加或删除的对象没有在初始化进行响应式处理，只能通过 ＄set 来调用 Object.defineProperty(）处理。
- 无法监控到数组下标和长度的变化。

Vue3 使用 Proxy 来监控数据的变化。Proxy 是 ES6 中提供的功能，其作用为：用于定义基本操作的自定义行为（如属性查找，复制，校举，函数调用等）。

- Proxy 直接代理整个对象而非对象属性，这样只需做一层代理就可以监听同级结构下的所有属性变化，包括新增属性和删除属性。
- Proxy 可以监听数组的变化。
- Proxy提供 set、 get 和deleteProperty 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，有以下特点：
- 不需用使用 Vue.$set 或 Vue. $delete 触发响应式。
- 全方位的数组变化检测，消除了Vue2 无效的边界情况。
- 支持 Map, Set, WeakMap 和 WeakSet。

### 双向数据绑定原理，响应式，数据观测原理？

**响应式数据原理**：响应式数据最基本的实现依赖于对数据的“读取”和“设置”(劫持数据的访问和更新)，在副作用函数(最直观的理解就是更改dom中的value值的读取)与响应式数据之间建立联系。

- 副作用渲染函数：
- 经历三个过程：1.渲染新的子树的vnode 2.缓存旧的子树vnode 3.更新子树vnode
- 核心：根据新旧子树做patch，patch先比较新旧节点是否一致再走diff流程
- `读取`操作的时候，将所执行的副作用函数存储到“bucket”，`设置`操作再从bucket中取出并执行。

响应式桶结构：target：weakMap (key:原始对象，value：Map结构（<u>target的对象的属性:对应属性值的副作用函数</u>）)

嵌套副作用函数：使用副作用函数栈存储不同的副作用函数：问题：副作用函数无限递归调用自身（读取和设置都在同一个副作用函数，通过trigger判断当前执行和触发的相同就不执行）

- trigger函数：根`据target和key从targetMap中找到所有的副作用函数(依赖收集)遍历执行一遍`

为effect增加第二个参数shedule来增加可调度性，完成任务调度：lazy延迟执行

**Proxy 实现的响应式原理与 Vue2的实现原理相同**，实现方式大同小异：

- get 收集依赖
- Set、 delete 等触发依赖
- 对于集合类型，就是对集合对象的方法做一层包装：原方法执行后执行依赖相关的收集或触发逻辑。

**Vue2：数据劫持+发布-订阅模式**

通过`Object.defineProperty()`来劫持数据的各个属性的转化为`setter，getter`，在数据变动时发布消息给订阅者，触发相应的监听回调。

1. Oberserver劫持监听所有属性，改变对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. Dep和Watcher用于发布订阅者
3. Observer（定义数据）、Compile（模版数据）和Watcher（订阅者）三者实现双向绑定。
4. 通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁

遍历添加响应式: Oberserver类和defineReactive

发布订阅模式: Dep类（发布）和Watcher类（订阅） 添加订阅：dep.addSub(watcher实例)

发布通知: dep.notify( )->sub[i].update()->wtacher.run()->watcher.get()->getter

watcher种类: 计算属性watcher、用户自定义watcher。渲染watcher

**Vue3：数据劫持：Proxy setHandler和getHandler**

![a286bdc076ae425fb9591bb8c4153240~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.webp](%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F.assets/a286bdc076ae425fb9591bb8c4153240~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.webp)

面试官：Vue3.0里为什么要用 Proxy API 替代 defineProperty API ？

## 一、Vue基础

### vue指令、v-if和v-show的区别？

**v-if和v-for哪个优先级更高？如果同时出现，应如何优化？**

v-for优先于v-if被解析，如果同时出现，每次渲染都会先执行循环再判断条件，无论如何循环都不可避免，浪费

了性能。

- 永远不要把 v-if 和 v-for 同时用在一个元素上，带来性能方面的浪费（每次渲染都会先循环再进行条件判断）
- 如果避免出现这种情况，则(vue3)在外层嵌套 template （页面渲染不生成dom节点），再这一层进行 v-if 判断，然后再内部进行 v-for 循环
- 如果条件出现再循环内部，可通过计算属性 computed 提前过滤掉那些不需要显示的项

**v-for一个组件，如果组件内部data是使用的对象返回，会有什么问题？**

这是因为对象是引用类型，如果多个组件实例共享同一个对象，那么一个组件实例对该对象的修改会影响到其他组件实例的状态。

解决：`obj`属性的值复制一份，而不是直接引用对象。例如，可以使用`Object.assign()`或`spread`运算符

**v-if和v-show的区别**：

| 原因 | v-if | v-show |

| :----------: | :----------------------------------------------------------: | :----------------------------------------------------------: |

| **编译条件** | `惰性、条件为真时才局部编译` | `什么情况下都会被编译` |

| **手段** | `动态向DOM树中添加、删除元素` | 单纯CSS的`display控制元素显示和隐藏` |

| **性能消耗** | 更高的切换消耗 | 更高的初始渲染消耗更高的初始渲染消耗 |

| **适用场景** | 运行条件不大可能改变 | 频繁切换 |

| **原理** | 调用addlfCondition方法，生成vnode的时候会忽略对应节点，render的时候就不会渲染； | v-show会生成vnode，render的时候也会渲染成真实节点，只是在render过程中会在节点的属性中修改<br/>show属性值，也就是常说的display; |

**vue的常见指令与修饰符**：

- v-bind:元素属性与数据进行绑定、v-if:表达式控制元素的显隐、v-for:动态生成多个元素、v-on：绑定事件到实例上、v-model:双向数据绑定
- .prevent:阻止事件的默认行为、.stop阻止事件冒泡、.capture捕获事件(父元素捕获子元素)、.once事件只触发一次、.self限制在元素自身出发

**vue自定义指令**(对底层dom进行任何操作的定义，尽量只操作dom的展示)：

- 自定义分为全局和局部(directives)：钩子函数(指令自定义对象提供)：bind、Inserted、update，钩子函数参数： el：绑定元素、bing： 指令核心对象，描述指令全部信息属性
- 应用：
- 初级应用：下拉菜单、相对时间转换、滚动动画
- 高级应用：自定义指令实现图片懒加载、自定义指令集成第三方插件

### Computed 和 Watch、 watchEffect 的区别

**computed 计算属性 :** `懒执行的副作用函数，需要的时候才去执行`，`依赖其它属性值的变化触发重新计算`，并且 computed 的值`有缓存(上一次的值)`，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。`不支持异步`、`要return`

**computed原理**：当读取计算属性的值，只需要手动执行副作用的函数即可。当计算属性依赖的响应式数据发生变化，通过Shedule对dirty设置为true，在下次读取计算属性的值的时候会重新计算真正的值。

**watch 侦听器 :** 更多的是`观察的作用`，`无缓存性`，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。`支持异步`、`不要return`

**watch原理**：watch本身创建一个effect，当这个effect依赖的响应式数据发生变化，会执行effect的shedule(回调)，我们只需要在shedule中执行用户注册的回调函数。immideate立即执行用来控制回调函数的执行时机，以及flush选项来执行回调函数的具体执行时机，本质上李永乐shedule和异步的微任务队列。

**运用场景：**

- 当需要进行`数值计算、购物车`,并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时都要重新计算。
- 当需要在数据变化时执行`异步或开销较大、监听路由、定时器`的操作时，应该使用 watch，使用 watch 选项允许执行异步操作 ( 访问一个 API )，限制执行该操作的频率，并在得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

**Computed 和 Methods 的区别**

可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的

不同点：

- computed：计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值；
- method 调用总会执行该函数。

**watch(监听器)：**

- 监听数据源，数据值改变会被触发。
- 参数:(数据源、cb、配置)
- 配置: immediate立即调用 deep:开启深度监听

**watchEffect(高级监听器)：**

- watchEffect不用指明监视的是哪个data，传入函数中用到哪个就会自动监视哪个
- 立即执行传入一个函数，该函数始终在其余代码之前执行。
- 响应式追踪其依赖(一个值的改变会影响其他值的变化)，变更时重新运行函数、默认会被执行一次（非惰性）

### data为什么是一个函数而不是对象？

Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们共用一个data对象，那么状态变更将合

影响所有组件实例，这是不合理的；

数据以函数返回值的形式定义，这样当每次**复用组件的时候，就会返回一个新的data对象**，也就是说**每个组件都有自己的私有数据空间，它们各自维护自己的数据**，不会干扰其他组件的正常运行

（JavaScript中的对象是引用类型的数据，当多个实例引用同一个对象时，只要一个实例对这个对象进行操作，其他实例中的数据也会发生变化。而在Vue中，更多的是想要复用组件，那就需要每个组件都有自己的数据，这样组件之间才不会相互干扰。）

注意：data中不能定义函数

### 如何保存页面的当前的状态？Keep-Alive？

**保存页面的当前状态**：

当页面刷新时,store 中的状态将被重置,不会保留之前的状态。Redux 使用的 store 通常是保存在内存中的

页面刷新会导致整个应用重新初始化,store 将被清空,之前的状态也会丢失。

- <u>将状态存储在LocalStorage / SessionStorage</u>:只需要在组件即将被销毀的生命周期中在 LocalStorage / SessionStorage 中把当前组件的 state 通过JSON.stringify() 储存下来就可以了。
- *优点*：兼容性好，不需要额外库或工具。简单快捷，基本可以满足大部分需求。

*缺点*：状态通过 JSON 方法储存（相当于深拷贝），如果状态中有特殊情况（比如 Date 对象、Regexp 对象等）的时候会得到字符串而不是原来的值。（具体参考用 JSON 深拷贝的缺点）

- <u>通过 react-router 的 Link 组件的 prop-to可以实现路由间传递参数的效果。</u>传递 state 参数，在 B 组件中通过 history.location.state 就可以拿到 state 值，保存它。返回 A 组件时再次携带 state 达到路由状态保持的效果。
- *优点*:简单快捷，不会污染 LocalStorage / SessionStorage。可以传递 Date、 RegEXp 等特殊对象（不用担心 JSON.stringify / parse 的不足）

*缺点*:如果 A 组件可以跳转至多个组件，那么在每一个跳转组件内都要写相同的逻辑。

- <u>要切换的组件作为子组件全屏渲染，父组件中正常储存页面状态。</u>
- Vue中，使用用keep-alive来缓存页面，当组件在keep-alive内被切换时组件的activated、deactivated这两个生命周期钩子函数会被执行、被包裏在keep-alive中的组件的状态将会被保留

---

**keep-alive**

有时候我们**不希望组件被重新渲染影响使用体验**；或者处于性能考虑，**避免多次重复渲染降低性能**。而是希望**组件可以缓存**下来,维持当前的状态。这时候就需要用到keep-alive组件。

*生命周期*的变化：

- 初次进入时： onMounted> onActivated
- 退出后触发：deactivated
- 再次进入只会触发 onActivated
- 事件挂载的方法等，**只执行一次的放在 onMounted中；组件每次进去执行的方法放在 onActivated中**

属性：

- include 字符串或正则表达式，只有名称匹配的组件会被匹配；
- exclude 字符串或正则表达式，任何名称匹配的组件都不会被缓存；
- max 数字，最多可以缓存多少组件实例。

**实现摧毁它缓存的组件那应该怎么做？**

- 通过在组件的 `beforeDestroy` 钩子函数中手动清除缓存来实现，调用 `$destroy()` 方法销毁组件实例
- 确保组件实例被立即销毁并从缓存中移除，可以在 `deactivated` 钩子函数中手动调用 `$destroy()` 方法

**页面A有组件B,C，B被keep-alive了，但是我跳转到C页面，B会被摧毁吗？**

当你从页面A跳转到页面C时，组件B并不会被销毁，它的**状态会被保留下来**。只有当它再次被加载时，才会从之前保存的状态中恢复，而不是从头开始。

### 渲染器

- 完整渲染的流程：`Template——(编译器)——>render函数(返回虚拟dom对象)——(渲染器)——>真实dom`
- 渲染器作用：把虚拟dom对象渲染为真实的dom元素。渲染器会执行挂载(只有新元素)和打补丁(新旧元素)操作
- 原理：递归遍历虚拟DOM对象，并调用原生的DOM API来完成真实DOM的创建。
- 渲染器的`精髓`在于后续的更新，`通过Diff算法找出变更点，只更新需要更新的部分`
- 自定义渲染器：让核心代码不依赖平台特有的API，通过传入配置项来完成特定平台下的渲染工作（浏览器使用DOM API完成创建、删除等）

### $nextTick 原理及作用

- <u>浅层原理：</u>当下次视图更新之后再调用回调函数
- <u>定义：</u>`Vue` 在更新 `DOM` 时是异步执行的。当数据发生变化，`Vue`将开启一个异步更新队列，视图需要等队列中所有数据变化完成之后，再统一进行更新
- 核心：利用`异步达到视图更新再回调`的目的
- <u>原理</u>：nextTick 的核心是`利用了如 Promise 、 MutationObserver、 setlmmediate、 setTimeout的原生 JavaScript 方+法来模拟对应的微/宏任务`的实现，本质是为了*利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列。*
- 把回调函数放入callbacks等待执行
- 将执行函数放到微任务或者宏任务中
- 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调
- <u>使用场景：</u>想要在修改数据后立刻得到更新后的`DOM`结构，可以使用`Vue.nextTick()`

### Mixin混入

- 其他类可以访问`mixin`类的方法而不必成为其子类，有利于代码复用又避免了多继承的复杂。本质就是一个`js对象`
- 原理：
- 优先递归处理 `mixins`
- 先遍历合并`parent` 中的`key`，调用`mergeField`方法进行合并，然后保存在变量`options`
- 再遍历 `child`，合并补上 `parent` 中没有的`key`，调用`mergeField`方法进行合并，保存在变量`options`
- 通过 `mergeField` 函数进行了合并
- `Vue`的几种类型的合并策略
- 替换型：`props`、`methods`、`inject`、`computed`会被后来者代替
- 合并型：`data`
- 目标 data 对象不包含当前属性时，调用 `set` 方法进行合并（set方法其实就是一些合并重新赋值的方法）
- 当目标 data 对象包含当前属性并且当前值为纯对象时，递归合并当前对象值，这样做是为了防止对象存在新增属性
- 队列性合并：全部生命周期和`watch`（生命周期钩子和`watch`被合并为一个数组，然后正序遍历一次执行）
- 叠加型：通过原型链进行层层的叠加`component、directives、filters`

## 二、生命周期

### Vue生命周期

**Vue的生命周期**：四大创建过程：创建、挂载、渲染更新、销毁（前三个首次加载执行）

- <u>before created(set up):</u> 数据观测和初始化事件还未开始，data的响应式追踪、event/watcher都没有被设置，不能访问到data、method、computed、watch的数据
- setup() 函数`无法直接通过 this 获取组件实例`，但是可以通过传入 setup 的参数来获取getCurrentInstance()或返回一个代理对象的方式在创建后间接获取实例。
- setup 可以操作 dom ：setup 可以访问组件实例,实例上挂载了 $el 属性,可以用于操作 DOM
- setup函数会将原始值，通过proxy代理的方式实现`自动脱ref`,ref的内部机制就是将原始值进行”对象包裹“(proxy无法提供原始值代理，包裹对象来间接实现原始值的响应式)，通过判断读取的值是否是ref，从而直接返回value属性值
- <u>created（setup）</u>：实例创建完成，上述数据均配置完成，但是`渲染节点未挂载到DOM`，不能访问到$el属性
- *异步数据获取*（`推荐在这个位置获取数据 组件中的数据其实可以操作了`）
- 能更快获取到服务端数据，减少页面加载时间，用户体验更好；
- SSR不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。
- 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
- 组件初始化、数据获取、事件订阅、数据预处理
- <u>beforeMount(onBeforeMount)</u>: 挂载前调用，render函数首次被调用。走完整流程的编译过程，根据数据和模版生成虚拟对象
- 读取不到dom （*异步数据获取*）
- <u>mounted（onMounted）</u>：在el被新创建的vm.$el替换，`挂载到DOM上之后调用`。已被渲染成真实的DOM
- 访问数据和dom （*异步数据获取*）
- 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
- 执行需要依赖 DOM 的操作
- <u>beforeUpdate(onBeforeUpdate):</u> 响应式数据更新时调用，但是真实对应真实dom未被渲染
- 获取的是更新之前的dom
- <u>updated(onUpdated)</u>: 真实DOM已经被更新，可以执行依赖于DOM的操作（服务器渲染期间不被调用）
- 获取的是更新之后的dom
- <u>beforeUnmount (onBeforeUnmount)</u>: dom元素的销毁，实力销毁前仍可被使用
- <u>unmounted (onUnmount)</u>: 事件侦听器移除，所有子组件实例被卸载（服务器渲染期间不被调用）

**父子组件的生命周期执行过程：**

- 加载渲染过程：
- 父组件 beforeCreate——created——beforeMount
- 子组件 beforeCreate——created——beforeMount——mounted
- 父组件 mounted
- 更新过程：
- 父组件 beforeUpdate
- 子组件 beforeUpdate——updated
- 父组件 updated
- 销毁过程：
- 父组件 beforeDestroy
- 子组件 beforeDestroy——destroyed
- 父组件 destoryed

**当组件切换的时候,生命周期钩子的执行顺序**:

离开当前组件:

- beforeDestroy:组件销毁之前调用。在这一步,你还可以访问组件实例。

进入下一个组件:

- beforeCreate:组件实例刚被创建时调用,这时组件实例还未被初始化。
- created:组件实例已经创建结束,但是尚未开始编译虚拟DOM。
- beforeMount:在挂载开始之前被调用:相关的 render 函数首次被调用。
- mounted:组件的虚拟DOM已经被渲染进了DOM中。
- beforeUpdate:数据更新时调用,发生在虚拟DOM重新渲染和打补丁之前。
- updated:由于数据更改导致的虚拟DOM已重新渲染和打补丁,组件dom已更新。
- activated:被keep-alive缓存的组件激活时调用。(当它被缓存时会执行 `deactivated` 钩子函数，当它被重新激活时会执行 `activated` 钩子函数，而不是 `created` 和 `mounted` 钩子函数。)

## 三、组件通信

### 组件通信方式有哪些？

*组件间通信的方式：*

**vuex：**全局状态管理

**props/$emit:** 父子单向数据事件传递和触发

**ref:$refs/$parent:** 通过 ref 属性给子组件设置一个名字。父组件通过 `$refs` 组件名来获得子组件，子组件通过 `$parent` 获得父组件，这样也可以实现通信。

**provide/ inject（依赖注入）:** 祖先向后代注入，在父组件中通过 provide提供变量，在子组件中通过 inject 来将变量注入到组件中。

**$parent 和/$children:** 父子组件的直接访问 。

**EventBus（$emit / $on）：** 任意两组件基于事件通信(第三方)。

**mitt事件总线：**发布订阅。

*兄弟间通信的方式：*

**vuex：**全局状态管理

**EventBus：** 任意两组件基于事件通信

**$parent/$refs** 要有一个组件的媒介

## 四、路由：Vue-router

### 实现路由懒加载的方式

- `箭头函数+import动态加载`
- `箭头函数+require动态加载`
- `webpack的require.ensure`技术，也可以实现按需加载。

### 路由的hash和history模式的区别

- <u>前端路由的理解：</u>前端路由可以帮助我们在仅有一个页面的情况下，“记住”用户当前走到了哪一步——为 SPA 中的各个视图匹配一个唯一标识。
- 这意味着用户前进、后退触发的新内容，都会映射到不同的 URL 上去。此时即便他刷新页面，因为当前的 URL 可以标识出他所处的位置，因此内容也不会丢失。
- <u>hash模式：(默认)</u>
- `外观在url中带#`，开发时常用`，通过window.onhashchange方法监听到location.hash值的改变`，进行按规则加载相应的代码，不会重新加载页面(`不会刷新浏览器页面`)，无需向后端发起请求。
- <u>history模式：</u>
- 传统路由分发，需要后端的配置支持。`通过popstate监听url的变化`。

出现404问题（在nginx配置回退路由到index.html）

history 模式的路由切换默认情况下*不会引起页面的刷新*，当进行在地址栏中输入地址后敲回车回引起页面刷新

其基本API--pushState() 和 replaceState()改变当前url，不会立即向后端发起请求。

**当前进后退的时候如何监听到路由变化？：**

全局的 afterEach 导航守卫，该导航守卫会在路由跳转完成后被触发，在该导航守卫中监听路由的变化。

beforeEach 导航守卫会在每个路由跳转之前被触发，可以在该导航守卫中进行拦截和重定向等操作。

**动态路由+路由传参**：

- *param方式*：
- 配置路由格式：/router/:id
- 传递的方式：在path后面跟上对应的值
- 传递后形成的路径： /router/123
- 通过 $route.params.id 获取传递的值
- *query方式*：
- 配置路由格式：/router，也就是普通配置
- 传递的方式：对象中使用query的key作为传递方式
- 传递后形成的路径：/ route? id=123
- 通过$route.query 获取传递的值

**导航守卫：**控制路由跳转的钩子函数

- *使用*：对new的vue router实例进行调用响应方法，全局的，单个路由独享的，或者组件级的
- *类型*：
- 全局前置/钩子(前置-解析-后置)：beforeEach(鉴权和数据预处理)、 beforeResolve(异步请求)、 afterEach(页面统计和日志记录）
- 路由独享的守卫：beforeEnter
- 组件内的守卫：beforeRouteEnter、 beforeRouteUpdate、 beforeRouteLeave

**$route 和$router 的区别：**

- $route 是“路由信息对象”，包括 path, params, hash, query, fullPath， matched，name 等路由信息参数
- $router 是“路由实例〞对象包括了路由的跳转方法，钩子函数等。

## 五、VueX

### Vuex：全局状态管理器

**vuex理解：**全局状态管理器，每一个 Vuex 应用的核心就是 store（仓库），这个仓库就是包含了你应用的需要的全局状态。

**属性值：**

- state => 基本数据(数据源存放地)
- getters => 从基本数据派生出来的数据
- mutations => 提交更改数据的方法，同步
- actions => 像一个装饰器，包裹mutations，使之可以异步。
- modules => 模块化Vuex

**Vuex和Pinia**：它们都提供了一种集中式的方式来管理应用程序的状态。以下是Vuex和Pinia之间的一些对比：

1. API和使用方式：Vuex的API比较复杂，需要在store中定义state、mutations、actions、getters等多个概念，而Pinia的API则更加简单和直接，`只需要定义state和actions`即可。在使用上，Pinia也更加符合Vue.js的组件化方式，可以更好地与Vue.js应用程序集成。
2. 性能：在性能方面，Pinia比Vuex更快。这是因为Pinia使用Vue的Reactivity API，可以更好地利用Vue.js的响应式系统，而Vuex则需要在store中手动定义getter和mutation，这使得Vuex的性能稍逊于Pinia。
3. 插件支持和生态系统：Vuex拥有丰富的插件支持和庞大的生态系统，可以与许多第三方库和工具集成。Pinia则相对较新，生态系统还不如Vuex成熟，但Pinia在逐渐增长和发展中。

## 六、虚拟DOM

### 虚拟DOM？Diff算法？循环有key？

**虚拟dom**：

- 原理：使用js来生成一个AST语法树，`实际是一个JavaScript对象`，通过`对象的方式来表示DOM结构`，描述UI方式。

 在代码渲染到页面之前，vue会把代码转换成一个对象（虚拟 DOM）。以对象的形式来描述真实DOM结构，最终渲染到页面。在每次数据发生变化前，虚拟DOM都会缓存一份，变化之时，现在的虚拟DOM会与缓存的虚拟DOM进行比较。在vue内部封装了diff算法，通过这个算法来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

- 作用：将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。
- 流程：
- 普通dom元素的处理
- 组件处理：
- 挂载组件：1.创建组件实例 2.设置组件实例 3.设置并运行副作用的渲染函数

**为什要虚拟dom？：**一个dom属性非常多，既然都要操作DOM，就是使用js的计算性能来换取dom所消耗的性能。尽量避免直接操作dom。

在更新时，新旧节点的情况可能有：没有子节点、文本节点、一组子节点，最笨的方法先卸载所有旧节点，再挂载所有新节点。

**diff算法：**虚拟 dom 渲染成真实 dom 的新旧 VNode 节点比较，适用于新旧虚拟节点都是一组节点的情况，来最大程度的复用DOM。diff整体策略为：`深度优先，同层比较`

- 处理规则：是否有节点需要移动，怎么去移动，找要添加和删除的节点
- <u>简单Diff算法</u>：拿新的一组子节点去旧的一组节点找可复用的节点。找到了就记录该节点的位置索引(成为最大index),然后在整个过程中，如果一个节点的索引小于最大索引，该节点对应的真实DOM就需要进行移动更新。
- <u>双端Diff算法</u>：在新旧两组节点的这四个端点分别比较，并试图找到可以复用节点。(`减少DOM的移动次数`)
- 理想情况：四次对比有一次命中
- 非理想情况：四次对比均不命中，拿新节点的头部节点去旧的节点寻找
- 挂载:Diff算法比较后，新元素出现旧节点没有的，挂到旧节点的最后索引位置
- 移除：遍历旧节点需要移除的节点
- <u>快速Diff算法</u>：先处理新旧两组子节点的前置节点和相同的后置节点。当前置节点和后置节点全部处理完毕后，如果无法简单通过挂载新节点或者卸载已经不存在的节点来完成更新，根据`节点的索引关系构造一个最长递增子序列`。最长递增子序列指向的节点即为不需要移动的节点。
- 前序和尾序算法执行完，进入特殊情况，`针对新节点构建一个source数组表示新节点在旧节点的位置索引`，利用source数组构建一个最长递增子序列。
- 最长递增子序列目的：最长子序列索引对应--`新节点更新的前后顺序没有发生变化` 最后挂在全新节点

**有key：**先判断新旧type和key是否一致(type:'div',key:'自己加的表示') `确定新旧节点的对应顺序，新旧节点的映射关系 尽可能通过移动的方式让真实dom更新`

vue2只执行前两个步骤 然后再交叉对比

1.前序算法：循环 对比前面的 (a-a b-b) （发现第三个c和ddd不一样了，转2）

2.尾序算法：循环 对比尾部的(c-c) （发现倒数第二个ddd和b不一样了，跳出循环，转3）

3.新节点多了就新增旧的，使用patch新增

4.新节点少了就卸载旧的。

5.特殊情况乱序：发生了位移、删除不可控的情况 比如 旧[a,d,e,l.f]新[a,e,l,d,f]新旧节点的（`最长递增子序列+倒序遍历` 升序 贪心+二分查找）

**无key：**分为三步 旧[a,b,c] 新[a,b,ddd,c]

1.替换： 新旧虚拟dom对比，新的替换旧的 新的逐个替换旧的 a-a b-b ddd-c

2.新增：如果新虚拟dom有多的 就直接进行新增原来。c现在多出一个直接新增到旧dom

3.删除：如果新虚拟dom有少了，就进行删除原来的。

Key的作用：key 是为 Vue 中 vnode 的唯一标记，通过这个 key，diff 操作可以更准确、更快速

- 在新旧节点对比的时候只要两个虚拟节点key和type属性值相同就说明是相同，可以更快得到新旧节点的映射关系(前后顺序不同的情况)
- 更准确：因为带key 就不是就地复用了，在 sameNode 函数a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。
- 更快速：利用 key 的唯一性生成map 对象来获取对应节点，比遍历方式更快

## MVVM、MVC、MVP（软件架构模式）的区别？

**（1）MVVM：**MVVM 分为 Model、View、ViewModel：

- Model代表`数据模型`，数据和业务逻辑都在Model层中定义；View代表UI`视图`，负责数据的展示；ViewModel负责`监听Model中数据的改变并且控制视图的更新`，处理用户交互操作；
- View和Model之间通过ViewModel（业务逻辑）来进行联系。
- Model和ViewModel之间有着双向数据绑定的联系。
- 优点：Model和View的数据自动同步，因此开发者只需要专注于数据的维护操作

**（2）MVC：**

- View 负责页面的显示逻辑、Model 负责存储页面的业务数据以及相应的操作、Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作。
- 视图V发出`动作指令`Controller进行事件触发，`选择模型`更新数据M，最后通过`驱动视图`更新视图V

**（3）MVP：**

MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。在 Presenter 中将 Model 的变化和 View 的变化绑定在一起，以此来实现 View 和 Model 的同步更新。

## TypeScript

### Q1. 什么是动态类型与静态类型?

JavaScript 的类型系统非常弱，而且没有使用限制，运算符可以接受各种类型的值。在语法上，JavaScript 属于动态类型语言。TypeScript 的主要功能是为 JavaScript 添加类型系统，**TypeScript** 引入了一个更强大、更严格的类型系统，属于**静态类型语言。**

静态类型优点：

- 有利于代码的静态分析
- 有利于发现错误
- 更好的 IDE 支持，做到语法提示和自动补全
- 提供了代码文档
- 有助于代码重构

静态类型缺点：

- 引入了独立的编译步骤
- 丧失了动态类型的代码灵活性
- 增加了编程工作量
- 更高的学习成本
- 兼容性问题

### Q2. TS 有哪些类型？

JavaScript 的 8 种类型之中，**undefined 和 null 其实是两个特殊值，object 属于复合类型，剩下的五种属于原始类型（primitive value）**，代表最基本的、不可再分的值。

- boolean
- string
- number
- bigint
- symbol
- null
- undefined
- object

**五种原始类型都有对应的包装对象，包装类型：**

- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

### Q3. any 和 unknown 区别？

- any 类型是一种**“逃脱类型检查”的类型**。当一个变量被声明为 any 类型时，你可以对它进行任何操作，包括调用任意属性或方法，而不会收到 TypeScript 编译器的任何错误提示。
- unknown 类型**表示该变量的类型是未知的**，它是一种安全的“多类型”类型。对 unknown 类型的变量进行操作时，**必须进行类型检查或类型断言**（如 typeof），否则 TypeScript 编译器会报错。
- unknown 可以**看作是更安全的 any**。一般来说，凡是需要设为 any 类型的地方，通常都应该优先考虑设为 unknown 类型

### Q2. interface 接口和 type 类型别名区别？

很多对象类型既可以用 interface 表示，也可以用 type 表示。而且，两者往往可以换用，**几乎所有的 interface 命令都可以改写为 type 命令。**

| **对比项**             | **interface**                        | **type**                                                     |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------ |
| **重复声明**           | ✅ 可以多次声明，同名会自动合并       | ❌ 不能重复声明，同名会报错                                   |
| **继承 / 扩展**        | ✅ 可使用 `extends` 继承多个接口      | ❌ 不支持继承，可通过 `&`（交叉类型）合并                     |
| **表示类型**           | 主要表示对象类型（对象、数组、函数） | 可表示任意类型（对象、联合类型、交叉类型、元组、字面量等）   |
| **属性映射 (Mapping)** | ❌ 不支持属性映射                     | ✅ 支持属性映射                                               |
| **this 类型**          | ✅ 可在接口中使用 `this`              | ❌ 不支持                                                     |
| **扩展原始数据类型**   | ❌ 不能扩展原始类型                   | ✅ 可以扩展原始类型（如 `type Str = string & { length: 5 }`） |
| **复杂类型支持**       | ❌ 无法直接表达联合类型、交叉类型     | ✅ 可直接表示复杂类型（联合、交叉、字面量类型等）             |

综上所述，如果有复杂的类型运算，那么**没有其他选择只能使用 type；一般情况下，interface 灵活性比较高，便于扩充类型或自动合并**，建议优先使用。

### Q3. keyof 和 typeof 关键字的作用？keyof 使用场景？

- **keyof 关键字用于获取一个类型的所有键的联合（Union）**，这些键通常是类型中存在的公共属性名。它常用于索引访问操作中，以确保访问的属性确实存在于对象上。使用场景：当你需要操作一个类型的键，或者需要确保某个属性确实存在于对象上时
- **typeof 关键字用于获取一个变量或属性的类型**。使用场景：当你需要获取一个变量或对象的类型，或者需要创建一个与现有变量或对象具有相同类型的新类型时。

keyof 是一个单目运算符，**接受一个对象类型作为参数（定义泛型约束）**，返回该对象的所有键名组成的联合类型。keyof 类型操作符在 TypeScript 中的几种常见使用场景如下：

- **索引签名**：keyof 可以用来创建索引签名，确保对象的键只能是某些特定的类型。
- **类型守卫**：keyof 可以与类型守卫结合使用，以确保变量的属性访问是安全的。可以使用 keyof 来定义泛型约束，限制泛型参数为某个对象的键。
- **映射类型**：keyof 可以与映射类型结合使用，创建新类型，其属性是原始类型的子集。
- **条件类型**：keyof 可以用于条件类型中，基于类型的键来分支类型。
- 函数重载：keyof 可以用于函数重载，以区分不同的函数签名。

### Q4. 泛型使用场景及泛型约束？

为同一个函数、接口或类定义多种类型版本，而不必为每种类型编写多个版本。

- 使用**泛型约束（extends关键字）来限制泛型参数的类型范围**，确保泛型参数符合某种特定的条件。
- **keyof** 是 TypeScript 中用来获取对象类型所有键（属性名）的操作符。可以使用 keyof 来定义泛型约束，限制泛型参数为某个对象的键。

### Q6. 常用的类型工具？

#### `Partial<T>`

用于构造一个新类型，并将类型 T 的**所有属性变为可选属性**。这个工具类型在需要创建一个对象，其中某些属性可能是未定义的，但又想保持其他属性类型不变时非常有用。

#### `Required<T>`

用于构造一个新类型，并将类型 T 的**所有属性变为必选属性**。这与 `Partial<T>` 相反，当你需要确保对象的所有属性都被定义时，这个类型非常有用

#### `Readonly<T>`

用于构造一个新类型，并将类型 T 的所有属性变为只读属性。这意味着属性的值不能被重新赋值。

#### `Pick<T, K>`

用于从类型 T 中选取一组属性 K，**构造一个新类型**。这个工具类型在需要**从现有类型中选择部分属性**时非常有用。

#### `Omit<T, K>`

用于从类型 T 中**剔除一组属性 K，构造一个新类型**。这个工具类型在需要从现有类型中**排除部分属性**时非常有用。

#### `Exclude<T, U>`

用于从**联合类型 T 中排除掉 U 中定义的类型**，即 T 减去 U 的类型。这个工具类型在需要从联合类型中排除某些值时非常有用。

#### `Extract<T, U>`

用来**从联合类型 T 之中，提取指定类型 U**，组成一个新类型返回。它与 `Exclude<T, U>` 正好相反。

#### `NonNullable<T>`

用于构造一个新类型，从类型 **T 中排除 null 和 undefined**。这个工具类型在需要确保值不是 null 或 undefined 时非常有用。

#### `Record<K, T>`

用于**构造一个对象类型，其属性名为类型 K 的值，属性值为类型 T**。这个工具类型在需要创建一个对象，其属性是动态的，但值类型是固定的时非常有用。

#### `ReturnType<Type>`

**提取函数类型 Type 的返回值类型，作为一个新类型返回。**

### Q7. TypeScript 模块的加载机制？

模块本身就是一个作用域，不属于全局作用域。模块内部的变量、函数、类只在内部可见，对于模块外部是不可见的。**暴露给外部的接口，必须用 export 命令声明；如果其他文件要使用模块的接口，必须用 import 命令来输入。**

- （1）编译阶段：当你使用 TypeScript 编译器 (tsc) 编译 TypeScript 代码时，它会将 TypeScript 代码转换成 JavaScript 代码。编译器处理模块声明，并生成相应的 export 和 import 语句。
- （2）加载阶段：在运行时，JavaScript 模块的加载取决于环境（浏览器或 Node.js）。浏览器使用 HTML 的 `<script>` 标签或模块加载器来加载模块。Node.js 使用 require() 函数来加载模块，或者使用 import 语句（在支持 ES6 模块的环境中）。
- （3）模块解析：TypeScript 使用 Node.js 的模块解析算法，这意味着它遵循 "node_modules" 查找路径和 "package.json" 中的 "main" 属性。TypeScript 也支持非标准路径的模块导入，这需要在 tsconfig.json 中配置路径映射。
- （4）模块绑定：当模块被加载时，它们的导出被绑定到一个模块对象上。当模块被导入时，导入的绑定指向模块对象的相应导出。

### Q8. TypeScript 中 const 与 readonly 的区别？

- **const 声明的是整个变量或对象是不可变的（作用于变量）**，而 **readonly 只声明对象或类的某个属性是不可变的（作用于属性）**，readonly 可以用于类的属性，而 const 不能用于类的属性。

### Q9. JIT 与 AOT 编译区别？

JIT（Just-In-Time）和AOT（Ahead-of-Time）是两种不同的编译技术，它们在编译时间、执行效率、资源占用和灵活性等方面存在显著差异：

1. **JIT（即时编译）**：
    - **定义**：JIT编译器在程序运行时逐段地进行编译，这意味着编译过程与程序的执行过程并行进行。
    - **优点**：
        - 动态优化：可以根据程序的实际运行情况进行优化，生成更加高效的机器代码。
        - 平台无关性：可以针对不同的平台在运行时进行特定优化。
    - **缺点**：
        - 启动延迟：程序启动时需要时间来编译代码。
        - 资源消耗：运行时编译和优化会占用额外的CPU资源。
    - 边运行边编译；吞吐量高，有运行时性能加成，可以跑得更快，并可以做到动态生成代码等，但是相对启动速度较慢，并需要一定时间和调用频率才能触发 JIT 的分层机制，即当代码执行到一定程度时，JIT 编译器会将代码编译成机器码，并缓存起来，下次执行时直接从缓存中获取机器码，而无需重新编译。
1. **AOT（预先编译）**：
    - **定义**：AOT编译器在程序运行前一次性完成编译工作，将源代码编译成机器码。
    - **优点**：
        - 快速启动：程序启动时不需要编译时间，可以直接运行编译后的机器码。
        - 较低的运行时开销：减少了运行时的资源消耗。
    - **缺点**：
        - 缺乏动态优化：无法根据运行时条件进行优化。
        - 编译时间长：大型项目可能需要较长时间来完成编译。
    - 内存占用低，启动速度快，可以无需 runtime 运行，直接将 runtime 静态链接至最终的程序中，但是无运行时性能加成，不能根据程序运行情况做进一步的优化。
