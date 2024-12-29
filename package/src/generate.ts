import fs from "node:fs";
import path from "node:path";

interface GenerateOptions {
	locales: string[];
	defaultLocale: string;
	prefixDefaultLocale: boolean;
	pagesPath: string;
	routes: { [key: string]: any };
}

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

function generateLevel(
	locale: string,
	defaultLocalePrefix: string,
	pagesPath: string,
	basePath: string,
	translatedBasePath: string,
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
					path.join(pagesPath, locale, translatedBasePath, name)
				);
			} else if (fsEntity.isDirectory()) {
				fs.mkdirSync(path.join(pagesPath, locale, translatedBasePath, name));
			}

			if (value.children) {
				generateLevel(
					locale,
					defaultLocalePrefix,
					pagesPath,
					path.join(basePath, key),
					path.join(translatedBasePath, name),
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
