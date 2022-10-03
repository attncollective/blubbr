import { create } from 'ipfs-http-client'

const projectId = '2F5f4anwBoOWaJLSZqzIMtpUjZm'
const secret = 'caeef00dfc258ead87d3ec993c6136f9'

if (!projectId || !secret) {
    throw new Error('Must define INFURA_PROJECT_ID and INFURA_SECRET in the .env.local to run this')
}

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(`${projectId}:${secret}`, 'utf-8').toString('base64')}`,
    },
})

export const uploadIpfsJson = async (data) => {
    const result = await client.add(JSON.stringify(data))

    console.log('upload result ipfs', result)
    return result
}

export const uploadIpfsBuffer = async (data) => {
    const result = await client.add(Buffer.from(data))

    console.log('upload result ipfs', result)
    return result
}
