/** @type {import('next').NextConfig} */
const nextConfig = {
 allowedDevOrigins: [
    "10.31.140.85", // 匹配你当前10.31.140.85整个网段
    "10.131.217.85",
    "10.84.132.85",
    "localhost",
  ],
};
export default nextConfig;