import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

export default function CountryGDPChart({
    data,
    countryName,
    isLoading,
    isError,
}: {
    data: Array<{ year: number; value: number }>
    countryName: string
    isLoading: boolean
    isError: boolean
}) {
    if (isLoading) return <LoadingState message={`Loading ${countryName} GDP data...`} />
    if (isError) return <ErrorState message={`Could not load ${countryName} GDP growth data.`} />
    if (!data || data.length === 0) return <EmptyState message={`${countryName}: No data available`} />

    return (
        <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 12 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{
                            background: '#0b272b',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '12px',
                            color: '#ebf9f5',
                        }}
                        formatter={(value: number) => [`${Number(value).toFixed(2)}%`, 'GDP Growth']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#f9c66b" strokeWidth={3} dot={{ r: 3 }} connectNulls />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
