export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-[#081a1d]/70 p-6 text-sm text-white/75">
            {message}
        </div>
    )
}
