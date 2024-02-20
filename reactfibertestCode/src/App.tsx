// import Three1000 from "./components/three1000.tsx";
import './App.css'
import SvgShape, {SvgShapeProps} from "./components/svgHandler.tsx";
import React, {useEffect, useState,Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import  {Model} from "./components/Model.tsx";
import { v4 as uuidv4 } from 'uuid';
import {OrbitControls, PerspectiveCamera} from '@react-three/drei';
import { SvgGroup, SvgRandomGroup } from './components/svgGroupHandler.tsx';




// const getRandomPosition = (): [number, number, number] => {
//     const x = Math.random() * 200 - 100; // Random number between -100 and 100
//     const y = Math.random() * 200 - 100; // Random number between -100 and 100
//     const z = Math.random() * 200 - 100; // Random number between -100 and 100
//     return [x, y, z];
// };

const App = () => {
    const [viewBox, setViewBox] = useState(`0 0 ${window.innerWidth} 800`);
    const [url, setUrl] = useState<string | null>(null);
    const [seed, setSeed] = useState<string>(uuidv4());

    const updateSeed = () => {
        setSeed(uuidv4());
    };


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


    const noiseGroup :Array<{ shapeType: SvgShapeProps['shapeType'], points: SvgShapeProps['points'], stroke: string }> = [
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
        { shapeType: 'rectangle', points:[.1,10],stroke:'orange'},
    ];

    const noiseGroupAlt: Array<{ shapeType: SvgShapeProps['shapeType'], points: [number], stroke: string }> = [
        { shapeType: 'pathC', points: [10], stroke: 'orange'},
        { shapeType: 'pathC', points: [10], stroke: 'red'},
        { shapeType: 'pathC', points: [10], stroke: 'green'},
        { shapeType: 'pathC', points: [10], stroke: 'blue'},
        { shapeType: 'pathC', points: [10], stroke: 'yellow'},
        { shapeType: 'pathC', points: [10], stroke: 'pink'},
        { shapeType: 'pathC', points: [10], stroke: 'cyan'},
        { shapeType: 'pathC', points: [10], stroke: 'purple'},
        { shapeType: 'pathC', points: [10], stroke: 'brown'},
        { shapeType: 'pathC', points: [10], stroke: 'grey'},
        { shapeType: 'pathC', points: [10], stroke: 'lavender'},
        { shapeType: 'pathC', points: [10], stroke: 'jade'},
    ];

    const squiggle: Array<{ shapeType: SvgShapeProps['shapeType'], points: SvgShapeProps['points'], stroke: string }> = [
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
        { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},

    ];



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
                <svg viewBox={viewBox} style={{width: '100vw', height: "100%"}}>
                {/*    <SvgRandomGroup
                        shapes={squiggle}
                        width={600}
                        count={12}
                        smidgeTilt={true}
                        rowSpacing={68}
                        randomOverlap={true}
                        seed={seed}
                    />*/}
        {/*           <SvgRandomGroup
                        shapes={noiseGroupAlt}
                        width={600}
                        count={22}
                        smidgeTilt={true}
                        rowSpacing={38}
                        randomOverlap={true}
                        seed={seed}
                    />*/}
                   <SvgRandomGroup
                        shapes={noiseGroup}
                        width={600}
                        count={40}
                        smidgeTilt={true}
                        rowSpacing={50}
                        randomOverlap={true}
                        seed={seed}
                    />
                </svg>
            </div>
            <button onClick={updateSeed}>Regenerate Seed</button>
            <button onClick={downloadSvg}>Download SVG</button>
            <Suspense>
                {url ? (
                    <Canvas style={{width: '100vw', height: '600px'}}>
                        <ambientLight/>
                        <Model/>
                        <OrbitControls/>
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
