import { FC, useEffect } from "react"
import { ViewStyle, TextStyle } from "react-native"
import { Screen, Text, Button } from "@/components"
import { useBLE } from "@/hooks"
import { AppStackScreenProps } from "@/navigators"

interface BLEScreenProps extends AppStackScreenProps<"BLE"> {}

export const BLEScreen: FC<BLEScreenProps> = () => {
  const {
    isScanning,
    devices,
    startScan,
    stopScan,
    isReady,
    bluetoothState,
    permissionsGranted,
    requestPermissions,
  } = useBLE()

  useEffect(() => {
    if (isReady) {
      requestPermissions()
    }
  }, [isReady])

  if (!isReady) {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
        <Text preset="heading" text="Inicializando BLE..." style={$title} />
      </Screen>
    )
  }

  if (bluetoothState === "PoweredOff") {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
        <Text preset="heading" text="Bluetooth está desactivado" style={$title} />
        <Text text="Por favor, active el Bluetooth para continuar" style={$message} />
      </Screen>
    )
  }

  if (permissionsGranted === false) {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
        <Text preset="heading" text="Permisos requeridos" style={$title} />
        <Text
          text="Esta aplicación necesita permisos de Bluetooth para funcionar"
          style={$message}
        />
        <Button text="Solicitar permisos" onPress={requestPermissions} style={$scanButton} />
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
      <Text preset="heading" text="Configuración BLE" style={$title} />

      <Button
        text={isScanning ? "Detener escaneo" : "Escanear dispositivos"}
        onPress={isScanning ? stopScan : startScan}
        style={$scanButton}
      />

      {devices.map((device) => (
        <Button
          key={device.id}
          text={`${device.name || "Sin nombre"} (${device.id})`}
          onPress={() => {
            /* Implementar conexión */
          }}
          style={$deviceButton}
        />
      ))}
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 24,
}

const $title: ViewStyle = {
  marginBottom: 24,
}

const $message: TextStyle = {
  marginBottom: 16,
  textAlign: "center",
}

const $scanButton: ViewStyle = {
  marginBottom: 16,
}

const $deviceButton: ViewStyle = {
  marginBottom: 8,
}
