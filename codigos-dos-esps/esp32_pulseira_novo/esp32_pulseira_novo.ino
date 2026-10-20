// ============================================================
// ESP32_Pulseira (Sensor MAX30102)
// ============================================================
// Funcao:
//   - Le o BPM real do sensor MAX30102
//   - Publica o BPM por Bluetooth (NOTIFY), no servico esperado
//     pelo ESP32_Hub.
//
// MELHORIAS em relacao ao codigo antigo:
//   1. NAO trava mais se o sensor falhar (antes tinha while(1)).
//      Se o sensor nao responder, ele tenta de novo em vez de congelar.
//   2. Continua anunciando o BLE mesmo sem sensor, para o Hub achar.
//   3. Mesmos UUIDs e mesmo formato (int de 4 bytes) do codigo antigo,
//      para nao quebrar o Hub nem o site.
// ============================================================

#include <Wire.h>
#include <MAX30105.h>
#include "heartRate.h"

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// ======== CONFIGURACOES BLE (iguais ao codigo antigo) ========
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
bool sensorOk = false;

// ======== OBJETOS ========
MAX30105 particleSensor;

// Variaveis de calculo de BPM
const byte RATE_SIZE = 4; // media movel de 4 leituras
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int bpm = 0;

// ======== CALLBACKS BLE ========
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Cliente conectado!");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Cliente desconectado!");
    BLEDevice::startAdvertising(); // Recomeca advertising
  }
};

// ======== SETUP ========
void setup() {
  Serial.begin(115200);
  Serial.println("Inicializando MAX30102 + BLE...");

  // --- Inicializa sensor MAX30102 ---
  // Se falhar, NAO travamos: apenas marcamos sensorOk = false e
  // continuamos (o BLE sobe do mesmo jeito).
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("AVISO: sensor MAX30102 nao encontrado. Continuando sem sensor.");
    sensorOk = false;
  } else {
    sensorOk = true;
    particleSensor.setup();
    particleSensor.setPulseAmplitudeRed(0x0A); // LED Vermelho (usado no BPM)
    particleSensor.setPulseAmplitudeGreen(0);  // LED Verde desligado
    Serial.println("Sensor MAX30102 pronto.");
  }

  // --- Inicializa BLE ---
  BLEDevice::init("ESP32_Pulseira");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->setValue((uint8_t*)&bpm, sizeof(bpm));
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("Servidor BLE pronto. Anunciando como ESP32_Pulseira.");
}

// ======== LOOP ========
void loop() {
  // Se o sensor nao estava disponivel no boot, tenta inicializar de novo
  // periodicamente, sem travar o BLE.
  if (!sensorOk) {
    if (particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
      sensorOk = true;
      particleSensor.setup();
      particleSensor.setPulseAmplitudeRed(0x0A);
      particleSensor.setPulseAmplitudeGreen(0);
      Serial.println("Sensor MAX30102 conectado agora.");
    } else {
      Serial.println("Sensor ainda ausente. Tentando de novo...");
      delay(2000);
      return;
    }
  }

  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE;

      bpm = 0;
      for (byte x = 0; x < RATE_SIZE; x++)
        bpm += rates[x];
      bpm /= RATE_SIZE;

      Serial.print("BPM detectado: ");
      Serial.println(bpm);

      if (deviceConnected) {
        pCharacteristic->setValue((uint8_t*)&bpm, sizeof(bpm));
        pCharacteristic->notify();
      }
    }
  }

  delay(20);
}
