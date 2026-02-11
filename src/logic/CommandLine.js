import { registry } from './registry'

class CommandLine {
    constructor(name, startPointName, endPointName) {
        this.name = name
        this.startPointName = startPointName
        this.endPointName = endPointName

        this.type = registry.line
    }
}

export { CommandLine }
