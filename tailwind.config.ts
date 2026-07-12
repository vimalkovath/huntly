import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at 50% 0%, rgba(74, 222, 128, 0.14), transparent 45%)",
      },
      boxShadow: {
        glow: "0 0 80px rgba(74, 222, 128, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
