import { registry } from './registry'

class CommandCircle {
    constructor(name, centerName, radius) {
        this.name = name
        this.centerName = centerName
        this.radius = radius

        this.type = registry.circle
    }
}

export { CommandCircle }
