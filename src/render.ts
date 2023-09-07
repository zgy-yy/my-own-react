// react 中 用element 表示 react的虚拟dom节点
export function render(element: ReactElement, container: HTMLElement) {
    // 根据 ReactElement.type,创建出真实dom
    const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
    const isProperty = (key: string) => key !== "children" //判断是否时属性，而非子节点
    Object.keys(element.props).filter(isProperty).forEach(name => {
        dom[name] = element.props[name]
    })//将props上的属性 添加到真实dom上

    if (element.props.children) { //如果当前的element有子节点children 就递归调用render进行渲染
        element.props.children.forEach(child => {
            render(child, dom as HTMLElement)
        })
    }
    container.appendChild(dom)
}