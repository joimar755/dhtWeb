#include "DHT.h"
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>

#define DHTPIN 33
#define DHTTYPE DHT22

const char* ssid = "MelannyA";
const char* password = "3126394441Dilan**%";

// URLs de la API
const char* serverDatos = "http://192.168.1.6:3000/send_dht";
const char* userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJKb2ltYXIiLCJpYXQiOjE3NjEyNzQwMTQsImV4cCI6MTc2MTI4MTIxNH0.zV8-pQutFcSUJggkJXnWFAmGNx7msVAbFYlZnRKK3P8"; 

LiquidCrystal_I2C lcd(0x27,16,2);
DHT dht(DHTPIN, DHTTYPE);

unsigned long tiempo2 = 0;
unsigned long lastCheck = 0;

int LED1 = 27;
int LED2 = 26;
int LED3 = 25;

const int BTN1 = 13;
const int BTN2 = 12;
const int BTN3 = 14;

bool lastBtn1 = LOW;
bool lastBtn2 = LOW;
bool lastBtn3 = LOW;

bool statusE1 = false, statusE2 = false, statusE3 = false;

// === TECLADO ===
const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};

uint8_t colPins[COLS] = { 17, 16, 4, 2 };
// pines correspondientes a las columnas
uint8_t rowPins[ROWS] = { 23, 19, 18, 5 };
Keypad teclado = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// === FUNCIONES ===
void actualizarLCD() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("LD1:");
  lcd.print(statusE1 ? "ON" : "OFF");
  lcd.setCursor(9, 0);
  lcd.print("LD2:");
  lcd.print(statusE2 ? "ON" : "OFF");
  lcd.setCursor(0, 1);
  lcd.print("LD3:");
  lcd.print(statusE3 ? "ON" : "OFF");
}

void mostrarMenu() {
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("1:Sensor 2:LEDs");
  lcd.setCursor(0,1);
  lcd.print("3:Datos Sensor");
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  Wire.begin(21, 22);

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Conectando WiFi");

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(BTN1, INPUT);
  pinMode(BTN2, INPUT);
  pinMode(BTN3, INPUT);

  digitalWrite(LED1, LOW);
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }

  Serial.println("WiFi conectado");
  Serial.println(WiFi.localIP());
  lcd.clear();
  lcd.print("WiFi conectado!");
  delay(1000);

  mostrarMenu();
}

void myFunction() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    lcd.print("Failed reception");
    return;
  }
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(t);
  lcd.setCursor(0, 1);
  lcd.print("Hum: ");
  lcd.print(h);
  lcd.print("%");
}

void loop() {
  // === TECLADO ===
  char tecla = teclado.getKey();
  if (tecla) {
    Serial.print("Tecla presionada: ");
    Serial.println(tecla);

    if (tecla == '1') {
      myFunction(); // Sensor DHT
    } 
    else if (tecla == '2') {
      actualizarLCD(); // Estado LEDs
    } 
    else if (tecla == '3') {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Enviando datos...");
      enviarDatosDHT(); // Datos sensor
      lcd.setCursor(0,1);
      lcd.print("OK - Revisar log");
    } 
    else if (tecla == '*') {
      mostrarMenu(); // Regreso al menú
    }
  }

  // === BOTONES FÍSICOS ===
  bool currentBtn1 = digitalRead(BTN1);
  if (lastBtn1 == HIGH && currentBtn1 == LOW) {
    statusE1 = !statusE1;
    digitalWrite(LED1, statusE1);
    sendDatoBombillos(statusE1, statusE2, statusE3);
    actualizarLCD();
    delay(50);
  }
  lastBtn1 = currentBtn1;

  bool currentBtn2 = digitalRead(BTN2);
  if (lastBtn2 == HIGH && currentBtn2 == LOW) {
    statusE2 = !statusE2;
    digitalWrite(LED2, statusE2);
    sendDatoBombillos(statusE1, statusE2, statusE3);
    actualizarLCD();
    delay(50);
  }
  lastBtn2 = currentBtn2;

  bool currentBtn3 = digitalRead(BTN3);
  if (lastBtn3 == HIGH && currentBtn3 == LOW) {
    statusE3 = !statusE3;
    digitalWrite(LED3, statusE3);
    sendDatoBombillos(statusE1, statusE2, statusE3);
    actualizarLCD();
    delay(50);
  }
  lastBtn3 = currentBtn3;

  // === ACTUALIZACIÓN AUTOMÁTICA ===
  unsigned long now = millis();
  if (WiFi.status() == WL_CONNECTED) {
    if (millis() - tiempo2 >= 5000) {
      enviarDatosDHT();
      tiempo2 = millis();
    }
    if (now - lastCheck >= 2000) {
      lastCheck = now;
      updateLedsFromServer();
    }
  }
}

void enviarDatosDHT() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  Serial.print("Temperatura:");
  Serial.print(t);
  Serial.print("; Humedad:");
  Serial.println(h);

  HTTPClient http;
  http.begin(serverDatos);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(userToken));

  StaticJsonDocument<200> jsonDoc;
  jsonDoc["temperatura"] = t;
  jsonDoc["humedad"] = h;
  String jsonString;
  serializeJson(jsonDoc, jsonString);

  int httpResponseCode = http.POST(jsonString);
  if (httpResponseCode > 0)
    Serial.println("✅ Datos DHT enviados correctamente");
  else
    Serial.println("❌ Error al enviar datos DHT");

  http.end();
}

void sendDatoBombillos(int led1, int led2, int led3) {
  HTTPClient http;
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["led1"] = led1;
  jsonDoc["led2"] = led2;
  jsonDoc["led3"] = led3;

  String jsonString;
  serializeJson(jsonDoc, jsonString);
  http.begin("http://192.168.1.6:3000/leds");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(userToken));

  int httpResponseCode = http.POST(jsonString);
  if (httpResponseCode > 0)
    Serial.println("💡 Leds enviados correctamente");
  else
    Serial.println("⚠️ Error al enviar leds");

  http.end();
}

void updateLedsFromServer() {
  HTTPClient http;
  http.begin("http://192.168.1.6:3000/leds");
  http.addHeader("Authorization", "Bearer " + String(userToken));

  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);
    if (!error) {
      bool led1 = doc["led1"];
      bool led2 = doc["led2"];
      bool led3 = doc["led3"];

      digitalWrite(LED1, led1);
      digitalWrite(LED2, led2);
      digitalWrite(LED3, led3);
    }
  }
  http.end();
}
