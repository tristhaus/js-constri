import { parse } from './parser.js'
import { initState, solve } from './solver.js'

const handleInput = inputText => {
    const code = inputText.split('\n').map(x => x.trim()).filter(x => x !== '')

    const state = initState()

    for (let i = 0; i < code.length; i++) {
        const parseResult = parse(code[i])

        if (parseResult === null) {
            return null
        }

        const solveResult = solve(parseResult, state)

        if (solveResult === null) {
            return null
        }
    }

    return state.collection
}

export { handleInput }