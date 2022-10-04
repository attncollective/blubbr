import NftCard from '../../../components/NftCard'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

const CONTRACT_ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295'
const CHAIN = 'polygon'

function getUrlImages(images) {
    if (images && images.length) {
        return images[1].url
    } else return null
}

export default function NftportDashboard() {
    // wagmi
    const { address, isConnected, isConnecting } = useAccount()

    const [nfts, setNfts] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [continuation, setContinuation] = useState(null)
    const [total, setTotal] = useState(null)

    // tells when the page is mounted
    const [mounted, setMounted] = useState(false)

    function excludeNull(nfts) {
        let newNfts = []
        for (const nft of nfts) {
            if (nft.file_url != null) {
                newNfts.push(nft)
            }
        }
        return newNfts
    }

    async function fetchContinuationNfts() {
        setLoading(true)

        fetch(
            `https://api.nftport.xyz/v0/accounts/${address}?chain=${CHAIN}&include=metadata&page_size=20&continuation=${continuation}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response == 'OK') {
                    setNfts(nfts.concat(excludeNull(data.nfts)))

                    setContinuation(data.continuation)
                    setTotal(data.total)
                    setLoading(false)
                } else {
                    setError('NFTport dashboard: error fetching the data')
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setError('NFTport dashboard: error fetching data')
                setLoading(false)
            })
    }

    async function fetchNfts() {
        setLoading(true)

        fetch(
            `https://api.nftport.xyz/v0/accounts/${address}?chain=${CHAIN}&include=metadata&page_size=20`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response == 'OK') {
                    setNfts(excludeNull(data.nfts))

                    setContinuation(data.continuation)
                    setTotal(data.total)
                    setLoading(false)
                } else {
                    setError('NFTport dashboard: error fetching the data')
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setError('NFTport dashboard: error fetching data')
                setLoading(false)
            })
    }

    // fetch the NFTs once the user is connected
    useEffect(() => {
        if (isConnected) fetchNfts()
    }, [isConnected])

    // set mounted once the page is mounted
    useEffect(() => {
        if (!mounted) setMounted(true)
    }, [mounted])

    if (!mounted || loading || isConnecting) {
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
                    Connect your wallet to display NFTs
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

    if (nfts && nfts.length == 0) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    You don&apos;t own any NFTs
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col my-10">
            {/* - NFT Grid - */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-8">
                {nfts &&
                    nfts.map((nft) => (
                        <div
                            className="flex justify-center items-center"
                            key={nft.contract_address + nft.token_id}
                        >
                            <NftCard
                                name={nft.name}
                                tokenId={nft.token_id}
                                address={nft.contract_address}
                                rawUrl={nft.file_url}
                            />
                        </div>
                    ))}
            </div>

            <div className="flex flex-col items-center mt-10">
                <span className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                    Showing{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {nfts.length}
                    </span>{' '}
                    of <span className="font-semibold text-gray-900 dark:text-white">{total}</span>{' '}
                    Entries
                </span>

                {/* - Next Button - */}
                {continuation && nfts.length != total && (
                    <div className="inline-flex mt-2 xs:mt-0 z-10">
                        <button
                            onClick={fetchContinuationNfts}
                            className="py-2 px-8 rounded
                        text-sm font-medium text-black dark:text-white
                        bg-black/[18%] dark:bg-white/[10%] hover:bg-black/[33%] dark:hover:bg-white/[25%]"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
