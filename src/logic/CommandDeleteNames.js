import { registry } from './registry'

class CommandDeleteNames {
    constructor(targetNames) {
        this.targetNames = targetNames

        this.type = registry.deleteNames
    }
}

export { CommandDeleteNames }
