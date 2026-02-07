import { lang, parse } from './parser'
import { registry } from './registry'

// ~digits of precision
const jestPrecision = 4

describe('parser logic unit tests', () => {

    test('non-string returns null', () => {
        const result = parse(2)

        expect(result).toBeNull()
    })

    test('empty string returns null', () => {
        const result = parse('')

        expect(result).toBeNull()
    })

    test('too few tokens returns null', () => {
        const result = parse(lang.point)

        expect(result).toBeNull()
    })

    describe('point', () => {

        test('valid point returns expected', () => {
            const result = parse(lang.point + ' A -0.1 4.3')

            expect(result).not.toBeNull()
            expect(result.type).toBe(registry.point)
            expect(result.name).toBe('A')
            expect(result.x).toBeCloseTo(-0.1, jestPrecision)
            expect(result.y).toBeCloseTo(4.3, jestPrecision)
        })

        test('point: too few arguments returns null', () => {
            const result = parse(lang.point + ' A -0.1')

            expect(result).toBeNull()
        })

        test('point: invalid name returns null', () => {
            const result = parse(lang.point + ' 999 -0.1 A')

            expect(result).toBeNull()
        })

        test('point: y-coordinate is not a number returns null', () => {
            const result = parse(lang.point + ' A a 4.3')

            expect(result).toBeNull()
        })

        test('point: y-coordinate is not a number returns null', () => {
            const result = parse(lang.point + ' A -0.1 a')

            expect(result).toBeNull()
        })

    })

    describe('localized tests', () => {

        if ('de-DE' === lang.id) {
            test('valid point returns expected (de-DE)', () => {
                const result = parse('punkt A1_b -0.1 4.3')

                expect(result).not.toBeNull()
                expect(result.type).toBe(registry.point)
            })
        }
        else {
            console.log('you really need to implement these syntax tests')
            test('you really need to implement these syntax tests for your language', () => {
                expect(false).toBeTrue()
            })
        }
    })
})
