import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useSanctions } from '../hooks/useSanctions'
import { intelligenceEvents } from '../lib/intelligenceData'
import { getCountryGDPGrowth, getInflation, getTradeIndicator } from '../services/worldBankApi'
import { normalizeEconomicSeries } from '../utils/economicNormalizer'

const COUNTRY_OPTIONS = [
    { code: 'IND', name: 'India' },
    { code: 'USA', name: 'United States' },
    { code: 'CHN', name: 'China' },
    { code: 'RUS', name: 'Russia' },
    { code: 'FRA', name: 'France' },
    { code: 'JPN', name: 'Japan' },
]

function latestValue(series = []) {
    if (!Array.isArray(series) || !series.length) return null
    const latest = [...series].sort((a, b) => b.year - a.year)[0]
    return Number.isFinite(latest?.value) ? latest.value : null
}

export default function ComparePage() {
    const { data: sanctions = [] } = useSanctions()

    const comparisonResults = useQueries({
        queries: COUNTRY_OPTIONS.map((country) => ({
            queryKey: ['compare', country.code],
            queryFn: async () => {
                const [gdpSeries, inflationSeries, tradeSeries] = await Promise.all([
                    getCountryGDPGrowth(country.code),
                    getInflation(country.code),
                    getTradeIndicator(country.code),
                ])

                const gdp = latestValue(normalizeEconomicSeries(gdpSeries, {
                    countryCode: country.code,
                    countryName: country.name,
                    indicator: 'NY.GDP.MKTP.KD.ZG',
                    indicatorName: 'GDP growth (annual %)',
                }))

                const inflation = latestValue(normalizeEconomicSeries(inflationSeries, {
                    countryCode: country.code,
                    countryName: country.name,
                    indicator: 'FP.CPI.TOTL.ZG',
                    indicatorName: 'Inflation, consumer prices (annual %)',
                }))

                const trade = latestValue(normalizeEconomicSeries(tradeSeries, {
                    countryCode: country.code,
                    countryName: country.name,
                    indicator: 'NE.TRD.GNFS.ZS',
                    indicatorName: 'Trade (% of GDP)',
                }))

                const signalCount = intelligenceEvents.filter((event) => event.country === country.name || event.countryCode === country.code).length
                const sanctionCount = sanctions.filter((entry) => (
                    String(entry.target ?? '').toLowerCase() === country.name.toLowerCase() ||
                    String(entry.target ?? '').toLowerCase().includes(country.name.toLowerCase())
                )).length

                const riskScore = Math.max(12, Math.min(95, Math.round(
                    signalCount * 14 + sanctionCount * 9 + (inflation && inflation > 4 ? 12 : 0) + (trade && trade > 50 ? 10 : 0) - (gdp && gdp > 3 ? 10 : 0)
                )))

                return {
                    ...country,
                    gdp,
                    inflation,
                    trade,
                    signalCount,
                    sanctionCount,
                    riskScore,
                }
            },
            staleTime: 1000 * 60 * 60,
            gcTime: 1000 * 60 * 60 * 12,
        })),
    })

    const rows = useMemo(() => comparisonResults.map((result) => result.data).filter(Boolean), [comparisonResults])
    const strongest = useMemo(() => [...rows].sort((a, b) => b.gdp - a.gdp)[0], [rows])

    return (
        <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 lg:px-12">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="text-[10px] tracking-[0.2em] text-[#7ee7d4]">GEOPOLIS COMPARE</div>
                    <h2 className="grotesk mt-2 text-4xl font-bold text-white md:text-5xl">Macro comparison</h2>
                </div>
                <div className="rounded-full border border-[#f9c66b]/30 bg-[#f9c66b]/10 px-3 py-2 text-[10px] tracking-[0.18em] text-[#f9c66b]">
                    {strongest ? `LEADING GDP: ${strongest.name}` : 'LOADING DATA'}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {rows.map((country) => (
                    <div key={country.code} className="glass-panel rounded-[26px] p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-[10px] tracking-[0.14em] text-white/60">{country.code}</div>
                                <h3 className="mt-2 text-[24px] font-semibold text-white">{country.name}</h3>
                            </div>
                            <div className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-3 py-1.5 text-[9px] tracking-[0.12em] text-[#7ee7d4]">
                                {country.riskScore > 70 ? 'ELEVATED' : country.riskScore > 45 ? 'WATCH' : 'STABLE'}
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/75 p-3">
                                <div className="flex items-center justify-between text-[10px] tracking-[0.14em] text-white/60">
                                    <span>GDP GROWTH</span>
                                    <span>{country.gdp !== null ? `${country.gdp.toFixed(2)}%` : '—'}</span>
                                </div>
                            </div>

                            <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/75 p-3">
                                <div className="flex items-center justify-between text-[10px] tracking-[0.14em] text-white/60">
                                    <span>INFLATION</span>
                                    <span>{country.inflation !== null ? `${country.inflation.toFixed(2)}%` : '—'}</span>
                                </div>
                            </div>

                            <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/75 p-3">
                                <div className="flex items-center justify-between text-[10px] tracking-[0.14em] text-white/60">
                                    <span>TRADE SHARE</span>
                                    <span>{country.trade !== null ? `${country.trade.toFixed(2)}%` : '—'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 rounded-[18px] border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center justify-between text-sm text-white/75">
                                <span>Risk score</span>
                                <span className="grotesk text-[28px] font-bold text-white">{country.riskScore}</span>
                            </div>
                            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className={`h-full rounded-full ${country.riskScore > 70 ? 'bg-[#ff8b7b]' : country.riskScore > 45 ? 'bg-[#f9c66b]' : 'bg-[#7ee7d4]'}`}
                                    style={{ width: `${country.riskScore}%` }}
                                />
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.12em] text-white/60">
                                <span>{country.signalCount} news signals</span>
                                <span>{country.sanctionCount} sanctions</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
