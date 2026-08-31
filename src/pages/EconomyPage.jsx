import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useGlobalGDPGrowth, useWorldInflation, useWorldTradeIndicator, useCountryGDPGrowth } from '../hooks/useEconomicData'
import { useSanctions } from '../hooks/useSanctions'
import { getCountryGDPGrowth } from '../services/worldBankApi'
import { normalizeEconomicSeries } from '../utils/economicNormalizer'
import EconomicImpactDashboard from '../components/economic/EconomicImpactDashboard'
import LoadingState from '../components/ui/LoadingState'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'

const COUNTRY_OPTIONS = [
    { code: 'IND', name: 'India' },
    { code: 'USA', name: 'United States' },
    { code: 'CHN', name: 'China' },
    { code: 'RUS', name: 'Russia' },
    { code: 'DEU', name: 'Germany' },
    { code: 'JPN', name: 'Japan' },
    { code: 'GBR', name: 'United Kingdom' },
    { code: 'FRA', name: 'France' },
]

const comparisonDefaults = [
    { code: 'IND', name: 'India' },
    { code: 'USA', name: 'United States' },
    { code: 'CHN', name: 'China' },
    { code: 'DEU', name: 'Germany' },
]

export default function EconomyPage() {
    const [selectedCountry, setSelectedCountry] = useState('IND')
    const [comparisonCountries, setComparisonCountries] = useState(comparisonDefaults)

    const { data: globalGdp = [], isLoading: globalLoading, isError: globalError } = useGlobalGDPGrowth()
    const { data: inflation = [], isLoading: inflationLoading, isError: inflationError } = useWorldInflation()
    const { data: trade = [], isLoading: tradeLoading, isError: tradeError } = useWorldTradeIndicator()
    const { data: selectedCountrySeries = [], isLoading: countryLoading, isError: countryError } = useCountryGDPGrowth(selectedCountry)
    const { data: sanctions = [], isLoading: sanctionsLoading, isError: sanctionsError } = useSanctions()

    const comparisonQueryResults = useQueries({
        queries: comparisonDefaults.map((country) => ({
            queryKey: ['economic', 'country', 'gdp-growth', country.code],
            queryFn: async () => {
                const observations = await getCountryGDPGrowth(country.code)
                return normalizeEconomicSeries(observations, {
                    countryCode: country.code,
                    countryName: country.name,
                    indicator: 'NY.GDP.MKTP.KD.ZG',
                    indicatorName: 'GDP growth (annual %)',
                })
            },
            staleTime: 1000 * 60 * 60 * 12,
            gcTime: 1000 * 60 * 60 * 24,
        })),
    })

    const countryData = Object.fromEntries(
        comparisonDefaults.map((country, index) => [country.code, comparisonQueryResults[index]?.data || []])
    )

    const isLoading = globalLoading || inflationLoading || tradeLoading || countryLoading || sanctionsLoading || comparisonQueryResults.some((result) => result.isLoading)
    const isError = globalError || inflationError || tradeError || countryError || sanctionsError || comparisonQueryResults.some((result) => result.isError)

    return (
        <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 lg:px-12">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] tracking-[0.2em] text-[#7ee7d4]">GEOPOLIS ECONOMY</div>
                    <h2 className="grotesk mt-2 text-4xl font-bold text-white md:text-5xl">Economy & Sanctions Pulse</h2>
                </div>
            </div>

            <div className="mb-6 glass-panel rounded-[28px] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-[10px] tracking-[0.16em] text-white/60">COUNTRY SELECTOR</div>
                        <div className="mt-2 text-sm text-white/70">Track national GDP growth using the World Bank.</div>
                    </div>
                    <select
                        value={selectedCountry}
                        onChange={(event) => setSelectedCountry(event.target.value)}
                        className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white"
                    >
                        {COUNTRY_OPTIONS.map((country) => (
                            <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <EconomicImpactDashboard
                globalGdp={globalGdp}
                inflation={inflation}
                trade={trade}
                countryData={{
                    ...countryData,
                    [selectedCountry]: selectedCountrySeries,
                }}
                sanctions={sanctions}
                selectedCountry={selectedCountry}
                comparisonCountries={comparisonCountries}
            />
        </div>
    )
}
