import { useEffect, useState } from "react"
import { BleManager, Device, State } from "react-native-ble-plx"
import { requestAndroidPermissions } from "../../android/app/src/main/java/com/pizza/permissions/BlePermissions"

let bleManagerInstance: BleManager | null = null

export function useBLE() {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])
  const [bluetoothState, setBluetoothState] = useState<State>(State.Unknown)
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null)

  useEffect(() => {
    if (!bleManagerInstance) {
      try {
        bleManagerInstance = new BleManager()
      } catch (error) {
        console.error("Error creating BleManager:", error)
        return
      }
    }

    const subscription = bleManagerInstance.onStateChange((state) => {
      setBluetoothState(state)
    }, true)

    return () => {
      subscription.remove()
      // No destruimos el manager aquí para mantener la instancia
    }
  }, [])

  const requestPermissions = async () => {
    try {
      const granted = await requestAndroidPermissions()
      setPermissionsGranted(granted)
      return granted
    } catch (error) {
      console.error("Error requesting permissions:", error)
      setPermissionsGranted(false)
      return false
    }
  }

  const startScan = () => {
    if (!bleManagerInstance || isScanning) return

    setDevices([])
    setIsScanning(true)

    bleManagerInstance.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error)
        setIsScanning(false)
        return
      }
      if (device && device.name) {
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device]
          }
          return prev
        })
      }
    })

    setTimeout(() => {
      if (bleManagerInstance) {
        bleManagerInstance.stopDeviceScan()
      }
      setIsScanning(false)
    }, 10000)
  }

  const stopScan = () => {
    if (!bleManagerInstance) return
    bleManagerInstance.stopDeviceScan()
    setIsScanning(false)
  }

  const connectToDevice = async (device: Device) => {
    if (!bleManagerInstance) throw new Error("BleManager not initialized")
    try {
      const connectedDevice = await device.connect()
      await connectedDevice.discoverAllServicesAndCharacteristics()
      return connectedDevice
    } catch (error) {
      console.error("Error connecting to device:", error)
      throw error
    }
  }

  return {
    isScanning,
    devices,
    startScan,
    stopScan,
    connectToDevice,
    isReady: !!bleManagerInstance,
    bluetoothState,
    permissionsGranted,
    requestPermissions,
  }
}
