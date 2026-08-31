import { useQuery } from '@tanstack/react-query'
import { getSanctions } from '../services/sanctionsService'
import { normalizeSanctions } from '../utils/sanctionsNormalizer'

export function useSanctions() {
    return useQuery({
        queryKey: ['sanctions'],
        queryFn: async () => {
            const rawData = await getSanctions()
            return normalizeSanctions(rawData)
        },
        staleTime: 1000 * 60 * 60 * 12,
        gcTime: 1000 * 60 * 60 * 24,
    })
}
