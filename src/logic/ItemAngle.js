import { registry } from './registry'

class ItemAngle {
    // startAngle, value in signed radians
    constructor(name, vertex, startAngle, value) {
        this.name = name
        this.vertex = vertex
        this.startAngle = startAngle
        this.value = value

        this.type = registry.angle
    }
}

export { ItemAngle }
