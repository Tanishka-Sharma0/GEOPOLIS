export default function LiveBadge({ label = 'LIVE' }: { label?: string }) {
    return (
        <span className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-2 py-1 text-[9px] tracking-[0.14em] text-[#7ee7d4]">
            {label}
        </span>
    )
}
