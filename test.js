var find_name = ["tcp", "udp", "icmp", "igmp"];
var abcd = ["abcdtcp","tcp", "udp", "icmp", "igmp","abcdicmp"];
var count = new Object();
for (name in abcd) {
    var i = 0;
    //console.log(abcd[name]);
    for (i in find_name){
        if (abcd[name].search(find_name[i]) != -1){
            if(isNaN(count[find_name[i]])) {
                count[find_name[i]] = 0;
                console.log("new");
            }
            count[find_name[i]] += 1;
            
        
        }
    }
}
console.dir(count);
