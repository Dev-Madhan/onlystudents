import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Gzip compression for smaller payloads
    compress: true,

    // Remove X-Powered-By header (security + lighter responses)
    poweredByHeader: false,

    // Client-side router cache: re-use pages visited within these windows
    // instead of re-fetching every single navigation.
    experimental: {
        staleTimes: {
            dynamic: 30,   // Cache dynamic pages for 30 seconds
            static: 300,   // Cache static pages for 5 minutes
        },
    },
    images:{
        remotePatterns: [
            {
                hostname: "onlystudents-lms-application.t3.storage.dev",
                port: '',
                protocol: 'https',
            },
            {
                // Presigned URLs go through the base t3.storage.dev domain
                hostname: "*.t3.storage.dev",
                port: '',
                protocol: 'https',
            },
        ],
    },

    // Security & performance headers
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
