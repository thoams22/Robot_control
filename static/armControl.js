var l1 = 40;
var l2 = 40;
var l3 = 20;
var maxLength = l1 + l2 + l3;

var x;
var y;

let click;

var joint1 = 0;
var joint2 = 0;
var joint3 = 0;
var stabilisation = 0;

var base = 0;

var pince = 0;

var rotation = 0;

var vitesseMotor1;
var vitesseMotor2;

var clicked = false;

var xhr = new XMLHttpRequest();

var armControl = document.getElementById("armControl");
var ctx = armControl.getContext("2d");


const pressedKeys = new Map();
document.addEventListener('keydown', function (event) {
    pressedKeys.set(event.key, true);

    if (pressedKeys.get("z")) {

        if (pressedKeys.get("q")) {
            drawDirection(-3 * Math.PI / 4);
        }
        else if (pressedKeys.get("d")) {
            drawDirection(-Math.PI / 4);
        }
        else {
            drawDirection(-Math.PI / 2);
        }
    }

    else if (pressedKeys.get("s")) {

        if (pressedKeys.get("q")) {
            drawDirection(Math.PI / 4);
        }
        else if (pressedKeys.get("d")) {
            drawDirection(3 * Math.PI / 4);
        }
        else {
            drawDirection(Math.PI / 2);
        }
    }

    else if (pressedKeys.get("q")) {
        console.log("sens trigono");
    }

    else if (pressedKeys.get("d")) {
        console.log("sens horlo");
    }
    send2server("direction", [pressedKeys.get("z"), pressedKeys.get("q"), pressedKeys.get("s"), pressedKeys.get("d")])
}
)

document.addEventListener('keyup', function (event) {

    pressedKeys.set(event.key, false);
    send2server("direction", [pressedKeys.get("z"), pressedKeys.get("q"), pressedKeys.get("s"), pressedKeys.get("d")])

}
)

const armBase = {
    x: armControl.width / 4,
    y: armControl.height / 4
}

const gripBase = {
    x: 3 * armControl.width / 4,
    y: armControl.height / 4,
    length: 40
}

const baseBase = {
    x: armControl.width / 4,
    y: 2 * armControl.height / 4,
    width: maxLength / 3,
    height: 2 * maxLength / 3
}

const rotationBase = {
    x: 3 * armControl.width / 4,
    y: 2 * armControl.height / 4,
    length: 70
}

const bodyBase = {
    x: armControl.width / 2,
    y: 3 * armControl.height / 4,
    length: 50
}

initialize();
drawAll(joint1, joint2, joint3, base, pince, rotation);

function inverseKinematics(x, y, l1, l2, l3, stabilisation) {

    let wristX = x - l3 * Math.cos(stabilisation);
    let wristY = y - l3 * Math.sin(stabilisation);

    joint2 = Math.acos((Math.pow(wristX, 2) + Math.pow(wristY, 2) - Math.pow(l1, 2) - Math.pow(l2, 2)) / (2 * l1 * l2));

    joint1 = Math.atan2(wristY * (l2 * Math.cos(joint2) + l1) - wristX * l2 * Math.sin(joint2), wristX * (l2 * Math.cos(joint2) + l1) + wristY * l2 * Math.sin(joint2));

    joint3 = stabilisation - joint1 - joint2;

    return { joint1: joint1, joint2: joint2, joint3: joint3 };
}

function drawAll(joint1, joint2, joint3, base, pince, rotation) {

    ctx.clearRect(0, 0, armControl.width, armControl.height);

    drawArm(joint1, joint2, joint3);
    drawBase(base);
    drawGrip(pince);
    drawRotation(rotation);
}

function drawArm(joint1, joint2, joint3) {

    ctx.beginPath();
    ctx.arc(armBase.x, armBase.y, maxLength, Math.PI, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    let x1 = armBase.x + l1 * Math.cos(joint1);
    let y1 = armBase.y + l1 * Math.sin(joint1);

    let x2 = x1 + l2 * Math.cos(joint1 + joint2);
    let y2 = y1 + l2 * Math.sin(joint1 + joint2);

    let x3 = x2 + l3 * Math.cos(joint1 + joint2 + joint3);
    let y3 = y2 + l3 * Math.sin(joint1 + joint2 + joint3);

    if (y1 <= armBase.y && y2 <= armBase.y && y3 <= armBase.y) {
        ctx.beginPath();
        ctx.moveTo(armBase.x, armBase.y);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.stroke();

        x = x3 - armBase.x;
        y = y3 - armBase.y;

        stabilisation = joint1 + joint2 + joint3;

        document.getElementById("stabilisation").value = stabilisation / Math.PI * 180;
        document.getElementById("stabilisation-value").innerHTML = stabilisation / Math.PI * 180;

    }
    else {
        ctx.beginPath();
        ctx.moveTo(armBase.x, armBase.y);
        ctx.strokeStyle = "#FF0000";
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.stroke();

        ctx.strokeStyle = "#000000";
    }

}

function drawBase(base) {

    ctx.beginPath();
    ctx.rect(baseBase.x, baseBase.y, baseBase.width, baseBase.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(baseBase.x - baseBase.width / 2, baseBase.y, baseBase.width / 2, baseBase.height);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(baseBase.x + baseBase.width, baseBase.y, baseBase.width / 2, baseBase.height);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(baseBase.x + baseBase.width / 2, baseBase.y + baseBase.height / 2, maxLength, Math.PI, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(baseBase.x + baseBase.width / 2, baseBase.y + baseBase.height / 2);
    ctx.lineTo(baseBase.x + baseBase.width / 2 + maxLength * Math.cos(base), baseBase.y + baseBase.height / 2 + maxLength * Math.sin(base));
    ctx.stroke();
}

function drawGrip(pince) {

    let angle = 90 * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(gripBase.x + 10, gripBase.y);
    let x1 = gripBase.x + 10 + gripBase.length * Math.cos(pince);
    let y1 = gripBase.y - gripBase.length * Math.sin(pince);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gripBase.x + 5, gripBase.y - 10);
    let x3 = gripBase.x + 5 + gripBase.length * Math.cos(pince);
    let y3 = gripBase.y - 10 - gripBase.length * Math.sin(pince);
    ctx.lineTo(x3, y3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x3, y3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x3, y3);
    let x5 = x3 + gripBase.length * Math.cos(angle);
    let y5 = y3 - gripBase.length * Math.sin(angle);
    ctx.lineTo(x5, y5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gripBase.x - 10, gripBase.y);
    let x2 = gripBase.x - 10 - gripBase.length * Math.cos(pince);
    let y2 = gripBase.y - gripBase.length * Math.sin(pince);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gripBase.x - 5, gripBase.y - 10);
    let x4 = gripBase.x - 5 - gripBase.length * Math.cos(pince);
    let y4 = gripBase.y - 10 - gripBase.length * Math.sin(pince);
    ctx.lineTo(x4, y4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x4, y4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x4, y4);
    let x6 = x4 - gripBase.length * Math.cos(angle);
    let y6 = y4 - gripBase.length * Math.sin(angle);
    ctx.lineTo(x6, y6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gripBase.x + 5, gripBase.y - 10);
    ctx.lineTo(gripBase.x + 10, gripBase.y);
    ctx.lineTo(gripBase.x - 10, gripBase.y);
    ctx.lineTo(gripBase.x - 5, gripBase.y - 10);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.stroke();
}

function drawRotation(rotation) {

    ctx.beginPath();
    ctx.arc(rotationBase.x, rotationBase.y, rotationBase.length, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rotationBase.x, rotationBase.y);
    ctx.lineTo(rotationBase.x + rotationBase.length * Math.cos(rotation), rotationBase.y + rotationBase.length * Math.sin(rotation))
    ctx.lineWidth = 20;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rotationBase.x, rotationBase.y);
    ctx.lineTo(rotationBase.x - rotationBase.length * Math.cos(rotation), rotationBase.y - rotationBase.length * Math.sin(rotation))
    ctx.lineWidth = 20;
    ctx.stroke();

    ctx.lineWidth = 1;
}

function drawDirection(angle) {
    ctx.clearRect(bodyBase.x-bodyBase.length, bodyBase.y-bodyBase.length, bodyBase.length*2, bodyBase.length*2);
    ctx.beginPath();
    ctx.moveTo(bodyBase.x, bodyBase.y);
    ctx.lineTo(bodyBase.x + bodyBase.length * Math.cos(angle), bodyBase.y + bodyBase.length * Math.sin(angle));
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.lineWidth = 1;
}

function initialize() {

    document.getElementById("joint1-value").innerHTML = joint1;
    document.getElementById("joint2-value").innerHTML = joint2;
    document.getElementById("joint3-value").innerHTML = joint3;
    document.getElementById("stabilisation-value").innerHTML = stabilisation;
    document.getElementById("base-value").innerHTML = base;
    document.getElementById("pince-value").innerHTML = pince;
    document.getElementById("rotation-value").innerHTML = rotation;

    document.getElementById("joint1").value = joint1;
    document.getElementById("joint2").value = joint2;
    document.getElementById("joint3").value = joint3;
    document.getElementById("stabilisation").value = stabilisation;
    document.getElementById("base").value = base;
    document.getElementById("pince").value = pince;
    document.getElementById("rotation").value = rotation;
}

armControl.addEventListener("mousedown", function (event) {
    if (event.button == 0 && !click) {
        click = true
    }
});

armControl.addEventListener("mousemove", function (event) {
    if (click && armBase.x - maxLength < event.offsetX &&
        armBase.x + maxLength > event.offsetX &&
        armBase.y - maxLength < event.offsetY &&
        armBase.y > event.offsetY) {

        x = event.offsetX - armBase.x;
        y = event.offsetY - armBase.y;

        stabilisation = document.getElementById("stabilisation").value / 180 * Math.PI;
        calculateAndDraw(stabilisation);
    }

    else if (click && baseBase.x + baseBase.width / 2 - maxLength < event.offsetX &&
        baseBase.x + baseBase.width / 2 + maxLength > event.offsetX &&
        baseBase.y + baseBase.height / 2 - maxLength < event.offsetY &&
        baseBase.y + baseBase.height / 2 > event.offsetY) {

        base = Math.atan2((event.offsetY - (baseBase.y + baseBase.height / 2)), (event.offsetX - (baseBase.x + baseBase.width / 2)));

        document.getElementById("base-value").innerHTML = Math.round(-base * 180 / Math.PI);
        document.getElementById("base").value = -base * 180 / Math.PI;

        drawAll(joint1, joint2, joint3, base, pince, rotation);
    }
    else if (click && gripBase.x - 10 - gripBase.length < event.offsetX
        && gripBase.x + 10 + gripBase.length > event.offsetX &&
        gripBase.y - 10 - 2 * gripBase.length < event.offsetY &&
        gripBase.y > event.offsetY) {

        pince = Math.atan2((event.offsetY - gripBase.y), (event.offsetX - gripBase.x));
        pince = pince < (- Math.PI / 2) ? (pince + Math.PI) : -pince;

        document.getElementById("pince").value = pince * 180 / Math.PI;
        document.getElementById("pince-value").innerHTML = Math.round(pince * 180 / Math.PI);

        drawAll(joint1, joint2, joint3, base, pince, rotation);
    }
    else if (click && rotationBase.x - rotationBase.length < event.offsetX
        && rotationBase.x + rotationBase.length > event.offsetX &&
        rotationBase.y - rotationBase.length < event.offsetY &&
        rotationBase.y + rotationBase.length > event.offsetY) {

        rotation = Math.atan2((event.offsetY - rotationBase.y), (event.offsetX - rotationBase.x));
        rotation = rotation + Math.PI;
        if (rotation > 0 && rotation < Math.PI) {
            document.getElementById("rotation").value = rotation * 180 / Math.PI;
            document.getElementById("rotation-value").innerHTML = Math.round(rotation * 180 / Math.PI);

            drawAll(joint1, joint2, joint3, base, pince, rotation);
        }
    }

});

armControl.addEventListener("mouseup", function (event) {
    click = false
})

function updateAngle() {

    joint1 = document.getElementById("joint1").value;
    joint2 = document.getElementById("joint2").value;
    joint3 = document.getElementById("joint3").value;

    document.getElementById("joint1-value").innerHTML = joint1;
    document.getElementById("joint2-value").innerHTML = joint2;
    document.getElementById("joint3-value").innerHTML = joint3;

    joint1 = -joint1 / 180 * Math.PI;
    joint2 = (joint2 - 90) / 180 * Math.PI;
    joint3 = (joint3 - 90) / 180 * Math.PI; 
    
    drawAll(joint1, joint2, joint3, base, pince, rotation);

    send2server("arm", [Math.round(-joint1/Math.PI*180), Math.round(joint2/Math.PI*180)+90, Math.round(joint3/Math.PI*180)+90])

}

function updateStabilisation() {

    stabilisation = document.getElementById("stabilisation").value;

    document.getElementById("stabilisation-value").innerHTML = stabilisation;

    calculateAndDraw(stabilisation / 180 * Math.PI);
}

function updateBase() {

    base = document.getElementById("base").value;

    document.getElementById("base-value").innerHTML = base;
    
    send2server("base", base);

    base = -base / 180 * Math.PI;

    drawAll(joint1, joint2, joint3, base, pince, rotation);
}

function updatePince() {

    pince = document.getElementById("pince").value;

    document.getElementById("pince-value").innerHTML = pince;

    send2server("pince", pince);

    pince = pince / 180 * Math.PI;

    drawAll(joint1, joint2, joint3, base, pince, rotation);
}

function updateRotation() {

    rotation = document.getElementById("rotation").value;

    document.getElementById("rotation-value").innerHTML = rotation;

    send2server("rotation", rotation);

    rotation = rotation / 180 * Math.PI;

    drawAll(joint1, joint2, joint3, base, pince, rotation);
}

function btnClick(){
    if(clicked){
        clicked = false;
        }
    else{
        clicked = true;
        }
    send2server("btn", clicked)
}

function calculateAndDraw(stabilisation) {

    var angles = inverseKinematics(x, y, l1, l2, l3, stabilisation);

    joint1 = angles.joint1;
    joint2 = angles.joint2;
    joint3 = angles.joint3;

    if (0 > joint1 && joint1 > -Math.PI &&
        Math.PI / 2 > joint2 && joint2 > -Math.PI / 2 && 
        Math.PI / 2 > joint3 && joint3 > -Math.PI / 2
    ) {

        drawAll(joint1, joint2, joint3, base, pince, rotation);
        
        send2server("arm", [Math.round(-joint1/Math.PI*180), Math.round(joint2/Math.PI*180)+90, Math.round(joint3/Math.PI*180)+90])

        document.getElementById("joint1-value").innerHTML = Math.round(- joint1 * 180 / Math.PI);
        document.getElementById("joint2-value").innerHTML = Math.round(joint2 * 180 / Math.PI) + 90;
        document.getElementById("joint3-value").innerHTML = Math.round(joint3 * 180 / Math.PI) + 90; 
        document.getElementById("stabilisation-value").innerHTML = Math.round(stabilisation * 180 / Math.PI);

        document.getElementById("joint1").value = - joint1 * 180 / Math.PI;
        document.getElementById("joint2").value = joint2 * 180 / Math.PI + 90;
        document.getElementById("joint3").value = joint3 * 180 / Math.PI + 90; 
        document.getElementById("stabilisation").value = stabilisation * 180 / Math.PI;
    }
}


function send2server(route, data){
    xhr.open("POST", "/" + route, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({data: data}));
}