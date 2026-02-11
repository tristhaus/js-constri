import { registry } from './registry'

class CommandIntersection {
    constructor(itemAName, itemBName, names) {
        this.itemAName = itemAName
        this.itemBName = itemBName
        this.names = names

        this.type = registry.intersection
    }
}

export { CommandIntersection }
