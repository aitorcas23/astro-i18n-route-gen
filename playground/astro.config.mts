import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

const { default: astroi18nRoutes } = await import("astro-i18n-routes");

// https://astro.build/config
export default defineConfig({
	i18n: {
		locales: ["es", "en"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		tailwind(),
		astroi18nRoutes({
			routes: {
				"index.astro": {},
				"about-us.astro": {
					es: "sobre-nosotros.astro",
				},
				folder: {
					es: "carpeta",
				},
			},
		}),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
