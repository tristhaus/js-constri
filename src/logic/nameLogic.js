const userEnteredNamePattern = /^[a-zA-Z][a-zA-Z_0-9]*$/

const isUserEnteredName = candidate => {
    if (typeof candidate !== 'string') {
        return false
    }

    return candidate.match(userEnteredNamePattern) !== null
}

const getNameWithoutPossiblePrefix = input => {
    return input.match(/^§?(.*)$/)[1]
}

export { getNameWithoutPossiblePrefix, isUserEnteredName }