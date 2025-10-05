"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, Target } from "lucide-react"

interface LocationData {
  latitude: number
  longitude: number
  name?: string
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void
}

export default function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const [latitude, setLatitude] = useState("38.89511")
  const [longitude, setLongitude] = useState("-77.03637")
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => {
      setMapLoaded(true)
      initializeMap()
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (mapRef.current && markerRef.current && mapLoaded) {
      const lat = Number.parseFloat(latitude)
      const lon = Number.parseFloat(longitude)
      if (!isNaN(lat) && !isNaN(lon)) {
        markerRef.current.setLatLng([lat, lon])
        mapRef.current.setView([lat, lon], mapRef.current.getZoom())
      }
    }
  }, [latitude, longitude, mapLoaded])

  const initializeMap = () => {
    if (typeof window !== "undefined" && window.L) {
      const L = window.L
      const mapElement = document.getElementById("impact-map")
      if (!mapElement) return

      const map = L.map("impact-map").setView([38.89511, -77.03637], 2)
      mapRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([38.89511, -77.03637]).addTo(map)
      markerRef.current = marker

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng
        setLatitude(lat.toFixed(5))
        setLongitude(lng.toFixed(5))
        marker.setLatLng([lat, lng])
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLocationSelect({
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    })
  }

  const presetLocations = [
    { name: "Washington, D.C.", lat: 38.89511, lon: -77.03637 },
    { name: "New York City", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Mumbai, India", lat: 19.076, lon: 72.8777 },
  ]

  const formatCoordinate = (value: string, isLatitude: boolean) => {
    const num = Number.parseFloat(value)
    if (isNaN(num)) return value

    if (isLatitude) {
      return `${Math.abs(num).toFixed(5)}° ${num >= 0 ? "N" : "S"}`
    } else {
      return `${Math.abs(num).toFixed(5)}° ${num >= 0 ? "E" : "W"}`
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Manual Coordinates</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">
                Latitude <span className="text-muted-foreground text-xs">(°N/S)</span>
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="38.89511"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">
                Longitude <span className="text-muted-foreground text-xs">(°E/W)</span>
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-77.03637"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Set Impact Location
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium mb-3">Quick Select Locations</h4>
          <div className="grid grid-cols-2 gap-2">
            {presetLocations.map((loc) => (
              <Button
                key={loc.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  setLatitude(loc.lat.toString())
                  setLongitude(loc.lon.toString())
                }}
                className="justify-start text-xs"
              >
                {loc.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Interactive Map</h3>
        </div>

        <div id="impact-map" className="aspect-video bg-muted rounded-lg overflow-hidden" style={{ height: "400px" }} />

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Selected Location</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Coordinates:</span>{" "}
              <span className="font-mono">
                {formatCoordinate(latitude, true)}, {formatCoordinate(longitude, false)}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
