import { normalizeTreaties } from '../utils/treatyNormalizer'

const treatyUrl = `${import.meta.env.BASE_URL || '/'}data/treaties.json`

async function fetchTreatyList() {
    const response = await fetch(treatyUrl, { cache: 'force-cache' })

    if (!response.ok) {
        throw new Error('Unable to load treaties dataset.')
    }

    const payload = await response.json()
    return normalizeTreaties(Array.isArray(payload) ? payload : [])
}

export async function getTreaties() {
    return fetchTreatyList()
}

export async function getTreatyById(id) {
    const treaties = await getTreaties()
    return treaties.find((treaty) => treaty.id === id) || null
}

export async function getTreatiesByCountry(country) {
    const treaties = await getTreaties()
    const normalizedCountry = country?.trim()
    if (!normalizedCountry) return []

    return treaties.filter((treaty) =>
        treaty.members.some((member) => member.toLowerCase() === normalizedCountry.toLowerCase())
    )
}

export async function getTreatiesByOrganization(organization) {
    const treaties = await getTreaties()
    const normalizedOrganization = organization?.trim()
    if (!normalizedOrganization) return treaties

    return treaties.filter(
        (treaty) => treaty.organization.toLowerCase() === normalizedOrganization.toLowerCase()
    )
}

export async function getRelatedTreaties(treaty) {
    if (!treaty) return []

    const treaties = await getTreaties()
    const memberSet = new Set((treaty.members || []).map((member) => member.toLowerCase()))

    return treaties
        .filter((candidate) => candidate.id !== treaty.id)
        .map((candidate) => ({
            ...candidate,
            sharedMembers: (candidate.members || []).filter((member) => memberSet.has(member.toLowerCase())),
        }))
        .filter((candidate) => candidate.sharedMembers.length > 0)
        .sort((a, b) => b.sharedMembers.length - a.sharedMembers.length)
}
