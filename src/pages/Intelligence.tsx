import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { getIntelligenceDashboardData } from '../lib/intelligenceAPI'
import { countryMeta, countryOptions, type NormalizedEvent } from '../lib/intelligenceData'

const categoryFilters = ['All', 'conflict', 'diplomacy', 'economy', 'military', 'sanctions'] as const
const tensionWeights: Record<string, number> = {
    attack: 10,
    missile: 10,
    strike: 9,
    invasion: 10,
    battle: 8,
    conflict: 8,
    clash: 7,
    deployment: 5,
    protest: 3,
    dispute: 3,
    summit: -4,
    ceasefire: -6,
    treaty: -5,
    agreement: -5,
    'peace talks': -4,
    dialogue: -2,
    sanctions: 6,
    trade: 2,
    drill: 5,
}

const statusColors: Record<string, string> = {
    LOW: '#7ee7d4',
    MODERATE: '#f9c66b',
    HIGH: '#ff9f6e',
    CRITICAL: '#ff6b6b',
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const minutes = Math.max(1, Math.round(diff / 60000))
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.round(hours / 24)}d ago`
}

function classifyRisk(score: number) {
    if (score >= 60) return 'CRITICAL'
    if (score >= 40) return 'HIGH'
    if (score >= 20) return 'MODERATE'
    return 'LOW'
}

function getEventWeight(event: NormalizedEvent) {
    const text = `${event.title} ${event.description}`.toLowerCase()
    let score = 0
    for (const [keyword, weight] of Object.entries(tensionWeights)) {
        if (text.includes(keyword)) score += weight
    }
    if (event.category === 'conflict') score += 10
    if (event.category === 'diplomacy') score += 3
    if (event.category === 'sanctions') score += 6
    if (event.category === 'military') score += 7
    if (event.category === 'economy') score += 2
    return Math.max(0, score)
}

function getCountryRiskData(events: NormalizedEvent[]) {
    const map = new Map<string, { country: string; score: number; conflict: number; tension: number; diplomacy: number; events: number }>()

    for (const event of events) {
        const entry = map.get(event.country) ?? {
            country: event.country,
            score: 0,
            conflict: 0,
            tension: 0,
            diplomacy: 0,
            events: 0,
        }

        const eventWeight = getEventWeight(event)
        entry.score += eventWeight + (event.category === 'conflict' ? 14 : 0) + (event.category === 'diplomacy' ? 6 : 0)
        entry.events += 1
        entry.conflict += event.category === 'conflict' ? 1 : 0
        entry.diplomacy += event.category === 'diplomacy' ? 1 : 0
        entry.tension += eventWeight
        map.set(event.country, entry)
    }

    return [...map.values()]
        .map((country) => ({
            ...country,
            level: classifyRisk(country.score),
            score: Math.min(100, country.score),
        }))
        .sort((a, b) => b.score - a.score)
}

export default function Intelligence() {
    const [selectedCategory, setSelectedCategory] = useState<(typeof categoryFilters)[number]>('All')
    const [selectedCountry, setSelectedCountry] = useState('India')
    const [events, setEvents] = useState<NormalizedEvent[]>([])
    const [isLive, setIsLive] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const load = async () => {
            setIsLoading(true)
            const dashboard = await getIntelligenceDashboardData()

            if (!mounted) return

            const liveEvents = dashboard.all.length ? dashboard.all : []
            setEvents(liveEvents)
            setIsLive(Boolean(dashboard.isLive))
            setIsLoading(false)
        }

        load()
        return () => {
            mounted = false
        }
    }, [])

    const normalizedEvents = events.length ? events : []

    const filteredEvents = useMemo(() => {
        const source = selectedCategory === 'All' ? normalizedEvents : normalizedEvents.filter((event) => event.category === selectedCategory)
        return [...source].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }, [selectedCategory, normalizedEvents])

    const countryRisk = useMemo(() => getCountryRiskData(normalizedEvents), [normalizedEvents])
    const mapRisk = countryRisk.slice(0, 8)

    const conflictSignals = useMemo(() => {
        return [...countryRisk]
            .map((country) => ({
                country: country.country,
                score: Math.min(100, country.score),
                level: classifyRisk(country.score),
            }))
            .slice(0, 5)
    }, [countryRisk])

    const diplomacySignals = useMemo(() => {
        return normalizedEvents
            .filter((event) => event.category === 'diplomacy')
            .slice(0, 4)
    }, [normalizedEvents])

    const selectedCountryEvents = useMemo(() => {
        return normalizedEvents.filter((event) => event.country === selectedCountry).slice(0, 5)
    }, [normalizedEvents, selectedCountry])

    const timeline = useMemo(() => {
        const grouped = new Map<string, NormalizedEvent[]>()
        for (const event of selectedCountryEvents) {
            const dayLabel = new Date(event.publishedAt).toDateString() === new Date().toDateString() ? 'TODAY' : 'YESTERDAY'
            const group = grouped.get(dayLabel) ?? []
            group.push(event)
            grouped.set(dayLabel, group)
        }
        return [...grouped.entries()]
    }, [selectedCountryEvents])

    const liveFeed = filteredEvents.slice(0, 6)

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="text-[11px] tracking-[0.22em] text-[#7ee7d4]">INTELLIGENCE MODULE</div>
                    <h2 className="grotesk text-[42px] md:text-[56px] font-bold leading-none text-white">INTELLIGENCE</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-3 py-2 text-[10px] tracking-[0.16em] text-[#7ee7d4]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#7ee7d4] shadow-[0_0_12px_rgba(126,231,212,0.9)]" />
                    {isLoading ? 'LOADING DATA' : isLive ? 'LIVE DATA FEED' : 'FALLBACK FEED'}
                </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-12">
                <section className="xl:col-span-8 glass-panel rounded-[28px] p-4 md:p-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                            <div className="text-[10px] tracking-[0.2em] text-white/60">LIVE WORLD EVENTS</div>
                            <h3 className="grotesk text-[28px] font-semibold text-white">Global signal overview</h3>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.16em] text-white/60">
                            {isLoading ? 'FETCHING DATA' : `UPDATED ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {categoryFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedCategory(filter)}
                                className={`rounded-full px-3 py-2 text-[10px] tracking-[0.12em] font-medium transition-all ${selectedCategory === filter
                                    ? 'bg-gradient-to-r from-[#7ee7d4] to-[#f9c66b] text-[#062427]'
                                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {filter.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {liveFeed.map((event, index) => (
                            <motion.article
                                key={event.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.04 }}
                                className="overflow-hidden rounded-[22px] border border-white/10 bg-[#081a1d]/80"
                            >
                                <div className="h-32 w-full overflow-hidden">
                                    <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover opacity-80" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.14em] text-white/60">
                                        <span>{event.source}</span>
                                        <span>{timeAgo(event.publishedAt)}</span>
                                    </div>
                                    <h4 className="mt-3 text-[20px] font-semibold leading-tight text-white">{event.title}</h4>
                                    <p className="mt-2 text-sm leading-6 text-white/68">{event.description}</p>
                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#7ee7d4]">
                                            <span className="text-lg">{event.countryCode === 'UA' ? '🇺🇦' : event.countryCode === 'IN' ? '🇮🇳' : event.countryCode === 'CN' ? '🇨🇳' : event.countryCode === 'US' ? '🇺🇸' : event.countryCode === 'IL' ? '🇮🇱' : event.countryCode === 'RU' ? '🇷🇺' : event.countryCode === 'FR' ? '🇫🇷' : event.countryCode === 'JP' ? '🇯🇵' : '🌍'}</span>
                                            {event.country}
                                        </div>
                                        <button
                                            onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/80 transition hover:bg-white/10"
                                        >
                                            READ →
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>

                <div className="xl:col-span-4 space-y-6">
                    <section className="glass-panel rounded-[24px] p-4 md:p-5">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">CONFLICT MONITOR</div>
                        <div className="mt-3 flex items-end justify-between">
                            <div className="grotesk text-[42px] font-bold text-white">{conflictSignals.length}</div>
                            <div className="text-[10px] tracking-[0.12em] text-[#ff8b7b]">ACTIVE SIGNALS</div>
                        </div>
                        <div className="mt-4 space-y-3">
                            {conflictSignals.map((country) => (
                                <div key={country.country} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center justify-between text-sm text-white/80">
                                        <span>{country.country}</span>
                                        <span className="text-[10px] tracking-[0.12em]" style={{ color: statusColors[country.level] }}>{country.level}</span>
                                    </div>
                                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#ff8b7b] to-[#f9c66b]" style={{ width: `${country.score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-panel rounded-[24px] p-4 md:p-5">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">TENSION MONITOR</div>
                        <div className="mt-4 space-y-3">
                            {countryRisk.slice(0, 4).map((country) => (
                                <div key={country.country} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center justify-between text-sm text-white/80">
                                        <span>{country.country}</span>
                                        <span className="text-[10px] tracking-[0.12em]" style={{ color: statusColors[country.level] }}>{country.level}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.12em] text-white/50">
                                        <span>score</span>
                                        <span>{country.score}</span>
                                    </div>
                                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#7ee7d4] via-[#f9c66b] to-[#ff8b7b]" style={{ width: `${country.score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-panel rounded-[24px] p-4 md:p-5">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">DIPLOMACY MONITOR</div>
                        <div className="mt-4 space-y-3">
                            {diplomacySignals.map((event) => (
                                <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.12em] text-white/60">
                                        <span>{event.country}</span>
                                        <span>{timeAgo(event.publishedAt)}</span>
                                    </div>
                                    <div className="mt-2 text-[15px] font-medium text-white">{event.title}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="glass-panel rounded-[28px] p-4 md:p-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                            <div className="text-[10px] tracking-[0.18em] text-white/60">LIVE NEWS FEED</div>
                            <h3 className="grotesk text-[28px] font-semibold text-white">Latest intelligence wire</h3>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.14em] text-white/70">
                            FILTERED FEED
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {liveFeed.map((event) => (
                            <div key={event.id} className="rounded-[20px] border border-white/10 bg-[#081a1d]/75 p-4">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-2 text-[10px] tracking-[0.12em] text-white/60">
                                        <span>{event.source}</span>
                                        <span>•</span>
                                        <span>{event.country}</span>
                                    </div>
                                    <div className="text-[10px] tracking-[0.12em] text-[#7ee7d4]">{event.category.toUpperCase()}</div>
                                </div>
                                <div className="mt-2 text-[18px] font-medium text-white">{event.title}</div>
                                <div className="mt-2 text-sm leading-6 text-white/68">{event.description}</div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] tracking-[0.12em] text-white/50">{timeAgo(event.publishedAt)}</span>
                                    <button
                                        onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                        className="text-[10px] tracking-[0.14em] text-[#f9c66b] hover:text-[#f7d691]"
                                    >
                                        READ ORIGINAL →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-panel rounded-[28px] p-4 md:p-6">
                    <div className="text-[10px] tracking-[0.18em] text-white/60">MAP RISK DOTS</div>
                    <div className="mt-3 rounded-[22px] border border-white/10 bg-[#071d1f] p-2">
                        <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 160 }} className="h-[260px] w-full">
                            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="rgba(148, 163, 184, 0.08)"
                                            stroke="rgba(255,255,255,0.12)"
                                            strokeWidth={0.4}
                                        />
                                    ))
                                }
                            </Geographies>
                            {mapRisk.map((country) => {
                                const meta = countryMeta[country.country]
                                if (!meta) return null
                                const color = country.level === 'CRITICAL' ? '#ff6b6b' : country.level === 'HIGH' ? '#ff8b7b' : country.level === 'MODERATE' ? '#f9c66b' : '#7ee7d4'
                                return (
                                    <Marker key={country.country} coordinates={meta.coordinates}>
                                        <circle r={country.score > 70 ? 8 : country.score > 40 ? 6 : 4} fill={color} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} />
                                        <circle r={country.score > 70 ? 15 : 12} fill="none" stroke={color} opacity={0.45} className="pulse-ring" />
                                    </Marker>
                                )
                            })}
                        </ComposableMap>
                    </div>
                </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="glass-panel rounded-[28px] p-4 md:p-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                            <div className="text-[10px] tracking-[0.18em] text-white/60">COUNTRY NEWS</div>
                            <h3 className="grotesk text-[28px] font-semibold text-white">Latest intelligence by country</h3>
                        </div>
                        <select
                            value={selectedCountry}
                            onChange={(event) => setSelectedCountry(event.target.value)}
                            className="rounded-full border border-white/10 bg-[#071d1f] px-3 py-2 text-[10px] tracking-[0.14em] text-white/80 outline-none"
                        >
                            {countryOptions.map((country) => (
                                <option key={country} value={country}>{country.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-white/10 bg-[#081a1d]/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-[10px] tracking-[0.18em] text-white/60">SELECTED COUNTRY</div>
                                <div className="mt-2 text-[30px] font-bold text-white">{selectedCountry}</div>
                            </div>
                            <div className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-3 py-2 text-[10px] tracking-[0.14em] text-[#7ee7d4]">
                                {selectedCountryEvents.length} ITEMS
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {selectedCountryEvents.map((event, index) => (
                                <div key={event.id} className="rounded-[16px] border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.12em] text-white/60">
                                        <span>{index + 1}. {event.source}</span>
                                        <span>{timeAgo(event.publishedAt)}</span>
                                    </div>
                                    <div className="mt-2 text-[16px] font-medium text-white">{event.title}</div>
                                    <div className="mt-2 text-sm text-white/68">{event.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="glass-panel rounded-[28px] p-4 md:p-6">
                    <div className="text-[10px] tracking-[0.18em] text-white/60">COUNTRY TIMELINE</div>
                    <div className="mt-3 rounded-[22px] border border-white/10 bg-[#081a1d]/80 p-4">
                        {timeline.map(([label, events]) => (
                            <div key={label} className="mb-5 last:mb-0">
                                <div className="text-[10px] tracking-[0.18em] text-[#f9c66b]">{label}</div>
                                <div className="mt-3 space-y-3 border-l border-white/10 pl-4">
                                    {events.map((event) => (
                                        <div key={event.id} className="relative">
                                            <div className="absolute -left-[1.45rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[#7ee7d4]" />
                                            <div className="text-[11px] tracking-[0.12em] text-white/55">{new Date(event.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="mt-1 text-[15px] text-white">{event.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
