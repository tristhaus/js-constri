import { registry } from './registry'

class Point {
    constructor(name, x, y) {
        this.name = name
        this.x = x
        this.y = y

        this.type = registry.point
    }
}

export { Point }
