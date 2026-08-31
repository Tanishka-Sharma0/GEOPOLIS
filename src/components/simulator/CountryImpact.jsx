import { motion } from 'framer-motion'

export default function CountryImpact({ countries = [] }) {
    return (
        <div className="space-y-3">
            {countries.map((country, index) => (
                <motion.div
                    key={country.country}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.25 }}
                    className="rounded-[18px] border border-white/10 bg-[#0d2a2d] p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-[10px] tracking-[0.12em] text-white/55">{country.country}</div>
                            <div className="mt-1 text-[22px] font-semibold text-white">Risk {country.risk}</div>
                        </div>
                        <div className="rounded-full border border-[#71d3c8]/20 bg-[#0c2f34] px-2 py-1 text-[9px] tracking-[0.12em] text-[#9adcd9]">
                            {country.geopoliticalRisk}
                        </div>
                    </div>

                    <div className="mt-3 text-[12px] text-white/70">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1">
                            <span>Economic direction</span>
                            <span>{country.economicDirection}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <span>Primary driver</span>
                            <span className="text-right">{country.primaryDriver}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
