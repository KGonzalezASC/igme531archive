import React, {useEffect, useRef, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SvgTruchetTile } from "./components/svgTileHandler.tsx";
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Model } from "./components/Model.tsx";
import './App.css';
import {TruchetPattern} from "./components/svgGroupHandler.tsx";

interface TileParams {
    pos: {
        x: number;
        y: number;
    };
    rotationIndex: number;
    isFlipped?: boolean;
}

const generateTruchetPattern = (patternParams: TileParams[]): JSX.Element[] => {
    return patternParams.map((params, index) => (
        <SvgTruchetTile
            key={index}
            shapeProps={{ stroke: 'black' }}
            pos={params.pos}
            baseNoise={0.1}
            rotationIndex={params.rotationIndex}
            isFlipped={params.isFlipped}
        />
    ));
};

const App = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [viewBox, setViewBox] = useState(`0  0 ${window.innerWidth}  800`);
    const [url, setUrl] = useState<string | null>(null);
    const [seed, setSeed] = useState<string>(uuidv4());

    useEffect(() => {
        const handleResize = () => {
            setViewBox(`0  0 ${window.innerWidth}  500`);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const patternParams = [
        { pos: { x:  50, y:  0 }, rotationIndex:  1 },
        { pos: { x:  150, y:  100 }, rotationIndex:  1 },
        { pos: { x:  150, y:  0 }, rotationIndex:  2 },
        { pos: { x:  50, y:  100 }, rotationIndex:  2 },
        { pos: { x:  235, y:  65 }, rotationIndex:  3 },
        { pos: { x:  400, y:  0 }, rotationIndex:  5 },
        { pos: { x:  400, y:  100 }, rotationIndex:  4 },
        { pos: { x:  50, y:  100 }, rotationIndex:  5 },
        { pos: { x:  50, y:  0 }, rotationIndex:  4 },
        { pos: { x:  315, y:  65 }, rotationIndex:  3, isFlipped: true },
    ];

    // Generate reflection pattern parameters
    const reflectionPatternParams = patternParams.map(params => ({
        ...params,
        pos: { x: params.pos.x, y: -params.pos.y } // Reflect over the x-axis
    }));

    // Combine original and reflection pattern parameters
    const combinedPatternParams = [...patternParams, ...reflectionPatternParams];

    // Calculate the size of the original pattern
    const originalPatternWidth =  450; // Assuming the original pattern width is  500
    const originalPatternHeight =  300; // Assuming the original pattern height is  200
    const newPatternParams = combinedPatternParams.flatMap(params => {
        // Define the common properties for all positions
        const commonProperties = {
            rotationIndex: params.rotationIndex,
            isFlipped: params.isFlipped,
        };

        // Define specific properties for the "Bottom-left" position
        const bottomLeftProperties = {
            pos: { x: params.pos.x, y: params.pos.y + originalPatternHeight },
            rotationIndex: (params.rotationIndex +  3) %  6,
            isFlipped: true, // Flip the tile for the "Bottom-left" position
        };

        // Define specific properties for the "BottomBottomRight" position
        const bottomBottomRightProperties =  { pos: { x: params.pos.x +originalPatternWidth, y: params.pos.y + originalPatternHeight *   2 }, rotationIndex: (params.rotationIndex+3) %   3, isFlipped: true };

        // Combine the common properties with the specific properties for the "Bottom-left" and "BottomBottomRight" positions
        const newPositions = [
            { pos: { x: params.pos.x, y: params.pos.y }, ...commonProperties }, // Original position
            { pos: { x: params.pos.x + originalPatternWidth, y: params.pos.y }, ...commonProperties }, // Right
            bottomLeftProperties, // Use the specific properties for the "Bottom-left" position
            { pos: { x: params.pos.x + originalPatternWidth, y: params.pos.y + originalPatternHeight }, ...commonProperties }, // BottomRight
            { pos: { x: params.pos.x - originalPatternWidth, y: params.pos.y }, ...commonProperties }, // OuterLeft-row1
            { pos: { x: params.pos.x - originalPatternWidth, y: params.pos.y + originalPatternHeight }, ...commonProperties }, // OuterLeft-row2
            bottomBottomRightProperties, // Use the specific properties for the "BottomBottomRight" position
            { pos: { x: -params.pos.x, y: params.pos.y + originalPatternHeight *   2 }, rotationIndex: (params.rotationIndex+3) %   3, isFlipped: false },
            { pos: { x: params.pos.x, y: params.pos.y + originalPatternHeight *   2 }, rotationIndex: (params.rotationIndex ) %   3, isFlipped: true}, // BottomBottomleft
        ];

        return newPositions.map(newPos => ({
            ...params,
            pos: newPos.pos,
            rotationIndex: newPos.rotationIndex,
            isFlipped: newPos.isFlipped, // Explicitly set for each new position
        }));
    });





// Combine the original, reflection, and new pattern parameters
    const finalPatternParams = [...combinedPatternParams, ...newPatternParams];

    const pattern = generateTruchetPattern(finalPatternParams);

    const updateSeed = () => setSeed(uuidv4());
    const downloadSvg = () => {
        if (!svgRef.current) return;
        const svgData = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg">\n${svgRef.current.innerHTML}\n</svg>`;
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

    return (
        <>
            <div id="canvas-container">
                <svg ref={svgRef} viewBox={viewBox} style={{width: '100vw', height: "100vh"}}>
                    {pattern}

                    <TruchetPattern rows={20} cols={20} tileSize={50} seed={seed} />
                </svg>
            </div>
            <button onClick={updateSeed}>Regenerate Seed</button>
            <button onClick={downloadSvg}>Download SVG</button>
            {url && (
                <Canvas style={{ width: '100vw', height: '600px' }}>
                    <ambientLight />
                    <Model />
                    <OrbitControls />
                    <PerspectiveCamera
                        makeDefault
                        position={[125,  150,  10]}
                        fov={60}
                        zoom={0.9}
                    />
                </Canvas>
            )}
        </>
    );
};

export default App;
