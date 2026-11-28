/** @type {import("next").NextConfig} */
// On GitHub Pages the site lives at /Wimsical-music/, so the publish workflow sets
// PAGES_BASE_PATH. Locally it's empty and the site runs at the root as usual.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  output: "export", // build plain HTML/CSS/JS files that GitHub Pages can serve
  basePath,
  trailingSlash: true,
};

export default nextConfig;
