import { registry } from './registry'

// by definition, the ray is finite at the start and infinite at the "end"
class CommandRay {
    constructor(name, startPointName, endPointName) {
        this.name = name
        this.startPointName = startPointName
        this.endPointName = endPointName

        this.type = registry.ray
    }
}

export { CommandRay }
