# Drawing SVGs using DFT:

This code enable us to visualize a given SVG file using the DFT (Discrete Fourier Transform)

### *[Use now!](https://jkutkutarchive.github.io/JS-Drawing-SVGs-using-DFT/)*

![train example](https://cdn.jsdelivr.net/gh/Jkutkut/JS-Drawing-SVGs-using-DFT@master/resources/train.png)


## How it works:

This code makes use of diferent functions:

When a file is selected, it is evaluated. If it is a valid SVG, the path(s) used to make the figure will be transformed to a collection of points. This array will be them transformed to a array of objects with the data of the application of the Discrete Fourier Transform.
Once all is calculated, a function represents the objects as epiCycles while the object is drawn on the screen.


## Special thanks:

Code based on [The Coding Train code](https://thecodingtrain.com/CodingChallenges/130-fourier-transform-drawing.html)

This code has used [Mika-I's code](https://jsfiddle.net/mikatalk/o3yrwqpg/) as a reference to transform a svg to a array of points.
