export type IntelligenceCategory = 'conflict' | 'diplomacy' | 'economy' | 'military' | 'sanctions' | 'general'

export type NormalizedEvent = {
    id: string
    title: string
    description: string
    url: string
    source: string
    publishedAt: string
    country: string
    countryCode: string
    category: IntelligenceCategory
    imageUrl?: string
}

export type CountryMeta = {
    name: string
    code: string
    coordinates: [number, number]
    region: string
}

const rawApiEvents = [
    {
        title: 'Ukraine conflict escalates as missile strikes intensify',
        description: 'Fresh strikes near critical infrastructure trigger renewed military alerts across the region.',
        url: 'https://example.com/articles/ukraine-missile-strikes',
        source: 'Reuters',
        publishedAt: '2026-08-30T14:20:00Z',
        country: 'Ukraine',
        countryCode: 'UA',
        category: 'conflict',
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'India and US hold strategic dialogue on trade and security',
        description: 'Officials discussed supply chains, defence cooperation, and regional stability in a high-level meeting.',
        url: 'https://example.com/articles/india-us-dialogue',
        source: 'Bloomberg',
        publishedAt: '2026-08-30T12:45:00Z',
        country: 'India',
        countryCode: 'IN',
        category: 'diplomacy',
        imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Middle East ceasefire talks resume after latest escalation',
        description: 'Regional mediators pushed a new round of negotiations to stabilise border tensions and reduce hostilities.',
        url: 'https://example.com/articles/middle-east-ceasefire',
        source: 'Al Jazeera',
        publishedAt: '2026-08-30T11:10:00Z',
        country: 'Israel',
        countryCode: 'IL',
        category: 'diplomacy',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Sudan military activity raises regional instability concerns',
        description: 'Armed confrontation and air strikes are intensifying local security pressure.',
        url: 'https://example.com/articles/sudan-military-activity',
        source: 'AP',
        publishedAt: '2026-08-30T09:30:00Z',
        country: 'Sudan',
        countryCode: 'SD',
        category: 'conflict',
        imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'China expands military drills around disputed sea lanes',
        description: 'Naval exercises and missile maneuvers triggered renewed concern in strategic shipping corridors.',
        url: 'https://example.com/articles/china-drills',
        source: 'FT',
        publishedAt: '2026-08-29T18:05:00Z',
        country: 'China',
        countryCode: 'CN',
        category: 'military',
        imageUrl: 'https://images.unsplash.com/photo-1526481280695-3c4691d6f8f2?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Russia and Europe discuss gas supply deal after price spike',
        description: 'Energy talks seek a new framework for supply reliability and price stabilization.',
        url: 'https://example.com/articles/russia-europe-gas',
        source: 'Reuters',
        publishedAt: '2026-08-29T16:40:00Z',
        country: 'Russia',
        countryCode: 'RU',
        category: 'economy',
        imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'US expands sanctions package over strategic technology transfer',
        description: 'New restrictions target key supply chain sectors as geopolitical pressure intensifies.',
        url: 'https://example.com/articles/us-sanctions-package',
        source: 'WSJ',
        publishedAt: '2026-08-29T15:25:00Z',
        country: 'United States',
        countryCode: 'US',
        category: 'sanctions',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'France and Germany announce joint security coordination plan',
        description: 'Leaders aligned on defense procurement, logistics and intelligence-sharing to stabilize the region.',
        url: 'https://example.com/articles/france-germany-security-plan',
        source: 'Politico',
        publishedAt: '2026-08-28T20:15:00Z',
        country: 'France',
        countryCode: 'FR',
        category: 'diplomacy',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Japan boosts maritime patrols after regional security alert',
        description: 'Authorities increased surveillance activity around disputed waters and trade corridors.',
        url: 'https://example.com/articles/japan-patrols',
        source: 'Nikkei',
        publishedAt: '2026-08-28T10:00:00Z',
        country: 'Japan',
        countryCode: 'JP',
        category: 'military',
        imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Border clash raises risk of wider escalation in eastern region',
        description: 'Security officials reported fresh confrontations and troop movement near the frontier.',
        url: 'https://example.com/articles/border-clash',
        source: 'Reuters',
        publishedAt: '2026-08-27T19:30:00Z',
        country: 'Ukraine',
        countryCode: 'UA',
        category: 'conflict',
        imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Asia summit to address supply resilience and trade corridors',
        description: 'Regional leaders plan a diplomatic push to reduce friction and improve logistics cooperation.',
        url: 'https://example.com/articles/asia-summit',
        source: 'The Guardian',
        publishedAt: '2026-08-27T08:15:00Z',
        country: 'India',
        countryCode: 'IN',
        category: 'diplomacy',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'New sanctions wave targets strategic shipping networks',
        description: 'Trade restrictions are expected to affect transshipment routes and freight prices.',
        url: 'https://example.com/articles/shipping-sanctions',
        source: 'Financial Times',
        publishedAt: '2026-08-26T14:55:00Z',
        country: 'China',
        countryCode: 'CN',
        category: 'sanctions',
        imageUrl: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=800&q=80',
    }
]

const normalizeEvent = (event: any): NormalizedEvent => ({
    id: `${event.countryCode}-${event.publishedAt}-${event.title}`,
    title: event.title,
    description: event.description,
    url: event.url,
    source: event.source,
    publishedAt: event.publishedAt,
    country: event.country,
    countryCode: event.countryCode,
    category: event.category,
    imageUrl: event.imageUrl,
})

export const intelligenceEvents = rawApiEvents.map(normalizeEvent)

export const countryMeta: Record<string, CountryMeta> = {
    India: { name: 'India', code: 'IN', coordinates: [78.9629, 22.5937], region: 'South Asia' },
    Ukraine: { name: 'Ukraine', code: 'UA', coordinates: [31.1656, 48.3794], region: 'Europe' },
    Israel: { name: 'Israel', code: 'IL', coordinates: [34.8516, 31.0461], region: 'Middle East' },
    Sudan: { name: 'Sudan', code: 'SD', coordinates: [30.2176, 15.8905], region: 'Africa' },
    China: { name: 'China', code: 'CN', coordinates: [104.1954, 35.8617], region: 'East Asia' },
    Russia: { name: 'Russia', code: 'RU', coordinates: [105.3188, 61.524], region: 'Eurasia' },
    'United States': { name: 'United States', code: 'US', coordinates: [-95.7129, 37.0902], region: 'North America' },
    France: { name: 'France', code: 'FR', coordinates: [2.2137, 46.2276], region: 'Europe' },
    Japan: { name: 'Japan', code: 'JP', coordinates: [138.2529, 36.2048], region: 'East Asia' },
}

export const countryOptions = Object.keys(countryMeta)

export const intelligenceStore = {
    isLive: true,
    events: intelligenceEvents,
    updatedAt: '2026-08-30T14:30:00Z',
}
