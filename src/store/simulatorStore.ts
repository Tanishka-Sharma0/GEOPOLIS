import { create } from 'zustand'

type ScenarioResult = {
  stability: number
  tradeRisk: number
  militaryTension: number
  powerShift: number
  indiaMomentum: number
  chinaPressure: number
  label: string
}

type S = {
  india: number
  china: number
  usa: number
  oil: number
  trade: number
  tension: number
  alliance: number
  energy: number
  climate: number
  isRunning: boolean
  progress: number
  results: ScenarioResult
  set: (k: string, v: number) => void
  run: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function buildScenario(state: Omit<S, 'isRunning' | 'progress' | 'results' | 'set' | 'run'>): ScenarioResult {
  const stability = clamp(
    76 + state.alliance * 0.26 + state.trade * 0.18 - state.tension * 0.42 - state.climate * 0.2 - state.oil * 0.12,
    10,
    98,
  )

  const tradeRisk = clamp(
    32 + (100 - state.trade) * 0.46 + state.tension * 0.24 + state.oil * 0.18 - state.alliance * 0.14,
    8,
    95,
  )

  const militaryTension = clamp(
    state.tension + (100 - state.alliance) * 0.22 + state.usa * 0.08 + state.energy * 0.06 - state.trade * 0.1,
    10,
    99,
  )

  const powerShift = clamp(
    (state.india - state.china) * 0.8 + state.trade * 0.22 - state.oil * 0.18 + state.alliance * 0.18,
    -35,
    58,
  )

  const indiaMomentum = clamp(state.india + state.trade * 0.28 - state.tension * 0.12, 0, 100)
  const chinaPressure = clamp(state.china + state.tension * 0.26 - state.alliance * 0.1, 0, 100)

  let label = 'STABLE'
  if (tradeRisk > 70 || militaryTension > 75) label = 'CRITICAL'
  else if (stability < 50 || powerShift > 30) label = 'HIGH VOLATILITY'
  else if (stability < 68) label = 'WATCH'

  return {
    stability: Math.round(stability),
    tradeRisk: Math.round(tradeRisk),
    militaryTension: Math.round(militaryTension),
    powerShift: Math.round(powerShift),
    indiaMomentum: Math.round(indiaMomentum),
    chinaPressure: Math.round(chinaPressure),
    label,
  }
}

const initialState = {
  india: 78,
  china: 62,
  usa: 72,
  oil: 55,
  trade: 68,
  tension: 68,
  alliance: 64,
  energy: 59,
  climate: 71,
}

export const useSimulatorStore = create<S>((set, get) => ({
  ...initialState,
  isRunning: false,
  progress: 0,
  results: buildScenario(initialState),
  set: (k, v) => {
    const current = get()
    const nextValues = { ...current, [k]: v }
    const { india, china, usa, oil, trade, tension, alliance, energy, climate } = nextValues
    set({
      [k]: v,
      results: buildScenario({ india, china, usa, oil, trade, tension, alliance, energy, climate }),
    } as any)
  },
  run: () => {
    const current = get()
    set({
      isRunning: true, progress: 0, results: buildScenario({
        india: current.india,
        china: current.china,
        usa: current.usa,
        oil: current.oil,
        trade: current.trade,
        tension: current.tension,
        alliance: current.alliance,
        energy: current.energy,
        climate: current.climate,
      })
    })

    const id = setInterval(() => {
      const p = get().progress + 16
      if (p >= 100) {
        const final = buildScenario({
          india: get().india,
          china: get().china,
          usa: get().usa,
          oil: get().oil,
          trade: get().trade,
          tension: get().tension,
          alliance: get().alliance,
          energy: get().energy,
          climate: get().climate,
        })
        set({ progress: 100, isRunning: false, results: final })
        clearInterval(id)
      } else {
        set({ progress: p })
      }
    }, 180)
  },
}))

