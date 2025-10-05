"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import MeteorScene from "./meteor-scene"
import EarthWithDust from "./earth-with-dust"

interface SimulationViewProps {
  location: any
  meteorData: any
  onComplete: () => void
}

export default function SimulationView({ location, meteorData, onComplete }: SimulationViewProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showImpact, setShowImpact] = useState(false)
  const [showDustCloud, setShowDustCloud] = useState(false)

  const startSimulation = () => {
    setIsSimulating(true)
    setProgress(0)
    setShowImpact(false)
    setShowDustCloud(false)

    // Simulate impact sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setShowImpact(true)
          setTimeout(() => {
            setShowDustCloud(true)
            setTimeout(() => {
              setIsSimulating(false)
              onComplete()
            }, 2000)
          }, 1000)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const resetSimulation = () => {
    setProgress(0)
    setShowImpact(false)
    setShowDustCloud(false)
    setIsSimulating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-balance">3D Impact Simulation</h2>
          <p className="text-muted-foreground">Visualizing meteor impact at {location?.name || "selected location"}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetSimulation} variant="outline" disabled={!showImpact}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={startSimulation} disabled={isSimulating}>
            <Play className="w-4 h-4 mr-2" />
            {isSimulating ? "Simulating..." : "Start Simulation"}
          </Button>
        </div>
      </div>

      {isSimulating && !showImpact && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Simulation Progress</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Meteor Approach</h3>
          <div className="aspect-square bg-black rounded-lg overflow-hidden">
            <MeteorScene meteorData={meteorData} isAnimating={isSimulating && !showImpact} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Speed</p>
              <p className="font-mono font-semibold">{meteorData?.speed.toLocaleString()} m/s</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Diameter</p>
              <p className="font-mono font-semibold">{meteorData?.size} m</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Mass</p>
              <p className="font-mono font-semibold">{(meteorData?.mass / 1000000).toFixed(2)} Mt</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Angle</p>
              <p className="font-mono font-semibold">{meteorData?.angle}°</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Earth Impact Zone</h3>
          <div className="aspect-square bg-black rounded-lg overflow-hidden">
            <EarthWithDust showDust={showDustCloud} location={location} showImpact={showImpact} />
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Impact Coordinates</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Location:</span>{" "}
                <span className="font-medium">{location?.name || "Unknown"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Latitude:</span>{" "}
                <span className="font-mono">{location?.latitude}°</span>
              </p>
              <p>
                <span className="text-muted-foreground">Longitude:</span>{" "}
                <span className="font-mono">{location?.longitude}°</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {showImpact && (
        <Card className="p-6 border-destructive bg-destructive/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💥</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Impact Detected</h3>
              <p className="text-sm text-muted-foreground">
                The meteor has impacted Earth at the specified coordinates. Generating detailed impact analysis
                report...
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
