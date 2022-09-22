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
            <div className="mt-20 ml-36 md:ml-64 xl:ml-88 mb-16">
                <h1>{error}</h1>
            </div>
        )

    return (
        <div className="ml-24 px-64 py-36 ">
        <div className="content-center w-[76rem] py-2 px-22 border dark:border-gray-400 rounded-xl bg-gray-100 dark:bg-gray-850">
            <div className="flex dark:border-gray-400">     
                 <table className="items-center text-sm table-fixed"> 
                 <thead className="flex text-xs text-gray-100 uppercase dark:text-gray">
                     <tr>
                     <th scope="col" className="py-6 px-20">Name</th>
                     <th scope="col" className="py-6 px-24">Symbol</th>
                     <th scope="col" className="py-6 px-24">Total Sales</th>
                     <th scope="col" className="py-6 px-24">Floor</th>
                     <th scope="col" className="py-6 px-24">Volume</th>
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
            </div>  
            {loading && (
                <div className="flex flex-col items-center mt-10">
                    <h1>Loading...</h1>
                </div>
            )}
    
        </div>
        </div>
    )
}