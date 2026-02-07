import { userEnteredNamePattern } from './logic/parser'
import { registry } from './logic/registry'

// implementation note: when adding circles, we'll need to add fake points at their extrema such that the draw range is correct.

const transform = items => {
    const pointsX = []
    const pointsY = []
    const pointsLabel = []

    for (const item of items) {
        switch (item.type) {
            case registry.point:
                pointsLabel.push(item.name.match(userEnteredNamePattern) !== null ? item.name : '')
                pointsX.push(item.x)
                pointsY.push(item.y)
                break

            default:
                break
        }
    }

    const pointsPlotlyData = {
        x: pointsX,
        y: pointsY,
        text: pointsLabel,
        type: 'scatter',
        mode: 'markers+text',
        textposition: 'top',
    }

    return [pointsPlotlyData]
}

export { transform }