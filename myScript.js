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

var h = window.innerHeight;

function draw_graph(dataset) {
    //var margin = {left: 40};
    //var svgHeight = h * 0.9;
    var svgHeight = 2000;

    var barPadding = 0.5;
    // var barWidth = (svgWidth / dataset.length);
    var barWidth = 4;
    var svgWidth = barWidth * dataset.length;

    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var xScale = d3.scaleBand()
        .rangeRound([0, svgWidth]);

    var yScale = d3.scaleLinear()
        //.domain([0, d3.max(dataset, d => d.size)])
        //.range([0, svgHeight - 20]);

    
    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d) {
            return svgHeight - yScale(d.size);
        })
        .attr("height", function(d) {
            return yScale(d.size);
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function(d,i) {
            var translate = [barWidth * i , 0];
            return "translate(" + translate + ")";
        })
        .style("fill", function(d) {
            if(d.src == 1){
                //src is taro
                return "#69b3a2";
            }
            if(d.src == 2){
                //src is hanako
                return "#8301e9";
            }
        });
    // svg.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(" + svgHeight + ")")
    //     .call(d3.axisBottom(xScale));
    // svg.append("g")
    //     .attr("class", "axis")
    //     .attr('transform', 'translate(20,20)')
    //     .call(d3.axisLeft(yScale) );
         

    // var text = svg.selectAll("text")
    //     .data(dataset)
    //     .enter()
    //     .append("text")
    //     .text(function(d) {
    //         return d.key;
    //     })
    //     .attr("y",function(d, i) {
    //         return svgHeight - yScale(d.size) - 2; 
    //     })
    //     .attr("x", function(d, i) {
    //         return barWidth * i.key;
    //     })
    //     .attr("fill", "#A64C38");

}

readTextFile("4.json", function(text){
    const data = JSON.parse(text);
    console.log(data.length);  
    console.log(data[1]._source.layers);

    //var data1 = data[1]._source.layers.frame;
    //console.log(data1["frame.protocols"]);
    //var pro_type_count = [0,0,0,0,0];    //version1   counting packet
    var pro_type = [];        // i wanted to know each kinds of how many packet from "_source.layers.frame.frame.protocols"
    var counts = {};      //version2   counting packet and discevering packet what kind there are
    taro_mac_address = "00:14:d1:da:89:af";
    hanako_mac_address = "b8:27:eb:5e:45:0a";
    var obj = [];
    var pro_names =[];
    var find_name = ["tcp", "udp", "icmp", "igmp", "arp", "data", ""];
    for (var i = 0; i < data.length; i++) {

        var protocols_name = data[i]._source.layers.frame["frame.protocols"]; 
        var j = 0;
        for (j in find_name){
            if (protocols_name.search(find_name[j]) != -1){

                if(isNaN(counts[find_name[j]])) {
                    counts[find_name[j]] = 0;
                    console.log(data[i]);
                }
                //if(find_name[j] == "data"){
                    //console.log(data[i]._source.layers.data["data.len"]);
                    var src = 0;
                    if(data[i]._source.layers.eth['eth.src'] == taro_mac_address){
                        src = 1;
                    }else if(data[i]._source.layers.eth['eth.src'] == hanako_mac_address){
                        src = 2;
                    }
                    
                    obj.push({key: i, size: data[i]._source.layers.frame["frame.len"], src: src});
                    
                //}
                counts[find_name[j]] += 1;
            }
        }
        if(pro_names.indexOf(protocols_name) == -1){
            pro_names.push(protocols_name); 
    
            
        }
         
        // * delete eth:ethertype: from protocols_name

        // if (protocols_name.includes('eth:ethertype:')){
        //     protocols_name = protocols_name.replace('eth:ethertype:', '');
        // }else{
        //     console.log("!!!" + protocols_name);
        // }
        // if (!pro_type.includes(protocols_name)){
        //     pro_type.push(protocols_name);
        // } 
        
    }   
    //console.dir(pro_type);
    console.log(counts);
    console.log(pro_names);
    console.log(obj);
    // * write graph
    draw_graph(obj);

    //console.log(typeof data[1]._source.layers.frame["frame.protocols"]);
});

