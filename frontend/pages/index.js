import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProfileCard from '../components/ProfileCard'

const RECOMMENDED_PROFILES = `
  query {
    recommendedProfiles {
        id
        name
        bio
        attributes {
            displayType
            traitType
            key
            value
        }
        metadata
        isDefault
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              width
              height
              mimeType
            }
            small {
              url
              width
              height
              mimeType
            }
            medium {
              url
              width
              height
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              width
              height
              mimeType
            }
            small {
              height
              width
              url
              mimeType
            }
            medium {
              url
              width
              height
              mimeType
            }
          }
          __typename
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
           type
          }
          ... on RevertFollowModuleSettings {
           type
          }
      }
    }
  }
`

export default function Home() {
    const { loading, error, data } = useQuery(gql(RECOMMENDED_PROFILES), {
        variables: {},
        context: { isMainnet: true },
        fetchPolicy: 'no-cache',
    })
    useEffect(() => {
        if (!loading && !error) console.log(data)
    }, [loading, error, data])

    if (loading)
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    if (error)
        return (
            <div>
                <p>{`Error! ${error.message}`}</p>
            </div>
        )

    return (
        <></>
        // <div className="mt-24 ml-24 md:ml-64 xl:ml-80 mb-16 space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 md:gap-x-8 2xl:grid-cols-4">
        //     {data &&
        //         data.recommendedProfiles.map((profile) => (
        //             <ProfileCard
        //                 id={profile.id}
        //                 handle={profile.handle}
        //                 name={profile.name}
        //                 stats={profile.stats}
        //                 picture={profile.picture}
        //             />
        //         ))}
        // </div>
    )
}
