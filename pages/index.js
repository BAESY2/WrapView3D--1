import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";

function Car({ modelPath, color, finish, material, decal, twoTone }) {
  const { scene } = useGLTF(modelPath);

  const mainColor = color;
  const secondaryColor = twoTone ? "#000000" : color;

  scene.traverse((child) => {
    if (child.isMesh) {
      const isSecondary =
        child.name.toLowerCase().includes("roof") ||
        child.name.toLowerCase().includes("mirror");
      const appliedColor = isSecondary ? secondaryColor : mainColor;
      child.material.color.set(appliedColor);

      // 마감
      if (finish === "Gloss") {
        child.material.metalness = 0.8;
        child.material.roughness = 0.2;
      } else if (finish === "Matte") {
        child.material.metalness = 0.2;
        child.material.roughness = 0.8;
      } else if (finish === "Satin") {
        child.material.metalness = 0.5;
        child.material.roughness = 0.5;
      }

      // 재질
      if (material === "Carbon") {
        child.material.metalness = 1.0;
        child.material.roughness = 0.4;
      }

      // 데칼
      if (decal === "Stripe" && child.name.toLowerCase().includes("hood")) {
        child.material.color.offsetHSL(0.1, 0, 0.1);
      } else if (decal === "Side" && child.name.toLowerCase().includes("door")) {
        child.material.color.offsetHSL(-0.1, 0.1, 0.1);
      }
    }
  });

  return (
    <primitive
      object={scene}
      scale={1.2}
      position={[0, -0.8, 0]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
}

export default function Home() {
  const [model, setModel] = useState("/models/ferrari.glb");
  const [color, setColor] = useState("#d62828");
  const [finish, setFinish] = useState("Gloss");
  const [material, setMaterial] = useState("Vinyl");
  const [decal, setDecal] = useState("None");
  const [twoTone, setTwoTone] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 1200);
  };

  const models = [
    { name: "Ferrari F8", path: "/models/ferrari.glb" },
    { name: "Lamborghini Huracan", path: "/models/lamborghini.glb" },
    { name: "Porsche 911", path: "/models/porsche.glb" },
  ];

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white overflow-hidden">
      <h1 className="absolute top-6 w-full text-center text-4xl font-extrabold">
        WrapView 3D Configurator
      </h1>

      <Canvas camera={{ position: [2, 1.2, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Car
            modelPath={model}
            color={color}
            finish={finish}
            material={material}
            decal={decal}
            twoTone={twoTone}
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan enableZoom />
      </Canvas>

      {/* 하단 UI */}
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="absolute bottom-0 w-full bg-black/30 backdrop-blur-md p-6 flex flex-wrap justify-center gap-6 shadow-2xl"
      >
        {/* 모델 선택 */}
        <div>
          <h3 className="font-semibold mb-2 text-center">Model</h3>
          <div className="flex gap-2">
            {models.map((m) => (
              <button
                key={m.path}
                onClick={() => setModel(m.path)}
                className={`px-3 py-2 rounded-lg ${
                  model === m.path
                    ? "bg-white text-black"
                    : "bg-transparent border border-white"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* 색상 */}
        <div>
          <h3 className="font-semibold mb-2 text-center">Color</h3>
          <div className="flex gap-2">
            {["#d62828", "#000000", "#ffffff", "#0055ff", "#22c55e"].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border border-white"
                  style={{ backgroundColor: c }}
                />
              )
            )}
          </div>
        </div>

        {/* 마감 */}
        <div>
          <h3 className="font-semibold mb-2 text-center">Finish</h3>
          <div className="flex gap-2">
            {["Gloss", "Matte", "Satin"].map((type) => (
              <button
                key={type}
                onClick={() => setFinish(type)}
                className={`px-3 py-1 rounded-lg ${
                  finish === type
                    ? "bg-white text-black"
                    : "bg-transparent border border-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 재질 */}
        <div>
          <h3 className="font-semibold mb-2 text-center">Material</h3>
          <div className="flex gap-2">
            {["Vinyl", "TPU", "Carbon"].map((m) => (
              <button
                key={m}
                onClick={() => setMaterial(m)}
                className={`px-3 py-1 rounded-lg ${
                  material === m
                    ? "bg-white text-black"
                    : "bg-transparent border border-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 데칼 */}
        <div>
          <h3 className="font-semibold mb-2 text-center">Decal</h3>
          <div className="flex gap-2">
            {["None", "Stripe", "Side"].map((d) => (
              <button
                key={d}
                onClick={() => setDecal(d)}
                className={`px-3 py-1 rounded-lg ${
                  decal === d
                    ? "bg-white text-black"
                    : "bg-transparent border border-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 투톤 */}
        <div>
          <h3 className="font-semibold mb-2 text-center">Two-Tone</h3>
          <button
            onClick={() => setTwoTone(!twoTone)}
            className={`px-4 py-2 rounded-lg ${
              twoTone
                ? "bg-white text-black"
                : "bg-transparent border border-white"
            }`}
          >
            {twoTone ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* 적용 */}
        <div className="flex flex-col justify-center">
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Apply
          </button>
        </div>
      </motion.div>

      {/* 적용 애니메이션 */}
      {applied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white"
        >
          ✅ Changes Applied!
        </motion.div>
      )}
    </div>
  );
}
