import { solve } from './solver'
import { registry } from './registry'
import { Point } from './Point'

// ~digits of precision
const jestPrecision = 4

describe('solver logic unit tests', () => {

    describe('point logic unit tests', () => {

        test('duplicate name returns null', () => {
            const state = { collection: [new Point('A', 1.0, 2.0)] }

            const result = solve(new Point('A', 3.0, 4.0), state)

            expect(result).toBeNull()
        })

        test('valid point input returns extended state', () => {
            const state = { collection: [new Point('A', 1.0, 2.0)] }

            const result = solve(new Point('B', 3.0, 4.0), state)

            expect(result).not.toBeNull()

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)
        })
    })
})