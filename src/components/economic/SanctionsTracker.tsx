import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

export default function SanctionsTracker({
    sanctions,
    isLoading,
    isError,
}: {
    sanctions: Array<{
        id: string
        issuer: string
        target: string
        sector: string
        type: string
        date: string
        reason: string
        estimatedImpact: string
        status: string
    }>
    isLoading: boolean
    isError: boolean
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [issuer, setIssuer] = useState('ALL')
    const [status, setStatus] = useState('ALL')
    const [sector, setSector] = useState('ALL')
    const graphRef = useRef<HTMLDivElement | null>(null)
    const [graphSize, setGraphSize] = useState({ width: 700, height: 330 })

    useEffect(() => {
        const element = graphRef.current
        if (!element) return

        const updateSize = () => {
            const width = Math.max(280, element.clientWidth)
            const height = Math.max(260, element.clientHeight)
            setGraphSize({ width, height })
        }

        updateSize()
        const observer = new ResizeObserver(updateSize)
        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    const availableSectors = useMemo(
        () => ['ALL', ...new Set(sanctions.map((item) => item.sector).filter(Boolean))],
        [sanctions]
    )

    const availableStatuses = useMemo(
        () => ['ALL', ...new Set(sanctions.map((item) => item.status).filter(Boolean))],
        [sanctions]
    )

    const availableIssuers = useMemo(
        () => ['ALL', ...new Set(sanctions.map((item) => item.issuer).filter(Boolean))],
        [sanctions]
    )

    const filteredSanctions = useMemo(() => {
        const text = search.toLowerCase().trim()
        return sanctions.filter((entry) => {
            const matchesSearch =
                !text ||
                entry.issuer.toLowerCase().includes(text) ||
                entry.target.toLowerCase().includes(text) ||
                entry.reason.toLowerCase().includes(text) ||
                entry.sector.toLowerCase().includes(text)

            const matchesIssuer = issuer === 'ALL' || entry.issuer === issuer
            const matchesStatus = status === 'ALL' || entry.status === status
            const matchesSector = sector === 'ALL' || entry.sector === sector

            return matchesSearch && matchesIssuer && matchesStatus && matchesSector
        })
    }, [issuer, sanctions, search, sector, status])

    const selectedSanction = filteredSanctions.find((item) => item.id === selectedId) || filteredSanctions[0] || null

    const graphData = useMemo(() => {
        const nodes = new Map<string, { id: string; label: string; color: string }>()
        const links: Array<{ source: string; target: string; reason: string; sector: string; date: string; status: string }> = []

        filteredSanctions.forEach((entry) => {
            if (!nodes.has(entry.issuer)) {
                nodes.set(entry.issuer, { id: entry.issuer, label: entry.issuer, color: '#7ee7d4' })
            }
            if (!nodes.has(entry.target)) {
                nodes.set(entry.target, { id: entry.target, label: entry.target, color: '#f9c66b' })
            }

            links.push({
                source: entry.issuer,
                target: entry.target,
                reason: entry.reason,
                sector: entry.sector,
                date: entry.date,
                status: entry.status,
            })
        })

        return {
            nodes: Array.from(nodes.values()),
            links,
        }
    }, [filteredSanctions])

    if (isLoading) return <LoadingState message="Loading sanctions dataset..." />
    if (isError) return <ErrorState message="Sanctions data could not be loaded." />
    if (!sanctions.length) return <EmptyState message="No sanctions data available." />

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="glass-panel overflow-hidden rounded-[28px] p-3">
                    <div className="mb-3 flex items-center justify-between gap-2 px-2 pt-1">
                        <div className="text-[10px] tracking-[0.18em] text-white/60">SANCTIONS GRAPH</div>
                        <div className="text-[10px] tracking-[0.14em] text-white/45">{filteredSanctions.length} entries</div>
                    </div>
                    <div ref={graphRef} className="h-[280px] rounded-[20px] border border-white/10 bg-[#081a1d]/70 sm:h-[320px] lg:h-[360px]">
                        <ForceGraph2D
                            graphData={graphData}
                            width={graphSize.width}
                            height={graphSize.height}
                            nodeLabel={(node: any) => node.label}
                            nodeColor={(node: any) => node.color}
                            linkWidth={2}
                            linkDirectionalArrowLength={5}
                            linkDirectionalArrowColor="rgba(255,255,255,0.28)"
                            linkDirectionalParticles={3}
                            linkDirectionalParticleSpeed={0.006}
                            onNodeClick={(node: any) => setSelectedId(node.id)}
                            onLinkHover={(link: any) => {
                                if (link) {
                                    setSelectedId(`${link.source}-${link.target}`)
                                }
                            }}
                            nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                                const label = node.label || ''
                                const fontSize = 10 / globalScale
                                const radius = node.color === '#7ee7d4' ? 7 : 6
                                ctx.beginPath()
                                ctx.fillStyle = node.color
                                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
                                ctx.fill()
                                ctx.font = `${fontSize}px Inter, sans-serif`
                                ctx.fillStyle = 'rgba(255,255,255,0.8)'
                                ctx.textAlign = 'center'
                                ctx.fillText(label, node.x, node.y + 14)
                            }}
                        />
                    </div>
                </div>

                <div className="glass-panel rounded-[28px] p-5">
                    <div className="text-[10px] tracking-[0.18em] text-white/60">FILTERS</div>
                    <div className="mt-4 space-y-4">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search issuer, target, sector..."
                            className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white placeholder:text-white/35"
                        />
                        <select value={issuer} onChange={(event) => setIssuer(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white">
                            {availableIssuers.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white">
                            {availableStatuses.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <select value={sector} onChange={(event) => setSector(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#081a1d]/80 px-3 py-3 text-sm text-white">
                            {availableSectors.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-[28px] p-5">
                <div className="text-[10px] tracking-[0.18em] text-white/60">RELATIONSHIP DETAIL</div>
                {selectedSanction ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/70 p-4">
                            <div className="text-[10px] tracking-[0.14em] text-white/60">ISSUER</div>
                            <div className="mt-2 text-[18px] text-white">{selectedSanction.issuer}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/70 p-4">
                            <div className="text-[10px] tracking-[0.14em] text-white/60">TARGET</div>
                            <div className="mt-2 text-[18px] text-white">{selectedSanction.target}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/70 p-4">
                            <div className="text-[10px] tracking-[0.14em] text-white/60">SECTOR</div>
                            <div className="mt-2 text-[18px] text-white">{selectedSanction.sector}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/70 p-4">
                            <div className="text-[10px] tracking-[0.14em] text-white/60">STATUS</div>
                            <div className="mt-2 text-[18px] text-white">{selectedSanction.status}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/10 bg-[#081a1d]/70 p-4 md:col-span-2">
                            <div className="text-[10px] tracking-[0.14em] text-white/60">REASON</div>
                            <div className="mt-2 text-[15px] leading-7 text-white/75">{selectedSanction.reason}</div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 text-white/70">No sanctions relationship selected.</div>
                )}
            </div>
        </div>
    )
}
