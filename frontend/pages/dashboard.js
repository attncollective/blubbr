import NftCard from '../components/NftCard'
import { useEffect, useState } from 'react'
import useQuery from '../hooks/useQuery'

const USER_TOKENS = `
query MEVTokens {
    wallet(address: "0x01c20350ad8f434bedf6ea901203ac4cf7bca295") {
      tokens {
        edges {
          node {
            tokenId
            contract {
                ... on ERC721Contract {
                  name
                  symbol
                  unsafeOpenseaImageUrl
                }
              }
            ... on ERC721Token {
              metadata {
                image
              }
            }
          }
        }
      }
    }
  }
`

export default function Dashboard({}) {
    const { isLoading, data } = useQuery('https://graphql.icy.tools/graphql', USER_TOKENS)

    if (data && !isLoading) console.log(data.data.wallet.tokens.edges)

    return (
        <div className="mt-24 ml-24 md:ml-64 xl:ml-80 mb-16 space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 md:gap-x-8 2xl:grid-cols-4">
            {data &&
                data.data.wallet.tokens.edges.map((userData) => (
                    <div key={userData.node.tokenId + userData.node.contract.name}>
                        <NftCard
                            name={userData.node.contract.name}
                            tokenId={userData.node.tokenId}
                            symbol={userData.node.contract.symbol}
                            url={userData.node.metadata?.image}
                            openseaUrl={userData.node.contract.unsafeOpenseaImageUrl}
                        />
                    </div>
                ))}
            {/* {data &&
                data.map((userData) => (
                    <div key={userData.collectionTokenId + userData.collectionName}>
                        <NftCard name={userData.name} url={userData.ImageUrl} />
                    </div>
                ))} */}
        </div>
    )
}

export async function getServerSideProps(context) {
    const ethers = require('ethers')
    const fs = require('fs')
    const sdk = require('api')('@module/v1.0#72l7ojl0ixrvif')
    require('dotenv').config()

    const sampleEndpointName = process.env.SAMPLE_ENDPOINT_NAME
    const quicknodeKey = process.env.QUICKNODE_KEY

    const provider = new ethers.providers.JsonRpcProvider({
        url: `https://${sampleEndpointName}.discover.quiknode.pro/${quicknodeKey}/`,
        headers: { 'x-qn-api-version': 1 },
    })

    const data = await provider.send('qn_fetchNFTs', {
        wallet: '0x5338035c008EA8c4b850052bc8Dad6A33dc2206c',
        // omitFields: ['provenance', 'traits'],
        page: 1,
        perPage: 10,
    })

    let json = JSON.stringify(data)
    fs.writeFile('nft_test.json', json)

    return {
        props: {
            data: data.assets,
        },
    }
}
