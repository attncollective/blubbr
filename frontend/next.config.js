/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'ipfs.io',
            'lens.infura-ipfs.io',
            'flowbite.com', // testing pourpuse
        ],
    },
}

module.exports = nextConfig
