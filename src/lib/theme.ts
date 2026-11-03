export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  accent: string;
  bgLight: string;
  border: string;
  waxSealColor: string;
  badgeBg: string;
  badgeText: string;
  gradientText: string;
  cardBg: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  champagne: {
    id: "champagne",
    name: "Vàng Champagne Hoàng Gia",
    primary: "#B88E5B",
    primaryHover: "#997343",
    accent: "#D4AF37",
    bgLight: "#FAF7F2",
    border: "#DFC5A8",
    waxSealColor: "radial-gradient(circle at 35% 35%, #f5e08b, #c59b27, #85610d)",
    badgeBg: "#F5EFE6",
    badgeText: "#7A5B33",
    gradientText: "linear-gradient(135deg, #d4af37 0%, #aa771c 100%)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  },
  rose_gold: {
    id: "rose_gold",
    name: "Hồng Pastel & Vàng Hồng",
    primary: "#C67667",
    primaryHover: "#AA5647",
    accent: "#E7BEB5",
    bgLight: "#FDF8F7",
    border: "#F3DDD8",
    waxSealColor: "radial-gradient(circle at 35% 35%, #e8998d, #b85a49, #7a2f22)",
    badgeBg: "#F9EEEC",
    badgeText: "#8B4134",
    gradientText: "linear-gradient(135deg, #d8998d 0%, #aa5647 100%)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  },
  sage_green: {
    id: "sage_green",
    name: "Xanh Xô Thơm Tinh Tế",
    primary: "#5F7856",
    primaryHover: "#495D43",
    accent: "#9AB291",
    bgLight: "#F6F8F5",
    border: "#D9E3D4",
    waxSealColor: "radial-gradient(circle at 35% 35%, #8ba882, #516d48, #2d4226)",
    badgeBg: "#EDF2EA",
    badgeText: "#495D43",
    gradientText: "linear-gradient(135deg, #79966f 0%, #495d43 100%)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  },
  burgundy: {
    id: "burgundy",
    name: "Đỏ Rượu Vang Quý Tộc",
    primary: "#802C3C",
    primaryHover: "#64202E",
    accent: "#BC6D7C",
    bgLight: "#FAF4F5",
    border: "#E9CDD2",
    waxSealColor: "radial-gradient(circle at 35% 35%, #b23b3b, #7f1d1d, #4d0f0f)",
    badgeBg: "#F4E5E7",
    badgeText: "#64202E",
    gradientText: "linear-gradient(135deg, #b23b3b 0%, #64202e 100%)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  },
  dusty_blue: {
    id: "dusty_blue",
    name: "Xanh Khói & Ngọc Trai",
    primary: "#5A738E",
    primaryHover: "#42566D",
    accent: "#9FB3C8",
    bgLight: "#F4F7FA",
    border: "#D3DDE6",
    waxSealColor: "radial-gradient(circle at 35% 35%, #7e9bb9, #4a6686, #283e58)",
    badgeBg: "#E8EEF4",
    badgeText: "#3C4F65",
    gradientText: "linear-gradient(135deg, #5a738e 0%, #2f445c 100%)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  },
};

export function getTheme(themeId: string = "champagne"): ThemeConfig {
  return THEMES[themeId] || THEMES.champagne;
}
