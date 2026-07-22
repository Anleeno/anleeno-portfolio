const fs = require("fs");
const path = require("path");

const buildDirectory = path.resolve(__dirname, "../build");
const indexFile = path.join(buildDirectory, "index.html");
const fallbackFile = path.join(buildDirectory, "404.html");

if (!fs.existsSync(indexFile)) {
  throw new Error("Cannot create the SPA fallback because build/index.html does not exist.");
}

fs.copyFileSync(indexFile, fallbackFile);
console.log("Created build/404.html for direct React Router URLs.");
