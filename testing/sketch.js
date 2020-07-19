var points = [];
var file;
var offset = {x: 0, y: 0};


function setup(){
    // createCanvas(500,500);
    fileInput = createFileInput(appendFile, false); //When file selected, execute appendFile (only 1 file per selection)
}
function draw(){
    background(200);
    if (points.length != 0){
        stroke(0); // Change the color
        strokeWeight(3); // Make the points 10 pixels in size
        for (let i = 0; i < points.length; i++){
            point(points[i].x - offset.x, points[i].y - offset.y);
        }
    }
}

function svgToPoints(fileText){
    var wMax = 0, wMin = Infinity, hMax = 0, hMin = Infinity;
    let text = "";
    for(let t = 0; t < fileText.length; t++){
        // text += fileText[t] + "\n";
        text += fileText[t];
    }
    let doc = new DOMParser().parseFromString(text, "text/xml"); //svg as a xml
    let path = doc.getElementsByTagName("path")[0]; //get the only path on the svg (the first)
    
    for ( var i = 0, l = 600; i < l; i++ ){
        var p = path.getPointAtLength( i/l * path.getTotalLength() );
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
        points.push(p);
    }

    offset.x = wMin - 10;
    offset.y = hMin - 10;
    createCanvas(wMax - wMin + 20, hMax - hMin + 20);
}

function appendFile(file){
    print(file.name);
    try {
        if (file.type != "image"){
            throw "The file must be a svg image";
        }
        if (file.subtype != "svg+xml" || !RegExp("\.+\\.svg$").test(file.name)){
            throw "The file must be a .svg image, not just an image";
        }
    } catch (error) {
        print("Error");
        print(error);
        print(file.subtype)
    }
    // if here, the file should be correct
    loadStrings(file.data, svgToPoints);
    // let font = file.data;
    // let paths = font.getPaths()

}