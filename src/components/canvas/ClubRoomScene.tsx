import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { TableMesh } from './TableMesh';

interface ClubRoomSceneProps {
    onSelectSector: (id: number) => void;
    currentMode: '40k' | 'killteam';
}

export const ClubRoomScene = ({ onSelectSector, currentMode }: ClubRoomSceneProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleTableClick = (id: number) => {
        setSelectedId(id);
        onSelectSector(id);
    };

    // Table positions (Grid layout: 2 rows of 3)
    const tables = [
        { id: 1, pos: [-4, 0, -2] as [number, number, number] },
        { id: 2, pos: [0, 0, -2] as [number, number, number] },
        { id: 3, pos: [4, 0, -2] as [number, number, number] },
        { id: 4, pos: [-4, 0, 2] as [number, number, number] },
        { id: 5, pos: [0, 0, 2] as [number, number, number] },
        { id: 6, pos: [4, 0, 2] as [number, number, number] },
    ];

    // Mock occupied states
    const occupied = [2, 5];

    return (
        <Canvas className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />
            <OrbitControls 
                enableZoom={false} 
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 2.5}
                autoRotate
                autoRotateSpeed={0.5}
            />
            
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1} color="#66fcf1" />
            
            <group position={[0, -1, 0]}>
                <Grid infiniteGrid fadeDistance={30} sectionColor="#1f2833" cellColor="#0b0c10" />
                
                {tables.map((table) => (
                    <TableMesh 
                        key={table.id}
                        id={table.id}
                        position={table.pos}
                        mode={currentMode}
                        isOccupied={occupied.includes(table.id)}
                        onClick={handleTableClick}
                        isSelected={selectedId === table.id}
                    />
                ))}
            </group>
        </Canvas>
    );
};
