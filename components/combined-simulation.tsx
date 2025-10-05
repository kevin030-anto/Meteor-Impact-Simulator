"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Download, Copy, CheckCircle, Loader2, AlertTriangle, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RealisticImpactScene from "./realistic-impact-scene"
import AsteroidModel from "./asteroid-model"

interface CombinedSimulationProps {
  location: any
  meteorData: any
}

interface ReportData {
  summary: string
  metrics: {
    impactEnergy: string
    craterDiameter: string
    blastRadius: string
    evacuationZone: string
    seismicMagnitude: string
  }
  timestamp: string
}

type SimulationPhase =
  | "idle"
  | "approach"
  | "atmospheric-entry"
  | "impact"
  | "shockwave"
  | "secondary-effects"
  | "dust-formation"
  | "complete"

export default function CombinedSimulation({ location, meteorData }: CombinedSimulationProps) {
  const [phase, setPhase] = useState<SimulationPhase>("idle")
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState<ReportData | null>(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const startSimulation = () => {
    setPhase("approach")
    setProgress(0)
    setReport(null)
    setReportError(null)

    // Phase 1: Approach (0-20%)
    setTimeout(() => {
      setPhase("atmospheric-entry")
      setProgress(20)
    }, 2000)

    // Phase 2: Atmospheric Entry (20-40%)
    setTimeout(() => {
      setPhase("impact")
      setProgress(40)
    }, 4000)

    // Phase 3: Impact (40-60%)
    setTimeout(() => {
      setPhase("shockwave")
      setProgress(60)
    }, 6000)

    // Phase 4: Shockwave (60-75%)
    setTimeout(() => {
      setPhase("secondary-effects")
      setProgress(75)
    }, 8000)

    // Phase 5: Secondary Effects (75-90%)
    setTimeout(() => {
      setPhase("dust-formation")
      setProgress(90)
    }, 10000)

    // Phase 6: Dust Formation (90-100%)
    setTimeout(() => {
      setPhase("complete")
      setProgress(100)
      generateReport()
    }, 12000)
  }

  const resetSimulation = () => {
    setPhase("idle")
    setProgress(0)
    setReport(null)
    setReportError(null)
  }

  const generateReport = async () => {
    setLoadingReport(true)
    setReportError(null)

    try {
      const response = await fetch("/api/analyze-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meteorData, location }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      const data = await response.json()
      setReport(data)
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "Failed to generate report")
    } finally {
      setLoadingReport(false)
    }
  }

  const getPhaseDescription = () => {
    switch (phase) {
      case "approach":
        return "Meteor approaching Earth at high velocity..."
      case "atmospheric-entry":
        return "Entering atmosphere - friction heating to extreme temperatures..."
      case "impact":
        return "IMPACT! Massive energy release at impact site..."
      case "shockwave":
        return "Shockwave expanding outward, devastating everything in its path..."
      case "secondary-effects":
        return "Secondary effects: Tsunamis, volcanic activity, seismic waves..."
      case "dust-formation":
        return "Dust cloud forming around Earth, blocking sunlight..."
      case "complete":
        return "Simulation complete. Analyzing impact consequences..."
      default:
        return "Ready to simulate meteor impact"
    }
  }

  const getReportText = () => {
    if (!report) return ""

    return `METEOR IMPACT ANALYSIS REPORT
Generated: ${new Date(report.timestamp).toLocaleString()}

═══════════════════════════════════════════════════════════

IMPACT LOCATION
Location: ${location.name || "Unknown"}
Coordinates: ${location.latitude}°N, ${location.longitude}°W

METEOR PARAMETERS
Speed: ${meteorData.speed.toLocaleString()} m/s
Diameter: ${meteorData.size} m
Mass: ${(meteorData.mass / 1000000).toFixed(2)} million kg
Impact Angle: ${meteorData.angle}°
Composition: ${meteorData.composition}
${meteorData.nasaData ? `NASA Object: ${meteorData.nasaData.name || "Unknown"}` : ""}

═══════════════════════════════════════════════════════════

KEY METRICS
Impact Energy: ${report.metrics.impactEnergy} megatons TNT
Crater Diameter: ${report.metrics.craterDiameter} meters
Blast Radius: ${report.metrics.blastRadius} km
Evacuation Zone: ${report.metrics.evacuationZone} km
Seismic Magnitude: ${report.metrics.seismicMagnitude}

═══════════════════════════════════════════════════════════

DETAILED ANALYSIS
${report.summary}

═══════════════════════════════════════════════════════════

Report generated by Meteor Impact Simulator
NASA Space Apps Challenge 2025`
  }

  const downloadTXT = () => {
    const reportText = getReportText()
    const blob = new Blob([reportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `meteor-impact-report-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadJSON = () => {
    if (!report) return

    const jsonData = {
      metadata: {
        generatedAt: report.timestamp,
        location: {
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        meteorParameters: {
          speed: meteorData.speed,
          size: meteorData.size,
          mass: meteorData.mass,
          angle: meteorData.angle,
          composition: meteorData.composition,
          nasaData: meteorData.nasaData || null,
        },
      },
      metrics: report.metrics,
      analysis: report.summary,
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `meteor-impact-data-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadHTML = () => {
    if (!report) return

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meteor Impact Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; background: #f5f5f5; color: #333; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #1a1a1a; border-bottom: 3px solid #e74c3c; padding-bottom: 10px; }
        h2 { color: #2c3e50; margin-top: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #3498db; }
        .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .analysis { line-height: 1.8; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌠 Meteor Impact Analysis Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        <h2>📍 Impact Location</h2>
        <p><strong>Location:</strong> ${location.name || "Unknown"}<br><strong>Coordinates:</strong> ${location.latitude}°N, ${location.longitude}°W</p>
        <h2>☄️ Meteor Parameters</h2>
        <p><strong>Speed:</strong> ${meteorData.speed.toLocaleString()} m/s<br><strong>Diameter:</strong> ${meteorData.size} m<br><strong>Mass:</strong> ${(meteorData.mass / 1000000).toFixed(2)} million kg<br><strong>Angle:</strong> ${meteorData.angle}°<br><strong>Composition:</strong> ${meteorData.composition}</p>
        <h2>📊 Key Metrics</h2>
        <div class="metrics">
            <div class="metric-card"><div class="metric-label">Impact Energy</div><div class="metric-value">${report.metrics.impactEnergy} MT</div></div>
            <div class="metric-card"><div class="metric-label">Crater Diameter</div><div class="metric-value">${report.metrics.craterDiameter} m</div></div>
            <div class="metric-card"><div class="metric-label">Blast Radius</div><div class="metric-value">${report.metrics.blastRadius} km</div></div>
            <div class="metric-card"><div class="metric-label">Evacuation Zone</div><div class="metric-value">${report.metrics.evacuationZone} km</div></div>
            <div class="metric-card"><div class="metric-label">Seismic Magnitude</div><div class="metric-value">M ${report.metrics.seismicMagnitude}</div></div>
        </div>
        <h2>📋 Detailed Analysis</h2>
        <div class="analysis">${report.summary}</div>
    </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `meteor-impact-report-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    const reportText = getReportText()
    try {
      await navigator.clipboard.writeText(reportText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-balance">Impact Simulation & Analysis</h2>
          <p className="text-muted-foreground">Real-time visualization and AI-powered impact assessment</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={resetSimulation}
            variant="outline"
            disabled={phase === "idle" || (phase !== "idle" && phase !== "complete")}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={startSimulation} disabled={phase !== "idle" && phase !== "complete"}>
            <Play className="w-4 h-4 mr-2" />
            {phase === "idle" || phase === "complete" ? "Start Simulation" : "Simulating..."}
          </Button>
        </div>
      </div>

      {/* Progress and Phase */}
      {phase !== "idle" && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={phase === "complete" ? "default" : "secondary"}>
                  {phase === "complete" ? "Complete" : "In Progress"}
                </Badge>
                <span className="text-sm text-muted-foreground">{getPhaseDescription()}</span>
              </div>
              <span className="font-mono text-sm font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </Card>
      )}

      {/* NASA Data Display */}
      {meteorData.nasaData && (
        <Card className="p-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🛰️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">NASA Near-Earth Object Data</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Asteroid: <span className="font-mono font-semibold">{meteorData.nasaData.name || "Unknown"}</span>
              </p>
              {meteorData.nasaData.close_approach_data && meteorData.nasaData.close_approach_data[0] && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Close Approach:</span>{" "}
                    <span className="font-medium">
                      {meteorData.nasaData.close_approach_data[0].close_approach_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Velocity:</span>{" "}
                    <span className="font-medium">
                      {Number.parseFloat(
                        meteorData.nasaData.close_approach_data[0].relative_velocity.kilometers_per_second,
                      ).toFixed(2)}{" "}
                      km/s
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Asteroid Model on Left */}
        {meteorData.nasaData && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">NASA Asteroid Model</h3>
            <div className="aspect-square bg-black rounded-lg overflow-hidden mb-4">
              <AsteroidModel meteorData={meteorData} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-mono font-semibold">{meteorData.nasaData.name || "Unknown"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Diameter:</span>
                <span className="font-mono">
                  {meteorData.nasaData.estimated_diameter?.meters?.estimated_diameter_max
                    ? `${Math.round(meteorData.nasaData.estimated_diameter.meters.estimated_diameter_max)} m`
                    : `${meteorData.size} m`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hazardous:</span>
                <Badge variant={meteorData.nasaData.is_potentially_hazardous_asteroid ? "destructive" : "secondary"}>
                  {meteorData.nasaData.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Main Impact Visualization */}
        <Card className={`p-6 ${meteorData.nasaData ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h3 className="text-lg font-semibold mb-4">Real-Time Impact Visualization</h3>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <RealisticImpactScene meteorData={meteorData} location={location} phase={phase} />
          </div>

          {/* Meteor Parameters */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Speed</p>
              <p className="font-mono font-semibold">{meteorData.speed.toLocaleString()} m/s</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Diameter</p>
              <p className="font-mono font-semibold">{meteorData.size} m</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Mass</p>
              <p className="font-mono font-semibold">{(meteorData.mass / 1000000).toFixed(2)} Mt</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground text-xs">Angle</p>
              <p className="font-mono font-semibold">{meteorData.angle}°</p>
            </div>
          </div>

          {/* Impact Location */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Impact Coordinates</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Location:</span>{" "}
                <span className="font-medium">{location.name || "Unknown"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Latitude:</span>{" "}
                <span className="font-mono">{location.latitude}°</span>
              </div>
              <div>
                <span className="text-muted-foreground">Longitude:</span>{" "}
                <span className="font-mono">{location.longitude}°</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Impact Report */}
      {phase === "complete" && (
        <>
          {loadingReport && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Generating Impact Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    AI is analyzing the impact scenario using Gemini Pro...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {reportError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {reportError}
                <Button onClick={generateReport} variant="outline" size="sm" className="ml-4 bg-transparent">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {report && (
            <>
              {/* Report Header */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Impact Analysis Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated by Gemini AI • {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={downloadTXT}>
                        <FileText className="w-4 h-4 mr-2" />
                        Download as TXT
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={downloadHTML}>
                        <FileText className="w-4 h-4 mr-2" />
                        Download as HTML
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={downloadJSON}>
                        <FileText className="w-4 h-4 mr-2" />
                        Download as JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card className="p-4 border-destructive bg-destructive/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <h4 className="font-semibold text-sm">Impact Energy</h4>
                  </div>
                  <p className="text-2xl font-bold">{report.metrics.impactEnergy}</p>
                  <p className="text-xs text-muted-foreground">Megatons TNT</p>
                </Card>

                <Card className="p-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <h4 className="font-semibold text-sm">Crater Size</h4>
                  </div>
                  <p className="text-2xl font-bold">{report.metrics.craterDiameter}</p>
                  <p className="text-xs text-muted-foreground">Meters diameter</p>
                </Card>

                <Card className="p-4 border-red-500 bg-red-50 dark:bg-red-950">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-sm">Blast Radius</h4>
                  </div>
                  <p className="text-2xl font-bold">{report.metrics.blastRadius}</p>
                  <p className="text-xs text-muted-foreground">Kilometers</p>
                </Card>

                <Card className="p-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-semibold text-sm">Evacuation Zone</h4>
                  </div>
                  <p className="text-2xl font-bold">{report.metrics.evacuationZone}</p>
                  <p className="text-xs text-muted-foreground">Kilometers radius</p>
                </Card>

                <Card className="p-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-sm">Seismic</h4>
                  </div>
                  <p className="text-2xl font-bold">M {report.metrics.seismicMagnitude}</p>
                  <p className="text-xs text-muted-foreground">Magnitude</p>
                </Card>
              </div>

              {/* Detailed Analysis */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Detailed Impact Analysis</h3>
                </div>
                <Separator className="mb-4" />
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{report.summary}</div>
                </div>
              </Card>

              {/* Disclaimer */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This analysis is generated using AI (Gemini Pro) and scientific models. Actual impact effects may vary
                  based on numerous factors including terrain, weather conditions, and local infrastructure. This tool
                  is for educational and planning purposes only.
                </AlertDescription>
              </Alert>
            </>
          )}
        </>
      )}
    </div>
  )
}
