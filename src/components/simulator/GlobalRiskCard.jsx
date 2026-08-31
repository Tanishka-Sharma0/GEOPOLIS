import { motion } from 'framer-motion'

export default function GlobalRiskCard({ score, label, sublabel }) {
    const safeScore = Math.max(0, Math.min(100, Number(score) || 0))
    const ring = `conic-gradient(#71d3c8 0 ${safeScore}%, rgba(255,255,255,0.08) ${safeScore}% 100%)`

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-card rounded-[28px] border border-white/10 bg-[#0f2a2d]/85 p-5 shadow-[0_18px_35px_rgba(2,15,18,0.28)]"
        >
            <div className="text-[10px] tracking-[0.16em] text-white/60">{label}</div>
            <div className="mt-5 flex items-center gap-5">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10" style={{ background: ring }}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f2a2d] text-2xl font-bold text-white">{safeScore}</div>
                </div>
                <div>
                    <div className="text-[11px] tracking-[0.12em] text-white/55">HYPOTHETICAL SCENARIO</div>
                    <div className="mt-2 text-[18px] font-semibold text-white">{sublabel}</div>
                </div>
            </div>
        </motion.div>
    )
}
