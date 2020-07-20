// Drawing SVGs using DFT
// Jkutkut

//      FUNCTIONS:

/**
 * Given the discrete values of the function, returns a array of objects with the freq, amp and phase.
 * @param {Array} f - Array with the points of the function
 * @returns {Array} Array of objects following this format: {freq, amp, phase}
 */
function dft(f) { // Calculate the DFT of the given function f (f is a array of )
    const F = []; //The DFF of the given function f
    const N = f.length; //Number of discrete coordinates
    let re, im, freq, amp, phase; //init variables
    for (let k = 0; k < N; k++) { // For each point
        re = im = 0; // Reset them
        for (let n = 0; n < N; n++) { // For each point
            const phi = (2 * Math.PI * k * n) / N; 
            re += f[n] * cos(phi);
            im -= f[n] * sin(phi);
        }
        re = re / N;
        im = im / N;

        freq = k;
        amp = sqrt(re * re + im * im);
        phase = atan2(im, re);
        F[k] = {freq, amp, phase};
    }
    return F;
}

/**
 * Draw the epiCycles to visualize the DFT
 * @param {number} x - Start horizontal coordinate
 * @param {number} y - Start vertical coordinate
 * @param {number} rotation - The angle to rotate/The starting angle (use to make the vertical and horizontal circles with the same function)
 * @param {Array} fourier - Array from the function dft 
 * @returns {object} Returns the vector for the next epiCycle
 */
function epiCycles(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x, prevy = y; // Center of the current circle 

        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;

        let phi = freq * time + phase + rotation;
        x += radius * cos(phi);
        y += radius * sin(phi);

        stroke(255, 100); // Draw the circles with a bit of transparency
        noFill(); // Draw them empty
        ellipse(prevx, prevy, radius * 2); // Circle
        stroke(255);
        line(prevx, prevy, x, y); // Draw radius
    }
    return createVector(x, y); // Return the end of the last radius
}

/**
 * Setups all the code to generate the new figure
 * @param {number} nPoints - The desired amoint of points to use to send to the function dft(f)
 */
function updateFourier(nPoints = 600){
    x = []; // x coordinates of the ideal figure
    y = []; // y coordinates of the ideal figure
    time = 0;
    path = []; //clear previous path
    drew = false;
    let skip = parseInt(drawing.length / nPoints);
    skip = (skip > 0)? skip : 1;
    for (let i = 0; i < drawing.length; i += skip) {
        x.push(drawing[i].x);
        y.push(drawing[i].y);
    }
    fourierX = dft(x); // Do the DFT of the function x(x)
    fourierY = dft(y); // Do the DFT of the function y(x)

    fourierX.sort((a, b) => b.amp - a.amp); //sort the waves by their amp
    fourierY.sort((a, b) => b.amp - a.amp);
}

/**
 * When a file is selected, this code evaluates the content
 * @param {file} file 
 * @throws error if not valid svg
 */
function appendFile(file){
    // print(file.name);
    try {
        if (file.type != "image"){
            throw "The file must be a svg image";
        }
        if (file.subtype != "svg+xml" || !RegExp("\.+\\.svg$").test(file.name)){
            throw "The file must be a .svg image, not just an image";
        }
    } catch (error) {
        console.warn("Error");
        console.warn(error);
        return; //end execution of this function
    }
    // if here, the file should be correct
    loadStrings(file.data, function(fileStringArr){
            let result = svgToPoints(fileStringArr.join(""), 600, 500);
            drawing = result.points;
            updateFourier();
        });
}

/**
 * Given a string with the svg content, returns a array of points.
 * @param {string[]} fileText -  String with the svg code
 * @param {number} nPointsPath - Number of points to generate. Default: 600
 * @param {number} sizeX - Optional parameter to set the desired width. If NaN, this is ignored.
 * @param {number} sizeY - Optional parameter to set the desired height. If NaN, this is ignored.
 * @returns {object[]} Array with the points of the SVG ({x: float, y: float})
 */
function svgToPoints(fileText, nPointsPath = 600, sizeX, sizeY){
    var wMax = 0, wMin = Infinity, hMax = 0, hMin = Infinity; //To calculate the properties of the SVG
    let doc = new DOMParser().parseFromString(fileText, "text/xml"); //svg as a xml
    let points = [];
    let paths = doc.getElementsByTagName("path"); // Array of paths on the svg
    for (let pi = 0; pi < paths.length; pi++){
        let path = paths[pi]; //get the pº path

        //Get the points of the path
        for ( var i = 0; i < nPointsPath; i++ ){
            let p = path.getPointAtLength(i / nPointsPath * path.getTotalLength());
            // Update the properties based on this point
            if (wMax < p.x){
                wMax = p.x;
            }
            else if (wMin > p.x){
                wMin = p.x;
            }
            if (hMax < p.y){
                hMax = p.y;
            }
            else if (hMin > p.y){
                hMin = p.y;
            }
            points.push(p); //add the point
        }
    }
    points.push(points[0]);

    let w = wMax - wMin; //This value is the width of the SVG
    let h = hMax - hMin; //This value is the height of the SVG
    
    // Convert the coordinates origin to the center of the SVG
    for (let i = 0; i < points.length; i++){
        points[i] = {
            x: (points[i].x - wMin) - w * 0.5, 
            y: (points[i].y - hMin) - h * 0.5
        }
    }
    
    if (sizeX || sizeY){ //If the svg must fit on some dimensions, this code will scale it
        let wR = (sizeX)? sizeX / w : sizeY / h; // Ratio
        let hR = (sizeY)? sizeY / h : sizeX / w; // Ratio

        for (let i = 0; i < points.length; i++){
            points[i] = {
                x: points[i].x * wR,
                y: points[i].y * hR
            }
        }
        w *= wR; //The size of the svg has changed
        h *= hR; //The size of the svg has changed
    }
    let r = {
        p: { // Center: {x: 0, y: 0}
            width: w,
            height: h,
        },
        points: points //Here are the points
    };


    return r;
}


//      VARIABLES:
var result;

let x = []; // x coordinates of the ideal figure
let y = []; // y coordinates of the ideal figure
let fourierX; // Xn.x coordinates of the fourier figure
let fourierY; // Xn.y coordinates of the fourier figure
let time = 0;
let path = []; // Array of coordinates of points to represent
let vx, vy, v; // (in order) endCoord of the last radius in each function and a vector of the corresponding point 
let drew = false; // When all figure represented, this becomes true => the path is showed but no more points are added

// UI:
var fSelector, fileInput;

//      CODE:

function setup() {
    createCanvas(900, 800);

    // fSelector = createSelect();
    // fSelector.position(20, 20);
    // fSelector.option("Train");

    // fSelector.changed(updateFourier); //When changed the element selected, update

    fileInput = createFileInput(appendFile, false); //When file selected, execute appendFile (only 1 file per selection)
    fileInput.position(20, 20);

    // Fourier code: 
    updateFourier();
}

function draw() {
    background(0);

    vx = epiCycles(width / 2 + 100, 100, 0, fourierX);
    vy = epiCycles(100, height / 2 + 100, HALF_PI, fourierY);
    v = createVector(vx.x, vy.y);
    if(!drew){
        path.unshift(v);
    }
    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);

    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierY.length;
    time += dt;

    if (time > TWO_PI) {
        time = 0;
        // path = [];
        drew = true;
    }

    // push();
    // strokeWeight(1);
    // for (let i = 0; i < drawing.length; i++){
    //     point(width / 2 + 100 + drawing[i].x, height / 2 + 100 + drawing[i].y);
    // }
    // pop();

    // if (wave.length > 250) {
    //   wave.pop();
// }
}