import { handleInput } from './inputHandler'
import { lang } from './parser'
import { ItemPoint } from './ItemPoint'

describe('input handler tests', () => {

    test('empty string returns empty collection', () => {
        const collection = handleInput('')

        expect(collection).not.toBeNull()
        expect(collection).toStrictEqual([])
    })

    test('one valid point returns valid collection', () => {
        const collection = handleInput(`${lang.point} Z 1.2 2.0`)

        expect(collection).not.toBeNull()
        expect(collection).toStrictEqual([new ItemPoint('Z', 1.2, 2.0)])
    })

    test('two valid points returns valid collection', () => {
        const collection = handleInput(`
            ${lang.point} Z 1.2 2.0
            ${lang.point} Y 1.3 2.1
            `)

        expect(collection).not.toBeNull()
        expect(collection).toStrictEqual([
            new ItemPoint('Z', 1.2, 2.0),
            new ItemPoint('Y', 1.3, 2.1),
        ])
    })

    test('an invalid points returns null', () => {
        const collection = handleInput(`
            ${lang.point} Z 1.2 2.0
            ### Y 1.3 2.1
            `)

        expect(collection).toBeNull()
    })
})