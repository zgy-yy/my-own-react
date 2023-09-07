interface Fiber {
    type: string
    props: PropsInterface
    dom: HTMLElement | Text
    parent: Fiber
    child: Fiber
    sibling: Fiber

}

function createDom(fiber: Fiber) {
    // 根据 fiber.type,创建出真实dom
    const domNode = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
    if (domNode instanceof Text) {
        domNode.textContent = fiber.props.nodeValue
    }
    return domNode
}

let nextUnitOfWork: Fiber = null
let wipRoot: Fiber = null // 把修改DOM 这部分内容记录在 fiber tree 上，通过追踪这颗wipRoot树来收集所有 DOM 节点的修改

// react 中 用element 表示 react的虚拟dom节点
export function render(element: ReactElement, container: HTMLElement) {
    // work in progress root
    wipRoot = {
        type: '',
        dom: container,
        props: {
            children: [element]
        },
        parent: null,
        child: null,
        sibling: null
    }

    nextUnitOfWork = wipRoot
}

// 需要执行的任务，需要执行当前一小部分的任务，还需要返回下次要执行的任务，以供浏览器执行
/*
把任务单元组织起来。每个任务单元都有浏览器调度，浏览器会在执行完更高优先级任务时，来执行一个任务单元，避免大量的dom渲染造成阻塞主线程
每一个ReactElement 都是一个fiber,每个fiber都是一个任务单元
每个fiber完成三件事
1.把 element 添加到 DOM 上
2.为该 fiber 节点的子节点新建 fiber
3.挑出下一个任务单元
*/
function performUnitOfWork(fiber: Fiber): Fiber {
    // TODO add dom node
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    // if (fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }
    // TODO create new fibers
    const reactElements = fiber.props.children
    let index = 0;
    let prevSibling: Fiber = null //fiber的兄弟节点
    while (index < reactElements.length) {
        const reactEl = reactElements[index]
        const newFiber: Fiber = {
            type: reactEl.type,
            props: reactEl.props,
            parent: fiber,
            dom: null,
            child: null,
            sibling: null
        }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
    // TODO return next unit of work
    if (fiber.child) {
        return fiber.child //有child fiber 下一个工作节点就是child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling // 或兄弟节点
        }
        nextFiber = nextFiber.parent //最后 uncle节点
    }

}

function commitRoot() { //提交到 dom
    // TODO add nodes to dom
    commitWork(wipRoot.child)
    wipRoot = null
}

function commitWork(fiber: Fiber) {
    if (!fiber) {
        return
    }
    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)//挂载子节点
    commitWork(fiber.sibling)
}

function workLoop(deadline: IdleDeadline) {
    let shouldYield = false

    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1 //可用时间小于1时 就停止执行任务，知道有新的空闲时间时
    }

    if (!nextUnitOfWork && wipRoot) { //完成了 wipRoot的所有任务，就将该整棵树提交到真实dom上
        commitRoot()
    }
    requestIdleCallback(workLoop) //浏览器 决定合适执行回调，会在空闲时
}

requestIdleCallback(workLoop)
