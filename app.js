var express = require("express");
var app = express();

app.use("/js", express.static(__dirname + "/js"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/data", express.static(__dirname + "/data"));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.listen(3000, function(){
    console.log("Lisening on port" + 3000);
});
