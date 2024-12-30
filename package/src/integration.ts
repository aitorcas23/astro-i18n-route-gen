import { defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import { generate } from "./generate.ts";

export const astroI18nRouteGen = defineIntegration({
	name: "astro-i18n-route-gen",
	optionsSchema: z
		.object({
			enabled: z.boolean().optional().default(true),
			pagesPath: z.string().optional().default("./src/pages"),
			routes: z.record(z.string(), z.any()).optional().default({}),
		})
		.optional(),
	setup({ options }) {
		return {
			hooks: {
				"astro:config:setup": ({ config }) => {
					if (!options) {
						console.info(
							"\x1b[34m[astro-i18n-route-gen]\x1b[0m No options passed, route generation will be skipped"
						);
						return;
					}
					if (!options.enabled) {
						console.info(
							"\x1b[34m[astro-i18n-route-gen]\x1b[0m Route generator is disabled, route generation will be skipped"
						);
						return;
					}
					if (config.i18n) {
						if (config.i18n.routing == "manual") {
							console.warn(
								'\x1b[34m[astro-i18n-route-gen]\x1b[0m \x1b[93m"manual" routing not supported, routes will be treated as if "prefixDefaultLocale = false"\x1b[0m'
							);
						}
						const locales = config.i18n.locales.map((locale) =>
							typeof locale === "string" ? locale : locale.path
						);
						console.info(
							"\x1b[34m[astro-i18n-route-gen]\x1b[0m Generating localized routes..."
						);
						generate({
							locales: locales,
							defaultLocale: config.i18n.defaultLocale,
							prefixDefaultLocale:
								config.i18n.routing == "manual"
									? false
									: config.i18n.routing.prefixDefaultLocale,
							pagesPath: options.pagesPath,
							routes: options.routes,
						});
					} else {
						console.warn(
							"\x1b[34m[astro-i18n-route-gen]\x1b[0m \x1b[93mAstro i18n settings must be included for astro-i18n-route-gen to work\x1b[0m"
						);
					}
				},
			},
		};
	},
});
