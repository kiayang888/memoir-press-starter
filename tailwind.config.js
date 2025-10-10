/** @type {import('tailwindcss').Config} */
const typography = require("@tailwindcss/typography");

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {},
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      /* ✨ Add font families for serif/sans */
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },

      /* ✨ Extend typography plugin with “memoir” variant */
      typography: ({ theme }) => ({
        memoir: {
          css: {
            p: {
              fontFamily: theme("fontFamily.serif").join(","),
              fontSize: theme("fontSize.lg")[0],
              lineHeight: "2rem",
              color: theme("colors.neutral.900"),
            },
            blockquote: {
              fontFamily: theme("fontFamily.serif").join(","),
              fontStyle: "italic",
              textAlign: "center",
              color: theme("colors.neutral.700"),
              borderLeftWidth: "0",
              marginTop: theme("spacing.8"),
              marginBottom: theme("spacing.8"),
              paddingLeft: "0",
            },
            // remove “smart quotes”
            'blockquote p:first-of-type::before': { content: "none" },
            'blockquote p:last-of-type::after': { content: "none" },
            // subtle divider above/below quote
            'blockquote::before': {
              content: '""',
              display: "block",
              height: "1px",
              backgroundColor: theme("colors.neutral.200"),
              marginBottom: theme("spacing.4"),
              opacity: "0.8",
            },
            'blockquote::after': {
              content: '""',
              display: "block",
              height: "1px",
              backgroundColor: theme("colors.neutral.200"),
              marginTop: theme("spacing.4"),
              opacity: "0.8",
            },
          },
        },
      }),
    },
  },
  /* ✨ Add the typography plugin alongside your existing one */
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],

};


