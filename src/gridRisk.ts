export interface GridRiskInputs {
  totalEntries: number
  levelPoints: number
  valuePerPoint: number // ex: R$ 0.20 para mini-índice B3
  quantityPerEntry?: number // quantidade de contratos/lotes por entrada (default: 1)
  takeProfitMultiplier?: number // multiplicador para TP em relação a levelPoints (default: 2)
}

export interface GridRiskResult {
  totalContracts: number
  totalRiskPoints: number
  totalFinancialRisk: number // O valor total do stop caso não haja gain
  stopLossDistance: number // Distância do stop em relação à primeira entrada
  tpRoundsNeededForStop: number // Quantas rodadas de TP (todos os contratos juntos) são necessárias para cobrir o stop
  breakdown: {
    entryNumber: number
    distanceFromFirstEntry: number
    contracts: number
    lossPoints: number
    financialLoss: number
    gainPoints?: number
    gainFinancial?: number
  }[]
}

/**
 * Calcula o risco total de um grid (compra ou venda).
 * O cálculo assume que, caso a operação vá contra, todas as entradas são ativadas
 * e o Stop Loss final é posicionado uma distância de `levelPoints` após a última entrada.
 */
export function calculateGridRisk(inputs: GridRiskInputs): GridRiskResult {
  const {
    totalEntries,
    levelPoints,
    valuePerPoint,
    quantityPerEntry = 1,
    takeProfitMultiplier = 2,
  } = inputs

  if (!Number.isInteger(totalEntries) || totalEntries <= 0) {
    throw new Error('totalEntries must be a positive integer')
  }
  if (!Number.isFinite(levelPoints) || levelPoints <= 0) {
    throw new Error('levelPoints must be a positive number')
  }
  if (!Number.isFinite(valuePerPoint) || valuePerPoint < 0) {
    throw new Error('valuePerPoint must be a non-negative number')
  }

  // O stop loss assumido é colocado "levelPoints" após a última entrada
  // Exemplo: 3 entradas a cada 100 pontos -> distâncias 0, 100, 200. O stop fica em 300.
  const stopLossDistance = totalEntries * levelPoints

  let totalRiskPoints = 0
  let totalFinancialRisk = 0
  let totalContracts = 0
  let totalPotentialGain = 0

  const breakdown = []

  for (let i = 0; i < totalEntries; i++) {
    const entryDistance = i * levelPoints
    const lossPoints = stopLossDistance - entryDistance
    const financialLoss = lossPoints * valuePerPoint * quantityPerEntry

    const gainPoints = takeProfitMultiplier * levelPoints
    const gainFinancial = gainPoints * valuePerPoint * quantityPerEntry

    totalContracts += quantityPerEntry
    totalRiskPoints += lossPoints * quantityPerEntry
    totalFinancialRisk += financialLoss
    totalPotentialGain += gainFinancial

    breakdown.push({
      entryNumber: i + 1,
      distanceFromFirstEntry: entryDistance,
      contracts: quantityPerEntry,
      lossPoints,
      financialLoss,
      gainPoints,
      gainFinancial,
    })
  }

  // Ganho total por uma rodada completa de TP (todos os contratos juntos)
  const gainPerTpRound =
    takeProfitMultiplier * levelPoints * valuePerPoint * totalContracts
  const tpRoundsNeededForStop =
    gainPerTpRound > 0
      ? Math.ceil(totalFinancialRisk / gainPerTpRound)
      : Infinity

  return {
    totalContracts,
    totalRiskPoints,
    totalFinancialRisk,
    stopLossDistance,
    tpRoundsNeededForStop,
    breakdown,
  }
}

// ==========================================
// Exemplo de uso
// ==========================================
const myGrid: GridRiskInputs = {
  totalEntries: 4, // 1 entrada principal + 1 sub-operação
  levelPoints: 250, // Preço médio ou defesa a cada 100 pontos
  valuePerPoint: 0.2, // R$ 0.20 por ponto (ex. Mínicontrato de Índice - WIN)
  quantityPerEntry: 1, // 1 contrato por nível
  takeProfitMultiplier: 2, // TP a 2x levelPoints
}

const riskDetails = calculateGridRisk(myGrid)

console.log('--- Resumo do Risco do Grid (Compra ou Venda) ---')
console.log(`Contratos totais acumulados: ${riskDetails.totalContracts}`)
console.log(
  `Distância máxima (Stop Loss): ${riskDetails.stopLossDistance} pontos da origem`
)
console.log(
  `Pontos totais perdidos (soma das perdas de cada contrato): ${riskDetails.totalRiskPoints} pontos`
)
console.log(
  `VALOR TOTAL DO STOP (Risco Financeiro): R$ ${riskDetails.totalFinancialRisk.toFixed(2)}`
)
console.log(
  `Gains (rodadas TP) necessários para cobrir o Stop: ${riskDetails.tpRoundsNeededForStop}`
)
console.log('\n--- Detalhamento por Entrada ---')
console.table(riskDetails.breakdown)
