const sanctionsUrl = `${import.meta.env.BASE_URL || '/'}data/sanctions.json`

async function fetchSanctionsData() {
    const response = await fetch(sanctionsUrl, {
        cache: 'force-cache',
    })

    if (!response.ok) {
        throw new Error('Unable to load sanctions dataset.')
    }

    const payload = await response.json()
    return Array.isArray(payload) ? payload : []
}

export async function getSanctions() {
    return fetchSanctionsData()
}
