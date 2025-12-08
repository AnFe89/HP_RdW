import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import { useState, useEffect } from 'react';

{/* const Terrain = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Generate height data
    const { geometry, material } = useMemo(() => {
        const geo = new THREE.PlaneGeometry(20, 20, 32, 32);
        const count = geo.attributes.position.count;
        const zArray = geo.attributes.position.array;
        
        for (let i = 0; i < count; i++) {
             // Simple noise-like distortion
             const x = zArray[i * 3];
             const y = zArray[i * 3 + 1];
             zArray[i * 3 + 2] = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 2 
                               + Math.sin(x * 2) * Math.cos(y * 1) * 0.5;
        }
        
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: '#66fcf1',
            wireframe: true,
            emissive: '#0b0c10',
            emissiveIntensity: 0.5,
            roughness: 0.5,
            metalness: 1,
        });

        return { geometry: geo, material: mat };
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        // Slow rotation
        meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
        // Mouse parallax
        const { x, y } = state.mouse;
        meshRef.current.rotation.x = -Math.PI / 4 + (y * 0.1);
        meshRef.current.rotation.y = (x * 0.1);
    });

    return (
        <mesh 
            ref={meshRef} 
            geometry={geometry} 
            material={material} 
            rotation={[-Math.PI / 3, 0, 0]} 
            position={[0, -2, -5]}
        />
    );
}; */}

const Debris = () => {
    const [debrisData, setDebrisData] = useState<{position: [number, number, number], scale: number}[]>([]);

    useEffect(() => {
        setDebrisData([...Array(20)].map(() => ({
            position: [
                (Math.random() - 0.5) * 15, 
                (Math.random() - 0.5) * 10, 
                (Math.random() - 0.5) * 5
            ] as [number, number, number],
            scale: Math.random() * 0.5
        })));
    }, []);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            {debrisData.map((data, i) => (
                <mesh 
                    key={i} 
                    position={data.position}
                    scale={data.scale}
                >
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                    <meshStandardMaterial color="#c5c6c7" wireframe />
                </mesh>
            ))}
        </Float>
    );
};

export const HeroScene = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas dpr={[1, 1.5]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <color attach="background" args={['#0b0c10']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#66fcf1" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b0000" />
                
                {/* <Terrain /> */}
                <Debris />
                
                <fog attach="fog" args={['#0b0c10', 5, 20]} />
            </Canvas>
        </div>
    );
};
