import { registry } from './registry'

class ItemCircle {
    constructor(name, centerPoint, radius, extremaPoints) {
        this.name = name
        this.centerPoint = centerPoint
        this.extremaPoints = extremaPoints
        this.radius = radius

        this.type = registry.circle
    }
}

export { ItemCircle }
