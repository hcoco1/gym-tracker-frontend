const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*" // Remove duplicate /api
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Use only for temporary fixes
  },
};