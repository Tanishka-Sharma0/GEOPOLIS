export function normalizeTreaty(raw = {}) {
    const members = Array.isArray(raw.members) ? raw.members.filter(Boolean) : []

    return {
        id: raw.id || `${(raw.name || 'treaty').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${raw.year || 'unknown'}`,
        name: raw.name || 'Untitled Treaty',
        organization: raw.organization || 'Unknown Organization',
        type: raw.type || 'Strategic',
        year: Number(raw.year) || new Date().getFullYear(),
        status: raw.status || 'Active',
        members,
        summary: raw.summary || 'No summary provided.',
        timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
    }
}

export function normalizeTreaties(rawTreaties = []) {
    if (!Array.isArray(rawTreaties)) return []
    return rawTreaties.map(normalizeTreaty)
}
