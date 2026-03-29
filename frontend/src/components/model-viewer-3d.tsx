"use client";

import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Box, Plane, Text } from "@react-three/drei";
import * as THREE from "three";
import { modelData, Wall as WallType } from "@/lib/mock-data";
import { Cpu } from "lucide-react";

interface ModelViewer3DProps {
  isReady: boolean;
  elements?: any[]; // The real element array dynamically populated
  onWallSelect: (wall: any | null) => void;
  selectedWallId?: string | null;
}

const calculateWallTransform = (p1: [number, number], p2: [number, number], height: number = 3) => {
  const dx = p2[0] - p1[0];
  const dz = p2[1] - p1[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  
  const angle = Math.atan2(dz, dx);
  const midX = p1[0] + dx / 2;
  const midZ = p1[1] + dz / 2;
  
  return {
    dimensions: [length, height, 0.2] as [number, number, number],
    position: [midX, height / 2, midZ] as [number, number, number],
    rotation: [0, -angle, 0] as [number, number, number],
  };
};

const Wall: React.FC<{ wall: any; onSelect: (wall: any) => void; isSelected: boolean }> = ({ wall, onSelect, isSelected }) => {
  const [hovered, setHovered] = React.useState(false);
  
  // Real walls from API use standard types. Default to generic map for now.
  const color = wall.type === 'load-bearing' ? '#EF4444' : '#3B82F6';
  const hoverColor = new THREE.Color(color).multiplyScalar(1.5).getHexString();

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  const { dimensions, position, rotation } = wall.p1 && wall.p2 
    ? calculateWallTransform(wall.p1, wall.p2, wall.height || 3) 
    : { dimensions: wall.dimensions, position: wall.position, rotation: wall.rotation }; // Fallback to mock

  return (
    <Box
      args={dimensions}
      position={position}
      rotation={rotation}
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

const Scene: React.FC<{ elements: any[], onWallSelect: (wall: any) => void; selectedWallId?: string | null; }> = ({ elements, onWallSelect, selectedWallId }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} />
      
      <Plane
        args={[40, 40]} // Default fallback since floor_slab is mocked
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#333" metalness={0.1} roughness={0.9} />
      </Plane>
      
      {elements.map((wall) => (
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

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({ isReady, elements = [], onWallSelect, selectedWallId }) => {
  return (
    <div className="w-full h-full relative">
      {!isReady && <Placeholder />}
      <Canvas
        camera={{ position: [0, 60, 100], fov: 50 }}
        style={{ background: 'transparent' }}
        onClick={() => onWallSelect(null)}
      >
        {isReady && <Scene elements={elements.length > 0 ? elements : modelData.walls} onWallSelect={onWallSelect} selectedWallId={selectedWallId} />}
      </Canvas>
    </div>
  );
};

export default ModelViewer3D;
