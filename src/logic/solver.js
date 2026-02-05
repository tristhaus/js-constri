import { registry } from './registry'

const initState = () => {
    return {
        collection: []
    }
}

const solvePoint = (newPoint, state) => {
    state.collection.push(newPoint)
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

        default:
            return null
    }
}

export { initState, solve }
