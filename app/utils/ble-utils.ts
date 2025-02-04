import { Device } from "react-native-ble-plx"
import { decode as atob, encode as btoa } from "base-64"

// Cache para discovery
const discoveredDevices = new Set<string>()

// Constantes de servicios y características BLE
export const BLE_SERVICE_UUID = "180A"
export const BLE_CHARACTERISTICS = {
  SYSTEM: "2A37",
  NTC100K: "2A38",
  NTC10K: "2A39",
  CONDUCTIVITY: "2A3C",
  PH: "2A3B",
  SENSORS: "2A40",
  LORA_CONFIG: "2A41",
}

// Función para decodificar base64
export function decodeBase64(value?: string | null): string {
  return value ? atob(value) : ""
}

// Función para leer configuración de una característica BLE
export async function readConfigCharacteristic(
  device: Device,
  serviceUUID: string,
  charUUID: string,
): Promise<any> {
  try {
    if (!discoveredDevices.has(device.id)) {
      await device.discoverAllServicesAndCharacteristics()
      discoveredDevices.add(device.id)
    }

    const characteristic = await device.readCharacteristicForService(serviceUUID, charUUID)
    const decoded = decodeBase64(characteristic.value)
    return JSON.parse(decoded)
  } catch (error: any) {
    console.error(`Error leyendo la característica ${charUUID}:`, error)
    throw error
  }
}

// Función para escribir configuración en una característica BLE
export async function writeConfigCharacteristic(
  device: Device,
  serviceUUID: string,
  charUUID: string,
  config: any,
): Promise<void> {
  try {
    const jsonConfig = JSON.stringify(config)
    const base64Config = btoa(jsonConfig)
    await device.writeCharacteristicWithResponseForService(serviceUUID, charUUID, base64Config)
  } catch (error: any) {
    console.error(`Error escribiendo la característica ${charUUID}:`, error)
    throw error
  }
}
