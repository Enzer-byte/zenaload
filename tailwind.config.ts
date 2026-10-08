import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme colors aligned to Google Stitch Design System (Project: 7806182609715884332)
        bg: "#0A1236", // Stitch deep cosmic brand navy
        bg2: "#11193C", // Stitch on-background / container navy
        card: "#151D4A", // Stitch elevated dark card
        elevated: "#1A2454", // Stitch elevated layer
        brand: "#2D5BFF", // Stitch primary electric blue
        brand2: "#5A4BFF", // Stitch tertiary violet
        hi: "#0BC5FF", // Stitch secondary cyan accent
        ink: "#FBF8FF", // Stitch bright surface text
        ink2: "#C4C5D9", // Stitch outline-variant muted text
        mute: "#747688", // Stitch outline text
        line: "#233062", // Stitch hairline structural border

        // Exact Google Stitch Design System Colors
        "surface-container-lowest": "#ffffff",
        "on-background": "#11193c",
        "on-tertiary-fixed-variant": "#330edd",
        "surface-container-high": "#e5e6ff",
        "on-tertiary": "#ffffff",
        "on-surface": "#11193c",
        "error-container": "#ffdad6",
        "on-secondary-fixed": "#001e2b",
        "inverse-on-surface": "#f0efff",
        "on-primary-container": "#efefff",
        "tertiary-fixed-dim": "#c4c0ff",
        "surface-tint": "#104af0",
        "surface-container-low": "#f3f2ff",
        "surface-variant": "#dee1ff",
        "tertiary-container": "#5e50ff",
        "secondary-fixed-dim": "#70d2ff",
        "surface-bright": "#fbf8ff",
        "on-tertiary-fixed": "#110068",
        "primary-fixed-dim": "#b8c3ff",
        "primary-container": "#2d5bff",
        "inverse-surface": "#272e53",
        "surface-container-highest": "#dee1ff",
        "primary-fixed": "#dde1ff",
        background: "#fbf8ff",
        "outline-variant": "#c4c5d9",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#e3dfff",
        "on-primary": "#ffffff",
        "on-primary-fixed-variant": "#0035bd",
        "on-secondary-fixed-variant": "#004d66",
        "surface-dim": "#d3d8ff",
        error: "#ba1a1a",
        tertiary: "#432dea",
        secondary: "#006686",
        "on-primary-fixed": "#001355",
        outline: "#747688",
        surface: "#fbf8ff",
        "on-error": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary-container": "#f2eeff",
        "inverse-primary": "#b8c3ff",
        "on-surface-variant": "#434656",
        "surface-container": "#ececff",
        "secondary-container": "#05c4fe",
        primary: "#0040df",
        "on-secondary-container": "#004d66",
        "secondary-fixed": "#c0e8ff",
      },
      fontFamily: {
        stitch: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.125rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
