import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const asteroidId = searchParams.get("id")

  if (!asteroidId) {
    return NextResponse.json({ error: "Asteroid ID is required" }, { status: 400 })
  }

  try {
    // NASA NeoWs API - using DEMO_KEY for demonstration
    // Users should get their own key from https://api.nasa.gov/
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY"

    // Fetch asteroid data from NASA Small-Body Database
    const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${apiKey}`)

    if (!response.ok) {
      throw new Error("Failed to fetch asteroid data")
    }

    const data = await response.json()

    // Extract relevant parameters
    const diameter = data.estimated_diameter?.meters?.estimated_diameter_max || 100
    const closeApproachData = data.close_approach_data?.[0]
    const velocity = closeApproachData?.relative_velocity?.meters_per_second || 20000

    // Calculate mass based on diameter and assumed density
    const radius = diameter / 2
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3)
    const density = 3000 // kg/m³ (average for stony asteroids)
    const mass = volume * density

    return NextResponse.json({
      name: data.name,
      speed: Math.round(velocity),
      size: Math.round(diameter),
      mass: Math.round(mass),
      angle: 45, // Default angle
      composition: "stony",
      isPotentiallyHazardous: data.is_potentially_hazardous_asteroid,
      absoluteMagnitude: data.absolute_magnitude_h,
    })
  } catch (error) {
    console.error("NASA API Error:", error)
    return NextResponse.json({ error: "Failed to fetch asteroid data from NASA" }, { status: 500 })
  }
}

// Alternative endpoint for Near-Earth Comets API
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query } = body

    // Fetch from NASA's Near-Earth Comets - Orbital Elements API
    const response = await fetch("https://data.nasa.gov/resource/b67r-rgxc.json")

    if (!response.ok) {
      throw new Error("Failed to fetch comet data")
    }

    const comets = await response.json()

    // Filter comets based on query
    const filtered = comets.filter((comet: any) => comet.object_name?.toLowerCase().includes(query.toLowerCase()))

    return NextResponse.json(filtered.slice(0, 10))
  } catch (error) {
    console.error("NASA Comets API Error:", error)
    return NextResponse.json({ error: "Failed to fetch comet data" }, { status: 500 })
  }
}
