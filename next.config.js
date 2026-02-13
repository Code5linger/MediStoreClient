// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**',
//       },
//     ],
//   },

//   // !---V14---------------------------
//   // async rewrites() {
//   //   return [
//   //     {
//   //       source: '/api/auth/:path*',
//   //       // destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path`,
//   //       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`,
//   //     },
//   //   ];
//   // },
//   // !---V2--------------------------
//   async rewrites() {
//     return [
//       {
//         source: '/api/auth/:path*',
//         destination: 'https://medi-store-server-rho.vercel.app/api/auth/:path*',
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'https://medi-store-server-rho.vercel.app/api/auth/:path*',
      },
      {
        source: '/api/:path*', // ← Catches /api/categories, /api/medicine, etc.
        destination: 'https://medi-store-server-rho.vercel.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
