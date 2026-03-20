import { registry } from './registry'

class InvalidCommand {
    constructor(errorMessage) {
        this.errorMessage = errorMessage

        this.type = registry.invalid
    }
}

export { InvalidCommand }
