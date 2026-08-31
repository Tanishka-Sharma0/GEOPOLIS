const WORLD_BANK_BASE_URL = 'https://api.worldbank.org/v2'

async function fetchWorldBankSeries(url) {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('World Bank request failed')
    }

    const payload = await response.json()
    if (!Array.isArray(payload) || payload.length < 2 || !Array.isArray(payload[1])) {
        return []
    }

    return payload[1]
}

export async function getWorldIndicator(indicator, options = {}) {
    const { date = '2000:2025', perPage = 100 } = options
    const url = `${WORLD_BANK_BASE_URL}/country/WLD/indicator/${indicator}?format=json&date=${date}&per_page=${perPage}`
    return fetchWorldBankSeries(url)
}

export async function getCountryIndicator(countryCode, indicator, options = {}) {
    const { date = '2000:2025', perPage = 100 } = options
    const normalizedCode = (countryCode || '').toUpperCase()
    if (!normalizedCode) {
        return []
    }

    const url = `${WORLD_BANK_BASE_URL}/country/${normalizedCode}/indicator/${indicator}?format=json&date=${date}&per_page=${perPage}`
    return fetchWorldBankSeries(url)
}

export async function getGlobalGDPGrowth() {
    return getWorldIndicator('NY.GDP.MKTP.KD.ZG')
}

export async function getCountryGDPGrowth(countryCode) {
    return getCountryIndicator(countryCode, 'NY.GDP.MKTP.KD.ZG')
}

export async function getInflation(countryCode = 'WLD') {
    if (countryCode && countryCode.toUpperCase() === 'WLD') {
        return getWorldIndicator('FP.CPI.TOTL.ZG')
    }

    return getCountryIndicator(countryCode, 'FP.CPI.TOTL.ZG')
}

export async function getTradeIndicator(countryCode = 'WLD') {
    if (countryCode && countryCode.toUpperCase() === 'WLD') {
        return getWorldIndicator('NE.TRD.GNFS.ZS')
    }

    return getCountryIndicator(countryCode, 'NE.TRD.GNFS.ZS')
}
