import { useQuery } from '@tanstack/react-query'
import { getCountries, getCountryByCode } from '../services/countryService'

export function useCountries() {
    return useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 12,
    })
}

export function useCountry(code) {
    return useQuery({
        queryKey: ['country', code],
        queryFn: () => getCountryByCode(code),
        enabled: Boolean(code),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 12,
    })
}
