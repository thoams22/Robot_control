const express = require('express')
const app = express()
const port = 3000

app.use("/", express.static(__dirname+'/public'));

app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next()
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/armControl.html");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})