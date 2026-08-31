import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCountry } from '../hooks/useCountries'
import { getTreatiesByCountry } from '../services/treatyService'
import { useQuery } from '@tanstack/react-query'

function formatIndicator(indicator) {
    if (!indicator || !indicator.value) return '—'
    return `${indicator.value.toFixed(2)}%`
}

export default function CountryDetailPage() {
    const { code } = useParams()
    const navigate = useNavigate()
    const { data: country, isLoading, isError } = useCountry(code)

    const { data: relatedTreaties = [] } = useQuery({
        queryKey: ['country-treaties', country?.name],
        enabled: Boolean(country?.name),
        queryFn: () => getTreatiesByCountry(country.name),
        staleTime: 1000 * 60 * 60,
    })

    const summaryCards = useMemo(() => {
        if (!country) return []

        return [
            { label: 'Risk score', value: `${country.riskScore}` },
            { label: 'Status', value: country.status },
            { label: 'Treaties', value: `${country.treatyCount}` },
            { label: 'Latest GDP', value: formatIndicator(country.indicators?.gdp) },
        ]
    }, [country])

    if (isLoading) {
        return (
            <div className="mx-auto max-w-[1200px] px-4 py-10">
                <div className="rounded-[28px] border border-white/10 bg-[#081a1d]/70 p-8 text-center text-white/75">Loading country profile...</div>
            </div>
        )
    }

    if (isError || !country) {
        return (
            <div className="mx-auto max-w-[1200px] px-4 py-10">
                <div className="rounded-[28px] border border-[#ff8b7b]/30 bg-[#1b0e0b]/40 p-8 text-center text-white">
                    <div className="text-[10px] tracking-[0.18em] text-[#ff8b7b]">COUNTRY NOT FOUND</div>
                    <h2 className="grotesk mt-3 text-4xl font-bold">Country profile unavailable</h2>
                    <button type="button" onClick={() => navigate('/countries')} className="mt-6 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[10px] tracking-[0.14em] text-white/80">BACK TO COUNTRIES</button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1300px] px-4 py-8 md:py-12">
            <div className="mb-6 flex items-center justify-between gap-3">
                <button type="button" onClick={() => navigate('/countries')} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] tracking-[0.14em] text-white/80">← BACK TO COUNTRIES</button>
                <span className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-3 py-2 text-[10px] tracking-[0.14em] text-[#7ee7d4]">{country.region}</span>
            </div>

            <div className="glass-panel rounded-[28px] p-5 md:p-7">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-3xl">{country.flag}</div>
                        <div>
                            <div className="text-[10px] tracking-[0.18em] text-white/60">COUNTRY PROFILE</div>
                            <h2 className="grotesk mt-2 text-4xl font-bold text-white md:text-5xl">{country.name}</h2>
                        </div>
                    </div>
                    <div className="rounded-full border border-[#f9c66b]/30 bg-[#f9c66b]/10 px-3 py-2 text-[10px] tracking-[0.14em] text-[#f9c66b]">
                        {country.status}
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div key={card.label} className="rounded-[18px] border border-white/10 bg-[#081a1d]/75 p-4">
                            <div className="text-[10px] tracking-[0.14em] text-white/55">{card.label}</div>
                            <div className="mt-2 text-2xl font-semibold text-white">{card.value}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-6">
                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">LATEST SIGNALS</div>
                            <div className="mt-4 space-y-4">
                                {country.news.length ? country.news.map((item) => (
                                    <div key={item.id} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.12em] text-white/55">
                                            <span>{item.source}</span>
                                            <span>{item.category}</span>
                                        </div>
                                        <div className="mt-2 text-[18px] font-semibold text-white">{item.title}</div>
                                        <p className="mt-2 text-sm leading-6 text-white/68">{item.description}</p>
                                        <button type="button" onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')} className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] tracking-[0.12em] text-white/80">READ MORE</button>
                                    </div>
                                )) : (
                                    <div className="text-white/65">No recent signals tracked for this country.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">ECONOMIC SNAPSHOT</div>
                            <div className="mt-4 space-y-3 text-sm text-white/75">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2"><span>GDP growth</span><span className="text-white">{formatIndicator(country.indicators?.gdp)}</span></div>
                                <div className="flex items-center justify-between border-b border-white/10 pb-2"><span>Inflation</span><span className="text-white">{formatIndicator(country.indicators?.inflation)}</span></div>
                                <div className="flex items-center justify-between pb-1"><span>Trade share</span><span className="text-white">{formatIndicator(country.indicators?.trade)}</span></div>
                            </div>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">ALLIANCE NETWORK</div>
                            <div className="mt-4 space-y-3">
                                {relatedTreaties.length ? relatedTreaties.map((treaty) => (
                                    <button key={treaty.id} type="button" onClick={() => navigate(`/treaty/${treaty.id}`)} className="w-full rounded-[16px] border border-white/10 bg-white/5 p-3 text-left">
                                        <div className="text-[10px] tracking-[0.14em] text-[#7ee7d4]">{treaty.organization}</div>
                                        <div className="mt-1 text-[16px] text-white">{treaty.name}</div>
                                    </button>
                                )) : (
                                    <div className="text-sm text-white/65">No active treaties linked to this country.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
