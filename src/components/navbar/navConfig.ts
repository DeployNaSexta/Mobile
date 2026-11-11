import type { IconName } from "@/components/icons/Icon";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/Home", label: "Início", icon: "home" },
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/maquinas", label: "Máquinas", icon: "machine" },
  { to: "/relatorios", label: "Relatórios", icon: "reports" },
  { to: "/alertas", label: "Alertas", icon: "bell" },
];

export const SETTINGS_ITEM: NavItem = {
  to: "/config",
  label: "Configurações",
  icon: "settings",
};