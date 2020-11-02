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
function draw_graph(dataset) {
    var svgWidth = 500, svgHeight = 500, barPadding = 5;
    var barWidth = (svgWidth / dataset.length);

    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, svgHeight - 20]);

    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - yScale(d)
        })
        .attr("height", function(d) {
            return yScale(d);
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function(d,i) {
            var translate = [barWidth * i, 0];
            return "translate(" + translate + ")";
        }); 

    var text = svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("y",function(d, i) {
            return svgHeight - yScale(d) - 2; 
        })
        .attr("x", function(d, i) {
            return barWidth * i;
        })
        .attr("fill", "#A64C38");

}

readTextFile("./icmp.json", function(text){
    const data = JSON.parse(text);
    console.log(data.length);  
    //console.log(data[1]._source.layers);

    //var data1 = data[1]._source.layers.frame;
    //console.log(data1["frame.protocols"]);

    var pro_type_count = [0,0,0,0,0];    //version1   counting packet
    var pro_type = [];        // i wanted to know how many kinds of packet from "_source.layers.frame.frame.protocols
    var count = new Object();      //version2   counting packet and discevering packet what kind there are
    var find_name = ["tcp", "udp", "icmp", "igmp"];
    for (var i = 0; i < data.length; i++) {
        // var a = data[i]._source.layers;
       
        
        
        // if(a.tcp){
        //     pro_type_count[0] += 1;
        // }else if(a.udp){
        //     pro_type_count[1] += 1;
        // }else if(a.icmpv6 || a.icmp){
        //     pro_type_count[2] +=1;
        // }else if(a.arp){
        //     pro_type_count[3] +=1;
        // } else {
        //     pro_type_count[4] +=1;
        //     //console.log(a);
        // }
        
        // var layers_keys = [];
        // for (let key in data[i]._source.layers){
        //     layers_keys.push(key);
        // }
        // console.log(layers_keys.length);

        var protocols_name = data[i]._source.layers.frame["frame.protocols"]; 
        console.log(protocols_name);


        // var i = 0;
        // for (i in find_name){
        //     if (protocols_name.search(find_name[i]) != -1){
        //         if(isNaN(count[find_name[i]])) {
        //             count[find_name[i]] = 0;
        //             //console.log("new");
        //         }
        //         count[find_name[i]] += 1;
                
            
        //     }
        // }



        if (protocols_name.includes('eth:ethertype:')){
            protocols_name = protocols_name.replace('eth:ethertype:', '');
        }else{
            console.log("!!!" + protocols_name);
        }
        if (!pro_type.includes(protocols_name)){
            pro_type.push(protocols_name);
        } 
        
    }   
    console.dir(pro_type);
    console.dir(count);
    console.log(pro_type);
    draw_graph(pro_type_count);

    
    

});

