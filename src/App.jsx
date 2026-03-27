import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

import { HelpDe, HelpEn } from './Help'
import { handleInput } from './logic/inputHandler'
import { transform } from './transformer'
import { registry } from './logic/registry'

const calculateRanges = (pointDataX, pointDataY, aspectRatio) => {
    const maxX = Math.max(...pointDataX)
    let minX = Math.min(...pointDataX)
    let internalX = maxX - minX

    const maxY = Math.max(...pointDataY)
    let minY = Math.min(...pointDataY)
    let internalY = maxY - minY

    if (pointDataX.length === 1) {
        internalX = 2
        minX = pointDataX[0] - 1
        internalY = 2
        minY = pointDataY[0] - 1
    }

    const internalAspectRatio = internalY / internalX

    if (aspectRatio > internalAspectRatio) {
        internalY *= aspectRatio / internalAspectRatio
    }
    else {
        internalX *= internalAspectRatio / aspectRatio
    }

    const xRange = [minX - 0.1 * internalX, minX + 1.2 * internalX]
    const yRange = [minY - 0.1 * internalY, minY + 1.2 * internalY]

    // now center ranges around input points
    const naiveXRange = [minX, maxX]
    const naiveYRange = [minY, maxY]

    const zip = (a, b) => a.map((k, i) => [k, b[i]])

    for (const [actual, naive] of zip([xRange, yRange], [naiveXRange, naiveYRange])) {
        const leftDiff = actual[0] - naive[0]
        const rightDiff = naive[1] - actual[1]
        actual[0] -= (leftDiff - rightDiff) * 0.5
        actual[1] -= (leftDiff - rightDiff) * 0.5
    }

    return [xRange, yRange]
}

const strings = {}
strings[registry.langs.de] = {
    close: 'Schließen',
    defaultInput: 'punkt A 1 2\npunkt B 3 6\nstrecke ab A B',
    execute: 'Ausführen',
    help: 'Hilfe',
}
strings[registry.langs.en] = {
    close: 'Close',
    defaultInput: 'point C 0 1\ncircle k C 3',
    execute: 'Execute',
    help: 'Help',
}

const ErrorBox = ({ errorMessage, closeButtonLabel, closeAction }) => {
    return <>
        <div className="smallOverlayBox">
            <div className="overlayContent">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h4>{errorMessage}</h4>
                </div>
                <div>
                    <button id="error_CloseButton" onClick={closeAction}>{closeButtonLabel}</button>
                </div>
            </div>
        </div>
    </>
}

function App() {
    const [lang, setLang] = useState(registry.langs.de)
    const [showHelp, setShowHelp] = useState(false)
    const [code, setCode] = useState(strings[lang].defaultInput)
    const [plotlyData, setPlotlyData] = useState([])
    const [auxPointsData, setAuxPointsData] = useState({ x: [], y: [] })
    const [errorMessage, setErrorMessage] = useState('')

    const execute = () => {
        const state = handleInput(lang, code)

        if (state.isValid) {
            const items = state?.collection
            const [newPlotlyData, newAuxPointsData] = transform(items)

            setPlotlyData(newPlotlyData ?? [])
            setAuxPointsData(newAuxPointsData ?? { x: [], y: [] })
            setErrorMessage('')
        }
        else {
            setPlotlyData([])
            setAuxPointsData({ x: [], y: [] })
            setErrorMessage(state.errorMessage)
        }
    }

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(Math.max(window.innerWidth, 1280))
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    const availableHeight = Math.floor(height * 0.9) - 120
    const availableWidth = Math.floor(width * 0.8)

    const aspectRatio = availableHeight / availableWidth

    const [xRange, yRange] = (plotlyData.length > 0)
        ? calculateRanges(plotlyData[0].x.concat(auxPointsData.x), plotlyData[0].y.concat(auxPointsData.y), aspectRatio)
        : calculateRanges([0, 5], [0, 5], aspectRatio)

    const handleLanguageButtonPressed = newLang => {
        setLang(newLang)
        setCode(strings[newLang].defaultInput)
    }

    return (
        <>
            {showHelp && lang === registry.langs.de && <HelpDe closeAction={() => setShowHelp(false)} />}
            {showHelp && lang === registry.langs.en && <HelpEn closeAction={() => setShowHelp(false)} />}
            {errorMessage.length !== 0 && <ErrorBox errorMessage={errorMessage} closeButtonLabel={strings[lang].close} closeAction={() => setErrorMessage('')} />}
            <div style={{ textAlign: 'right' }}>
                <button onClick={() => handleLanguageButtonPressed(registry.langs.de)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 5 3"><path d="M0 0h5v3H0z" /><path fill="#D00" d="M0 1h5v2H0z" /><path fill="#FFCE00" d="M0 2h5v1H0z" /></svg>
                </button>
                <button onClick={() => handleLanguageButtonPressed(registry.langs.en)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 60 30"><clipPath id="a"><path d="M0 0v30h60V0z" /></clipPath><clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z" /></clipPath><g clipPath="url(#a)"><path d="M0 0v30h60V0z" fill="#012169" /><path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" /><path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4" /><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" /><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" /></g></svg>
                </button>
            </div>
            <div>
                <Plot
                    data={plotlyData}
                    layout={{
                        margin: {
                            l: Math.floor(0.03 * availableWidth),
                            t: Math.floor(0.03 * availableHeight),
                            r: Math.floor(0.03 * availableWidth),
                            b: Math.floor(0.03 * availableHeight),
                        },
                        legend: {
                            itemclick: false,
                            itemdoubleclick: false,
                        },
                        modebar: {
                            remove: ['autoScale2d', 'lasso2d', 'pan2d', 'select2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d'],
                        },
                        showlegend: false,
                        autosize: false,
                        width: 0.94 * availableWidth,
                        height: 0.94 * availableHeight,
                        xaxis: {
                            zeroline: false,
                            showgrid: false, // relevant property: dtick
                            showticklabels: false,
                            range: xRange,
                        },
                        yaxis: {
                            zeroline: false,
                            showgrid: false, // relevant property: dtick
                            showticklabels: false,
                            range: yRange,
                        },
                    }}
                    config={{
                        doubleClick: false,
                        responsive: true,
                    }}
                />
            </div>
            <div>
                <textarea value={code} onChange={e => setCode(e.target.value)} />
            </div>
            <div>
                <button onClick={() => execute()}>{strings[lang].execute}</button>
                <button onClick={() => setShowHelp(true)}>{strings[lang].help}</button>
            </div>
        </>
    )
}

export default App
