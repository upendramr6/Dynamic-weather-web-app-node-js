const http = require('http');
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}", Math.floor((orgVal.main.temp)-273.15))
    temperature = temperature.replace("{%tempmin%}", Math.floor((orgVal.main.temp_min)-273.15))
    temperature = temperature.replace("{%tempmax%}", Math.floor((orgVal.main.temp_max)-273.15))
    temperature = temperature.replace("{%location%}", orgVal.name)
    temperature = temperature.replace("{%country%}", orgVal.sys.country)

    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main)
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=2fbd823cfa19e2e0020ff525459985e9")
            .on('data', function (chunk) {
                const objData = JSON.parse(chunk)
                const arrData = [objData]
                // console.log(arrData);
                // var kelvin = arrData[0].main.temp   
                // var celsius = kelvin-273.15
                // console.log(celsius);
                const realTimeData = arrData.map((val)=>{
                   return replaceVal(homeFile, val)
                  
                }).join("")
                res.write(realTimeData);
                console.log(realTimeData);

            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);

                // console.log('end');
                res.end();
            })
    }
});

server.listen(5000, "127.0.0.1");