import { FC, useEffect, useState, useCallback } from "react"
import { View, ViewStyle } from "react-native"
import { Device } from "react-native-ble-plx"
import { TextField } from "@/components"
import { ConfigForm } from "@/components/ConfigForm"
import { Switch } from "@/components/Toggle"
import {
  BLE_SERVICE_UUID,
  BLE_CHARACTERISTICS,
  readConfigCharacteristic,
  writeConfigCharacteristic,
} from "@/utils/ble-utils"
import { spacing } from "@/theme"
import { Theme } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

const NAMESPACE = "sensors"

interface SensorsConfigFormProps {
  device: Device
}

export const SensorsConfigForm: FC<SensorsConfigFormProps> = ({ device }) => {
  const { theme } = useAppTheme()
  const [sensorId, setSensorId] = useState("")
  const [sensorType, setSensorType] = useState("")
  const [sensorEnable, setSensorEnable] = useState(false)
  const [sensorTimestamp, setSensorTimestamp] = useState("")
  const [sensorValue, setSensorValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadConfig = useCallback(async () => {
    try {
      const config = await readConfigCharacteristic(
        device,
        BLE_SERVICE_UUID,
        BLE_CHARACTERISTICS.SENSORS,
      )
      if (config?.[NAMESPACE]) {
        setSensorId(config[NAMESPACE].id || "")
        setSensorType(config[NAMESPACE].t || "")
        setSensorEnable(!!config[NAMESPACE].e)
        setSensorTimestamp(config[NAMESPACE].ts?.toString() || "")
        setSensorValue(config[NAMESPACE].v?.toString() || "")
      }
    } catch (error) {
      console.error("Error cargando configuración de sensores:", error)
    }
  }, [device])

  useEffect(() => {
    loadConfig()
  }, [device, loadConfig])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const config = {
        [NAMESPACE]: {
          id: sensorId,
          t: sensorType,
          e: sensorEnable,
        },
      }
      await writeConfigCharacteristic(device, BLE_SERVICE_UUID, BLE_CHARACTERISTICS.SENSORS, config)
    } catch (error) {
      console.error("Error guardando configuración de sensores:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfigForm
      title="Configuración de Sensores"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      style={$form(theme)}
    >
      <TextField
        label="ID del sensor"
        value={sensorId}
        onChangeText={setSensorId}
        containerStyle={$field}
      />

      <TextField
        label="Tipo de sensor"
        value={sensorType}
        onChangeText={setSensorType}
        containerStyle={$field}
      />

      <View style={$switchContainer}>
        <TextField
          label="Habilitado"
          value={sensorEnable ? "Sí" : "No"}
          editable={false}
          containerStyle={$switchField}
        />
        <Switch value={sensorEnable} onValueChange={setSensorEnable} />
      </View>

      <TextField
        label="Timestamp"
        value={sensorTimestamp}
        editable={false}
        containerStyle={$field}
      />

      <TextField label="Valor" value={sensorValue} editable={false} containerStyle={$field} />
    </ConfigForm>
  )
}

const $field: ViewStyle = {
  marginBottom: spacing.md,
}

const $switchContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.md,
}

const $switchField: ViewStyle = {
  flex: 1,
  marginRight: spacing.sm,
}

const $form = (theme: Theme): ViewStyle => ({
  backgroundColor: theme.colors.background,
})
