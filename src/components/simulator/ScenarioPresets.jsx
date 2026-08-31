import { motion } from 'framer-motion'

export default function ScenarioPresets({ presets, active, onSelect }) {
    return (
        <div className="glass-card rounded-[26px] border border-white/10 bg-[#0f2a2d]/80 p-4">
            <div className="mb-3 text-[10px] tracking-[0.16em] text-white/60">SCENARIO PRESETS</div>
            <div className="flex flex-wrap gap-2">
                {Object.entries(presets).map(([name, values]) => (
                    <motion.button
                        key={name}
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(values)}
                        className={`rounded-full border px-3 py-2 text-[9px] tracking-[0.12em] transition ${active === name
                            ? 'border-[#71d3c8] bg-[#71d3c8] text-[#062427] shadow-[0_0_18px_rgba(113,211,200,0.35)]'
                            : 'border-white/10 bg-[#0d2a2d] text-white/75 hover:bg-[#12353b]'
                            }`}
                    >
                        {name}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
