import { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text, Button } from "@/components"
import { colors, spacing } from "@/theme"

export interface ConfigFormProps {
  title: string
  children: React.ReactNode
  onSubmit: () => void
  isSubmitting: boolean
  style?: ViewStyle
}

export const ConfigForm: FC<ConfigFormProps> = ({
  title,
  children,
  onSubmit,
  isSubmitting,
  style,
}) => {
  return (
    <View style={[style, $container]}>
      <Text preset="heading" text={title} style={$title} />
      <View style={$content}>{children}</View>
      <Button
        text={isSubmitting ? "Enviando..." : "Guardar configuración"}
        onPress={onSubmit}
        disabled={isSubmitting}
        style={$submitButton}
      />
    </View>
  )
}

const $container: ViewStyle = {
  marginBottom: spacing.lg,
  padding: spacing.md,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
}

const $title: TextStyle = {
  fontSize: 18,
  marginBottom: spacing.sm,
}

const $content: ViewStyle = {
  marginBottom: spacing.md,
}

const $submitButton: ViewStyle = {
  backgroundColor: colors.palette.secondary500,
}
