import { Point } from './logic/Point'
import { transform } from './transformer'

describe('transformer tests', () => {

    test('empty items collection returns data with empty entries', () => {
        const collection = transform([])

        expect(collection.length).toBe(1)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
    })

    test('items collection with points returns data', () => {
        const collection = transform([
            new Point('A', 1, 2),
            new Point('B', 3, 4),
            new Point('$x', 5, 6),
        ])

        expect(collection.length).toBe(1)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 4, 6])
    })
})