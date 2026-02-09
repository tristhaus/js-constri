import { registry } from './registry'

class ItemSegment {
    constructor(name, startPoint, endPoint) {
        this.name = name
        this.startPoint = startPoint
        this.endPoint = endPoint

        this.type = registry.segment
    }
}

export { ItemSegment }
