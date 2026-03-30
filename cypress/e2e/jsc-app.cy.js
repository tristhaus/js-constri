const viewportInfos = [
    {
        displayName: 'stdcy',
        isNarrow: false,
        width: 1000,
        height: 660,
    },
    {
        displayName: 'phonePortrait',
        isNarrow: true,
        width: 360,
        height: 800,
    },
    {
        displayName: 'phoneLandscape',
        isNarrow: false,
        width: 800,
        height: 360,
    }
]

viewportInfos.forEach(viewportInfo => {

    describe(`JSC - size: ${viewportInfo.displayName} (${viewportInfo.width}x${viewportInfo.height}, ${viewportInfo.isNarrow ? 'narrow' : 'wide'})`, function () {

        describe('English', function () {
            const langButtonId = '#chooseLangEn'

            it(`open and close help [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.contains('Help').click()
                cy.get('#helpBoxEn').should('exist')
                cy.contains('OK').click()
                cy.get('#helpBoxEn').should('not.exist')
            })

            it(`default input does not yield error [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.contains('Execute').click()
                cy.get('#errorBox').should('not.exist')
            })

            it(`valid input does not yield error [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3')
                cy.contains('Execute').click()
                cy.get('#errorBox').should('not.exist')
            })

            it(`invalid input yields error [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}invalid')
                cy.contains('Execute').click()
                cy.get('#errorBox').should('exist')
                cy.contains('Close').click()
            })

            it(`with error box present, valid input and execute closes error box [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}invalid')
                cy.contains('Execute').click()
                cy.get('#errorBox').should('exist')

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3')
                cy.contains('Execute').click()
                cy.get('#errorBox').should('not.exist')
            })

            it(`step through valid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}segment cd C D')
                cy.contains('Execute').click()

                cy.get('#animateStepButton').should('have.text', '⟲').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateStepButton').should('have.text', '⟲')

                cy.get('#animateStepButton').should('have.text', '⟲').click()
                cy.contains('Execute').click()
                cy.get('#animateStepButton').should('have.text', '⟲')
            })

            it(`step through invalid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}invalid{enter}segment cd C D')

                cy.get('#animateStepButton').should('have.text', '⟲').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()

                // now we cannot progress
                cy.get('#animateStepButton').should('have.text', '➙')
                cy.get('#errorBox').should('exist')
            })

            it(`play all valid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}segment cd C D')

                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateAllButton').should('have.text', '⏸')
                cy.get('#animateStepButton').should('have.text', '➙')
                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶')
            })

            it(`play all invalid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}invalid{enter}segment cd C D')

                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateAllButton').should('have.text', '⏸')
                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶')

                // now we cannot progress
                cy.get('#animateStepButton').should('have.text', '➙')
                cy.get('#errorBox').should('exist')
            })

            it(`play valid input, stop by pause button [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}segment cd C D')

                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateAllButton').should('have.text', '⏸').click()
                cy.get('#animateAllButton').should('have.text', '▶')
            })

            it(`play valid input, stop by execute button [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}segment cd C D')

                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.contains('Execute').click()
                cy.get('#animateAllButton').should('have.text', '▶')
            })

            it(`play valid input, stop by step button [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}point C -3 -3{enter}point D 0 -1.3{enter}segment cd C D')

                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateAllButton').should('have.text', '▶')
            })
        })

        describe('German', function () {
            const langButtonId = '#chooseLangDe'

            it(`open and close help [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.contains('Hilfe').click()
                cy.get('#helpBoxDe').should('exist')
                cy.contains('OK').click()
                cy.get('#helpBoxDe').should('not.exist')
            })

            it(`default input does not yield error [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.contains('Ausführen').click()
                cy.get('#errorBox').should('not.exist')
            })

            it(`valid input does not yield error [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3')
                cy.contains('Ausführen').click()
                cy.get('#errorBox').should('not.exist')
            })

            it(`invalid input yields error [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}invalid')
                cy.contains('Ausführen').click()
                cy.get('#errorBox').should('exist')
                cy.contains('Schließen').click()
            })

            it(`with error box present, valid input and execute closes error box [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}invalid')
                cy.contains('Ausführen').click()
                cy.get('#errorBox').should('exist')

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3')
                cy.contains('Ausführen').click()
                cy.get('#errorBox').should('not.exist')
            })

            it(`step through valid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}strecke cd C D')
                cy.contains('Ausführen').click()

                cy.get('#animateStepButton').should('have.text', '⟲').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateStepButton').should('have.text', '⟲')

                cy.get('#animateStepButton').should('have.text', '⟲').click()
                cy.contains('Ausführen').click()
                cy.get('#animateStepButton').should('have.text', '⟲')
            })

            it(`step through invalid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}invalid{enter}strecke cd C D')

                cy.get('#animateStepButton').should('have.text', '⟲').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()

                // now we cannot progress
                cy.get('#animateStepButton').should('have.text', '➙')
                cy.get('#errorBox').should('exist')
            })

            it(`play all valid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}strecke cd C D')

                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateAllButton').should('have.text', '⏸')
                cy.get('#animateStepButton').should('have.text', '➙')
                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶')
            })

            it(`play all invalid input [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}invalid{enter}strecke cd C D')

                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateAllButton').should('have.text', '⏸')
                cy.get('#animateStepButton').should('have.text', '⟲')
                cy.get('#animateAllButton').should('have.text', '▶')

                // now we cannot progress
                cy.get('#animateStepButton').should('have.text', '➙')
                cy.get('#errorBox').should('exist')
            })

            it(`play valid input, stop by pause button [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}strecke cd C D')

                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateAllButton').should('have.text', '⏸').click()
                cy.get('#animateAllButton').should('have.text', '▶')
            })

            it(`play valid input, stop by execute button [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}strecke cd C D')

                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.contains('Ausführen').click()
                cy.get('#animateAllButton').should('have.text', '▶')
            })

            it(`play valid input, stop by step button [${viewportInfo.displayName}]`, function () {
                cy.viewport(viewportInfo.width, viewportInfo.height)
                cy.visit('http://localhost:5173/js-constri/')
                cy.get(langButtonId).click()

                cy.get('#input').type('{selectAll}{backspace}punkt C -3 -3{enter}punkt D 0 -1.3{enter}strecke cd C D')

                cy.get('#animateAllButton').should('have.text', '▶').click()
                cy.get('#animateStepButton').should('have.text', '➙').click()
                cy.get('#animateAllButton').should('have.text', '▶')
            })
        })

    })
})