import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ScenarioCharts({ gdpSeries, regionalSeries, countrySeries }) {
    return (
        <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-[24px] border border-[#CBB9A6] bg-[#E8DCCF] p-4">
                <div className="mb-3 text-[10px] tracking-[0.16em] text-[#18363A]/70">GDP BASELINE VS SCENARIO</div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gdpSeries}>
                            <CartesianGrid stroke="#18363A20" strokeDasharray="4 4" />
                            <XAxis dataKey="name" stroke="#18363A" />
                            <YAxis stroke="#18363A" domain={[-5, 10]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="baseline" stroke="#18363A" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="scenario" stroke="#D95C4F" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="rounded-[24px] border border-[#CBB9A6] bg-[#E8DCCF] p-4">
                <div className="mb-3 text-[10px] tracking-[0.16em] text-[#18363A]/70">REGIONAL RISK MODEL</div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionalSeries}>
                            <CartesianGrid stroke="#18363A20" strokeDasharray="4 4" />
                            <XAxis dataKey="region" stroke="#18363A" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#18363A" domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="risk" fill="#18363A" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="xl:col-span-2 rounded-[24px] border border-[#CBB9A6] bg-[#E8DCCF] p-4">
                <div className="mb-3 text-[10px] tracking-[0.16em] text-[#18363A]/70">COUNTRY IMPACT MODEL</div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={countrySeries}>
                            <CartesianGrid stroke="#18363A20" strokeDasharray="4 4" />
                            <XAxis dataKey="country" stroke="#18363A" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#18363A" domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="risk" fill="#D95C4F" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
