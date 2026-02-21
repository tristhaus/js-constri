import { ItemCircle } from './ItemCircle'
import { ItemLine } from './ItemLine'
import { ItemPoint } from './ItemPoint'
import { ItemRay } from './ItemRay'
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

const solveCircle = (commandCircle, state) => {
    const centerPoint = state.collection.find(x => x.name === commandCircle.centerName)
    if (centerPoint === undefined || centerPoint.type !== registry.point) {
        return null
    }

    if (commandCircle.radius < epsilon) {
        return null
    }

    const extremaPoints = [
        new ItemPoint(`!${commandCircle.name}.circle.px`, centerPoint.x + commandCircle.radius, centerPoint.y),
        new ItemPoint(`!${commandCircle.name}.circle.nx`, centerPoint.x - commandCircle.radius, centerPoint.y),
        new ItemPoint(`!${commandCircle.name}.circle.py`, centerPoint.x, centerPoint.y + commandCircle.radius),
        new ItemPoint(`!${commandCircle.name}.circle.ny`, centerPoint.x, centerPoint.y - commandCircle.radius),
    ]

    if (extremaPoints.some(p => state.collection.some(x => x.name === p.name))) {
        return null
    }

    const itemCircle = new ItemCircle(commandCircle.name, centerPoint, commandCircle.radius, extremaPoints)
    state.collection.push(itemCircle, ...extremaPoints)
    return state
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

    if (lineLike.type === registry.ray) {
        if (lineLike.startPoint.x < lineLike.endPoint.x) {
            Ex = Number.POSITIVE_INFINITY
        }
        if (lineLike.startPoint.x > lineLike.endPoint.x) {
            Sx = Number.NEGATIVE_INFINITY
        }
        if (lineLike.startPoint.y < lineLike.endPoint.y) {
            Ey = Number.POSITIVE_INFINITY
        }
        if (lineLike.startPoint.y > lineLike.endPoint.y) {
            Sy = Number.NEGATIVE_INFINITY
        }
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

    if (!(itemA?.type === registry.line || itemA?.type === registry.ray || itemA?.type === registry.segment) ||
        !(itemB?.type === registry.line || itemB?.type === registry.ray || itemB?.type === registry.segment))
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

const solveRay = (commandRay, state) => {
    if (commandRay.startPointName === commandRay.endPointName) {
        return null
    }

    const startPoint = state.collection.find(x => x.name === commandRay.startPointName)
    if (startPoint === undefined || startPoint.type !== registry.point) {
        return null
    }

    const endPoint = state.collection.find(x => x.name === commandRay.endPointName)
    if (endPoint === undefined || endPoint.type !== registry.point) {
        return null
    }

    if (pointsSeemIdentical(startPoint, endPoint)) {
        return null
    }

    const itemRay = new ItemRay(commandRay.name, startPoint, endPoint)
    state.collection.push(itemRay)
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
const solve = (command, state) => {
    if (state.collection.some(x => x.name === command.name || command.names?.some(y => y === x.name))) {
        return null
    }

    switch (command.type) {
        case registry.circle:
            return solveCircle(command, state)

        case registry.intersection:
            return solveIntersection(command, state)

        case registry.line:
            return solveLine(command, state)

        case registry.point:
            return solvePoint(command, state)

        case registry.ray:
            return solveRay(command, state)

        case registry.segment:
            return solveSegment(command, state)

        default:
            return null
    }
}

export { initState, solve }
