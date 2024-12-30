# `Astro i18n Route Gen`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that automatically generates localized pages routes for astro i18n.

Astro 4 supports i18n routes.
For that, in the [documentation](https://docs.astro.build/en/guides/internationalization/#create-localized-folders) it's mentioned that you need to create individual `/[locale]/` folders in your pages.
In big projects, maintaining multiple duplicated pages can be tedious.
This project takes care of creating those `/[locale]/` folders by duplicating the pages routes for each existing locale.

> [!IMPORTANT]
> This integration does not manage content translations, only clones the pages routes.
> Use packages like [paraglide](https://inlang.com/m/iljlwzfs/paraglide-astro-i18n) for managing translations.

## Usage

The localized routes are automatically generated when executing an astro command like `astro dev` or `astro build`.
To disable this set `enabled` to `false` in the integration settings.

It is recommended to add the localized paths to the **.gitignore** file so you don't have unnecessary duplicated code on your repository.
```gitignore
src/pages/es
```

> [!WARNING]
> Do not use relative import like `import Component from "../components/Component.astro"`.
> Use tsconfig `compilerOptions` `paths` to define static paths ([docs](https://www.typescriptlang.org/tsconfig/#paths)).

> [!NOTE]
> If you want to manually edit localized pages then it is better to not use this integration.

### Prerequisites

This integration should work with Astro 4.0.0, but version 5.0.0 or higher is recommended.
It is also required to configure the i18n settings in the astro configuration file.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-i18n-route-gen
```

```bash
npx astro add astro-i18n-route-gen
```

```bash
yarn astro add astro-i18n-route-gen
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-i18n-route-gen
```

```bash
npm install astro-i18n-route-gen
```

```bash
yarn add astro-i18n-rout-gen
```

2. Add the integration to your astro config

```diff
+import astroI18nRouteGen from "astro-i18n-route-gen";

export default defineConfig({
  integrations: [
+    astroI18nRouteGen(),
  ],
});
```

### Configuration

The configuration contains this options, all of them being optional:
- **enabled**: boolean. Determines if enable or disable route generation. Defaults to `true`.
- **pagesPath**: string. The path to the astro pages. Defaults to `"./src/pages"`.
- **routes**: object. The object which determines the file structure and the route translations.
This object follows this structure:
```
{
    "file-name": {
        "[locale]": "translation" // optional | for each locale in the project
    },
    "folder-name": {
        "[locale]": "translation", // optional | for each locale in the project
        children: { // optional | only if directory
            "file-name": {
                "[locale]": "translation" // optional | for each locale in the project
            },
            "folder-name": {
                "[locale]": "translation", // optional | for each locale in the project
                children: { // optional | only if directory
                    ...
                }
            }
        }
    }
}
```

For example:
```javascript
{
    "index.astro": {},
    "about-us.astro": {
        es: "sobre-nosotros.astro"
    },
    "news": {
        es: "noticias",
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
This objects have an optional key for each locale in the project besides the default locale.
If a locale is not included the existing file name will be used for the localized file name.
In the case of a folder, there is an optional `children` key.
The children has the contents of the folder inside repeating the same structure.

If a file or folder is not included in the routes it will not be localized.
This is useful in the case of the `404.astro` file.

This lets us with this **example configuration**:

```javascript
export default defineConfig({
    i18n: {
        locales: ["es", "en"],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false,
        },
    },
    integrations: [
        astroi18nRoutes({
            enabled: true, // optional, default to true
            pagesPath: "./src/pages", // optional, defaults to "./src/pages"
            routes: {
                "index.astro": {},
                "about-us.astro": {
                    es: "sobre-nosotros.astro",
                },
                news: {
                    es: "noticias",
                    children: {
                        "news1.astro": {
                            es: "noticia1.astro",
                        },
                        "news2.astro": {
                            es: "noticia2.astro",
                        },
                    },
                },
            },
        }),
    ]
})
```

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

[MIT Licensed](https://github.com/aitorcas23/astro-i18n-route-gen/blob/main/LICENSE). Made by [aitorcas23](https://github.com/aitorcas23).

## Acknowledgements

- [`astro-integration-kit`](https://github.com/florian-lefebvre/astro-integration-kit) by Florian
