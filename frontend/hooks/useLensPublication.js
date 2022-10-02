import { useEffect, useState } from 'react'
import { useSignMessage, useSignTypedData, useSigner, useAccount } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import { decodeJwt } from 'jose'
import omitDeep from 'omit-deep'
import { Contract, ethers, utils } from 'ethers'

const LENS_HUB_CONTRACT = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
const LENS_HUB_ABI = require('../constants/abis/lens-hub-contract-abi.json')

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

export default function useLensPublication() {
    // wagmi hooks
    const { data: signer, isError, isLoading } = useSigner()

    const [createPostTypedData, { error }] = useMutation(gql(CREATE_POST_TYPED_DATA))
    const signTypeData = useSignTypedData()

    const [profile, setProfile] = useState({
        id: null,
        handle: null,
        name: null,
        bio: null,
        imageUrl: null,
        totalFollowers: null,
        totalFollowing: null,
    })

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

    useEffect(() => {}, [])

    return {
        createPost,
    }
}
