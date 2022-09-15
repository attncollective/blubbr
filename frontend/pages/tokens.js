import { ethers } from 'ethers'


export default function Tokens({ data }) {
    return (
        <div className="w-full mt-40 ml-24 md:ml-64 xl:ml-80 mb-16">
            <ul className="max-w-[50%] divide-y divide-gray-200 dark:divide-gray-700">
                <h1>Tokens</h1>
                {data &&
                    data.map((token) => (
                        <div key={token.address}>
                            <li className="pb-3 sm:pb-4">
                                <div className="grid grid-cols-2 flex items-center space-x-4">
                                    <div clasName="flex-shrink-0">
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=023"
                                            alt="Neil image"
                                        />
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        {ethers.utils.formatEther(token.amount)}
                                    </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {token.name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {token.symbol}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </div>
                    ))}
            </ul>
        </div>
    )
}

export async function getServerSideProps(context) {
    const ethers = require('ethers')
    const fs = require('fs')
    const sdk = require('api')('@module/v1.0#72l7ojl0ixrvif')
    require('dotenv').config()

    const sampleEndpointName = process.env.SAMPLE_ENDPOINT_NAME
    const quicknodeKey = process.env.QUICKNODE_KEY

    const provider = new ethers.providers.JsonRpcProvider({
        url: `https://${sampleEndpointName}.discover.quiknode.pro/${quicknodeKey}/`,
        headers: { 'x-qn-api-version': 1 },
    })

    const data = await provider.send('qn_getWalletTokenBalance', {
        wallet: '0x01c20350ad8f434bedf6ea901203ac4cf7bca295',
        page: 1,
        perPage: 10,
    })

    let json = JSON.stringify(data)
    fs.writeFile('erc20_test.json', json)

    return {
        props: {
            data: data.assets,
        },
    }
}