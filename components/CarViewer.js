"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function CarModel({ finish }) {
  const { scene } = useGLTF("/models/car.glb");
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.metalness = finish === "Glossy" ? 1 : 0.3;
      child.material.roughness = finish === "Matte" ? 1 : finish === "Satin" ? 0.6 : 0.1;
    }
  });
  return <primitive object={scene} scale={1.2} />;
}

export default function CarViewer({ finish }) {
  return (
    <Canvas camera={{ position: [2, 1, 4], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <CarModel finish={finish} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls enableZoom />
    </Canvas>
  );
}
