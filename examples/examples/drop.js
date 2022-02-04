function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, SVG);
    canvas.drop(() => {
        console.log('ondrop')
    })
 }