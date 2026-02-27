import { CommandCircle } from './CommandCircle'
import { CommandIntersection } from './CommandIntersection'
import { CommandLine } from './CommandLine'
import { CommandPoint } from './CommandPoint'
import { CommandRay } from './CommandRay'
import { CommandSegment } from './CommandSegment'
import { registry } from './registry'

const allStrings = {}

const strings_de = {
    id: registry.langs.de,
    circle: 'kreis',
    intersection: 'sp',
    line: 'gerade',
    name: 'bez',
    point: 'punkt',
    ray: 'strahl',
    segment: 'strecke',
}

const strings_en = {
    id: registry.langs.en,
    circle: 'circle',
    intersection: 'inter',
    line: 'line',
    name: 'name',
    point: 'point',
    ray: 'ray',
    segment: 'segment',
}

allStrings[registry.langs.de] = strings_de
allStrings[registry.langs.en] = strings_en

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

const parse = (lang, input) => {
    if (typeof input !== 'string') {
        return null
    }

    const strings = allStrings[lang]

    const allArgs = input.split(' ').filter(x => x !== '')

    if (allArgs.length < 2) {
        return null
    }

    const first = allArgs[0]
    const args = allArgs.slice(1)

    switch (first) {
        case strings.circle:
            return parseCircle(args)

        case strings.line:
            return parseLine(args)

        case strings.name:

            // implementation note: alternative 'angle' is to come
            if (args[0] !== strings.intersection) {
                return null
            }
            return parseIntersection(args.slice(1))

        case strings.point:
            return parsePoint(args)

        case strings.ray:
            return parseRay(args)

        case strings.segment:
            return parseSegment(args)

        default:
            return null
    }
}

export { parse, strings_de, userEnteredNamePattern }
