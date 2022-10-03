import { utils } from 'ethers'
import { useState, useEffect } from 'react'
import TokenCard from '../components/TokenCard'
import { useAccount } from 'wagmi'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

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

export default function Tokens() {
    // wagmi
    const { address, isConnected, isConnecting } = useAccount()

    // UI
    const [totalAmount, setTotalAmount] = useState(0)
    const [showHiddenTokens, setShowHiddenTokens] = useState(false)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // tells when the page is mounted
    const [mounted, setMounted] = useState(false)

    function toggleShowHiddenTokens() {
        setShowHiddenTokens((prev) => !prev)
    }

    function increaseTotalAmount(amount) {
        setTotalAmount((prev) => prev + amount)
    }

    async function fetchData() {
        setLoading(true)
        setTotalAmount(0)

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 67,
                jsonrpc: '2.0',
                method: 'qn_getWalletTokenBalance',
                params: {
                    wallet: address,
                },
            }),
        }

        fetch(
            `https://${process.env.NEXT_PUBLIC_SAMPLE_ENDPOINT_NAME}.discover.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}/`,
            options
        )
            .then((res) => res.json())
            .then((data) => {
                setData(data.result.assets)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setError('Tokens: error fethcing data')
                setLoading(false)
            })
    }

    // fetch the data once the user is connected
    useEffect(() => {
        if (isConnected) fetchData()
    }, [isConnected])

    // set mounted once the page is mounted
    useEffect(() => {
        if (!mounted) setMounted(true)
    }, [mounted])

    if (loading || isConnecting || !mounted) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Loading...
                </div>
            </div>
        )
    }

    if (!isConnected) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Connect your wallet to see your token
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    {error}
                </div>
            </div>
        )
    }

    if (data && data.length == 0) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    This wallet has no ERC20 Tokens
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-start items-center py-8 lg:py-12 px-4 lg:px-16 xl:px-24 2xl:px-32">
            {/* - Hide Switch - */}
            <div className="w-full flex justify-begin items-center mb-3">
                <div className=" w-72 py-2 px-4 flex flex-row items-center justify-between border rounded-xl border-gray-350 dark:border-gray-750 bg-gray-100 dark:bg-gray-850 shadow-lg dark:shadow-xl">
                    {showHiddenTokens ? (
                        <div className="flex flex-row justify-center items-center">
                            <EyeSlashIcon className="h-6 w-6 mr-2" />
                            <span className="font-light text-gray-850 dark:text-gray-350">
                                Hide Tokens
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-row justify-center items-center">
                            <EyeIcon className="h-6 w-6 mr-2" />
                            <span className="font-light text-gray-850 dark:text-gray-350">
                                Show Tokens
                            </span>
                        </div>
                    )}

                    <button
                        onClick={toggleShowHiddenTokens}
                        className="bg-gray-350 dark:bg-gray-600 relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer rounded-full border-[1px] border-transparent transition-colors duration-200 ease-in-out"
                    >
                        <span
                            aria-hidden="true"
                            className={`${
                                showHiddenTokens ? 'translate-x-[22px]' : 'translate-x-0'
                            } pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full
                 shadow-lg ring-0 transition duration-200 ease-in-out
                 bg-gray-100 dark:bg-gray-850`}
                        ></span>
                    </button>
                </div>
            </div>
            <div className="w-full grid grid-rows-1 py-2 px-4 border border-gray-350 dark:border-gray-750 rounded-xl bg-gray-100 dark:bg-gray-850 shadow-lg dark:shadow-xl">
                {/* - Top Row / Wallet amount - */}
                <div className="h-12 flex justify-between items-center border-b border-gray-350 dark:border-gray-750 mb-2">
                    <div className="font-bold text-lg">Wallet</div>
                    <div className="font-semibold text-black dark:text-white">
                        <span className="font-medium">$</span> {displayAmount(totalAmount)}
                    </div>
                </div>

                {/* - List ot Token - */}
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
                                    showHiddenTokens={showHiddenTokens}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
