import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");
await emptyDir("samples/bun/node_modules");
await emptyDir("samples/cloudflare/node_modules");
try {
  await Deno.remove("test/runtimes/browsers/node_modules", {
    recursive: true,
  });
} catch {
  // ignore
}
try {
  await Deno.remove("test/runtimes/bun/node_modules", {
    recursive: true,
  });
} catch {
  // ignore
}
try {
  await Deno.remove("test/runtimes/cloudflare/node_modules", {
    recursive: true,
  });
} catch {
  // ignore
}
try {
  await Deno.remove("test/runtimes/fastly/node_modules", {
    recursive: true,
  });
} catch {
  // ignore
}

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: "both",
  test: true,
  declaration: "inline",
  scriptModule: "umd",
  importMap: "./deno.json",
  compilerOptions: {
    lib: ["ES2022", "DOM"],
  },
  shims: {
    deno: "dev",
  },
  testPattern: "test/**/*.test.ts",
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
    module: "./esm/mod.js",
    main: "./script/mod.js",
    types: "./esm/mod.d.ts",
    sideEffects: false,
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
