import { registry } from './registry'

class ItemPoint {
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y

        this.type = registry.point
    }
}

export { ItemPoint }
