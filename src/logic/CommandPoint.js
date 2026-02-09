import { registry } from './registry'

class CommandPoint {
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y

        this.type = registry.point
    }
}

export { CommandPoint }
