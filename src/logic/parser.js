import { Point } from './Point'

const language_de_DE = {
    id: 'de-DE',
    point: 'punkt',
    segment: 'strecke',
    ray: 'strahl',
    line: 'gerade',
}

// if you choose a different language here, you also need to adapt the tests
const choice = language_de_DE

const lang = {
    ...choice,
    allKeywords: Object.values(choice)
}

const isValidName = candidate => {
    if (typeof candidate !== 'string') {
        return false
    }

    const pattern = /^[a-zA-Z][a-zA-Z_0-9]*$/

    return candidate.match(pattern) !== null
}

const toNumber = candidate => {
    return Number.parseFloat(candidate)
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

    return new Point(name, x, y)
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
        case lang.point:
            return parsePoint(args)

        default:
            return null
    }
}

export { lang, parse }
