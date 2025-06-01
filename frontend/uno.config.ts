import extractorSvelte from "@unocss/extractor-svelte";
import {
  defineConfig,
  presetAttributify,
  presetMini,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetMini(),
    presetWind4(),
    presetAttributify(),
    presetWebFonts({
      provider: "google",
      fonts: {
        "gothic-a1": {
          name: "Gothic A1",
          weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
        },
      },
    }),
    presetTypography(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  extractors: [extractorSvelte()],
  theme: {
    colors: {
      bg: "#FFFFFF",
      text: "#000000",
      subtext: "#666666",
      line: "#E0E0E0",
      hoverbg: "#E0E0E066",
      accent: "#0823a8",
    },
  },
  rules: [
    [
      "hide-scrollbar",
      {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
    ],
  ],
  preflights: [
    {
      getCSS: () => `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
    },
  ],
});
