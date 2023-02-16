const express = require('express')
const bodyParser = require('body-parser')
const rpio = require("rpio")


const app = express()
const port = 3000

//rpio.open(15, rpio.OUTPUT, rpio.LOW)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", express.static(__dirname+'/'));

app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next()
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/armControl.html");
});

app.post('/arm', (req, res) => {
    console.log(req.body)
    res.send({ message: "arm data received" });
})

app.post('/direction', (req, res)=>{
    console.log(req.body);
    res.send({ message: "direction data received" });
})

app.post('/base', (req, res)=>{
    console.log(req.body);
    res.send({ message: "base data received" });
})

app.post('/pince', (req, res)=>{
    console.log(req.body);
    res.send({ message: "pince data received" });
})

app.post('/rotation', (req, res)=>{
    console.log(req.body);
    res.send({ message: "rotation data received" });
})

// ligth a led when btn is pressed and hold until it pressed again
app.post('/btn', (req, res) => {
    var state = req.body;
    console.log(state);
    if(state.data){
        rpio.write(15, rpio.HIGH);
    }
    else{ 
        rpio.write(15, rpio.LOW);
    }
    res.send({ message: "btn data received" });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
