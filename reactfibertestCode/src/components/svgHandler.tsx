import React from "react";
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
    shapeType: 'line' | 'polygon' | 'rectangle'| 'circle' | 'ellipse';
    points: string[] | RectanglePoints| [string,number]| [string,[number,number]]; //force input params on same field
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



//points need to be translated to the center of the shape and then rotated around that center then translated back to maintain location
// SvgShape is a functional component in React that takes in several props and returns an SVG shape based on those props.
const SvgShape: React.FC<SvgShapeProps> = ({ shapeType, points, stroke, pos = { x: 0, y: 0 }, rotation=0, fillLines=false}) => {
    let width, height, translatedPoints, shape,centroid, radius,pathData;
    const patternId= uuidv4();
    switch (shapeType) {
        //honestly forgot polylines can just be used to draw a line so..
        case 'line':
            shape = <polyline points={points.join(' ')} stroke={stroke} fill='transparent' />;
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
                    {fillLines? <GridPattern id={patternId} stroke ={stroke}/>: null}
                    {/*first poin closes the polygont*/}
                    <polyline points={translatedPoints.concat([translatedPoints[0]]).map(({x, y}) => `${x},${y}`).join(' ')} stroke={stroke} fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
                </g>
            );
            break;
        case 'rectangle':
            [width, height] = points as RectanglePoints;
            translatedPoints = [{x: pos.x, y: pos.y}, {x: pos.x + width, y: pos.y}, {x: pos.x + width, y: pos.y + height}, {x: pos.x, y: pos.y + height}];
            centroid = calculateCentroid(translatedPoints);
            pathData = `M ${translatedPoints[0].x} ${translatedPoints[0].y} L ${translatedPoints[1].x} ${translatedPoints[1].y} L ${translatedPoints[2].x} ${translatedPoints[2].y} L ${translatedPoints[3].x} ${translatedPoints[3].y} Z`;
            shape = (
                <g transform={`translate(${centroid.x}, ${centroid.y}), rotate(${-rotation}), translate(${-centroid.x}, ${-centroid.y})`}>
                    {fillLines? <GridPattern id={patternId} stroke ={stroke}/>: null}
                    <path d={pathData} stroke={stroke} fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
                </g>
            );
            break;
        case 'circle':
            [width, height] = (points[0] as string).split(',').map(Number);
            radius = points[1] as number;
            centroid = {x: width, y: height};
            pathData = `M ${width+pos.x} ${height+pos.y} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${2*radius} 0 a ${radius} ${radius} 0 1 1 ${-2*radius} 0`;
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
                    <ellipse cx={0} cy={0} rx={radius[0]} ry={radius[1]} stroke={stroke} fill={fillLines ? `url(#${patternId})` : 'transparent'}/>
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

export default SvgShape;
