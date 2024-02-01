import React from "react";
import {SvgShapeProps} from  "./svgHandler.tsx";
import SvgShape from "./svgHandler.tsx";


type SvgGroupProps = {
    shapes: SvgShapeProps[],
    width: number,
    count: number,
    smidgeTilt?: boolean,
    rowSpacing?: number,
    randomOverlap?: boolean,
};

const getRandomRotation = (impact = 1) => Math.floor(Math.random() * (15 + impact));
const getRandomWidth= (impact = 1) => Math.floor(Math.random() *(40+impact));



const SvgGroup: React.FC<SvgGroupProps> = ({ shapes, width, count, smidgeTilt, rowSpacing = 0, randomOverlap = false }) => {
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

export default SvgGroup;
