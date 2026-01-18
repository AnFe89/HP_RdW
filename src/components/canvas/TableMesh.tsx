import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface TableMeshProps {
  position: [number, number, number];
  id: number;
  mode: '40k' | 'killteam' | 'aos_spearhead';
  isOccupied: boolean;
  onClick: (id: number) => void;
  isSelected: boolean;
}

export const TableMesh = ({ position, id, mode, isOccupied, onClick, isSelected }: TableMeshProps) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Pulse animation for selected state
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const color = isOccupied ? '#8b0000' : (isSelected ? '#66fcf1' : '#1f2833');
  const emissive = isSelected ? '#66fcf1' : (isOccupied ? '#8b0000' : '#000000');

  return (
    <group ref={meshRef} position={position} onClick={(e) => { e.stopPropagation(); onClick(id); }}>
      {/* Table Top */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.2, 2]} /> {/* 72x48 scale roughly */}
        <meshStandardMaterial 
          color={color} 
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-1.4, 0, -0.9]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#0b0c10" />
      </mesh>
      <mesh position={[1.4, 0, -0.9]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#0b0c10" />
      </mesh>
      <mesh position={[-1.4, 0, 0.9]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#0b0c10" />
      </mesh>
      <mesh position={[1.4, 0, 0.9]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#0b0c10" />
      </mesh>

      {/* Kill Team / Spearhead Divider (Visual only) */}
      {(mode === 'killteam' || mode === 'aos_spearhead') && (
        <mesh position={[0, 0.6, 0]}>
             <boxGeometry args={[0.05, 0.1, 2]} />
             <meshStandardMaterial color="#c5c6c7" emissive="#66fcf1" />
        </mesh>
      )}

      {/* Label */}
      <Html position={[0, 1.5, 0]} center transform sprite>
        <div className={`font-military text-xs px-2 py-1 border ${isSelected ? 'border-neon text-neon bg-void/90' : 'border-silver/20 text-silver/50'}`}>
          SECTOR {id}
        </div>
      </Html>
    </group>
  );
};
