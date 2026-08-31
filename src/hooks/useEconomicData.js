import { useQuery } from '@tanstack/react-query'
import {
    getCountryGDPGrowth,
    getGlobalGDPGrowth,
    getInflation,
    getTradeIndicator,
} from '../services/worldBankApi'
import { normalizeEconomicSeries } from '../utils/economicNormalizer'

const normalizeWorldBankResponse = (data, fallback) => normalizeEconomicSeries(data, fallback)

export function useGlobalGDPGrowth() {
    return useQuery({
        queryKey: ['economic', 'world', 'gdp-growth'],
        queryFn: async () => {
            const observations = await getGlobalGDPGrowth()
            return normalizeWorldBankResponse(observations, {
                countryCode: 'WLD',
                countryName: 'World',
                indicator: 'NY.GDP.MKTP.KD.ZG',
                indicatorName: 'GDP growth (annual %)',
            })
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}

export function useWorldInflation() {
    return useQuery({
        queryKey: ['economic', 'world', 'inflation'],
        queryFn: async () => {
            const observations = await getInflation('WLD')
            return normalizeWorldBankResponse(observations, {
                countryCode: 'WLD',
                countryName: 'World',
                indicator: 'FP.CPI.TOTL.ZG',
                indicatorName: 'Inflation, consumer prices (annual %)',
            })
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}

export function useWorldTradeIndicator() {
    return useQuery({
        queryKey: ['economic', 'world', 'trade'],
        queryFn: async () => {
            const observations = await getTradeIndicator('WLD')
            return normalizeWorldBankResponse(observations, {
                countryCode: 'WLD',
                countryName: 'World',
                indicator: 'NE.TRD.GNFS.ZS',
                indicatorName: 'Trade (% of GDP)',
            })
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}

export function useCountryEconomicData(countryCode, indicator) {
    return useQuery({
        queryKey: ['economic', indicator, countryCode],
        enabled: Boolean(countryCode && indicator),
        queryFn: async () => {
            const observations = await getCountryGDPGrowth(countryCode)
            if (indicator === 'inflation') {
                const inflationSeries = await getInflation(countryCode)
                return normalizeWorldBankResponse(inflationSeries, {
                    countryCode,
                    countryName: countryCode,
                    indicator: 'FP.CPI.TOTL.ZG',
                    indicatorName: 'Inflation, consumer prices (annual %)',
                })
            }

            return normalizeWorldBankResponse(observations, {
                countryCode,
                countryName: countryCode,
                indicator: 'NY.GDP.MKTP.KD.ZG',
                indicatorName: 'GDP growth (annual %)',
            })
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}

export function useCountryGDPGrowth(countryCode) {
    return useQuery({
        queryKey: ['economic', 'country', 'gdp-growth', countryCode],
        enabled: Boolean(countryCode),
        queryFn: async () => {
            const observations = await getCountryGDPGrowth(countryCode)
            return normalizeWorldBankResponse(observations, {
                countryCode,
                countryName: countryCode,
                indicator: 'NY.GDP.MKTP.KD.ZG',
                indicatorName: 'GDP growth (annual %)',
            })
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}

export function useCountryInflation(countryCode) {
    return useQuery({
        queryKey: ['economic', 'country', 'inflation', countryCode],
        enabled: Boolean(countryCode),
        queryFn: async () => {
            const observations = await getInflation(countryCode)
            return normalizeWorldBankResponse(observations, {
                countryCode,
                countryName: countryCode,
                indicator: 'FP.CPI.TOTL.ZG',
                indicatorName: 'Inflation, consumer prices (annual %)',
            })
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}
