import { describe, expect, test } from 'vitest'

import { handleInput } from './inputHandler'
import { strings_de } from './langs'
import { ItemPoint } from './ItemPoint'
import { registry } from './registry'
import { CommandColor } from './CommandColor'

describe('input handler tests', () => {

    const defaultLang = registry.langs.de

    test('empty string returns empty collection', () => {
        const state = handleInput(defaultLang, '')

        expect(state).not.toBeNull()
        expect(state.isValid).toBe(true)
        expect(state.collection).toStrictEqual([])
    })

    test('one valid point returns valid collection', () => {
        const state = handleInput(defaultLang, `${strings_de.point} Z 1.2 2.0`)

        expect(state).not.toBeNull()
        expect(state.isValid).toBe(true)
        expect(state.collection).toStrictEqual([new ItemPoint('Z', 1.2, 2.0)])
    })

    test('two valid points returns valid collection', () => {
        const state = handleInput(defaultLang, `
            ${strings_de.point} Z 1.2 2.0
            ${strings_de.point} Y 1.3 2.1
            `)

        expect(state).not.toBeNull()
        expect(state.isValid).toBe(true)
        expect(state.collection).toStrictEqual([
            new ItemPoint('Z', 1.2, 2.0),
            new ItemPoint('Y', 1.3, 2.1),
        ])
    })

    test('an invalid point returns error state', () => {
        const state = handleInput(defaultLang, `
            ${strings_de.point} Z 1.2 2.0
            ### Y 1.3 2.1
            `)

        expect(state).not.toBeNull()
        expect(state.isValid).toBe(false)
        expect(state.collection).toStrictEqual([])
    })

    test('color and poly command return valid collection', () => {
        const state = handleInput(defaultLang, `
            ${strings_de.point} Z 1.2 2.0
            ${strings_de.point} Y 1.3 2.1
            ${strings_de.point} X 1.4 2.2
            ${strings_de.point} W 1.5 2.3
            ${strings_de.color} blau
            ${strings_de.poly} Z Y X W
            `)

        const pointZ = new ItemPoint('Z', 1.2, 2.0)
        const pointY = new ItemPoint('Y', 1.3, 2.1)
        const pointX = new ItemPoint('X', 1.4, 2.2)
        const pointW = new ItemPoint('W', 1.5, 2.3)

        expect(state).not.toBeNull()
        expect(state.isValid).toBe(true)
        expect(state.collection.length).toBe(9)
        expect(state.collection.slice(0, 5)).toStrictEqual([
            pointZ,
            pointY,
            pointX,
            pointW,
            new CommandColor(registry.colors.blue),
        ])

        expect(state.collection[5].name).toMatch(/^§Z\.Y\.[0-9a-f]{32}$/)
        expect(state.collection[5].startPoint).toStrictEqual(pointZ)
        expect(state.collection[5].endPoint).toStrictEqual(pointY)

        expect(state.collection[6].name).toMatch(/^§Y\.X\.[0-9a-f]{32}$/)
        expect(state.collection[6].startPoint).toStrictEqual(pointY)
        expect(state.collection[6].endPoint).toStrictEqual(pointX)

        expect(state.collection[7].name).toMatch(/^§X\.W\.[0-9a-f]{32}$/)
        expect(state.collection[7].startPoint).toStrictEqual(pointX)
        expect(state.collection[7].endPoint).toStrictEqual(pointW)

        expect(state.collection[8].name).toMatch(/^§W\.Z\.[0-9a-f]{32}$/)
        expect(state.collection[8].startPoint).toStrictEqual(pointW)
        expect(state.collection[8].endPoint).toStrictEqual(pointZ)
    })
})