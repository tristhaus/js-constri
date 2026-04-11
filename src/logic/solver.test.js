import { describe, expect, test } from 'vitest'

import { CommandAngle } from './CommandAngle'
import { CommandCircle } from './CommandCircle'
import { CommandDeleteItems } from './CommandDeleteItems'
import { CommandDeleteNames } from './CommandDeleteNames'
import { CommandIntersection } from './CommandIntersection'
import { CommandLine } from './CommandLine'
import { CommandPoint } from './CommandPoint'
import { CommandPolygon } from './CommandPolygon'
import { CommandRay } from './CommandRay'
import { CommandSegment } from './CommandSegment'
import { ItemAngle } from './ItemAngle'
import { ItemCircle } from './ItemCircle'
import { ItemLine } from './ItemLine'
import { ItemPoint } from './ItemPoint'
import { ItemRay } from './ItemRay'
import { ItemSegment } from './ItemSegment'
import { registry } from './registry'
import { solve } from './solver'
import { CommandColor } from './CommandColor'

// ~digits of precision
const jestPrecision = 4
const emptyErrorMessages = {}

describe('solver logic unit tests', () => {

    describe('angle logic unit tests', () => {

        test('duplicate name of angle returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointZ = new ItemPoint('Z', 5.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const anglealpha = new ItemAngle('alpha', pointA, 0.25, 0.5)
            const rayq = new ItemRay('q', pointA, pointZ)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointZ,
                    segmentab,
                    anglealpha,
                    rayq,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandAngle('alpha', 'ab', 'A', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('alpha')
        })

        test('valid angle input returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 0.0, 4.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(Math.PI / 2, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(Math.PI / 4, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(-0.7071067811865475, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(0.7071067811865476, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input (with vertex not start/end) returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 0.0, 4.0)
            const pointC = new ItemPoint('C', 0.0, 1.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'C', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(7)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.point)
            expect(result.collection[2].name).toBe('C')
            expect(result.collection[2].x).toBeCloseTo(0, jestPrecision)
            expect(result.collection[2].y).toBeCloseTo(1, jestPrecision)

            expect(result.collection[3].type).toBe(registry.segment)
            expect(result.collection[3].name).toBe('ab')
            expect(result.collection[3].startPoint.name).toBe('A')
            expect(result.collection[3].endPoint.name).toBe('B')

            expect(result.collection[4].type).toBe(registry.angle)
            expect(result.collection[4].name).toBe('beta')
            expect(result.collection[4].vertex.name).toBe('C')
            expect(result.collection[4].startAngle).toBeCloseTo(Math.PI / 2, jestPrecision)
            expect(result.collection[4].value).toBeCloseTo(Math.PI / 4, jestPrecision)

            expect(result.collection[5].type).toBe(registry.point)
            expect(result.collection[5].name).toBe('!beta.point.r')
            expect(result.collection[5].x).toBeCloseTo(-0.7071067811865475, jestPrecision)
            expect(result.collection[5].y).toBeCloseTo(1.7071067811865475, jestPrecision)

            expect(result.collection[6].type).toBe(registry.ray)
            expect(result.collection[6].name).toBe('r')
            expect(result.collection[6].startPoint.name).toBe('C')
            expect(result.collection[6].endPoint.name).toBe('!beta.point.r')
        })

        test('angle with reference to non-existent startLineLike returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointZ = new ItemPoint('Z', 5.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const anglealpha = new ItemAngle('alpha', pointA, 0.25, 0.5)
            const rayr = new ItemRay('r', pointA, pointZ)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointZ,
                    segmentab,
                    anglealpha,
                    rayr,
                ]
            }

            const errorMessages = {
                solver: {
                    referenceLineLikeMissing: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'cd', 'A', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('cd')
        })

        test('angle with reference to startLineLike that is not a lineLike returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointZ = new ItemPoint('Z', 5.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const anglealpha = new ItemAngle('alpha', pointA, 0.25, 0.5)
            const rayr = new ItemRay('r', pointA, pointZ)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointZ,
                    segmentab,
                    anglealpha,
                    rayr,
                ]
            }

            const errorMessages = {
                solver: {
                    referenceLineLikeMissing: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'Z', 'A', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('angle with reference to non-existent vertex returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointZ = new ItemPoint('Z', 5.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const anglealpha = new ItemAngle('alpha', pointA, 0.25, 0.5)
            const rayr = new ItemRay('r', pointA, pointZ)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointZ,
                    segmentab,
                    anglealpha,
                    rayr,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'C', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('C')
        })

        test('angle with reference to vertex that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointZ = new ItemPoint('Z', 5.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const segmentaz = new ItemSegment('az', pointA, pointZ)
            const anglealpha = new ItemAngle('alpha', pointA, 0.25, 0.5)
            const rayr = new ItemRay('r', pointA, pointZ)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointZ,
                    segmentab,
                    segmentaz,
                    anglealpha,
                    rayr,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'az', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('az')
        })

        test('angle with duplicate name of ray returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointZ = new ItemPoint('Z', 5.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const anglealpha = new ItemAngle('alpha', pointA, 0.25, 0.5)
            const rayr = new ItemRay('r', pointA, pointZ)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointZ,
                    segmentab,
                    anglealpha,
                    rayr,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('r')
        })

        test('angle value of 0 returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const errorMessages = {
                solver: {
                    angleValueCannotBeUsed: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', 0.0), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBeCloseTo(0.0, jestPrecision)
        })

        test('angle value of 360 returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const errorMessages = {
                solver: {
                    angleValueCannotBeUsed: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', 2 * Math.PI), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBeCloseTo(2 * Math.PI, jestPrecision)
        })

        test('angle value of 540 returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const errorMessages = {
                solver: {
                    angleValueCannotBeUsed: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', 3 * Math.PI), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBeCloseTo(3 * Math.PI, jestPrecision)
        })

        test('angle value of -360 returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const errorMessages = {
                solver: {
                    angleValueCannotBeUsed: x => x
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', -2 * Math.PI), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBeCloseTo(-2 * Math.PI, jestPrecision)
        })

        test('angle with vertex not on line returns error state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 0.0, 4.0)
            const pointC = new ItemPoint('C', 1.0, 2.0)
            const lineab = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineab,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    vertexNotValid: (vn, lln) => `${vn}|${lln}`
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'C', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('C|ab')
        })

        test('angle with vertex not on segment returns error state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 0.0, 4.0)
            const pointC = new ItemPoint('C', 0.0, -2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    vertexNotValid: (vn, lln) => `${vn}|${lln}`
                }
            }

            const result = solve(new CommandAngle('beta', 'ab', 'C', 'r', Math.PI / 4), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('C|ab')
        })

        test('valid angle input (second quadrant, positive) returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', -3.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 6), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-3.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(6.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(2.356194490192345, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.5235987755982988, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.0340741737109318, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(2.258819045102521, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input (second quadrant, negative) returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', -3.0, 6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', -Math.PI / 6), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-3.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(6.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(2.356194490192345, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(-0.5235987755982988, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.7411809548974791, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(2.965925826289068, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input (third quadrant, positive) returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', -3.0, -6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 6), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-3.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-6.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-2.0344439357957027, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.5235987755982988, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(1.0599152608792162, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(1.0017965330085377, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input (third quadrant, negative) returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', -3.0, -6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', -Math.PI / 6), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-3.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-6.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-2.0344439357957027, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(-0.5235987755982988, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.16548806987930054, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(1.4490101285084953, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input (fourth quadrant, positive) returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, -6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 6), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(3.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-6.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-1.3258176636680326, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.5235987755982988, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(1.6951132626768675, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(1.2810997621013605, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input (fourth quadrant, negative) returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, -6.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', -Math.PI / 6), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(3.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-6.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-1.3258176636680326, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(-0.5235987755982988, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.7249707625315354, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(1.0385641370650278, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 0° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 2.0, 0.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(2.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.7071067811865476, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(0.7071067811865475, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 45° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 2.0, 2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(2.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(0.7853981633974483, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(1.0, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 90° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 0.0, 2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(1.5707963267948966, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(-0.7071067811865475, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(0.7071067811865476, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 135° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', -2.0, 2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-2.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(2.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(2.356194490192345, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(-1.0, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 180° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', -2.0, 0.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-2.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(3.141592653589793, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(-0.7071067811865477, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(-0.7071067811865475, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 225° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', -2.0, -2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(-2.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-2.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-2.356194490192345, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(-1.0, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 270° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 0.0, -2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-2.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-1.5707963267948966, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(0.7071067811865476, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(-0.7071067811865475, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })

        test('valid angle input starting at 315° returns extended state', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 2.0, -2.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                ]
            }

            const result = solve(new CommandAngle('beta', 'ab', 'A', 'r', Math.PI / 4), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(2.0, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(-2.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.segment)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.angle)
            expect(result.collection[3].name).toBe('beta')
            expect(result.collection[3].vertex.name).toBe('A')
            expect(result.collection[3].startAngle).toBeCloseTo(-0.7853981633974483, jestPrecision)
            expect(result.collection[3].value).toBeCloseTo(0.7853981633974483, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!beta.point.r')
            expect(result.collection[4].x).toBeCloseTo(1.0, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(0.0, jestPrecision)

            expect(result.collection[5].type).toBe(registry.ray)
            expect(result.collection[5].name).toBe('r')
            expect(result.collection[5].startPoint.name).toBe('A')
            expect(result.collection[5].endPoint.name).toBe('!beta.point.r')
        })
    })

    describe('circle logic unit tests', () => {

        test('duplicate name returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const circleK = new ItemCircle('k', pointA, 3.0)

            const state = {
                collection: [
                    pointA,
                    circleK,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandCircle('k', 'A', 3.0), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('k')
        })

        test('valid circle input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)

            const state = {
                collection: [
                    pointA,
                ]
            }

            const result = solve(new CommandCircle('k', 'A', 3.0), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.circle)
            expect(result.collection[1].name).toBe('k')
            expect(result.collection[1].centerPoint.x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[1].centerPoint.y).toBeCloseTo(2, jestPrecision)
            expect(result.collection[1].radius).toBeCloseTo(3.0, jestPrecision)

            expect(result.collection[2].type).toBe(registry.point)
            expect(result.collection[2].name).toBe('!k.circle.px')
            expect(result.collection[2].x).toBeCloseTo(4, jestPrecision)
            expect(result.collection[2].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[3].type).toBe(registry.point)
            expect(result.collection[3].name).toBe('!k.circle.nx')
            expect(result.collection[3].x).toBeCloseTo(-2, jestPrecision)
            expect(result.collection[3].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!k.circle.py')
            expect(result.collection[4].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(5, jestPrecision)

            expect(result.collection[5].type).toBe(registry.point)
            expect(result.collection[5].name).toBe('!k.circle.ny')
            expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[5].y).toBeCloseTo(-1, jestPrecision)
        })

        test('circle with reference to non-existent center point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)

            const state = {
                collection: [
                    pointA,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandCircle('k', 'B', 3.0), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('B')
        })

        test('circle with reference to center that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandCircle('k', 'ab', 3.0), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('circle with too small radius returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)

            const state = {
                collection: [
                    pointA,
                ]
            }

            const errorMessages = {
                solver: {
                    circleRadiusTooSmall: x => x
                }
            }

            const result1 = solve(new CommandCircle('k', 'A', 0.0), state, errorMessages)

            expect(result1).not.toBeNull()
            expect(result1.isValid).toBe(false)
            expect(result1.errorMessage).toBe(0)

            const result2 = solve(new CommandCircle('k', 'A', -1.0), state, errorMessages)

            expect(result2).not.toBeNull()
            expect(result2.isValid).toBe(false)
            expect(result2.errorMessage).toBe(-1)
        })
    })

    describe('color logic unit tests', () => {

        test('valid color input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)

            const state = {
                collection: [
                    pointA,
                ]
            }

            const result = solve(new CommandColor(registry.colors.yellow), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(2)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.color)
            expect(result.collection[1].color).toBe(registry.colors.yellow)
        })
    })

    describe('delete item unit tests', () => {

        test('deletion of non-existent item returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const errorMessages = {
                solver: {
                    itemToDeleteNotFound: x => x
                }
            }

            const result = solve(new CommandDeleteItems(['z']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('z')
        })

        test('trivial deletion of named point returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)

            const state = {
                collection: [
                    pointA,
                    pointB,
                ]
            }

            const result = solve(new CommandDeleteItems(['A']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('B')
            expect(result.collection[0].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(4, jestPrecision)
        })

        test('trivial deletion of unnamed point returns expected', () => {
            const pointA = new ItemPoint('§A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)

            const state = {
                collection: [
                    pointA,
                    pointB,
                ]
            }

            const result = solve(new CommandDeleteItems(['§A']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('B')
            expect(result.collection[0].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(4, jestPrecision)
        })

        test('trivial deletion of invisible point returns expected', () => {
            const pointA = new ItemPoint('!A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)

            const state = {
                collection: [
                    pointA,
                    pointB,
                ]
            }

            const result = solve(new CommandDeleteItems(['!A']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('B')
            expect(result.collection[0].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(4, jestPrecision)
        })

        test('deletion of points belonging to line returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const intermediate = solve(new CommandDeleteItems(['A']), state, emptyErrorMessages)
            const result = solve(new CommandDeleteItems(['B']), intermediate, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(3)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('!A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('!B')
            expect(result.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.line)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('!A')
            expect(result.collection[2].endPoint.name).toBe('!B')
        })

        test('deletion of points belonging to ray returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state1 = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                ]
            }

            const state2 = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                ]
            }

            const errorMessages = {
                solver: {
                    unableToDeleteItem: x => x
                }
            }

            const result1 = solve(new CommandDeleteItems(['A']), state1, errorMessages)
            expect(result1).not.toBeNull()
            expect(result1.isValid).toBe(false)
            expect(result1.errorMessage).toBe('A')

            const result2 = solve(new CommandDeleteItems(['B']), state2, errorMessages)
            expect(result2).not.toBeNull()
            expect(result2.isValid).toBe(true)
            expect(result2.collection.length).toBe(3)

            expect(result2.collection[0].type).toBe(registry.point)
            expect(result2.collection[0].name).toBe('A')
            expect(result2.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result2.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result2.collection[1].type).toBe(registry.point)
            expect(result2.collection[1].name).toBe('!B')
            expect(result2.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result2.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result2.collection[2].type).toBe(registry.ray)
            expect(result2.collection[2].name).toBe('ab')
            expect(result2.collection[2].startPoint.name).toBe('A')
            expect(result2.collection[2].endPoint.name).toBe('!B')
        })

        test('deletion of points belonging to segment returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const errorMessages = {
                solver: {
                    unableToDeleteItem: x => x
                }
            }

            const result1 = solve(new CommandDeleteItems(['A']), state, errorMessages)
            expect(result1).not.toBeNull()
            expect(result1.isValid).toBe(false)
            expect(result1.errorMessage).toBe('A')

            const result2 = solve(new CommandDeleteItems(['B']), state, errorMessages)
            expect(result2).not.toBeNull()
            expect(result2.isValid).toBe(false)
            expect(result2.errorMessage).toBe('B')
        })

        test('deletion of points belonging to more than one line-like returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)
            const rayCB = new ItemRay('cb', pointC, pointB)

            const state1 = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    segmentAB,
                    rayCB,
                ]
            }

            const state2 = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    segmentAB,
                    rayCB,
                ]
            }

            const state3 = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    segmentAB,
                    rayCB,
                ]
            }

            const errorMessages = {
                solver: {
                    unableToDeleteItem: x => x
                }
            }

            const result1 = solve(new CommandDeleteItems(['A']), state1, errorMessages)
            expect(result1).not.toBeNull()
            expect(result1.isValid).toBe(false)
            expect(result1.errorMessage).toBe('A')

            const result2 = solve(new CommandDeleteItems(['B']), state2, errorMessages)
            expect(result2).not.toBeNull()
            expect(result2.isValid).toBe(false)
            expect(result2.errorMessage).toBe('B')

            const result3 = solve(new CommandDeleteItems(['C']), state3, errorMessages)
            expect(result3).not.toBeNull()
            expect(result3.isValid).toBe(false)
            expect(result3.errorMessage).toBe('C')
        })

        test('deletion of circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const extremumPX = new ItemPoint('!k.circle.px', 4.0, 2.0)
            const extremumNX = new ItemPoint('!k.circle.nx', -2.0, 2.0)
            const extremumPY = new ItemPoint('!k.circle.py', 1.0, 5.0)
            const extremumNY = new ItemPoint('!k.circle.ny', 1.0, -1.0)
            const circleK = new ItemCircle('k', pointA, 3.0, [extremumPX, extremumNX, extremumPY, extremumNY])

            const state = {
                collection: [
                    pointA,
                    circleK,
                    extremumPX,
                    extremumNX,
                    extremumPY,
                    extremumNY,
                ]
            }

            const result = solve(new CommandDeleteItems(['k']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)
        })

        test('deletion of center of circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const extremumPX = new ItemPoint('!k.circle.px', 4.0, 2.0)
            const extremumNX = new ItemPoint('!k.circle.nx', -2.0, 2.0)
            const extremumPY = new ItemPoint('!k.circle.py', 1.0, 5.0)
            const extremumNY = new ItemPoint('!k.circle.ny', 1.0, -1.0)
            const circleK = new ItemCircle('k', pointA, 3.0, [extremumPX, extremumNX, extremumPY, extremumNY])

            const state = {
                collection: [
                    pointA,
                    circleK,
                    extremumPX,
                    extremumNX,
                    extremumPY,
                    extremumNY,
                ]
            }

            const result = solve(new CommandDeleteItems(['A']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('!A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.circle)
            expect(result.collection[1].name).toBe('k')
            expect(result.collection[1].centerPoint.x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[1].centerPoint.y).toBeCloseTo(2, jestPrecision)
            expect(result.collection[1].radius).toBeCloseTo(3.0, jestPrecision)
            expect(result.collection[1].centerPoint.name).toBe('!A')

            expect(result.collection[2].type).toBe(registry.point)
            expect(result.collection[2].name).toBe('!k.circle.px')
            expect(result.collection[2].x).toBeCloseTo(4, jestPrecision)
            expect(result.collection[2].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[3].type).toBe(registry.point)
            expect(result.collection[3].name).toBe('!k.circle.nx')
            expect(result.collection[3].x).toBeCloseTo(-2, jestPrecision)
            expect(result.collection[3].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[4].type).toBe(registry.point)
            expect(result.collection[4].name).toBe('!k.circle.py')
            expect(result.collection[4].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[4].y).toBeCloseTo(5, jestPrecision)

            expect(result.collection[5].type).toBe(registry.point)
            expect(result.collection[5].name).toBe('!k.circle.ny')
            expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[5].y).toBeCloseTo(-1, jestPrecision)
        })

        test('deletion of line with named points returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

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

        test('deletion of line with one named and one unnamed point returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('!B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)
        })

        test('deletion of line with two invisible points returns expected', () => {
            const pointA = new ItemPoint('§A', 1.0, 2.0)
            const pointB = new ItemPoint('§B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(0)
        })

        test('deletion of ray with named points returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

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

        test('deletion of ray with one named and one invisible point returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('§B', 3.0, 4.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)
        })

        test('deletion of segment with named points returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

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

        test('deletion of segment with one named and one unnamed point returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('!B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)
        })

        test('deletion of segment with two unnamed points returns expected', () => {
            const pointA = new ItemPoint('!A', 1.0, 2.0)
            const pointB = new ItemPoint('!B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(0)
        })

        test('two-step deletion of center of circle, circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const extremumPX = new ItemPoint('!k.circle.px', 4.0, 2.0)
            const extremumNX = new ItemPoint('!k.circle.nx', -2.0, 2.0)
            const extremumPY = new ItemPoint('!k.circle.py', 1.0, 5.0)
            const extremumNY = new ItemPoint('!k.circle.ny', 1.0, -1.0)
            const circleK = new ItemCircle('k', pointA, 3.0, [extremumPX, extremumNX, extremumPY, extremumNY])

            const state = {
                collection: [
                    pointA,
                    circleK,
                    extremumPX,
                    extremumNX,
                    extremumPY,
                    extremumNY,
                ]
            }

            const intermediate = solve(new CommandDeleteItems(['A']), state, emptyErrorMessages)
            const result = solve(new CommandDeleteItems(['k']), intermediate, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(0)
        })

        test('two-step deletion of circle, center of circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const extremumPX = new ItemPoint('!k.circle.px', 4.0, 2.0)
            const extremumNX = new ItemPoint('!k.circle.nx', -2.0, 2.0)
            const extremumPY = new ItemPoint('!k.circle.py', 1.0, 5.0)
            const extremumNY = new ItemPoint('!k.circle.ny', 1.0, -1.0)
            const circleK = new ItemCircle('k', pointA, 3.0, [extremumPX, extremumNX, extremumPY, extremumNY])

            const state = {
                collection: [
                    pointA,
                    circleK,
                    extremumPX,
                    extremumNX,
                    extremumPY,
                    extremumNY,
                ]
            }

            const intermediate = solve(new CommandDeleteItems(['k']), state, emptyErrorMessages)
            const result = solve(new CommandDeleteItems(['A']), intermediate, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(0)
        })

        test('combined deletion of center of circle, circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const extremumPX = new ItemPoint('!k.circle.px', 4.0, 2.0)
            const extremumNX = new ItemPoint('!k.circle.nx', -2.0, 2.0)
            const extremumPY = new ItemPoint('!k.circle.py', 1.0, 5.0)
            const extremumNY = new ItemPoint('!k.circle.ny', 1.0, -1.0)
            const circleK = new ItemCircle('k', pointA, 3.0, [extremumPX, extremumNX, extremumPY, extremumNY])

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    circleK,
                    extremumPX,
                    extremumNX,
                    extremumPY,
                    extremumNY,
                ]
            }

            const errorMessages = {}

            const result = solve(new CommandDeleteItems(['A', 'k']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(0)
        })

        test('combined deletion of circle, center of circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const extremumPX = new ItemPoint('!k.circle.px', 4.0, 2.0)
            const extremumNX = new ItemPoint('!k.circle.nx', -2.0, 2.0)
            const extremumPY = new ItemPoint('!k.circle.py', 1.0, 5.0)
            const extremumNY = new ItemPoint('!k.circle.ny', 1.0, -1.0)
            const circleK = new ItemCircle('k', pointA, 3.0, [extremumPX, extremumNX, extremumPY, extremumNY])

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    circleK,
                    extremumPX,
                    extremumNX,
                    extremumPY,
                    extremumNY,
                ]
            }

            const errorMessages = {}

            const result = solve(new CommandDeleteItems(['k', 'A']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(0)
        })

        test('three-step deletion of segment, points returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const intermediate1 = solve(new CommandDeleteItems(['ab']), state, emptyErrorMessages)
            const intermediate2 = solve(new CommandDeleteItems(['A']), intermediate1, emptyErrorMessages)
            const result = solve(new CommandDeleteItems(['B']), intermediate2, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(0)
        })

        test('three-step deletion of points, line returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const intermediate1 = solve(new CommandDeleteItems(['A']), state, emptyErrorMessages)
            const intermediate2 = solve(new CommandDeleteItems(['B']), intermediate1, emptyErrorMessages)
            const result = solve(new CommandDeleteItems(['ab']), intermediate2, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(0)
        })

        test('combined deletion of segment, points returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['ab', 'A', 'B']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(0)
        })

        test('combined deletion of points, line returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const result = solve(new CommandDeleteItems(['A', 'B', 'ab']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(0)
        })

        test('angle can be deleted alone', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 2.0, 0.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const angleBeta = new ItemAngle('beta', pointA, 0.2, 0.3)
            const pointHelper = new ItemPoint('!beta.point.r', 1.0, 2.0)
            const rayr = new ItemRay('r', pointA, pointHelper)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                    angleBeta,
                    pointHelper,
                    rayr,
                ]
            }

            const result1 = solve(new CommandDeleteItems(['beta']), state, emptyErrorMessages)

            expect(result1).not.toBeNull()
            expect(result1.isValid).toBe(true)
            expect(result1.collection.length).toBe(5)

            expect(result1.collection[0].type).toBe(registry.point)
            expect(result1.collection[0].name).toBe('A')
            expect(result1.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result1.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result1.collection[1].type).toBe(registry.point)
            expect(result1.collection[1].name).toBe('B')
            expect(result1.collection[1].x).toBeCloseTo(2.0, jestPrecision)
            expect(result1.collection[1].y).toBeCloseTo(0.0, jestPrecision)

            expect(result1.collection[2].type).toBe(registry.segment)
            expect(result1.collection[2].name).toBe('ab')
            expect(result1.collection[2].startPoint.name).toBe('A')
            expect(result1.collection[2].endPoint.name).toBe('B')

            expect(result1.collection[3].type).toBe(registry.point)
            expect(result1.collection[3].name).toBe('!beta.point.r')
            expect(result1.collection[3].x).toBeCloseTo(1.0, jestPrecision)
            expect(result1.collection[3].y).toBeCloseTo(2.0, jestPrecision)

            expect(result1.collection[4].type).toBe(registry.ray)
            expect(result1.collection[4].name).toBe('r')
            expect(result1.collection[4].startPoint.name).toBe('A')
            expect(result1.collection[4].endPoint.name).toBe('!beta.point.r')
        })

        test('angle and ray can be deleted together', () => {
            const pointA = new ItemPoint('A', 0.0, 0.0)
            const pointB = new ItemPoint('B', 2.0, 0.0)
            const segmentab = new ItemSegment('ab', pointA, pointB)
            const angleBeta = new ItemAngle('beta', pointA, 0.2, 0.3)
            const pointHelper = new ItemPoint('!beta.point.r', 1.0, 2.0)
            const rayr = new ItemRay('r', pointA, pointHelper)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    segmentab,
                    angleBeta,
                    pointHelper,
                    rayr,
                ]
            }

            const result1 = solve(new CommandDeleteItems(['beta', 'r']), state, emptyErrorMessages)

            expect(result1).not.toBeNull()
            expect(result1.isValid).toBe(true)
            expect(result1.collection.length).toBe(3)

            expect(result1.collection[0].type).toBe(registry.point)
            expect(result1.collection[0].name).toBe('A')
            expect(result1.collection[0].x).toBeCloseTo(0.0, jestPrecision)
            expect(result1.collection[0].y).toBeCloseTo(0.0, jestPrecision)

            expect(result1.collection[1].type).toBe(registry.point)
            expect(result1.collection[1].name).toBe('B')
            expect(result1.collection[1].x).toBeCloseTo(2.0, jestPrecision)
            expect(result1.collection[1].y).toBeCloseTo(0.0, jestPrecision)

            expect(result1.collection[2].type).toBe(registry.segment)
            expect(result1.collection[2].name).toBe('ab')
            expect(result1.collection[2].startPoint.name).toBe('A')
            expect(result1.collection[2].endPoint.name).toBe('B')
        })
    })

    describe('delete name unit tests', () => {

        test('deletion of non-existent name returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const errorMessages = {
                solver: {
                    itemToDeleteNameNotFound: x => x
                }
            }

            const result = solve(new CommandDeleteNames(['Z']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('trivial deletion of point name returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)

            const state = {
                collection: [
                    pointA,
                ]
            }

            const result = solve(new CommandDeleteNames(['A']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(1)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('§A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)
        })

        test('trivial deletion of line, ray, segment name returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)
            const rayAC = new ItemRay('ac', pointA, pointC)
            const segmentBC = new ItemSegment('bc', pointB, pointC)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    lineAB,
                    rayAC,
                    segmentBC,
                ]
            }

            const errorMessages = {}

            const result = solve(new CommandDeleteNames(['bc', 'ab', 'ac']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('B')
            expect(result.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.point)
            expect(result.collection[2].name).toBe('C')
            expect(result.collection[2].x).toBeCloseTo(5, jestPrecision)
            expect(result.collection[2].y).toBeCloseTo(6, jestPrecision)

            expect(result.collection[3].type).toBe(registry.line)
            expect(result.collection[3].name).toBe('§ab')

            expect(result.collection[4].type).toBe(registry.ray)
            expect(result.collection[4].name).toBe('§ac')

            expect(result.collection[5].type).toBe(registry.segment)
            expect(result.collection[5].name).toBe('§bc')
        })

        test('trivial deletion of circle name returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const circlek = new ItemCircle('k', pointA, 5, [])

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    circlek,
                ]
            }

            const errorMessages = {}

            const result = solve(new CommandDeleteNames(['k']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(2)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.circle)
            expect(result.collection[1].name).toBe('§k')
        })

        test('deletion of point names that are part of line, ray, segment returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)
            const rayAC = new ItemRay('ac', pointA, pointC)
            const segmentBC = new ItemSegment('bc', pointB, pointC)

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    lineAB,
                    rayAC,
                    segmentBC,
                ]
            }

            const errorMessages = {}

            const result = solve(new CommandDeleteNames(['C', 'B', 'A']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(6)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('§A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.point)
            expect(result.collection[1].name).toBe('§B')
            expect(result.collection[1].x).toBeCloseTo(3, jestPrecision)
            expect(result.collection[1].y).toBeCloseTo(4, jestPrecision)

            expect(result.collection[2].type).toBe(registry.point)
            expect(result.collection[2].name).toBe('§C')
            expect(result.collection[2].x).toBeCloseTo(5, jestPrecision)
            expect(result.collection[2].y).toBeCloseTo(6, jestPrecision)

            expect(result.collection[3].type).toBe(registry.line)
            expect(result.collection[3].name).toBe('ab')
            expect(result.collection[3].startPoint.name).toBe('§A')
            expect(result.collection[3].endPoint.name).toBe('§B')

            expect(result.collection[4].type).toBe(registry.ray)
            expect(result.collection[4].name).toBe('ac')
            expect(result.collection[4].startPoint.name).toBe('§A')
            expect(result.collection[4].endPoint.name).toBe('§C')

            expect(result.collection[5].type).toBe(registry.segment)
            expect(result.collection[5].name).toBe('bc')
            expect(result.collection[5].startPoint.name).toBe('§B')
            expect(result.collection[5].endPoint.name).toBe('§C')
        })

        test('deletion of point name that is part of a circle returns expected', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const circlek = new ItemCircle('k', pointA, 5, [])

            const state = {
                isValid: true,
                collection: [
                    pointA,
                    circlek,
                ]
            }

            const errorMessages = {}

            const result = solve(new CommandDeleteNames(['A']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.collection.length).toBe(2)

            expect(result.collection[0].type).toBe(registry.point)
            expect(result.collection[0].name).toBe('§A')
            expect(result.collection[0].x).toBeCloseTo(1, jestPrecision)
            expect(result.collection[0].y).toBeCloseTo(2, jestPrecision)

            expect(result.collection[1].type).toBe(registry.circle)
            expect(result.collection[1].name).toBe('k')
            expect(result.collection[1].centerPoint.name).toBe('§A')
        })
    })

    describe('name intersection unit tests', () => {

        test('duplicate name (1) returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)
            const segmentAC = new ItemSegment('ac', pointA, pointC)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    segmentAB,
                    segmentAC,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandIntersection('ab', 'ac', ['B']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('B')
        })

        test('duplicate name (2) returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)
            const segmentAC = new ItemSegment('ac', pointA, pointC)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    pointC,
                    segmentAB,
                    segmentAC,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandIntersection('ab', 'ac', ['D', 'B']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('D,B')
        })

        describe('two lines unit tests', () => {

            test('non-vertical lines crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 3.0, 1.0)
                const lineA = new ItemLine('la', pointA1, pointA2)
                const lineB = new ItemLine('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        lineA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })
        })

        describe('two rays unit tests', () => {

            test('non-vertical rays crossing anywhere (1)', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 2.0)
                const pointA2 = new ItemPoint('A2', 3.0, 6.0)
                const pointB1 = new ItemPoint('B1', 6.0, 3.0)
                const pointB2 = new ItemPoint('B2', 5.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(1.5, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3.0, jestPrecision)
            })

            test('non-vertical rays not crossing due to direction (1)', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 2.0)
                const pointA2 = new ItemPoint('A2', 3.0, 6.0)
                const pointB1 = new ItemPoint('B1', 5.0, 3.0)
                const pointB2 = new ItemPoint('B2', 6.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('non-vertical rays crossing anywhere (2)', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 2.0)
                const pointA2 = new ItemPoint('A2', 3.0, 6.0)
                const pointB1 = new ItemPoint('B1', -6.0, 3.0)
                const pointB2 = new ItemPoint('B2', -5.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(1.5, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3.0, jestPrecision)
            })

            test('non-vertical rays not crossing due to direction (2)', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 2.0)
                const pointA2 = new ItemPoint('A2', 3.0, 6.0)
                const pointB1 = new ItemPoint('B1', -5.0, 3.0)
                const pointB2 = new ItemPoint('B2', -6.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical and horizontal rays crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', -2.0, -1.0)
                const pointA2 = new ItemPoint('A2', -2.0, 1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(-2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('vertical and horizontal rays not crossing due to direction (1)', () => {
                const pointA1 = new ItemPoint('A1', -2.0, 1.0)
                const pointA2 = new ItemPoint('A2', -2.0, -1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', -1.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('vertical and horizontal rays not crossing due to direction (2)', () => {
                const pointA1 = new ItemPoint('A1', -2.0, -1.0)
                const pointA2 = new ItemPoint('A2', -2.0, 1.0)
                const pointB1 = new ItemPoint('B1', -1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 1.0, 3.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('parallel rays not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, 2.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 2.0, 4.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('identical rays not crossing', () => {
                const pointA1 = new ItemPoint('A1', 1.0, 1.0)
                const pointA2 = new ItemPoint('A2', 2.0, 2.0)
                const pointB1 = new ItemPoint('B1', 3.0, 3.0)
                const pointB2 = new ItemPoint('B2', 4.0, 4.0)
                const rayA = new ItemRay('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        rayA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        segmentB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

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

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        lineB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })
        })

        describe('segment plus ray unit tests', () => {

            test('segment and ray crossing anywhere', () => {
                const pointA1 = new ItemPoint('A1', 0.0, 0.0)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 1.5, 2.5)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Iab')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(2, jestPrecision)
            })

            test('short segment and ray not crossing', () => {
                const pointA1 = new ItemPoint('A1', 0.0, 0.0)
                const pointA2 = new ItemPoint('A2', 1.0, 1.0)
                const pointB1 = new ItemPoint('B1', 1.0, 3.0)
                const pointB2 = new ItemPoint('B2', 1.5, 2.5)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })

            test('segment and ray not crossing due to direction', () => {
                const pointA1 = new ItemPoint('A1', 0.0, 0.0)
                const pointA2 = new ItemPoint('A2', 3.0, 3.0)
                const pointB1 = new ItemPoint('B1', 1.5, 2.5)
                const pointB2 = new ItemPoint('B2', 1.0, 3.0)
                const segmentA = new ItemSegment('la', pointA1, pointA2)
                const rayB = new ItemRay('lb', pointB1, pointB2)

                const state = {
                    collection: [
                        pointA1,
                        pointA2,
                        pointB1,
                        pointB2,
                        segmentA,
                        rayB,
                    ]
                }

                const result = solve(new CommandIntersection('la', 'lb', ['Iab']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)
            })
        })

        describe('circle plus line unit tests', () => {

            test('circle and line not crossing, too far apart', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 0.5, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and horizontal line touching', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 3.0)
                const pointB = new ItemPoint('B', 2.0, 3.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and vertical line touching', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)
            })

            test('circle and slanted line crossing 1', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(-0.56155, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(-0.56155, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(3.56155, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3.56155, jestPrecision)
            })

            test('circle and slanted line crossing 2', () => {
                const pointM = new ItemPoint('M', -1.0, -2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.7, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(0.30910, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(0.69931, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(-3.94479, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(-2.57291, jestPrecision)
            })

            test('circle and horizontal line crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.5, 3.0)
                const pointB = new ItemPoint('B', 1.5, 3.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(-1.82843, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(3.82843, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and horizontal line crossing (midpoint equals A)', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 3.0)
                const pointB = new ItemPoint('B', 2.0, 3.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(3.82843, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(-1.82843, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and horizontal line crossing (midpoint equals B)', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.0, 3.0)
                const pointB = new ItemPoint('B', 1.0, 3.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(-1.82843, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(3.82843, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and vertical line crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(-0.82843, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(4.82843, jestPrecision)
            })

            test('circle with slanted line through center', () => {
                const pointM = new ItemPoint('M', 0.5, 1.0)
                const circlek = new ItemCircle('k', pointM, 0.25, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.0, 0.0)
                const pointB = new ItemPoint('B', 1.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(0.38820, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(0.77639, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(0.61180, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(1.22361, jestPrecision)
            })

            test('circle with horizontal line through center', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 2.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(4, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(-2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(2, jestPrecision)
            })

            test('circle with vertical line through center', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 2.0)
                const pointB = new ItemPoint('B', 1.0, 1.0)
                const lineab = new ItemLine('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        lineab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(-1, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(5, jestPrecision)
            })
        })

        describe('circle plus ray unit tests', () => {

            test('circle and ray not crossing, too far apart', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 0.5, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and horizontal ray touching (1)', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, 3.0)
                const pointB = new ItemPoint('B', 1.5, 3.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and ray not touching (1): wrong direction', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, 3.0)
                const pointB = new ItemPoint('B', 1.5, 3.0)
                const rayba = new ItemRay('ba', pointB, pointA)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayba,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ba', ['Ikba1', 'Ikba2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and horizontal ray touching (2a)', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.5, 3.0)
                const pointB = new ItemPoint('B', 1.5, 3.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and horizontal ray touching (2b)', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.5, 3.0)
                const pointB = new ItemPoint('B', 1.5, 3.0)
                const rayba = new ItemRay('ab', pointB, pointA)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayba,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and vertical ray touching', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.0, 3.0)
                const pointB = new ItemPoint('B', 0.0, 0.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)
            })

            test('circle and horizontal ray crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 2.0, []) // disregard extrema
                const pointA = new ItemPoint('A', -2.0, 3.0)
                const pointB = new ItemPoint('B', 5.0, 3.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(-0.73205, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(2.732050, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and vertical ray crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 2.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.0, 5.0)
                const pointB = new ItemPoint('B', 0.0, 0.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3.73205, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(0.26795, jestPrecision)
            })

            test('circle and slanted ray crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 3.0, 3.0)
                const pointB = new ItemPoint('B', 2.5, 2.5)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(1, jestPrecision)
            })

            test('circle and slanted ray not crossing: wrong direction', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 3.0, 3.0)
                const pointB = new ItemPoint('B', 2.5, 2.5)
                const rayba = new ItemRay('ba', pointB, pointA)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayba,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ba', ['Ikba1', 'Ikba2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and slanted ray crossing, originating inside', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.5, 1.5)
                const pointB = new ItemPoint('B', 3.0, 3.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)
            })

            test('circle and slanted ray crossing, originating outside', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.5, 1.5)
                const pointB = new ItemPoint('B', 3.0, 3.0)
                const rayba = new ItemRay('ba', pointB, pointA)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayba,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ba', ['Ikba1', 'Ikba2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikba1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikba2')
                expect(result.collection[6].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(1, jestPrecision)
            })

            test('circle and slanted ray passing through center', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.0, 0.0)
                const pointB = new ItemPoint('B', 2.0, 4.0)
                const rayab = new ItemRay('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        rayab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikba1', 'Ikba2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikba1')
                expect(result.collection[5].x).toBeCloseTo(0.55279, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.10557, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikba2')
                expect(result.collection[6].x).toBeCloseTo(1.44721, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(2.89443, jestPrecision)
            })
        })

        describe('circle plus segment unit tests', () => {

            test('circle and segment not crossing, too far apart', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 0.5, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and horizontal segment touching', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 3.0)
                const pointB = new ItemPoint('B', 2.0, 3.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and horizontal segment not touching: too short', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.5, 3.0)
                const pointB = new ItemPoint('B', 2.0, 3.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and vertical segment touching', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2, jestPrecision)
            })

            test('circle and vertical segment not touching: too short', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 1.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 1.5)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and slanted segment crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', -5.0, -5.0)
                const pointB = new ItemPoint('B', 5.0, 5.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(-0.56155, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(-0.56155, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(3.56155, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3.56155, jestPrecision)
            })

            test('circle and slanted segment not crossing: too short', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', -5.0, -5.0)
                const pointB = new ItemPoint('B', -4.0, -4.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and horizontal segment crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', -3.0, 3.0)
                const pointB = new ItemPoint('B', 5.0, 3.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(-1.82843, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(3.82843, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(3, jestPrecision)
            })

            test('circle and horizontal segment not crossing: too short', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', -3.0, 3.0)
                const pointB = new ItemPoint('B', -2.5, 3.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle and vertical segment crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, -5.0)
                const pointB = new ItemPoint('B', 2.0, 5.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(-0.82843, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(4.82843, jestPrecision)
            })

            test('circle and vertical segment not crossing: too short', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 2.0, -5.0)
                const pointB = new ItemPoint('B', 2.0, -4.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })

            test('circle with slanted segment through center', () => {
                const pointM = new ItemPoint('M', 0.5, 1.0)
                const circlek = new ItemCircle('k', pointM, 0.25, []) // disregard extrema
                const pointA = new ItemPoint('A', 0.0, 0.0)
                const pointB = new ItemPoint('B', 1.0, 2.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(7)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab1')
                expect(result.collection[5].x).toBeCloseTo(0.38820, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(0.77639, jestPrecision)

                expect(result.collection[6].type).toBe(registry.point)
                expect(result.collection[6].name).toBe('Ikab2')
                expect(result.collection[6].x).toBeCloseTo(0.61180, jestPrecision)
                expect(result.collection[6].y).toBeCloseTo(1.22361, jestPrecision)
            })

            test('circle and slanted segment: just one crossing', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 1.0)
                const pointB = new ItemPoint('B', 5.0, 5.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('Ikab2')
                expect(result.collection[5].x).toBeCloseTo(3.56155, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3.56155, jestPrecision)
            })

            test('circle and segment not crossing: segment entirely inside circle', () => {
                const pointM = new ItemPoint('M', 1.0, 2.0)
                const circlek = new ItemCircle('k', pointM, 3.0, []) // disregard extrema
                const pointA = new ItemPoint('A', 1.0, 1.0)
                const pointB = new ItemPoint('B', 2.0, 2.0)
                const segmentab = new ItemSegment('ab', pointA, pointB)

                const state = {
                    collection: [
                        pointM,
                        circlek,
                        pointA,
                        pointB,
                        segmentab,
                    ]
                }

                const result = solve(new CommandIntersection('k', 'ab', ['Ikab1', 'Ikab2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)
            })
        })

        describe('two circles unit tests', () => {
            test('circles not crossing, too far apart', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 1.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 1.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(4)
            })

            test('circles not crossing, first contains second', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 7.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 4.0)
                const circlekS = new ItemCircle('kS', pointS, 1.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(4)
            })

            test('circles not crossing, second contains first', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 1.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 4.0)
                const circlekS = new ItemCircle('kS', pointS, 7.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(4)
            })

            test('circles, next to each other, horizontally, touching (different size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 1.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(2, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0, jestPrecision)
            })

            test('circles, next to each other, horizontally, touching (same size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 1.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 1.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.5, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0, jestPrecision)
            })

            test('circles, next to each other, vertically, touching (different size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 1.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(2, jestPrecision)
            })

            test('circles, next to each other, vertically, touching (same size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 1.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 1.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(1.5, jestPrecision)
            })

            test('circles, next to each other, slanted, touching (different size)', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 3.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0.2, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0.6, jestPrecision)
            })

            test('circles, next to each other, slanted, touching (same size)', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 2.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 2.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0.5, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(1, jestPrecision)
            })

            test('circles, first containing second, horizontally, touching', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 4.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 1.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(4, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0, jestPrecision)
            })

            test('circles, second containing first, horizontally, touching', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 1.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 4.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(-1, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0, jestPrecision)
            })

            test('circles, first containing second, vertically, touching', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 4.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 1.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(4, jestPrecision)
            })

            test('circles, second containing first, vertically, touching', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 1.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 4.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-1, jestPrecision)
            })

            test('circles, first containing second, slanted, touching', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 7.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(-2.2, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-2.6, jestPrecision)
            })

            test('circles, second containing first, slanted, touching', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 7.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 2.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(5)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(3.2, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(4.6, jestPrecision)
            })

            test('circles, between, horizontally, crossing (different size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 1.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(2.16667, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-1.24722, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(2.16667, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.24722, jestPrecision)
            })

            test('circles, between, horizontally, crossing (same size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 2.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.5, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-1.32288, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(1.5, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.32288, jestPrecision)
            })

            test('circles, far side 1, horizontally, crossing', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 3.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 2.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(2.875, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-1.99609, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(2.875, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.99609, jestPrecision)
            })

            test('circles, far side 2, horizontally, crossing', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 3.0, 0.0)
                const circlekS = new ItemCircle('kS', pointS, 3.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0.125, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-1.99609, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(0.125, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.99609, jestPrecision)
            })

            test('circles, between, vertically, crossing (different size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 1.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.24722, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(2.16667, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-1.24722, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2.16667, jestPrecision)
            })

            test('circles, between, vertically, crossing (same size)', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 2.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.32288, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(1.5, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-1.32288, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.5, jestPrecision)
            })

            test('circles, far side 1, vertically, crossing', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 3.5, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 2.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.99609, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(2.875, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-1.99609, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(2.875, jestPrecision)
            })

            test('circles, far side 2, vertically, crossing', () => {
                const pointR = new ItemPoint('R', 0.0, 0.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 0.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 3.5, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.99609, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0.125, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-1.99609, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(0.125, jestPrecision)
            })

            test('circles, between, slanted, crossing (different size)', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 4.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 3.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(2.84, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0.12, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-1, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(3, jestPrecision)
            })

            test('circles, between, slanted, crossing (same size)', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 3.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 3.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(1.82665, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(0.00501, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-0.82665, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(1.99499, jestPrecision)
            })

            test('circles, far side 1, slanted, crossing', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 6.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 2.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(3.91880, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(2.43590, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(0.92120, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(4.68410, jestPrecision)
            })

            test('circles, far side 1, slanted, crossing', () => {
                const pointR = new ItemPoint('R', -1.0, -1.0)
                const circlekR = new ItemCircle('kR', pointR, 2.0, []) // disregard extrema
                const pointS = new ItemPoint('S', 2.0, 3.0)
                const circlekS = new ItemCircle('kS', pointS, 6.0, []) // disregard extrema

                const state = {
                    collection: [
                        pointR,
                        circlekR,
                        pointS,
                        circlekS,
                    ]
                }

                const result = solve(new CommandIntersection('kR', 'kS', ['I1', 'I2']), state, emptyErrorMessages)

                expect(result).not.toBeNull()
                expect(result.collection.length).toBe(6)

                expect(result.collection[4].type).toBe(registry.point)
                expect(result.collection[4].name).toBe('I1')
                expect(result.collection[4].x).toBeCloseTo(0.07880, jestPrecision)
                expect(result.collection[4].y).toBeCloseTo(-2.68410, jestPrecision)

                expect(result.collection[5].type).toBe(registry.point)
                expect(result.collection[5].name).toBe('I2')
                expect(result.collection[5].x).toBeCloseTo(-2.91880, jestPrecision)
                expect(result.collection[5].y).toBeCloseTo(-0.43590, jestPrecision)
            })
        })
    })

    describe('line logic unit tests', () => {

        test('duplicate name returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandLine('ab', 'A', 'B'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('valid line input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                    pointC,
                ]
            }

            const result = solve(new CommandLine('ac', 'A', 'C'), state, emptyErrorMessages)

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

        test('line with identical start and end points returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointsCantBeIdentical: x => x
                }
            }

            const result = solve(new CommandLine('ac', 'A', 'A'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A')
        })

        test('line with reference to non-existent start point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandLine('ac', 'Z', 'C'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('line with reference to start that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandLine('ac', 'ab', 'C'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('line with reference to non-existent end point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandLine('ac', 'A', 'Z'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('line with reference to end that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const lineAB = new ItemLine('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    lineAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandLine('ac', 'A', 'ab'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('line with very close start and end points returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 1.0, 2.000001)

            const state = {
                collection: [
                    pointA,
                    pointB,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointsInvalid: (x1, x2) => `${x1}|${x2}`
                }
            }

            const result = solve(new CommandLine('ab', 'A', 'B'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A|B')
        })
    })

    describe('point logic unit tests', () => {

        test('duplicate name returns error state', () => {
            const state = { collection: [new ItemPoint('A', 1.0, 2.0)] }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandPoint('A', 3.0, 4.0), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A')
        })

        test('valid point input returns extended state', () => {
            const state = { collection: [new ItemPoint('A', 1.0, 2.0)] }

            const result = solve(new CommandPoint('B', 3.0, 4.0), state, emptyErrorMessages)

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

    describe('point logic unit tests', () => {

        test('valid polygon input returns extended state', () => {
            const state = {
                isValid: true,
                collection: [
                    new ItemPoint('A', 1.0, 2.0),
                    new ItemPoint('B', 3.0, 4.0),
                    new ItemPoint('C', 5.0, 6.0),
                ]
            }

            const result = solve(new CommandPolygon(['A', 'B', 'C']), state, emptyErrorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(true)
            expect(result.collection.length).toBe(6)

            expect(result.collection[3].type).toBe(registry.segment)
            expect(result.collection[3].name).toMatch(/^§A.B.[0-9a-f]{32}$/)
            expect(result.collection[3].startPoint.name).toBe('A')
            expect(result.collection[3].endPoint.name).toBe('B')

            expect(result.collection[4].type).toBe(registry.segment)
            expect(result.collection[4].name).toMatch(/^§B.C.[0-9a-f]{32}$/)
            expect(result.collection[4].startPoint.name).toBe('B')
            expect(result.collection[4].endPoint.name).toBe('C')

            expect(result.collection[5].type).toBe(registry.segment)
            expect(result.collection[5].name).toMatch(/^§C.A.[0-9a-f]{32}$/)
            expect(result.collection[5].startPoint.name).toBe('C')
            expect(result.collection[5].endPoint.name).toBe('A')
        })

        test('duplicate reference name returns error state', () => {
            const state = {
                collection: [
                    new ItemPoint('A', 1.0, 2.0),
                    new ItemPoint('B', 3.0, 4.0),
                    new ItemPoint('C', 5.0, 6.0),
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateReferenceName: x => x.join('. ')
                }
            }

            const result = solve(new CommandPolygon(['A', 'B', 'C', 'A']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A. B. C. A')
        })

        test('reference point missing returns error state', () => {
            const state = {
                collection: [
                    new ItemPoint('A', 1.0, 2.0),
                    new ItemPoint('B', 3.0, 4.0),
                    new ItemPoint('C', 5.0, 6.0),
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandPolygon(['A', 'B', 'C', 'D']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('D')
        })

        test('reference point missing returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    new ItemPoint('C', 5.0, 6.0),
                    new ItemLine('ab', pointA, pointB)
                ]
            }

            const errorMessages = {
                solver: {
                    itemIsNotAPoint: x => x
                }
            }

            const result = solve(new CommandPolygon(['A', 'B', 'C', 'ab']), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })
    })

    describe('ray logic unit tests', () => {

        test('duplicate name returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandRay('ab', 'A', 'B'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('valid ray input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                    pointC,
                ]
            }

            const result = solve(new CommandRay('ac', 'A', 'C'), state, emptyErrorMessages)

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

            expect(result.collection[2].type).toBe(registry.ray)
            expect(result.collection[2].name).toBe('ab')
            expect(result.collection[2].startPoint.name).toBe('A')
            expect(result.collection[2].endPoint.name).toBe('B')

            expect(result.collection[3].type).toBe(registry.point)
            expect(result.collection[3].name).toBe('C')
            expect(result.collection[3].x).toBeCloseTo(5, jestPrecision)
            expect(result.collection[3].y).toBeCloseTo(6, jestPrecision)

            expect(result.collection[4].type).toBe(registry.ray)
            expect(result.collection[4].name).toBe('ac')
            expect(result.collection[4].startPoint.name).toBe('A')
            expect(result.collection[4].endPoint.name).toBe('C')
        })

        test('ray with identical start and end points returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointsCantBeIdentical: x => x
                }
            }

            const result = solve(new CommandRay('ac', 'A', 'A'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A')
        })

        test('ray with reference to non-existent start point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandRay('ac', 'Z', 'C'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('ray with reference to start that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandRay('ac', 'ab', 'C'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('ray with reference to non-existent end point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandRay('ac', 'A', 'Z'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('ray with reference to end that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const rayAB = new ItemRay('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    rayAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandRay('ac', 'A', 'ab'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('ray with very close start and end points returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 1.0, 2.000001)

            const state = {
                collection: [
                    pointA,
                    pointB,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointsInvalid: (x1, x2) => `${x1}|${x2}`
                }
            }

            const result = solve(new CommandRay('ab', 'A', 'B'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A|B')
        })
    })

    describe('segment logic unit tests', () => {

        test('duplicate name returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                ]
            }

            const errorMessages = {
                solver: {
                    duplicateName: x => x
                }
            }

            const result = solve(new CommandSegment('ab', 'A', 'B'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('valid segment input returns extended state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                    pointC,
                ]
            }

            const result = solve(new CommandSegment('ac', 'A', 'C'), state, emptyErrorMessages)

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

        test('segment with identical start and end points returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointsCantBeIdentical: x => x
                }
            }

            const result = solve(new CommandSegment('ac', 'A', 'A'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A')
        })

        test('segment with reference to non-existent start point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandSegment('ac', 'Z', 'C'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('segment with reference to start that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandSegment('ac', 'ab', 'C'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('segment with reference to non-existent end point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandSegment('ac', 'A', 'Z'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Z')
        })

        test('segment with reference to end that is not a point returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 3.0, 4.0)
            const pointC = new ItemPoint('C', 5.0, 6.0)
            const segmentAB = new ItemSegment('ab', pointA, pointB)

            const state = {
                collection: [
                    pointA,
                    pointB,
                    segmentAB,
                    pointC,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointMissing: x => x
                }
            }

            const result = solve(new CommandSegment('ac', 'A', 'ab'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('ab')
        })

        test('segment with very close start and end points returns error state', () => {
            const pointA = new ItemPoint('A', 1.0, 2.0)
            const pointB = new ItemPoint('B', 1.0, 2.000001)

            const state = {
                collection: [
                    pointA,
                    pointB,
                ]
            }

            const errorMessages = {
                solver: {
                    referencePointsInvalid: (x1, x2) => `${x1}|${x2}`
                }
            }

            const result = solve(new CommandSegment('ab', 'A', 'B'), state, errorMessages)

            expect(result).not.toBeNull()
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('A|B')
        })
    })
})