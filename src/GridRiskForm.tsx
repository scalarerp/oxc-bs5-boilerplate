import { useState, FormEvent } from 'react'

import { calculateGridRisk, GridRiskInputs, GridRiskResult } from './gridRisk'

const GridRiskForm = () => {
  const [inputs, setInputs] = useState<GridRiskInputs>({
    totalEntries: 4,
    levelPoints: 250,
    valuePerPoint: 0.2,
    quantityPerEntry: 1,
    takeProfitMultiplier: 2,
  })

  const [result, setResult] = useState<GridRiskResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      // Conversão dos inputs para números caso venham como string do form
      const validInputs: GridRiskInputs = {
        totalEntries: Number(inputs.totalEntries),
        levelPoints: Number(inputs.levelPoints),
        valuePerPoint: Number(inputs.valuePerPoint),
        quantityPerEntry: Number(inputs.quantityPerEntry),
        takeProfitMultiplier: Number(inputs.takeProfitMultiplier) || 2,
      }

      const res = calculateGridRisk(validInputs)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
      setResult(null)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  return (
    <div>
      <div className="fs-2">Calculadora de Risco de Grid</div>
      <div className="d-flex gap-3">
        <div>
          <form onSubmit={handleSubmit} className="d-flex gap-3 flex-column">
            <div className="d-flex flex-column">
              <label htmlFor="totalEntries">Total de Entradas:</label>
              <input
                type="number"
                id="totalEntries"
                name="totalEntries"
                value={inputs.totalEntries}
                onChange={handleChange}
                min="1"
                step="1"
              />
            </div>

            <div className="d-flex flex-column">
              <label htmlFor="levelPoints">Pontos por Nível:</label>
              <input
                type="number"
                id="levelPoints"
                name="levelPoints"
                value={inputs.levelPoints}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="d-flex flex-column">
              <label htmlFor="valuePerPoint">Valor por Ponto (R$):</label>
              <input
                type="number"
                id="valuePerPoint"
                name="valuePerPoint"
                value={inputs.valuePerPoint}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="d-flex flex-column">
              <label htmlFor="quantityPerEntry">Contratos por Entrada:</label>
              <input
                type="number"
                id="quantityPerEntry"
                name="quantityPerEntry"
                value={inputs.quantityPerEntry}
                onChange={handleChange}
                min="1"
                step="1"
              />
            </div>

            <div className="d-flex flex-column">
              <label htmlFor="takeProfitMultiplier">
                Multiplicador TP (x levelPoints):
              </label>
              <input
                type="number"
                id="takeProfitMultiplier"
                name="takeProfitMultiplier"
                value={inputs.takeProfitMultiplier as number}
                onChange={handleChange}
                min="0.01"
                step="0.01"
              />
            </div>

            <button
              type="submit"
              style={{ padding: '10px', cursor: 'pointer', marginTop: '10px' }}
            >
              Calcular
            </button>
          </form>

          {error && (
            <div style={{ color: 'red', marginTop: '20px' }}>Erro: {error}</div>
          )}
        </div>
        <div>
          {result && (
            <div style={{ marginTop: '30px' }}>
              <h3>Resumo do Risco</h3>
              <p>
                <strong>Contratos Totais:</strong> {result.totalContracts}
              </p>
              <p>
                <strong>Distância do Stop (Pontos):</strong>{' '}
                {result.stopLossDistance}
              </p>
              <p>
                <strong>Total de Pontos Perdidos:</strong>{' '}
                {result.totalRiskPoints}
              </p>
              <p>
                <strong>Valor Total do Stop (Risco Financeiro):</strong> R${' '}
                {result.totalFinancialRisk.toFixed(2)}
              </p>
              <p>
                <strong>
                  Gains necessários para cobrir o Stop (rodadas TP):
                </strong>{' '}
                {Number.isFinite(result.tpRoundsNeededForStop)
                  ? result.tpRoundsNeededForStop
                  : '∞'}
              </p>

              <h4>Detalhamento por Entrada:</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Entrada nº</th>
                    <th>Distância da 1ª</th>
                    <th>Qtd Contratos</th>
                    <th>Pontos Perdidos</th>
                    <th>Prejuízo (R$)</th>
                    <th>Pontos Gain</th>
                    <th>Gain (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((item) => (
                    <tr key={item.entryNumber}>
                      <td>{item.entryNumber}</td>
                      <td>{item.distanceFromFirstEntry}</td>
                      <td>{item.contracts}</td>
                      <td>{item.lossPoints}</td>
                      <td>{item.financialLoss.toFixed(2)}</td>
                      <td>{item.gainPoints ?? '-'} </td>
                      <td>
                        {item.gainFinancial
                          ? item.gainFinancial.toFixed(2)
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GridRiskForm
