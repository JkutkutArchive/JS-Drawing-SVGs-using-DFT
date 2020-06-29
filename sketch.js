// Drawing SVGs using DFT
// Jkutkut
// Code based on The Coding Train code:
// https://thecodingtrain.com/CodingChallenges/130-fourier-transform-drawing.html


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

let x = [];
let y = [];
let fourierX;
let fourierY;
let time = 0;
let path = [];
let vx, vy, v;
let drew = false;

function setup() {
    createCanvas(900, 800);
    const skip = 8;
    for (let i = 0; i < drawing.length; i += skip) {
        x.push(drawing[i].x);
        y.push(drawing[i].y);
    }
    fourierX = dft(x); // Do the DFT of the function x(x)
    fourierY = dft(y); // Do the DFT of the function y(x)

    fourierX.sort((a, b) => b.amp - a.amp); //sort the waves by their amp
    fourierY.sort((a, b) => b.amp - a.amp);
}

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

    // if (wave.length > 250) {
    //   wave.pop();
// }
}