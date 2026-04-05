import { RiskConfig, SimulationResult, WeeklyResult } from './types'

export interface SimOptions {
  /** Quantos dias de negociação por semana (padrão 5) */
  tradingDaysPerWeek?: number
  /** Limite máximo de semanas para simular (padrão 52) */
  maxWeeks?: number
  /** Valores de ganho por semana (opcional). Se fornecido, será somado à semana correspondente. */
  weeklyGains?: Array<number | undefined>
}

/**
 * Simula a sequência de semanas com stops full (perdas) conforme a planilha.
 * Regras principais:
 * - `rPerTrade` = max(startingBalance * riskPerTradePercent/100, minRiskPerTrade)
 * - `stopFullDay` = startingBalance * riskPerDayPercent/100 (se fornecido) senão = 2 * rPerTrade
 * - `lossFullWeekly` = stopFullDay * tradingDaysPerWeek
 * - `finalBalance` = startingBalance - lossFullWeekly + gained
 * O loop termina quando `finalBalance <= 0` ou quando atinge `maxWeeks`.
 */
export function simulateRisk(
  config: RiskConfig,
  options: SimOptions = {}
): SimulationResult {
  const tradingDaysPerWeek = options.tradingDaysPerWeek ?? 5
  const maxWeeks = options.maxWeeks ?? 52
  const weeklyGains = options.weeklyGains ?? []

  const weeks: WeeklyResult[] = []
  const initialCapital = config.initialCapital

  let startingBalance = initialCapital

  for (let i = 0; i < maxWeeks; i++) {
    const weekLabel = `Semana ${i + 1}`

    const rawR = (startingBalance * config.riskPerTradePercent) / 100
    const rPerTrade = Math.max(rawR, config.minRiskPerTrade)

    const stopFullDayFromPercent =
      (startingBalance * (config.riskPerDayPercent ?? 0)) / 100
    const stopFullDay =
      config.riskPerDayPercent !== undefined &&
      config.riskPerDayPercent !== null
        ? stopFullDayFromPercent
        : 2 * rPerTrade

    const lossFullWeekly = stopFullDay * tradingDaysPerWeek

    const gained = weeklyGains[i] ?? 0

    const finalBalance = startingBalance - lossFullWeekly + gained

    const percentOfInitial =
      ((initialCapital - finalBalance) / initialCapital) * 100

    const week: WeeklyResult = {
      week: weekLabel,
      startingBalance,
      rPerTrade,
      stopFullDay,
      lossFullWeekly,
      gained: gained || undefined,
      finalBalance,
      percentOfInitial,
    }

    weeks.push(week)

    if (finalBalance <= 0) {
      return {
        config,
        weeks,
        weeksToStop: weeks.length,
        tradesStopInARow: computeTradesStopInARow(weeks, tradingDaysPerWeek),
      }
    }

    startingBalance = finalBalance
  }

  return {
    config,
    weeks,
    weeksToStop: weeks.length,
    tradesStopInARow: computeTradesStopInARow(weeks, tradingDaysPerWeek),
  }
}

function computeTradesStopInARow(
  weeks: WeeklyResult[],
  tradingDaysPerWeek: number
) {
  // trades per day aproximado = stopFullDay / rPerTrade (por semana pode variar)
  let total = 0
  for (const w of weeks) {
    const perDay = Math.max(
      1,
      Math.round((w.stopFullDay ?? 0) / (w.rPerTrade || 1))
    )
    total += perDay * tradingDaysPerWeek
  }
  return total
}
