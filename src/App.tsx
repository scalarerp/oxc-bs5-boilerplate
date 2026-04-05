import { useState } from 'react'

import GerenciamentoDeRisco from './gr/index.tsx'
import GridRiskForm from './GridRiskForm'

const App = () => {
  const [tab, setTab] = useState<1 | 2>(1)
  return (
    <div>
      <div className="d-flex gap-3">
        <button onClick={() => setTab(1)}>Gerenciamento de Risco</button>
        <button onClick={() => setTab(2)}>Formulário de Risco</button>
      </div>

      {tab === 1 && <GerenciamentoDeRisco />}
      {tab === 2 && <GridRiskForm />}
    </div>
  )
}

export default App
