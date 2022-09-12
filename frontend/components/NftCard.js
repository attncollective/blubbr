import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/outline'

export default function NftCard({ name, tokenId, symbol, url, openseaUrl }) {
    // basically if we have a URI we replace the gateway, otherwise we pass the url
    function getUrl(uriOrUrl) {
        const url = ''
        if (uriOrUrl && uriOrUrl.startsWith('ipfs://')) {
            url = uriOrUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
        } else {
            url = uriOrUrl
        }
        if (uriOrUrl && uriOrUrl.endsWith('.mp4')) {
            url = openseaUrl
        }
        return url
    }

    return (
        <div className="flex flex-col w-64 h-96 z-10 rounded-lg shadow-xl bg-black/[18%] dark:bg-white/[10%]">
            {url ? (
                <div className="">
                    <img
                        src={getUrl(url)}
                        alt="nft-1"
                        className="rounded-t-lg shadow-lg"
                        style={{ width: '256px', height: '256px', objectFit: 'cover' }}
                    />
                </div>
            ) : (
                <div className="w-64 h-64 border-b border-black dark:border-white">
                    <PhotoIcon className="w-32 h-32 m-16" />
                </div>
            )}

            <div className="relative m-3 h-full">
                <h1 className="mt-2 text-black dark:text-gray-200 font-bold text-lg lg:text-xl tracking-tight lg:font-extrabold">
                    {name}{' '}
                    <span className="bg-gradient-to-r from-purple-700 via-pink-700 to-yellow-700 dark:from-purple-300 dark:via-pink-300 dark:to-yellow-300 text-transparent bg-clip-text">
                        #{tokenId}
                    </span>
                </h1>
                <div className="absolute bottom-0 left-0">0.2 ETH</div>
                <div className="absolute bottom-0 right-0">42 💎</div>
            </div>
        </div>
    )
}
