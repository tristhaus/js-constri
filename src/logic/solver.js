import { registry } from './registry'

const solvePoint = (newPoint, state) => {
    state.collection.push(newPoint)
    return state
}

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

export { solve }
