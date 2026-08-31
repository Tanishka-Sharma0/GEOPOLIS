import SourceBadge from '../ui/SourceBadge'
import EmptyState from '../ui/EmptyState'

function getLatestValue(series = []) {
    if (!Array.isArray(series) || series.length === 0) return null
    const latest = [...series].sort((a, b) => b.year - a.year)[0]
    return latest && Number.isFinite(latest.value) ? latest.value : null
}

export default function CountryComparison({
    countries,
    countryData,
}: {
    countries: Array<{ code: string; name: string }>
    countryData: Record<string, Array<{ year: number; value: number }>>
}) {
    if (!countries.length) {
        return <EmptyState message="Select countries to compare GDP growth." />
    }

    return (
        <div className="space-y-4">
            {countries.map((country) => {
                const series = countryData[country.code] || []
                const latest = getLatestValue(series)

                return (
                    <div key={country.code} className="rounded-[22px] border border-white/10 bg-[#081a1d]/70 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[14px] font-medium text-white">{country.name}</div>
                            <SourceBadge source="WORLD BANK" />
                        </div>
                        <div className="mt-3 text-[24px] font-bold text-[#7ee7d4]">
                            {latest === null ? 'No data available' : `${Number(latest).toFixed(2)}%`}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
