"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, Database, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MeteorData {
  speed: number
  size: number
  mass: number
  angle: number
  composition: string
}

interface MeteorParametersProps {
  onSubmit: (data: MeteorData) => void
}

export default function MeteorParameters({ onSubmit }: MeteorParametersProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [speed, setSpeed] = useState("20000")
  const [size, setSize] = useState("100")
  const [mass, setMass] = useState("1000000")
  const [angle, setAngle] = useState("45")
  const [composition, setComposition] = useState("iron")
  const [asteroidId, setAsteroidId] = useState("")
  const [loadedAsteroidName, setLoadedAsteroidName] = useState("")

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      speed: Number.parseFloat(speed),
      size: Number.parseFloat(size),
      mass: Number.parseFloat(mass),
      angle: Number.parseFloat(angle),
      composition,
    })
  }

  const handleNASALoad = async () => {
    if (!asteroidId.trim()) {
      setError("Please enter an asteroid ID or name")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/nasa?id=${encodeURIComponent(asteroidId)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load asteroid data")
      }

      // Update form with NASA data
      setSpeed(data.speed.toString())
      setSize(data.size.toString())
      setMass(data.mass.toString())
      setAngle(data.angle.toString())
      setComposition(data.composition)
      setLoadedAsteroidName(data.name)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load asteroid data")
    } finally {
      setLoading(false)
    }
  }

  const calculateMass = (diameter: string, comp: string) => {
    const densities: Record<string, number> = {
      iron: 7800,
      stony: 3500,
      "stony-iron": 5000,
      carbonaceous: 2500,
    }

    const d = Number.parseFloat(diameter)
    if (isNaN(d)) return

    const radius = d / 2
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3)
    const density = densities[comp] || 3500
    const calculatedMass = volume * density

    setMass(Math.round(calculatedMass).toString())
  }

  const handleSizeChange = (value: string) => {
    setSize(value)
    calculateMass(value, composition)
  }

  const handleCompositionChange = (value: string) => {
    setComposition(value)
    calculateMass(size, value)
  }

  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="manual">Manual Input</TabsTrigger>
        <TabsTrigger value="nasa">NASA API</TabsTrigger>
      </TabsList>

      <TabsContent value="manual">
        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speed">
                Impact Speed <span className="text-muted-foreground text-xs">(m/s)</span>
              </Label>
              <Input
                id="speed"
                type="number"
                placeholder="20000"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Typical range: 11,000 - 72,000 m/s</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">
                Diameter <span className="text-muted-foreground text-xs">(meters)</span>
              </Label>
              <Input
                id="size"
                type="number"
                placeholder="100"
                value={size}
                onChange={(e) => handleSizeChange(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Typical range: 10 - 1000 meters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mass">
                Mass <span className="text-muted-foreground text-xs">(kg)</span>
              </Label>
              <Input
                id="mass"
                type="number"
                placeholder="1000000"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Auto-calculated from size and density</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="angle">
                Impact Angle <span className="text-muted-foreground text-xs">(degrees)</span>
              </Label>
              <Input
                id="angle"
                type="number"
                min="0"
                max="90"
                placeholder="45"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">0° = horizontal, 90° = vertical</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="composition">Composition</Label>
            <Select value={composition} onValueChange={handleCompositionChange}>
              <SelectTrigger id="composition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iron">Iron (7,800 kg/m³)</SelectItem>
                <SelectItem value="stony">Stony (3,500 kg/m³)</SelectItem>
                <SelectItem value="stony-iron">Stony-Iron (5,000 kg/m³)</SelectItem>
                <SelectItem value="carbonaceous">Carbonaceous (2,500 kg/m³)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Rocket className="w-4 h-4 mr-2" />
            Continue to Location Selection
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="nasa">
        <Card className="p-6 bg-muted/50">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Load from NASA Near-Earth Object API</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fetch real asteroid data from NASA's Near-Earth Object database. Try IDs like: 433, 2000433, or
                  3542519
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Successfully loaded data for {loadedAsteroidName}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="asteroid-id">Asteroid ID or Name</Label>
              <Input
                id="asteroid-id"
                placeholder="e.g., 433, 2000433, 3542519"
                value={asteroidId}
                onChange={(e) => setAsteroidId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNASALoad()}
              />
              <p className="text-xs text-muted-foreground">
                Popular examples: 433 (Eros), 99942 (Apophis), 101955 (Bennu)
              </p>
            </div>

            <Button onClick={handleNASALoad} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading from NASA...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Fetch Asteroid Data
                </>
              )}
            </Button>

            {success && (
              <div className="mt-6 p-4 bg-background rounded-lg border">
                <h4 className="font-semibold mb-3 text-sm">Loaded Data: {loadedAsteroidName}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Speed:</span> <span className="font-mono">{speed} m/s</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span> <span className="font-mono">{size} m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mass:</span>{" "}
                    <span className="font-mono">{Number.parseInt(mass).toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Angle:</span> <span className="font-mono">{angle}°</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Composition:</span>{" "}
                    <span className="capitalize">{composition}</span>
                  </div>
                </div>
                <Button onClick={handleManualSubmit} className="w-full mt-4">
                  <Rocket className="w-4 h-4 mr-2" />
                  Use This Data & Continue
                </Button>
              </div>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
