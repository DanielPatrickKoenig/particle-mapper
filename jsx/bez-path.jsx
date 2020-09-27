// $.writeln(app.activeDocument.layers[0].pageItems[0].pathPoints.length);

var points = app.activeDocument.layers[0].pageItems[0].pathPoints;

var height = app.activeDocument.height;
$.writeln(height);
var pointList = [];
var pointString = '[';
for(var i = 0; i < points.length; i++){
    // $.writeln(points[i]);
    // pointList.push({
    //     l: points[i].leftDirection,
    //     p: points[i].anchor,
    //     r: points[i].rightDirection
    // });
    var prevPointIndex = i == 0 ? points.length - 1 : i - 1;
    pointList.push([
        '{x:'+points[i].rightDirection[0].toString()+',y:'+((points[i].rightDirection[1]*-1)).toString()+'}',
        '{x:'+points[i].leftDirection[0].toString()+',y:'+((points[i].leftDirection[1]*-1)).toString()+'}',
        '{x:'+points[i].anchor[0].toString()+',y:'+((points[i].anchor[1]*-1)).toString()+'}'
    ]);
    pointString += i != 0 ? ',' : '';
    pointString += '['+pointList[i].toString()+']';
}
pointString+=']';

// for(var i = 0; i < pointList.length; i++){
//     $.writeln(pointList[i].l);
//     $.writeln(pointList[i].p);
//     $.writeln(pointList[i].r);
// }
// $.writeln(pointString);
// $.writeln('right');
// $.writeln(points[0].rightDirection);
// $.writeln('anchor');
// $.writeln(points[0].anchor);
// $.writeln('left');
// $.writeln(points[0].leftDirection);

// for(var p in points[0]){
    
//     $.writeln(p);
// }

var scriptFolderPath = File($.fileName).path; // the URI of the folder that contains the script file    

var JFile = new File(scriptFolderPath + encodeURI("/bez-path-output.txt"));

    var content = pointString;

    

    writeFile(JFile, content);

   

    

    // File.write(content);

    alert("File created!");

function writeFile(fileObj, fileContent, encoding) {

    encoding = encoding || "utf-8";

    fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);

    var parentFolder = fileObj.parent;

    if (!parentFolder.exists && !parentFolder.create())

        throw new Error("Cannot create file in path " + fileObj.fsName);

    fileObj.encoding = encoding;

    fileObj.open("w");

    fileObj.write(fileContent);

    fileObj.close();

    return fileObj;

}