import fs from "node:fs";
import path from "node:path";

interface GenerateOptions {
	locales: string[];
	defaultLocale: string;
	prefixDefaultLocale: boolean;
	pagesPath: string;
	routes: { [key: string]: any };
}

/**
 * Generate the localized routes based on the integration config from `astro.config.mjs` or `mts`
 *
 * @param {GenerateOptions} options - Options to pass to the `generate` function.
 */
export function generate(options: GenerateOptions) {
	const { locales, defaultLocale, pagesPath, routes, prefixDefaultLocale } =
		options;
	if (!routes) {
		console.info(
			"\x1b[34m[astro-i18n-routes]\x1b[0m No routes passed, route generation step will be ignored"
		);
	}

	for (const locale of locales) {
		if (locale === defaultLocale) continue;
		fs.rmSync(`${pagesPath}/${locale}`, {
			force: true,
			recursive: true,
		});
		fs.mkdirSync(`${pagesPath}/${locale}`);
		const defaultLocalePrefix = prefixDefaultLocale ? defaultLocale : "";
		generateLevel(locale, defaultLocalePrefix, pagesPath, "", "", routes);
	}
}

/**
 * Generate a route level, meaning the contents of a directory.
 * The first iteration is executed in the root directory.
 * This levels are generated recursively.
 *
 * @param {string} locale - Locale of this iteration, for example `"es"`.
 * @param {string} defaultLocalePrefix - The default locale of the Astro project.
 * @param {string} pagesPath - The path to the pages directory of your Astro project.
 * @param {string} basePath - The previous generated path. For example, if generating `"/news/news1.astro"`, `basePath` will be `"/news"`.
 * @param {string} localizedBasePath - The previous generated localized path. For example, if generating `"/news/news1.astro"`, `localizedBasePath` will be `"/noticias"`.
 * @param {{[key:string]: any}} routes - The route tree to be generated.
 */
function generateLevel(
	locale: string,
	defaultLocalePrefix: string,
	pagesPath: string,
	basePath: string,
	localizedBasePath: string,
	routes: { [key: string]: any }
) {
	for (const key in routes) {
		const value = routes[key];
		if (!value) continue;

		const name = value[locale] ?? key;

		try {
			const fsEntity = fs.lstatSync(
				path.join(pagesPath, defaultLocalePrefix, basePath, key)
			);
			if (fsEntity.isFile()) {
				fs.copyFileSync(
					path.join(pagesPath, defaultLocalePrefix, basePath, key),
					path.join(pagesPath, locale, localizedBasePath, name)
				);
			} else if (fsEntity.isDirectory()) {
				fs.mkdirSync(path.join(pagesPath, locale, localizedBasePath, name));
			}

			if (value.children) {
				generateLevel(
					locale,
					defaultLocalePrefix,
					pagesPath,
					path.join(basePath, key),
					path.join(localizedBasePath, name),
					value.children
				);
			}
		} catch (error) {
			console.warn(
				"\x1b[34m[astro-i18n-routes]\x1b[0m \x1b[93m" + error + "\x1b[0m"
			);
			continue;
		}
	}
}
