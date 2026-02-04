import { useState } from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <h1>Vite + React POC</h1>
            <div>This is a placeholder for the eventual page.</div>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
                </button>
            </div>
        </>
    )
}

export default App
