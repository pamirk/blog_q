/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cms.qz.com'],
    loader: "imgix",
    path: "",
  },
}

module.exports = nextConfig
