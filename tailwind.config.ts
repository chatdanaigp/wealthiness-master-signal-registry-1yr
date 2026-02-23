import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                wealth: {
                    DEFAULT: "#2563EB", // Royal Blue
                    light: "#60A5FA",   // Lighter Blue
                    dark: "#1E40AF",    // Darker Blue
                },
                discord: {
                    DEFAULT: "#5865F2",
                    hover: "#4752C4",
                },
                green: {
                    DEFAULT: "#22C55E",
                    light: "#4ADE80",
                },
                background: "#0A0A0A",
                foreground: "#FFFFFF",
                dark: {
                    DEFAULT: "#0A0A0A",
                    secondary: "#111111",
                    tertiary: "#1a1a1a",
                    card: "#111111",
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: "#9CA3AF",
                },
            },

            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            backgroundImage: {
                "wealth-gradient": "linear-gradient(135deg, #2563EB 0%, #60A5FA 50%, #2563EB 100%)",
                "dark-gradient": "radial-gradient(ellipse at center, #1a1a1a 0%, #000000 70%)",
            },
            boxShadow: {
                "wealth": "0 0 20px rgba(37, 99, 235, 0.3)",
                "wealth-lg": "0 0 40px rgba(37, 99, 235, 0.4)",
                "wealth-glow": "0 0 60px rgba(96, 165, 250, 0.2)",
            },
            animation: {
                "shimmer": "shimmer 2s linear infinite",
                "pulse-wealth": "pulse-wealth 2s ease-in-out infinite",
                "fadeIn": "fadeIn 0.3s ease-out",
                "float": "float 3s ease-in-out infinite",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "pulse-wealth": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(37, 99, 235, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(96, 165, 250, 0.5)" },
                },
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
