export default function SourceBadge({ source }: { source: string }) {
    return (
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] tracking-[0.14em] text-white/70">
            {source}
        </span>
    )
}
