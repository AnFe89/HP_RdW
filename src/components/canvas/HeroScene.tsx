import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Helper to create a canvas texture for a dice face
const createDieFace = (number: number, color: string = '#ffffff', dotColor: string = '#000000') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);

    // Border/Edge (simulated by inner stroke)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 40; // thick border to simulate edge
    ctx.strokeRect(20, 20, 472, 472);

    // Dots
    ctx.fillStyle = dotColor;
    const r = 40; // dot radius
    const c = 256; // center
    const g = 140; // gap from center

    const drawDot = (x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    };

    if (number === 1 || number === 3 || number === 5) drawDot(c, c);
    if (number > 1) {
        drawDot(c - g, c - g); // Top Left
        drawDot(c + g, c + g); // Bottom Right
    }
    if (number > 3) {
        drawDot(c + g, c - g); // Top Right
        drawDot(c - g, c + g); // Bottom Left
    }
    if (number === 6) {
        drawDot(c - g, c); // Mid Left
        drawDot(c + g, c); // Mid Right
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
};

const Dice = () => {
    const { viewport } = useThree();
    const [diceData, setDiceData] = useState<{position: [number, number, number], rotation: [number, number, number], scale: number}[]>([]);
    
    // Generate materials for faces 1-6
    const materials = useMemo(() => {
        // Standard Opposites sum to 7:
        // Right(0)=1, Left(1)=6
        // Top(2)=2, Bottom(3)=5
        // Front(4)=3, Back(5)=4
        const order = [1, 6, 2, 5, 3, 4];
        return order.map(n => new THREE.MeshStandardMaterial({ 
            map: createDieFace(n, '#eeeeee', '#000000'),
            roughness: 0.2,
            metalness: 0.1
        }));
    }, []);

    useEffect(() => {
        // Dynamic exclusion zone based on viewport
        // On mobile (narrow width), we need a smaller exclusion zone for the logo
        const mobile = viewport.width < 10;
        const exclusionX = mobile ? viewport.width * 0.3 : 6; 
        const exclusionY = mobile ? viewport.height * 0.2 : 4;

        const count = mobile ? 15 : 25; // Reduce count slightly for mobile to avoid clutter
        const newDice: {position: [number, number, number], rotation: [number, number, number], scale: number}[] = [];

        for (let i = 0; i < count; i++) {
            let x, y, z;
            let attempts = 0;
            do {
                // Spread across the full viewport with some padding
                x = (Math.random() - 0.5) * viewport.width * 1.5; 
                y = (Math.random() - 0.5) * viewport.height * 1.5;
                z = (Math.random() - 0.5) * 10;
                attempts++;
            } while (
                // Exclude center area where logo is
                (Math.abs(x) < exclusionX && Math.abs(y) < exclusionY) && 
                attempts < 100
            );

            newDice.push({
                position: [x, y, z],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
                scale: 0.2 + Math.random() * 0.25 
            });
        }
        setDiceData(newDice);
    }, [viewport.width, viewport.height]); // Re-run when viewport changes

    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame((_, delta) => {
        meshRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            mesh.rotation.x += delta * (0.2 + (i % 3) * 0.1);
            mesh.rotation.y += delta * (0.3 + (i % 2) * 0.1);
        });
    });

    return (
        <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
            {diceData.map((data, i) => (
                <mesh 
                    key={i} 
                    ref={el => meshRefs.current[i] = el}
                    position={data.position}
                    rotation={data.rotation}
                    scale={data.scale}
                    material={materials}
                >
                    <boxGeometry args={[1, 1, 1]} />
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
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#66fcf1" />
                
                <Dice />
                
                <fog attach="fog" args={['#0b0c10', 5, 25]} />
            </Canvas>
        </div>
    );
};
