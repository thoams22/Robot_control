from flask import Flask, request, render_template, Response
import json
import serial
from camera_pi import Camera
app = Flask(__name__)

mySerial = serial.Serial('/dev/ttyS0', 9600) # changer COM4 pour la sortie serial du raspberry pi

@app.get('/')
def hello_world():
    return render_template("/armControl.html")

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield(b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.post('/arm')
def process_arm():
    value = request.get_json() # return a python dictionnary
    print(value["data"])
    mySerial.write((str(value["data"])+'\n').encode())
    return "arm data received" # return the recieve variable to display it on the html page ??

@app.post('/direction')
def process_direction():
    print(request.get_json())
    return "direction data received"

@app.post('/base')
def process_base():
    print(request.get_json())
    return "base data received"

@app.post('/pince')
def process_pince():
    print(request.get_json())
    return "pince data received"

@app.post('/rotation')
def process_rotation():
    print(request.get_json())
    return "rotation data received"

@app.get('/data.json')
def data_json():
    mySerial.write(bytes("Data?\n", 'utf-8'))
    if (mySerial.in_waiting != 0):
        receive = mySerial.readline()
        receive = int(receive)
        string = {"distance": receive}
        return json.dumps(string)
    return "No data"

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded = True)#run on port 5000


# TODO modify html & js to handle response with sensor data 
#      add a function for sending sensor data from server to web page not in a response  
