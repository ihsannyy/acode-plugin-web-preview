import * as esbuild from "esbuild-wasm";
import { execFile } from "node:child_process";
import os from "node:os";

function serveUrls(hosts, port) {
  const names = new Set(
    (hosts?.length ? hosts : ["127.0.0.1"]).flatMap((host) => {
      if (host === "0.0.0.0" || host === "::") return ["127.0.0.1"];
      return [host.includes(":") ? `[${host}]` : host];
    }),
  );

  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.internal || net.family !== "IPv4") continue;
      names.add(net.address);
    }
  }

  return [...names].map((host) => `http://${host}:${port}`);
}

const isServe = process.argv.includes("--serve");

function packZip() {
  execFile(process.execPath, ["./pack-zip.js"], (err, stdout) => {
    if (err) {
      console.error("Error packing zip:", err);
      return;
    }
    console.log(stdout.trim());
  });
}

const zipPlugin = {
  name: "zip-plugin",
  setup(build) {
    build.onEnd(() => {
      packZip();
    });
  },
};

const buildConfig = {
  entryPoints: {
    main: "src/main.ts",
  },
  bundle: true,
  minify: true,
  platform: "browser",
  target: ["chrome90"],
  format: "iife",
  logLevel: "info",
  color: true,
  outdir: "dist",
  plugins: [zipPlugin],
};

(async function () {
  if (isServe) {
    console.log("Starting development server...");

    const ctx = await esbuild.context(buildConfig);
    await ctx.watch();
    const { hosts, port } = await ctx.serve({
      servedir: ".",
      port: 3000,
    });
    for (const url of serveUrls(hosts, port)) {
      console.log(`Development server: ${url}`);
    }
  } else {
    console.log("Building for production...");
    await esbuild.build(buildConfig);
    console.log("Production build complete.");
  }
})();
