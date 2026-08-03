import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
