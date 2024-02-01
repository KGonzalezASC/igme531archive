# SvgShape Component

The `SvgShape` component is a React component for creating SVG shapes with flexibility in customization. It supports various shape types, positioning, rotation, and stroke color.

## Usage

Import the `SvgShape` component and use it within your React application. Customize the shape by passing different props.

```tsx
import React from "react";
import SvgShape from "svgshape-component";

const MyShape = () => {
  // Define shape properties
  const shapeProps = {
    shapeType: "rectangle",
    points: [50, 50], // Rectangle width and height
    stroke: "blue",
    pos: { x: 100, y: 100 },
    rotation: 45,
    fillLines: true,
  };

  return <SvgShape {...shapeProps} />;
};

export default MyShape;
```

## Props

- **shapeType** (string, required): Type of the shape ("line", "polygon", "rectangle", "circle", "ellipse").

- **points** (varies, required): Coordinates or dimensions of the shape. Format varies based on the shape type.
    - For "line": Array of strings representing points, e.g., `["10,20", "30,40"]`.

    - For "polygon": Array of strings representing points, e.g., `["10,20", "30,40", "50,60"]`.

    - For "rectangle": Array containing width and height, e.g., `[50, 30]`.

    - For "circle" and "ellipse":
        - For circle, an array containing center coordinates and radius, e.g., `["50,50", 25]`.
        - For ellipse, an array containing center coordinates and radius for x and y, e.g., `["50,50", [30, 20]]`.

- **stroke** (string, required): Stroke color of the shape.

- **pos** (object, optional): Position of the shape (default: { x: 0, y: 0 }).

- **rotation** (number, optional): Rotation angle of the shape in degrees (default: 0).

- **fillLines** (boolean, optional): Whether to fill the shape with grid lines (default: false).


# SvgGroupHandler Component

`SvgGroupHandler` is a React component designed to handle groups of `SVGShapes`. It provides flexibility in customizing the shapes, positioning, rotation, and stroke color. This component can be used to create complex SVG designs with relative ease.

## Usage
To use `SvgGroupHandler`, you must first import the component into your file. Then, define the shapes you want to include in the group. Each shape should be defined as an object with properties such as shapeType, points, and stroke. These objects should be stored in an array.
```tsx
import SvgGroup from './SvgGroupHandler';

const desOrdres: Array<{ shapeType: SvgShapeProps['shapeType'], points: SvgShapeProps['points'], stroke: string }> = [
    { shapeType: 'pathSquiggle', points:[50,50],stroke:'red'},
    // More shapes...
];
//Then, pass this array along with other necessary props to the SvgGroup component.
<SvgGroup shapes={desOrdres} width={500} count={5} />
```
## Props
The SvgGroup component accepts the following props:

- **shapes**: An array of objects defining the shapes to be included in the group. Each object should have properties shapeType, points, and stroke.
- **width**: The total width of the group.
- **count**: The number of times each shape is repeated.
- **smidgeTilt**: Optional. If true, shapes beyond the midpoint of the group will be randomly tilted.
- **rowSpacing**: Optional. Defines the space between rows of shapes.
- **randomOverlap**: Optional. If true, shapes may overlap randomly.

## Certain Shapes may animate