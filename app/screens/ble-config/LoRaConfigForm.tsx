import { FC, useEffect, useState, useCallback } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Device } from "react-native-ble-plx"
import { TextField, Text } from "@/components"
import { ConfigForm } from "@/components/ConfigForm"
import {
  BLE_SERVICE_UUID,
  BLE_CHARACTERISTICS,
  readConfigCharacteristic,
  writeConfigCharacteristic,
} from "@/utils/ble-utils"
import { colors, spacing } from "@/theme"

const NAMESPACE = "lorawan"

interface ValidationErrors {
  devAddr?: string
  fNwkSIntKey?: string
  sNwkSIntKey?: string
  nwkSEncKey?: string
  appSKey?: string
}

interface LoRaConfigFormProps {
  device: Device
}

export const LoRaConfigForm: FC<LoRaConfigFormProps> = ({ device }) => {
  const [devAddr, setDevAddr] = useState("")
  const [fNwkSIntKey, setFNwkSIntKey] = useState("")
  const [sNwkSIntKey, setSNwkSIntKey] = useState("")
  const [nwkSEncKey, setNwkSEncKey] = useState("")
  const [appSKey, setAppSKey] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadConfig = useCallback(async () => {
    try {
      const config = await readConfigCharacteristic(
        device,
        BLE_SERVICE_UUID,
        BLE_CHARACTERISTICS.LORA_CONFIG,
      )
      if (config?.[NAMESPACE]) {
        setDevAddr(formatHexValue(config[NAMESPACE].devAddr))
        setFNwkSIntKey(formatHexValue(config[NAMESPACE].fNwkSIntKey))
        setSNwkSIntKey(formatHexValue(config[NAMESPACE].sNwkSIntKey))
        setNwkSEncKey(formatHexValue(config[NAMESPACE].nwkSEncKey))
        setAppSKey(formatHexValue(config[NAMESPACE].appSKey))
      }
    } catch (error) {
      console.error("Error cargando configuración LoRa:", error)
    }
  }, [device])

  useEffect(() => {
    loadConfig()
  }, [device, loadConfig])

  const formatHexValue = (value: any): string => {
    if (typeof value === "string") return value.replace(/^0x/i, "").toUpperCase()
    if (typeof value === "number") return value.toString(16).padStart(8, "0").toUpperCase()
    return ""
  }

  const validateFields = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!/^[0-9A-F]{8}$/i.test(devAddr)) {
      newErrors.devAddr = "DevAddr debe ser un valor hexadecimal de 8 dígitos"
    }
    if (!/^[0-9A-F]{32}$/i.test(fNwkSIntKey)) {
      newErrors.fNwkSIntKey = "fNwkSIntKey debe ser un valor hexadecimal de 32 dígitos"
    }
    if (!/^[0-9A-F]{32}$/i.test(sNwkSIntKey)) {
      newErrors.sNwkSIntKey = "sNwkSIntKey debe ser un valor hexadecimal de 32 dígitos"
    }
    if (!/^[0-9A-F]{32}$/i.test(nwkSEncKey)) {
      newErrors.nwkSEncKey = "nwkSEncKey debe ser un valor hexadecimal de 32 dígitos"
    }
    if (!/^[0-9A-F]{32}$/i.test(appSKey)) {
      newErrors.appSKey = "appSKey debe ser un valor hexadecimal de 32 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateFields()) return

    setIsSubmitting(true)
    try {
      const config = {
        [NAMESPACE]: {
          devAddr: `0x${devAddr}`,
          fNwkSIntKey,
          sNwkSIntKey,
          nwkSEncKey,
          appSKey,
        },
      }
      await writeConfigCharacteristic(
        device,
        BLE_SERVICE_UUID,
        BLE_CHARACTERISTICS.LORA_CONFIG,
        config,
      )
    } catch (error) {
      console.error("Error guardando configuración LoRa:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfigForm title="Configuración LoRa" onSubmit={handleSubmit} isSubmitting={isSubmitting}>
      <View style={$fieldContainer}>
        <TextField
          label="DevAddr (hex)"
          value={devAddr}
          onChangeText={(text) => setDevAddr(text.replace(/[^0-9A-F]/gi, "").toUpperCase())}
          maxLength={8}
          autoCapitalize="characters"
          containerStyle={$field}
        />
        {errors.devAddr && <Text text={errors.devAddr} style={$errorText} />}
      </View>

      <View style={$fieldContainer}>
        <TextField
          label="fNwkSIntKey (hex)"
          value={fNwkSIntKey}
          onChangeText={(text) => setFNwkSIntKey(text.replace(/[^0-9A-F]/gi, "").toUpperCase())}
          maxLength={32}
          autoCapitalize="characters"
          containerStyle={$field}
        />
        {errors.fNwkSIntKey && <Text text={errors.fNwkSIntKey} style={$errorText} />}
      </View>

      <View style={$fieldContainer}>
        <TextField
          label="sNwkSIntKey (hex)"
          value={sNwkSIntKey}
          onChangeText={(text) => setSNwkSIntKey(text.replace(/[^0-9A-F]/gi, "").toUpperCase())}
          maxLength={32}
          autoCapitalize="characters"
          containerStyle={$field}
        />
        {errors.sNwkSIntKey && <Text text={errors.sNwkSIntKey} style={$errorText} />}
      </View>

      <View style={$fieldContainer}>
        <TextField
          label="nwkSEncKey (hex)"
          value={nwkSEncKey}
          onChangeText={(text) => setNwkSEncKey(text.replace(/[^0-9A-F]/gi, "").toUpperCase())}
          maxLength={32}
          autoCapitalize="characters"
          containerStyle={$field}
        />
        {errors.nwkSEncKey && <Text text={errors.nwkSEncKey} style={$errorText} />}
      </View>

      <View style={$fieldContainer}>
        <TextField
          label="appSKey (hex)"
          value={appSKey}
          onChangeText={(text) => setAppSKey(text.replace(/[^0-9A-F]/gi, "").toUpperCase())}
          maxLength={32}
          autoCapitalize="characters"
          containerStyle={$field}
        />
        {errors.appSKey && <Text text={errors.appSKey} style={$errorText} />}
      </View>
    </ConfigForm>
  )
}

const $fieldContainer: ViewStyle = {
  marginBottom: spacing.md,
}

const $field: ViewStyle = {
  marginBottom: spacing.xs,
}

const $errorText: TextStyle = {
  color: colors.error,
  fontSize: 12,
}
