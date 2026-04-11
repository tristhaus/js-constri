import { isUserEnteredName } from './logic/nameLogic'
import { registry } from './logic/registry'

const colorMap = {
    'black_t': '#000000',
    'blue_t': '#0000ff',
    'green_t': '#00c400',
    'red_t': '#ff0000',
    'yellow_t': '#cee21d',
}

const findExtrema = points => {
    const allX = points.map(p => p.x)
    const allY = points.map(p => p.y)

    return {
        minX: Math.min(...allX),
        maxX: Math.max(...allX),
        minY: Math.min(...allY),
        maxY: Math.max(...allY),
    }
}

const getAngleRadiusFromExtrema = extrema => {
    const deltaX = extrema.maxX - extrema.minX
    const deltaY = extrema.maxY - extrema.minY

    const delta = Math.min(deltaX, deltaY)

    return Math.max(0.1, delta / 8)
}

// recursively put an angle into the interval [ 0, 2 * Math.PI [
const normalizeAngle = angle => {
    if (angle >= 2 * Math.PI) {
        return normalizeAngle(angle - 2 * Math.PI)
    }

    if (angle < 0) {
        return normalizeAngle(angle + 2 * Math.PI)
    }

    return angle
}

const createPlotlyDataFromAngle = (angle, extrema, currentColor) => {
    const xData = []
    const yData = []

    const radius = getAngleRadiusFromExtrema(extrema)

    const intervals = 200
    const squaredRadius = radius ** 2

    // be sure to get `... + interval / interval * value`
    for (let i = 0; i <= intervals; i++) {
        // 'local' variables are with origin = angle.vertex, i.e.
        // before translating to true coordinate system
        const normalizedTheta = normalizeAngle(angle.startAngle + angle.value * i / intervals)
        const localX = Math.cos(normalizedTheta) * radius
        const signY = normalizedTheta < Math.PI ? 1 : -1
        const localY = signY * Math.sqrt(squaredRadius - localX * localX)

        xData.push(localX + angle.vertex.x)
        yData.push(localY + angle.vertex.y)
    }

    const circlePlotlyData = {
        x: xData,
        y: yData,
        text: [`    ${angle.name}`],
        textposition: 'middleright',
        type: 'scatter',
        mode: 'lines+text',
        line: { color: currentColor },
    }

    return circlePlotlyData
}

const createPlotlyDataFromCircle = (circle, currentColor) => {
    const xData = []
    const yPositiveBranch = []
    const yNegativeBranch = []

    const intervals = 100
    const squaredRadius = circle.radius * circle.radius

    // be sure to get `interval / interval * Math.PI`
    for (let i = 0; i <= intervals; i++) {
        // 'local' variables are with origin = circle.centerPoint, i.e.
        // before translating to true coordinate system
        const localX = Math.cos(Math.PI * i / intervals) * circle.radius
        const localY = Math.sqrt(squaredRadius - localX * localX)

        xData.push(localX + circle.centerPoint.x)
        yPositiveBranch.push(+localY + circle.centerPoint.y)
        yNegativeBranch.push(-localY + circle.centerPoint.y)
    }

    yNegativeBranch.reverse()
    const revXData = [...xData]
    revXData.reverse()

    const circlePlotlyData = {
        x: [...xData, ...revXData],
        y: [...yPositiveBranch, ...yNegativeBranch],
        text: [`    ${circle.name}`],
        textposition: 'middleright',
        type: 'scatter',
        mode: 'lines+text',
        line: { color: currentColor },
    }

    return circlePlotlyData
}

const createPlotlyDataFromLine = (line, currentColor, extrema) => {
    const ESx = line.startPoint.x - line.endPoint.x
    const ESy = line.startPoint.y - line.endPoint.y

    const factor = Math.max(2, ((extrema.maxX - extrema.minX) ** 2 + (extrema.maxY - extrema.minY) ** 2))

    const lowerX = line.startPoint.x + ESx * factor
    const upperX = line.endPoint.x - ESx * factor

    const lowerY = line.startPoint.y + ESy * factor
    const upperY = line.endPoint.y - ESy * factor

    const linePlotlyData = {
        x: [lowerX, upperX],
        y: [lowerY, upperY],
        type: 'scatter',
        mode: 'lines',
        line: { color: currentColor },
    }

    return linePlotlyData
}

const createPlotlyDataFromRay = (ray, currentColor, extrema) => {
    const ESx = ray.startPoint.x - ray.endPoint.x
    const ESy = ray.startPoint.y - ray.endPoint.y

    const factor = Math.max(2, ((extrema.maxX - extrema.minX) ** 2 + (extrema.maxY - extrema.minY) ** 2))

    const upperX = ray.endPoint.x - ESx * factor
    const upperY = ray.endPoint.y - ESy * factor

    const rayPlotlyData = {
        x: [ray.startPoint.x, upperX],
        y: [ray.startPoint.y, upperY],
        type: 'scatter',
        mode: 'lines',
        line: { color: currentColor },
    }

    return rayPlotlyData
}

const createPlotlyDataFromSegment = (segment, currentColor) => {
    const segmentPlotlyData = {
        x: [segment.startPoint.x, segment.endPoint.x],
        y: [segment.startPoint.y, segment.endPoint.y],
        type: 'scatter',
        mode: 'lines',
        line: { color: currentColor },
    }

    return segmentPlotlyData
}

const transform = items => {
    let currentColor = colorMap.black_t

    const extrema = findExtrema(items.filter(x => x.type === registry.point))

    const pointsX = []
    const pointsY = []
    const pointsLabel = []

    const fakePointsX = []
    const fakePointsY = []

    const anglePlotlyDatas = []
    const circlePlotlyDatas = []
    const linesPlotlyDatas = []
    const raysPlotlyDatas = []
    const segmentsPlotlyDatas = []

    for (const item of items) {
        switch (item.type) {
            case registry.angle:
                anglePlotlyDatas.push(createPlotlyDataFromAngle(item, extrema, currentColor))
                break

            case registry.circle:
                circlePlotlyDatas.push(createPlotlyDataFromCircle(item, currentColor))
                break

            case registry.color:
                currentColor = colorMap[item.color]
                break

            case registry.line:
                linesPlotlyDatas.push(createPlotlyDataFromLine(item, currentColor, extrema))
                break

            case registry.point:
                if (item.name.startsWith('!')) {
                    fakePointsX.push(item.x)
                    fakePointsY.push(item.y)
                    break
                }

                pointsLabel.push(isUserEnteredName(item.name) ? item.name : '')
                pointsX.push(item.x)
                pointsY.push(item.y)
                break

            case registry.ray:
                raysPlotlyDatas.push(createPlotlyDataFromRay(item, currentColor, extrema))
                break

            case registry.segment:
                segmentsPlotlyDatas.push(createPlotlyDataFromSegment(item, currentColor))
                break

            default:
                break
        }
    }

    const pointsPlotlyData = {
        x: pointsX,
        y: pointsY,
        text: pointsLabel,
        color: currentColor,
        type: 'scatter',
        mode: 'markers+text',
        textposition: 'top',
        marker: { color: '#000000' },
    }

    const fakePointsPlotlyData = {
        x: fakePointsX,
        y: fakePointsY,
    }

    return [
        [
            pointsPlotlyData,
            ...anglePlotlyDatas,
            ...circlePlotlyDatas,
            ...linesPlotlyDatas,
            ...raysPlotlyDatas,
            ...segmentsPlotlyDatas
        ],
        fakePointsPlotlyData]
}

export { transform }