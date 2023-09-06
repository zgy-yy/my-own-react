import {createReactElement} from "./createReactElement";

const mReact = {
    createReactElement
}
/** @jsx mReact.createReactElement */
const el =<div>
    <p>hello</p>
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
const container = document.getElementById("app")

// html 元素 node
// const node = document.createElement(element.type)
// node["title"] = element.props.title
//
// const text = document.createTextNode("")
