var points = [];
var file;


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
            point(points[i].x, points[i].y);
        }
    }
}

function svgToPoints(fileText){
    // let w, h;
    let w = 1000, h = 1000;
    // try{
    let text = "";
    for(let t = 0; t < fileText.length; t++){
        text += fileText[t] + "\n";
    }
    console.log(text)

    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/xml");
    console.log(doc)
    let path = doc.getElementsByTagName("path")[0];
    console.log(path)
    
    for ( var i=0,l=300; i<l; i++ ){
        var p = path.getPointAtLength( i/l * path.getTotalLength() );
        console.log(p);
        points.push(p);
    }
    createCanvas(w, h);
}

function appendFile(file){
    print(file.name);
    try {
        if (file.type != "image"){
            throw "The file must be a svg image";
        }
        if (file.subtype != "svg" || !RegExp("\.+\\.svg$").test(file.name)){
            throw "The file must be a .svg image, not just an image";
        }
    } catch (error) {
        print("Error");
        print(error);
    }
    // if here, the file should be correct
    loadStrings(file.data, svgToPoints);
    // let font = file.data;
    // let paths = font.getPaths()

}