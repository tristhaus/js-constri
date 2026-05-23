import { registry } from './registry'

class CommandRotate {
    // value in signed radians
    constructor(value) {
        this.value = value

        this.type = registry.rotate
    }
}

export { CommandRotate }
