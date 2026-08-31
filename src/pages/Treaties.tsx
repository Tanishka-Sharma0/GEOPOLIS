import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import { useTreaties } from '../hooks/useTreaties'

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'members', label: 'Member Count' },
]

export default function Treaties() {
    const navigate = useNavigate()
    const { data: treaties = [], isLoading, isError } = useTreaties()
    const [query, setQuery] = useState('')
    const [organization, setOrganization] = useState('ALL')
    const [status, setStatus] = useState('ALL')
    const [sortBy, setSortBy] = useState('newest')
    const graphRef = useRef<any>(null)
    const graphContainerRef = useRef<HTMLDivElement | null>(null)
    const [graphSize, setGraphSize] = useState({ width: 900, height: 440 })

    useEffect(() => {
        const element = graphContainerRef.current
        if (!element) return

        const updateSize = () => {
            const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
            const width = Math.min(Math.max(280, element.clientWidth || viewportWidth - 32), viewportWidth - 24)
            const height = Math.max(260, element.clientHeight || 360)
            setGraphSize({ width, height })

            requestAnimationFrame(() => {
                if (graphRef.current) {
                    graphRef.current.zoomToFit(500, 80)
                }
            })
        }

        updateSize()

        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSize) : null
        if (observer) observer.observe(element)

        const handleResize = () => updateSize()
        window.addEventListener('resize', handleResize)

        return () => {
            observer?.disconnect()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const organizations = useMemo(
        () => ['ALL', ...new Set(treaties.map((treaty) => treaty.organization))],
        [treaties]
    )

    const statuses = useMemo(
        () => ['ALL', ...new Set(treaties.map((treaty) => treaty.status))],
        [treaties]
    )

    const filteredTreaties = useMemo(() => {
        const search = query.trim().toLowerCase()

        return [...treaties]
            .filter((treaty) => {
                const matchesSearch = !search ||
                    treaty.name.toLowerCase().includes(search) ||
                    treaty.organization.toLowerCase().includes(search) ||
                    treaty.members.some((member) => member.toLowerCase().includes(search)) ||
                    treaty.summary.toLowerCase().includes(search)

                const matchesOrg = organization === 'ALL' || treaty.organization === organization
                const matchesStatus = status === 'ALL' || treaty.status === status

                return matchesSearch && matchesOrg && matchesStatus
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'oldest':
                        return a.year - b.year
                    case 'alphabetical':
                        return a.name.localeCompare(b.name)
                    case 'members':
                        return b.members.length - a.members.length
                    case 'newest':
                    default:
                        return b.year - a.year
                }
            })
    }, [query, organization, status, sortBy, treaties])

    const graphData = useMemo(() => {
        const nodes = new Map<string, { id: string, label: string, color: string, type: 'treaty' | 'member', value: number, treatyId?: string }>()
        const links: Array<{ source: string, target: string, value: number }> = []

        treaties.forEach((treaty) => {
            const treatyNodeId = `treaty-${treaty.id}`
            nodes.set(treatyNodeId, {
                id: treatyNodeId,
                label: treaty.name,
                color: '#7ee7d4',
                type: 'treaty',
                value: 12 + treaty.members.length,
                treatyId: treaty.id,
            })

            treaty.members.forEach((member) => {
                const memberNodeId = `member-${member}`
                if (!nodes.has(memberNodeId)) {
                    nodes.set(memberNodeId, {
                        id: memberNodeId,
                        label: member,
                        color: '#f9c66b',
                        type: 'member',
                        value: 4,
                    })
                }

                links.push({ source: memberNodeId, target: treatyNodeId, value: 1 })
            })
        })

        const seenPairs = new Set<string>()
        treaties.forEach((treaty) => {
            treaties.forEach((candidate) => {
                if (candidate.id === treaty.id) return
                const key = [treaty.id, candidate.id].sort().join('|')
                if (seenPairs.has(key)) return
                seenPairs.add(key)

                const shared = treaty.members.filter((member) => candidate.members.includes(member))
                if (shared.length > 0) {
                    links.push({
                        source: `treaty-${treaty.id}`,
                        target: `treaty-${candidate.id}`,
                        value: shared.length,
                    })
                }
            })
        })

        return {
            nodes: Array.from(nodes.values()),
            links,
        }
    }, [treaties])

    if (isLoading) {
        return (
            <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 lg:px-12">
                <div className="rounded-[28px] border border-white/10 bg-[#081a1d]/70 p-8 text-white/75">
                    Loading treaty network...
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 lg:px-12">
                <div className="rounded-[28px] border border-[#ff8b7b]/30 bg-[#1b0e0b]/60 p-8 text-white">
                    Treaty data is unavailable right now.
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1600px] min-w-0 px-3 py-6 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="text-[10px] tracking-[0.18em] text-[#7ee7d4]">ALLIANCE ARCHITECTURE</div>
                    <h2 className="grotesk mt-2 text-4xl font-bold text-white md:text-5xl">Strategic Treaties Network</h2>
                </div>
                <div className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-4 py-2 text-[10px] tracking-[0.14em] text-[#7ee7d4]">
                    {filteredTreaties.length} ACTIVE LINKS
                </div>
            </div>

            <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="glass-panel min-w-0 rounded-[28px] p-4 sm:p-5">
                    <div className="mb-5 text-[10px] tracking-[0.18em] text-white/60">NETWORK FILTERS</div>

                    <label className="block">
                        <div className="mb-2 text-[10px] tracking-[0.14em] text-white/60">SEARCH</div>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Treaties, countries, alliances..."
                            className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-0"
                        />
                    </label>

                    <div className="mt-5 grid gap-4">
                        <label>
                            <div className="mb-2 text-[10px] tracking-[0.14em] text-white/60">ORGANIZATION</div>
                            <select
                                value={organization}
                                onChange={(event) => setOrganization(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white outline-none"
                            >
                                {organizations.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <div className="mb-2 text-[10px] tracking-[0.14em] text-white/60">STATUS</div>
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white outline-none"
                            >
                                {statuses.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <div className="mb-2 text-[10px] tracking-[0.14em] text-white/60">SORT</div>
                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white outline-none"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="mt-6 rounded-[22px] border border-white/10 bg-[#081a1d]/70 p-4">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">SUMMARY</div>
                        <div className="mt-3 space-y-2 text-sm text-white/70">
                            <div className="flex items-center justify-between gap-4">
                                <span>Total treaties</span>
                                <span className="text-white">{treaties.length}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Visible</span>
                                <span className="text-white">{filteredTreaties.length}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Organizations</span>
                                <span className="text-white">{organizations.length - 1}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="space-y-6">
                    <div className="glass-panel overflow-hidden rounded-[28px] p-3">
                        <div className="mb-3 flex items-center justify-between gap-2 px-2 pt-1">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">ALLIANCE GRAPH</div>
                            <button
                                type="button"
                                onClick={() => graphRef.current?.zoomToFit(500, 60)}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] tracking-[0.14em] text-white/75"
                            >
                                FIT VIEW
                            </button>
                        </div>
                        <div ref={graphContainerRef} className="h-[280px] w-full min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#081a1d]/70 sm:h-[360px] lg:h-[460px]">
                            <ForceGraph2D
                                ref={graphRef}
                                graphData={graphData}
                                width={graphSize.width}
                                height={graphSize.height}
                                nodeRelSize={7}
                                nodeLabel={(node: any) => `${node.label} (${node.type})`}
                                nodeColor={(node: any) => node.color}
                                linkWidth={(link: any) => 1 + (link.value || 1) * 0.7}
                                linkDirectionalParticles={2}
                                linkDirectionalParticleWidth={1.6}
                                backgroundColor="rgba(8,26,29,0)"
                                d3AlphaDecay={0.02}
                                d3VelocityDecay={0.3}
                                cooldownTicks={80}
                                onNodeClick={(node: any) => {
                                    if (node.treatyId) navigate(`/treaty/${node.treatyId}`)
                                }}
                                nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                                    const label = node.label || ''
                                    const fontSize = 10 / globalScale
                                    ctx.font = `${fontSize}px Inter, sans-serif`
                                    ctx.fillStyle = 'rgba(255,255,255,0.8)'
                                    ctx.textAlign = 'center'
                                    ctx.fillText(label, node.x, node.y + 12)
                                }}
                            />
                        </div>
                    </div>

                    <div className="glass-panel rounded-[28px] p-5">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="text-[10px] tracking-[0.18em] text-white/60">TREATY LIST</div>
                            <div className="text-[10px] tracking-[0.14em] text-white/45">{filteredTreaties.length} results</div>
                        </div>

                        {filteredTreaties.length === 0 ? (
                            <div className="rounded-[20px] border border-white/10 bg-[#081a1d]/60 p-8 text-center text-white/70">
                                No treaties match the current filters.
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {filteredTreaties.map((treaty) => (
                                    <button
                                        key={treaty.id}
                                        type="button"
                                        onClick={() => navigate(`/treaty/${treaty.id}`)}
                                        className="group rounded-[22px] border border-white/10 bg-[#081a1d]/70 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#7ee7d4]/40 hover:bg-[#0d2428]/80"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-[10px] tracking-[0.14em] text-[#7ee7d4]">{treaty.organization}</div>
                                                <h3 className="mt-2 text-[20px] font-semibold text-white">{treaty.name}</h3>
                                            </div>
                                            <span className="rounded-full border border-[#f9c66b]/35 bg-[#f9c66b]/10 px-2 py-1 text-[9px] tracking-[0.12em] text-[#f9c66b]">
                                                {treaty.status}
                                            </span>
                                        </div>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/65">{treaty.summary}</p>

                                        <div className="mt-4 flex items-center justify-between text-[10px] tracking-[0.12em] text-white/50">
                                            <span>{treaty.year}</span>
                                            <span>{treaty.members.length} members</span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {treaty.members.slice(0, 4).map((member) => (
                                                <span key={member} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] tracking-[0.1em] text-white/75">
                                                    {member}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}