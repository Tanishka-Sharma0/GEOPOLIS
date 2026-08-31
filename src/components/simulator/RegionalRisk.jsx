import { motion } from 'framer-motion'

export default function RegionalRisk({ regions = [] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {regions.map((region, index) => (
                <motion.div
                    key={region.region}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.28 }}
                    className="rounded-[22px] border border-white/10 bg-[#0d2a2d] p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-[11px] tracking-[0.12em] text-white/60">{region.region}</div>
                        <div className="rounded-full border border-[#71d3c8]/20 bg-[#0c2f34] px-2 py-1 text-[9px] tracking-[0.12em] text-[#9adcd9]">
                            {region.riskLevel}
                        </div>
                    </div>
                    <div className="mt-4 text-[32px] font-bold text-white">{region.risk}</div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#71d3c8] via-[#8ccae8] to-[#f9c66b]" style={{ width: `${region.risk}%` }} />
                    </div>
                    <div className="mt-3 text-[12px] leading-5 text-white/65">Main driver: {region.mainDriver}</div>
                </motion.div>
            ))}
        </div>
    )
}
