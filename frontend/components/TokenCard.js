import { useState, useEffect } from 'react'
import { utils } from 'ethers'

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

export default function TokenCard({ symbol, address, amount, network, increaseTotalAmount }) {
    const [price, setPrice] = useState(null)
    const [usdAmount, setUsdAmount] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hide, setHide] = useState(true) // set to false to show hidden token

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
                    setHide(false)
                    setPrice(data.market_data.current_price?.usd)
                    setUsdAmount(displayAmount(data.market_data.current_price?.usd * amount))
                    if (increaseTotalAmount)
                        increaseTotalAmount(data.market_data.current_price?.usd * amount)
                    if (data.image) setImageUrl(data.image.large)
                    else setImageUrl('/logos/btc_transparent.png')
                } else {
                    setPrice('N.A')
                    setUsdAmount('N.A')
                    setImageUrl('/logos/btc_transparent.png')
                }
            })
            .catch((err) => {
                setPrice('N.A')
                setUsdAmount('N.A')
                setImageUrl('/logos/btc_transparent.png')
                console.log(err)
            })
        setIsLoading(false)
    }

    useEffect(() => {
        fetchTokenData()
    }, [])

    return (
        <div>
            {!hide && (
                <div className="h-12 flex justify-between items-center">
                    <div className="flex flex-row justify-center items-center mb-1.5">
                        <div className="h-10 w-10">
                            <img
                                src={imageUrl}
                                className="rounded-full"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                        <div className="flex flex-col justify-around ml-4">
                            <div className="font-semibold text-black dark:text-white">{symbol}</div>

                            {price && !isLoading && (
                                <div className="font-light text-gray-700 dark:text-gray-400">
                                    $ {displayAmount(price)}
                                </div>
                            )}
                            {isLoading && (
                                <div>
                                    <div className="w-4 h-4 border-l border-b border-black dark:border-gray-400 rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-around items-end ml-4">
                        {usdAmount && !isLoading && (
                            <div className="font-semibold text-black dark:text-white">
                                <span className="font-medium">$</span> {usdAmount}
                            </div>
                        )}
                        {isLoading && (
                            <div>
                                <div className="w-4 h-4 border-l border-b border-black dark:border-gray-400 rounded-full animate-spin"></div>
                            </div>
                        )}
                        <div className="font-light text-gray-700 dark:text-gray-400">
                            {displayAmount(amount)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
