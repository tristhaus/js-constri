import { describe, expect, test } from 'vitest'

import { strings_de } from './langs'
import { parse } from './parser'
import { registry } from './registry'

// ~digits of precision
const jestPrecision = 4
const emptyErrorMessages = {}

describe('parser logic unit tests', () => {

    const defaultLang = registry.langs.de

    describe('general', () => {

        test('non-string returns invalid command', () => {
            const errorMessages = {
                logicErrorGeneric: x => x
            }

            const result = parse(defaultLang, 2, errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('programming error: expecting string at this point')
        })

        test('empty string returns invalid command', () => {
            const errorMessages = {
                parser: {
                    tooFewArguments: x => x
                }
            }

            const result = parse(defaultLang, '', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('')
        })

        test('too few tokens returns invalid command', () => {
            const errorMessages = {
                parser: {
                    tooFewArguments: x => x
                }
            }

            const result = parse(defaultLang, strings_de.point, errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('punkt')
        })
    })

    describe('localized tests: de', () => {

        const lang = registry.langs.de

        test('non-command returns invalid command', () => {
            const errorMessages = {
                parser: {
                    unknownCommand: x => x
                }
            }

            const result = parse(lang, 'xyz a b c d', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('xyz a b c d')
        })

        test('valid angle returns expected', () => {
            const result = parse(lang, 'winkel alpha ab A ac 44', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.angle)
        })

        test('valid circle returns expected', () => {
            const result = parse(lang, 'kreis k A 5', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.circle)
        })

        test('valid color returns expected', () => {
            for (const color of ['schwarz', 'blau', 'gruen', 'rot', 'gelb']) {
                const result = parse(lang, `farbe ${color}`, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.type).toBe(registry.color)
            }
        })

        test('valid delete item returns expected', () => {
            const result = parse(lang, 'loesche A', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItems)
        })

        test('valid delete name returns expected', () => {
            const result = parse(lang, 'loesche bez A', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteNames)
        })

        test('valid line returns expected', () => {
            const result = parse(lang, 'gerade ab A B', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.line)
        })

        test('valid name intersection returns expected', () => {
            const result = parse(lang, 'bez sp ab cd E', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
        })

        test('valid point returns expected', () => {
            const result = parse(lang, 'punkt A1_b -0.1 4.3', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
        })

        test('valid poly returns expected', () => {
            const result = parse(lang, 'poly A1_b Z Y', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.polygon)
        })

        test('valid ray returns expected', () => {
            const result = parse(lang, 'strahl ab A B', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.ray)
        })

        test('valid rotate returns expected', () => {
            const result = parse(lang, 'drehe 77', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.rotate)
        })

        test('valid segment returns expected', () => {
            const result = parse(lang, 'strecke ab A B', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.segment)
        })

        test('name "bez" is rejected', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(lang, 'strecke bez A B', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('bez. A. B')
        })
    })

    describe('localized tests: en', () => {

        const lang = registry.langs.en

        test('non-command returns invalid command', () => {
            const errorMessages = {
                parser: {
                    unknownCommand: x => x
                }
            }

            const result = parse(lang, 'xyz a b c d', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('xyz a b c d')
        })

        test('valid angle returns expected', () => {
            const result = parse(lang, 'angle alpha ab A ac 44', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.angle)
        })

        test('valid circle returns expected', () => {
            const result = parse(lang, 'circle k A 5', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.circle)
        })

        test('valid color returns expected', () => {
            for (const color of ['black', 'blue', 'green', 'red', 'yellow']) {
                const result = parse(lang, `color ${color}`, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.type).toBe(registry.color)
            }
        })

        test('valid delete item returns expected', () => {
            const result = parse(lang, 'delete A', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItems)
        })

        test('valid delete name returns expected', () => {
            const result = parse(lang, 'delete name A', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteNames)
        })

        test('valid line returns expected', () => {
            const result = parse(lang, 'line ab A B', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.line)
        })

        test('valid name intersection returns expected', () => {
            const result = parse(lang, 'name inter ab cd E', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
        })

        test('valid point returns expected', () => {
            const result = parse(lang, 'point A1_b -0.1 4.3', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
        })

        test('valid poly returns expected', () => {
            const result = parse(lang, 'poly A1_b Z Y', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.polygon)
        })

        test('valid ray returns expected', () => {
            const result = parse(lang, 'ray ab A B', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.ray)
        })

        test('valid rotate returns expected', () => {
            const result = parse(lang, 'rotate 77', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.rotate)
        })

        test('valid segment returns expected', () => {
            const result = parse(lang, 'segment ab A B', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.segment)
        })

        test('name "name" is rejected', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(lang, 'segment name a b', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('name. a. b')
        })
    })

    describe('angle', () => {

        test('valid angle returns expected', () => {
            const result = parse(defaultLang, strings_de.angle + ' alpha ab A ac -30', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.angle)
            expect(result.name).toBe('alpha')
            expect(result.startLineLikeName).toBe('ab')
            expect(result.vertexName).toBe('A')
            expect(result.endRayName).toBe('ac')
            expect(result.value).toBeCloseTo(-0.523599, jestPrecision)
        })

        test('angle: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.angle + ' alpha ab A ac', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('5:alpha. ab. A. ac')
        })

        test('angle: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.angle + ' alpha ab A ac 30 60', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('5:alpha. ab. A. ac. 30. 60')
        })

        test('angle: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.angle + ' 0.1 ab A ac -30', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('0.1. ab. A. ac')
        })

        test('angle: invalid vertexName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.angle + ' alpha ab 0.3 ac -30', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('alpha. ab. 0.3. ac')
        })

        test('angle: invalid endRayName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.angle + ' alpha ab A 0.4 -30', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('alpha. ab. A. 0.4')
        })

        test('angle: invalid value returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNumbers: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.angle + ' alpha ab A ac Z', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('Z')
        })
    })

    describe('circle', () => {

        test('valid circle returns expected', () => {
            const result = parse(defaultLang, strings_de.circle + ' k A 6.1', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.circle)
            expect(result.name).toBe('k')
            expect(result.centerName).toBe('A')
            expect(result.radius).toBeCloseTo(6.1, jestPrecision)
        })

        test('circle: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.circle + ' k A', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:k. A')
        })

        test('circle: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.circle + ' k A B 6.1', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:k. A. B. 6.1')
        })

        test('circle: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.circle + ' 0.1 A 6.1', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('0.1. A')
        })

        test('circle: invalid centerName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.circle + ' k 0.1 6.1', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('k. 0.1')
        })

        test('circle: invalid radius returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNumbers: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.circle + '  k A B', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('B')
        })
    })

    describe('color', () => {

        test('valid color returns expected', () => {
            const result = parse(defaultLang, strings_de.color + ' blau', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.color)
            expect(result.color).toBe(registry.colors.blue)
        })

        test('non-existent color returns invalid command', () => {
            const errorMessages = {
                parser: {
                    unknownColor: x => x
                }
            }

            const result = parse(defaultLang, strings_de.color + ' keineFarbe', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('keineFarbe')
        })
    })

    describe('delete item', () => {

        test('valid delete item with one argument returns expected', () => {
            const result = parse(defaultLang, strings_de.delete + ' k', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItems)
            expect(result.targetNames).toStrictEqual(['k'])
        })

        test('valid delete item with many arguments returns expected', () => {
            const result = parse(defaultLang, strings_de.delete + ' k l M N', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItems)
            expect(result.targetNames).toStrictEqual(['k', 'l', 'M', 'N'])
        })

        test('delete item: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    tooFewArguments: x => x
                }
            }

            const result = parse(defaultLang, strings_de.delete + ' ', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('loesche ')
        })

        test('delete item: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.delete + ' A 0.1 C', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('A. 0.1. C')
        })
    })

    describe('delete name', () => {

        test('valid delete name with one argument returns expected', () => {
            const result = parse(defaultLang, strings_de.delete + ' ' + strings_de.name + ' k', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteNames)
            expect(result.targetNames).toStrictEqual(['k'])
        })

        test('valid delete item with many arguments returns expected', () => {
            const result = parse(defaultLang, strings_de.delete + ' ' + strings_de.name + ' k l M N', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteNames)
            expect(result.targetNames).toStrictEqual(['k', 'l', 'M', 'N'])
        })

        test('delete name: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    tooFewArguments: x => x
                }
            }

            const result = parse(defaultLang, strings_de.delete + ' ' + strings_de.name + ' ', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('')
        })

        test('delete name: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.delete + ' ' + strings_de.name + ' A 0.1 C', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('A. 0.1. C')
        })
    })

    describe('rotate', () => {

        test('valid rotate returns expected', () => {
            const result = parse(defaultLang, strings_de.rotate + ' -30', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.rotate)
            expect(result.value).toBeCloseTo(-0.523599, jestPrecision)
        })

        test('rotate: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    tooFewArguments: x => x,
                }
            }

            const result = parse(defaultLang, strings_de.rotate, errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('drehe')
        })

        test('rotate: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.rotate + ' 30 60', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('1:30. 60')
        })

        test('rotate: invalid value returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNumbers: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.rotate + ' Z', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('Z')
        })
    })

    describe('line', () => {

        test('valid line returns expected', () => {
            const result = parse(defaultLang, strings_de.line + ' pq P Q', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.line)
            expect(result.name).toBe('pq')
            expect(result.startPointName).toBe('P')
            expect(result.endPointName).toBe('Q')
        })

        test('line: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.line + ' pq P', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:pq. P')
        })

        test('line: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.line + ' pq P Q R', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:pq. P. Q. R')
        })

        test('line: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.line + ' 0.1 P Q', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('0.1. P. Q')
        })

        test('line: invalid startPointName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.line + ' pq 0.2 Q', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('pq. 0.2. Q')
        })

        test('line: invalid endPointName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.line + ' pq P 0.3', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('pq. P. 0.3')
        })
    })

    describe('name intersection', () => {

        test('valid name intersection (1) returns expected', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab cd E', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
            expect(result.names).toStrictEqual(['E'])
            expect(result.itemAName).toBe('ab')
            expect(result.itemBName).toBe('cd')
        })

        test('valid name intersection (2) returns expected', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' circle1 circle2 S1 S2', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
            expect(result.names).toStrictEqual(['S1', 'S2'])
            expect(result.itemAName).toBe('circle1')
            expect(result.itemBName).toBe('circle2')
        })

        test('too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab E', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3-4:ab. E')
        })

        test('too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab cd pq rs E', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3-4:ab. cd. pq. rs. E')
        })

        test('invalid name (1) returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' 0.1 cd E', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('0.1. cd. E')
        })

        test('invalid name (2) returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab 0.1 E', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('ab. 0.1. E')
        })

        test('invalid name (3) returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab cd 0.1', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('ab. cd. 0.1')
        })

        test('invalid name (4) returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' circle1 circle2 S1 0.1', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('circle1. circle2. S1. 0.1')
        })
    })

    describe('point', () => {

        test('valid point returns expected', () => {
            const result = parse(defaultLang, strings_de.point + ' A -0.1 4.3', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
            expect(result.name).toBe('A')
            expect(result.x).toBeCloseTo(-0.1, jestPrecision)
            expect(result.y).toBeCloseTo(4.3, jestPrecision)
        })

        test('point: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.point + ' A -0.1', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:A. -0.1')
        })

        test('point: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.point + ' A -0.1 0.2 0.3', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:A. -0.1. 0.2. 0.3')
        })

        test('point: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.point + ' 999 -0.1 A', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('999')
        })

        test('point: x-coordinate is not a number returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNumbers: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.point + ' A a 4.3', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('a. 4.3')
        })

        test('point: y-coordinate is not a number returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNumbers: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.point + ' A -0.1 a', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('-0.1. a')
        })
    })

    describe('poly', () => {

        test('valid poly returns expected', () => {
            const result = parse(defaultLang, strings_de.poly + ' A C B D', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.polygon)
            expect(result.referenceNames).toStrictEqual(['A', 'C', 'B', 'D'])
        })

        test('poly: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    tooFewArguments: x => x
                }
            }

            const result = parse(defaultLang, strings_de.poly + ' A B', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('A, B')
        })

        test('poly: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: (args) => `${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.poly + ' A -0.1 C', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('A. -0.1. C')
        })
    })

    describe('ray', () => {

        test('valid ray returns expected', () => {
            const result = parse(defaultLang, strings_de.ray + ' pq P Q', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.ray)
            expect(result.name).toBe('pq')
            expect(result.startPointName).toBe('P')
            expect(result.endPointName).toBe('Q')
        })

        test('ray: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.ray + ' pq P', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:pq. P')
        })

        test('ray: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.ray + ' pq P Q R', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:pq. P. Q. R')
        })

        test('ray: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.ray + ' 0.1 P Q', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('0.1. P. Q')
        })

        test('ray: invalid startPointName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.ray + ' pq 0.2 Q', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('pq. 0.2. Q')
        })

        test('ray: invalid endPointName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.ray + ' pq P 0.3', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('pq. P. 0.3')
        })
    })

    describe('segment', () => {

        test('valid segment returns expected', () => {
            const result = parse(defaultLang, strings_de.segment + ' pq P Q', emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.segment)
            expect(result.name).toBe('pq')
            expect(result.startPointName).toBe('P')
            expect(result.endPointName).toBe('Q')
        })

        test('segment: too few arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.segment + ' pq P', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:pq. P')
        })

        test('segment: too many arguments returns invalid command', () => {
            const errorMessages = {
                parser: {
                    incorrectNumberOfArguments: (n, args) => `${n}:${args.join('. ')}`
                }
            }

            const result = parse(defaultLang, strings_de.segment + ' pq P Q R', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('3:pq. P. Q. R')
        })

        test('segment: invalid name returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.segment + ' 0.1 P Q', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('0.1. P. Q')
        })

        test('segment: invalid startPointName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.segment + ' pq 0.2 Q', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('pq. 0.2. Q')
        })

        test('segment: invalid endPointName returns invalid command', () => {
            const errorMessages = {
                parser: {
                    invalidNames: x => x.join('. ')
                }
            }

            const result = parse(defaultLang, strings_de.segment + ' pq P 0.3', errorMessages)

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.invalid)
            expect(result.errorMessage).toBe('pq. P. 0.3')
        })
    })
})
