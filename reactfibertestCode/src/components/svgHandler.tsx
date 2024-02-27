import React, {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

//arbitrary types for interface
type Point = { x: number, y: number };
type PolygonPoints = Point[];
//svgs need the ability to rotate around their center and not the viewbox...
//googled for half and hour and jerry rigged this solution source: https://stackoverflow.com/questions/2792443/finding-the-centroid-of-a-polygon
//from gist i got integrate or approach a value from area of polygon that defines its center
const calculateCentroid = (points: PolygonPoints): Point => {
    const n = points.length;
    let area = 0;
    let cx = 0;
    let cy = 0;

    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const crossProduct = points[i].x * points[j].y - points[j].x * points[i].y;
        area += crossProduct;
        cx += (points[i].x + points[j].x) * crossProduct;
        cy += (points[i].y + points[j].y) * crossProduct;
    }

    area /= 2;
    cx /= (6 * area);
    cy /= (6 * area);

    return {x: cx, y: cy};
};
type RectanglePoints = [number, number];

//handles input formatting for shapes
 interface SvgShapeProps {
    shapeType: 'line' | 'polygon' | 'rectangle'| 'circle' | 'ellipse'| 'pathSquiggle'|'pathC';
    points: string[] | RectanglePoints| [number]| [string,[number,number]]; //force input params on same field
    stroke: string;
    pos?: { x: number, y: number }; // position of the shape
    rotation?: number;
    fillLines?: boolean;
    // fill?: string; // not needed due to assignment requirements but could be added
}


//while i dont have to fill with color i can define a path to use a fill,
//uuid is needed for colors to be consistent for each shape
const GridPattern = ({ id, stroke }: { id: string, stroke: string }) => (
    <defs>
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
            <path className="smallGridPath" d="M 0 0 L 0 10 M 0 5 L 10 5" stroke={stroke} strokeWidth="2"/>
        </pattern>
    </defs>
);




//to achieve the desire affect i need to skew the shape
const skewRandom = () => {
    const min = -5;
    const max = 15;
    return [Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min];
};



//draws a pattern of the shape with a smaller scale and translates it to the center of the shape

//TODO: add alternating count to skip random paths to make a more natural shape use case group to make a grid of any SvgShape
const EmbedPattern = (count: number, pathData: string, stroke: string, centroid: Point) => {
    const groups = [];
    for (let i = 0; i < Math.max(count, count - 3); i++) {
        // Skip iteration with a 50% chance
        if (Math.random() > 0.5) continue;

        const [skewXValue, skewYValue] = skewRandom();
        groups.push(
            <g key={i} transform={`translate(${centroid.x}, ${centroid.y}), scale(${(1 - i * 0.1)}), skewX(${skewXValue}) skewY(${skewYValue}), translate(${-centroid.x}, ${-centroid.y})`}>
                <path d={pathData} stroke={stroke} fill={'transparent'}/>
            </g>
        );
    }
    return groups;
};

const EmbedCircle = (count: number, pathData: string, stroke: string, centroid: Point) => {
    const groups = [];
    for (let i = 0; i < count; i++) {
        const [skewXValue, skewYValue] = skewRandom(); // Use the updated skewRandom function
        groups.push(
            <g key={i} transform={`translate(${centroid.x}, ${centroid.y}), scale(${(1 - i * 0.1)}), skewX(${skewXValue}) skewY(${skewYValue}), translate(${-centroid.x}, ${-centroid.y})`}>
                <path d={pathData} stroke={stroke} fill={'transparent'}/>
            </g>
        );
    }
    return groups;
};


//points need to be translated to the center of the shape and then rotated around that center then translated back to maintain location
// SvgShape is a functional component in React that takes in several props and returns an SVG shape based on those props.
const SvgShape: React.FC<SvgShapeProps> = ({ shapeType, points, stroke, pos = { x: 0, y: 0 }, rotation=0, fillLines=false}) => {
    let width, height, translatedPoints, shape,centroid, radius,pathData;
    const patternId= uuidv4();
    const [skewXValue, skewYValue] = skewRandom();

    //lets animate here cause why not lol
    const [embedCount, setEmbedCount] = useState<number>(1);
    //Start() which calls an update loop
    useEffect(() => {
        if (fillLines) {
            const intervalId = setInterval(() => {
                setEmbedCount(Math.floor(Math.random() * 10));
            }, 445);

            return () => clearInterval(intervalId); // Cleanup on component unmount
        }
    }, [fillLines]); // Run the effect whenever fillLines changes


    switch (shapeType) {
        //honestly forgot polylines can just be used to draw a line so..
        case 'line':
            shape = <polyline points={points.join(' ')} stroke={stroke} fill='transparent'/>;
        break;
        //centroid apporach is used for all shapes and is used to approximate rotation around center
        case 'polygon':
            translatedPoints = (points as string[]).map((point: string) => {
                const [x, y] = point.split(',').map(Number);
                return {x: x + pos.x, y: y + pos.y};
            });
            centroid = calculateCentroid(translatedPoints);
            shape = (
                <g transform={`translate(${centroid.x}, ${centroid.y}), rotate(${-rotation}), translate(${-centroid.x}, ${-centroid.y})`}>
                    {fillLines ? <GridPattern id={patternId} stroke={stroke}/> : null}
                    {/*first poin closes the polygont*/}
                    <polyline
                        points={translatedPoints.concat([translatedPoints[0]]).map(({x, y}) => `${x},${y}`).join(' ')}
                        stroke={stroke} fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
                </g>
            );
        break;
        case 'rectangle':
            [width, height] = points as RectanglePoints;
            translatedPoints = [{x: pos.x, y: pos.y}, {x: pos.x + width, y: pos.y}, {
                x: pos.x + width,
                y: pos.y + height
            }, {x: pos.x, y: pos.y + height}];
            centroid = calculateCentroid(translatedPoints);
            pathData = `M ${translatedPoints[0].x} ${translatedPoints[0].y} L ${translatedPoints[1].x} ${translatedPoints[1].y} L ${translatedPoints[2].x} ${translatedPoints[2].y} L ${translatedPoints[3].x} ${translatedPoints[3].y} Z`;
            shape = (
                <g transform={`translate(${centroid.x}, ${centroid.y}), rotate(${-rotation}), translate(${-centroid.x}, ${-centroid.y})`}>
                    {fillLines ? <GridPattern id={patternId} stroke={stroke}/> : null}
                    <path d={pathData} stroke={stroke} fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
                </g>
            );
        break;
        case 'circle':
            [width, height] = [0,0];
            radius = points[0] as number;
            centroid = {x: width, y: height};
            pathData = `M ${width+pos.x} ${height+pos.y} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${(radius * 2)} 0 a ${radius} ${radius} 0 1 1 ${(radius * -2)} 0`;
            shape = (
                <g>
                    {fillLines? <GridPattern id={patternId} stroke ={stroke}/>: null}
                    <path d={pathData} stroke={stroke} fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
                </g>
            );
            break;
        case 'ellipse':
            [width, height] = (points[0] as string).split(',').map(Number);
            radius = points[1] as [number, number];
            centroid = {x: width, y: height};
            shape = (
                <g transform={`translate(${pos.x - centroid.x}, ${pos.y - centroid.y}), rotate(${-rotation}), translate(${centroid.x}, ${centroid.y})`}>
                    {fillLines ? <GridPattern id={patternId} stroke={stroke}/> : null}
                    <ellipse cx={0} cy={0} rx={radius[0]} ry={radius[1]} stroke={stroke}
                        fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
                </g>
            );
        break;
        case 'pathSquiggle':
            //just reuse rect code tbh
            [width, height] = points as RectanglePoints;
            translatedPoints = [{x: pos.x, y: pos.y}, {x: pos.x + width, y: pos.y}, {
                x: pos.x + width,
                y: pos.y + height
            }, {x: pos.x, y: pos.y + height}];
            centroid = calculateCentroid(translatedPoints);
            // Add wobble to path data
            pathData = `M ${translatedPoints[0].x} ${translatedPoints[0].y} Q ${translatedPoints[0].x + 4} ${translatedPoints[0].y + 4} ${translatedPoints[1].x} ${translatedPoints[1].y}`;
            pathData += ` Q ${translatedPoints[1].x + 4} ${translatedPoints[1].y + 4} ${translatedPoints[2].x} ${translatedPoints[2].y}`;
            pathData += ` Q ${translatedPoints[2].x + 4} ${translatedPoints[2].y + 4} ${translatedPoints[3].x} ${translatedPoints[3].y}`;
            pathData += ` Q ${translatedPoints[3].x + 4} ${translatedPoints[3].y + 4} ${translatedPoints[0].x} ${translatedPoints[0].y} Z`;
            shape = (
                <g transform={`translate(${centroid.x}, ${centroid.y}), rotate(${-rotation}),skewX(${skewXValue}), skewY(${skewYValue}), translate(${-centroid.x}, ${-centroid.y})`}>
                    <path d={pathData} stroke={stroke} fill={'transparent'}/>
                    <g transform={`translate(${centroid.x}, ${centroid.y}), scale(0.9), translate(${-centroid.x}, ${-centroid.y})`}>
                        <path d={pathData} stroke={stroke} fill={'transparent'}/>
                    </g>
                    {/*i could change that this is drawn depending on fillLines*/}
                    {fillLines ?  EmbedPattern(embedCount, pathData, stroke, centroid): null}
                </g>
            );
            break;
            case 'pathC':
                [width, height] = [0,0];
                radius = points[0] as number;
                centroid = {x: width, y: height};
                pathData = `M ${width+pos.x} ${height+pos.y} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${(radius * 2)} 0 a ${radius} ${radius} 0 1 1 ${(radius * -2)} 0`;
                shape = (
                    <g transform={`translate(${centroid.x}, ${centroid.y})`}>
                        <path d={pathData} stroke={stroke} fill={'transparent'}/>
                        <g transform={`translate(${centroid.x+pos.x}, ${centroid.y+pos.y}),scale(0.9),translate(${-(centroid.x+pos.x)}, ${-(centroid.y+pos.y)})`}>
                            <path d={pathData} stroke={stroke} fill={'transparent'}/>
                        </g>
                        {/*because of the path data i had to make new func unfortunately for time's sake*/}
                        {/*{EmbedCircle(10, pathData, stroke, pos)}*/}
                        {fillLines ?  EmbedCircle(embedCount, pathData, stroke, pos): null}
                    </g>
                );
                break;
        default:
            return null;
    }
    return (
        shape
    );


};


export type {SvgShapeProps};
export default SvgShape;
