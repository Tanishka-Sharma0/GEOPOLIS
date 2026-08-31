import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTreaty, useTreaties } from '../hooks/useTreaties'

function formatStatus(status: string) {
    return status || 'Active'
}

export default function TreatyDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: treaties = [], isLoading, isError } = useTreaties()
    const { data: treaty } = useTreaty(id)

    const relatedTreaties = useMemo(() => {
        if (!treaty || !treaties.length) return []

        const memberSet = new Set((treaty.members || []).map((member) => member.toLowerCase()))

        return treaties
            .filter((candidate) => candidate.id !== treaty.id)
            .map((candidate) => ({
                ...candidate,
                sharedMembers: (candidate.members || []).filter((member) => memberSet.has(member.toLowerCase())),
            }))
            .filter((candidate) => candidate.sharedMembers.length > 0)
            .sort((a, b) => b.sharedMembers.length - a.sharedMembers.length)
            .slice(0, 4)
    }, [treaties, treaty])

    if (isLoading) {
        return (
            <div className="mx-auto max-w-[1200px] px-4 py-10 text-white/80">
                <div className="rounded-[24px] border border-white/10 bg-[#081a1d]/70 p-6">Loading treaty details...</div>
            </div>
        )
    }

    if (isError || !treaty) {
        return (
            <div className="mx-auto max-w-[1200px] px-4 py-10">
                <div className="rounded-[24px] border border-[#ff8b7b]/40 bg-[#1b0e0b]/50 p-8 text-center text-white">
                    <div className="text-[10px] tracking-[0.18em] text-[#ff8b7b]">TREATY NOT FOUND</div>
                    <h2 className="grotesk mt-3 text-4xl font-bold">Treaty not found</h2>
                    <button
                        type="button"
                        onClick={() => navigate('/treaties')}
                        className="mt-6 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[10px] tracking-[0.14em] text-white/80"
                    >
                        BACK TO TREATY DATABASE
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:py-12">
            <div className="mb-6 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/treaties')}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] tracking-[0.14em] text-white/80"
                >
                    ← BACK TO DATABASE
                </button>
                <span className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-3 py-2 text-[10px] tracking-[0.14em] text-[#7ee7d4]">
                    {treaty.organization}
                </span>
            </div>

            <div className="glass-panel rounded-[28px] p-5 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-[10px] tracking-[0.18em] text-white/60">TREATY DETAIL</div>
                        <h2 className="grotesk mt-2 text-4xl font-bold text-white md:text-5xl">{treaty.name}</h2>
                    </div>
                    <div className="rounded-full border border-[#f9c66b]/30 bg-[#f9c66b]/10 px-3 py-2 text-[10px] tracking-[0.14em] text-[#f9c66b]">
                        {formatStatus(treaty.status)}
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">OVERVIEW</div>
                            <p className="mt-3 text-[16px] leading-7 text-white/75">{treaty.summary}</p>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">MEMBERS</div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(treaty.members || []).map((member) => (
                                    <span key={member} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] tracking-[0.12em] text-white/80">
                                        {member}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {treaty.timeline?.length ? (
                            <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                                <div className="text-[10px] tracking-[0.18em] text-white/60">TIMELINE</div>
                                <div className="mt-4 space-y-4 border-l border-white/10 pl-4">
                                    {treaty.timeline.map((entry) => (
                                        <div key={`${entry.year}-${entry.event}`} className="relative">
                                            <div className="absolute -left-[1.55rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[#7ee7d4]" />
                                            <div className="text-[10px] tracking-[0.14em] text-[#f9c66b]">{entry.year}</div>
                                            <div className="mt-1 text-[15px] text-white/80">{entry.event}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">CORE FACTS</div>
                            <div className="mt-4 space-y-3 text-sm text-white/75">
                                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                                    <span>Organization</span>
                                    <span className="text-white">{treaty.organization}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                                    <span>Year</span>
                                    <span className="text-white">{treaty.year}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                                    <span>Type</span>
                                    <span className="text-white">{treaty.type}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 pb-1">
                                    <span>Members</span>
                                    <span className="text-white">{treaty.members.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-[#081a1d]/75 p-5">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">RELATED TREATIES</div>
                            <div className="mt-4 space-y-3">
                                {relatedTreaties.length ? relatedTreaties.map((candidate) => (
                                    <button
                                        key={candidate.id}
                                        type="button"
                                        className="w-full rounded-[16px] border border-white/10 bg-white/5 p-3 text-left"
                                        aria-label={`Open related treaty ${candidate.name}`}
                                    >
                                        <div className="text-[10px] tracking-[0.14em] text-[#7ee7d4]">{candidate.organization}</div>
                                        <div className="mt-1 text-[15px] text-white">{candidate.name}</div>
                                        <div className="mt-2 text-[10px] tracking-[0.12em] text-white/50">
                                            Shared members: {candidate.sharedMembers.join(', ')}
                                        </div>
                                    </button>
                                )) : (
                                    <div className="text-sm text-white/65">No related treaties found for this alliance.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
