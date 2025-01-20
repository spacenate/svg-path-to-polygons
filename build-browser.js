import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    format: "esm",
    outfile: "./dist/esm-bundled/index.js",
    sourcemap: true,
    target: ["es2018"],
  })
  .then(() => {
    console.log(`Bundled build for ESM completed.`);
  })
  .catch(() => {
    console.error(`Bundled build for ESM failed.`);
    process.exit(1);
  });
