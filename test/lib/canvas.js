const config = {
    pixelDensity: 3 // for 200% and 150%
}

// count non transparent pixels
var countPixels = function (imgData) {
    var count = 0
    for (var i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 0) {
            count++
        }
    }
    return count
}


export { config, countPixels }