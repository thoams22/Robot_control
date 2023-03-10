int trigPin = D1;
int echoPin = D2;

float duration_us, distance_cm;

void setup() {

  Serial.begin(9600);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {

  if (Serial.available()) {
    String str = Serial.readStringUntil('\n');
    if (str = "Data?") {
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin, LOW);

      duration_us = pulseIn(echoPin, HIGH);
      distance_cm = 0.017 * duration_us;

      Serial.println((int)distance_cm);
    }
  }
}
