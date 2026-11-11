
import { SvgXml } from "react-native-svg";
import { theme } from "@/styles/theme";

// Caminhos SVG dos ícones
const PATHS = {
  machine: `<rect x="2.5" y="8" width="9" height="9"/><path d="M11.5 11.5H17L20.5 15v4H11.5"/><circle cx="7" cy="19" r="1.7"/><circle cx="16.5" cy="19" r="1.7"/>`,
  chevron: `<polyline points="9 6 15 12 9 18"/>`,
  chevronDown: `<polyline points="6 9 12 15 18 9"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>`,
  thermometer: `<path d="M12 3a2 2 0 00-2 2v9.5a4 4 0 102.5.7"/><path d="M12 3v11"/>`,
  pulse: `<path d="M2 12h4l2-7 4 14 2-7h8"/>`,
  doc: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
  warning: `<path d="M10.3 3.6L2.6 17a1.7 1.7 0 001.5 2.6h15.8a1.7 1.7 0 001.5-2.6L13.7 3.6a1.7 1.7 0 00-3.4 0z"/><line x1="12" y1="9.5" x2="12" y2="13.5"/><circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none"/>`,
  critical: `<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none"/>`,
  resolved: `<circle cx="12" cy="12" r="9"/><polyline points="8 12.5 10.7 15 16 9"/>`,
  info: `<circle cx="12" cy="12" r="9"/><line x1="12" y1="10.5" x2="12" y2="16"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>`,
  bell: `<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>`,
  menu: `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>`,
  close: `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  oil: `<path d="M12 2v6M12 22a5 5 0 003-9V4"/>`,
  filter: `<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>`,
  home: `<path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v9.5a1 1 0 001 1h12a1 1 0 001-1V10"/>`,
  dashboard: `<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/>`,
  reports: `<line x1="6" y1="20" x2="6" y2="11"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="15"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 01-4 0v-.09a1.7 1.7 0 00-1-1.56 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 010-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 014 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.55 1H21a2 2 0 010 4h-.09a1.7 1.7 0 00-1.55 1z"/>`,
  logout: `<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
} as const;

// Exporta os nomes permitidos para outros componentes
export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({
  name,
  size = 18,
  color = theme.colors.text,
}: IconProps) {
  const inner = PATHS[name];

  const xml = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="${size}"
      height="${size}"
      fill="none"
      stroke="${color}"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${inner.replace(/currentColor/g, color)}
    </svg>
  `;

  return (
    <SvgXml
      xml={xml}
      width={size}
      height={size}
    />
  );
}
