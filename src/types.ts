interface PropsInterface {
    [key: string]: any

    children: ReactElement[]
}

interface ReactElement {
    type: string,
    props: PropsInterface
}
