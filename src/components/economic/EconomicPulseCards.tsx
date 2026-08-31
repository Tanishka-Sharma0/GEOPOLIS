import SourceBadge from '../ui/SourceBadge'

function formatValue(value: number | null, suffix = '%') {
    if (value === null || Number.isNaN(value)) return 'No data available'
    return `${value.toFixed(2)}${suffix}`
}

export default function EconomicPulseCards({
    globalGdp,
    inflation,
    trade,
    signal,
}: {
    globalGdp: { year: number; value: number } | null
    inflation: { year: number; value: number } | null
    trade: { year: number; value: number } | null
    signal: string
}) {
    const cards = [
        {
            title: 'Global GDP Growth',
            value: formatValue(globalGdp?.value ?? null),
            badge: 'WORLD BANK',
            tone: 'text-[#7ee7d4]',
        },
        {
            title: 'Global Inflation',
            value: formatValue(inflation?.value ?? null),
            badge: 'WORLD BANK',
            tone: 'text-[#f9c66b]',
        },
        {
            title: 'Trade (% of GDP)',
            value: formatValue(trade?.value ?? null),
            badge: 'WORLD BANK',
            tone: 'text-[#9ae6b4]',
        },
        {
            title: 'Economic Signal',
            value: signal,
            badge: 'GEOPOLIS CALCULATED',
            tone: 'text-[#ff8b7b]',
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div key={card.title} className="glass-panel rounded-[24px] p-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-[9px] tracking-[0.16em] text-white/60">{card.title}</div>
                        <SourceBadge source={card.badge} />
                    </div>
                    <div className={`mt-4 grotesk text-[28px] font-bold ${card.tone}`}>{card.value}</div>
                </div>
            ))}
        </div>
    )
}
