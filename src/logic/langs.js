import { registry } from './registry'

const allStrings = {}

const strings_de = {
    id: registry.langs.de,
    angle: 'winkel',
    circle: 'kreis',
    color: 'farbe',
    colors: {
        'schwarz': registry.colors.black,
        'blau': registry.colors.blue,
        'gruen': registry.colors.green,
        'rot': registry.colors.red,
        'gelb': registry.colors.yellow,
    },
    delete: 'loesche',
    intersection: 'sp',
    line: 'gerade',
    name: 'bez',
    point: 'punkt',
    poly: 'poly',
    ray: 'strahl',
    rotate: 'drehe',
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
            unknownColor: colorName => `Unbekannte Farbe: ${colorName}`,
            unknownCommand: input => `Unbekanntes Kommando: ${input}`,
        },
        solver: {
            angleValueCannotBeUsed: angle => `Der Winkel '${angle / Math.PI * 180}' liegt nicht im Intervall: ]-360, 360[ ohne 0`,
            circleRadiusTooSmall: radius => `Der Radius '${radius}' ist zu klein`,
            duplicateName: nameOrNames => `Name(n) '${nameOrNames}' existieren bereits`,
            duplicateReferenceName: names => `Doppelnennung von Namen nicht erlaubt: ${names.join(', ')}`,
            itemIsNotAPoint: name => `Objekt '${name}' ist kein Punkt`,
            itemToDeleteNameNotFound: itemName => `Zu löschender Objektname '${itemName}' nicht auffindbar`,
            itemToDeleteNotFound: itemName => `Zu löschendes Objekt '${itemName}' nicht auffindbar`,
            referenceLineLikeMissing: lineLikeName => `Gerade/Strahl/Strecke '${lineLikeName}' nicht auffindbar`,
            referencePointMissing: pointName => `Referenzpunkt '${pointName}' nicht auffindbar`,
            referencePointsCantBeIdentical: pointName => `Referenzpunkte '${pointName}' können nicht identisch sein`,
            referencePointsInvalid: (point1, point2) => `Invalide Referenzpunkte '${point1}, ${point2}'`,
            unableToDeleteItem: itemName => `Zu löschendes Objekt '${itemName}' nicht löschbar`,
            vertexNotValid: (vertexName, lineLikeName) => `Gerade/Strahl/Strecke '${lineLikeName}' enthält nicht '${vertexName}'`,
        },
    },
    ui: {
        close: 'Schließen',
        defaultInput: 'punkt A 1 2\npunkt B 3 6\nstrecke ab A B',
        execute: 'Ausführen',
        help: 'Hilfe',
    }
}

const strings_en = {
    id: registry.langs.en,
    angle: 'angle',
    circle: 'circle',
    color: 'color',
    colors: {
        'black': registry.colors.black,
        'blue': registry.colors.blue,
        'green': registry.colors.green,
        'red': registry.colors.red,
        'yellow': registry.colors.yellow,
    },
    delete: 'delete',
    intersection: 'inter',
    line: 'line',
    name: 'name',
    point: 'point',
    poly: 'poly',
    ray: 'ray',
    rotate: 'rotate',
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
            unknownColor: colorName => `Unknown color: ${colorName}`,
            unknownCommand: input => `Unknown command: ${input}`,
        },
        solver: {
            angleValueCannotBeUsed: angle => `Angle '${angle / Math.PI * 180}' is not in interval: ]-360, 360[ without 0`,
            circleRadiusTooSmall: radius => `Radius '${radius}' is too small`,
            duplicateName: nameOrNames => `Name(s) '${nameOrNames}' already exist`,
            duplicateReferenceName: names => `Duplicate reference to a name not allowed: ${names.join(', ')}`,
            itemIsNotAPoint: name => `Item '${name}' is not a point`,
            itemToDeleteNameNotFound: itemName => `Unable to find object name to delete '${itemName}'`,
            itemToDeleteNotFound: itemName => `Unable to find object to delete '${itemName}'`,
            referenceLineLikeMissing: lineLikeName => `Unable to find line/ray/segment '${lineLikeName}'`,
            referencePointMissing: pointName => `Unable to find reference point '${pointName}'`,
            referencePointsCantBeIdentical: pointName => `Reference points '${pointName}' must not be identical`,
            referencePointsInvalid: (point1, point2) => `Invalid reference points '${point1}, ${point2}'`,
            unableToDeleteItem: itemName => `Unable to delete object '${itemName}'`,
            vertexNotValid: (vertexName, lineLikeName) => `Line/Ray/Segment '${lineLikeName}' does not contain '${vertexName}'`,
        },
    },
    ui: {
        close: 'Close',
        defaultInput: 'point C 0 1\ncircle k C 3',
        execute: 'Execute',
        help: 'Help',
    }
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