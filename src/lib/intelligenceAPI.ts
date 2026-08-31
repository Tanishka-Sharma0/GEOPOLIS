import { CURRENTS_API_BASE, CURRENTS_API_KEY, DEFAULT_INTELLIGENCE_QUERY } from './intelligenceConfig'
import { intelligenceEvents as fallbackEvents } from './intelligenceData'

export type CurrentsArticle = {
    title?: string
    description?: string
    url?: string
    source?: {
        name?: string
    }
    published_at?: string
    country?: string
    category?: string
    image?: string
}

export type NormalizedCurrentEvent = {
    id: string
    title: string
    description: string
    url: string
    source: string
    publishedAt: string
    country: string
    countryCode: string
    category: 'conflict' | 'diplomacy' | 'economy' | 'military' | 'sanctions' | 'general'
    imageUrl?: string
}

const categoryKeywords: Record<string, string[]> = {
    conflict: ['war', 'attack', 'missile', 'airstrike', 'invasion', 'battle', 'troops', 'bombing', 'military conflict'],
    diplomacy: ['summit', 'negotiation', 'peace talks', 'ceasefire', 'agreement', 'treaty', 'dialogue', 'diplomatic', 'foreign ministers'],
    economy: ['trade', 'economy', 'market', 'energy', 'currency', 'supply chain', 'shipping', 'inflation'],
    military: ['military', 'defense', 'naval', 'drill', 'logistics', 'security', 'troop movement'],
    sanctions: ['sanctions', 'embargo', 'restrictions', 'sanction', 'trade restrictions'],
}

const countryCodeMap: Record<string, string> = {
    india: 'IN',
    ukraine: 'UA',
    russia: 'RU',
    china: 'CN',
    israel: 'IL',
    palestine: 'PS',
    sudan: 'SD',
    france: 'FR',
    germany: 'DE',
    japan: 'JP',
    usa: 'US',
    'united states': 'US',
    'united states of america': 'US',
}

function detectCategory(text: string): NormalizedCurrentEvent['category'] {
    const normalized = text.toLowerCase()

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((keyword) => normalized.includes(keyword))) return category as NormalizedCurrentEvent['category']
    }

    return 'general'
}

function detectCountry(text: string, fallbackCountry: string): string {
    const candidate = text.toLowerCase()
    const match = Object.keys(countryCodeMap).find((country) => candidate.includes(country))
    return match ? match.charAt(0).toUpperCase() + match.slice(1) : fallbackCountry
}

function normalizeArticle(article: CurrentsArticle, fallbackCountry = 'Global'): NormalizedCurrentEvent {
    const title = article.title ?? 'Untitled update'
    const description = article.description ?? 'No summary available.'
    const source = article.source?.name ?? 'Currents API'
    const publishedAt = article.published_at ?? new Date().toISOString()
    const category = detectCategory(`${title} ${description}`)
    const countryName = article.country ?? detectCountry(`${title} ${description}`, fallbackCountry)
    const countryCode = countryCodeMap[countryName.toLowerCase()] ?? 'GL'

    return {
        id: `${countryCode}-${publishedAt}-${title}`,
        title,
        description,
        url: article.url ?? '#',
        source,
        publishedAt,
        country: countryName,
        countryCode,
        category,
        imageUrl: article.image,
    }
}

async function fetchCurrentsArticles(keyword = DEFAULT_INTELLIGENCE_QUERY) {
    if (!CURRENTS_API_KEY) {
        return fallbackEvents
    }

    const url = `${CURRENTS_API_BASE}?keywords=${encodeURIComponent(keyword)}&language=en&page_size=10`

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: CURRENTS_API_KEY,
                Accept: 'application/json',
            },
        })

        if (!response.ok) {
            return fallbackEvents
        }

        const json = await response.json()
        const items = Array.isArray(json?.news) ? json.news : Array.isArray(json?.articles) ? json.articles : []

        if (!items.length) {
            return fallbackEvents
        }

        return items.map((item: CurrentsArticle, index: number) => normalizeArticle(item, keyword === 'India' ? 'India' : `Region ${index + 1}`))
    } catch (error) {
        return fallbackEvents
    }
}

export async function getIntelligenceFeed(query = DEFAULT_INTELLIGENCE_QUERY) {
    const data = await fetchCurrentsArticles(query)
    return data
}

export async function getIntelligenceDashboardData() {
    const [geopolitics, conflict, military, diplomacy, sanctions, countryQuery] = await Promise.all([
        fetchCurrentsArticles('geopolitics'),
        fetchCurrentsArticles('conflict'),
        fetchCurrentsArticles('military'),
        fetchCurrentsArticles('diplomacy'),
        fetchCurrentsArticles('sanctions'),
        fetchCurrentsArticles('India'),
    ])

    return {
        all: geopolitics,
        conflict,
        military,
        diplomacy,
        sanctions,
        country: countryQuery,
        isLive: Boolean(CURRENTS_API_KEY),
    }
}
