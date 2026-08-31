import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCountries } from '../hooks/useCountries'
import CountryCard from '../components/country/CountryCard'
import CountrySearch from '../components/country/CountrySearch'
import CountryFilters from '../components/country/CountryFilters'

export default function CountriesPage() {
    const navigate = useNavigate()
    const { data: countries = [], isLoading, isError } = useCountries()
    const [query, setQuery] = useState('')
    const [region, setRegion] = useState('All')

    const filteredCountries = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        return countries.filter((country) => {
            const matchesQuery = !normalized || country.name.toLowerCase().includes(normalized) || country.region.toLowerCase().includes(normalized) || country.code.toLowerCase().includes(normalized)
            const matchesRegion = region === 'All' || country.region === region
            return matchesQuery && matchesRegion
        })
    }, [countries, query, region])

    const handleOpenCountry = (code) => navigate(`/country/${code}`)

    if (isLoading) {
        return (
            <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
                <div className="rounded-[28px] border border-white/10 bg-[#081a1d]/70 p-8 text-center text-white/75">Loading country intelligence...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
                <div className="rounded-[28px] border border-[#ff8b7b]/30 bg-[#1b0e0b]/40 p-8 text-center text-white">
                    <div className="text-[10px] tracking-[0.18em] text-[#ff8b7b]">DATA ERROR</div>
                    <h2 className="grotesk mt-3 text-4xl font-bold">Country dataset unavailable</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 lg:px-12">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="text-[10px] tracking-[0.2em] text-[#7ee7d4]">GEOPOLIS COUNTRIES</div>
                    <h2 className="grotesk mt-2 text-4xl font-bold text-white md:text-5xl">Country network</h2>
                </div>
                <div className="rounded-full border border-[#7ee7d4]/30 bg-[#7ee7d4]/10 px-3 py-2 text-[10px] tracking-[0.18em] text-[#7ee7d4]">
                    {filteredCountries.length} ACTIVE COUNTRIES
                </div>
            </div>

            <div className="glass-panel rounded-[28px] p-4 md:p-5">
                <div className="grid gap-4 xl:grid-cols-[1.1fr_1.8fr]">
                    <CountrySearch value={query} onChange={setQuery} />
                    <CountryFilters value={region} onChange={setRegion} />
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCountries.map((country) => (
                    <CountryCard key={country.code} country={country} onSelect={handleOpenCountry} />
                ))}
            </div>

            {!filteredCountries.length && (
                <div className="mt-8 rounded-[24px] border border-white/10 bg-[#081a1d]/70 p-8 text-center text-white/70">
                    No countries match your current filters.
                </div>
            )}
        </div>
    )
}
