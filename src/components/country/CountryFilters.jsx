const regions = ['All', 'South Asia', 'North America', 'Europe', 'East Asia', 'Middle East', 'Africa', 'Eurasia']

export default function CountryFilters({ value, onChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
                <button
                    key={region}
                    type="button"
                    onClick={() => onChange(region)}
                    className={`rounded-full border px-3 py-2 text-[10px] tracking-[0.12em] transition-all ${value === region
                            ? 'border-[#7ee7d4]/40 bg-[#7ee7d4]/15 text-[#7ee7d4]'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    {region.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
