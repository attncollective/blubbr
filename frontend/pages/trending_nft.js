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
                      gte: "2022-09-20T00:00:00.000Z"
                      lt: "2022-09-21T00:00:00.000Z"
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
const TokenImages = `
# Query that looks up the images for BAYC#1
query TokenImages {
  token(
    contractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenId: "1,
  ) {
    ... on ERC721Token {
      images {
        url
        width
        height
        mimeType
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
        <div className="flex mt-40 ml-20 md:ml-64 xl:ml-80 mb-22">
        <div className="w-[42rem] grid grid-rows-1 py-2 px-4 border dark:border-gray-400 rounded-xl bg-gray-100 dark:bg-gray-850">
            <div className="flex w-[40rem] items-center dark:border-gray-400 mb-2">
            </div>       
                 <table className="w-[38rem] items-center text-sm text-left table-fixed"> 
                 {/* <div className="h-10 w-10">
                            <img
                                src={imageUrl}
                                className="rounded-full"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                }}
                            />
                        </div> */}
                 <thead className="flex items-center text-xs text-gray-100 uppercase dark:border-gray-400 dark:text-gray">
                     <tr>
                     <th scope="col" className="py-4 px-16">Name</th>
                     <th scope="col" className="py-4 px-14">Symbol</th>
                     <th scope="col" className="py-4 px-1">Total Sales</th>
                     <th scope="col" className="py-4 px-6">Floor</th>
                     <th scope="col" className="py-4 px-6">Volume</th>
                     </tr>
                 </thead>
                 <tbody>
                 {data &&
                    data.data.trendingCollections.edges.map((collections) => (
                        <div className="flex w-[45rem] items-center" key={collections.node.address}>
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
    )
}