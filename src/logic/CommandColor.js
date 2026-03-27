import { registry } from './registry'

// this doubles as ItemColor
class CommandColor {
    constructor(color) {
        this.color = color

        this.type = registry.color
    }
}

export { CommandColor }
