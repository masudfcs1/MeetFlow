"use client"

import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef } from "react"
import type * as THREE from "three"
import { TextureLoader } from "three"

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  // Built-in realistic Earth texture bundled with next-lite
  const [earthTexture] = useLoader(TextureLoader, ["/assets/3d/texture_earth.jpg"])

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001 // Slow continuous rotation
    }
  })

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} /> {/* Larger sphere for Earth */}
      <meshStandardMaterial map={earthTexture} metalness={0.2} roughness={0.8} />
    </mesh>
  )
}

export default function Hero3DSceneEarth() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} /> {/* Simulating sunlight */}
      <Environment preset="sunset" background /> {/* Realistic space background */}
      <Earth />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
