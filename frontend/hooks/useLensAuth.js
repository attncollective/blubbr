import { useEffect, useState } from 'react'
import { useSignMessage, useSignTypedData, useSigner, useAccount } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import { decodeJwt } from 'jose'
import omitDeep from 'omit-deep'
import { Contract, ethers, utils } from 'ethers'

const LENS_HUB_CONTRACT = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
const LENS_HUB_ABI = require('../constants/abis/lens-hub-contract-abi.json')

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

const TIMELINE = `
query timeline($request: TimelineRequest!) {
  timeline(request: $request) {
    items {
      __typename
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

fragment MediaFields on Media {
  url
  mimeType
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
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
    ...FollowModuleFields
  }
}

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
  }
  attributes {
    displayType
    traitType
    value
  }
}

fragment Erc20Fields on Erc20 {
  name
  symbol
  decimals
  address
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  collectedBy {
    ...WalletFields
  }
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment MirrorBaseFields on Mirror {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  hasCollectedByMe
}

fragment MirrorFields on Mirror {
  ...MirrorBaseFields
  mirrorOf {
   ... on Post {
      ...PostFields          
   }
   ... on Comment {
      ...CommentFields          
   }
  }
}

fragment CommentBaseFields on Comment {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  collectedBy {
    ...WalletFields
  }
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment CommentFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
      ...MirrorBaseFields
      mirrorOf {
        ... on Post {
           ...PostFields          
        }
        ... on Comment {
           ...CommentMirrorOfFields        
        }
      }
    }
  }
}

fragment CommentMirrorOfFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
       ...MirrorBaseFields
    }
  }
}

fragment WalletFields on Wallet {
   address,
   defaultProfile {
    ...ProfileFields
   }
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
      }
      value
    }
    recipient
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
  }
}

fragment CollectModuleFields on CollectModule {
  __typename
  ... on FreeCollectModuleSettings {
    type
    followerOnly
    contractAddress
  }
  ... on FeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on RevertCollectModuleSettings {
    type
  }
  ... on TimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on UnknownCollectModuleSettings {
    type
    contractAddress
    collectModuleReturnData
  }
}

fragment ReferenceModuleFields on ReferenceModule {
  ... on FollowOnlyReferenceModuleSettings {
    type
    contractAddress
  }
  ... on UnknownReferenceModuleSettings {
    type
    contractAddress
    referenceModuleReturnData
  }
  ... on DegreesOfSeparationReferenceModuleSettings {
    type
    contractAddress
    commentsRestricted
    mirrorsRestricted
    degreesOfSeparation
  }
}
`

const CREATE_POST_TYPED_DATA = `
mutation CreatePostTypedData($request: CreatePublicPostRequest!) {
  createPostTypedData(request: $request) {
    id
    expiresAt
    typedData {
      types {
        PostWithSig {
          name
          type
        }
      }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
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

export default function useLensAuth() {
    // wagmi hooks
    const { data: signer, isError, isLoading } = useSigner()
    const { address, isConnected } = useAccount()

    // lens hooks
    const [verify, {}] = useLazyQuery(gql(VERIFY))
    const [generateChallenge, {}] = useLazyQuery(gql(GET_CHALLENGE))
    const { signMessageAsync } = useSignMessage()
    const [authenticate, {}] = useMutation(gql(AUTHENTICATION))
    const [refreshAuthentication, {}] = useMutation(gql(REFRESH_AUTHENTICATION))
    const [getProfiles, {}] = useLazyQuery(gql(GET_PROFILES))
    const [getTimeline, {}] = useLazyQuery(gql(TIMELINE))
    const [createPostTypedData, { error }] = useMutation(gql(CREATE_POST_TYPED_DATA))
    const signTypeData = useSignTypedData()

    // Login
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loadingLogin, setloadingLogin] = useState(false)

    // Profile
    const [hasProfile, setHasProfile] = useState(false)
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [profile, setProfile] = useState({
        id: null,
        handle: null,
        name: null,
        bio: null,
        imageUrl: null,
        totalFollowers: null,
        totalFollowing: null,
    })

    // Timeline
    const [timeline, setTimeline] = useState(null)
    const [timelineLoading, setTimelineLoading] = useState(false)

    // fetch from the lens api to know if the user 'auth_token' is valid
    async function verifyAuth() {
        setloadingLogin(true)

        // no 'auth_token' means not logged in
        if (!localStorage.getItem('auth_token')) {
            setIsLoggedIn(false)
            setloadingLogin(false)
            return
        }

        // else we verify the 'auth_token'
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
                    setloadingLogin(false)
                } else {
                    setIsLoggedIn(false)
                    setloadingLogin(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setIsLoggedIn(false)
                setloadingLogin(false)
            })
    }

    // check if the user have at least 1 profile and take that as the default
    async function checkHasProfile() {
        setLoadingProfile(true)
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
                    setLoadingProfile(false)
                } else {
                    setHasProfile(false)
                    setLoadingProfile(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setHasProfile(false)
                setLoadingProfile(false)
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
                    checkHasProfile()
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
                    checkHasProfile()
                },
            })
        } catch (err) {
            console.log(err)
            return
        }
    }

    async function createPost(contentURI) {
        let result
        try {
            result = await createPostTypedData({
                variables: {
                    request: {
                        profileId: profile.id,
                        contentURI: contentURI,
                        collectModule: {
                            freeCollectModule: {
                                followerOnly: false,
                            },
                        },
                        referenceModule: {
                            followerOnlyReferenceModule: false,
                        },
                    },
                },
                fetchPolicy: 'no-cache',
                onCompleted(data) {
                    console.log(data)
                },
                onError(error) {
                    console.log(error)
                },
            })
        } catch (err) {
            console.log(err)
            return
        }

        if (!result || !result.data.createPostTypedData) {
            return
        }

        const typedData = result.data.createPostTypedData.typedData
        console.log('create post: typedData', typedData)

        // sign the typed data
        let signature
        try {
            signature = await signTypeData.signTypedDataAsync({
                domain: omitDeep(typedData.domain, '__typename'),
                types: omitDeep(typedData.types, '__typename'),
                value: omitDeep(typedData.value, '__typename'),
                onSuccess(data) {
                    console.log('Success', data)
                },
            })
        } catch (err) {
            console.log(err)
            return
        }
        const { v, r, s } = utils.splitSignature(signature)

        const lensHub = new ethers.Contract(LENS_HUB_CONTRACT, LENS_HUB_ABI, signer)

        const tx = await lensHub.postWithSig({
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        })
        console.log('create post: tx hash', tx.hash)
    }

    async function getProfileTimeline() {
        setTimelineLoading(true)
        getTimeline({
            variables: {
                request: {
                    profileId: profile.id,
                    limit: 10,
                },
            },
        })
            .then((data) => {
                if (data.data && data.data.timeline && data.data.timeline.items) {
                    console.log(data)
                    setTimeline(data.data.timeline.items)
                }
                setTimelineLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setTimelineLoading(false)
            })
    }

    useEffect(() => {
        verifyAuth()
        checkHasProfile()
    }, [])

    // useEffect(() => {
    //     if (hasProfile && !timelineLoading) {
    //         getProfileTimeline()
    //     }
    // }, [hasProfile])

    useEffect(() => {
        if (error) {
            console.log(error.graphQLErrors)
            console.log(error.clientErrors)
            console.log(error.networkError)
        }
    }, [error])

    return {
        login,
        createPost,
        isLoggedIn,
        loadingLogin,
        hasProfile,
        loadingProfile,
        profile,
        timeline,
        timelineLoading,
    }
}
