#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <WiFiUdp.h>
#include <WiFiClient.h>
#include <WebServer.h>

WebServer server(80);

#define LED_PIN 22    // Pin for external LED
#define BUZZER_PIN 19 // Pin for BUZZER
#define DHT_PIN 4     // Pin for DHT sensor
#define DHT_TYPE DHT22

unsigned long initial_reading = 0;
unsigned long final_reading = 5000;

const char *ssid = "metgoog";
const char *password = "simon2929";
const char *serverUrl = "http://172.20.10.3:8000/api/readings/insert";

DHT dht(DHT_PIN, DHT_TYPE);

WiFiUDP ntpUDP;
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 0;

bool autoMode = true;
bool manualState = false;

void sendData(float humidity, float temperature, char *pumpState)
{
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
  String jsonPayload = "{\"dateRead\":\"" + String(currentDate) + "\", \"timeRead\":\"" + String(currentTime) + "\", \"humReading\":\"" + String(humidity) + "\", \"temReading\":\"" + String(temperature) + "\", \"groupName\":\"SimonHafiz" + "\", \"pumpStatus\":\"" + String(pumpState) + "\"}";
  Serial.print(jsonPayload);
  // Make the HTTP POST request
  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0)
  {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.println("Data sent successfully");
  }
  else
  {
    Serial.print("HTTP Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Failed to send data");
  }

  // Free resources
  http.end();
}

void setup()
{
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20)
  { // Try connecting for up to 10 seconds
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("");
    Serial.print("Connected to WiFi network with IP Address: ");
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println("");
    Serial.println("Failed to connect to WiFi");
    return;
  }

  server.on("/mode", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    if (request->hasParam("auto"))
    {
      autoMode = request->getParam("auto")->value().equals("true");
      request->send(200, "text/plain", autoMode ? "Auto mode enabled" : "Manual mode enabled");
    }
    else
    {
      request->send(400, "text/plain", "Missing 'auto' parameter");
    } });

  server.on("/pump", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    if (!autoMode && request->hasParam("state"))
    {
      pumpState = request->getParam("state")->value().equals("true");
      request->send(200, "text/plain", pumpState ? "Pump started" : "Pump stopped");
    }
    else
    {
      request->send(400, "text/plain", "Invalid request");
    } });

  server.begin();

  // Initialize NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  pinMode(BUZZER_PIN, OUTPUT); // buzzer set up
  pinMode(LED_PIN, OUTPUT);
  dht.begin(); // dht object
}

void loop()
{
  server.handleClient();
  unsigned long currentMillis = millis();
  float temp = dht.readTemperature();
  if ((unsigned long)(currentMillis - initial_reading) >= final_reading)
  {
    initial_reading = final_reading;

    // Read and print temperature every 3 sec
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    // Check if any reads failed
    if (isnan(temperature) || isnan(humidity))
    {
      Serial.println("Failed to read from DHT sensor!");
      return;
    } // end

    Serial.print("Temperature: ");
    Serial.print(temperature);

    Serial.print(" °C - ");
    Serial.println(millis());

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.print(" % - ");
    Serial.println(millis());

    tone(BUZZER_PIN, 1000); // send 1k HZ frequency
    delay(1000);
    noTone(BUZZER_PIN);
    delay(1000);

    char *pumpState;

    if (autoMode)
    {
      if (temperature > 29)
      {
        digitalWrite(LED_PIN, HIGH);
        pumpState = "ON";
      }
      else
      {
        digitalWrite(LED_PIN, LOW);
        pumpState = "OFF";
      }
    }
    else
    {
      if (manualState)
      {
        digitalWrite(LED_PIN, HIGH);
      }
      else
      {
        digitalWrite(LED_PIN, LOW);
      }
    }
    sendData(humidity, temperature, pumpState);
  }
}