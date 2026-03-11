import { describe, expect, test } from 'vitest'

import { parse, strings_de } from './parser'
import { registry } from './registry'

// ~digits of precision
const jestPrecision = 4

describe('parser logic unit tests', () => {

    const defaultLang = registry.langs.de

    describe('general', () => {

        test('non-string returns null', () => {
            const result = parse(defaultLang, 2)

            expect(result).toBeNull()
        })

        test('empty string returns null', () => {
            const result = parse(defaultLang, '')

            expect(result).toBeNull()
        })

        test('too few tokens returns null', () => {
            const result = parse(defaultLang, strings_de.point)

            expect(result).toBeNull()
        })
    })

    describe('localized tests: de', () => {

        const lang = registry.langs.de

        test('valid circle returns expected', () => {
            const result = parse(lang, 'kreis k A 5')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.circle)
        })

        test('valid delete item returns expected', () => {
            const result = parse(lang, 'loesche A')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItem)
        })

        test('valid line returns expected', () => {
            const result = parse(lang, 'gerade ab A B')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.line)
        })

        test('valid name intersection returns expected', () => {
            const result = parse(lang, 'bez sp ab cd E')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
        })

        test('valid point returns expected', () => {
            const result = parse(lang, 'punkt A1_b -0.1 4.3')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
        })

        test('valid ray returns expected', () => {
            const result = parse(lang, 'strahl ab A B')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.ray)
        })

        test('valid segment returns expected', () => {
            const result = parse(lang, 'strecke ab A B')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.segment)
        })

        test('name bez" is rejected', () => {
            const result = parse(lang, 'strecke bez A B')

            expect(result).toBeNull()
        })
    })

    describe('localized tests: en', () => {

        const lang = registry.langs.en

        test('valid circle returns expected', () => {
            const result = parse(lang, 'circle k A 5')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.circle)
        })

        test('valid delete item returns expected', () => {
            const result = parse(lang, 'delete A')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItem)
        })

        test('valid line returns expected', () => {
            const result = parse(lang, 'line ab A B')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.line)
        })

        test('valid name intersection returns expected', () => {
            const result = parse(lang, 'name inter ab cd E')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
        })

        test('valid point returns expected', () => {
            const result = parse(lang, 'point A1_b -0.1 4.3')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
        })

        test('valid ray returns expected', () => {
            const result = parse(lang, 'ray ab A B')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.ray)
        })

        test('valid segment returns expected', () => {
            const result = parse(lang, 'segment ab A B')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.segment)
        })

        test('name "name" is rejected', () => {
            const result = parse(lang, 'strecke bez A B')

            expect(result).toBeNull()
        })
    })

    describe('circle', () => {

        test('valid circle returns expected', () => {
            const result = parse(defaultLang, strings_de.circle + ' k A 6.1')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.circle)
            expect(result.name).toBe('k')
            expect(result.centerName).toBe('A')
            expect(result.radius).toBeCloseTo(6.1, jestPrecision)
        })

        test('circle: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.circle + ' k A')

            expect(result).toBeNull()
        })

        test('circle: too many arguments returns null', () => {
            const result = parse(defaultLang, strings_de.circle + ' k A B 6.1')

            expect(result).toBeNull()
        })

        test('circle: invalid name returns null', () => {
            const result = parse(defaultLang, strings_de.circle + ' 0.1 A 6.1')

            expect(result).toBeNull()
        })

        test('circle: invalid centerName returns null', () => {
            const result = parse(defaultLang, strings_de.circle + ' k 0.1 6.1')

            expect(result).toBeNull()
        })

        test('circle: invalid radius returns null', () => {
            const result = parse(defaultLang, strings_de.circle + ' k A B')

            expect(result).toBeNull()
        })
    })

    describe('delete item', () => {

        test('valid delete item with one argument returns expected', () => {
            const result = parse(defaultLang, strings_de.delete + ' k')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItem)
            expect(result.targetNames).toStrictEqual(['k'])
        })

        test('valid delete item with many arguments returns expected', () => {
            const result = parse(defaultLang, strings_de.delete + ' k l M N')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.deleteItem)
            expect(result.targetNames).toStrictEqual(['k', 'l', 'M', 'N'])
        })

        test('delete item: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.delete + ' ')

            expect(result).toBeNull()
        })

        test('delete item: invalid name returns null', () => {
            const result = parse(defaultLang, strings_de.delete + ' A 0.1 C')

            expect(result).toBeNull()
        })
    })

    describe('line', () => {

        test('valid line returns expected', () => {
            const result = parse(defaultLang, strings_de.line + ' pq P Q')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.line)
            expect(result.name).toBe('pq')
            expect(result.startPointName).toBe('P')
            expect(result.endPointName).toBe('Q')
        })

        test('line: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.line + ' pq P')

            expect(result).toBeNull()
        })

        test('line: too many arguments returns null', () => {
            const result = parse(defaultLang, strings_de.line + ' pq P Q R')

            expect(result).toBeNull()
        })

        test('line: invalid name returns null', () => {
            const result = parse(defaultLang, strings_de.line + ' 0.1 P Q')

            expect(result).toBeNull()
        })

        test('line: invalid startPointName returns null', () => {
            const result = parse(defaultLang, strings_de.line + ' pq 0.2 Q')

            expect(result).toBeNull()
        })

        test('line: invalid endPointName returns null', () => {
            const result = parse(defaultLang, strings_de.line + ' pq P 0.3')

            expect(result).toBeNull()
        })
    })

    describe('name intersection', () => {

        test('valid name intersection (1) returns expected', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab cd E')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
            expect(result.names).toStrictEqual(['E'])
            expect(result.itemAName).toBe('ab')
            expect(result.itemBName).toBe('cd')
        })

        test('valid name intersection (2) returns expected', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' circle1 circle2 S1 S2')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.intersection)
            expect(result.names).toStrictEqual(['S1', 'S2'])
            expect(result.itemAName).toBe('circle1')
            expect(result.itemBName).toBe('circle2')
        })

        test('line: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab E')

            expect(result).toBeNull()
        })

        test('line: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab cd pq rs E')

            expect(result).toBeNull()
        })

        test('line: invalid name (1) returns null', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab cd 0.1')

            expect(result).toBeNull()
        })

        test('line: invalid name (2) returns null', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' circle1 circle2 S1 0.1')

            expect(result).toBeNull()
        })

        test('line: invalid startPointName returns null', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' 0.1 cd E')

            expect(result).toBeNull()
        })

        test('line: invalid endPointName returns null', () => {
            const result = parse(defaultLang, strings_de.name + ' ' + strings_de.intersection + ' ab 0.1 E')

            expect(result).toBeNull()
        })
    })

    describe('point', () => {

        test('valid point returns expected', () => {
            const result = parse(defaultLang, strings_de.point + ' A -0.1 4.3')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
            expect(result.name).toBe('A')
            expect(result.x).toBeCloseTo(-0.1, jestPrecision)
            expect(result.y).toBeCloseTo(4.3, jestPrecision)
        })

        test('point: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.point + ' A -0.1')

            expect(result).toBeNull()
        })

        test('point: too many arguments returns null', () => {
            const result = parse(defaultLang, strings_de.point + ' A -0.1 0.2 0.3')

            expect(result).toBeNull()
        })

        test('point: invalid name returns null', () => {
            const result = parse(defaultLang, strings_de.point + ' 999 -0.1 A')

            expect(result).toBeNull()
        })

        test('point: y-coordinate is not a number returns null', () => {
            const result = parse(defaultLang, strings_de.point + ' A a 4.3')

            expect(result).toBeNull()
        })

        test('point: y-coordinate is not a number returns null', () => {
            const result = parse(defaultLang, strings_de.point + ' A -0.1 a')

            expect(result).toBeNull()
        })
    })

    describe('ray', () => {

        test('valid ray returns expected', () => {
            const result = parse(defaultLang, strings_de.ray + ' pq P Q')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.ray)
            expect(result.name).toBe('pq')
            expect(result.startPointName).toBe('P')
            expect(result.endPointName).toBe('Q')
        })

        test('ray: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.ray + ' pq P')

            expect(result).toBeNull()
        })

        test('ray: too many arguments returns null', () => {
            const result = parse(defaultLang, strings_de.ray + ' pq P Q R')

            expect(result).toBeNull()
        })

        test('ray: invalid name returns null', () => {
            const result = parse(defaultLang, strings_de.ray + ' 0.1 P Q')

            expect(result).toBeNull()
        })

        test('ray: invalid startPointName returns null', () => {
            const result = parse(defaultLang, strings_de.ray + ' pq 0.2 Q')

            expect(result).toBeNull()
        })

        test('ray: invalid endPointName returns null', () => {
            const result = parse(defaultLang, strings_de.ray + ' pq P 0.3')

            expect(result).toBeNull()
        })
    })

    describe('segment', () => {

        test('valid segment returns expected', () => {
            const result = parse(defaultLang, strings_de.segment + ' pq P Q')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.segment)
            expect(result.name).toBe('pq')
            expect(result.startPointName).toBe('P')
            expect(result.endPointName).toBe('Q')
        })

        test('segment: too few arguments returns null', () => {
            const result = parse(defaultLang, strings_de.segment + ' pq P')

            expect(result).toBeNull()
        })

        test('segment: too many arguments returns null', () => {
            const result = parse(defaultLang, strings_de.segment + ' pq P Q R')

            expect(result).toBeNull()
        })

        test('segment: invalid name returns null', () => {
            const result = parse(defaultLang, strings_de.segment + ' 0.1 P Q')

            expect(result).toBeNull()
        })

        test('segment: invalid startPointName returns null', () => {
            const result = parse(defaultLang, strings_de.segment + ' pq 0.2 Q')

            expect(result).toBeNull()
        })

        test('segment: invalid 0.1endPointName returns null', () => {
            const result = parse(defaultLang, strings_de.segment + ' pq P 0.3s')

            expect(result).toBeNull()
        })
    })
})
