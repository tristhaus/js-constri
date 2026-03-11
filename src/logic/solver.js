import { ItemCircle } from './ItemCircle'
import { ItemLine } from './ItemLine'
import { ItemPoint } from './ItemPoint'
import { ItemRay } from './ItemRay'
import { ItemSegment } from './ItemSegment'
import { registry } from './registry'
import { getNameWithoutPossiblePrefix, isUserEnteredName } from './nameLogic'

const epsilon = 1e-10

const initState = () => {
    return {
        collection: []
    }
}

const pointsSeemIdentical = (pointA, pointB) => {
    return (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2 < epsilon
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
    const b = +(lineLike.endPoint.x - lineLike.startPoint.x)

    const norm = Math.sqrt(a ** 2 + b ** 2)

    const c = lineLike.startPoint.y * lineLike.endPoint.x - lineLike.startPoint.x * lineLike.endPoint.y

    return [a / norm, b / norm, c / norm]
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
        else if (lineLike.startPoint.x > lineLike.endPoint.x) {
            Ex = Number.NEGATIVE_INFINITY
        }

        if (lineLike.startPoint.y < lineLike.endPoint.y) {
            Ey = Number.POSITIVE_INFINITY
        }
        else if (lineLike.startPoint.y > lineLike.endPoint.y) {
            Ey = Number.NEGATIVE_INFINITY
        }
    }

    return {
        xMin: Math.min(Sx, Ex),
        xMax: Math.max(Sx, Ex),
        yMin: Math.min(Sy, Ey),
        yMax: Math.max(Sy, Ey),
    }
}

const filterByInterval = (points, lineLikes) => {
    const intervals = lineLikes.map(lineLike => findInterval(lineLike))

    return points.filter(point => intervals.every(interval =>
        interval.xMin <= point.x && interval.xMax >= point.x && interval.yMin <= point.y && interval.yMax >= point.y
    ))
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
    if (Math.abs(detN) < epsilon) {
        return state
    }

    const intersectX = (Rc * Sb - Rb * Sc) / detN
    const intersectY = (Ra * Sc - Rc * Sa) / detN

    const itemIntersectionPoint = new ItemPoint(pointName, intersectX, intersectY)
    const filtered = filterByInterval([itemIntersectionPoint], [lineLikeR, lineLikeS])

    state.collection.push(...filtered)
    return state
}

// treat as line no matter what
const calculateDistanceLinePoint = (normalParametersLine, point) => {
    const [La, Lb, Lc] = normalParametersLine

    return Math.abs(La * point.x + Lb * point.y - Lc)
}

// D is M or C, depending
const calculatePointsFromMidpoint = (lineLike, midpointD, distDI, names) => {
    if (distDI < epsilon) {
        const singleI = new ItemPoint(names[0], midpointD.x, midpointD.y)
        return filterByInterval([singleI], [lineLike])
    }

    // select H from {A, B} where: H !== midpointD
    const H = pointsSeemIdentical(lineLike.startPoint, midpointD) ? lineLike.endPoint : lineLike.startPoint

    const dx = H.x - midpointD.x
    const dy = H.y - midpointD.y
    const norming = Math.sqrt(dx ** 2 + dy ** 2)
    const unitvectorDA = [dx * distDI / norming, dy * distDI / norming]

    const I1 = new ItemPoint(names[0], midpointD.x + unitvectorDA[0], midpointD.y + unitvectorDA[1])
    const I2 = new ItemPoint(names[1], midpointD.x - unitvectorDA[0], midpointD.y - unitvectorDA[1])
    return filterByInterval([I1, I2], [lineLike])
}

// a `lineLike` is a `Line`, `Ray`, or `Segment`
const solveCircleLineLikeIntersection = (names, circle, lineLike, state) => {
    // M is the center of the circle
    // C is the midpoint between the two intersection point candidates
    // I1, I2 are the intersection points

    const [La, Lb, Lc] = findNormalLineEquation(lineLike)

    const distCM = calculateDistanceLinePoint([La, Lb, Lc], circle.centerPoint)

    if (distCM > circle.radius) {
        return state
    }

    // M is on the line: dist(M, I1/2) === circle radius
    if (distCM < epsilon) {
        const points = calculatePointsFromMidpoint(lineLike, circle.centerPoint, circle.radius, names, state)
        state.collection.push(...points)
        return state
    }

    // create M->C candidates
    const normalizationFactor = 1.0 / Math.sqrt(La * La + Lb * Lb)
    const vectorMC = [La * distCM * normalizationFactor, Lb * distCM * normalizationFactor]

    const C1 = new ItemPoint(names[0], circle.centerPoint.x + vectorMC[0], circle.centerPoint.y + vectorMC[1])
    const C2 = new ItemPoint(names[0], circle.centerPoint.x - vectorMC[0], circle.centerPoint.y - vectorMC[1])

    const distC1ab = calculateDistanceLinePoint([La, Lb, Lc], C1)
    const distC2ab = calculateDistanceLinePoint([La, Lb, Lc], C2)

    const C = distC1ab < distC2ab ? C1 : C2

    const distIC = Math.sqrt(circle.radius ** 2 - distCM ** 2)

    const points = calculatePointsFromMidpoint(lineLike, C, distIC, names, state)
    state.collection.push(...points)
    return state
}

const solveTwoCirclesIntersection = (names, circleR, circleS, state) => {
    // R, S are the centers
    // rs is the line defined by R and S
    // rR, rS are the circle radii
    // I1, I2 are the intersection(s) of the circles
    // C is the midpoint between I1 and I2
    // d is dist(C, S)
    // h is dist(C, I1/2) === 0.5 * dist(I1, I2) by definition of C
    // note that CI1/CI2 is perpendicular to CR/CS

    // vector
    const SRx = circleR.centerPoint.x - circleS.centerPoint.x
    const SRy = circleR.centerPoint.y - circleS.centerPoint.y
    const distCenters = Math.sqrt(SRx ** 2 + SRy ** 2)

    // unit vector
    const SRxu = SRx / distCenters
    const SRyu = SRy / distCenters

    const sumRadii = circleR.radius + circleS.radius
    const [largeRadius, smallRadius] = circleR.radius > circleS.radius ? [circleR.radius, circleS.radius] : [circleS.radius, circleR.radius]

    // check that
    //  - small circles are not too far apart
    //  - a large circle does not completely contain a small circle
    if (sumRadii < distCenters || largeRadius > (distCenters + smallRadius)) {
        return state
    }

    const d = (circleS.radius ** 2 + distCenters ** 2 - circleR.radius ** 2) / (2 * distCenters)
    const h = Math.sqrt(circleS.radius ** 2 - d ** 2)

    const Cx = circleS.centerPoint.x + d * SRxu
    const Cy = circleS.centerPoint.y + d * SRyu

    // use the perpendicular vector to SR
    const I1x = Cx - SRyu * h
    const I1y = Cy + SRxu * h
    const I2x = Cx + SRyu * h
    const I2y = Cy - SRxu * h

    const I1 = new ItemPoint(names[0], I1x, I1y)
    const I2 = new ItemPoint(names[1], I2x, I2y)

    // we only have one point in this case
    if (h < epsilon) {
        state.collection.push(I1)
    }
    else {
        state.collection.push(I1, I2)
    }

    return state
}

const solveIntersection = (commandIntersection, state) => {
    const itemA = state.collection.find(x => x.name === commandIntersection.itemAName)
    const itemB = state.collection.find(x => x.name === commandIntersection.itemBName)

    const aIsLineLike = itemA?.type === registry.line || itemA?.type === registry.ray || itemA?.type === registry.segment
    const bIsLineLike = itemB?.type === registry.line || itemB?.type === registry.ray || itemB?.type === registry.segment

    const aIsCircle = itemA?.type === registry.circle
    const bIsCircle = itemB?.type === registry.circle

    if (aIsLineLike && bIsLineLike) {
        return solveTwoLineLikesIntersection(commandIntersection.names[0], itemA, itemB, state)
    }

    if (aIsCircle && bIsLineLike) {
        return solveCircleLineLikeIntersection(commandIntersection.names, itemA, itemB, state)
    }

    if (bIsCircle && aIsLineLike) {
        return solveCircleLineLikeIntersection(commandIntersection.names, itemB, itemA, state)
    }

    if (aIsCircle && bIsCircle) {
        return solveTwoCirclesIntersection(commandIntersection.names, itemA, itemB, state)
    }

    return null
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

const deleteObject = (targetName, state) => {
    const targetItem = state.collection.find(x => x.name === targetName)

    if (targetItem === undefined) {
        return null
    }

    let hasEffect = false
    const toBeRemoved = [targetItem]

    while (toBeRemoved.length > 0) {
        const currentItemToBeRemoved = toBeRemoved.shift()

        if (currentItemToBeRemoved.type === registry.point) {
            // garbage-collect the point

            let pointCanBeDeleted = currentItemToBeRemoved.name === targetItem.name || !(isUserEnteredName(currentItemToBeRemoved.name))
            let pointCanBeInvisible = true

            for (const holder of state.collection.filter(x => x.type !== registry.point)) {
                switch (holder.type) {
                    case registry.circle:
                        if (holder.centerPoint.name === currentItemToBeRemoved.name) {
                            pointCanBeDeleted = false
                        }
                        break

                    case registry.line:
                        if (holder.startPoint.name === currentItemToBeRemoved.name
                            || holder.endPoint.name === currentItemToBeRemoved.name) {
                            pointCanBeDeleted = false
                        }
                        break

                    case registry.ray:
                        if (holder.startPoint.name === currentItemToBeRemoved.name) {
                            pointCanBeDeleted = false
                            pointCanBeInvisible = false
                        }

                        if (holder.endPoint.name === currentItemToBeRemoved.name) {
                            pointCanBeDeleted = false

                        }
                        break

                    case registry.segment:
                        if (holder.startPoint.name === currentItemToBeRemoved.name
                            || holder.endPoint.name === currentItemToBeRemoved.name) {
                            pointCanBeDeleted = false
                            pointCanBeInvisible = false
                        }
                        break
                }
            }

            if (pointCanBeDeleted) {
                state.collection = state.collection.filter(x => x.name !== currentItemToBeRemoved.name)
                hasEffect = true
            }
            else if (pointCanBeInvisible) {
                const uniquePortion = getNameWithoutPossiblePrefix(currentItemToBeRemoved.name)
                currentItemToBeRemoved.name = `!${uniquePortion}`
                hasEffect = true
            }
        }
        else if (currentItemToBeRemoved.type === registry.circle) {
            if (!isUserEnteredName(currentItemToBeRemoved.centerPoint.name)) {
                toBeRemoved.push(currentItemToBeRemoved.centerPoint)
            }
            toBeRemoved.push(...currentItemToBeRemoved.extremaPoints)
            state.collection = state.collection.filter(x => x.name !== currentItemToBeRemoved.name)
            hasEffect = true
        }
        else if (currentItemToBeRemoved.type === registry.line
            || currentItemToBeRemoved.type === registry.ray
            || currentItemToBeRemoved.type === registry.segment) {

            for (const point of [currentItemToBeRemoved.startPoint, currentItemToBeRemoved.endPoint]) {
                if (!isUserEnteredName(point.name)) {
                    toBeRemoved.push(point)
                }
            }

            state.collection = state.collection.filter(x => x.name !== currentItemToBeRemoved.name)
            hasEffect = true
        }
    }

    return hasEffect ? state : null
}

const solveDeleteObject = (command, state) => {
    let localState = state

    for (const targetName of command.targetNames) {
        localState = deleteObject(targetName, localState)
        if (localState === null) {
            return null
        }
    }

    return localState
}

const solveDeletion = (command, state) => {
    switch (command.type) {
        case registry.deleteItem:
            return solveDeleteObject(command, state)

        default:
            return null
    }
}

const solveCreation = (command, state) => {
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

// this may create items with names not matching allowed user input
// points starting with '§'
//  - will not display names
// points starting with '!'
//  - will not be displayed
const solve = (command, state) => {
    if (command.type === registry.deleteItem) {
        return solveDeletion(command, state)
    }
    else {
        return solveCreation(command, state)
    }
}

export { initState, solve }
