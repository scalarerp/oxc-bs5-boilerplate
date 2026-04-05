/**
 * Configurações gerais para gerenciamento de risco
 */
export interface RiskConfig {
  /** Capital inicial disponível (ex: 20000) */
  initialCapital: number
  /** Percentual de risco por trade (ex: 1.5 for 1.5%) */
  riskPerTradePercent: number
  /** Percentual de risco por dia (ex: 3 for 3%) */
  riskPerDayPercent: number
  /** Valor mínimo em R$ que deve ser arriscado por trade (ex: 150) */
  minRiskPerTrade: number
  /** Símbolo/código da moeda (opcional) */
  currency?: string
}

/**
 * Linha de resultado por semana (conforme as tabelas de simulação)
 */
export interface WeeklyResult {
  /** Identificador da semana (ex: "Semana 1" ou número) */
  week: string | number
  /** Saldo inicial da semana */
  startingBalance: number
  /** Valor de R por trade calculado (R$/trade) */
  rPerTrade: number
  /** Stop Full por dia (opcional) */
  stopFullDay?: number
  /** Perda Full semanal (caso haja stop full semanal) */
  lossFullWeekly?: number
  /** Valor conquistado na semana (ganho) */
  gained?: number
  /** Saldo final da semana */
  finalBalance: number
  /** Percentual relativo (ex: % do saldo inicial ou % perda) */
  percentOfInitial?: number
}

/**
 * Resultado da simulação completa de risco
 */
export interface SimulationResult {
  config: RiskConfig
  /** Entradas semana a semana da simulação */
  weeks: WeeklyResult[]
  /** Número máximo de semanas até zerar/atingir limite (opcional, calculado) */
  weeksToStop?: number
  /** Número estimado de trades de stop seguidos (opcional, calculado) */
  tradesStopInARow?: number
}

/** Pequenas utilidades de tipos usados pela UI/calculadora */
export interface RiskCalculationInputs {
  capital: number
  riskPerTradePercent: number
  riskPerDayPercent?: number
  minRiskPerTrade?: number
}

export type Currency = string
