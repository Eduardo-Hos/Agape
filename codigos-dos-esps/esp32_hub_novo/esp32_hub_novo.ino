// ============================================================
// ESP32_Hub (Central)
// ============================================================
// Funcao:
//   - Conecta como CLIENTE na ESP32_Pulseira (recebe o BPM real)
//   - Acende LED e Buzzer quando BPM >= 120
//   - Age como SERVIDOR: publica o BPM REAL (recebido da pulseira)
//     numa characteristic propria, para o site ler por Bluetooth
//
// Assim o site conecta NO HUB (nao na pulseira), e funcionam
// ao mesmo tempo: o LED/buzzer acende E o site mostra o BPM.
// ============================================================

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEClient.h>

// UUIDs do servico que este Hub oferece ao site (saida)
#define SERVICE_UUID_SERVER        "5bc28d32-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_SERVER "abc5483e-36e1-4688-b7f5-ea07361b26a8"

// UUIDs do servico da pulseira (entrada)
#define SERVICE_UUID_CLIENT        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_CLIENT "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define LED_PIN 13
#define BUZZER_PIN 15

// Nome da pulseira que este Hub procura
#define NOME_PULSEIRA "ESP32_Pulseira"

BLEServer* pServer = nullptr;
BLEService* pService = nullptr;
BLECharacteristic* pCharacteristic = nullptr;

BLEClient* pClient = nullptr;
BLERemoteCharacteristic* pRemoteCharacteristic = nullptr;

bool deviceConnected = false;   // algum cliente (site) conectado ao Hub
bool clientConnected = false;   // Hub conectado a pulseira

int bpm = 0;          // BPM REAL recebido da pulseira
int lastSentBpm = -1; // ultimo BPM publicado (evita repetir notificacao)

// ============================================================
// CALLBACK DE NOTIFICACAO (o Hub recebe o BPM da pulseira)
// ============================================================
static void notifyCallback(
  BLERemoteCharacteristic* pBLERemoteCharacteristic,
  uint8_t* pData,
  size_t length,
  bool isNotify) {

  if (length > 0) {
    // A pulseira envia o BPM como int (4 bytes) via sizeof(bpm).
    if (length >= 4) {
      memcpy(&bpm, pData, sizeof(int));
    } else {
      bpm = pData[0];
    }

    Serial.print("BPM real da pulseira: ");
    Serial.println(bpm);

    // LED e buzzer quando passa de 120
    if (bpm >= 120) {
      digitalWrite(LED_PIN, HIGH);
      digitalWrite(BUZZER_PIN, HIGH);
    } else {
      digitalWrite(LED_PIN, LOW);
      digitalWrite(BUZZER_PIN, LOW);
    }
  }
}

// ============================================================
// CALLBACK DO SERVIDOR (o site conecta no Hub)
// ============================================================
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    // Nao chamamos notify() aqui dentro: dentro do callback da pilha BLE
    // isso pode travar. O loop() publica o valor logo em seguida.
    Serial.println("Site conectado ao Hub.");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Site desconectado do Hub.");
    // Reanuncia para o site poder reconectar
    pServer->startAdvertising();
  }
};

MyServerCallbacks* serverCallbacks = nullptr;

// ============================================================
// CONECTA COMO CLIENTE NA PULSEIRA
// ============================================================
bool connectToPulseira() {
  BLEScan* pBLEScan = BLEDevice::getScan();
  pBLEScan->setActiveScan(true);

  // Scan curto (2s) para nao travar o servidor por muito tempo
  BLEScanResults* foundDevices = pBLEScan->start(2, false);

  for (int i = 0; i < foundDevices->getCount(); i++) {
    BLEAdvertisedDevice device = foundDevices->getDevice(i);

    if (device.haveName() && device.getName() == NOME_PULSEIRA) {
      Serial.print("Pulseira encontrada: ");
      Serial.println(device.getName().c_str());

      pClient = BLEDevice::createClient();
      if (!pClient->connect(&device)) {
        Serial.println("Falha ao conectar na pulseira.");
        return false;
      }

      BLERemoteService* pRemoteService = pClient->getService(SERVICE_UUID_CLIENT);
      if (pRemoteService == nullptr) {
        Serial.println("Servico da pulseira nao encontrado.");
        pClient->disconnect();
        return false;
      }

      pRemoteCharacteristic = pRemoteService->getCharacteristic(CHARACTERISTIC_UUID_CLIENT);
      if (pRemoteCharacteristic == nullptr) {
        Serial.println("Characteristic da pulseira nao encontrada.");
        pClient->disconnect();
        return false;
      }

      if (pRemoteCharacteristic->canNotify()) {
        pRemoteCharacteristic->registerForNotify(notifyCallback);
        Serial.println("Recebendo BPM da pulseira (notify habilitado).");
      }

      clientConnected = true;
      return true;
    }
  }

  Serial.println("Pulseira nao encontrada no scan.");
  return false;
}

// ============================================================
// SETUP
// ============================================================
void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando ESP32_Hub (recebe pulseira + publica no site)");

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  BLEDevice::init("ESP32_Hub");

  // --- Servidor BLE (o site conecta aqui) ---
  pServer = BLEDevice::createServer();
  serverCallbacks = new MyServerCallbacks();
  pServer->setCallbacks(serverCallbacks);

  pService = pServer->createService(SERVICE_UUID_SERVER);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID_SERVER,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );

  pCharacteristic->setValue((uint8_t*)&bpm, sizeof(bpm));
  pService->start();

  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID_SERVER);
  pAdvertising->start();

  Serial.println("Servidor BLE do Hub ativo. O site pode conectar.");
}

// ============================================================
// LOOP PRINCIPAL
// ============================================================
void loop() {
  // Como CLIENTE - conecta na pulseira se ainda nao estiver conectado
  if (!clientConnected) {
    clientConnected = connectToPulseira();
    if (!clientConnected) {
      Serial.println("Tentando de novo em 3s...");
      delay(3000);
      return;
    }
  }

  // Verifica se a conexao com a pulseira caiu
  if (clientConnected && pClient != nullptr && !pClient->isConnected()) {
    Serial.println("Conexao com a pulseira perdida.");
    clientConnected = false;
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    delay(2000);
    return;
  }

  // Como SERVIDOR - publica o BPM REAL quando ele muda
  if (deviceConnected && bpm != lastSentBpm) {
    lastSentBpm = bpm;
    pCharacteristic->setValue((uint8_t*)&bpm, sizeof(bpm));
    pCharacteristic->notify();
    Serial.print("Publicado no site - BPM real: ");
    Serial.println(bpm);
  }

  delay(200);
}
