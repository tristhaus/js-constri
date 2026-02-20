import { registry } from './registry'

class ItemRay{
    constructor(name, startPoint, endPoint) {
        this.name = name
        this.startPoint = startPoint
        this.endPoint = endPoint

        this.type = registry.ray
    }
}

export { ItemRay }
