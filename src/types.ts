interface PropsInterface {
    [key: string]: any

    children: ReactElement[]
}

interface ReactElement {
    type: string,
    props: PropsInterface
}

interface Fiber {
    type: string | Function
    props: PropsInterface
    dom: HTMLElement | Text
    parent: Fiber
    child: Fiber
    sibling: Fiber,
    alternate: Fiber//上一次提交的 fiber，用于更新时的对比
    effectTag: string
}


// 函数组件

interface FProps {
    [key: string]: any
}