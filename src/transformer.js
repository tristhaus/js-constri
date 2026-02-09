import { userEnteredNamePattern } from './logic/parser'
import { registry } from './logic/registry'

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

    const pointsX = []
    const pointsY = []
    const pointsLabel = []

    const segmentsPlotlyDatas = []

    for (const item of items) {
        switch (item.type) {
            case registry.point:
                pointsLabel.push(item.name.match(userEnteredNamePattern) !== null ? item.name : '')
                pointsX.push(item.x)
                pointsY.push(item.y)
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

    return [pointsPlotlyData, ...segmentsPlotlyDatas]
}

export { transform }