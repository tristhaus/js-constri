import { ItemLine } from './ItemLine'
import { ItemPoint } from './ItemPoint'
import { ItemSegment } from './ItemSegment'
import { registry } from './registry'

const epsilon = 1e-10

const initState = () => {
    return {
        collection: []
    }
}

const pointsSeemIdentical = (pointA, pointB) => {
    return (pointA.x - pointB.x)**2 + (pointA.y - pointB.y)**2 < epsilon
}

// returns [a, b, c] of a*x + b*y = c
const findNormalLineEquation = lineLike => {
    const a = -(lineLike.endPoint.y - lineLike.startPoint.y)
    const b =   lineLike.endPoint.x - lineLike.startPoint.x
    const c = lineLike.startPoint.y * lineLike.endPoint.x - lineLike.startPoint.x * lineLike.endPoint.y

    return [a, b, c]
}

const findInterval = lineLike => {
    let Sx = lineLike.startPoint.x
    let Sy = lineLike.startPoint.y
    let Ex = lineLike.endPoint.x
    let Ey = lineLike.endPoint.y

    if (lineLike.type === registry.line) {
        Sx = Number.NEGATIVE_INFINITY
        Sy = Number.NEGATIVE_INFINITY
        Ex = Number.POSITIVE_INFINITY
        Ey = Number.POSITIVE_INFINITY
    }

    return {
        xMin: Math.min(Sx, Ex),
        xMax: Math.max(Sx, Ex),
        yMin: Math.min(Sy, Ey),
        yMax: Math.max(Sy, Ey),
    }
}

// a `lineLike` is a `Line`, `Ray`, or `Segment`
const solveTwoLineLikesIntersection = (pointName, lineLikeR, lineLikeS, state) => {
    const [Ra, Rb, Rc] = findNormalLineEquation(lineLikeR)
    const [Sa, Sb, Sc] = findNormalLineEquation(lineLikeS)

    /*
        System of concurrent linear equations is now:
        | Ra*x + Rb*y = Rc |
        | Sa*x + Sb*y = Sc |
    */

    const detN = Ra * Sb - Rb * Sa

    // no intersection
    if (Math.abs(detN) < epsilon)
    {
        return state
    }

    const intersectX =  (Rc * Sb - Rb * Sc) / detN
    const intersectY =  (Ra * Sc - Rc * Sa) / detN

    const intervalR = findInterval(lineLikeR)
    const intervalS = findInterval(lineLikeS)

    if (intervalR.xMin > intersectX ||
        intervalR.xMax < intersectX ||
        intervalR.yMin > intersectY ||
        intervalR.yMax < intersectY ||
        intervalS.xMin > intersectX ||
        intervalS.xMax < intersectX ||
        intervalS.yMin > intersectY ||
        intervalS.yMax < intersectY)
    {
        return state
    }

    const itemIntersectionPoint = new ItemPoint(pointName, intersectX, intersectY)
    state.collection.push(itemIntersectionPoint)
    return state
}

// implementation note: we disregard circles for now

const solveIntersection = (commandIntersection, state) => {
    const itemA = state.collection.find(x => x.name === commandIntersection.itemAName)
    const itemB = state.collection.find(x => x.name === commandIntersection.itemBName)

    if (!(itemA?.type === registry.line || itemA?.type === registry.segment) ||
        !(itemB?.type === registry.line || itemB?.type === registry.segment))
    {
        return null
    }

    return solveTwoLineLikesIntersection(commandIntersection.names[0], itemA, itemB, state)
}

const solveLine = (commandLine, state) => {
    if (commandLine.startPointName === commandLine.endPointName) {
        return null
    }

    const startPoint = state.collection.find(x => x.name === commandLine.startPointName)
    if (startPoint === undefined || startPoint.type !== registry.point) {
        return null
    }

    const endPoint = state.collection.find(x => x.name === commandLine.endPointName)
    if (endPoint === undefined || endPoint.type !== registry.point) {
        return null
    }

    if (pointsSeemIdentical(startPoint, endPoint)) {
        return null
    }

    const itemLine = new ItemLine(commandLine.name, startPoint, endPoint)
    state.collection.push(itemLine)
    return state
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

    if (pointsSeemIdentical(startPoint, endPoint)) {
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
    if (state.collection.some(x => x.name === item.name || item.names?.some(y => y === x.name))) {
        return null
    }

    switch (item.type) {
        case registry.intersection:
            return solveIntersection(item, state)

        case registry.line:
            return solveLine(item, state)

        case registry.point:
            return solvePoint(item, state)

        case registry.segment:
            return solveSegment(item, state)

        default:
            return null
    }
}

export { initState, solve }
