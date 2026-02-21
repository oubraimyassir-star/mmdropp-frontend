'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

// Business Case 1: SaaS Revenue Tracking (Detailed wavy pattern with micro-fluctuations)
const revenueData = [
    { value: 15000 }, { value: 18000 }, { value: 25000 }, { value: 32000 }, { value: 35000 }, { value: 28000 },
    { value: 20000 }, { value: 12000 }, { value: 5000 }, { value: -2000 }, { value: -10000 }, { value: -18000 },
    { value: -25000 }, { value: -22000 }, { value: -15000 }, { value: -8000 }, { value: 0 }, { value: 8000 },
    { value: 20000 }, { value: 28000 }, { value: 40000 }, { value: 48000 }, { value: 50000 }, { value: 45000 },
    { value: 35000 }, { value: 25000 }, { value: 15000 }, { value: 2000 }, { value: -5000 }, { value: -12000 },
    { value: -20000 }, { value: -28000 }, { value: -30000 }, { value: -25000 }, { value: -15000 }, { value: -5000 },
    { value: 10000 }, { value: 22000 }, { value: 35000 }, { value: 45000 }, { value: 55000 }, { value: 52000 },
    { value: 45000 }, { value: 35000 }, { value: 25000 }, { value: 12000 }, { value: 5000 }, { value: -8000 },
    { value: -15000 }, { value: -12000 }, { value: -5000 }, { value: 3000 }, { value: 15000 }, { value: 25000 },
    { value: 20000 }, { value: 10000 }, { value: -2000 }, { value: -15000 }, { value: -20000 }, { value: -15000 },
];

// Business Case 2: E-commerce Conversion Rate (Detailed sine wave with micro-variations)
const conversionData = [
    { value: 0 }, { value: 0.8 }, { value: 1.5 }, { value: 2.2 }, { value: 2.8 }, { value: 3.2 },
    { value: 3.5 }, { value: 3.4 }, { value: 3.2 }, { value: 2.6 }, { value: 2.0 }, { value: 1.2 },
    { value: 0.5 }, { value: -0.2 }, { value: -1.2 }, { value: -1.8 }, { value: -2.5 }, { value: -2.8 },
    { value: -3.0 }, { value: -2.9 }, { value: -2.8 }, { value: -2.2 }, { value: -1.5 }, { value: -0.8 },
    { value: 0.2 }, { value: 1.0 }, { value: 2.0 }, { value: 2.8 }, { value: 3.5 }, { value: 3.9 },
    { value: 4.2 }, { value: 4.1 }, { value: 3.8 }, { value: 3.2 }, { value: 2.5 }, { value: 1.5 },
    { value: 0.8 }, { value: 0.2 }, { value: -1.0 }, { value: -1.6 }, { value: -2.5 }, { value: -2.9 },
    { value: -3.2 }, { value: -3.0 }, { value: -2.0 }, { value: -1.2 }, { value: 0 }, { value: 1.2 },
    { value: 2.5 }, { value: 3.5 }, { value: 4.0 }, { value: 3.8 }, { value: 2.8 }, { value: 1.5 },
    { value: 0.5 }, { value: -0.8 }, { value: -2.0 }, { value: -2.8 }, { value: -2.5 }, { value: -1.0 },
];

// Business Case 3: Server Performance Monitoring (Detailed oscillating decline with volatility)
const performanceData = [
    { value: 5 }, { value: 8 }, { value: 10 }, { value: 12 }, { value: 8 }, { value: 5 },
    { value: 3 }, { value: 0 }, { value: -2 }, { value: -5 }, { value: -8 }, { value: -10 },
    { value: -12 }, { value: -10 }, { value: -8 }, { value: -5 }, { value: -3 }, { value: 0 },
    { value: 2 }, { value: 4 }, { value: 6 }, { value: 7 }, { value: 4 }, { value: 1 },
    { value: -1 }, { value: -4 }, { value: -6 }, { value: -8 }, { value: -10 }, { value: -11 },
    { value: -12 }, { value: -10 }, { value: -8 }, { value: -6 }, { value: -4 }, { value: -2 },
    { value: 1 }, { value: 3 }, { value: 5 }, { value: 6 }, { value: 3 }, { value: 0 },
    { value: -2 }, { value: -5 }, { value: -7 }, { value: -9 }, { value: -11 }, { value: -13 },
    { value: -15 }, { value: -13 }, { value: -11 }, { value: -8 }, { value: -5 }, { value: -2 },
    { value: 0 }, { value: -3 }, { value: -6 }, { value: -9 }, { value: -12 }, { value: -15 },
];

const businessCards = [
    {
        title: 'Solde Total',
        metric: 'Portefeuille actuel',
        baseValue: '0.00 MAD',
        baseCurrency: 'Min',
        targetValue: '1,240.50 MAD',
        targetCurrency: 'Actuel',
        data: revenueData,
        change: 'Croissance',
        isPositive: true,
        color: 'var(--color-emerald-500)',
    },
    {
        title: 'Commandes',
        metric: 'Volume de ventes',
        baseValue: '45',
        baseCurrency: 'Mois préc.',
        targetValue: '128',
        targetCurrency: 'Ce mois',
        data: conversionData,
        change: 'Stable',
        isPositive: true,
        color: 'var(--color-blue-500)',
    },
    {
        title: 'Affiliation',
        metric: 'Revenus partenaires',
        baseValue: '50.00 MAD',
        baseCurrency: 'Base',
        targetValue: '324.00 MAD',
        targetCurrency: 'Actuel',
        data: performanceData,
        change: 'Actif',
        isPositive: true,
        color: 'var(--color-gold-400)',
    },
];

export function LineChart8() {
    return (
        <div className="w-full">
            <div className="@container grow w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businessCards.map((card, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardContent className="flex flex-col gap-6 p-6">
                                <div className="flex flex-col">
                                    <h3 className="text-base font-semibold text-[#ECF1F4] m-0">{card.title}</h3>
                                    <p className="text-sm text-muted-foreground m-0">{card.metric}</p>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-center min-w-[60px]">
                                        <div className="text-lg font-semibold text-[#ECF1F4]">{card.baseValue}</div>
                                        <div className="text-xs text-muted-foreground font-medium">{card.baseCurrency}</div>
                                    </div>

                                    <div className="flex-1 h-14 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={card.data}
                                                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                            >
                                                <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                                                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="3 3" />
                                                <Tooltip
                                                    cursor={{ stroke: card.color, strokeWidth: 1, strokeDasharray: '2 2' }}
                                                    content={({ active, payload, coordinate }) => {
                                                        if (active && payload && payload.length && coordinate) {
                                                            const value = payload[0].value as number;
                                                            const formatValue = (val: number) => {
                                                                if (card.title === 'Revenue Variance') return val >= 0 ? `+$${val.toLocaleString()}` : `-$${Math.abs(val).toLocaleString()}`;
                                                                if (card.title === 'Conversion Change') return val >= 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`;
                                                                return val >= 0 ? `+${val}%` : `${val}%`;
                                                            };
                                                            return (
                                                                <div className="bg-black/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-lg p-2 pointer-events-none z-50">
                                                                    <p className="text-sm font-bold text-white leading-tight">{formatValue(value)}</p>
                                                                    <p className="text-[10px] text-zinc-400">{card.title}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke={card.color}
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={{ r: 4, fill: card.color, stroke: '#fff', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="text-center min-w-[60px]">
                                        <div className="text-lg font-semibold text-[#ECF1F4]">{card.targetValue}</div>
                                        <div className="text-xs text-muted-foreground font-medium">{card.targetCurrency}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
