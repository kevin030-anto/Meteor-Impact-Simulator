"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import * as THREE from "three"

interface AsteroidModelProps {
  meteorData: any
}

function RotatingAsteroid({ meteorData }: { meteorData: any }) {
  const asteroidRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x += delta * 0.3
      asteroidRef.current.rotation.y += delta * 0.5
    }
  })

  // Scale based on asteroid size
  const scale = Math.max(0.8, Math.min(2, meteorData.size / 300))

  // Create rocky texture with noise
  const asteroidGeometry = new THREE.IcosahedronGeometry(scale, 2)
  const positions = asteroidGeometry.attributes.position.array

  // Add randomness to vertices for irregular shape
  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
    const noise = Math.random() * 0.15
    vertex.normalize().multiplyScalar(scale * (1 + noise))
    positions[i] = vertex.x
    positions[i + 1] = vertex.y
    positions[i + 2] = vertex.z
  }

  asteroidGeometry.attributes.position.needsUpdate = true
  asteroidGeometry.computeVertexNormals()

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4488ff" />

      <mesh ref={asteroidRef} geometry={asteroidGeometry}>
        <meshStandardMaterial color="#6b5d4f" roughness={0.9} metalness={0.1} flatShading={true} />
      </mesh>

      {/* Add small craters as darker spots */}
      {[...Array(8)].map((_, i) => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = scale * 1.02

        return (
          <Sphere
            key={i}
            args={[0.08, 8, 8]}
            position={[
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.sin(phi) * Math.sin(theta),
              radius * Math.cos(phi),
            ]}
          >
            <meshStandardMaterial color="#3d3530" roughness={1} />
          </Sphere>
        )
      })}

      <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={2} />
    </>
  )
}

export default function AsteroidModel({ meteorData }: AsteroidModelProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["#0a0a0a"]} />
      <RotatingAsteroid meteorData={meteorData} />
    </Canvas>
  )
}
