const express = require('express')
const rpio = require('rpio')
const bodyParser = require('body-parser')

const app = express()
const port = 3000


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", express.static(__dirname+'/public'));

app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next()
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/armControl.html");
});

app.post('/data', (req, res) => {
    console.log(req.body);
    res.send({ message: "Data received" });
  })

//rpio.open(16, rpio.OUTPUT, rpio.LOW);
//rpio.read(16);
//rpio.write(16, rpio.HIGH);
// rpio.open(12, rpio.PWM);
// rpio.pwmSetClockDivider(8);
// rpio.pwmSetRange(12, 1024);
// rpio.pwmSetData(12, 512);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})