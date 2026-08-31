const FALLBACK_CURRENTS_API_KEY = 'dBcWlBKRQlN1iOwHaxVca7vPGMmhDXLj7A3domkSe5OHAjnc'

export const CURRENTS_API_KEY =
    (import.meta.env.VITE_CURRENTS_API_KEY as string | undefined) ?? FALLBACK_CURRENTS_API_KEY

export const CURRENTS_API_BASE = 'https://api.currentsapi.services/v1/search'
export const DEFAULT_INTELLIGENCE_QUERY = 'geopolitics'
