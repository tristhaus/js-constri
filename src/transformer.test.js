import { ItemPoint } from './logic/ItemPoint'
import { ItemSegment } from './logic/ItemSegment'
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
            new ItemPoint('A', 1, 2),
            new ItemPoint('B', 3, 4),
            new ItemPoint('$x', 5, 6),
        ])

        expect(collection.length).toBe(1)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 4, 6])
    })

    test('items collection with points and segment returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)
        const pointB = new ItemPoint('B', 3, 4)

        const collection = transform([
            pointA,
            pointB,
            new ItemPoint('$x', 5, 6),
            new ItemSegment('ab', pointA, pointB)
        ])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 4, 6])

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines')
        expect(collection[1].x).toStrictEqual([1, 3])
        expect(collection[1].y).toStrictEqual([2, 4])
    })
})