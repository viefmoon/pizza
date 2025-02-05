import { FC, useEffect, useState } from "react"
import { ViewStyle, Alert, ScrollView, TextStyle } from "react-native"
import { Screen, Text, Button } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { Device } from "react-native-ble-plx"
import { SystemConfigForm } from "@/screens/ble-config/SystemConfigForm"
import { NTC100KConfigForm } from "@/screens/ble-config/NTC100KConfigForm"
import { NTC10KConfigForm } from "@/screens/ble-config/NTC10KConfigForm"
import { ConductivityConfigForm } from "@/screens/ble-config/ConductivityConfigForm"
import { PHConfigForm } from "@/screens/ble-config/PHConfigForm"
import { SensorsConfigForm } from "@/screens/ble-config/SensorsConfigForm"
import { LoRaConfigForm } from "@/screens/ble-config/LoRaConfigForm"
import { spacing } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { Theme } from "@/theme"

interface BLEConfigScreenProps extends AppStackScreenProps<"BLEConfig"> {}

export const BLEConfigScreen: FC<BLEConfigScreenProps> = ({ route, navigation }) => {
  const device = route.params?.device as Device
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const { theme } = useAppTheme()

  useEffect(() => {
    if (!device) {
      navigation.goBack()
      return
    }

    return () => {
      if (device) {
        device
          .cancelConnection()
          .then(() => console.log("Dispositivo BLE desconectado al salir"))
          .catch((err) => console.warn("Error al desconectar:", err))
      }
    }
  }, [device, navigation])

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await device.cancelConnection()
      navigation.goBack()
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al desconectar el dispositivo")
    } finally {
      setIsDisconnecting(false)
    }
  }

  if (!device) return null

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["bottom"]}>
      <Text text={`Dispositivo: ${device.name || device.id}`} style={$deviceName(theme)} />

      <Button
        text={isDisconnecting ? "Desconectando..." : "Desconectar dispositivo"}
        onPress={handleDisconnect}
        style={{ ...$disconnectButton, backgroundColor: theme.colors.error }}
        disabled={isDisconnecting}
      />

      <ScrollView style={$scrollView}>
        <SystemConfigForm device={device} />
        <NTC100KConfigForm device={device} />
        <NTC10KConfigForm device={device} />
        <ConductivityConfigForm device={device} />
        <PHConfigForm device={device} />
        <SensorsConfigForm device={device} />
        <LoRaConfigForm device={device} />
      </ScrollView>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
}

const $disconnectButton: ViewStyle = {
  marginBottom: spacing.lg,
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $deviceName = (theme: Theme): TextStyle => ({
  marginBottom: spacing.sm,
  textAlign: "center",
  color: theme.colors.text,
})
