import { useState, useEffect } from 'react'
import { utils } from 'ethers'
import { ExclamationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const ID = 'ethereum'

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

function displayAmount(amount) {
    if (amount >= 1000) amount = amount.toFixed(0)
    else if (amount >= 100) amount = amount.toFixed(1)
    else if (amount >= 1) amount = amount.toFixed(2)
    else amount = amount.toFixed(3)

    return numberWithCommas(amount)
}

export default function TokenCard({
    symbol,
    address,
    amount,
    network,
    increaseTotalAmount,
    showHiddenTokens,
}) {
    const [price, setPrice] = useState(null)
    const [usdAmount, setUsdAmount] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [loading, setLoading] = useState(true)
    const [hidden, setHidden] = useState(true) // we assume we didn't find data for that token

    async function fetchTokenData() {
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }
        fetch(`https://api.coingecko.com/api/v3/coins/${ID}/contract/${address}`, options)
            .then((res) => res.json())
            .then((data) => {
                if (data.market_data) {
                    setPrice(data.market_data.current_price?.usd)
                    setUsdAmount(displayAmount(data.market_data.current_price?.usd * amount))
                    increaseTotalAmount(data.market_data.current_price?.usd * amount)
                    if (data.image) setImageUrl(data.image.large)
                    else setImageUrl('/logos/btc_transparent.png')
                    setHidden(false)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchTokenData()
    }, [])

    return (
        <div>
            {((showHiddenTokens && hidden) || !hidden) && (
                <div className="h-12 flex justify-between items-center">
                    <div className="flex flex-row justify-center items-center mb-1.5">
                        {/* - Token Image - */}
                        {(() => {
                            if (loading) {
                                return (
                                    <div>
                                        <div className="w-4 h-4 border-l border-b border-black dark:border-gray-400 rounded-full animate-spin" />
                                    </div>
                                )
                            }
                            if (!imageUrl) {
                                return (
                                    <div className="h-10 w-10 rounded-full flex justify-center items-center bg-gray-850 dark:bg-gray-100">
                                        <ExclamationCircleIcon className="h-9 w-9 text-gray-100 dark:text-gray-850 " />
                                    </div>
                                )
                            }
                            return (
                                <div className="h-10 w-10">
                                    <img
                                        src={imageUrl}
                                        className="rounded-full"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            objectFit: 'cover',
                                        }}
                                        alt=""
                                    />
                                </div>
                            )
                        })()}

                        <div className="flex flex-col justify-around ml-4">
                            {/* - Token Symbol - */}
                            <div className="font-semibold text-black dark:text-white">{symbol}</div>

                            {/* - Token Usd Price - */}
                            {(() => {
                                if (loading) {
                                    return (
                                        <div>
                                            <div className="w-4 h-4 border-l border-b border-black dark:border-gray-400 rounded-full animate-spin" />
                                        </div>
                                    )
                                }
                                if (!price) {
                                    return (
                                        <div className="font-light text-gray-700 dark:text-gray-400">
                                            N.A.
                                        </div>
                                    )
                                }
                                return (
                                    <div className="font-light text-gray-700 dark:text-gray-400">
                                        $ {displayAmount(price)}
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-around items-end ml-4">
                        {/* - Usd Amount - */}
                        {(() => {
                            if (loading) {
                                return (
                                    <div>
                                        <div className="w-4 h-4 border-l border-b border-black dark:border-gray-400 rounded-full animate-spin"></div>
                                    </div>
                                )
                            }
                            if (!usdAmount) {
                                return (
                                    <div className="font-semibold text-black dark:text-white">
                                        N.A.
                                    </div>
                                )
                            }
                            return (
                                <div className="font-semibold text-black dark:text-white">
                                    <span className="font-medium">$</span> {usdAmount}
                                </div>
                            )
                        })()}
                        {/* - Token Amount - */}
                        <div className="font-light text-gray-700 dark:text-gray-400">
                            {displayAmount(amount)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
