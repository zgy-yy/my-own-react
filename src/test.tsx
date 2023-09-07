import {createReactElement} from "./createReactElement";
import {render} from "./render";

const mReact = {
    createReactElement
}
/** @jsx mReact.createReactElement */
const el = <div>
    <div>
        <p>hello</p>
        <a href="">a</a>
    </div>
    <h1>h1</h1>

</div>


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

