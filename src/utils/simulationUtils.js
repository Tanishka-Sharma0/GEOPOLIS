export const DEFAULT_SIMULATION_INPUTS = {
    tension: 50,
    tradeRestrictions: 30,
    sanctions: 30,
    militaryEscalation: 35,
    diplomaticCooperation: 55,
    economicGrowth: 3,
    energyPressure: 50,
    technologyDecoupling: 30,
}

export const PRESET_SCENARIOS = {
    BASELINE: { ...DEFAULT_SIMULATION_INPUTS },
    'HIGH TENSION': {
        tension: 82,
        tradeRestrictions: 62,
        sanctions: 68,
        militaryEscalation: 76,
        diplomaticCooperation: 38,
        economicGrowth: 1.4,
        energyPressure: 72,
        technologyDecoupling: 68,
    },
    'GLOBAL COOPERATION': {
        tension: 36,
        tradeRestrictions: 22,
        sanctions: 25,
        militaryEscalation: 28,
        diplomaticCooperation: 80,
        economicGrowth: 4.6,
        energyPressure: 33,
        technologyDecoupling: 24,
    },
    'TRADE WAR': {
        tension: 74,
        tradeRestrictions: 88,
        sanctions: 78,
        militaryEscalation: 46,
        diplomaticCooperation: 32,
        economicGrowth: -1.2,
        energyPressure: 63,
        technologyDecoupling: 72,
    },
    'REGIONAL ESCALATION': {
        tension: 68,
        tradeRestrictions: 58,
        sanctions: 55,
        militaryEscalation: 83,
        diplomaticCooperation: 29,
        economicGrowth: 0.7,
        energyPressure: 74,
        technologyDecoupling: 48,
    },
}

export function clampNumber(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max)
}

export function normalizeInputValue(value, min, max, fallback = 0) {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return fallback
    return clampNumber(numericValue, min, max)
}

export function coerceScenarioInputs(rawInputs = {}) {
    const merged = { ...DEFAULT_SIMULATION_INPUTS, ...rawInputs }

    return {
        tension: normalizeInputValue(merged.tension, 0, 100, 50),
        tradeRestrictions: normalizeInputValue(merged.tradeRestrictions, 0, 100, 30),
        sanctions: normalizeInputValue(merged.sanctions, 0, 100, 30),
        militaryEscalation: normalizeInputValue(merged.militaryEscalation, 0, 100, 35),
        diplomaticCooperation: normalizeInputValue(merged.diplomaticCooperation, 0, 100, 55),
        economicGrowth: normalizeInputValue(merged.economicGrowth, -5, 10, 3),
        energyPressure: normalizeInputValue(merged.energyPressure, 0, 100, 50),
        technologyDecoupling: normalizeInputValue(merged.technologyDecoupling, 0, 100, 30),
    }
}

export function parseScenarioParams(search = '') {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
    const raw = {
        tension: params.get('tension') ?? params.get('usChinaTension') ?? DEFAULT_SIMULATION_INPUTS.tension,
        tradeRestrictions: params.get('tradeRestrictions') ?? params.get('trade') ?? DEFAULT_SIMULATION_INPUTS.tradeRestrictions,
        sanctions: params.get('sanctions') ?? DEFAULT_SIMULATION_INPUTS.sanctions,
        militaryEscalation: params.get('militaryEscalation') ?? params.get('military') ?? DEFAULT_SIMULATION_INPUTS.militaryEscalation,
        diplomaticCooperation: params.get('diplomaticCooperation') ?? params.get('diplomacy') ?? DEFAULT_SIMULATION_INPUTS.diplomaticCooperation,
        economicGrowth: params.get('economicGrowth') ?? params.get('gdpGrowth') ?? DEFAULT_SIMULATION_INPUTS.economicGrowth,
        energyPressure: params.get('energyPressure') ?? params.get('energy') ?? DEFAULT_SIMULATION_INPUTS.energyPressure,
        technologyDecoupling: params.get('technologyDecoupling') ?? params.get('tech') ?? DEFAULT_SIMULATION_INPUTS.technologyDecoupling,
    }

    return coerceScenarioInputs(raw)
}

export function formatSignedNumber(value, digits = 2) {
    const numeric = Number(value)
    if (!Number.isFinite(numeric)) return '0.00'
    return `${numeric > 0 ? '+' : ''}${numeric.toFixed(digits)}`
}

export function getRiskBand(score) {
    if (score >= 75) return 'CRITICAL'
    if (score >= 50) return 'HIGH'
    if (score >= 25) return 'MODERATE'
    return 'LOW'
}

export function getDiplomaticBand(score) {
    if (score >= 70) return 'STRONG'
    if (score >= 45) return 'STABLE'
    if (score >= 25) return 'FRAGILE'
    return 'WEAK'
}

export function getAllianceBand(score) {
    if (score >= 70) return 'RESILIENT'
    if (score >= 45) return 'BALANCED'
    if (score >= 25) return 'FRAGILE'
    return 'AT RISK'
}
