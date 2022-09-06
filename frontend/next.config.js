/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'ipfs.io',
            'lens.infura-ipfs.io',
            'statics-mumbai-lens-staging.s3.eu-west-1.amazonaws.com',
            'avatar.tobi.sh',
        ],
    },
}

module.exports = nextConfig
