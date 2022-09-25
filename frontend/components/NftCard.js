import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

export default function NftCard({ name, tokenId, symbol, rawUrl, openseaUrl }) {
    const [url, setUrl] = useState(getUrl(rawUrl))

    // basically if we have a URI we replace the gateway, otherwise we pass the url
    function getUrl(uriOrUrl) {
        const url = ''
        if (uriOrUrl && uriOrUrl.startsWith('ipfs://')) {
            url = uriOrUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
        } else {
            url = uriOrUrl
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
                        onError={(e) => {
                            e.currentTarget.src = 'images/image_not_found.png'
                            e.currentTarget.className = 'rounded-t-lg shadow-lg dark:invert-[90%]'
                            e.currentTarget.onerror = null
                        }}
                    />
                </div>
            ) : (
                <div className="w-56 h-56">
                    <img
                        src="images/image_not_found.png"
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
                <div className="absolute bottom-0 right-0">0.2 ETH</div>
            </div>
        </div>
    )
}
