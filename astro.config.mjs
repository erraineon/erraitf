// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import cloudflare from "@astrojs/cloudflare";
import { execSync } from "child_process";

// https://astro.build/config
export default defineConfig({
  site: "https://errai.tf",
  integrations: [mdx(), sitemap(), icon()],
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Sohne",
      cssVariable: "--font-sohne",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/sohne/Sohne-Extraleicht.woff2"],
            weight: "200",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-ExtraleichtKursiv.woff2"],
            weight: "200",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Leicht.woff2"],
            weight: "300",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-LeichtKursiv.woff2"],
            weight: "300",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Buch.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-BuchKursiv.woff2"],
            weight: "400",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Kraftig.woff2"],
            weight: "500",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-KraftigKursiv.woff2"],
            weight: "500",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Halbfett.woff2"],
            weight: "600",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-HalbfettKursiv.woff2"],
            weight: "600",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Dreiviertelfett.woff2"],
            weight: "700",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-DreiviertelfettKursiv.woff2"],
            weight: "700",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Fett.woff2"],
            weight: "800",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-FettKursiv.woff2"],
            weight: "800",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Extrafett.woff2"],
            weight: "900",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-ExtrafettKursiv.woff2"],
            weight: "900",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Condensed-Regular.woff2"],
            weight: "400",
            stretch: "condensed",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Condensed-Bold.woff2"],
            weight: "700",
            stretch: "condensed",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Sohne Mono",
      cssVariable: "--font-sohne-mono",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/sohne/Sohne-Mono-Buch.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/sohne/Sohne-Mono-Halbfett.woff2"],
            weight: "600",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Tiempos Fine Web",
      cssVariable: "--font-tiempos-fine",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-light.woff2"],
            weight: "300",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposfineweb-lightitalic.woff2",
            ],
            weight: "300",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-regular.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposfineweb-regularitalic.woff2",
            ],
            weight: "400",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-medium.woff2"],
            weight: "500",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposfineweb-mediumitalic.woff2",
            ],
            weight: "500",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-semibold.woff2"],
            weight: "600",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposfineweb-semibolditalic.woff2",
            ],
            weight: "600",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-bold.woff2"],
            weight: "700",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-bolditalic.woff2"],
            weight: "700",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposfineweb-black.woff2"],
            weight: "900",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposfineweb-blackitalic.woff2",
            ],
            weight: "900",
            style: "italic",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Tiempos Headline Web",
      cssVariable: "--font-tiempos-headline",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/tiempos/tiemposheadlineweb-light.woff2"],
            weight: "300",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-lightitalic.woff2",
            ],
            weight: "300",
            style: "italic",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-regular.woff2",
            ],
            weight: "400",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-regularitalic.woff2",
            ],
            weight: "400",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposheadlineweb-medium.woff2"],
            weight: "500",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-mediumitalic.woff2",
            ],
            weight: "500",
            style: "italic",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-semibold.woff2",
            ],
            weight: "600",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-semibolditalic.woff2",
            ],
            weight: "600",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposheadlineweb-bold.woff2"],
            weight: "700",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-bolditalic.woff2",
            ],
            weight: "700",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiemposheadlineweb-black.woff2"],
            weight: "900",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiemposheadlineweb-blackitalic.woff2",
            ],
            weight: "900",
            style: "italic",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Tiempos Text Web",
      cssVariable: "--font-tiempos-text",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/tiempos/tiempostextweb-regular.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiempostextweb-regularitalic.woff2",
            ],
            weight: "400",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiempostextweb-medium.woff2"],
            weight: "500",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiempostextweb-mediumitalic.woff2",
            ],
            weight: "500",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiempostextweb-semibold.woff2"],
            weight: "600",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/tiempos/tiempostextweb-semibolditalic.woff2",
            ],
            weight: "600",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiempostextweb-bold.woff2"],
            weight: "700",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/tiempos/tiempostextweb-bolditalic.woff2"],
            weight: "700",
            style: "italic",
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.GIT_COMMIT_HASH": JSON.stringify(
        execSync("git rev-parse --short HEAD").toString().trim(),
      ),
      "import.meta.env.GIT_COMMIT_DATE": JSON.stringify(
        new Date(
          Number(execSync("git log -1 --format=%ct").toString().trim()) * 1000,
        ).toISOString(),
      ),
    },
  },
});
