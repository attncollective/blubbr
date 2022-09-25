import useQuery from '../hooks/useQuery'
import TrendingNFT from '../components/TrendingNFT'
import { useState } from 'react'

const TRENDING_COLLECTIONS_ONE_HOUR = `
query TrendingCollections {
    trendingCollections(orderBy: SALES, orderDirection: DESC, timePeriod: ONE_HOUR) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
            unsafeOpenseaImageUrl
          }
        }
      }
    }
  }
`

const TRENDING_COLLECTIONS_TWELVE_HOURS = `
query TrendingCollections {
    trendingCollections(orderBy: SALES, orderDirection: DESC, timePeriod: TWELVE_HOURS) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
            unsafeOpenseaImageUrl
          }
        }
      }
    }
  }
`

const TRENDING_COLLECTIONS_ONE_DAY = `
query TrendingCollections {
    trendingCollections(orderBy: SALES, orderDirection: DESC, timePeriod: ONE_DAY) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
            unsafeOpenseaImageUrl
          }
        }
      }
    }
  }
`

const TRENDING_COLLECTIONS_SEVEN_DAYS = `
query TrendingCollections {
    trendingCollections(orderBy: SALES, orderDirection: DESC, timePeriod: SEVEN_DAYS) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
            unsafeOpenseaImageUrl
          }
        }
      }
    }
  }
`

export default function NFT({}) {
    // UI Hooks
    const [timePeriod, setTimePeriod] = useState('ONE_DAY')

    // Icy Tools Hooks
    const { error, loading, data, refetch } = useQuery(
        'https://graphql.icy.tools/graphql',
        TRENDING_COLLECTIONS_ONE_DAY
    )

    if (data && !error && !loading) console.log(data)

    if (error)
        return (
            <div className="mt-20 ml-36 md:ml-64 xl:ml-88 mb-16">
                <h1>{error}</h1>
            </div>
        )

    return (
        <div className="ml-24 px-64 py-36 ">
            {/* TimePeriod Selector */}
            <div className="z-20 grid grid-cols-4 h-12 w-96 mb-2 border rounded-xl border-gray-350 dark:border-gray-750 bg-gray-100 dark:bg-gray-850">
                <button
                    onClick={() => {
                        refetch(TRENDING_COLLECTIONS_ONE_HOUR)
                        setTimePeriod('ONE_HOUR')
                    }}
                    className="h-full flex justify-center items-center"
                >
                    <span
                        className={`${
                            timePeriod == 'ONE_HOUR'
                                ? 'py-0.5 px-4 text-gray-100 dark:text-gray-850 rounded-md bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850'
                                : ''
                        }`}
                    >
                        1H
                    </span>
                </button>
                <button
                    onClick={() => {
                        refetch(TRENDING_COLLECTIONS_TWELVE_HOURS)
                        setTimePeriod('TWELVE_HOURS')
                    }}
                    className="h-full flex justify-center items-center"
                >
                    <span
                        className={`${
                            timePeriod == 'TWELVE_HOURS'
                                ? 'py-0.5 px-4 text-gray-100 dark:text-gray-850 rounded-md bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850'
                                : ''
                        }`}
                    >
                        12H
                    </span>
                </button>
                <button
                    onClick={() => {
                        refetch(TRENDING_COLLECTIONS_ONE_DAY)
                        setTimePeriod('ONE_DAY')
                    }}
                    className="h-full flex justify-center items-center"
                >
                    <span
                        className={`${
                            timePeriod == 'ONE_DAY'
                                ? 'py-0.5 px-4 text-gray-100 dark:text-gray-850 rounded-md bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850'
                                : ''
                        }`}
                    >
                        24H
                    </span>
                </button>
                <button
                    onClick={() => {
                        refetch(TRENDING_COLLECTIONS_SEVEN_DAYS)
                        setTimePeriod('SEVEN_DAYS')
                    }}
                    className="h-full flex justify-center items-center"
                >
                    <span
                        className={`${
                            timePeriod == 'SEVEN_DAYS'
                                ? 'py-0.5 px-4 text-gray-100 dark:text-gray-850 rounded-md bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850'
                                : ''
                        }`}
                    >
                        7D
                    </span>
                </button>
            </div>

            <div className="w-[76rem] py-3 px-6 border border-gray-350 dark:border-gray-750 rounded-xl bg-gray-100 dark:bg-gray-850">
                {/* Upper Row */}
                <div className="w-full h-16 pb-2 px-3 grid grid-cols-6 justify-start items-start font-bold text-lg text-black dark:text-white border-b border-gray-350 dark:border-gray-750">
                    <div className="col-span-2 h-full flex justify-start items-end">Name</div>
                    <div className="h-full flex justify-start items-end">Symbol</div>
                    <div className="h-full flex justify-start items-end">Total NFT Sold</div>
                    <div className="h-full flex justify-start items-end">Floor Price</div>
                    <div className="h-full flex justify-start items-end">ETH Volume</div>
                </div>

                {/* Trending NFT Row */}
                <div className="w-full px-3">
                    {loading && (
                        <div className="w-full h-12 flex justify-center items-center">
                            Loading...
                        </div>
                    )}
                    {!loading &&
                        data &&
                        data.data.trendingCollections.edges.map((collections) => (
                            <div className="w-full" key={collections.node.address}>
                                <TrendingNFT
                                    name={collections.node.name}
                                    symbol={collections.node.symbol}
                                    totalSales={collections.node.stats.totalSales}
                                    floor={collections.node.stats.floor}
                                    volume={collections.node.stats.volume}
                                    imageUrl={collections.node.unsafeOpenseaImageUrl}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}