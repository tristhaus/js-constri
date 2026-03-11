import { registry } from './registry'

class ItemLine {
    constructor(name, startPoint, endPoint) {
        this.name = name
        this.startPoint = startPoint
        this.endPoint = endPoint

        this.type = registry.line
    }
}

export { ItemLine }
