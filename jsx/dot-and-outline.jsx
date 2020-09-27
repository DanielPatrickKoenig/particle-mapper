app.executeMenuCommand("selectall");
for(var i = 0; i < app.activeDocument.layers[0].pageItems.length;i++){
    app.activeDocument.layers[0].pageItems[i].strokeDashes = new Array(1,12);
}
app.executeMenuCommand("Expand3");
app.executeMenuCommand("deselectall");
var listGroup = [];
var listGroupString = '[';
var n = 0;
for(var i = app.activeDocument.layers[0].pageItems.length - 1; i >=0 ;i--){
    // $.writeln(app.activeDocument.layers[0].pageItems[i]);
    listGroupString += n == 0 ? '' : ',';
    app.activeDocument.layers[0].pageItems[i].selected = true;
    app.executeMenuCommand("ungroup");
    app.executeMenuCommand("noCompoundPath");
    listGroup.push([]);
    listGroupString+='['
    var m = 0;
    var targetItem = app.activeDocument.layers[0].pathItems[0];
    
    while(m < app.activeDocument.layers[0].pathItems.length){
        
        listGroup[listGroup.length - 1].push(
            {
                x: targetItem.left,
                y: targetItem.top * -1
            }
        );

        listGroupString += m == 0 ? '' : ',';
        listGroupString += '{x:'+targetItem.left.toString()+',y:'+(targetItem.top * -1).toString()+'}';
        
        
        var pos = {left: targetItem.left, top: targetItem.top};
        targetItem.left = 10000;
        targetItem.top = 10000;
        targetItem = getClosestPathItem(pos, app.activeDocument.layers[0].pathItems);
        
        
        // app.activeDocument.layers[0].pathItems[j].remove();
        m++;
    }
    for(var j = app.activeDocument.layers[0].pathItems.length - 1; j >= 0;j--){
        app.activeDocument.layers[0].pathItems[j].remove();
    }
    listGroupString += ']';
    n++;
    
}
listGroupString += ']';
$.writeln(listGroupString);

app.executeMenuCommand("undo");

function getDistance(x1, y1, x2, y2) {

    var distx = x2 - x1;
    var disty = y2 - y1;
    return Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2));
}
function getClosestPathItem(item, items){
    var closest = 99999999999;
    var closestItem = item;
    for(var i = 0; i < items.length; i++){
        var dist = getDistance(item.left, item.top, items[i].left, items[i].top);
        if(dist < closest){
            closest = dist;
            closestItem = items[i];
        }
    }
    return closestItem;

}



var scriptFolderPath = File($.fileName).path; // the URI of the folder that contains the script file    

var JFile = new File(scriptFolderPath + encodeURI("/dot-and-outline-output.txt"));

    var content = listGroupString;

    

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
