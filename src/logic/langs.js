import { registry } from './registry'

const allStrings = {}

const strings_de = {
    id: registry.langs.de,
    circle: 'kreis',
    delete: 'loesche',
    intersection: 'sp',
    line: 'gerade',
    name: 'bez',
    point: 'punkt',
    poly: 'poly',
    ray: 'strahl',
    segment: 'strecke',
    errorMessages: {
        logicErrorGeneric: message => `logic error: ${message}`,
        logicErrorUnknownType: type => `logic error: '${type}' is unknown`,
        parser: {
            featureNotAvailable: input => `Feature noch nicht verfügbar: ${input}`,
            incorrectNumberOfArguments: (expected, args) => `Es müssen ${expected} Argument(e) sein: ${args.join(', ')}.`,
            invalidNames: names => `Invalide Namen: ${names.join(', ')}`,
            invalidNumbers: numbers => `Invalide Zahlen: ${numbers.join(', ')}`,
            tooFewArguments: argumentString => `Zu wenige Argumente: ${argumentString}`,
            unknownCommand: input => `Unbekanntes Kommando: ${input}`,
        },
        solver: {
            circleRadiusTooSmall: radius => `Der Radius '${radius}' ist zu klein`,
            duplicateName: nameOrNames => `Name(n) '${nameOrNames}' existieren bereits`,
            duplicateReferenceName: names => `Doppelnennung von Namen nicht erlaubt: ${names.join(', ')}`,
            itemIsNotAPoint: name => `Objekt '${name}' ist kein Punkt`,
            itemToDeleteNameNotFound: itemName => `Zu löschender Objektname '${itemName}' nicht auffindbar`,
            itemToDeleteNotFound: itemName => `Zu löschendes Objekt '${itemName}' nicht auffindbar`,
            referencePointMissing: pointName => `Referenzpunkt '${pointName}' nicht auffindbar`,
            referencePointsCantBeIdentical: pointName => `Referenzpunkte '${pointName}' können nicht identisch sein`,
            referencePointsInvalid: (point1, point2) => `Invalide Referenzpunkte '${point1}, ${point2}'`,
            unableToDeleteItem: itemName => `Zu löschendes Objekt '${itemName}' nicht löschbar`,
        },
    },
}

const strings_en = {
    id: registry.langs.en,
    circle: 'circle',
    delete: 'delete',
    intersection: 'inter',
    line: 'line',
    name: 'name',
    point: 'point',
    poly: 'poly',
    ray: 'ray',
    segment: 'segment',
    errorMessages: {
        logicErrorGeneric: message => `logic error: ${message}`,
        logicErrorUnknownType: type => `logic error: '${type}' is unknown`,
        parser: {
            featureNotAvailable: input => `Feature not yet available: ${input}`,
            invalidNames: names => `Invalid names: ${names.join(', ')}`,
            invalidNumbers: numbers => `Invalid numbers: ${numbers.join(', ')}`,
            incorrectNumberOfArguments: (expected, args) => `Must be ${expected} argument(s): ${args.join(', ')}.`,
            tooFewArguments: argumentString => `Too few arguments: ${argumentString}`,
            unknownCommand: input => `Unknown command: ${input}`,
        },
        solver: {
            circleRadiusTooSmall: radius => `Radius '${radius}' is too small`,
            duplicateName: nameOrNames => `Name(s) '${nameOrNames}' already exist`,
            duplicateReferenceName: names => `Duplicate reference to a name not allowed: ${names.join(', ')}`,
            itemIsNotAPoint: name => `Item '${name}' is not a point`,
            itemToDeleteNameNotFound: itemName => `Unable to find object name to delete '${itemName}'`,
            itemToDeleteNotFound: itemName => `Unable to find object to delete '${itemName}'`,
            referencePointMissing: pointName => `Unable to find reference point '${pointName}'`,
            referencePointsCantBeIdentical: pointName => `Reference points '${pointName}' must not be identical`,
            referencePointsInvalid: (point1, point2) => `Invalid reference points '${point1}, ${point2}'`,
            unableToDeleteItem: itemName => `Unable to delete object '${itemName}'`,
        },
    },
}

// some words are not valid as names, otherwise parsing becomes a pain
for (const stringsObject of [strings_de, strings_en]) {
    stringsObject.prohibited = [
        stringsObject.name, // problem solved: `delete name` - is `name` a name or the keyword?
    ]
}

allStrings[registry.langs.de] = strings_de
allStrings[registry.langs.en] = strings_en

export { allStrings, strings_de }