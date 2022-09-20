import useQuery from '../hooks/useQuery'
import TrendingNFT from '../components/TrendingNFT'

const TRENDING_COLLECTIONS = `
query TrendingCollections {
    trendingCollections(orderBy: SALES, orderDirection: DESC) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats(
                    timeRange: {
                      gte: "2022-09-19T00:00:00.000Z"
                      lt: "2022-09-20T00:00:00.000Z"
                    }
                  ) {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
          }
        }
      }
    }
  }
`

export default function NFT({}) {

    const { error, loading, data } = useQuery('https://graphql.icy.tools/graphql', TRENDING_COLLECTIONS) // Icy Tools

    if (data && !error && !loading) console.log(data)

    if (error)
        return (
            <div className="mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
                <h1>{error}</h1>
            </div>
        )

    return (
        <div className="w-full mt-40 ml-24 md:ml-64 xl:ml-80 mb-16">
        <div className="w-[40rem] grid grid-rows-1 py-2 px-4 border border-gray-700 dark:border-gray-400 rounded-xl bg-gray-100 dark:bg-gray-850">
            <div className="h-12 flex justify-between items-center dark:border-gray-400 mb-2">
            </div>
         <div className="mt-24 ml-26 md:ml-64 xl:ml-80 mb-16">
             Trending NFTs
                 <table className="w-3/4 text-sm text-left text-gray-100 dark:text-gray-100 table-fixed"> 
                 <thead className="flex text-xs text-white uppercase bg-gray-600 dark:text-white">
                     <tr>
                     <th scope="col" className="py-4 px-6 w-40">Name</th>
                     <th scope="col" className="py-4 px-6 w-80">Address</th>
                     <th scope="col" className="py-4 px-6">Symbol</th>
                     <th scope="col" className="py-4 px-6">Total Sales</th>
                     <th scope="col" className="py-4 px-6">Floor</th>
                     <th scope="col" className="py-4 px-6">Volume</th>
                     </tr>
                 </thead>
                 <tbody>
                 {data &&
                    data.data.trendingCollections.edges.map((collections) => (
                        <div key={collections.node.address}>
                            <TrendingNFT
                                name={collections.node.name}
                                symbol={collections.node.symbol}
                                totalSales={collections.node.stats.totalSales}
                                floor={collections.node.stats.floor}
                                volume={collections.node.stats.volume}
                            />
                        </div>
                    ))}
                    </tbody>
            </table>
            {loading && (
                <div className="flex flex-col items-center mt-10">
                    <h1>Loading...</h1>
                </div>
            )}
        </div>
        </div>
        </div>
    )
}