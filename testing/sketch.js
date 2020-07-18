var points = [];
var file;


function setup(){
    // createCanvas(500,500);
    fileInput = createFileInput(appendFile, false); //When file selected, execute appendFile (only 1 file per selection)
}
function draw(){
    background(100);
}

function svgToPoints(fileText){
    // let w, h;
    let w = 800, h = 800;
    try{
        // let parser = new DOMParser();
        console.log(fileText)
        // let doc = parser.parseFromString(current_svg_xml, "application/xml");
        // var paths = doc.getElementsByTagName("path");
        // current_displayed_paths = paths;

    }
    catch{

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