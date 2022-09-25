import { useAccount, useSignMessage } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react'

const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`

const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`

const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`

const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
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

// basically if we have a URI we replace the gateway, otherwise we pass the url
function getUrl(uriOrUrl) {
    let url = uriOrUrl

    if (url && url.startsWith('ipfs://ipfs/')) {
        url = url.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/')
    } else if (url && url.startsWith('ipfs://')) {
        url = url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }

    return url
}

export default function LensLoginButton({ className = '', toggleCreateProfileModal }) {
    // wagmi hooks
    const { address, isConnected } = useAccount()

    // lens hooks
    const [verify, {}] = useLazyQuery(gql(VERIFY))
    const [generateChallenge, {}] = useLazyQuery(gql(GET_CHALLENGE))
    const { signMessageAsync } = useSignMessage()
    const [authenticate, {}] = useMutation(gql(AUTHENTICATION))
    const [refreshAuthentication, {}] = useMutation(gql(REFRESH_AUTHENTICATION))
    const [createProfile, {}] = useMutation(gql(CREATE_PROFILE))
    const [getProfiles, {}] = useLazyQuery(gql(GET_PROFILES))

    // UI
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [profile, setProfile] = useState(null)

    // fetch from the lens api to know if the user 'auth_token' is valid
    // -> if it is check if he already have a profile
    async function verifyAuth() {
        verify({
            variables: {
                request: {
                    accessToken: localStorage.getItem('auth_token'),
                },
            },
        })
            .then((data) => {
                if (data.data?.verify) {
                    setIsLoggedIn(true)
                    checkHasProfile()
                } else {
                    setIsLoggedIn(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setIsLoggedIn(false)
            })
    }

    // check if the user have at least 1 profile and take that as the default
    async function checkHasProfile() {
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
                    setProfile(data.data.profiles.items[0])
                } else {
                    setProfile(null)
                }
            })
            .catch((err) => {
                console.log(err)
                setProfile(null)
            })
    }

    async function login() {
        // check if the user already have an auth_token and if it's valid
        if (isLoggedIn) {
            console.log('Login: already logged in!')
            return
        }

        // we request a challenge from the server
        let message
        try {
            const data = await generateChallenge({
                variables: {
                    request: {
                        address: address,
                    },
                },
            })
            message = data.data.challenge.text
        } catch (err) {
            console.log(err)
            return
        }

        // sign the text with the wallet
        let signature
        try {
            signature = await signMessageAsync({
                message: message,
                onSuccess(signature, variables) {
                    // Verify signature when sign message succeeds
                    const recoveredAddress = verifyMessage(variables.message, signature)
                    if (recoveredAddress != address) {
                        throw new Error(
                            'Verify signature: ' + recoveredAddress + ' is != to ' + address
                        )
                    }
                },
            })
        } catch (err) {
            console.log(err)
            return
        }

        // get the authentication token
        try {
            await authenticate({
                variables: {
                    request: {
                        address: address,
                        signature: signature,
                    },
                },
                onCompleted(data) {
                    localStorage.setItem('auth_token', data.authenticate?.accessToken)
                    localStorage.setItem('refresh_token', data.authenticate?.refreshToken)
                    setAuthTokenTimeOut()
                    verifyAuth()
                },
            })
        } catch (err) {
            console.log(err)
            return
        }

        // check if the user already have a profile
        await checkHasProfile()
    }

    function decodeAuthToken(token) {
        const decodedToken = decodeJwt(token)
        return decodedToken.exp
    }

    function setAuthTokenTimeOut() {
        const expTime = decodeAuthToken(localStorage.getItem('auth_token'))
        const nowTime = Date.now()
        const offsetTime = expTime <= nowTime ? 1 : expTime - nowTime

        setTimeout(() => {
            refreshAuth()
        }, offsetTime)
    }

    async function refreshAuth() {
        try {
            await refreshAuthentication({
                variables: {
                    request: {
                        refreshToken: localStorage.getItem('refresh_token'),
                    },
                },
                onCompleted(data) {
                    localStorage.setItem('auth_token', data.refresh?.accessToken)
                    localStorage.setItem('refresh_token', data.refresh?.refreshToken)
                    verifyAuth()
                },
            })
        } catch (err) {
            console.log(err)
            return
        }
    }

    async function createProfileRequest() {
        let data
        try {
            data = await createProfile({
                variables: {
                    request: {
                        handle: 'ERC721_holder',
                        profilePictureUri:
                            'ipfs://QmagwBz95CziFf8TaVH4GYL5Qo5Q4UGgRcMfLpknmwcLEd/3.png',
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
            console.log(data)
        } catch (err) {
            console.log(err)
            return
        }
    }

    useEffect(() => {
        verifyAuth()
    }, [])

    return (
        <div className={`${className}`}>
            {isConnected && (
                <div className="flex gap-3 h-[44px]">
                    {!isLoggedIn && (
                        <button
                            onClick={login}
                            className="px-3 xs:px-6 py-2 bg-gray-200 dark:bg-gray-850
                        text-xs xs:text-sm font-normal xs:font-medium rounded-md
                        drop-shadow-md dark:drop-shadow-lg hover:scale-105"
                        >
                            Login
                        </button>
                    )}
                    {isLoggedIn && !profile && (
                        <button
                            onClick={toggleCreateProfileModal}
                            className="px-3 xs:px-6 py-2 bg-gray-200 dark:bg-gray-850
                        text-xs xs:text-sm font-normal xs:font-medium rounded-md
                        drop-shadow-md dark:drop-shadow-lg hover:scale-105"
                        >
                            Create Profile
                        </button>
                    )}

                    {profile && (
                        <div className="h-12 w-12">
                            <img
                                src={getUrl(profile.picture.original.url)}
                                className="rounded-full"
                                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            ></img>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
