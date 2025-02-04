import { FC, useState } from "react"
import { ViewStyle, View, ScrollView, ImageStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Screen, Text, ListItem, Card } from "@/components"
import { Switch } from "@/components/Toggle"
import { colors, spacing } from "@/theme"
import { supabase } from "@/services/supabase"
import { Icon } from "@/components"
import { IconTypes } from "@/components/Icon"
import { useAppTheme } from "@/utils/useAppTheme"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = (_props) => {
  const { navigation } = _props
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { theme, setThemeContextOverride } = useAppTheme()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      navigation.navigate("Login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const menuItems: Array<{ icon: IconTypes; label: string; onPress: () => void }> = [
    { icon: "bell", label: "Notificaciones", onPress: () => console.log("Notificaciones") },
    {
      icon: "settings",
      label: "Configuración BLE",
      onPress: () => navigation.navigate("BLE"),
    },
  ]

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$container}>
        {/* Sidebar */}
        <View style={[$sidebar, !isSidebarOpen && $sidebarClosed]}>
          <View style={$sidebarHeader}>
            <Icon icon="menu" size={24} onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
          </View>

          <ScrollView style={$menuContainer}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                leftIcon={item.icon}
                text={isSidebarOpen ? item.label : ""}
                onPress={item.onPress}
                style={$menuItem}
              />
            ))}
          </ScrollView>

          <View style={[$themeToggleContainer, !isSidebarOpen && $hidden]}>
            <Text text={isSidebarOpen ? "Tema Oscuro" : ""} style={$themeToggleText} />
            <Switch
              value={theme.isDark}
              onValueChange={(value) => setThemeContextOverride(value ? "dark" : "light")}
            />
          </View>

          <View style={!isSidebarOpen && $hidden}>
            <Button
              preset="reversed"
              text={isSidebarOpen ? "Cerrar Sesión" : ""}
              LeftAccessory={() => (
                <Icon icon="x" size={20} color={colors.palette.neutral100} style={$logoutIcon} />
              )}
              style={$logoutButton}
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={$content}>
          <View style={$headerContent}>
            <Text preset="heading" text="Bienvenido al Dashboard" />
            <Text
              preset="subheading"
              text="Selecciona una opción del menú para comenzar"
              style={$subtitle}
            />
          </View>
          <View style={$mainContent}>
            {/* Aquí puedes agregar el contenido principal */}
            <Card
              preset="reversed"
              heading="Panel Principal"
              content="Este es el contenido del dashboard. Aquí podrás ver toda la información relevante."
              style={$card}
            />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}

const $sidebar: ViewStyle = {
  width: 250,
  backgroundColor: colors.palette.neutral300,
  height: "100%",
  padding: spacing.sm,
  justifyContent: "space-between",
  borderRightWidth: 1,
  borderRightColor: colors.separator,
}

const $sidebarClosed: ViewStyle = {
  width: 60,
}

const $sidebarHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.md,
  marginBottom: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
}

const $menuContainer: ViewStyle = {
  flex: 1,
}

const $menuItem: ViewStyle = {
  backgroundColor: "transparent",
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
  paddingVertical: spacing.xs,
  marginVertical: spacing.xxs,
}

const $content: ViewStyle = {
  flex: 1,
  padding: spacing.lg,
  backgroundColor: colors.background,
}

const $logoutButton: ViewStyle = {
  marginTop: spacing.md,
  backgroundColor: colors.error,
}

const $logoutIcon: ImageStyle = {
  marginRight: spacing.xs,
}

const $headerContent: ViewStyle = {
  marginBottom: spacing.xl,
}

const $subtitle: TextStyle = {
  marginTop: spacing.sm,
  color: colors.textDim,
}

const $mainContent: ViewStyle = {
  flex: 1,
}

const $card: ViewStyle = {
  marginBottom: spacing.lg,
}

const $themeToggleContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: spacing.sm,
  paddingVertical: spacing.xs,
  borderTopWidth: 1,
  borderTopColor: colors.separator,
}

const $themeToggleText: TextStyle = {
  marginRight: spacing.sm,
}

const $hidden: ViewStyle = {
  display: "none",
}
