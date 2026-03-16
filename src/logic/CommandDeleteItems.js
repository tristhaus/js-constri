import { registry } from './registry'

class CommandDeleteItems {
    constructor(targetNames) {
        this.targetNames = targetNames

        this.type = registry.deleteItems
    }
}

export { CommandDeleteItems }
