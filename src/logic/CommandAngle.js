import { registry } from './registry'

class CommandAngle {
    // value in signed radians
    constructor(name, startLineLikeName, vertexName, endRayName, value) {
        this.name = name
        this.startLineLikeName = startLineLikeName
        this.vertexName = vertexName
        this.endRayName = endRayName
        this.value = value

        this.type = registry.angle
    }
}

export { CommandAngle }
