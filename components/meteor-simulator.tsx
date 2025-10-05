"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import LocationSelector from "./location-selector"
import MeteorParameters from "./meteor-parameters"
import CombinedSimulation from "./combined-simulation"

interface LocationData {
  latitude: number
  longitude: number
  name?: string
}

interface MeteorData {
  speed: number
  size: number
  mass: number
  angle: number
  composition: string
  nasaData?: any
}

export default function MeteorSimulator() {
  const [activeTab, setActiveTab] = useState("setup")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [meteorData, setMeteorData] = useState<MeteorData | null>(null)

  const handleLocationSelect = (loc: LocationData) => {
    setLocation(loc)
    setActiveTab("simulate")
  }

  const handleMeteorDataSubmit = (data: MeteorData) => {
    setMeteorData(data)
    setActiveTab("location")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="location" disabled={!meteorData}>
            Location
          </TabsTrigger>
          <TabsTrigger value="simulate" disabled={!location || !meteorData}>
            Simulate & Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-balance">Meteor Parameters</h2>
            <p className="text-muted-foreground mb-6">Configure meteor properties or load from NASA API</p>
            <MeteorParameters onSubmit={handleMeteorDataSubmit} />
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-balance">Impact Location</h2>
            <p className="text-muted-foreground">Select impact coordinates on Earth to mark the damage zone</p>
          </div>
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </TabsContent>

        <TabsContent value="simulate" className="space-y-6">
          <CombinedSimulation location={location} meteorData={meteorData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
