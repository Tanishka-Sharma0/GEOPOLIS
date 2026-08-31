import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Intelligence from './pages/Intelligence'
import Simulator from './pages/Simulator'
import Treaties from './pages/Treaties'
import TreatyDetail from './pages/TreatyDetail'
import EconomyPage from './pages/EconomyPage'
import CountriesPage from './pages/CountriesPage'
import CountryDetailPage from './pages/CountryDetailPage'
import ComparePage from './pages/ComparePage'

const pathToView: Record<string, string> = {
  '/': 'home',
  '/intelligence': 'intelligence',
  '/simulator': 'simulator',
  '/treaties': 'treaties',
  '/economy': 'economy',
  '/countries': 'countries',
  '/country': 'countries',
  '/compare': 'compare',
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(pathToView[location.pathname] ?? 'home')

  useEffect(() => {
    const rawPath = location.pathname.startsWith('/treaty/') ? '/treaties' : location.pathname.startsWith('/country/') ? '/country' : location.pathname
    setActive(pathToView[rawPath] ?? 'treaties')
  }, [location.pathname])

  const handleNavigate = (view: string) => {
    const nextPath = view === 'home' ? '/' : `/${view}`
    setActive(view)
    navigate(nextPath)
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#061b1e] text-[#ebf9f5]">
      <div className="app-shell-bg" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="relative z-10 w-full">
        <Navbar active={active} setActive={handleNavigate} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Routes>
              <Route path="/" element={<Home setActive={handleNavigate} />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/treaties" element={<Treaties />} />
              <Route path="/treaty/:id" element={<TreatyDetail />} />
              <Route path="/economy" element={<EconomyPage />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/country/:code" element={<CountryDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}