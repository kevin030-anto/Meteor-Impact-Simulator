"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import type * as THREE from "three"
import * as THREE_NS from "three"

function Earth({ showImpact, location }: { showImpact: boolean; location: any }) {
  const earthRef = useRef<THREE.Mesh>(null)

  const earthTexture = useLoader(THREE_NS.TextureLoader, "/earth-texture.jpg")

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]}>
      <meshStandardMaterial map={earthTexture} roughness={0.7} metalness={0.2} />
      {showImpact && (
        <Sphere args={[0.2, 16, 16]} position={[1.5, 0.5, 1]}>
          <meshBasicMaterial color="#ff0000" />
        </Sphere>
      )}
    </Sphere>
  )
}

function DustCloud({ show }: { show: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = 2000
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 2.5 + Math.random() * 1.5

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state, delta) => {
    if (particlesRef.current && show) {
      particlesRef.current.rotation.y += delta * 0.05
      const scale = Math.min(1, particlesRef.current.scale.x + delta * 0.5)
      particlesRef.current.scale.set(scale, scale, scale)
    }
  })

  if (!show) return null

  return (
    <points ref={particlesRef} scale={0.1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8b7355" transparent opacity={0.6} />
    </points>
  )
}

interface EarthWithDustProps {
  showDust: boolean
  location: any
  showImpact: boolean
}

export default function EarthWithDust({ showDust, location, showImpact }: EarthWithDustProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Earth showImpact={showImpact} location={location} />
      <DustCloud show={showDust} />
      <OrbitControls enableZoom={true} enablePan={false} />
    </Canvas>
  )
}
