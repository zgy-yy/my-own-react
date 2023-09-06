

interface PropsInterface {
    [key: string]: any

    children?: ReactElement[] | string[]
}

interface ReactElement {
    type: string,
    props: PropsInterface
}
