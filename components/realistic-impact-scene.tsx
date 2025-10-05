"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import * as THREE from "three"

type SimulationPhase =
  | "idle"
  | "approach"
  | "atmospheric-entry"
  | "impact"
  | "shockwave"
  | "secondary-effects"
  | "dust-formation"
  | "complete"

interface SceneProps {
  meteorData: any
  location: any
  phase: SimulationPhase
  asteroidVariant: number
}

function ProceduralAsteroid({ variant, scale, position }: { variant: number; scale: number; position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Generate unique geometry for each variant
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 2)
    const positionAttribute = geo.getAttribute("position")

    // Apply different deformations based on variant
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i)
      const y = positionAttribute.getY(i)
      const z = positionAttribute.getZ(i)

      const noise = Math.sin(x * variant * 2) * Math.cos(y * variant * 3) * Math.sin(z * variant * 4)
      const deformation = 0.15 + noise * 0.1

      positionAttribute.setXYZ(
        i,
        x * (1 + deformation * variant * 0.05),
        y * (1 + deformation * variant * 0.07),
        z * (1 + deformation * variant * 0.06),
      )
    }

    geo.computeVertexNormals()
    return geo
  }, [variant])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  // Different colors for each variant
  const colors = ["#8b4513", "#a0522d", "#6b4423", "#9a7b4f", "#7a5c3d"]
  const color = colors[variant % 5]

  return (
    <mesh ref={meshRef} geometry={geometry} position={position} scale={scale}>
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

function Meteor({
  phase,
  meteorData,
  location,
  asteroidVariant,
}: {
  phase: SimulationPhase
  meteorData: any
  location: any
  asteroidVariant: number
}) {
  const meteorRef = useRef<THREE.Group>(null)
  const progressRef = useRef(0)

  const targetPosition = useMemo(() => {
    const lat = (location.latitude * Math.PI) / 180
    const lon = (location.longitude * Math.PI) / 180
    const radius = 2.05

    const pos = new THREE.Vector3(
      radius * Math.cos(lat) * Math.cos(lon),
      radius * Math.sin(lat),
      -radius * Math.cos(lat) * Math.sin(lon),
    )

    console.log("[v0] Target impact position:", { lat: location.latitude, lon: location.longitude, pos })
    return pos
  }, [location])

  const startPosition = useMemo(() => {
    return targetPosition.clone().multiplyScalar(4)
  }, [targetPosition])

  useFrame((state, delta) => {
    if (!meteorRef.current) return

    if (phase === "approach" || phase === "atmospheric-entry") {
      progressRef.current = Math.min(1, progressRef.current + delta * 0.15)

      const currentPos = new THREE.Vector3()
      currentPos.lerpVectors(startPosition, targetPosition, progressRef.current)
      meteorRef.current.position.copy(currentPos)
    }

    if (
      phase === "impact" ||
      phase === "shockwave" ||
      phase === "secondary-effects" ||
      phase === "dust-formation" ||
      phase === "complete"
    ) {
      meteorRef.current.visible = false
    }
  })

  useEffect(() => {
    if (phase === "approach") {
      progressRef.current = 0
      if (meteorRef.current) {
        meteorRef.current.position.copy(startPosition)
        meteorRef.current.visible = true
      }
    }
  }, [phase, startPosition])

  if (phase === "idle") return null

  const meteorScale = Math.max(0.15, Math.min(0.8, meteorData.size / 500))

  return (
    <group ref={meteorRef}>
      <ProceduralAsteroid variant={asteroidVariant} scale={meteorScale} position={new THREE.Vector3(0, 0, 0)} />

      {(phase === "approach" || phase === "atmospheric-entry") && (
        <>
          <Sphere args={[meteorScale * 1.5, 16, 16]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#ff6600" transparent opacity={0.4} />
          </Sphere>
          <pointLight position={[0, 0, 0]} intensity={2} distance={5} color="#ff4500" />
        </>
      )}
    </group>
  )
}

function Earth({ phase, location }: { phase: SimulationPhase; location: any }) {
  const earthRef = useRef<THREE.Mesh>(null)
  const impactMarkerRef = useRef<THREE.Mesh>(null)
  const impactZoneRef = useRef<THREE.Mesh>(null)
  const craterRef = useRef<THREE.Mesh>(null)
  const impactDustRef = useRef<THREE.Points>(null)
  const shockwaveRef = useRef<THREE.Mesh>(null)

  const earthTexture = useLoader(THREE.TextureLoader, "/earth-texture.jpg")

  const impactPosition = useMemo(() => {
    const lat = (location.latitude * Math.PI) / 180
    const lon = (location.longitude * Math.PI) / 180
    const radius = 2.02

    const pos = new THREE.Vector3(
      radius * Math.cos(lat) * Math.cos(lon),
      radius * Math.sin(lat),
      -radius * Math.cos(lat) * Math.sin(lon),
    )

    console.log("[v0] Impact marker position:", { lat: location.latitude, lon: location.longitude, pos })
    return pos
  }, [location])

  const impactDustPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    const impactNormal = impactPosition.clone().normalize()

    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.4
      const radius = Math.random() * 0.8

      const localX = radius * Math.sin(phi) * Math.cos(theta)
      const localY = radius * Math.sin(phi) * Math.sin(theta)
      const localZ = radius * Math.cos(phi)

      const tangent = new THREE.Vector3(1, 0, 0).cross(impactNormal).normalize()
      const bitangent = impactNormal.clone().cross(tangent).normalize()

      const worldPos = impactPosition
        .clone()
        .add(tangent.clone().multiplyScalar(localX))
        .add(bitangent.clone().multiplyScalar(localY))
        .add(impactNormal.clone().multiplyScalar(localZ))

      positions[i * 3] = worldPos.x
      positions[i * 3 + 1] = worldPos.y
      positions[i * 3 + 2] = worldPos.z
    }
    return positions
  }, [impactPosition])

  useFrame((state, delta) => {
    if (
      impactMarkerRef.current &&
      (phase === "impact" ||
        phase === "shockwave" ||
        phase === "secondary-effects" ||
        phase === "dust-formation" ||
        phase === "complete")
    ) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.5
      impactMarkerRef.current.scale.setScalar(pulse * 0.15)
    }

    if (
      impactZoneRef.current &&
      (phase === "impact" ||
        phase === "shockwave" ||
        phase === "secondary-effects" ||
        phase === "dust-formation" ||
        phase === "complete")
    ) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      impactZoneRef.current.scale.setScalar(pulse * 0.8)
    }

    if (
      craterRef.current &&
      (phase === "impact" ||
        phase === "shockwave" ||
        phase === "secondary-effects" ||
        phase === "dust-formation" ||
        phase === "complete")
    ) {
      const targetScale = 0.3
      const currentScale = craterRef.current.scale.x
      if (currentScale < targetScale) {
        craterRef.current.scale.setScalar(Math.min(targetScale, currentScale + delta * 0.5))
      }
    }

    if (impactDustRef.current && (phase === "impact" || phase === "shockwave" || phase === "secondary-effects")) {
      const maxScale = 4
      const currentScale = impactDustRef.current.scale.x
      if (currentScale < maxScale) {
        impactDustRef.current.scale.setScalar(Math.min(maxScale, currentScale + delta * 1.5))
      }
      const opacity = Math.max(0.3, 1 - (currentScale / maxScale) * 0.7)
      ;(impactDustRef.current.material as THREE.PointsMaterial).opacity = opacity
    }

    if (shockwaveRef.current && phase === "shockwave") {
      const maxScale = 5
      const currentScale = shockwaveRef.current.scale.x
      if (currentScale < maxScale) {
        shockwaveRef.current.scale.setScalar(Math.min(maxScale, currentScale + delta * 3))
      }
      const opacity = Math.max(0, 1 - currentScale / maxScale)
      ;(shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = opacity
    }
  })

  const impactZoneRotation = useMemo(() => {
    const normal = impactPosition.clone().normalize()
    const up = new THREE.Vector3(0, 1, 0)
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(up, normal)
    return quaternion
  }, [impactPosition])

  return (
    <group>
      <Sphere ref={earthRef} args={[2, 128, 128]}>
        <meshStandardMaterial map={earthTexture} roughness={0.7} metalness={0.2} />
      </Sphere>

      {(phase === "impact" ||
        phase === "shockwave" ||
        phase === "secondary-effects" ||
        phase === "dust-formation" ||
        phase === "complete") && (
        <>
          <Sphere ref={impactMarkerRef} args={[1, 16, 16]} position={impactPosition} scale={0.15}>
            <meshBasicMaterial color="#ff0000" />
          </Sphere>

          <mesh ref={impactZoneRef} position={impactPosition} quaternion={impactZoneRotation} scale={0.8}>
            <ringGeometry args={[0.3, 0.35, 32]} />
            <meshBasicMaterial color="#ffff00" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>

          <Sphere ref={craterRef} args={[1, 32, 32]} position={impactPosition} scale={0.01}>
            <meshStandardMaterial color="#1a1a1a" roughness={1} metalness={0} />
          </Sphere>

          <points ref={impactDustRef} scale={0.5}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={2000} array={impactDustPositions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.04} color="#ff8800" transparent opacity={1} sizeAttenuation={true} />
          </points>

          <pointLight position={impactPosition} intensity={3} distance={3} color="#ff8800" />
        </>
      )}

      {phase === "shockwave" && (
        <mesh ref={shockwaveRef} position={impactPosition} scale={0.5}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function DustCloud({ phase, meteorData }: { phase: SimulationPhase; meteorData: any }) {
  const particlesRef = useRef<THREE.Points>(null)
  const scaleRef = useRef(0.1)

  const dustDensity = Math.min(8000, (meteorData.size / 10000) * 8000)
  const particleCount = Math.max(2000, Math.floor(dustDensity))

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 2.1 + Math.random() * 0.4

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  }, [particleCount])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    if (phase === "dust-formation" || phase === "complete") {
      particlesRef.current.rotation.y += delta * 0.08

      if (scaleRef.current < 1) {
        scaleRef.current = Math.min(1, scaleRef.current + delta * 0.4)
        particlesRef.current.scale.setScalar(scaleRef.current)
      }
    }
  })

  if (phase !== "dust-formation" && phase !== "complete") return null

  const dustOpacity = Math.min(0.9, (meteorData.size / 10000) * 0.9)

  return (
    <>
      <points ref={particlesRef} scale={0.1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color="#ff8800" transparent opacity={dustOpacity} sizeAttenuation={true} />
      </points>
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={10} color="#ff8800" />
    </>
  )
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null)

  const starPositions = useMemo(() => {
    const positions = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150
      positions[i * 3 + 1] = (Math.random() - 0.5) * 150
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150
    }
    return positions
  }, [])

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={3000} array={starPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" />
    </points>
  )
}

export default function RealisticImpactScene({
  meteorData,
  location,
  phase,
}: SceneProps & { asteroidVariant?: number }) {
  const asteroidVariant = useMemo(() => Math.floor(Math.random() * 5), [])

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} />
      <directionalLight position={[-10, -10, -10]} intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color="#ffffff" />
      <hemisphereLight args={["#ffffff", "#444444", 1]} />
      <Stars />
      <Meteor phase={phase} meteorData={meteorData} location={location} asteroidVariant={asteroidVariant} />
      <Earth phase={phase} location={location} />
      <DustCloud phase={phase} meteorData={meteorData} />
      <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} minDistance={6} maxDistance={20} />
    </Canvas>
  )
}
