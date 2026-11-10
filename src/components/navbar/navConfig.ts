
import {
  Home,
  Gauge,
  Cog,
  FileText,
  Bell,
  Settings,
} from "lucide-react-native";

export const NAV_ITEMS = [
  { name: "index", label: "Início", icon: Home },
  { name: "Dashboard/index", label: "Dashboard", icon: Gauge },
  { name: "Machine/index", label: "Máquinas", icon: Cog },
  { name: "Reports/index", label: "Relatórios", icon: FileText },
  { name: "Alerts/index", label: "Alertas", icon: Bell },
  { name: "Settings/index", label: "Ajustes", icon: Settings },
];
