import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: {
  bg: "#080B14", bg2: "#0D111C", card: "#111827", elevated: "#151B2A", brand: "#6366F1", brand2: "#7C3AED", hi: "#818CF8",
  ink: "#F8FAFC", ink2: "#94A3B8", mute: "#64748B", line: "#1E293B" } } }, plugins: [] } satisfies Config;
