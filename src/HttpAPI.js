import * as axios from "axios"
import * as fs from "fs"

function file2base64(path){
    var bitmap = fs.readFileSync(path);
    return new Buffer(bitmap).toString('base64');
}
async function speechRecognition(path){

}
