import { FC, useEffect } from "react"
import { ViewStyle, Alert, TextStyle } from "react-native"
import { Screen, Text, Button } from "@/components"
import { useBLE } from "@/hooks"
import { AppStackScreenProps } from "@/navigators"
import { Device } from "react-native-ble-plx"
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  cancelAnimation,
} from "react-native-reanimated"

interface BLEScreenProps extends AppStackScreenProps<"BLE"> {}

export const BLEScreen: FC<BLEScreenProps> = ({ navigation }) => {
  const {
    isScanning,
    devices,
    startScan,
    stopScan,
    isReady,
    bluetoothState,
    permissionsGranted,
    requestPermissions,
    connectToDevice,
    disconnectDevice,
    connectedDevice,
    isConnecting,
  } = useBLE()

  // Nueva animación para el botón de escaneo (efecto pulsante)
  const buttonScale = useSharedValue(1)

  useEffect(() => {
    if (isScanning) {
      buttonScale.value = withRepeat(
        withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
      )
    } else {
      cancelAnimation(buttonScale)
      buttonScale.value = 1
    }
  }, [isScanning, buttonScale])

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  useEffect(() => {
    if (isReady) {
      requestPermissions()
    }
  }, [isReady, requestPermissions])

  const handleDevicePress = async (device: Device) => {
    try {
      await connectToDevice(device)
      navigation.navigate("BLEConfig", { device })
    } catch (error: any) {
      Alert.alert("Error de conexión", error.message || "No se pudo conectar al dispositivo")
    }
  }

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

      {connectedDevice && (
        <>
          <Text text={`Conectado a: ${connectedDevice.name || "Dispositivo"}`} style={$message} />
          <Button
            text="Desconectar"
            onPress={disconnectDevice}
            style={$disconnectButton}
            disabled={isConnecting}
          />
        </>
      )}

      {/* Botón de escaneo con animación pulsante si está activo */}
      <Animated.View style={animatedButtonStyle}>
        <Button
          text={isScanning ? "Detener escaneo" : "Escanear dispositivos"}
          onPress={isScanning ? stopScan : startScan}
          style={$scanButton}
          disabled={isConnecting || !!connectedDevice}
        />
      </Animated.View>

      {devices.map((device) => (
        <Button
          key={device.id}
          text={`${device.name || "Sin nombre"} (${device.id})`}
          onPress={() => handleDevicePress(device)}
          style={$deviceButton}
          disabled={isConnecting || !!connectedDevice}
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

const $disconnectButton: ViewStyle = {
  marginBottom: 16,
  backgroundColor: "#ff4444",
}

export default BLEScreen
