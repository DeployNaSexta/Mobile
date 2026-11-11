export const NAV_ITEMS = [
  { to: "/", label: "Início", icon: "home" },
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/maquinas", label: "Máquinas", icon: "machine" },
  { to: "/relatorios", label: "Relatórios", icon: "reports" },
  { to: "/alertas", label: "Alertas", icon: "bell" },
] as const;

export const SETTINGS_ITEM = {
  to: "/config",
  label: "Configurações",
  icon: "settings",
} as const;
