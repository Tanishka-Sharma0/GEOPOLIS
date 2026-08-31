import { motion } from 'framer-motion'
export default function Home({ setActive }: { setActive: (v: string) => void }) {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-6 sm:px-6 md:px-8 lg:px-12 lg:py-20">
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-6">
          <div className="mb-5 text-[10px] tracking-[0.2em] text-[#7ee7d4] sm:text-[11px] md:mb-8">EST. 2024 • GEOPOLITICAL OBSERVATORY</div>
          <h1 className="grotesk text-[32px] font-bold leading-[0.9] tracking-[-0.04em] text-white sm:text-[42px] md:text-[52px] lg:text-[84px]">
            GEOPOLITICAL
            <br />
            INTELLIGENCE
            <br />
            <span className="gradient-text">FOR THE WORLD</span>
            <br />
            AHEAD.
          </h1>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.5] text-white/72 sm:mt-6 md:mt-8 md:text-[16px] lg:text-[18px]">
            Track the forces shaping today's world. Then simulate what tomorrow could look like.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row md:mt-10">
            <button onClick={() => setActive('intelligence')} className="w-full rounded-full bg-gradient-to-r from-[#7ee7d4] via-[#66c7d8] to-[#f9c66b] px-7 py-4 text-[11px] font-medium tracking-[0.12em] text-[#04252a] shadow-[0_0_25px_rgba(126,231,212,0.35)] transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto">EXPLORE LIVE WORLD →</button>
            <button onClick={() => setActive('simulator')} className="w-full rounded-full border border-white/15 bg-white/5 px-7 py-4 text-[11px] font-medium tracking-[0.12em] text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white sm:w-auto">RUN 2035 SIMULATION</button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-14 md:grid-cols-4">
            {[
              { l: 'GLOBAL TENSION', v: '68', s: '● ELEVATED', c: 'text-[#f9c66b]' },
              { l: 'ACTIVE CONFLICTS', v: '08', s: '● CRITICAL', c: 'text-[#ff8b7b]' },
              { l: 'DIPLOMATIC EVENTS', v: '24', s: '● ACTIVE', c: 'text-[#7ee7d4]' },
              { l: 'ECONOMIC RISK', v: '61', s: '● MODERATE', c: 'text-[#9ae6b4]' },
            ].map((m, i) => (
              <div key={i} className="glass-card rounded-2xl border border-white/10 p-4 md:p-6">
                <div className="text-[9px] tracking-[0.14em] text-white/60 md:text-[10px]">{m.l}</div>
                <div className="grotesk mt-2 text-[28px] font-bold leading-none text-white md:text-[42px]">{m.v}</div>
                <div className={`mt-2 text-[10px] font-medium md:text-[11px] ${m.c}`}>{m.s}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="lg:col-span-6">
          <div className="glass-panel rounded-[28px] p-3 md:p-6 lg:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[8px] tracking-[0.14em] text-white/70 sm:text-[9px] md:text-[10px]">
              <span>WORLD MAP • LIVE FEED</span>
              <span className="flex flex-wrap items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ff8b7b]" />WAR <span className="ml-2 h-2 w-2 rounded-full bg-[#f9c66b]" />TENSION <span className="ml-2 h-2 w-2 rounded-full bg-[#7ee7d4]" />DIPLOMACY <span className="ml-2 h-2 w-2 rounded-full bg-[#9ae6b4]" />STABLE</span>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-[22px] border border-white/10 bg-[#071d1f]/90 sm:h-[360px] md:h-[420px] lg:h-[520px]">
              <div className="grid-overlay absolute inset-0" />
              <svg viewBox="0 0 1000 500" className="relative z-10 h-full w-full">
                <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" /></pattern></defs>
                <rect width="1000" height="500" fill="url(#grid)" />
                <path d="M 120 80 L 180 70 L 220 90 L 250 130 L 230 180 L 180 200 L 120 180 L 80 130 Z" fill="rgba(126,231,212,0.12)" stroke="rgba(126,231,212,0.65)" strokeWidth="1.2" />
                <path d="M 140 210 L 200 200 L 240 240 L 220 300 L 180 320 L 130 280 Z" fill="rgba(126,231,212,0.1)" stroke="rgba(126,231,212,0.65)" strokeWidth="1.2" />
                <path d="M 400 90 L 500 80 L 520 130 L 480 160 L 420 140 Z" fill="rgba(249,198,107,0.1)" stroke="rgba(249,198,107,0.6)" strokeWidth="1.2" />
                <path d="M 480 160 L 540 150 L 560 220 L 520 280 L 460 260 L 440 200 Z" fill="rgba(249,198,107,0.1)" stroke="rgba(249,198,107,0.6)" strokeWidth="1.2" />
                <path d="M 550 80 L 750 70 L 800 120 L 780 180 L 650 200 L 550 160 Z" fill="rgba(126,231,212,0.09)" stroke="rgba(126,231,212,0.6)" strokeWidth="1.2" />
                <path d="M 700 220 L 800 210 L 850 260 L 820 320 L 760 310 L 700 260 Z" fill="rgba(154,230,180,0.08)" stroke="rgba(154,230,180,0.6)" strokeWidth="1.2" />
                <path d="M 200 150 Q 350 120 450 130" fill="none" stroke="rgba(126,231,212,0.8)" strokeWidth="1" strokeDasharray="7 8" opacity="0.8" />
                <path d="M 500 200 Q 600 180 700 150" fill="none" stroke="rgba(126,231,212,0.8)" strokeWidth="1" strokeDasharray="7 8" opacity="0.8" />
              </svg>
              {[
                { l: '61%', t: '31%', c: '#ff8b7b' },
                { l: '56%', t: '44%', c: '#ff8b7b' },
                { l: '82%', t: '42%', c: '#f9c66b' },
                { l: '57%', t: '54%', c: '#f9c66b' },
                { l: '18%', t: '38%', c: '#7ee7d4' },
                { l: '68%', t: '48%', c: '#9ae6b4' },
              ].map((m, i) => (
                <div key={i} className="absolute z-20" style={{ left: m.l, top: m.t }}>
                  <div className="relative">
                    <div className="pulse-ring absolute -left-3 -top-3 h-8 w-8 rounded-full" style={{ background: `${m.c}33` }}></div>
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-[#071d1f] shadow-[0_0_18px_rgba(255,255,255,0.4)]" style={{ background: m.c }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
