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
import { TouchableOpacity } from "react-native"

interface BLEConfigScreenProps extends AppStackScreenProps<"BLEConfig"> {}

export const BLEConfigScreen: FC<BLEConfigScreenProps> = ({ route, navigation }) => {
  const device = route.params?.device as Device
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const { theme } = useAppTheme()

  const [expandedForm, setExpandedForm] = useState<string | null>(null)

  useEffect(() => {
    if (!device) {
      navigation.goBack()
      return
    }

    const connectDevice = async () => {
      try {
        const isConnected = await device.isConnected()
        if (!isConnected) {
          await device.connect()
        }
      } catch (error) {
        console.error("Error conectando al dispositivo:", error)
        navigation.goBack()
      }
    }

    connectDevice()

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

  const toggleForm = (formName: string) => {
    setExpandedForm((prevForm) => (prevForm === formName ? null : formName))
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
        <TouchableOpacity onPress={() => toggleForm("system")} style={$formHeader(theme)}>
          <Text text="System Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "system" && <SystemConfigForm device={device} />}

        <TouchableOpacity onPress={() => toggleForm("ntc100k")} style={$formHeader(theme)}>
          <Text text="NTC100K Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "ntc100k" && <NTC100KConfigForm device={device} />}

        <TouchableOpacity onPress={() => toggleForm("ntc10k")} style={$formHeader(theme)}>
          <Text text="NTC10K Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "ntc10k" && <NTC10KConfigForm device={device} />}

        <TouchableOpacity onPress={() => toggleForm("conductivity")} style={$formHeader(theme)}>
          <Text text="Conductivity Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "conductivity" && <ConductivityConfigForm device={device} />}

        <TouchableOpacity onPress={() => toggleForm("ph")} style={$formHeader(theme)}>
          <Text text="PH Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "ph" && <PHConfigForm device={device} />}

        <TouchableOpacity onPress={() => toggleForm("sensors")} style={$formHeader(theme)}>
          <Text text="Sensors Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "sensors" && <SensorsConfigForm device={device} />}

        <TouchableOpacity onPress={() => toggleForm("lora")} style={$formHeader(theme)}>
          <Text text="LoRa Config" style={$formHeaderText(theme)} />
        </TouchableOpacity>
        {expandedForm === "lora" && <LoRaConfigForm device={device} />}
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

const $formHeader = (theme: Theme): ViewStyle => ({
  padding: spacing.md,
  backgroundColor: theme.colors.background,
  borderBottomWidth: 1,
  borderBottomColor: "#ccc",
  marginBottom: spacing.xxxs,
})

const $formHeaderText = (theme: Theme): TextStyle => ({
  fontWeight: "bold",
  color: theme.colors.text,
})
