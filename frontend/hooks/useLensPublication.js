import { useEffect, useState } from 'react'
import { useSignMessage, useSignTypedData, useSigner, useAccount } from 'wagmi'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import { decodeJwt } from 'jose'
import omitDeep from 'omit-deep'
import { Contract, ethers, utils } from 'ethers'
import { uploadIpfsJson, uploadIpfsBuffer } from '../ipfs'
import { v4 as uuidv4 } from 'uuid'
import { useLensContext } from '../context/LensProvider'

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

export default function useLensPublication() {
    // wagmi hooks
    const { data: signer, isError, isLoading } = useSigner()

    const [createPostTypedData, { error }] = useMutation(gql(CREATE_POST_TYPED_DATA))
    const signTypeData = useSignTypedData()

    // import the variables from the context
    const { profile } = useLensContext()

    async function createPost({ content, imageBuffer, imageExtension }) {
        let media

        if (imageBuffer && imageExtension) {
            const ipfsImageResult = await uploadIpfsBuffer(imageBuffer)
            console.log('create post: ipfs result', ipfsImageResult)

            media = [{ item: 'ipfs://' + ipfsImageResult.path, type: 'image/' + imageExtension }]
        } else {
            media = null
        }
        const mainContentFocus = content ? (media ? 'EMBED' : 'TEXT_ONLY') : 'IMAGE'

        // upload the metadata to IPFS
        const ipfsResult = await uploadIpfsJson({
            version: '2.0.0',
            mainContentFocus: mainContentFocus,
            metadata_id: uuidv4(),
            description: 'Description',
            locale: 'en-US',
            content: content,
            external_url: null,
            image: null,
            imageMimeType: null,
            media: media,
            name: 'Name',
            attributes: [],
            tags: ['blubbr'],
            appId: 'blubbr',
        })
        console.log('create post: ipfs result', ipfsResult)

        const result = await createPostTypedData({
            variables: {
                request: {
                    profileId: profile.id,
                    contentURI: 'ipfs://' + ipfsResult.path,
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
            onError(error) {
                console.log(error)
            },
        })
        console.log('create post: createPostTypedData', result)

        const typedData = result.data.createPostTypedData.typedData
        console.log('create post: typedData', typedData)

        const signature = await signTypeData.signTypedDataAsync({
            domain: omitDeep(typedData.domain, '__typename'),
            types: omitDeep(typedData.types, '__typename'),
            value: omitDeep(typedData.value, '__typename'),
        })
        console.log('create post: signature', signature)

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
