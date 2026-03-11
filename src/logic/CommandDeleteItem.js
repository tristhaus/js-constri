import { registry } from './registry'

class CommandDeleteItem {
    constructor(targetNames) {
        this.targetNames = targetNames

        this.type = registry.deleteItem
    }
}

export { CommandDeleteItem }
