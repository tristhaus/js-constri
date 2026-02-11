import { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

import './App.css'

import { handleInput } from './logic/inputHandler'
import { transform } from './transformer'

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

    return [xRange, yRange]
}

function App() {
    const [code, setCode] = useState('punkt A 1 2\npunkt B 3 6\nstrecke ab A B')
    const [plotlyData, setPlotlyData] = useState([])

    const execute = () => {
        const items = handleInput(code)

        if (items !== null) {
            const newPlotlyData = transform(items)

            if (newPlotlyData !== null) {
                setPlotlyData(newPlotlyData)
            }
        }
        else {
            setPlotlyData([])
        }
    }

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    const availableHeight = Math.floor(height * 0.9) - 120
    const availableWidth = Math.floor(width * 0.8)

    const aspectRatio = availableHeight / availableWidth

    const [xRange, yRange] = (plotlyData.length > 0)
        ? calculateRanges(plotlyData[0].x, plotlyData[0].y, aspectRatio)
        : calculateRanges([0, 5], [0, 5], aspectRatio)

    return (
        <>
            <div>
                <Plot
                    data={plotlyData}
                    layout={{
                        margin: {
                            l: Math.floor(0.03 * availableWidth),
                            t: Math.floor(0.03 * availableHeight),
                            r: Math.floor(0.03 * availableWidth),
                            b: Math.floor(0.03 * availableHeight),
                        },                        legend: {
                            itemclick: false,
                            itemdoubleclick: false,
                        },
                        modebar: {
                            remove: ['autoScale2d', 'lasso2d', 'pan2d', 'select2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d'],
                        },
                        showlegend: false,
                        autosize: false,
                        width: availableWidth,
                        height: availableHeight,
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
                        }
                    }}
                    config={{
                        doubleClick: 'reset',
                        responsive: true,
                    }}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div>
                <textarea value={code} onChange={e => setCode(e.target.value)} />
                <button onClick={() => execute()}>Ausführen</button>
            </div>
        </>
    )
}

export default App
