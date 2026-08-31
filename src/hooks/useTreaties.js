import { useQuery } from '@tanstack/react-query'
import { getTreaties, getTreatyById } from '../services/treatyService'

export function useTreaties() {
    return useQuery({
        queryKey: ['treaties'],
        queryFn: getTreaties,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
    })
}

export function useTreaty(id) {
    return useQuery({
        queryKey: ['treaty', id],
        queryFn: () => getTreatyById(id),
        enabled: Boolean(id),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
    })
}
