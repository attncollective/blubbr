import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import LensLoginButton from '../components/LensLoginButton'

const GET_PROFILES = `
  query($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
                followNftAddress
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
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`

export default function Home() {
    const { address, isConnected } = useAccount()

    const [getProfiles, {}] = useLazyQuery(gql(GET_PROFILES))

    async function getProfilesRequest() {
        let data
        try {
            data = await getProfiles({
                variables: {
                    request: {
                        ownedBy: [address],
                        limit: 1,
                    },
                },
            })
            console.log(data)
        } catch (err) {
            console.log(err)
            return
        }
    }

    return (
        <div className="w-full min-h-full z-10 flex justify-center items-center">
            {isConnected && (
                <div className="grid-cols-2 space-x-6">
                    <button
                        onClick={getProfilesRequest}
                        className="rounded px-8 py-4 bg-black dark:bg-white text-white dark:text-black"
                    >
                        Get Default Profile
                    </button>
                </div>
            )}
        </div>
    )
}
