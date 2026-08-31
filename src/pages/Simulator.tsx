import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useGlobalGDPGrowth, useWorldTradeIndicator } from '../hooks/useEconomicData'
import { DEFAULT_SIMULATION_INPUTS, PRESET_SCENARIOS, parseScenarioParams, formatSignedNumber } from '../utils/simulationUtils'
import { getLatestObservation } from '../utils/economicNormalizer'
import { simulate2035 } from '../services/simulationEngine'
import ScenarioPresets from '../components/simulator/ScenarioPresets'
import GlobalRiskCard from '../components/simulator/GlobalRiskCard'
import SimulationControls from '../components/simulator/SimulationControls'
import ScenarioCharts from '../components/simulator/ScenarioCharts'
import RegionalRisk from '../components/simulator/RegionalRisk'
import CountryImpact from '../components/simulator/CountryImpact'

const liveCountrySeed = [
  { name: 'India', code: 'IND' },
  { name: 'USA', code: 'USA' },
  { name: 'China', code: 'CHN' },
  { name: 'Russia', code: 'RUS' },
  { name: 'Ukraine', code: 'UKR' },
  { name: 'France', code: 'FRA' },
  { name: 'Germany', code: 'DEU' },
  { name: 'Japan', code: 'JPN' },
]

export default function SimulatorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activePreset, setActivePreset] = useState('BASELINE')
  const [inputs, setInputs] = useState<Record<string, number>>(() => parseScenarioParams(location.search))

  const { data: gdpSeries = [] } = useGlobalGDPGrowth()
  const { data: tradeSeries = [] } = useWorldTradeIndicator()

  const marketContext = useMemo(() => {
    const latestGDP = getLatestObservation(gdpSeries)
    const latestTrade = getLatestObservation(tradeSeries)

    return {
      baselineGDPGrowth: Number(latestGDP?.value ?? 3.2),
      tradeIndicator: Number(latestTrade?.value ?? 58),
      countries: liveCountrySeed,
    }
  }, [gdpSeries, tradeSeries])

  const scenario = useMemo(() => simulate2035(inputs, marketContext), [inputs, marketContext])

  const updateInputs = (nextValues: Record<string, number>) => {
    setInputs(nextValues)
    const params = new URLSearchParams()
    Object.entries(nextValues).forEach(([key, value]) => params.set(key, String(value)))
    navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
  }

  const handlePreset = (presetValues: Record<string, number>) => {
    const matchKey = Object.keys(PRESET_SCENARIOS).find((key) => JSON.stringify(PRESET_SCENARIOS[key]) === JSON.stringify(presetValues))
    setActivePreset(matchKey ?? 'CUSTOM')
    updateInputs(presetValues)
  }

  const handleSlider = (key: string, value: number) => {
    const next = { ...inputs, [key]: value }
    setActivePreset('CUSTOM')
    updateInputs(next)
  }

  const handleReset = () => {
    setActivePreset('BASELINE')
    updateInputs(DEFAULT_SIMULATION_INPUTS)
  }

  const handleCopy = async () => {
    const payload = JSON.stringify({ scenario: '2035', inputs, result: scenario }, null, 2)
    try {
      await navigator.clipboard.writeText(payload)
    } catch (error) {
      console.warn('Clipboard copy failed', error)
    }
  }

  const gdpSeriesForChart = [
    { name: '2025', baseline: Number((marketContext.baselineGDPGrowth ?? 3.2).toFixed(2)), scenario: Number((marketContext.baselineGDPGrowth ?? 3.2).toFixed(2)) },
    { name: '2028', baseline: Number((marketContext.baselineGDPGrowth ?? 3.2).toFixed(2)), scenario: Number((marketContext.baselineGDPGrowth + scenario.economicOutlook.delta * 0.45).toFixed(2)) },
    { name: '2031', baseline: Number((marketContext.baselineGDPGrowth ?? 3.2).toFixed(2)), scenario: Number((marketContext.baselineGDPGrowth + scenario.economicOutlook.delta * 0.7).toFixed(2)) },
    { name: '2035', baseline: Number((marketContext.baselineGDPGrowth ?? 3.2).toFixed(2)), scenario: Number((scenario.economicOutlook.scenarioGDPGrowth || marketContext.baselineGDPGrowth).toFixed(2)) },
  ]

  const regionalSeries = scenario.regionalRisks.map((item) => ({ region: item.region, risk: item.risk }))
  const countrySeries = scenario.countryImpacts.map((item) => ({ country: item.country, risk: item.risk }))

  const summaryCards = [
    {
      label: 'GLOBAL RISK',
      value: scenario.globalRisk,
      tone: scenario.globalRisk >= 75 ? 'CRITICAL' : scenario.globalRisk >= 50 ? 'HIGH' : 'MODERATE',
      accent: scenario.globalRisk >= 75 ? '#ff8b7b' : scenario.globalRisk >= 50 ? '#f9c66b' : '#7ee7d4',
    },
    {
      label: 'DIPLOMATIC OUTLOOK',
      value: scenario.diplomaticOutlook.score,
      tone: scenario.diplomaticOutlook.classification,
      accent: '#71d3c8',
    },
    {
      label: 'ALLIANCE STABILITY',
      value: scenario.allianceStability.score,
      tone: scenario.allianceStability.classification,
      accent: '#9ae6b4',
    },
    {
      label: 'ECONOMIC GROWTH',
      value: `${formatSignedNumber(scenario.economicOutlook.delta)}%`,
      tone: scenario.economicOutlook.classification,
      accent: '#f9c66b',
    },
  ]

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="text-[10px] tracking-[0.2em] text-[#9adcd9]">LIVE 2035 SCENARIO MODEL</div>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
            FUTURE WORLD <span className="gradient-text">2035</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-white/15 bg-[#e8dccf] px-4 py-2 text-[10px] tracking-[0.14em] text-[#072427] transition hover:-translate-y-0.5 hover:bg-[#f5ecdf]"
          >
            COPY SCENARIO
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-[#71d3c8]/40 bg-[#0c2f34] px-4 py-2 text-[10px] tracking-[0.14em] text-[#ebf9f5] shadow-[0_0_20px_rgba(113,211,200,0.14)] transition hover:-translate-y-0.5 hover:border-[#9adcd9]"
          >
            RESET
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.45 }}
        className="glass-panel mb-6 rounded-[28px] border border-white/10 p-4 text-[#edf8f4] md:p-5"
      >
        <div className="text-[10px] tracking-[0.18em] text-[#9adcd9]">MODEL INPUTS</div>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-white/75">
          This simulator blends real-world market baselines from live economic APIs with a static geopolitical fallback so it keeps working even when external data is temporarily unavailable.
        </p>
      </motion.div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
            className="glass-card rounded-[24px] border border-white/10 p-4 text-white"
          >
            <div className="text-[10px] tracking-[0.16em] text-white/60">{card.label}</div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="text-3xl font-black tracking-[-0.05em] text-white">{card.value}</div>
              <span
                className="rounded-full border border-white/10 bg-[#0d2a2d] px-2 py-1 text-[9px] tracking-[0.12em]"
                style={{ color: card.accent }}
              >
                {card.tone}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <ScenarioPresets presets={PRESET_SCENARIOS} active={activePreset} onSelect={handlePreset} />
          <SimulationControls inputs={inputs} onChange={handleSlider} onReset={handleReset} />
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <GlobalRiskCard score={scenario.globalRisk} label="GLOBAL RISK" sublabel={scenario.conflictRisk.classification} />
            <GlobalRiskCard score={scenario.conflictRisk.score} label="CONFLICT RISK" sublabel={scenario.conflictRisk.classification} />
            <GlobalRiskCard score={scenario.tradeOutlook.score} label="TRADE PRESSURE" sublabel={scenario.tradeOutlook.scenarioDirection} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="glass-card rounded-[28px] border border-white/10 p-5 text-white"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] tracking-[0.18em] text-white/60">EXPLANATION</div>
              <div className="rounded-full border border-white/10 bg-[#0d2a2d] px-2 py-1 text-[9px] tracking-[0.12em] text-[#9adcd9]">
                LIVE SIGNAL
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/75">{scenario.explanation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {scenario.keyDrivers.map((driver) => (
                <span key={driver.label} className="rounded-full border border-white/10 bg-[#0d2a2d] px-3 py-1 text-[9px] tracking-[0.12em] text-white/80">
                  {driver.label}: {driver.value}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="glass-card rounded-[28px] border border-white/10 p-4 text-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-[10px] tracking-[0.18em] text-white/60">GLOBAL RISK MAP</div>
              <span className="rounded-full border border-white/10 bg-[#0d2a2d] px-2 py-1 text-[9px] tracking-[0.12em] text-[#9adcd9]">API + MODEL</span>
            </div>
            <div className="h-[220px] w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#061d20]">
              <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} className="h-full w-full">
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="rgba(255,255,255,0.06)"
                        stroke="rgba(154,220,217,0.18)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: 'rgba(113,211,200,0.18)', outline: 'none' },
                          pressed: { fill: 'rgba(249,198,107,0.2)', outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </div>

          <ScenarioCharts gdpSeries={gdpSeriesForChart} regionalSeries={regionalSeries} countrySeries={countrySeries} />

          <div className="glass-card rounded-[28px] border border-white/10 p-5 text-white">
            <div className="mb-4 text-[10px] tracking-[0.18em] text-white/60">REGIONAL RISK</div>
            <RegionalRisk regions={scenario.regionalRisks} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-card rounded-[28px] border border-white/10 p-5 text-white">
              <div className="mb-4 text-[10px] tracking-[0.18em] text-white/60">COUNTRY IMPACTS</div>
              <CountryImpact countries={scenario.countryImpacts} />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16, duration: 0.38 }}
              className="rounded-[28px] border border-[#71d3c8]/25 bg-[#0c2f34] p-5 text-[#ebf9f5] shadow-[0_20px_40px_rgba(8,24,28,0.35)]"
            >
              <div className="text-[10px] tracking-[0.18em] text-[#9adcd9]">STRATEGIC READOUT</div>
              <div className="mt-5 space-y-4 text-sm leading-6 text-white/80">
                <div>
                  <div className="text-[10px] tracking-[0.14em] text-[#9adcd9]">DIPLOMACY</div>
                  <div className="mt-1 font-medium">{scenario.diplomaticOutlook.shortExplanation}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.14em] text-[#9adcd9]">TRADE</div>
                  <div className="mt-1 font-medium">{scenario.tradeOutlook.modelledImpact}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.14em] text-[#9adcd9]">ECONOMY</div>
                  <div className="mt-1 font-medium">
                    Baseline growth: {scenario.economicOutlook.baselineGDPGrowth}% • Scenario: {scenario.economicOutlook.scenarioGDPGrowth}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.14em] text-[#9adcd9]">ALLIANCE</div>
                  <div className="mt-1 font-medium">
                    Alliance stability stands at {scenario.allianceStability.score}, classified as {scenario.allianceStability.classification}.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-[#071e20] p-4 text-sm leading-6 text-white/75 md:p-5">
        <div className="text-[10px] tracking-[0.2em] text-[#9adcd9]">DISCLAIMER</div>
        <p className="mt-2 max-w-5xl">
          This model is illustrative and scenario-based. It uses current API baselines whenever available and falls back to a static model when needed so the simulator remains stable and usable.
        </p>
      </div>
    </div>
  )
}
