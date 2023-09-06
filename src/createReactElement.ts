// 创建 虚拟dom ,vnode
export function createReactElement(type: string, props: PropsInterface | null, ...children: ReactElement[] | string[]): ReactElement {
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

export function createReactTextElement(text: string | number) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

