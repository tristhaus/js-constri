import { CommandIntersection } from './CommandIntersection'
import { CommandLine } from './CommandLine'
import { CommandPoint } from './CommandPoint'
import { CommandSegment } from './CommandSegment'
import { ItemLine } from './ItemLine'
import { ItemPoint } from './ItemPoint'
import { ItemSegment } from './ItemSegment'
import { registry } from './registry'
import { solve } from './solver'

// ~digits of precision
const jestPrecision = 4

describe('solver logic unit tests', () => {

    describe('name intersection unit tests', () => {

        test('duplicate name (1) returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)
            const segmentAC = new ItemSegment('ac', pointA, pointC)

            const state = { collection: [
                pointA,
                pointB,
                pointC,
                segmentAB,
                segmentAC,
            ] }

            const result = solve(new CommandIntersection('ab', 'ac', ['B']), state)

            expect(result).toBeNull()
        })

        test('duplicate name (2) returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)
            const segmentAC = new ItemSegment('ac', pointA, pointC)

            const state = { collection: [
                pointA,
                pointB,
                pointC,
                segmentAB,
                segmentAC,
            ] }

            const result = solve(new CommandIntersection('ab', 'ac', ['D', 'B']), state)

            expect(result).toBeNull()
        })

        describe('two lines unit tests', () => {

            test('non-vertical lines crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 3.0, 1.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(2, jestPrecision)
            })

            test('non-vertical lines crossing at origin', () => {
                const pointA1 = new ItemPoint('A1', 2.0, 1.0)
                const pointA2 = new ItemPoint('A2', -2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, -3.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(0, jestPrecision)
            })

            test('vertical and horizontal line crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', -2.0, 1.0)
                const pointA2 = new ItemPoint('A2', -2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, 3.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(-2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('vertical and skew line crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 2.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 4.0)
                const pointB2 = new ItemPoint('B2', 3.0, 6.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(5, jestPrecision)
            })

            test('non-vertical parallel lines not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, 2.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 2.0, 4.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('non-vertical identical lines not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, 2.0)
                const pointB1 = new ItemPoint('B1', 3.0, 3.0)
                const pointB2 = new ItemPoint('B2', 4.0, 4.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical parallel lines not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 1.0, 2.0)
                const pointB1 = new ItemPoint('B1', 2.0, 1.0)
                const pointB2 = new ItemPoint('B2', 2.0, 2.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical identical lines not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 1.0, 2.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 1.0, 4.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    lineA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })
        })

        describe('two segments unit tests', () => {

            test('non-vertical segments crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 3.0, 1.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(2, jestPrecision)
            })

            test('non-vertical short segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', 2.5, 2.5)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 3.0, 1.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('non-vertical segments crossing at origin', () => {
                const pointA1 = new ItemPoint('A1', 2.0, 1.0)
                const pointA2 = new ItemPoint('A2', -2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, -3.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(0, jestPrecision)
            })

            test('non-vertical short segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', 2.0, 1.0)
                const pointA2 = new ItemPoint('A2', 1.0, 0.5)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, -3.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical and horizontal segments crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', -2.0, 1.0)
                const pointA2 = new ItemPoint('A2', -2.0, -1.0)
                const pointB1 = new ItemPoint('B1', -3.0, 0.0)
                const pointB2 = new ItemPoint('B2', -1.0, 0.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(-2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(0, jestPrecision)
            })

            test('vertical and horizontal short segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', -2.0, 1.0)
                const pointA2 = new ItemPoint('A2', -2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, 3.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical and skew segments crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 2.0, 7.0)
                const pointA2 = new ItemPoint('A2', 2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 4.0)
                const pointB2 = new ItemPoint('B2', 3.0, 6.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(5, jestPrecision)
            })

            test('short vertical and skew segment not crossing', () => {
                const pointA1 = new ItemPoint('A1', 2.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 4.0)
                const pointB2 = new ItemPoint('B2', 3.0, 6.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('non-vertical parallel segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 6.0, 6.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 2.0, 4.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('non-vertical identical segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, 2.0)
                const pointB1 = new ItemPoint('B1', 1.0, 1.0)
                const pointB2 = new ItemPoint('B2', 2.0, 2.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical parallel segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 1.0, 2.0)
                const pointB1 = new ItemPoint('B1', 2.0, 1.0)
                const pointB2 = new ItemPoint('B2', 2.0, 2.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical identical segments not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 1.0, 2.0)
                const pointB1 = new ItemPoint('B1', 1.0, 1.0)
                const pointB2 = new ItemPoint('B2', 1.0, 2.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const segmentB = new ItemSegment('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    segmentB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })
        })

        describe('segment plus line unit tests', () => {

            test('segment and line crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 0.0, 0.0)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 3.0, 1.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(2, jestPrecision)
            })

            test('short segment and line not crossing', () => {
                const pointA1 = new ItemPoint('A1', 0.0, 0.0)
                const pointA2 = new ItemPoint('A2', 1.0, 1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 3.0, 1.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = { collection: [
                    pointA1,
                    pointA2,
                    pointB1,
                    pointB2,
                    segmentA,
                    lineB,
                ] }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })
        })
    })

    describe('line logic unit tests', () => {

        test('duplicate name returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
            ] }

            const result = solve(new CommandLine('ab', 'A', 'B'), state)

            expect(result).toBeNull()
        })

        test('valid line input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
                pointC,
            ] }

            const result = solve(new CommandLine('ac', 'A', 'C'), state)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(5)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.line)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.point)
            expect(result.collection[3].name).toBe('C')
            expect(result.collection[3].x).toBeCloseTo(5, jestPrecision)
            expect(result.collection[3].y).toBeCloseTo(6, jestPrecision)

            expect(result.collection[4].type).toBe(registry.line)
            expect(result.collection[4].name).toBe('ac')
            expect(result.collection[4].startPoint.name).toBe('A')
            expect(result.collection[4].endPoint.name).toBe('C')
        })

        test('line with identical start and end points returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
                pointC,
            ] }

            const result = solve(new CommandLine('ac', 'A', 'A'), state)

            expect(result).toBeNull()
        })

        test('line with reference to non-existent start point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
                pointC,
            ] }

            const result = solve(new CommandLine('ac', 'Z', 'C'), state)

            expect(result).toBeNull()
        })

        test('line with reference to start that is not a point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
                pointC,
            ] }

            const result = solve(new CommandLine('ac', 'ab', 'C'), state)

            expect(result).toBeNull()
        })

        test('line with reference to non-existent end point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
                pointC,
            ] }

            const result = solve(new CommandLine('ac', 'A', 'Z'), state)

            expect(result).toBeNull()
        })

        test('line with reference to end that is not a point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                lineAB,
                pointC,
            ] }

            const result = solve(new CommandLine('ac', 'A', 'ab'), state)

            expect(result).toBeNull()
        })

        test('line with very close start and end poitns returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 1.0, 2.000001)

            const state = { collection: [
                pointA,
                pointB,
            ] }

            const result = solve(new CommandLine('ab', 'A', 'B'), state)

            expect(result).toBeNull()
        })
    })

    describe('point logic unit tests', () => {

        test('duplicate name returns null', () => {
            const state = { collection: [new ItemPoint('A', 1.0, 2.0)] }

            const result = solve(new CommandPoint('A', 3.0, 4.0), state)

            expect(result).toBeNull()
        })

        test('valid point input returns extended state', () => {
            const state = { collection: [new ItemPoint('A', 1.0, 2.0)] }

            const result = solve(new CommandPoint('B', 3.0, 4.0), state)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(2)

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

    describe('segment logic unit tests', () => {

        test('duplicate name returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
            ] }

            const result = solve(new CommandSegment('ab', 'A', 'B'), state)

            expect(result).toBeNull()
        })

        test('valid segment input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
                pointC,
            ] }

            const result = solve(new CommandSegment('ac', 'A', 'C'), state)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(5)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.point)
            expect(result.collection[3].name).toBe('C')
            expect(result.collection[3].x).toBeCloseTo(5, jestPrecision)
            expect(result.collection[3].y).toBeCloseTo(6, jestPrecision)

            expect(result.collection[4].type).toBe(registry.segment)
            expect(result.collection[4].name).toBe('ac')
            expect(result.collection[4].startPoint.name).toBe('A')
            expect(result.collection[4].endPoint.name).toBe('C')
        })

        test('segment with identical start and end points returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
                pointC,
            ] }

            const result = solve(new CommandSegment('ac', 'A', 'A'), state)

            expect(result).toBeNull()
        })

        test('segment with reference to non-existent start point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
                pointC,
            ] }

            const result = solve(new CommandSegment('ac', 'Z', 'C'), state)

            expect(result).toBeNull()
        })

        test('segment with reference to start that is not a point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
                pointC,
            ] }

            const result = solve(new CommandSegment('ac', 'ab', 'C'), state)

            expect(result).toBeNull()
        })

        test('segment with reference to non-existent end point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
                pointC,
            ] }

            const result = solve(new CommandSegment('ac', 'A', 'Z'), state)

            expect(result).toBeNull()
        })

        test('segment with reference to end that is not a point returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = { collection: [
                pointA,
                pointB,
                segmentAB,
                pointC,
            ] }

            const result = solve(new CommandSegment('ac', 'A', 'ab'), state)

            expect(result).toBeNull()
        })

        test('segment with very close start and end poitns returns null', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 1.0, 2.000001)

            const state = { collection: [
                pointA,
                pointB,
            ] }

            const result = solve(new CommandSegment('ab', 'A', 'B'), state)

            expect(result).toBeNull()
        })
    })
})