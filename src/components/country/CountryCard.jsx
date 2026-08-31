export default function CountryCard({ country, onSelect }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(country.code)}
            className="group w-full rounded-[24px] border border-white/10 bg-[#081a1d]/80 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#7ee7d4]/40 hover:shadow-[0_0_25px_rgba(126,231,212,0.14)]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-inner shadow-white/5">
                        {country.flag}
                    </div>
                    <div>
                        <div className="text-[10px] tracking-[0.14em] text-white/50">{country.region}</div>
                        <div className="mt-1 text-[20px] font-semibold text-white">{country.name}</div>
                    </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] tracking-[0.12em] text-white/70">
                    {country.code}
                </span>
            </div>

            <div className="mt-5 rounded-[18px] border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between text-[10px] tracking-[0.14em] text-white/60">
                    <span>STATUS</span>
                    <span className={country.status === 'Critical' ? 'text-[#ff8b7b]' : country.status === 'Elevated' ? 'text-[#f9c66b]' : country.status === 'Watch' ? 'text-[#7ee7d4]' : 'text-[#a7f3d0]'}>{country.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-white/75">
                    <span>Risk score</span>
                    <span className="grotesk text-xl font-bold text-white">{country.riskScore}</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                        className={`h-full rounded-full ${country.riskScore >= 75 ? 'bg-[#ff7b7b]' : country.riskScore >= 55 ? 'bg-[#f9c66b]' : country.riskScore >= 35 ? 'bg-[#7ee7d4]' : 'bg-[#9ae6b4]'}`}
                        style={{ width: `${country.riskScore}%` }}
                    />
                </div>
            </div>
        </button>
    )
}
