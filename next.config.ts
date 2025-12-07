import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images:{
        remotePatterns: [
            {
                hostname: "onlystudents-lms-application.t3.storage.dev",
                port: '',
                protocol: 'https',
            },
        ],
    },
};

export default nextConfig;
