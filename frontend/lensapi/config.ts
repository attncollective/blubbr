require('dotenv').config()

export const argsBespokeInit = () => {
    return process.argv.find((c) => c === '--init') !== undefined
}

export const PK = process.env.PRIVATE_KEY

export const MUMBAI_RPC_URL = 'https://rpc-mumbai.matic.today'

export const LENS_API = 'https://api-mumbai.lens.dev/'

export const LENS_HUB_CONTRACT = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'

export const LENS_PERIPHERY_CONTRACT = '0xD5037d72877808cdE7F669563e9389930AF404E8'

export const LENS_PERIPHERY_NAME = 'LensPeriphery'

export const PROFILE_ID = '0x46cd'

export const LENS_FOLLOW_NFT_ABI = JSON.parse('./abis/lens-follow-nft-contract-abi.json')

export const LENS_HUB_ABI = JSON.parse('./abis/lens-hub-contract-abi.json')

export const LENS_PERIPHERY_ABI = JSON.parse('./abis/lens-periphery-data-provider.json')

export const INFURA_PROJECT_ID = '2F5f4anwBoOWaJLSZqzIMtpUjZm'

export const INFURA_SECRET = 'caeef00dfc258ead87d3ec993c6136f9'
