import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { meteorData, location } = body

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn("Gemini API key not configured, using mock data")
      return NextResponse.json(generateMockReport(meteorData, location))
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    // --- FIX: Updated the model name to a current, stable version ---
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" })

    // Calculate impact energy (kinetic energy formula: E = 0.5 * m * v^2)
    const kineticEnergy = 0.5 * meteorData.mass * Math.pow(meteorData.speed, 2)
    const energyInMegatons = kineticEnergy / 4.184e15 // Convert to megatons of TNT

    // Estimate crater size using scaling laws
    const craterDiameter = 1.8 * Math.pow(energyInMegatons, 0.3) * 1000 // in meters

    // Create detailed prompt for Gemini
    const prompt = `You are an expert planetary scientist analyzing a meteor impact scenario. Provide a detailed, human-readable impact analysis report.

Meteor Parameters:
- Speed: ${meteorData.speed.toLocaleString()} m/s
- Diameter: ${meteorData.size} meters
- Mass: ${(meteorData.mass / 1000000).toFixed(2)} million kg
- Impact Angle: ${meteorData.angle}°
- Composition: ${meteorData.composition}

Impact Location:
- Location: ${location.name || "Unknown"}
- Coordinates: ${location.latitude}°N, ${location.longitude}°W

Calculated Impact Energy: ${energyInMegatons.toFixed(2)} megatons of TNT
Estimated Crater Diameter: ${craterDiameter.toFixed(0)} meters

Please provide a comprehensive analysis including:

1. IMPACT SUMMARY: Brief overview of the impact scenario (2-3 sentences)

2. DAMAGE ASSESSMENT:
    - Immediate blast zone radius (in km)
    - Severe damage zone radius (in km)
    - Moderate damage zone radius (in km)
    - Evacuation zone recommendation (in km)

3. CASUALTY ESTIMATES:
    - Approximate deaths (consider population density at the location)
    - Approximate injuries
    - Note: Provide realistic estimates based on the location

4. ENVIRONMENTAL EFFECTS:
    - Seismic activity (earthquake magnitude equivalent)
    - Atmospheric effects (dust, temperature changes)
    - Potential for tsunamis (if near water)
    - Long-term climate impact

5. INFRASTRUCTURE DAMAGE:
    - Buildings and structures
    - Transportation networks
    - Utilities and services
    - Economic impact estimate (in billions USD)

6. COMPARISON:
    - Compare this impact to a known historical event or nuclear weapon

7. RECOMMENDATIONS:
    - Immediate response actions
    - Evacuation priorities
    - Long-term recovery considerations

Format the response in clear sections with specific numbers and ranges. Be realistic and scientific in your estimates.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()

    // Parse the response to extract key metrics
    const report = {
      summary: analysisText,
      metrics: {
        impactEnergy: energyInMegatons.toFixed(2),
        craterDiameter: craterDiameter.toFixed(0),
        blastRadius: (Math.pow(energyInMegatons, 0.33) * 2).toFixed(1),
        evacuationZone: (Math.pow(energyInMegatons, 0.33) * 5).toFixed(1),
        seismicMagnitude: (4 + Math.log10(energyInMegatons)).toFixed(1),
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Gemini API Error:", error)
    const body = await request.json()
    return NextResponse.json(generateMockReport(body.meteorData, body.location))
  }
}

function generateMockReport(meteorData: any, location: any) {
  const kineticEnergy = 0.5 * meteorData.mass * Math.pow(meteorData.speed, 2)
  const energyInMegatons = kineticEnergy / 4.184e15
  const craterDiameter = 1.8 * Math.pow(energyInMegatons, 0.3) * 1000

  const mockAnalysis = `IMPACT SUMMARY
This meteor impact scenario involves a ${meteorData.size}-meter ${meteorData.composition} asteroid striking ${location.name || "the target location"} at ${meteorData.speed.toLocaleString()} m/s. The impact would release approximately ${energyInMegatons.toFixed(2)} megatons of energy, equivalent to ${(energyInMegatons / 15).toFixed(0)} times the Hiroshima bomb. This would be a catastrophic event with severe regional consequences.

DAMAGE ASSESSMENT
- Immediate Blast Zone: ${(Math.pow(energyInMegatons, 0.33) * 1).toFixed(1)} km radius - Complete destruction, vaporization of all materials
- Severe Damage Zone: ${(Math.pow(energyInMegatons, 0.33) * 2).toFixed(1)} km radius - Structural collapse, fires, 90%+ fatality rate
- Moderate Damage Zone: ${(Math.pow(energyInMegatons, 0.33) * 3.5).toFixed(1)} km radius - Significant structural damage, broken windows, injuries
- Evacuation Zone: ${(Math.pow(energyInMegatons, 0.33) * 5).toFixed(1)} km radius - Recommended minimum safe distance

CASUALTY ESTIMATES
Based on the impact location at ${location.name || "the coordinates provided"}:
- Estimated Deaths: ${Math.round(Math.pow(energyInMegatons, 0.5) * 50000).toLocaleString()} - ${Math.round(Math.pow(energyInMegatons, 0.5) * 100000).toLocaleString()}
- Estimated Injuries: ${Math.round(Math.pow(energyInMegatons, 0.5) * 150000).toLocaleString()} - ${Math.round(Math.pow(energyInMegatons, 0.5) * 300000).toLocaleString()}
- Population at Risk: ${Math.round(Math.pow(energyInMegatons, 0.5) * 500000).toLocaleString()}+

ENVIRONMENTAL EFFECTS
- Seismic Activity: Magnitude ${(4 + Math.log10(energyInMegatons)).toFixed(1)} earthquake, felt up to ${(Math.pow(energyInMegatons, 0.4) * 100).toFixed(0)} km away
- Atmospheric Effects: Dust cloud reaching ${(Math.pow(energyInMegatons, 0.25) * 10).toFixed(0)} km altitude, potential for temporary cooling
- Crater Formation: ${craterDiameter.toFixed(0)} meters diameter, ${(craterDiameter * 0.3).toFixed(0)} meters deep
- Ejecta Distribution: Debris scattered up to ${(Math.pow(energyInMegatons, 0.35) * 50).toFixed(0)} km from impact site

INFRASTRUCTURE DAMAGE
- Buildings: Complete destruction within ${(Math.pow(energyInMegatons, 0.33) * 2).toFixed(1)} km, severe damage to ${(Math.pow(energyInMegatons, 0.33) * 5).toFixed(1)} km
- Transportation: Roads, bridges, and airports severely damaged or destroyed within damage zones
- Utilities: Power, water, and communication infrastructure disrupted across ${(Math.pow(energyInMegatons, 0.33) * 10).toFixed(0)} km radius
- Economic Impact: Estimated $${(energyInMegatons * 5).toFixed(0)} - $${(energyInMegatons * 10).toFixed(0)} billion in direct damages

COMPARISON
This impact is comparable to:
- ${(energyInMegatons / 15).toFixed(0)}x the Hiroshima atomic bomb
- Similar to the ${energyInMegatons > 10 ? "Tunguska event (1908)" : "Chelyabinsk meteor (2013)"} but with ${energyInMegatons > 10 ? "greater" : "different"} characteristics
- Equivalent to a magnitude ${(4 + Math.log10(energyInMegatons)).toFixed(1)} earthquake

RECOMMENDATIONS
Immediate Response:
1. Evacuate all personnel within ${(Math.pow(energyInMegatons, 0.33) * 5).toFixed(1)} km radius immediately
2. Establish emergency command centers outside the damage zone
3. Deploy search and rescue teams with radiation and hazmat protection
4. Secure critical infrastructure and prevent secondary disasters

Evacuation Priorities:
1. Hospitals, schools, and high-density residential areas first
2. Establish evacuation routes away from the impact trajectory
3. Coordinate with regional and national emergency services
4. Prepare shelters for displaced populations

Long-term Recovery:
1. Environmental monitoring for dust, contamination, and climate effects
2. Structural assessment and rebuilding of critical infrastructure
3. Economic recovery programs and international aid coordination
4. Psychological support services for affected populations
5. Update disaster preparedness plans based on lessons learned

DISCLAIMER
This analysis uses scientific models and AI-generated estimates. Actual impact effects depend on numerous variables including exact impact angle, local geology, weather conditions, and population distribution. This report is for educational and planning purposes only.`

  return {
    summary: mockAnalysis,
    metrics: {
      impactEnergy: energyInMegatons.toFixed(2),
      craterDiameter: craterDiameter.toFixed(0),
      blastRadius: (Math.pow(energyInMegatons, 0.33) * 2).toFixed(1),
      evacuationZone: (Math.pow(energyInMegatons, 0.33) * 5).toFixed(1),
      seismicMagnitude: (4 + Math.log10(energyInMegatons)).toFixed(1),
    },
    timestamp: new Date().toISOString(),
  }
}
