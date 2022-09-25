import { utils } from 'ethers'
import { useState, useEffect } from 'react'
import TokenCard from '../components/TokenCard'
import { useAccount } from 'wagmi'
import useLensAuth from '../hooks/useLensAuth'
import getRandomImage from '../utils/getRandomImage'
import sliceAddress from '../utils/sliceAddress'
import { UserPlusIcon } from '@heroicons/react/24/outline'

// const ADDRESS = '0x81617079A419ab4562b29A92181402BdF389a1fA' // my address
const ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295' // whale address

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

function displayAmount(amount) {
    if (amount >= 1000) amount = amount.toFixed(2)
    else if (amount >= 1) amount = amount.toFixed(3)
    else amount = amount.toFixed(4)

    return numberWithCommas(amount)
}

export default function Tokens({ data }) {
    const { address, isConnected } = useAccount()
    const [login, createPost, { loading, isLoggedIn, hasProfile, profile }] = useLensAuth(ADDRESS)

    // UI
    const [totalAmount, setTotalAmount] = useState(0)
    const [ensAvatar, setEnsAvatar] = useState(getRandomImage())

    function increaseTotalAmount(amount) {
        setTotalAmount((prev) => prev + amount)
    }

    return (
        <div className="w-full mt-40 ml-24 md:ml-64 xl:ml-80 mb-16">
            <div className="w-full h-full flex flex-col justify-start">
                <div className="w-[46rem] grid grid-rows-1 py-2 px-4 border border-gray-700 dark:border-gray-400 rounded-xl bg-gray-100 dark:bg-gray-850">
                    <div className="h-12 flex justify-between items-center border-b border-gray-700 dark:border-gray-400 mb-2">
                        <div className="font-bold text-lg">Wallet</div>
                        <div className="font-semibold text-black dark:text-white">
                            <span className="font-medium">$</span> {displayAmount(totalAmount)}
                        </div>
                    </div>

                    <div className="mx-3 my-1.5">
                        {data &&
                            data.map((token) => (
                                <div key={token.address + token.network}>
                                    <TokenCard
                                        symbol={token.symbol}
                                        address={token.address}
                                        amount={Number(utils.formatEther(token.amount))}
                                        network={token.network}
                                        increaseTotalAmount={increaseTotalAmount}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const ethers = require('ethers')
    require('dotenv').config()

    const sampleEndpointName = process.env.SAMPLE_ENDPOINT_NAME
    const quicknodeKey = process.env.QUICKNODE_KEY

    const provider = new ethers.providers.JsonRpcProvider({
        url: `https://${sampleEndpointName}.discover.quiknode.pro/${quicknodeKey}/`,
        headers: { 'x-qn-api-version': 1 },
    })

    const data = await provider.send('qn_getWalletTokenBalance', {
        wallet: ADDRESS,
        page: 1,
        perPage: 10,
    })

    return {
        props: {
            data: data.assets,
        },
    }
}
