import { ItemPoint } from './ItemPoint'
import { ItemSegment } from './ItemSegment'
import { registry } from './registry'

const initState = () => {
    return {
        collection: []
    }
}

const solvePoint = (commandPoint, state) => {
    const itemPoint = new ItemPoint(commandPoint.name, commandPoint.x, commandPoint.y)
    state.collection.push(itemPoint)
    return state
}

// implementation note: when adding the `segment ab A B 6.0` form, we add points in here

const solveSegment = (commandSegment, state) => {
    if (commandSegment.startPointName === commandSegment.endPointName) {
        return null
    }

    const startPoint = state.collection.find(x => x.name === commandSegment.startPointName)
    if (startPoint === undefined || startPoint.type !== registry.point) {
        return null
    }

    const endPoint = state.collection.find(x => x.name === commandSegment.endPointName)
    if (endPoint === undefined || endPoint.type !== registry.point) {
        return null
    }

    const itemSegment = new ItemSegment(commandSegment.name, startPoint, endPoint)
    state.collection.push(itemSegment)
    return state
}

// this may create items with names not matching allowed user input
// points starting with '$'
//  - will not display names
const solve = (item, state) => {
    if (state.collection.some(x => x.name === item.name)) {
        return null
    }

    switch (item.type) {
        case registry.point:
            return solvePoint(item, state)

        case registry.segment:
            return solveSegment(item, state)

        default:
            return null
    }
}

export { initState, solve }
