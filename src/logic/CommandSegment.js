import { registry } from './registry'

class CommandSegment {
    constructor(name, startPointName, endPointName) {
        this.name = name
        this.startPointName = startPointName
        this.endPointName = endPointName

        this.type = registry.segment
    }
}

export { CommandSegment }
