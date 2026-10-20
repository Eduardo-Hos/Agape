// ============================================================
// Conexao Bluetooth (Web Bluetooth) com as pulseiras ESP32
// ============================================================
//
// Dispositivos:
//   - ESP32_Pulseira : mede o BPM pelo sensor MAX30102 e publica
//   - ESP32_Hub      : recebe da pulseira e publica tambem
//
// O BPM chega como NOTIFY. Dependendo do codigo do ESP, o valor
// pode vir como 1 byte ou como int (4 bytes) - tratamos os dois.
//
// IMPORTANTE: Web Bluetooth so funciona em Chrome/Edge do Android
// E com a pagina em https:// ou localhost.
// ============================================================

// Nomes anunciados pelos ESPs
export const NOME_PULSEIRA = 'ESP32_Pulseira';
export const NOME_HUB = 'ESP32_Hub';

// UUIDs do ESP32_Pulseira
const PULSEIRA_SERVICE = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const PULSEIRA_CHARACTERISTIC = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// UUIDs do ESP32_Hub
const HUB_SERVICE = '5bc28d32-1fb5-459e-8fcc-c5c9c331914b';
const HUB_CHARACTERISTIC = 'abc5483e-36e1-4688-b7f5-ea07361b26a8';

export function temSuporteBluetooth() {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth;
}

// Le o BPM de um DataView, aceitando 1 byte (uint8) ou 4 bytes (int)
function lerBpm(view) {
  if (view.byteLength >= 4) {
    return view.getInt32(0, true); // little-endian (ESP32)
  }
  return view.getUint8(0);
}

// tipo: 'pulseira' | 'hub'
// onBpm: callback a cada leitura
// onStatus: callback de status (texto)
export async function conectarPulseira(tipo, onBpm, onStatus) {
  if (!temSuporteBluetooth()) {
    throw new Error(
      'Este navegador nao tem suporte a Bluetooth. Use o Chrome no Android.'
    );
  }

  const ehHub = tipo === 'hub';
  const serviceUuid = ehHub ? HUB_SERVICE : PULSEIRA_SERVICE;
  const charUuid = ehHub ? HUB_CHARACTERISTIC : PULSEIRA_CHARACTERISTIC;
  const nomeEsperado = ehHub ? NOME_HUB : NOME_PULSEIRA;

  onStatus && onStatus('Abrindo a lista de dispositivos...');

  // O espiao provou que funciona com filtro por NOME **ou** por SERVICO.
  // Usamos os dois: se o Chrome nao incluir o nome no pacote de anuncio
  // (comum quando o ESP anuncia UUID de servico), o filtro por servico
  // ainda encontra o dispositivo.
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ name: nomeEsperado }, { services: [serviceUuid] }],
    optionalServices: [
      serviceUuid,
      charUuid,
      '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
      '5bc28d32-1fb5-459e-8fcc-c5c9c331914b',
      'beb5483e-36e1-4688-b7f5-ea07361b26a8',
      'abc5483e-36e1-4688-b7f5-ea07361b26a8',
      '00001800-0000-1000-8000-00805f9b34fb',
      '00001801-0000-1000-8000-00805f9b34fb',
    ],
  });

  if (onStatus) {
    onStatus('Conectando em ' + (device.name || nomeEsperado) + '...');
  }

  const server = await device.gatt.connect();

  onStatus && onStatus('Lendo servicos do dispositivo...');
  const service = await server.getPrimaryService(serviceUuid);

  const characteristic = await service.getCharacteristic(charUuid);

  function tratarValor(event) {
    const valor = lerBpm(event.target.value);
    // BPM valido fica entre 20 e 250; ignora leituras invalidas/zero
    if (valor >= 20 && valor <= 250 && onBpm) {
      onBpm(valor);
    }
  }

  await characteristic.startNotifications();
  characteristic.addEventListener('characteristicvaluechanged', tratarValor);

  device.addEventListener('gattserverdisconnected', () => {
    onStatus && onStatus('Dispositivo desconectado.');
  });

  onStatus && onStatus('Conectado! Aguardando batimentos (coloque o dedo no sensor)...');

  return {
    nome: device.name || nomeEsperado,
    desconectar() {
      try {
        characteristic.removeEventListener(
          'characteristicvaluechanged',
          tratarValor
        );
      } catch {
        /* ignore */
      }
      try {
        if (device.gatt.connected) device.gatt.disconnect();
      } catch {
        /* ignore */
      }
    },
  };
}
