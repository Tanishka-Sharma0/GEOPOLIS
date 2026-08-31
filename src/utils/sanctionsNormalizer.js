export function normalizeSanction(raw = {}) {
    const date = raw.date || raw.year || ''

    return {
        id: raw.id || `${(raw.issuer || 'issuer')}-${(raw.target || 'target')}-${date || 'unknown'}`,
        issuer: raw.issuer || 'Unknown issuer',
        target: raw.target || 'Unknown target',
        sector: raw.sector || 'General',
        type: raw.type || 'Sanction',
        date: date || 'Unknown date',
        reason: raw.reason || 'No reason specified',
        estimatedImpact: raw.estimatedImpact || 'No estimate',
        status: raw.status || 'Active',
    }
}

export function normalizeSanctions(rawSanctions = []) {
    if (!Array.isArray(rawSanctions)) return []
    return rawSanctions.map(normalizeSanction)
}
