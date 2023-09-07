export function createDom(fiber: Fiber) {
    // 根据 fiber.type,创建出真实dom
    const domNode = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type as string)
    updateDom(domNode, {children: []}, fiber.props)
    return domNode
}


export let deletions: Fiber[] = [] //删除的Fiber节点
export function reconcileChildren(wipFiber: Fiber, reactElements: ReactElement[]) {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child //alternate.child oldFiber 就是 alternate.child,没有就是 alternate

    let prevSibling: Fiber = null //fiber的兄弟节点
    while (index < reactElements.length || oldFiber !== null) {
        const reactEl = reactElements[index]
        let newFiber = null
        const sameType = oldFiber && reactEl && reactEl.type == oldFiber.type
        if (sameType) {
            // TODO update the node
            newFiber = {
                type: oldFiber.type,
                props: reactEl.props,
                parent: wipFiber,
                dom: oldFiber.dom,
                child: null,
                sibling: null,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        }
        if (reactEl && !sameType) {
            // TODO add this node
            newFiber = {
                type: reactEl.type,
                props: reactEl.props,
                parent: wipFiber,
                dom: null,
                child: null,
                sibling: null,
                alternate: null,
                effectTag: 'PLACEMENT'
            }
        }
        if (oldFiber && !sameType) {
            // TODO delete the oldFiber's node
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }

        if (index === 0) {
            wipFiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
}

//比较新老 fiber 节点的属性， 移除、新增或修改对应属性。
const isProperty = (key: string) => key !== 'children'
const isNew = function (prev: PropsInterface, next: PropsInterface) {
    return (key: string) => prev[key] !== next[key]
}
const isGone = function (prev: PropsInterface, next: PropsInterface) {
    return (key: string) => !(key in next)
}


const isEvent = (key: string) => key.startsWith("on") //如果是以 ’on‘作为前缀 就是事件

export function updateDom(dom: HTMLElement | Text, prevProps: PropsInterface, nextProps: PropsInterface) {
    // 对属性的处理
    // Remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
            dom[name] = ''
        })

    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            dom[name] = nextProps[name]
        })

    // 对事件的处理
    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            key =>
                !(key in nextProps) ||
                isNew(prevProps, nextProps)(key)
        )
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.removeEventListener(
                eventType,
                prevProps[name]
            )
        })

    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.addEventListener(
                eventType,
                nextProps[name]
            )
        })
}
