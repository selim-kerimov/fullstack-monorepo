/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: "/trpc/:path*",
      destination: `${process.env.TRPC_URL}/:path*`,
    },
  ],
};

export default nextConfig;
