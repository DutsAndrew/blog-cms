/** @type {import('next').NextConfig} */

const dotenv =require('dotenv');
dotenv.config();

const nextConfig = {
  env: {
    tinyMCE: process.env.tinyMCE,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig;