/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["antd-mobile"]);

const nextConfig = withTM({
  reactStrictMode: true,
  images: {
    domains: ["img.icons8.com", "unsplash.com", "placekitten.com"],
  },
});

module.exports = nextConfig;
