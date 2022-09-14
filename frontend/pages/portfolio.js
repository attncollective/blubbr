export default function Portfolio({ data }) {
    return (
        <div className="w-full mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
            <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                {data &&
                    data.map((token) => (
                        <div key={token.address}>
                            <li className="pb-3 sm:pb-4">
                                <div className="flex items-center space-x-4">
                                    <div clasName="flex-shrink-0">
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src="https://i.etsystatic.com/20568465/r/il/ffdd39/3324294687/il_1588xN.3324294687_bp0b.jpg"
                                            alt="Neil image"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {token.name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {token.symbol}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        {token.amount}
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
        wallet: '0x5338035c008EA8c4b850052bc8Dad6A33dc2206c',
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