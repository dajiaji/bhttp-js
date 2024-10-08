import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");
await emptyDir("test/runtimes/browsers/node_modules");
await emptyDir("test/runtimes/bun/node_modules");
await emptyDir("test/runtimes/cloudflare/node_modules");
await emptyDir("test/runtimes/fastly/node_modules");
await emptyDir("samples/bun/node_modules");
await emptyDir("samples/cloudflare/node_modules");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: "both",
  test: true,
  declaration: "inline",
  scriptModule: "umd",
  importMap: "./deno.json",
  compilerOptions: {
    target: "ES2022",
    lib: ["ES2023", "DOM"],
  },
  shims: {
    deno: "dev",
  },
  package: {
    name: "bhttp-js",
    version: Deno.args[0],
    description:
      "A BHTTP (Binary Representation of HTTP Messages) Encoder and Decoder",
    repository: {
      type: "git",
      url: "git+https://github.com/dajiaji/bhttp-js.git",
    },
    homepage: "https://github.com/dajiaji/bhttp-js#readme",
    license: "MIT",
    main: "./script/mod.js",
    types: "./types/mod.d.ts",
    exports: {
      ".": {
        "import": "./esm/mod.js",
        "require": "./script/mod.js",
      },
      "./package.json": "./package.json",
    },
    keywords: [
      "bhttp",
      "rfc9292",
    ],
    engines: {
      "node": ">=16.0.0",
    },
    author: "Ajitomi Daisuke",
    bugs: {
      url: "https://github.com/dajiaji/bhttp-js/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
