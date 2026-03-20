import { describe, expect, test } from 'vitest'

import { handleInput } from './inputHandler'
import { strings_de } from './langs'
import { ItemPoint } from './ItemPoint'
import { registry } from './registry'

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

    test('an invalid points returns error state', () => {
        const state = handleInput(defaultLang, `
            ${strings_de.point} Z 1.2 2.0
            ### Y 1.3 2.1
            `)

        expect(state).not.toBeNull()
        expect(state.isValid).toBe(false)
        expect(state.collection).toStrictEqual([])
    })
})