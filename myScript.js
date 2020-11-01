function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("./icmp.json", function(text){
    const data = JSON.parse(text);
    console.log(data.length);  
    //console.log(data);
    for (i = 0; i < data.length; i++) {
        // if (a = data[i]._source.layers) {
        //     console.log(i); 
        //     console.log(a);
        // }
        var keyNames = Object.keys(data[i]._source.layers);
        console.log(keyNames.length);

    }   
});

