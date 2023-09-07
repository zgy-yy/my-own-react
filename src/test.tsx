import {createReactElement} from "./createReactElement";
import {render} from "./render";

const mReact = {
    createReactElement
}

/** @jsx mReact.createReactElement */
function App(props: FProps) {
    return <h1 id={props.id}>hai {props.name}</h1>
}

const el = <App name={"foo"} id={'a'}></App>
console.log(el)
console.log(<p>p</p>)

/******************************/
// react 元素 element
// const element = {
//     type: "h1",
//     props: {
//         title: "foo",
//         children: "Hello",
//     },
// }
const container = document.getElementById("app") as HTMLElement
render(el, container)
// html 元素 node
// const node = document.createElement(element.type)
// node["title"] = element.props.title
//
// const text = document.createTextNode("")

