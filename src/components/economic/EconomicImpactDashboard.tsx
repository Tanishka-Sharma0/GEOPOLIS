import { useMemo } from 'react'
import CountryComparison from './CountryComparison'
import CountryGDPChart from './CountryGDPChart'
import EconomicPulseCards from './EconomicPulseCards'
import GlobalGDPChart from './GlobalGDPChart'
import PrePostComparison from './PrePostComparison'
import SanctionsTracker from './SanctionsTracker'
import { calculateEconomicRisk } from '../../utils/economicRiskEngine'
import SourceBadge from '../ui/SourceBadge'

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

export default function EconomicImpactDashboard({
    globalGdp,
    inflation,
    trade,
    countryData,
    sanctions,
    selectedCountry,
    comparisonCountries,
}: {
    globalGdp: Array<{ year: number; value: number }>
    inflation: Array<{ year: number; value: number }>
    trade: Array<{ year: number; value: number }>
    countryData: Record<string, Array<{ year: number; value: number }>>
    sanctions: Array<any>
    selectedCountry: string
    comparisonCountries: Array<{ code: string; name: string }>
}) {
    const countrySeries = countryData[selectedCountry] || []
    const signal = useMemo(
        () =>
            calculateEconomicRisk({
                gdpGrowthSeries: globalGdp,
                inflationSeries: inflation,
                tradeSeries: trade,
                sanctionsCount: sanctions.length,
            }),
        [globalGdp, inflation, sanctions.length, trade]
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] tracking-[0.18em] text-[#7ee7d4]">ECONOMIC IMPACT DASHBOARD</div>
                    <h2 className="grotesk mt-2 text-3xl font-bold text-white">Global and sanctions pulse</h2>
                </div>
                <SourceBadge source="WORLD BANK" />
            </div>

            <EconomicPulseCards
                globalGdp={globalGdp[globalGdp.length - 1] || null}
                inflation={inflation[inflation.length - 1] || null}
                trade={trade[trade.length - 1] || null}
                signal={signal}
            />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="glass-panel rounded-[28px] p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">GLOBAL GDP TREND</div>
                        <SourceBadge source="WORLD BANK" />
                    </div>
                    <GlobalGDPChart data={globalGdp} isLoading={false} isError={false} />
                </div>

                <div className="glass-panel rounded-[28px] p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">COUNTRY GDP TREND</div>
                        <SourceBadge source="WORLD BANK" />
                    </div>
                    <div className="mb-4">
                        <select
                            value={selectedCountry}
                            className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white"
                            readOnly
                        >
                            {COUNTRY_OPTIONS.map((country) => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                    <CountryGDPChart data={countrySeries} countryName={COUNTRY_OPTIONS.find((country) => country.code === selectedCountry)?.name || selectedCountry} isLoading={false} isError={false} />
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="glass-panel rounded-[28px] p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">COUNTRY COMPARISON</div>
                        <SourceBadge source="WORLD BANK" />
                    </div>
                    <CountryComparison countries={comparisonCountries} countryData={countryData} />
                </div>

                <div className="glass-panel rounded-[28px] p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">PRE/POST INDICATOR COMPARISON</div>
                        <SourceBadge source="WORLD BANK" />
                    </div>
                    <PrePostComparison eventYear={2023} series={countrySeries} />
                </div>
            </div>

            <div className="glass-panel rounded-[28px] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[10px] tracking-[0.18em] text-white/60">SANCTIONS ACTIVITY</div>
                    <SourceBadge source="GEOPOLIS DATASET" />
                </div>
                <SanctionsTracker sanctions={sanctions} isLoading={false} isError={false} />
            </div>
        </div>
    )
}
