export function normalizeEconomicObservation(raw = {}, fallback = {}) {
    const { country = {}, indicator = {}, date = null, value = null } = raw
    const year = Number(date)
    const numericValue = Number(value)

    if (!Number.isFinite(year) || !Number.isFinite(numericValue)) {
        return null
    }

    return {
        countryCode: (country.id || fallback.countryCode || 'WLD').toUpperCase(),
        countryName: country.value || fallback.countryName || 'World',
        indicator: indicator.id || fallback.indicator || '',
        indicatorName: indicator.value || fallback.indicatorName || '',
        year,
        value: numericValue,
    }
}

export function normalizeEconomicSeries(rawObservations = [], fallback = {}) {
    if (!Array.isArray(rawObservations)) return []

    const normalized = rawObservations
        .map((entry) => normalizeEconomicObservation(entry, fallback))
        .filter(Boolean)
        .sort((a, b) => a.year - b.year)

    return normalized
}

export function getLatestObservation(series = []) {
    if (!Array.isArray(series) || series.length === 0) return null
    return [...series].sort((a, b) => b.year - a.year)[0]
}

export function getSeriesByYear(series = []) {
    return [...series].map((entry) => ({
        year: entry.year,
        value: entry.value,
    }))
}
