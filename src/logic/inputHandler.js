import { parse } from './parser.js'
import { initState, solve } from './solver.js'
import { allStrings } from './langs.js'
import { registry } from './registry.js'

const handleInput = (lang, inputText) => {
    const errorMessages = allStrings[lang].errorMessages

    const code = inputText.split('\n').map(x => x.trim()).filter(x => x !== '')

    const state = initState()

    for (let i = 0; i < code.length; i++) {
        const parseResult = parse(lang, code[i], errorMessages)

        if (parseResult.type === registry.invalid) {
            const errorState = initState()
            errorState.isValid = false
            errorState.errorMessage = parseResult?.errorMessage ?? 'generic error message: parser'

            return errorState
        }

        const solveResult = solve(parseResult, state, errorMessages)

        // at this point, solveResult and state should be identical
        if (!solveResult.isValid) {
            return solveResult
        }
    }

    return state
}

export { handleInput }