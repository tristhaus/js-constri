import { registry } from './registry'

class CommandPolygon {
    constructor(referenceNames) {
        this.referenceNames = referenceNames

        this.type = registry.polygon
    }
}

export { CommandPolygon }
