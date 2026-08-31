import { motion } from 'framer-motion'

const sliderConfig = [
    {
        key: 'tension',
        label: 'US–China Tension',
        min: 0,
        max: 100,
        step: 1,
        description: 'Strategic competition and military signaling pressure.',
    },
    {
        key: 'tradeRestrictions',
        label: 'Global Trade Restrictions',
        min: 0,
        max: 100,
        step: 1,
        description: 'Tariffs, sanctions, and trade route disruption intensity.',
    },
    {
        key: 'sanctions',
        label: 'Sanctions Intensity',
        min: 0,
        max: 100,
        step: 1,
        description: 'Intensity of financial and strategic restrictions.',
    },
    {
        key: 'militaryEscalation',
        label: 'Military Escalation',
        min: 0,
        max: 100,
        step: 1,
        description: 'Weapon deployments, exercise intensity, and mobilization risk.',
    },
    {
        key: 'diplomaticCooperation',
        label: 'Diplomatic Cooperation',
        min: 0,
        max: 100,
        step: 1,
        description: 'Negotiation, mediation, and multilateral coordination capacity.',
    },
    {
        key: 'economicGrowth',
        label: 'Global Economic Growth',
        min: -5,
        max: 10,
        step: 0.1,
        description: 'Current economic baseline adjusted by scenario conditions.',
    },
    {
        key: 'energyPressure',
        label: 'Energy / Oil Pressure',
        min: 0,
        max: 100,
        step: 1,
        description: 'Supply disruption risk and volatility in energy markets.',
    },
    {
        key: 'technologyDecoupling',
        label: 'Technology Decoupling',
        min: 0,
        max: 100,
        step: 1,
        description: 'Fragmentation of key supply chains and strategic technology access.',
    },
]

export default function SimulationControls({ inputs, onChange, onReset }) {
    return (
        <div className="space-y-5">
            {sliderConfig.map((control) => {
                const currentValue = inputs[control.key]
                const displayValue = control.key === 'economicGrowth' ? `${currentValue.toFixed(1)}%` : `${currentValue}%`
                const percentage = ((currentValue - control.min) / (control.max - control.min)) * 100

                return (
                    <motion.div
                        key={control.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="glass-card rounded-[20px] border border-white/10 bg-[#0d2a2d]/75 p-4"
                    >
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <div>
                                <div className="text-[10px] tracking-[0.14em] text-white/60">{control.label}</div>
                                <div className="mt-1 text-[11px] text-white/55">{control.description}</div>
                            </div>
                            <div className="rounded-full border border-[#71d3c8]/30 bg-[#0c2f34] px-2 py-1 text-[10px] font-medium text-[#9adcd9]">
                                {displayValue}
                            </div>
                        </div>

                        <div className="mb-2 flex items-center justify-between text-[9px] tracking-[0.1em] text-white/45">
                            <span>MIN {control.min}</span>
                            <span>MAX {control.max}</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#71d3c8] via-[#8ccae8] to-[#f9c66b]"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        <input
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={currentValue}
                            onChange={(event) => onChange(control.key, Number(event.target.value))}
                            className="mt-3 h-2 w-full accent-[#71d3c8]"
                        />
                    </motion.div>
                )
            })}

            <button
                type="button"
                onClick={onReset}
                className="w-full rounded-full border border-white/10 bg-[#e8dccf] px-4 py-3 text-[10px] tracking-[0.14em] text-[#072427] transition hover:-translate-y-0.5 hover:bg-[#f5ecdf]"
            >
                RESET SCENARIO
            </button>
        </div>
    )
}
