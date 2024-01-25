import { useGLTF } from '@react-three/drei'
import  * as THREE from 'three';

export const Model = () => {
    //const gltf = useGLTF('https://thinkuldeep.com/modelviewer/Astronaut.glb');
    const gltf = useGLTF('filename.gltf');
    const material = new THREE.MeshBasicMaterial({ color: "green" });
    // Iterate over the children of the scene
    gltf.scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
            // Replace the old material with the new one
            child.material = material;
            console.log(child);
        }
    });
    return <primitive object={gltf.scene} dispose={null} />;
};

// useGLTF.preload("/filename.gltf");