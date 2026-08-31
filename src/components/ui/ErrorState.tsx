export default function ErrorState({ message = 'Something went wrong.' }: { message?: string }) {
    return (
        <div className="rounded-[24px] border border-[#ff8b7b]/30 bg-[#1b0e0b]/65 p-6 text-sm text-white/80">
            <div className="text-[10px] tracking-[0.18em] text-[#ff8b7b]">DATA ERROR</div>
            <div className="mt-2">{message}</div>
        </div>
    )
}
