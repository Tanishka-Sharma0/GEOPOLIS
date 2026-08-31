export default function CountrySearch({ value, onChange }) {
    return (
        <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/80 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-3 text-white/60">
                <span className="text-sm">⌕</span>
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search country or region"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
            </div>
        </div>
    )
}
