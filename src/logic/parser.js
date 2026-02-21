import { CommandCircle } from './CommandCircle'
import { CommandIntersection } from './CommandIntersection'
import { CommandLine } from './CommandLine'
import { CommandPoint } from './CommandPoint'
import { CommandRay } from './CommandRay'
import { CommandSegment } from './CommandSegment'

const language_de_DE = {
    id: 'de-DE',
    circle: 'kreis',
    intersection: 'sp',
    line: 'gerade',
    name: 'bez',
    point: 'punkt',
    ray: 'strahl',
    segment: 'strecke',
}

// if you choose a different language here, you also need to adapt the tests
const choice = language_de_DE

const lang = {
    ...choice,
    allKeywords: Object.values(choice)
}

const userEnteredNamePattern = /^[a-zA-Z][a-zA-Z_0-9]*$/

const isValidName = candidate => {
    if (typeof candidate !== 'string') {
        return false
    }

    return candidate.match(userEnteredNamePattern) !== null
}

const toNumber = candidate => {
    return Number.parseFloat(candidate)
}

const parseCircle = args => {
    if (args.length !== 3) {
        return null
    }

    if (!isValidName(args[0]) || !isValidName(args[1])) {
        return null
    }

    const name = args[0]
    const centerName = args[1]
    const radius = toNumber(args[2])

    if (Number.isNaN(radius)) {
        return null
    }

    return new CommandCircle(name, centerName, radius)
}

const parseIntersection = args => {
    if (args.length < 3 || args.length > 4) {
        return null
    }

    if (!args.every(x => isValidName(x))) {
        return null
    }

    return new CommandIntersection(args[0], args[1], args.slice(2))
}

const parseLine = args => {
    if (args.length !== 3) {
        return null
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2])) {
        return null
    }

    const name = args[0]
    const startPointName = args[1]
    const endPointName = args[2]

    return new CommandLine(name, startPointName, endPointName)
}

const parsePoint = args => {
    if (args.length !== 3) {
        return null
    }

    if (!isValidName(args[0])) {
        return null
    }

    const name = args[0]

    const x = toNumber(args[1])
    const y = toNumber(args[2])

    if (Number.isNaN(x) || Number.isNaN(y)) {
        return null
    }

    return new CommandPoint(name, x, y)
}

const parseRay = args => {
    if (args.length !== 3) {
        return null
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2])) {
        return null
    }

    const name = args[0]
    const startPointName = args[1]
    const endPointName = args[2]

    return new CommandRay(name, startPointName, endPointName)
}

const parseSegment = args => {
    if (args.length !== 3) {
        return null
    }

    if (!isValidName(args[0]) || !isValidName(args[1]) || !isValidName(args[2])) {
        return null
    }

    const name = args[0]
    const startPointName = args[1]
    const endPointName = args[2]

    return new CommandSegment(name, startPointName, endPointName)
}

const parse = input => {
    if (typeof input !== 'string') {
        return null
    }

    const allArgs = input.split(' ').filter(x => x !== '')

    if (allArgs.length < 2) {
        return null
    }

    const first = allArgs[0]
    const args = allArgs.slice(1)

    switch (first) {
        case lang.circle:
            return parseCircle(args)

        case lang.line:
            return parseLine(args)

        case lang.name:

            // implementation note: alternative 'angle' is to come
            if (args[0] !== lang.intersection) {
                return null
            }
            return parseIntersection(args.slice(1))

        case lang.point:
            return parsePoint(args)

        case lang.ray:
            return parseRay(args)

        case lang.segment:
            return parseSegment(args)

        default:
            return null
    }
}

export { lang, parse, userEnteredNamePattern }
