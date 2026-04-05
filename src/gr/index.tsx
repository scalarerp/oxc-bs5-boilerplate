import React, { useMemo, useState } from 'react'

import { simulateRisk, SimOptions } from './simulation'
import { RiskConfig } from './types'

const GerenciamentoDeRisco: React.FC = () => {
  const [capital, setCapital] = useState<number>(20000)
  const [riskPerTrade, setRiskPerTrade] = useState<number>(1.5)
  const [riskPerDay, setRiskPerDay] = useState<number>(3)
  const [minRiskPerTrade, setMinRiskPerTrade] = useState<number>(150)
  const [tradingDaysPerWeek, setTradingDaysPerWeek] = useState<number>(5)
  const [maxWeeks, setMaxWeeks] = useState<number>(10)

  const config: RiskConfig = {
    initialCapital: capital,
    riskPerTradePercent: riskPerTrade,
    riskPerDayPercent: riskPerDay,
    minRiskPerTrade: minRiskPerTrade,
  }

  const options: SimOptions = {
    tradingDaysPerWeek,
    maxWeeks,
  }

  const result = useMemo(
    () => simulateRisk(config, options),
    [
      capital,
      riskPerTrade,
      riskPerDay,
      minRiskPerTrade,
      tradingDaysPerWeek,
      maxWeeks,
    ]
  )

  return (
    <div style={{ padding: 12 }}>
      <h3>Gerenciamento de Risco (Simulação)</h3>

      <div>
        <label>Capital inicial</label>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
        />

        <label>% Risco por trade</label>
        <input
          type="number"
          step="0.1"
          value={riskPerTrade}
          onChange={(e) => setRiskPerTrade(Number(e.target.value))}
        />

        <label>% Risco por dia</label>
        <input
          type="number"
          step="0.1"
          value={riskPerDay}
          onChange={(e) => setRiskPerDay(Number(e.target.value))}
        />

        <label>Min R$ por trade</label>
        <input
          type="number"
          value={minRiskPerTrade}
          onChange={(e) => setMinRiskPerTrade(Number(e.target.value))}
        />

        <label>Dias de pregão/semana</label>
        <input
          type="number"
          value={tradingDaysPerWeek}
          onChange={(e) => setTradingDaysPerWeek(Number(e.target.value))}
        />

        <label>Max semanas</label>
        <input
          type="number"
          value={maxWeeks}
          onChange={(e) => setMaxWeeks(Number(e.target.value))}
        />
      </div>

      <div>
        <strong>Resumo:</strong>
        <div>Semanas simuladas: {result.weeks.length}</div>
        <div>Weeks to stop (estimado): {result.weeksToStop}</div>
        <div>Trades stop seguidos (estimado): {result.tradesStopInARow}</div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Semana</th>
            <th>Saldo inicial</th>
            <th>R/trade</th>
            <th>Stop dia</th>
            <th>Perda semanal</th>
            <th>Saldo final</th>
            <th>% perda</th>
          </tr>
        </thead>
        <tbody>
          {result.weeks.map((w, idx) => (
            <tr key={idx}>
              <td>{w.week}</td>
              <td>{w.startingBalance.toFixed(2)}</td>
              <td>{w.rPerTrade.toFixed(2)}</td>
              <td>{(w.stopFullDay ?? 0).toFixed(2)}</td>
              <td>{(w.lossFullWeekly ?? 0).toFixed(2)}</td>
              <td>{w.finalBalance.toFixed(2)}</td>
              <td>{(w.percentOfInitial ?? 0).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GerenciamentoDeRisco
