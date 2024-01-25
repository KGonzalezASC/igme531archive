import { useRef, useEffect } from 'react'
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

import { Mesh } from "three";

interface Three1000Props {
    position?: [number, number, number];
    color?: "red" | "blue" | "green" | "yellow" | "orange" | "purple";
}
const colors = ["red", "blue", "green", "yellow", "orange", "purple"];


const Three1000 =(props:Three1000Props)=>{
    const mesh = useRef<Mesh>(null);
    let colorIndex = 0;
    //start() is called when the component is mounted init the loop
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (mesh.current) {
                colorIndex = (colorIndex + 1) % colors.length;
                (mesh.current.material as THREE.MeshStandardMaterial).color = new THREE.Color(colors[colorIndex]);
            }
        }, 300);

        return () => clearInterval(intervalId); // Clear interval on unmount
    }, []);

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.x += 0.01;
            mesh.current.rotation.y += 0.01;
        }
    });
    return (
        <mesh {...props} ref={mesh} position={props.position || [0, 0, 0]}>
            {/*<planeGeometry args={[3, 4, 2, 4]}/>*/}
            <boxGeometry args={[1, 1, 1]}/>

            <meshStandardMaterial color={props.color || "red"}/>
        </mesh>
    );
}

export default Three1000;