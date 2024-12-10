/** @type {import('next').NextConfig} */
const nextConfig = {
  module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["https://document-ucdb.onrender.com"],
        formats: ["image/webp"],
    },
};
};

export default nextConfig;
