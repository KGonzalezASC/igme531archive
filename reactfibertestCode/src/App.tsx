// import Three1000 from "./components/three1000.tsx";
import './App.css'
import SvgShape from "./components/svgHandler.tsx";
import {useEffect, useState,Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import  {Model} from "./components/Model.tsx";
import {OrbitControls, PerspectiveCamera} from '@react-three/drei';

// const getRandomPosition = (): [number, number, number] => {
//     const x = Math.random() * 200 - 100; // Random number between -100 and 100
//     const y = Math.random() * 200 - 100; // Random number between -100 and 100
//     const z = Math.random() * 200 - 100; // Random number between -100 and 100
//     return [x, y, z];
// };


// const Scene = () => {
//     const gltf = useLoader(GLTFLoader, 'filename.gltf');
//     return <primitive object={gltf.scene} />;
// };


const App = () => {
    const [viewBox, setViewBox] = useState(`0 0 ${window.innerWidth} 800`);
    const [url, setUrl] = useState<string | null>(null);

    const downloadSvg = () => {
        const svgElement = document.querySelector("svg");
        if (!svgElement) {
            console.error('SVG element not found');
            return;
        }
        // set xml version to display :b
        const svgData = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg">\n${svgElement.innerHTML}\n</svg>`;
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filename.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setUrl(url);
    };





    //start() onComponentMount()
    useEffect(() => {
        const handleResize = () => {
            setViewBox(`0 0 ${window.innerWidth} 500`);
        };
        window.addEventListener('resize', handleResize);
        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <>
            <div id="canvas-container">
                <svg viewBox={viewBox} style={{width: '100%', height: "100%"}}>
                    <SvgShape
                        shapeType='line'
                        points={['0,0', '100,100']}
                        stroke='black'
                    />
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='orange'
                        pos={{x: 220, y: 300}}
                        rotation={122}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='polygon'
                        points={['120,100', '220,150', '220,250', '120,300', '20,250', '20,150']}
                        stroke='green'
                        pos={{x:0, y: 200}}
                        rotation={100}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='polygon'
                        points={['0,0', '100,0', '50,100']}
                        stroke='blue'
                        pos={{x: 100, y: 50}}
                        rotation={100}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='circle'
                        points={['0,0', 20]}
                        stroke='red'
                        pos={{x: 300, y: 100}}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='ellipse'
                        points={['0,0', [30, 40]]}
                        stroke='purple'
                        pos={{x: 130, y:250}}
                        fillLines={true}
                        rotation={0}
                    />
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='red'
                        pos={{x: 220, y: 300}}
                        rotation={85}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='orange'
                        pos={{x: 265, y: 180}}
                        rotation={24}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='blue'
                        pos={{x: 335, y: 180}}
                        rotation={3}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='black'
                        pos={{x: 265, y: 230}}
                        rotation={45}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='purple'
                        pos={{x: 450, y: 325}}
                        rotation={80}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='purple'
                        pos={{x: 400, y: 360}}
                        rotation={28}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='green'
                        pos={{x: 410, y: 245}}
                        rotation={12}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='blue'
                        pos={{x: 460, y: 440}}
                        rotation={47}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='rectangle'
                        points={[100, 100]}
                        stroke='cyan'
                        pos={{x: 515, y: 435}}
                        rotation={70}
                        fillLines={true}/>
                    <SvgShape
                        shapeType='circle'
                        points={['100,0', 20]}
                        stroke='red'
                        pos={{x: 300, y: 100}}
                        fillLines={true}
                        />
                    <SvgShape
                        shapeType='polygon'
                        points={['50,10','100,20','100,80','50,70']}
                        stroke='green'
                        pos={{x:220, y: 300}}
                        rotation={100}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='polygon'
                        points={['50,10','100,20','100,80','50,70']}
                        stroke='green'
                        pos={{x:220, y: 300}}
                        rotation={100}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='polygon'
                        points={["60,0", "60,0", "90,70", "0,20"]}
                        stroke='yellow'
                        pos={{x:250, y: 270}}
                        rotation={100}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='polygon'
                        points={["50,0", "150,0", "200,50", "0,50"]}
                        stroke='orange'
                        pos={{x: 410, y: 400}}
                        rotation={20}
                        fillLines={true}
                    />
                    <SvgShape
                        shapeType='polygon'
                        points={['0, 0', '100,0', '70, 60', '30,60']}
                        stroke='black'
                        pos={{x: 0, y: 0}}
                        rotation={0}
                        fillLines={false}
                    />
                    <SvgShape
                        shapeType='ellipse'
                        points={['0,0', [80, 40]]}
                        stroke='pink'
                        pos={{x: 400, y:300}}
                        fillLines={true}
                        rotation={-60}
                    />
                    <SvgShape
                        shapeType='ellipse'
                        points={['0,0', [30, 40]]}
                        stroke='red'
                        pos={{x: 450, y:350}}
                        fillLines={true}
                        rotation={0}
                    />
                    <SvgShape
                        shapeType='line'
                        points={['100,300', '400,300']}
                        stroke='red'
                    />
                </svg>
            </div>
            <button onClick={downloadSvg}>Download SVG</button>
            <Suspense>
                {url ? (
                    <Canvas style={{width: '100vw', height: '600px'}}>
                        <ambientLight/>
                        <Model/>
                        <OrbitControls />
                        <PerspectiveCamera
                            makeDefault
                            position={[125, 150, 10]}
                            fov={60}
                            zoom={0.9}
                        />
                    </Canvas>
                ) : null}
            </Suspense>
        </>
    );
};
export default App
