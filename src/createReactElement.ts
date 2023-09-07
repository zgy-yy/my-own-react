// 创建 虚拟dom ,vnode
export function createReactElement(type: string, props: PropsInterface | null, ...children: ReactElement[]): ReactElement {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === "object" ? child : createReactTextElement(child)
            )
        }
    }
}

// 将文字、数子等基本类型包装
export function createReactTextElement(text: string | number): ReactElement {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

