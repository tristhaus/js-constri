import { CommandCircle } from './CommandCircle'
import { CommandDeleteItem } from './CommandDeleteItem'
import { CommandIntersection } from './CommandIntersection'
import { CommandLine } from './CommandLine'
import { CommandPoint } from './CommandPoint'
import { CommandRay } from './CommandRay'
import { CommandSegment } from './CommandSegment'
import { registry } from './registry'
import { isUserEnteredName } from './nameLogic'

const allStrings = {}

const strings_de = {
    id: registry.langs.de,
    circle: 'kreis',
    delete: 'loesche',
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
    delete: 'delete',
    intersection: 'inter',
    line: 'line',
    name: 'name',
    point: 'point',
    ray: 'ray',
    segment: 'segment',
}

// some words are not valid as names, otherwise parsing becomes a pain
for (const stringsObject of [strings_de, strings_en]) {
    stringsObject.prohibited = [
        stringsObject.name // problem solved: `delete name` - is `name` a name or the keyword?
    ]
}

allStrings[registry.langs.de] = strings_de
allStrings[registry.langs.en] = strings_en

const toNumber = candidate => {
    return Number.parseFloat(candidate)
}

const parseCircle = (isValidName, args) => {
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

const parseDelete = (isValidName, args) => {
    // implementation note: ignore `delete name` for now
    if (args.length < 1) {
        return null
    }

    if (!args.every(x => isValidName(x))) {
        return null
    }

    return new CommandDeleteItem(args)
}

const parseIntersection = (isValidName, args) => {
    if (args.length < 3 || args.length > 4) {
        return null
    }

    if (!args.every(x => isValidName(x))) {
        return null
    }

    return new CommandIntersection(args[0], args[1], args.slice(2))
}

const parseLine = (isValidName, args) => {
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

const parsePoint = (isValidName, args) => {
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

const parseRay = (isValidName, args) => {
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

const parseSegment = (isValidName, args) => {
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
    const isValidName = candidate => {
        return isUserEnteredName(candidate) && strings.prohibited.every(x => x !== candidate)
    }

    const allArgs = input.split(' ').filter(x => x !== '')

    if (allArgs.length < 2) {
        return null
    }

    const first = allArgs[0]
    const args = allArgs.slice(1)

    switch (first) {
        case strings.circle:
            return parseCircle(isValidName, args)

        case strings.delete:
            return parseDelete(isValidName, args)

        case strings.line:
            return parseLine(isValidName, args)

        case strings.name:

            // implementation note: alternative 'angle' is to come
            if (args[0] !== strings.intersection) {
                return null
            }
            return parseIntersection(isValidName, args.slice(1))

        case strings.point:
            return parsePoint(isValidName, args)

        case strings.ray:
            return parseRay(isValidName, args)

        case strings.segment:
            return parseSegment(isValidName, args)

        default:
            return null
    }
}

export { parse, strings_de }
