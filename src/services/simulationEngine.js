import { clampNumber, getAllianceBand, getDiplomaticBand, getRiskBand } from '../utils/simulationUtils'

export function simulate2035(inputs = {}, currentData = {}) {
    const tension = Number(inputs.tension ?? 50)
    const tradeRestrictions = Number(inputs.tradeRestrictions ?? 30)
    const sanctions = Number(inputs.sanctions ?? 30)
    const militaryEscalation = Number(inputs.militaryEscalation ?? 35)
    const diplomaticCooperation = Number(inputs.diplomaticCooperation ?? 55)
    const economicGrowth = Number(inputs.economicGrowth ?? 3)
    const energyPressure = Number(inputs.energyPressure ?? 50)
    const technologyDecoupling = Number(inputs.technologyDecoupling ?? 30)

    const globalRisk = clampNumber(
        tension * 0.2 +
        sanctions * 0.15 +
        militaryEscalation * 0.2 +
        tradeRestrictions * 0.1 +
        energyPressure * 0.1 +
        technologyDecoupling * 0.1 -
        diplomaticCooperation * 0.15,
        0,
        100,
    )

    const baselineGDPGrowth = Number(currentData.baselineGDPGrowth ?? currentData.globalGDPGrowth ?? 3)
    const scenarioGDPGrowth = clampNumber(
        baselineGDPGrowth -
        tradeRestrictions * 0.06 -
        sanctions * 0.04 -
        tension * 0.03 -
        energyPressure * 0.04 -
        technologyDecoupling * 0.04 +
        diplomaticCooperation * 0.05,
        -5,
        10,
    )

    const delta = Number((scenarioGDPGrowth - baselineGDPGrowth).toFixed(2))
    const conflictRisk = clampNumber(
        militaryEscalation * 0.38 +
        tension * 0.27 +
        sanctions * 0.22 +
        (100 - diplomaticCooperation) * 0.18,
        0,
        100,
    )

    const diplomaticScore = clampNumber(
        diplomaticCooperation * 0.42 +
        (100 - militaryEscalation) * 0.22 +
        (100 - tension) * 0.18 +
        (100 - tradeRestrictions) * 0.18,
        0,
        100,
    )

    const tradeIndicator = Number(currentData.tradeIndicator ?? 58)
    const tradePressure = clampNumber(
        tradeRestrictions * 0.55 +
        sanctions * 0.25 +
        energyPressure * 0.12 +
        technologyDecoupling * 0.18,
        0,
        100,
    )

    const allianceScore = clampNumber(
        diplomaticCooperation * 0.36 +
        (100 - militaryEscalation) * 0.28 +
        (100 - tension) * 0.22 +
        (100 - technologyDecoupling) * 0.14,
        0,
        100,
    )

    const regionalRisks = [
        { region: 'Europe', risk: clampNumber((tension * 0.2) + (sanctions * 0.18) + (energyPressure * 0.17) + (tradeRestrictions * 0.12) + (100 - diplomaticCooperation) * 0.12, 0, 100), mainDriver: 'energy pressure and trade disruption' },
        { region: 'Middle East', risk: clampNumber((energyPressure * 0.32) + (militaryEscalation * 0.25) + (tension * 0.14) + (sanctions * 0.12), 0, 100), mainDriver: 'energy shock and regional escalation' },
        { region: 'Indo-Pacific', risk: clampNumber((tension * 0.24) + (militaryEscalation * 0.2) + (technologyDecoupling * 0.18) + (tradeRestrictions * 0.15), 0, 100), mainDriver: 'strategic competition and supply chain friction' },
        { region: 'South Asia', risk: clampNumber((tension * 0.18) + (tradeRestrictions * 0.16) + (energyPressure * 0.2) + (sanctions * 0.14), 0, 100), mainDriver: 'energy and trade vulnerability' },
        { region: 'North America', risk: clampNumber((technologyDecoupling * 0.22) + (tradeRestrictions * 0.18) + (militaryEscalation * 0.15) + (sanctions * 0.12), 0, 100), mainDriver: 'industrial and security fragmentation' },
        { region: 'Africa', risk: clampNumber((energyPressure * 0.2) + (tradeRestrictions * 0.18) + (sanctions * 0.16) + (tension * 0.12), 0, 100), mainDriver: 'commodity exposure and trade stress' },
    ]

    const countrySeed = currentData.countries || [
        { name: 'India', code: 'IND' },
        { name: 'USA', code: 'USA' },
        { name: 'China', code: 'CHN' },
        { name: 'Russia', code: 'RUS' },
        { name: 'Ukraine', code: 'UKR' },
        { name: 'France', code: 'FRA' },
        { name: 'Germany', code: 'DEU' },
        { name: 'Japan', code: 'JPN' },
    ]

    const countryImpacts = countrySeed.map((country) => {
        const countryName = country.name || 'Country'
        const base = {
            India: 0.8,
            USA: 0.7,
            China: 0.95,
            Russia: 1.1,
            Ukraine: 1.15,
            France: 0.75,
            Germany: 0.78,
            Japan: 0.82,
        }[countryName] ?? 0.75

        const riskScore = clampNumber(
            28 +
            tension * 0.24 * base +
            sanctions * 0.18 * base +
            militaryEscalation * 0.22 * base +
            tradeRestrictions * 0.11 * base -
            diplomaticCooperation * 0.16 * base,
            0,
            100,
        )

        const economicImpact = scenarioGDPGrowth > baselineGDPGrowth ? 'Improved' : 'Pressed'
        const primaryDriver =
            countryName === 'China' || countryName === 'USA' ? 'technology decoupling and trade friction'
                : countryName === 'Russia' || countryName === 'Ukraine' ? 'military escalation and sanctions pressure'
                    : countryName === 'India' ? 'trade resilience and energy security'
                        : 'diplomatic and market stress'

        return {
            country: countryName,
            risk: Math.round(riskScore),
            economicDirection: economicImpact,
            primaryDriver,
            geopoliticalRisk: riskScore > 65 ? 'Elevated' : riskScore > 42 ? 'Moderate' : 'Contained',
            diplomaticImpact: diplomaticCooperation > 60 ? 'Supportive' : 'Fragile',
        }
    })

    const explanationParts = []
    if (tradeRestrictions >= 70) explanationParts.push('high trade restrictions')
    if (militaryEscalation >= 60) explanationParts.push('elevated military escalation')
    if (sanctions >= 60) explanationParts.push('strong sanctions pressure')
    if (diplomaticCooperation >= 60) explanationParts.push('greater diplomatic cooperation')
    if (energyPressure >= 60) explanationParts.push('oil and energy stress')
    if (technologyDecoupling >= 60) explanationParts.push('technology fragmentation')

    const explanation = explanationParts.length
        ? `In this scenario, ${explanationParts.join(', ')} combine to create a modelled geopolitical environment with elevated pressure on growth, coordination, and trade stability.`
        : 'In this scenario, moderate pressure remains contained, with trade and cooperation balancing a relatively stable 2035 outlook.'

    return {
        globalRisk: Math.round(globalRisk),
        economicOutlook: {
            baselineGDPGrowth: Number(baselineGDPGrowth.toFixed(2)),
            scenarioGDPGrowth: Number(scenarioGDPGrowth.toFixed(2)),
            delta: Number(delta.toFixed(2)),
            classification: scenarioGDPGrowth > 3 ? 'Expansionary' : scenarioGDPGrowth > 0 ? 'Moderate pressure' : 'Contractionary',
            modelLabel: 'Modelled scenario',
        },
        conflictRisk: {
            score: Math.round(conflictRisk),
            classification: getRiskBand(conflictRisk),
        },
        diplomaticOutlook: {
            score: Math.round(diplomaticScore),
            classification: getDiplomaticBand(diplomaticScore),
            shortExplanation: diplomaticScore >= 60
                ? 'Cooperation remains relatively strong and reduces escalation pressure in this scenario.'
                : 'Diplomatic channels are under stress and escalation risk remains elevated.',
        },
        tradeOutlook: {
            currentTradeIndicator: Number(tradeIndicator.toFixed(2)),
            scenarioDirection: tradePressure >= 60 ? 'Negative' : tradePressure >= 35 ? 'Mixed' : 'Stable',
            modelledImpact: tradePressure >= 60
                ? 'Trade exposure increases materially under strong restrictions and sanction pressure.'
                : tradePressure >= 35
                    ? 'Trade remains pressured but partially offset by diplomatic recovery.'
                    : 'Trade lanes remain comparatively resilient under this scenario.',
            score: Math.round(tradePressure),
        },
        allianceStability: {
            score: Math.round(allianceScore),
            classification: getAllianceBand(allianceScore),
        },
        regionalRisks: regionalRisks.map((entry) => ({
            region: entry.region,
            risk: Math.round(entry.risk),
            riskLevel: getRiskBand(entry.risk),
            mainDriver: entry.mainDriver,
        })),
        countryImpacts: countryImpacts.map((entry) => ({
            country: entry.country,
            risk: entry.risk,
            economicDirection: entry.economicDirection,
            primaryDriver: entry.primaryDriver,
            geopoliticalRisk: entry.geopoliticalRisk,
            diplomaticImpact: entry.diplomaticImpact,
        })),
        explanation,
        keyDrivers: [
            { label: 'Tension', value: tension },
            { label: 'Trade restrictions', value: tradeRestrictions },
            { label: 'Military escalation', value: militaryEscalation },
        ].sort((a, b) => b.value - a.value).slice(0, 3),
    }
}
