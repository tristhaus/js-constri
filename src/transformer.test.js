import { describe, expect, test } from 'vitest'

import { ItemAngle } from './logic/ItemAngle'
import { ItemCircle } from './logic/ItemCircle'
import { ItemLine } from './logic/ItemLine'
import { ItemPoint } from './logic/ItemPoint'
import { ItemRay } from './logic/ItemRay'
import { ItemSegment } from './logic/ItemSegment'
import { transform } from './transformer'
import { CommandColor } from './logic/CommandColor'
import { registry } from './logic/registry'

// ~digits of precision
const jestPrecision = 4

describe('transformer tests', () => {

    test('empty items collection returns data with empty entries', () => {
        const [collection, aux, annotations] = transform([])

        expect(collection.length).toBe(1)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with points returns data', () => {
        const [collection, aux, annotations] = transform([
            new ItemPoint('A', 1, 2),
            new ItemPoint('B', 3, 4),
            new ItemPoint('§x', 5, 6),
            new ItemPoint('!x', 7, 8),
        ])

        expect(collection.length).toBe(1)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 4, 6])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(aux.x.length).toBe(1)
        expect(aux.x[0]).toStrictEqual(7)
        expect(aux.y.length).toBe(1)
        expect(aux.y[0]).toStrictEqual(8)

        expect(annotations).toStrictEqual([])
    })

    test('items collection with point and circle returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)

        const extremaPoints = [
            new ItemPoint('!ab.circle.px', 4, 2),
            new ItemPoint('!ab.circle.nx', -2, 2),
            new ItemPoint('!ab.circle.py', 1, 5),
            new ItemPoint('!ab.circle.ny', 1, -1),
        ]

        const [collection, aux, annotations] = transform([
            pointA,
            ...extremaPoints,
            new ItemCircle('ab', pointA, 3.0, extremaPoints),
        ])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A'])
        expect(collection[0].x).toStrictEqual([1])
        expect(collection[0].y).toStrictEqual([2])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeCloseTo(4, jestPrecision)
        expect(minX).toBeCloseTo(-2, jestPrecision)
        expect(maxY).toBeCloseTo(5, jestPrecision)
        expect(minY).toBeCloseTo(-1, jestPrecision)

        expect(collection[1].text[0]).toStrictEqual('    ab')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux.x.length).toBe(4)
        expect(aux.x[0]).toBeCloseTo(4, jestPrecision)
        expect(aux.x[1]).toBeCloseTo(-2, jestPrecision)
        expect(aux.x[2]).toBeCloseTo(1, jestPrecision)
        expect(aux.x[3]).toBeCloseTo(1, jestPrecision)

        expect(aux.y.length).toBe(4)
        expect(aux.y[0]).toBeCloseTo(2, jestPrecision)
        expect(aux.y[1]).toBeCloseTo(2, jestPrecision)
        expect(aux.y[2]).toBeCloseTo(5, jestPrecision)
        expect(aux.y[3]).toBeCloseTo(-1, jestPrecision)

        expect(annotations).toStrictEqual([])
    })

    test('items collection with color and segment returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)
        const pointB = new ItemPoint('B', 3, 4)
        const segmentab = new ItemSegment('ab', pointA, pointB)

        const extremaPoints = []

        const [collection, aux, annotations] = transform([
            new CommandColor(registry.colors.red),
            pointA,
            pointB,
            segmentab,
            ...extremaPoints,
        ])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B'])
        expect(collection[0].x).toStrictEqual([1, 3])
        expect(collection[0].y).toStrictEqual([2, 4])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines')
        expect(collection[1].x).toStrictEqual([1, 3])
        expect(collection[1].y).toStrictEqual([2, 4])
        expect(collection[1].line.color).toStrictEqual('#ff0000')

        expect(aux).toStrictEqual({ x: [], y: [] })

        expect(annotations.length).toBe(1)
        expect(annotations[0].text).toBe('ab')
    })

    test('items collection with points and segment returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)
        const pointB = new ItemPoint('B', 3, 4)

        const [collection, aux, annotations] = transform([
            pointA,
            pointB,
            new ItemPoint('§x', 5, 6),
            new ItemSegment('ab', pointA, pointB),
        ])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 4, 6])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines')
        expect(collection[1].x).toStrictEqual([1, 3])
        expect(collection[1].y).toStrictEqual([2, 4])
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })

        expect(annotations.length).toBe(1)
        expect(annotations[0].text).toBe('ab')
    })

    test('items collection with points and line returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)
        const pointB = new ItemPoint('B', 3, 6)

        const [collection, aux, annotations] = transform([
            pointA,
            pointB,
            new ItemPoint('§x', 5, 4),
            new ItemLine('ab', pointA, pointB),
        ])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 6, 4])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines')
        const slope = (collection[1].y[0] - collection[1].y[1]) / (collection[1].x[0] - collection[1].x[1])
        expect(slope).toBeCloseTo(2, jestPrecision)
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })

        expect(annotations.length).toBe(1)
        expect(annotations[0].text).toBe('ab')
    })

    test('items collection with points and ray returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)
        const pointB = new ItemPoint('B', 3, 6)

        const [collection, aux, annotations] = transform([
            pointA,
            pointB,
            new ItemPoint('§x', 5, 4),
            new ItemRay('ab', pointA, pointB),
        ])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 5])
        expect(collection[0].y).toStrictEqual([2, 6, 4])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines')
        const slope = (collection[1].y[0] - collection[1].y[1]) / (collection[1].x[0] - collection[1].x[1])
        expect(slope).toBeCloseTo(2, jestPrecision)
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })

        expect(annotations.length).toBe(1)
        expect(annotations[0].text).toBe('ab')
    })

    test('items collection with points, segment, and ray returns data', () => {
        const pointA = new ItemPoint('A', 1, 2)
        const pointB = new ItemPoint('B', 3, 6)
        const pointC = new ItemPoint('C', 7, 8)

        const [collection, aux, annotations] = transform([
            pointA,
            pointB,
            pointC,
            new ItemPoint('§x', 5, 4),
            new ItemSegment('ab', pointA, pointB),
            new ItemRay('bc', pointB, pointC),
        ])

        expect(collection.length).toBe(3)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual(['A', 'B', 'C', ''])
        expect(collection[0].x).toStrictEqual([1, 3, 7, 5])
        expect(collection[0].y).toStrictEqual([2, 6, 8, 4])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines')
        const slope0 = (collection[1].y[0] - collection[1].y[1]) / (collection[1].x[0] - collection[1].x[1])
        expect(slope0).toBeCloseTo(0.5, jestPrecision)
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(collection[2].type).toStrictEqual('scatter')
        expect(collection[2].mode).toStrictEqual('lines')
        const slope1 = (collection[2].y[0] - collection[2].y[1]) / (collection[2].x[0] - collection[2].x[1])
        expect(slope1).toBeCloseTo(2, jestPrecision)
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })

        expect(annotations.length).toBe(2)
        expect(annotations[0].text).toBe('ab')
        expect(annotations[1].text).toBe('bc')
    })

    test('items collection with angle returns data (Q1, cw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), Math.PI / 3, Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeGreaterThan(0)
        expect(minX).toBeLessThan(0)
        expect(maxY).toBeGreaterThan(0)
        expect(minY).toBeGreaterThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q2, cw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), 5 / 6 * Math.PI, Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeLessThan(0)
        expect(minX).toBeLessThan(0)
        expect(maxY).toBeGreaterThan(0)
        expect(minY).toBeLessThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q3, cw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), 4 / 3 * Math.PI, Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeGreaterThan(0)
        expect(minX).toBeLessThan(0)
        expect(maxY).toBeLessThan(0)
        expect(minY).toBeLessThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q4, cw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), 11 / 6 * Math.PI, Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeGreaterThan(0)
        expect(minX).toBeGreaterThan(0)
        expect(maxY).toBeGreaterThan(0)
        expect(minY).toBeLessThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q1, ccw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), Math.PI / 3, -Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeGreaterThan(0)
        expect(minX).toBeGreaterThan(0)
        expect(maxY).toBeGreaterThan(0)
        expect(minY).toBeLessThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q2, ccw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), 5 / 6 * Math.PI, -Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeGreaterThan(0)
        expect(minX).toBeLessThan(0)
        expect(maxY).toBeGreaterThan(0)
        expect(minY).toBeGreaterThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q3, ccw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), 4 / 3 * Math.PI, -Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeLessThan(0)
        expect(minX).toBeLessThan(0)
        expect(maxY).toBeGreaterThan(0)
        expect(minY).toBeLessThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })

    test('items collection with angle returns data (Q4, ccw)', () => {
        const [collection, aux, annotations] = transform([new ItemAngle('omega', new ItemPoint('w', 0.0, 0.0), 11 / 6 * Math.PI, -Math.PI / 2)])

        expect(collection.length).toBe(2)

        expect(collection[0].type).toStrictEqual('scatter')
        expect(collection[0].mode).toStrictEqual('markers+text')
        expect(collection[0].text).toStrictEqual([])
        expect(collection[0].x).toStrictEqual([])
        expect(collection[0].y).toStrictEqual([])
        expect(collection[0].marker.color).toStrictEqual('#000000')

        expect(collection[1].type).toStrictEqual('scatter')
        expect(collection[1].mode).toStrictEqual('lines+text')

        const maxX = Math.max(...collection[1].x)
        const minX = Math.min(...collection[1].x)
        const maxY = Math.max(...collection[1].y)
        const minY = Math.min(...collection[1].y)

        expect(maxX).toBeGreaterThan(0)
        expect(minX).toBeLessThan(0)
        expect(maxY).toBeLessThan(0)
        expect(minY).toBeLessThan(0)

        expect(collection[1].text[0]).toStrictEqual('    omega')
        expect(collection[1].line.color).toStrictEqual('#000000')

        expect(aux).toStrictEqual({ x: [], y: [] })
        expect(annotations).toStrictEqual([])
    })
})