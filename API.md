## p5.js-svg's API

# New API

### Rendering

- createSVG(width, height)

### IO

- saveSVG

- saveFrames

- noSVG

## Compatible (in SVG and Canvas) API covered with unit tests

### Shape

#### 2d_primitives

- arc
- ellipse
- line
- point
- quad
- rect
- triangle

#### Attributes

- strokeWeight
- strokeCap
- strokeJoin
- ellipseMode
- rectMode
- smooth
- noSmooth

#### Vertex

- beginContour
- beginShape
- bezierVertex
- curveVertex
- endContour
- endShape
- quadraticVertex
- vertex

#### Curves

- bezier()
- bezierPoint()
- bezierTangent()
- curve()
- curveTightness()
- curvePoint()
- curveTangent()

