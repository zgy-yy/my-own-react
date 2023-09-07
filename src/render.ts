interface Fiber {
    type: string
    props: {
        children: ReactElement[]
    }
    dom: HTMLElement | Text
    parent: Fiber
    child: Fiber
    sibling: Fiber

}

function createDom(fiber: Fiber) {
    // 根据 fiber.type,创建出真实dom
    return fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
}

let nextUnitOfWork: any


// react 中 用element 表示 react的虚拟dom节点
export function render(element: ReactElement, container: HTMLElement) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }


    // // 根据 ReactElement.type,创建出真实dom
    // const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
    // const isProperty = (key: string) => key !== "children" //判断是否时属性，而非子节点
    // Object.keys(element.props).filter(isProperty).forEach(name => {
    //     dom[name] = element.props[name]
    // })//将props上的属性 添加到真实dom上
    //
    // if (element.props.children) { //如果当前的element有子节点children 就递归调用render进行渲染
    //     element.props.children.forEach(child => {
    //         render(child, dom as HTMLElement)
    //     })
    // }
    // container.appendChild(dom)
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
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }
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


function workLoop(deadline: IdleDeadline) {
    let shouldYield = false

    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1 //可用时间小于1时 就停止执行任务，知道有新的空闲时间时
    }
    requestIdleCallback(workLoop) //浏览器 决定合适执行回调，会在空闲时
}

// requestIdleCallback(workLoop)