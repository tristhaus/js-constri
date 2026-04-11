import { CommandAngle } from './CommandAngle'
import { CommandCircle } from './CommandCircle'
import { CommandColor } from './CommandColor'
import { CommandDeleteItems } from './CommandDeleteItems'
import { CommandDeleteNames } from './CommandDeleteNames'
import { CommandIntersection } from './CommandIntersection'
import { CommandLine } from './CommandLine'
import { CommandPoint } from './CommandPoint'
import { CommandPolygon } from './CommandPolygon'
import { CommandRay } from './CommandRay'
import { CommandSegment } from './CommandSegment'
import { InvalidCommand } from './InvalidCommand'
import { allStrings } from './langs'
import { isUserEnteredName } from './nameLogic'

const createInvalidCommand = errorMessage => new InvalidCommand(errorMessage)

const toNumber = candidate => {
    return Number.parseFloat(candidate)
}

const toRadians = valueInDegrees => {
    return valueInDegrees / 180.0 * Math.PI
}

const parseAngle = (isValidName, args, errorMessages) => {
    if (args.length !== 5) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(5, args))
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2]) || !isValidName(args[3])) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args.slice(0, 4)))
    }

    const name = args[0]
    const startLineLikeName = args[1]
    const vertexName = args[2]
    const endRayName = args[3]
    const value = toNumber(args[4])

    if (Number.isNaN(value)) {
        return createInvalidCommand(errorMessages.parser.invalidNumbers(args.slice(4, 5)))
    }

    return new CommandAngle(name, startLineLikeName, vertexName, endRayName, toRadians(value))
}

const parseCircle = (isValidName, args, errorMessages) => {
    if (args.length !== 3) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(3, args))
    }

    if (!isValidName(args[0]) || !isValidName(args[1])) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args.slice(0, 2)))
    }

    const name = args[0]
    const centerName = args[1]
    const radius = toNumber(args[2])

    if (Number.isNaN(radius)) {
        return createInvalidCommand(errorMessages.parser.invalidNumbers(args.slice(2, 3)))
    }

    return new CommandCircle(name, centerName, radius)
}

const parseColor = (colors, args, errorMessages) => {
    if (args.length !== 1) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(1, args))
    }

    const color = colors[args[0]]

    if (color === undefined) {
        return createInvalidCommand(errorMessages.parser.unknownColor(args[0]))
    }

    return new CommandColor(color)
}

const parseDeleteItems = (isValidName, args, errorMessages) => {
    if (args.length < 1) {
        return createInvalidCommand(errorMessages.parser.tooFewArguments(args.join(' ')))
    }

    if (!args.every(x => isValidName(x))) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args))
    }

    return new CommandDeleteItems(args)
}

const parseDeleteNames = (isValidName, args, errorMessages) => {
    if (args.length < 1) {
        return createInvalidCommand(errorMessages.parser.tooFewArguments(args.join(' ')))
    }

    if (!args.every(x => isValidName(x))) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args))
    }

    return new CommandDeleteNames(args)
}

const parseIntersection = (isValidName, args, errorMessages) => {
    if (args.length < 3 || args.length > 4) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments('3-4', args))
    }

    if (!args.every(x => isValidName(x))) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args))
    }

    return new CommandIntersection(args[0], args[1], args.slice(2))
}

const parseLine = (isValidName, args, errorMessages) => {
    if (args.length !== 3) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(3, args))
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2])) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args.slice(0, 3)))
    }

    const name = args[0]
    const startPointName = args[1]
    const endPointName = args[2]

    return new CommandLine(name, startPointName, endPointName)
}

const parsePoint = (isValidName, args, errorMessages) => {
    if (args.length !== 3) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(3, args))
    }

    if (!isValidName(args[0])) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args.slice(0, 1)))
    }

    const name = args[0]

    const x = toNumber(args[1])
    const y = toNumber(args[2])

    if (Number.isNaN(x) || Number.isNaN(y)) {
        return createInvalidCommand(errorMessages.parser.invalidNumbers(args.slice(1, 3)))
    }

    return new CommandPoint(name, x, y)
}

const parsePolygon = (isValidName, args, errorMessages) => {
    if (args.length < 3) {
        return createInvalidCommand(errorMessages.parser.tooFewArguments(args.join(', ')))
    }

    if (!args.every(x => isValidName(x))) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args))
    }

    return new CommandPolygon(args)
}

const parseRay = (isValidName, args, errorMessages) => {
    if (args.length !== 3) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(3, args))
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2])) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args.slice(0, 3)))
    }

    const name = args[0]
    const startPointName = args[1]
    const endPointName = args[2]

    return new CommandRay(name, startPointName, endPointName)
}

const parseSegment = (isValidName, args, errorMessages) => {
    if (args.length !== 3) {
        return createInvalidCommand(errorMessages.parser.incorrectNumberOfArguments(3, args))
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2])) {
        return createInvalidCommand(errorMessages.parser.invalidNames(args.slice(0, 3)))
    }

    const name = args[0]
    const startPointName = args[1]
    const endPointName = args[2]

    return new CommandSegment(name, startPointName, endPointName)
}

const parse = (lang, input, errorMessages) => {
    if (typeof input !== 'string') {
        return createInvalidCommand(errorMessages.logicErrorGeneric('programming error: expecting string at this point'))
    }

    const strings = allStrings[lang]
    const isValidName = candidate => {
        return isUserEnteredName(candidate) && strings.prohibited.every(x => x !== candidate)
    }

    const allArgs = input.split(' ').filter(x => x !== '')

    if (allArgs.length < 2) {
        return createInvalidCommand(errorMessages.parser.tooFewArguments(input))
    }

    const first = allArgs[0]
    const args = allArgs.slice(1)

    switch (first) {
        case strings.angle:
            return parseAngle(isValidName, args, errorMessages)

        case strings.circle:
            return parseCircle(isValidName, args, errorMessages)

        case strings.color:
            return parseColor(strings.colors, args, errorMessages)

        case strings.delete:
            if (args[0] === strings.name) {
                return parseDeleteNames(isValidName, args.slice(1), errorMessages)
            }

            return parseDeleteItems(isValidName, args, errorMessages)

        case strings.line:
            return parseLine(isValidName, args, errorMessages)

        case strings.name:

            // implementation note: alternative 'angle' is to come
            if (args[0] !== strings.intersection) {
                return createInvalidCommand(errorMessages.parser.featureNotAvailable(input))
            }
            return parseIntersection(isValidName, args.slice(1), errorMessages)

        case strings.point:
            return parsePoint(isValidName, args, errorMessages)

        case strings.poly:
            return parsePolygon(isValidName, args, errorMessages)

        case strings.ray:
            return parseRay(isValidName, args, errorMessages)

        case strings.segment:
            return parseSegment(isValidName, args, errorMessages)

        default:
            return createInvalidCommand(errorMessages.parser.unknownCommand(input))
    }
}

export { parse }
