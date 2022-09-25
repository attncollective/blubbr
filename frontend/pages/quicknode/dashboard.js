import NftCard from '../../components/NftCard'
import { useEffect, useState } from 'react'
import useQuery from '../../hooks/useQuery'
import useFetch from '../../hooks/useFetch'

const CONTRACT_ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295'
const CHAIN = 'polygon'

export default function QuicknodeDashboard({ preFetchedData }) {
    const [data, setData] = useState(preFetchedData)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    function excludeNull(nfts) {
        let newNfts = []
        for (const nft of nfts) {
            if (nft.file_url != null) {
                newNfts.push(nft)
            }
        }
        return newNfts
    }

    async function fetchData(pageNumber) {
        const sampleEndpointName = 'hidden-wider-vineyard'
        const quicknodeKey = '529f8aca703929d69748720ae256247b08a70e12'

        setLoading(true)
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 67,
                jsonrpc: '2.0',
                method: 'qn_fetchNFTs',
                params: {
                    wallet: CONTRACT_ADDRESS,
                    page: pageNumber,
                    perPage: 10,
                },
            }),
        }

        fetch(`https://${sampleEndpointName}.discover.quiknode.pro/${quicknodeKey}/`, options)
            .then((res) => res.json())
            .then((data) => {
                setData(data.result)
                console.log(data.result)
            })
            .catch((err) => console.log(err))
        setLoading(false)
    }

    async function nextPage() {
        if (data.pageNumber >= data.totalPages) return
        await fetchData(data.pageNumber + 1)
    }

    async function prevPage() {
        if (data.pageNumber <= 1) return
        await fetchData(data.pageNumber - 1)
    }

    return (
        <div className="w-full mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
            <div className="space-y-12 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 md:gap-x-8 2xl:grid-cols-5">
                {/* - Quicknode - */}
                {data &&
                    !loading &&
                    data.assets.map((nft) => (
                        <div key={nft.collectionAddress + nft.collectionTokenId}>
                            <NftCard
                                name={nft.collectionName}
                                tokenId={nft.collectionTokenId}
                                address={nft.collectionAddress}
                                rawUrl={nft.imageUrl}
                            />
                        </div>
                    ))}
            </div>
            {data && !loading && (
                <div className="flex flex-col items-center mt-10">
                    <span className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                        Showing{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {data.pageNumber}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {data.totalPages}
                        </span>{' '}
                        pages
                    </span>

                    <div className="inline-flex mt-2 xs:mt-0 z-10">
                        <button
                            onClick={prevPage}
                            className="py-2 px-4 rounded-l
                        text-sm font-medium text-black dark:text-white
                        bg-black/[18%] dark:bg-white/[10%] hover:bg-black/[33%] dark:hover:bg-white/[25%]"
                        >
                            Prev
                        </button>
                        <button
                            onClick={nextPage}
                            className="py-2 px-4 rounded-r
                        text-sm font-medium text-black dark:text-white
                        bg-black/[18%] dark:bg-white/[10%] hover:bg-black/[33%] dark:hover:bg-white/[25%]
                        border-0 border-l border-gray-700 dark:border-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
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

    const data = await provider.send('qn_fetchNFTs', {
        wallet: CONTRACT_ADDRESS,
        // omitFields: ['provenance', 'traits'],
        page: 1,
        perPage: 10,
    })

    return {
        props: {
            preFetchedData: data,
        },
    }
}
