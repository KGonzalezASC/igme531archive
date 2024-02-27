import React, {memo, useEffect, useMemo, useState} from "react";
import {SvgShapeProps} from  "./svgHandler.tsx";
import SvgShape from "./svgHandler.tsx";
import {SvgTruchetTile} from "./svgTileHandler.tsx";
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import {v4 as uuidv4} from "uuid";

// Create a seeded PRNG function

type SvgGroupProps = {
    shapes: SvgShapeProps[],
    width: number,
    count: number,
    smidgeTilt?: boolean,
    rowSpacing?: number,
    randomOverlap?: boolean,
    seed?: string; // re-render on slider change

};

const getRandomRotation = (impact = 1) => Math.floor(Math.random() * (15 + impact));
const getRandomWidth= (impact = 1) => Math.floor(Math.random() *(40+impact));



export const SvgGroup: React.FC<SvgGroupProps> = ({ shapes, width, count, smidgeTilt, rowSpacing = 0, randomOverlap = false }) => {
    const shapeWidth = width / count;
    const midPoint = Math.ceil(shapes.length / 2.5); // eyeball it lol
    return (
        <>
            {shapes.map((shapeProps, shapeIndex) => (
                <g key={shapeIndex}>
                    {Array.from({ length: count }).map((_, index) => (
                        <SvgShape
                            key={index}
                            {...shapeProps}
                            pos={{
                                x: index * shapeWidth + (randomOverlap && shapeIndex >= midPoint ? getRandomWidth() : 0),
                                y: shapeIndex * rowSpacing + (randomOverlap && shapeIndex >= midPoint ? getRandomWidth() : (shapeIndex >= midPoint ? 5 + shapeIndex : 0))
                            }}
                            rotation={smidgeTilt && shapeIndex >= midPoint && randomOverlap ? getRandomRotation(10) : getRandomRotation()}
                            fillLines={true}
                        />
                    ))}
                </g>
            ))}
        </>
    );
};

export const SvgRandomGroup: React.FC<SvgGroupProps> = memo(({
                                                                 shapes,
                                                                 width,
                                                                 count,
                                                                 smidgeTilt = false,
                                                                 rowSpacing = 0,
                                                                 randomOverlap = false,
                                                                 seed
                                                             }) => {
    const shapeWidth = width / count;

    //move seed code into component
    const noise2D = useMemo(() => {
        const prng = alea(seed);
        return createNoise2D(prng);
    }, [seed]);
    //clouds are 4d noise


    return (
        <>
            {shapes.map((shapeProps, shapeIndex) => (
                <g key={shapeIndex}>
                    {Array.from({ length: count }).map((_, index) => {
                        if (Math.random() < 0.3) { // Adjust this threshold as needed
                            return null; // Skip rendering this shape with a certain probability
                        }
                        return Array.from({ length: 3 }).map((__, overlapIndex) => {
                            const baseNoise = noise2D(index + shapeIndex, overlapIndex);
                            const noiseOffsetX = randomOverlap ? baseNoise * 30 : 0;
                            const noiseOffsetY = randomOverlap ? baseNoise * 30 : 0;
                            const positionX = index * shapeWidth + noiseOffsetX + (overlapIndex * .12); // Adjust for clustering
                            const positionY = shapeIndex * rowSpacing + (overlapIndex * 5) + noiseOffsetY;
                            const baseRotation = smidgeTilt ? noise2D(index, shapeIndex) * 360 : 0;
                            const rotationAdjustment = [-45, 45, 108]; // Adjust these values as needed to create the desired "<" shape
                            const rotation = baseRotation + rotationAdjustment[overlapIndex];

                            return (
                                <SvgShape
                                    key={`${index}-${overlapIndex}`}
                                    {...shapeProps}
                                    pos={{ x: positionX, y: positionY }}
                                    rotation={rotation}
                                    fillLines
                                />
                            );
                        });
                    })}
                </g>
            ))}
        </>
    );
});



interface TruchetPatternProps {
    rows: number;
    cols: number;
    tileSize: number;
    seed: string;

}

export const TruchetPattern: React.FC<TruchetPatternProps> = ({ rows, cols, tileSize, seed }) => {
    const [baseNoise, setBaseNoise] = useState(0);
    // Function to determine the rotation index based on row and column indices
    const getRotationIndex = (row: number, col: number): number => {
        // Alternate rotations based on the sum of row, column, and shape indices
        return (row + col) %  5;
    };


    useEffect(() => {
        const prng = alea(seed);
        const noise2D = createNoise2D(prng);

        const interval = setInterval(() => {
            // Update baseNoise with a new value from the noise function
            const newNoiseValue = noise2D(Math.sin(Date.now()*.001), Math.sin(Date.now()*.001));
            setBaseNoise(newNoiseValue);
        },  500); // Adjust the interval as needed

        return () => clearInterval(interval);
    }, [seed]);

    return (
        <>
            {Array.from({ length: rows}).map((_, row) => (
                Array.from({ length: cols }).map((_, col) => {
                    return (
                        <SvgTruchetTile
                            key={`${row}-${col}`}
                            shapeProps={{ stroke: '#000000' }}
                            pos={{ x: col * tileSize, y: row * tileSize }}
                            baseNoise={baseNoise}
                            rotationIndex={getRotationIndex(row, col)}
                            opacity={.1}
                        />
                    );
                })
            ))}
        </>
    );
};


