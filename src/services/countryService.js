import { countryMeta, intelligenceEvents } from '../lib/intelligenceData'
import { getCountryGDPGrowth, getInflation, getTradeIndicator } from './worldBankApi'
import { getTreatiesByCountry } from './treatyService'
import { getLatestObservation, normalizeEconomicSeries } from '../utils/economicNormalizer'

const flagMap = {
    India: '🇮🇳',
    Ukraine: '🇺🇦',
    Israel: '🇮🇱',
    Sudan: '🇸🇩',
    China: '🇨🇳',
    Russia: '🇷🇺',
    'United States': '🇺🇸',
    France: '🇫🇷',
    Japan: '🇯🇵',
    Germany: '🇩🇪',
    'United Kingdom': '🇬🇧',
    Canada: '🇨🇦',
    Brazil: '🇧🇷',
    Australia: '🇦🇺',
    'South Korea': '🇰🇷',
    'Saudi Arabia': '🇸🇦',
    'United Arab Emirates': '🇦🇪',
}

function getRiskStatus(score) {
    if (score >= 75) return 'Critical'
    if (score >= 55) return 'Elevated'
    if (score >= 35) return 'Watch'
    return 'Stable'
}

function buildCountryList() {
    return Object.values(countryMeta).map((country) => ({
        ...country,
        flag: flagMap[country.name] || '🌍',
    }))
}

function getCountryNews(name, code) {
    return intelligenceEvents
        .filter((event) => event.country === name || event.countryCode === code)
        .slice(0, 3)
}

function estimateRiskScore({ eventCount, gdpGrowth, inflation, trade }) {
    const normalizedTrade = typeof trade?.value === 'number' ? trade.value : 0
    const normalizedInflation = typeof inflation?.value === 'number' ? inflation.value : 0
    const normalizedGrowth = typeof gdpGrowth?.value === 'number' ? gdpGrowth.value : 0

    let score = eventCount * 14 + 20
    score += normalizedInflation > 6 ? 18 : normalizedInflation > 3 ? 10 : 0
    score += normalizedTrade > 60 ? 12 : normalizedTrade > 35 ? 6 : 0
    score -= normalizedGrowth > 4 ? 10 : normalizedGrowth > 0 ? 5 : 0

    return Math.max(12, Math.min(95, Math.round(score)))
}

function withSeriesFallback(series, fallback) {
    return normalizeEconomicSeries(series, fallback)
}

async function buildCountryProfile(country) {
    const [gdpSeries, inflationSeries, tradeSeries, treatyList] = await Promise.all([
        getCountryGDPGrowth(country.code),
        getInflation(country.code),
        getTradeIndicator(country.code),
        getTreatiesByCountry(country.name),
    ])

    const gdpGrowth = getLatestObservation(withSeriesFallback(gdpSeries, {
        countryCode: country.code,
        countryName: country.name,
        indicator: 'NY.GDP.MKTP.KD.ZG',
        indicatorName: 'GDP growth (annual %)',
    }))

    const inflation = getLatestObservation(withSeriesFallback(inflationSeries, {
        countryCode: country.code,
        countryName: country.name,
        indicator: 'FP.CPI.TOTL.ZG',
        indicatorName: 'Inflation, consumer prices (annual %)',
    }))

    const trade = getLatestObservation(withSeriesFallback(tradeSeries, {
        countryCode: country.code,
        countryName: country.name,
        indicator: 'NE.TRD.GNFS.ZS',
        indicatorName: 'Trade (% of GDP)',
    }))

    const eventCount = getCountryNews(country.name, country.code).length
    const riskScore = estimateRiskScore({ eventCount, gdpGrowth, inflation, trade })

    return {
        ...country,
        flag: flagMap[country.name] || '🌍',
        status: getRiskStatus(riskScore),
        riskScore,
        treatyCount: treatyList.length,
        news: getCountryNews(country.name, country.code),
        indicators: {
            gdp: gdpGrowth,
            inflation,
            trade,
        },
    }
}

export async function getCountries() {
    const catalog = buildCountryList()
    const profiles = await Promise.all(catalog.map((country) => buildCountryProfile(country)))
    return profiles.sort((a, b) => b.riskScore - a.riskScore)
}

export async function getCountryByCode(code) {
    const normalized = String(code || '').toUpperCase()
    if (!normalized) return null

    const match = buildCountryList().find((country) => country.code.toUpperCase() === normalized)
    if (!match) return null

    return buildCountryProfile(match)
}

export async function getCountryDetail(code) {
    return getCountryByCode(code)
}
