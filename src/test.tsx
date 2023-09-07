import {createReactElement} from "./createReactElement";
import {render} from "./render";

const mReact = {
    createReactElement
}
/** @jsx mReact.createReactElement */
const el = <div>
    <p id={'name'}>hello</p>
    <p>wo</p>
</div>

console.log(el)

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

