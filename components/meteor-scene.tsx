"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Trail } from "@react-three/drei"
import type * as THREE from "three"

function Meteor({ isAnimating }: { isAnimating: boolean }) {
  const meteorRef = useRef<THREE.Mesh>(null)
  const positionRef = useRef({ x: 5, y: 5, z: 5 })

  useFrame((state, delta) => {
    if (meteorRef.current && isAnimating) {
      // Animate meteor moving toward center
      positionRef.current.x -= delta * 2
      positionRef.current.y -= delta * 1.5
      positionRef.current.z -= delta * 2

      // Reset if too far
      if (positionRef.current.x < -2) {
        positionRef.current = { x: 5, y: 5, z: 5 }
      }

      meteorRef.current.position.set(positionRef.current.x, positionRef.current.y, positionRef.current.z)

      // Rotate meteor
      meteorRef.current.rotation.x += delta * 2
      meteorRef.current.rotation.y += delta * 1.5
    }
  })

  return (
    <Trail width={2} length={8} color="#ff6b35" attenuation={(t) => t * t}>
      <Sphere ref={meteorRef} args={[0.3, 32, 32]} position={[5, 5, 5]}>
        <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.3} />
      </Sphere>
    </Trail>
  )
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null)

  const starPositions = new Float32Array(1000 * 3)
  for (let i = 0; i < 1000; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 50
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50
  }

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={starPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" />
    </points>
  )
}

interface MeteorSceneProps {
  meteorData: any
  isAnimating: boolean
}

export default function MeteorScene({ meteorData, isAnimating }: MeteorSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars />
      <Meteor isAnimating={isAnimating} />
      <OrbitControls enableZoom={true} enablePan={false} />
    </Canvas>
  )
}
