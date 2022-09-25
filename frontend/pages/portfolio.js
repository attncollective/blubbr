import { utils } from 'ethers'
import { useState, useEffect } from 'react'
import TokenCard from '../components/TokenCard'
import { useAccount } from 'wagmi'
import useLensAuth from '../hooks/useLensAuth'
import getRandomImage from '../utils/getRandomImage'
import sliceAddress from '../utils/sliceAddress'
import { UserPlusIcon } from '@heroicons/react/24/outline'

const ADDRESS = '0x81617079A419ab4562b29A92181402BdF389a1fA' // my address
// const ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295' // whale address

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
    const [login, { loading, isLoggedIn, hasProfile, profile }] = useLensAuth(ADDRESS)

    // UI
    const [totalAmount, setTotalAmount] = useState(0)
    const [ensAvatar, setEnsAvatar] = useState(getRandomImage())

    function increaseTotalAmount(amount) {
        setTotalAmount((prev) => prev + amount)
    }

    return (
        <div className="w-full mt-40 ml-24 md:ml-64 xl:ml-80 mb-16">
            <div className="w-full h-full flex flex-col justify-start">
                <div className="relative flex justify-start items-center w-[60rem] mb-8 border border-gray-700 dark:border-gray-400 rounded-xl bg-gray-100 dark:bg-gray-850">
                    {hasProfile && (
                        <div className="h-56 w-56 rounded-xl filter brightness-110 dark:brightness-90">
                            <img
                                src={profile.imageUrl}
                                className="rounded-l-xl border-r border-gray-700 dark:border-gray-400"
                                style={{
                                    width: 224,
                                    height: 224,
                                    objectFit: 'cover',
                                }}
                                onError={(e) => {
                                    e.currentTarget.src = '/logos/user_profile.png'
                                    e.currentTarget.onerror = null
                                }}
                            />
                        </div>
                    )}
                    {!hasProfile && (
                        <div className="h-56 w-56 rounded-xl filter brightness-[85%] dark:brightness-75">
                            <img
                                src={ensAvatar}
                                className="rounded-l-xl border-r border-gray-700 dark:border-gray-400"
                                style={{
                                    width: 224,
                                    height: 224,
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    )}
                    <div className="h-full flex flex-col justify-between ml-4">
                        {/* Name + Address */}
                        <div className="mt-2">
                            <div className="text-xl font-semibold text-black dark:text-white">
                                {hasProfile ? profile.handle : sliceAddress(ADDRESS)}
                            </div>
                            <div className="text-base font-light w-fit bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80">
                                {sliceAddress(ADDRESS)}
                            </div>
                        </div>

                        {/* Bio */}
                        {hasProfile && <div className="w-[30rem]">{profile.bio}</div>}

                        {/* Followers + Following */}
                        <div className="flex flex-row mb-1.5">
                            <div className="flex flex-col justify-center items-start">
                                <div className="text-xl font-semibold text-black dark:text-white">
                                    {hasProfile ? profile.totalFollowing : 0}
                                </div>
                                <div className="text-base font-light">Following</div>
                            </div>
                            <div className="flex flex-col justify-center items-start ml-4">
                                <div className="text-xl font-semibold text-black dark:text-white">
                                    {hasProfile ? profile.totalFollowers : 0}
                                </div>

                                <div className="text-base font-light">Followers</div>
                            </div>
                        </div>
                    </div>
                    {/* Follow Button */}
                    {hasProfile && (
                        <button
                            className="absolute flex flex-row justify-center items-center top-2 right-2
                    text-green-600 dark:text-green-400/80 bg-green-100/50 dark:bg-green-900/50 border rounded-md px-3 py-1.5 border-green-600 dark:border-green-400/80"
                        >
                            <UserPlusIcon className="w-5 h-5 mr-1 font-semibold" />{' '}
                            <span className="text-sm font-semibold">Follow</span>
                        </button>
                    )}
                </div>
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
