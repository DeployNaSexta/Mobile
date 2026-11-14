import type { IconName } from "@/components/icons/Icon";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/Home", label: "Início", icon: "home" },
  { to: "/Dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/Reports", label: "Relatórios", icon: "reports" },
  { to: "/Alerts", label: "Alertas", icon: "bell" },
];

export const SETTINGS_ITEM: NavItem = {
  to: "/config",
  label: "Configurações",
  icon: "settings",
};