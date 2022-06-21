/** @type {import('next').NextConfig} */
const semi = require("@douyinfe/semi-next").default({
  /* the extension options */
});

const nextConfig = semi({
  reactStrictMode: false,
  images: {
    domains: ["img.icons8.com", "unsplash.com", "placekitten.com"],
  },
});

module.exports = nextConfig;
