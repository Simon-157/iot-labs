#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>  // Include time library
#include <WiFiUdp.h>

#define LED_PIN 27       // Pin for external LED
#define RED_LED_PIN 2    // Pin for Red LED
#define BLUE_LED_PIN 23  // Pin for Blue LED
#define LDR_PIN 33       // Pin for LDR
#define DHT_PIN 19       // Pin for DHT sensor
#define DHT_TYPE DHT22

const char* ssid = "Galaxy A717DC1";
const char* password = "jack123456";
const char* serverUrl = "http://192.168.115.209:8000/api/sensorData/insert";

DHT dht(DHT_PIN, DHT_TYPE);

WiFiUDP ntpUDP;
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;      // Your GMT offset in seconds
const int daylightOffset_sec = 0;  // Your daylight offset in seconds

void sendData(const char* sensorID, float reading) {
  HTTPClient http;

  http.begin(serverUrl);

  // Set content type to JSON
  http.addHeader("Content-Type", "application/json");

  // Get current date and time using NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  time_t now;
  time(&now);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);
  char currentDate[20];
  char currentTime[20];
  strftime(currentDate, sizeof(currentDate), "%Y-%m-%d", &timeinfo);
  strftime(currentTime, sizeof(currentTime), "%H:%M:%S", &timeinfo);

  // Prepare the JSON payload
  String jsonPayload = "{\"SensorID\":\"" + String(sensorID) + "\", \"CurrentReading\":" + String(reading) + ", \"DateRead\":\"" + String(currentDate) + "\", \"TimeRead\":\"" + String(currentTime) + "\"}";

  // Make the HTTP POST request
  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.println("Data sent successfully");
  } else {
    Serial.print("HTTP Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Failed to send data");
  }

  // Free resources
  http.end();
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {  // Try connecting for up to 10 seconds
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.print("Connected to WiFi network with IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("");
    Serial.println("Failed to connect to WiFi");
    return;
  }

  // Initialize NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  pinMode(LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);

  dht.begin();
}


void loop() {
  // Turn on external LED every 600ms
  digitalWrite(LED_PIN, HIGH);
  Serial.print("LED ON - ");
  Serial.println(millis());
  delay(600);

  // Turn off external LED every 600ms
  digitalWrite(LED_PIN, LOW);
  Serial.print("LED OFF - ");
  Serial.println(millis());
  delay(600);

  // Read and print temperature every 3 sec
  float temperature = dht.readTemperature();
  Serial.print("Temperature: ");
  Serial.print(temperature);
  sendData("2", temperature);
  Serial.print(" °C - ");
  Serial.println(millis());
  delay(3000);

  // Read and print humidity every 3 sec
  float humidity = dht.readHumidity();
  Serial.print("Humidity: ");
  Serial.print(humidity);

  sendData("3", humidity);
  Serial.print(" % - ");
  Serial.println(millis());
  delay(3000);

  // Read and print LDR value every 1.5 sec
  int ldrValue = analogRead(LDR_PIN);
  Serial.print("LDR Value: ");
  Serial.print(ldrValue);
  Serial.print(" - ");
  Serial.println(millis());
  delay(1500);

  // Turn on Red LED if temperature is higher than 26
  if (temperature > 26) {
    digitalWrite(RED_LED_PIN, HIGH);
  } else {
    digitalWrite(RED_LED_PIN, LOW);
  }

  // Turn on Blue LED if LDR value indicates darkness
  if (ldrValue < 500) {
    digitalWrite(BLUE_LED_PIN, HIGH);
  } else {
    digitalWrite(BLUE_LED_PIN, LOW);
  }
}
