from flask import Flask, request, render_template
import serial
app = Flask(__name__)

# mySerial = serial.Serial('COM4', 9600) # changer COM4 pour la sortie serial du raspberry pi

@app.get('/')
def hello_world():
    return render_template("/armControl.html")

@app.post('/arm')
def process_arm():
    value = request.get_json() # return a python dictionnary
    print(value["data"])
    # if (mySerial.in_waiting != 0):
    #     recieve = mySerial.readline()
    # mySerial.write(value)
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

@app.post('/btn')
def process_btn():
    print(request.get_json())
    return "direction data received"

if __name__ == "__main__":
    app.run()#run on port 5000


# TODO modify html & js to handle response with sensor data 
#      add a function for sending sensor data from server to web page not in a response
#      add a function to handle the camera pi
#      