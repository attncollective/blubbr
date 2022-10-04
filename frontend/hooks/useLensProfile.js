import { useEffect, useState } from 'react'
import { useSignMessage, useSignTypedData, useSigner, useAccount } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useLensContext } from '../context/LensProvider'
import { uploadIpfsBuffer } from '../ipfs'

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

const CREATE_PROFILE = `
  mutation($request: CreateProfileRequest!) { 
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
            __typename
    }
 }
`

// basically if we have a URI we replace the gateway, otherwise we pass the url
function getUrl(uriOrUrl) {
    if (!uriOrUrl || typeof uriOrUrl != 'string') return

    let url = uriOrUrl

    if (url && url.startsWith('ipfs://ipfs/')) {
        url = url.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/')
    } else if (url && url.startsWith('ipfs://')) {
        url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }

    return url
}

export default function useLensProfile() {
    // wagmi hooks
    const { address, isConnected } = useAccount()

    // lens hooks
    const [getProfiles, {}] = useLazyQuery(gql(GET_PROFILES))
    const [createProfile, { data, error }] = useMutation(gql(CREATE_PROFILE), {
        onCompleted(data) {},
        onError({ graphQLErrors, networkError, clientErrors, message }) {},
    })

    // import the variables from the context
    const {
        isLoggedIn,
        loadingProfile: loading,
        setLoadingProfile: setLoading,
        hasProfile,
        setHasProfile,
        profile,
        setProfile,
        showCreateProfileModal,
        setShowCreateProfileModal,
    } = useLensContext()

    // check if the user have at least 1 profile and take that as the default
    async function checkHasProfile() {
        // check if the user's wallet is connected
        if (!isConnected) {
            console.log('Profile: you need to connect your wallet first!')
            return
        }

        setLoading(true)

        getProfiles({
            variables: {
                request: {
                    ownedBy: [address],
                    limit: 1,
                },
            },
        })
            .then((data) => {
                if (data.data?.profiles?.items?.length >= 1) {
                    // grab the first profile
                    const profileData = data.data.profiles.items[0]

                    const newProfile = {
                        id: profileData.id,
                        handle: profileData.handle,
                        name: profileData.name,
                        bio: profileData.bio,
                        imageUrl: getUrl(profileData.picture.original.url),
                        totalFollowers: profileData.stats.totalFollowers,
                        totalFollowing: profileData.stats.totalFollowing,
                    }
                    setProfile(newProfile)
                    setHasProfile(true)
                    setLoading(false)
                } else {
                    setHasProfile(false)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setHasProfile(false)
                setLoading(false)
            })
    }

    async function createLensProfile(handle, imageBuffer) {
        const ipfsImageResult = await uploadIpfsBuffer(imageBuffer)
        console.log('create post: ipfs result', ipfsImageResult)

        const createProfileResult = await createProfile({
            variables: {
                request: {
                    handle: handle,
                    profilePictureUri: 'ipfs://' + ipfsImageResult.path,
                    followNFTURI: null,
                    followModule: null,
                },
            },
            context: {
                headers: {
                    'x-access-token': localStorage.getItem('auth_token')
                        ? `Bearer ${localStorage.getItem('auth_token')}`
                        : '',
                },
            },
        })
        console.log('create profile: result', createProfileResult)

        if (createProfileResult.data.createProfile.__typename === 'RelayError') {
            console.error('create profile: failed')
            return
        }
    }

    function openCreateProfileModal() {
        setShowCreateProfileModal(true)
    }

    useEffect(() => {
        if (isConnected && isLoggedIn) checkHasProfile()
    }, [isConnected, isLoggedIn, hasProfile])

    return {
        loading,
        hasProfile,
        profile,
        checkHasProfile,
        openCreateProfileModal,
        createLensProfile,
    }
}
