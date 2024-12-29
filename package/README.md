# `Astro i18n Routes`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that clones the pages routes for internationalization.
Astro 4 supports i18n routes.
For that, in the [documentation](https://docs.astro.build/en/guides/internationalization/#create-localized-folders) it's mentioned that you need to create individual `/[locale]/` folders in your pages.
In big projects, maintaining multiple duplicated pages can be tedious.
This project takes care of creating those `/[locale]/` folders by duplicating the pages routes for each existing locale.

> [!IMPORTANT]
> This integration does not manage translations, only clones the pages routes.
> Use packages like [paraglide](https://inlang.com/m/iljlwzfs/paraglide-astro-i18n) for managing translations.

## Usage

The localized routes are automatically generated when executing an astro command like `astro dev` or `astro build`.
It is recommended to add the localized paths to the .gitignore file so you don't have unnecessary duplicated code on your repository.
```gitignore
src/pages/es
```

### Prerequisites

Astro version 4.0.0 or higher is required, the version where i18n routing was introduced.
It is also required to configure the i18n settings in the astro configuration file.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-i18n-routes
```

```bash
npx astro add astro-i18n-routes
```

```bash
yarn astro add astro-i18n-routes
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-i18n-routes
```

```bash
npm install astro-i18n-routes
```

```bash
yarn add astro-i18n-routes
```

2. Add the integration to your astro config

```diff
+import astroI18nRoutes from "astro-i18n-routes";

export default defineConfig({
  integrations: [
+    astroI18nRoutes(),
  ],
});
```

### Configuration

The configuration contains this options, all of them being optional:
- enabled: boolean. Determines if enable or disable route generation. Defaults to `true`.
- pagesPath: string. The path to the astro pages. Defaults to `"./src/pages"`.
- routes: object. The object which determines the file structure and the route translations.
This object follows this structure:
```
{
    "file-name": {
        "[locale]": "translation" // optional
    },
    "folder-name": {
        "[locale]": "translation", // optional
        children: { // optional
            "file-name": {
                "[locale]": "translation" // optional
            },
            "folder-name": {
                "[locale]": "translation", // optional
                children: {
                    ...
                }
            }
        }
    }
}
```

For example:
```
{
    "index.astro": {},
    "about-us.astro": {
        es: "sobre-nosotros.astro"
    },
    "news": {
        es: noticias,
        children: {
            "news1.astro": {
                es: "noticia1.astro"
            },
            "news2.astro": {
                es: "noticia2.astro"
            }
        }
    }
}
```
The object start with the file and folder names.
This then have inside an optional children key, in the case of a folder, and an optional key for each locale with the translated name.
The children has the contents of the folder inside repeating the same structure.

If a file or folder is not included it will not be translated.
This is useful in the case of the `404.astro` file.

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm:

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/TODO:/blob/main/LICENSE). Made with ❤️ by [aitorcas23](https://github.com/aitorcas23).

## Acknowledgements

- [`astro-integration-kit`](https://github.com/florian-lefebvre/astro-integration-kit) by Florian
