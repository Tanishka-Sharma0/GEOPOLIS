import { getLatestObservation } from './economicNormalizer'

export function calculatePrePostIndicatorComparison({ eventYear, series = [], yearsBefore = 3, yearsAfter = 3 }) {
    if (!Number.isFinite(Number(eventYear)) || !Array.isArray(series) || series.length === 0) {
        return {
            beforeAverage: null,
            afterAverage: null,
            delta: null,
        }
    }

    const beforeValues = series
        .filter((entry) => Number(entry.year) >= Number(eventYear) - yearsBefore && Number(entry.year) < Number(eventYear))
        .map((entry) => Number(entry.value))
        .filter((value) => Number.isFinite(value))

    const afterValues = series
        .filter((entry) => Number(entry.year) > Number(eventYear) && Number(entry.year) <= Number(eventYear) + yearsAfter)
        .map((entry) => Number(entry.value))
        .filter((value) => Number.isFinite(value))

    const beforeAverage = beforeValues.length ? beforeValues.reduce((sum, value) => sum + value, 0) / beforeValues.length : null
    const afterAverage = afterValues.length ? afterValues.reduce((sum, value) => sum + value, 0) / afterValues.length : null

    return {
        beforeAverage,
        afterAverage,
        delta: beforeAverage !== null && afterAverage !== null ? afterAverage - beforeAverage : null,
    }
}

export function calculateEconomicRisk({ gdpGrowthSeries = [], inflationSeries = [], tradeSeries = [], sanctionsCount = 0 }) {
    const latestGdp = getLatestObservation(gdpGrowthSeries)?.value ?? null
    const latestInflation = getLatestObservation(inflationSeries)?.value ?? null
    const latestTrade = getLatestObservation(tradeSeries)?.value ?? null

    let score = 0

    if (latestGdp === null || Number.isNaN(Number(latestGdp))) {
        score += 15
    } else if (Number(latestGdp) < 1) {
        score += 25
    } else if (Number(latestGdp) < 3) {
        score += 12
    } else {
        score -= 6
    }

    if (latestInflation === null || Number.isNaN(Number(latestInflation))) {
        score += 10
    } else if (Number(latestInflation) > 6) {
        score += 25
    } else if (Number(latestInflation) > 3) {
        score += 12
    }

    if (latestTrade === null || Number.isNaN(Number(latestTrade))) {
        score += 8
    } else if (Number(latestTrade) > 45) {
        score += 10
    }

    score += Math.min(sanctionsCount * 6, 24)

    if (score >= 55) return 'HIGH PRESSURE'
    if (score >= 30) return 'MODERATE'
    return 'LOW PRESSURE'
}
