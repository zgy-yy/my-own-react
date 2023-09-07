import {createDom, reconcileChildren} from "./fiber-dom";

export function updateFunctionComponent(fiber: Fiber) {
    const h: Function = fiber.type as Function
    const children = [h(fiber.props)]
    reconcileChildren(fiber, children)
}

export function updateHostComponent(fiber: Fiber) {
    // TODO create new fibers
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    const reactElements = fiber.props.children
    reconcileChildren(fiber, reactElements)
}