var points = [];
var file;


function setup(){
    // createCanvas(500,500);
    fileInput = createFileInput(appendFile, false); //When file selected, execute appendFile (only 1 file per selection)
}
function draw(){
    background(100);
}

function svgToPoints(file){
    // let w, h;
    let w = 800, h = 800;
    try{

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
        if (!RegExp("\.+\\.svg$").test(file.name)){
            throw "The file must be a .svg image, not just an image";
        }
    } catch (error) {
        print("Error");
        print(error);
    }
    // if here, the file should be correct
    svgToPoints(file);
}