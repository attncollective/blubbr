import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

function displayEthPrice(price) {
    if (price >= 50) return price.toFixed(0)
    else if (price >= 8) return price.toFixed(1)
    else if (price >= 1) return price.toFixed(2)
    else return price.toFixed(3)
}

function displayUsdPrice(price) {
    if (price >= 1000) return price.toFixed(0)
    else return price.toFixed(2)
}

export default function NftCard({ name, tokenId, symbol, rawUrl, address }) {
    const [url, setUrl] = useState(getUrl(rawUrl))
    const [isLoadingPrice, setIsLoadingPrice] = useState(true)
    const [errorPrice, setErrorPrice] = useState(false)
    const [ethPrice, setEthPrice] = useState(null)
    const [usdPrice, setUsdPrice] = useState(null)

    fetchEstimatedPrice()

    async function fetchEstimatedPrice() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_NFT_BANK_API_KEY,
            },
        }
        fetch(
            `https://api.nftbank.ai/estimates-v2/estimates/${address}/${tokenId}?chain_id=ETHEREUM`,
            options
        )
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response == 200) {
                    let ethPrice = data.data[0]?.estimate[0].estimate_price
                    let usdPrice = data.data[0]?.estimate[1].estimate_price
                    setIsLoadingPrice(false)
                    setEthPrice(displayEthPrice(ethPrice))
                    setUsdPrice(displayUsdPrice(usdPrice))
                } else {
                    console.log('Estimated price: ' + address + ' tokenId: ' + tokenId)
                    setIsLoadingPrice(false)
                    setErrorPrice(true)
                }
            })
            .catch((err) => {
                console.log('Estimated price: ' + address + ' tokenId: ' + tokenId)
                console.log(err)
                setIsLoadingPrice(false)
                setErrorPrice(true)
            })
    }

    async function fetchDataFromNftPort() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY,
            },
        }
        fetch(`https://api.nftport.xyz/v0/nfts/${address}/${tokenId}?chain=ethereum`, options)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response == 'OK') {
                    let url = data.nft.file_url
                    if (url && url.startsWith('ipfs://ipfs/')) {
                        url = url.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/')
                    } else if (url && url.startsWith('ipfs://')) {
                        url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    }
                    setUrl(url)
                } else {
                    console.log('Error fetching: ' + address + ' tokenId: ' + tokenId)
                    url = '/images/image_not_found.png'
                }
            })
            .catch((err) => {
                console.log('Error fetching: ' + address + ' tokenId: ' + tokenId)
                url = '/images/image_not_found.png'
            })
    }

    // basically if we have a URI we replace the gateway, otherwise we pass the url
    function getUrl(uriOrUrl) {
        let url = uriOrUrl

        if (!url) fetchDataFromNftPort()

        if (url && url.startsWith('ipfs://ipfs/')) {
            url = url.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/')
        } else if (url && url.startsWith('ipfs://')) {
            url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
        }

        return url
    }

    return (
        <div className="flex flex-col w-56 h-80 z-10 rounded-lg shadow-xl bg-black/[18%] dark:bg-white/[10%]">
            {url ? (
                <div className="w-56 h-56">
                    <img
                        src={url}
                        className="rounded-t-lg shadow-lg"
                        style={{ width: '224px', height: '224px', objectFit: 'cover' }}
                        onError={fetchDataFromNftPort}
                        onLoad={(e) => {
                            if (e.currentTarget.src == '/images/image_not_found.png') {
                                e.currentTarget.className =
                                    'rounded-t-lg shadow-lg dark:invert-[90%]'
                            }
                        }}
                        // onError={(e) => {
                        //     e.currentTarget.src = '/images/image_not_found.png'
                        //     e.currentTarget.className = 'rounded-t-lg shadow-lg dark:invert-[90%]'
                        //     e.currentTarget.onerror = null
                        // }}
                    />
                </div>
            ) : (
                <div className="w-56 h-56">
                    <img
                        src="/images/image_not_found.png"
                        className="rounded-t-lg shadow-lg dark:invert-[90%]"
                        style={{ width: '224px', height: '224px', objectFit: 'cover' }}
                    />
                </div>
            )}

            <div className="relative m-2 h-full">
                <h1 className="truncate text-black dark:text-gray-200 font-bold text-lg tracking-tight">
                    {name}
                </h1>
                <h2 className="truncate">
                    <span className="bg-gradient-to-r from-purple-700 via-pink-700 to-yellow-700 dark:from-purple-300 dark:via-pink-300 dark:to-yellow-300 text-transparent bg-clip-text">
                        #{tokenId}
                    </span>
                </h2>

                {ethPrice && <div className="absolute bottom-0 right-0">{ethPrice} ETH</div>}
                {isLoadingPrice && (
                    <div className="absolute bottom-0 right-0">
                        <div className="w-5 h-5 mb-1 mr-1 border-l-2 border-b-2 border-black dark:border-gray-200 rounded-full animate-spin"></div>
                    </div>
                )}
                {errorPrice && <div className="absolute bottom-0 right-0">NA ETH</div>}
            </div>
        </div>
    )
}
