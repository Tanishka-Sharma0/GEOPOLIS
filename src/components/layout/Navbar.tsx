import { useState } from 'react'
import { motion } from 'framer-motion'

const views = ['INTELLIGENCE', 'SIMULATOR', 'TREATIES', 'ECONOMY', 'COUNTRIES', 'COMPARE'] as const

export default function Navbar({ active, setActive }: { active: string, setActive: (v: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSelect = (view: string) => {
    setActive(view)
    setMobileOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#071d1f]/60 backdrop-blur-xl shadow-[0_12px_30px_rgba(4,18,20,0.35)]">
      <div className="relative mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 sm:gap-8 lg:gap-12">
          <button
            type="button"
            className="grotesk cursor-pointer text-[18px] font-bold tracking-[-0.02em] text-white sm:text-[20px] md:text-[22px]"
            onClick={() => handleSelect('home')}
          >
            GEOPOLIS
          </button>

          <div className="hidden md:flex gap-2 xl:gap-3">
            {views.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleSelect(v.toLowerCase())}
                className={`rounded-full px-3 py-2 text-[9px] font-medium tracking-[0.14em] transition-all duration-300 xl:text-[10px] ${active === v.toLowerCase() ? 'bg-gradient-to-r from-[#71d3c8] to-[#f9c66b] text-[#062427] shadow-[0_0_20px_rgba(113,211,200,0.45)]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-[9px] tracking-[0.14em] text-white/75 md:text-[10px]">
            <motion.span animate={{ scale: [1, 1.35, 1], opacity: [1, 0.75, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} className="h-2.5 w-2.5 rounded-full bg-[#71d3c8] shadow-[0_0_12px_rgba(113,211,200,0.9)]" />
            LIVE
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
            ⌕
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#071d1f]/95 md:hidden">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-3 sm:px-6">
            {views.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleSelect(v.toLowerCase())}
                className={`rounded-full px-3 py-2 text-left text-[10px] tracking-[0.14em] transition ${active === v.toLowerCase() ? 'bg-gradient-to-r from-[#71d3c8] to-[#f9c66b] text-[#062427]' : 'text-white/75 hover:bg-white/5 hover:text-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
