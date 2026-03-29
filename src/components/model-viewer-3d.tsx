"use client";

import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Box, Plane, Text } from "@react-three/drei";
import * as THREE from "three";
import { modelData, Wall as WallType } from "@/lib/mock-data";
import { Cpu } from "lucide-react";

interface ModelViewer3DProps {
  isReady: boolean;
  onWallSelect: (wall: WallType | null) => void;
  selectedWallId?: string | null;
}

const Wall: React.FC<{ wall: WallType; onSelect: (wall: WallType) => void; isSelected: boolean }> = ({ wall, onSelect, isSelected }) => {
  const [hovered, setHovered] = React.useState(false);
  const color = wall.type === 'load_bearing' ? '#FF0000' : '#0000FF';
  const hoverColor = new THREE.Color(color).multiplyScalar(1.5).getHexString();

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <Box
      args={wall.dimensions}
      position={wall.position}
      rotation={wall.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(wall);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? `#${hoverColor}` : color}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : 0}
        metalness={0.2}
        roughness={0.8}
        transparent
        opacity={isSelected ? 1 : 0.8}
      />
    </Box>
  );
};

const Scene: React.FC<{ onWallSelect: (wall: WallType) => void; selectedWallId?: string | null; }> = ({ onWallSelect, selectedWallId }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} />
      
      <Plane
        args={[modelData.floor_slab.width, modelData.floor_slab.depth]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#333" metalness={0.1} roughness={0.9} />
      </Plane>
      
      {modelData.walls.map((wall) => (
        <Wall
          key={wall.id}
          wall={wall}
          onSelect={onWallSelect}
          isSelected={selectedWallId === wall.id}
        />
      ))}
      
      <OrbitControls makeDefault />
    </>
  );
};

const Placeholder = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 text-center">
        <Cpu className="h-16 w-16 text-primary mb-4 animate-pulse" />
        <p className="font-semibold text-lg">Awaiting Floor Plan</p>
        <p className="text-sm text-muted-foreground">Upload a .png file to generate the 3D model.</p>
    </div>
)

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({ isReady, onWallSelect, selectedWallId }) => {
  return (
    <div className="w-full h-full relative">
      {!isReady && <Placeholder />}
      <Canvas
        camera={{ position: [0, 60, 100], fov: 50 }}
        style={{ background: 'transparent' }}
        onClick={() => onWallSelect(null)}
      >
        {isReady && <Scene onWallSelect={onWallSelect} selectedWallId={selectedWallId} />}
      </Canvas>
    </div>
  );
};

export default ModelViewer3D;
