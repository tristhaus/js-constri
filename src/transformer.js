import { userEnteredNamePattern } from './logic/parser'
import { registry } from './logic/registry'

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

const createPlotlyDataFromLine = (line, currentColor, extrema) => {
    const ESx = line.startPoint.x - line.endPoint.x
    const ESy = line.startPoint.y - line.endPoint.y

    const factor = Math.max(2, ((extrema.maxX - extrema.minX)**2 + (extrema.maxY - extrema.minY)**2))

    const lowerX = line.startPoint.x + ESx * factor
    const upperX = line.endPoint.x - ESx * factor

    const lowerY = line.startPoint.y + ESy * factor
    const upperY = line.endPoint.y - ESy * factor

    const linePlotlyData = {
        x: [lowerX, upperX],
        y: [lowerY, upperY],
        type: 'scatter',
        mode: 'lines',
        line: { color: currentColor, },
    }

    return linePlotlyData
}

const createPlotlyDataFromRay = (ray, currentColor, extrema) => {
    const ESx = ray.startPoint.x - ray.endPoint.x
    const ESy = ray.startPoint.y - ray.endPoint.y

    const factor = Math.max(2, ((extrema.maxX - extrema.minX)**2 + (extrema.maxY - extrema.minY)**2))

    const upperX = ray.endPoint.x - ESx * factor
    const upperY = ray.endPoint.y - ESy * factor

    const rayPlotlyData = {
        x: [ray.startPoint.x, upperX],
        y: [ray.startPoint.y, upperY],
        type: 'scatter',
        mode: 'lines',
        line: { color: currentColor, },
    }

    return rayPlotlyData
}

const createPlotlyDataFromSegment = (segment, currentColor) => {
    const segmentPlotlyData = {
        x: [segment.startPoint.x, segment.endPoint.x],
        y: [segment.startPoint.y, segment.endPoint.y],
        type: 'scatter',
        mode: 'lines',
        line: { color: currentColor, },
    }

    return segmentPlotlyData
}

// implementation note: when adding circles, we'll need to add fake points at their extrema such that the draw range is correct.

const transform = items => {
    let currentColor = registry.colors.black

    const extrema = findExtrema(items.filter(x => x.type === registry.point))

    const pointsX = []
    const pointsY = []
    const pointsLabel = []

    const linesPlotlyDatas = []
    const segmentsPlotlyDatas = []

    for (const item of items) {
        switch (item.type) {
            case registry.line:
                linesPlotlyDatas.push(createPlotlyDataFromLine(item, currentColor, extrema))
                break

            case registry.point:
                pointsLabel.push(item.name.match(userEnteredNamePattern) !== null ? item.name : '')
                pointsX.push(item.x)
                pointsY.push(item.y)
                break

            case registry.ray:
                segmentsPlotlyDatas.push(createPlotlyDataFromRay(item, currentColor, extrema))
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
        marker: { color: '#000000', },
    }

    return [pointsPlotlyData, ...segmentsPlotlyDatas, ...linesPlotlyDatas]
}

export { transform }