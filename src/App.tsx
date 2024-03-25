import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Seriesgraph from './components/Seriesgraph'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src='https://api.boresite.io/storage/v1/object/public/assessment/demo-co.png' className="logo" alt="Vite logo" />
        </a>
      </div>
    <Seriesgraph />
    </>
  )
}

export default App
