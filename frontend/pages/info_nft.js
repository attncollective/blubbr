import { PhotoIcon } from '@heroicons/react/24/outline'
import useQuery from '../hooks/useQuery'
import useBlockvision from '../hooks/useBlockvision'
import { useState, useEffect } from 'react'

export default function NftInfo() {
    const contractAddress = '0xb16dfd9aaaf874fcb1db8a296375577c1baa6f21'
    const QUERY = `
    query {
        contract(address:"${contractAddress}") {
          ... on ERC721Contract {
            name
            address
            tokenStandard
            stats {
                totalSales
                average
                ceiling
                floor
                volume
              }
              symbol
            unsafeOpenseaDescription
            unsafeOpenseaImageUrl
          }
        }
      }
    `

    const { error, loading, data } = useQuery('https://graphql.icy.tools/graphql', QUERY)
    const blockvisionData = useBlockvision(contractAddress)
    let itData
    if (data && !loading) {
        itData = data.data.contract
    }
    let bvData
    if (blockvisionData.data && !blockvisionData.loading) {
        bvData = blockvisionData.data.result
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Loading...
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
                    NFT Collection Not Found
                </div>
            </div>
        )
    }
    console.log(itData, bvData)

    return (
        <div className="w-full min-h-screen py-28 px-6">
            {!itData || !bvData ? (
                <div className="w-full px-3 py-3 flex justify-center items-center">Loading...</div>
            ) : (
                <div className="w-full h-full px-3 py-3 flex flex-col justify-start items-start border border-gray-350 dark:border-gray-750 rounded-xl bg-gray-100 dark:bg-gray-850">
                    <div className="flex flex-row ">
                        <div>
                            {itData.unsafeOpenseaImageUrl ? (
                                <img
                                    src={itData.unsafeOpenseaImageUrl}
                                    className="rounded-full"
                                    style={{
                                        minWidth: '80px',
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                    }}
                                    alt={itData.name}
                                />
                            ) : (
                                <PhotoIcon className="w-20" />
                            )}
                        </div>

                        <div className="h-20 mx-2 flex flex-col">
                            <div>{itData.name}</div>
                            <div className="flex">{itData.address}</div>
                            <div className="flex">
                                Supply: {bvData.items} | Owners: {bvData.owners}
                            </div>
                        </div>
                    </div>
                    <div></div>
                    <div className="p-5">{itData.unsafeOpenseaDescription}</div>
                    <div className="p-5">
                        <div className="flex flex-row">
                            <div className="p-2 border border-gray-750 rounded-tl-xl">
                                Floor: {itData.stats.floor}
                            </div>
                            <div className="p-2 border border-gray-750 ">
                                Ceiling: {itData.stats.ceiling}
                            </div>
                            <div className="p-2 border border-gray-750">
                                Average: {itData.stats.average.toFixed(5)}
                            </div>
                            <div className="p-2 border border-gray-750 rounded-tr-xl">
                                Highest: {bvData.highestPrice}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="p-2 border border-gray-750 rounded-bl-xl">
                                24H Volume: {parseFloat(bvData.tradedVolumeIn24H).toFixed(3)}
                            </div>
                            <div className="p-2 border border-gray-750 ">
                                Total Vol: {parseFloat(bvData.totalVolume).toFixed(3)}
                            </div>
                            <div className="p-2 border border-gray-750">
                                24H Sales: {bvData.salesIn24H}
                            </div>
                            <div className="p-2 border border-gray-750 rounded-br-xl">
                                Total Sales: {itData.stats.totalSales}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
