import EmptyState from '../ui/EmptyState'
import SourceBadge from '../ui/SourceBadge'

export default function PrePostComparison({
    eventYear,
    series,
}: {
    eventYear: number
    series: Array<{ year: number; value: number }>
}) {
    if (!Number.isFinite(eventYear) || !Array.isArray(series) || series.length === 0) {
        return <EmptyState message="No data available for pre/post comparison." />
    }

    const beforeValues = series
        .filter((entry) => Number(entry.year) >= Number(eventYear) - 3 && Number(entry.year) < Number(eventYear))
        .map((entry) => Number(entry.value))
        .filter((value) => Number.isFinite(value))

    const afterValues = series
        .filter((entry) => Number(entry.year) > Number(eventYear) && Number(entry.year) <= Number(eventYear) + 3)
        .map((entry) => Number(entry.value))
        .filter((value) => Number.isFinite(value))

    const beforeAverage = beforeValues.length ? beforeValues.reduce((sum, value) => sum + value, 0) / beforeValues.length : null
    const afterAverage = afterValues.length ? afterValues.reduce((sum, value) => sum + value, 0) / afterValues.length : null
    const delta = beforeAverage !== null && afterAverage !== null ? afterAverage - beforeAverage : null

    return (
        <div className="rounded-[24px] border border-white/10 bg-[#081a1d]/70 p-5">
            <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] tracking-[0.18em] text-white/60">PRE/POST INDICATOR COMPARISON</div>
                <SourceBadge source="WORLD BANK" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] tracking-[0.14em] text-white/60">3Y BEFORE</div>
                    <div className="mt-2 text-[22px] font-bold text-[#7ee7d4]">
                        {beforeAverage === null ? 'No data available' : `${beforeAverage.toFixed(2)}%`}
                    </div>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] tracking-[0.14em] text-white/60">3Y AFTER</div>
                    <div className="mt-2 text-[22px] font-bold text-[#f9c66b]">
                        {afterAverage === null ? 'No data available' : `${afterAverage.toFixed(2)}%`}
                    </div>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] tracking-[0.14em] text-white/60">DELTA</div>
                    <div className="mt-2 text-[22px] font-bold text-[#ff8b7b]">
                        {delta === null ? 'No data available' : `${delta.toFixed(2)} pts`}
                    </div>
                </div>
            </div>
            <div className="mt-4 text-[11px] leading-6 text-white/60">
                This comparison shows changes around the selected period and does not establish causation.
            </div>
        </div>
    )
}
