#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
// #include <Wire.h>

#define LED_PIN       27   // Pin for external LED
#define RED_LED_PIN   2    // Pin for Red LED
#define BLUE_LED_PIN  23   // Pin for Blue LED
#define LDR_PIN       33   // Pin for LDR
#define DHT_PIN       19  // Pin for DHT sensor
#define DHT_TYPE      DHT22

DHT dht(DHT_PIN, DHT_TYPE);
// LiquidCrystal_I2C lcd(0x27, 16, 2);  // Adjust the address (0x27) based on your LCD configuration
LiquidCrystal_I2C lcd(0x3F, 16, 2); 

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  Serial.begin(115200);

  // Initialize DHT sensor
  dht.begin();

  // Initialize LCD
  lcd.begin(16, 2);
  lcd.backlight();
  delay(1000);
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
  Serial.print(" °C - ");
  Serial.println(millis());
  delay(3000);

  // Read and print humidity every 3 sec
  float humidity = dht.readHumidity();
  Serial.print("Humidity: ");
  Serial.print(humidity);
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

  // Display values on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temperature);
  lcd.print("C");

  lcd.setCursor(0, 1);
  lcd.print("Humidity: ");
  lcd.print(humidity);
  lcd.print("%");

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
