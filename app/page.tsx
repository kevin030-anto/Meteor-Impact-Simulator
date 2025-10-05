import MeteorSimulator from "@/components/meteor-simulator"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Starfield background */}
      <div className="starfield" id="starfield" />

      <div className="relative z-10">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl">☄️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-balance">Meteor Impact Simulator</h1>
                  <p className="text-xs text-muted-foreground">NASA Space Apps Challenge</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <MeteorSimulator />
      </div>
    </main>
  )
}
