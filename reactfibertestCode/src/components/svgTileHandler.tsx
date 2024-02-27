import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SvgTruchetTileProps {
    shapeProps: {
        stroke: string;
    };
    pos: {
        x: number;
        y: number;
    };
    rotationIndex: number;
    baseNoise: number;
    isFlipped?: boolean;
    opacity?: number;
}

const GridPattern = ({ id, stroke }: { id: string; stroke: string }) => (
    <defs>
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
            <path className="smallGridPath" d="M  0  0 L  0  10 M  0  5 L  10  5" stroke={stroke} strokeWidth="10" />
        </pattern>
    </defs>
);

export const SvgTruchetTile: React.FC<SvgTruchetTileProps> = ({
                                                                  shapeProps,
                                                                  pos,
                                                                  baseNoise,
                                                                  rotationIndex =  0,
                                                                  isFlipped = false,
                                                                  opacity =  1,
                                                              }) => {
    const size =  69.282;
    const rotations = [-90,  44.5,  45,  0,-44.5, -45, 90];
    const rotation = rotations[rotationIndex];
    const patternId = uuidv4();



    const path1Noise =baseNoise *  10;
    const path2Noise = baseNoise *  5;
    const lineNoise = baseNoise *  3;

    return (
        <g transform={`translate(${pos.x}, ${pos.y}) rotate(${rotation} ${size /  2} ${size /  2})`} {...shapeProps}>
            <GridPattern id={patternId} stroke="green" />
            <path
                d={`M  0  0 Q ${size /  2 + path1Noise} ${size /  2 + path1Noise} ${size}  0`}
                fill={(rotation ===  45 || rotation === -45) ? `url(#${patternId})` : 'transparent'}
                stroke={shapeProps.stroke}
                strokeWidth="3"
                style={{ opacity }}
            />
            <path
                d={`M  0 ${size} Q ${size /  2 - path2Noise} ${size /  2 - path2Noise} ${size} ${size}`}
                fill={(rotation ===  45 || rotation === -45) ? `url(#${patternId})` : 'transparent'}
                stroke={shapeProps.stroke}
                strokeWidth="3"
                style={{ opacity }}

            />
            {rotation ===  44.5 || rotation ===  45 || rotation ===  -45 || rotation ===  -44.5 ?
                <line
                    x1={size /  4 + lineNoise}
                    y1={size /  2 + lineNoise}
                    x2={3 * size /  4 - lineNoise}
                    y2={size /  2 - lineNoise}
                    stroke="#FFD3DA"
                    strokeWidth="3"
                /> :
                <CoolPattern size={size} rotationIndex={rotationIndex} baseNoise={baseNoise} isFlipped={isFlipped} opacity={opacity} />
            }
        </g>
    );
};



const CoolPattern = ({
                         size,
                         rotationIndex,
                         baseNoise,
                         isFlipped = false, // Add isFlipped prop with default false
                        opacity = 1
                     }: {
    size: number;
    rotationIndex: number;
    baseNoise: number;
    isFlipped?: boolean; // Make isFlipped optional
    opacity?: number;
}) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const numPoints = 50;
    const radiusIncrement = 1;
    const angleIncrement = (2 * Math.PI) / numPoints - baseNoise % Math.PI / 4;

    const pathData = Array.from({ length: numPoints }).map((_, index) => {
        const radius = index * radiusIncrement;
        const angle = index * angleIncrement + (rotationIndex === 1 ? Math.PI / 4 : 0);
        const x = isFlipped
            ? -radius * Math.cos(angle) + centerX
            : radius * Math.cos(angle) + centerX;
        const y = centerY + radius * Math.sin(angle);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <path d={pathData} stroke="#FFD3DA" strokeWidth="3" fill="none"  style={{ opacity }}/>
    );
};
