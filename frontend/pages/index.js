import { utils } from 'ethers'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import useLensAuth from '../hooks/useLensAuth'
import getRandomImage from '../utils/getRandomImage'
import sliceAddress from '../utils/sliceAddress'
import { PencilSquareIcon, PhotoIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { Web3Storage, File } from 'web3.storage'
import { v4 as uuidv4 } from 'uuid'
import useLensTimeline from '../hooks/useLensTimeline'
import useLensAuthentication from '../hooks/useLensAuthentication'
import useLensProfile from '../hooks/useLensProfile'

// const ADDRESS = '0x81617079A419ab4562b29A92181402BdF389a1fA' // my address
const ADDRESS = '0x01c20350ad8f434bedf6ea901203ac4cf7bca295' // whale address

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

function displayPostTime(createdAt) {
    const timestamp = Date.parse(createdAt)
    const date = new Date(timestamp)
    return date.toDateString()
}

export default function Feed() {
    // wagmi hooks
    const { address, isConnected } = useAccount()

    // Custom hooks
    const { loading: loadingLogin, isLoggedIn, login } = useLensAuthentication()
    const { loading: loadingProfile, hasProfile, profile } = useLensProfile()
    const { timeline, loading: loadingTimeline, error } = useLensTimeline()

    // Post Form
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')

    // UI
    const [ensAvatar, setEnsAvatar] = useState(getRandomImage())

    function makeStorageClient() {
        return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN })
    }

    function getFiles() {
        const fileInput = document.querySelector('input[type="file"]')
        return fileInput.files
    }

    async function storeFiles(files) {
        const client = makeStorageClient()
        const cid = await client.put(files)
        console.log('stored files with cid:', cid)
        return cid
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const files = getFiles()
        if (files.length >= 1) {
            try {
                const imageCid = await storeFiles(files)

                if (imageCid) {
                    console.log(content)
                    console.log('https://ipfs.io/ipfs/' + imageCid + '/' + image)

                    const uuid = uuidv4()

                    const metadata = {
                        version: '2.0.0',
                        mainContentFocus: 'TEXT_ONLY',
                        metadata_id: uuid,
                        description: content,
                        locale: 'en-US',
                        content: content,
                        external_url: null,
                        image: 'ipfs://' + imageCid + '/' + image,
                        imageMimeType: null,
                        name: 'Post by @' + profile.handle,
                        attributes: [],
                        tags: ['using_api_examples'],
                        appId: 'blubber_test',
                    }
                    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
                    const files = [
                        new File(['contents-of-post-' + uuid], 'plain-utf8.txt'),
                        new File([blob], 'metadata.json'),
                    ]
                    const metadataCid = await storeFiles(files)
                    console.log(metadataCid)

                    if (metadataCid) {
                        createPost('ipfs://' + metadataCid + '/metadata.json')
                    }
                }
            } catch (error) {
                console.log(error)
                return
            }
        } else {
            try {
                console.log(content)

                const uuid = uuidv4()

                const metadata = {
                    version: '2.0.0',
                    mainContentFocus: 'TEXT_ONLY',
                    metadata_id: uuid,
                    description: content,
                    locale: 'en-US',
                    content: content,
                    external_url: null,
                    image: null,
                    imageMimeType: null,
                    name: 'Post by @' + profile.handle,
                    attributes: [],
                    tags: ['using_api_examples'],
                    appId: 'api_examples_github',
                }
                const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
                const files = [new File([blob], 'metadata.json')]
                const metadataCid = await storeFiles(files)
                console.log(metadataCid)

                if (metadataCid) {
                    createPost('ipfs://' + metadataCid + '/metadata.json')
                }
            } catch (error) {
                console.log(error)
                return
            }
        }
    }

    if (loadingLogin || loadingProfile || loadingTimeline) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Loading...
                </div>
            </div>
        )
    }

    if (!isLoggedIn) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Login to Lens to access your timeline
                </div>
            </div>
        )
    }

    if (!hasProfile) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Create a profile and start playing with Lens
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex justify-center items-center py-8 p-16">
            <div className="w-full">
                {/* Profile */}
                <div className="mb-8 bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                    <div className="relative flex justify-start items-center">
                        {hasProfile && profile.imageUrl && (
                            <div className="h-56 w-56 rounded-xl filter brightness-110 dark:brightness-90">
                                <img
                                    src={profile.imageUrl}
                                    className="rounded-l-xl border-r border-gray-350 dark:border-gray-750"
                                    style={{
                                        width: 224,
                                        height: 224,
                                        objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/logos/user_profile.png'
                                        e.currentTarget.onerror = null
                                    }}
                                />
                            </div>
                        )}
                        <div className="h-full flex flex-col justify-between ml-4">
                            {/* Name + Address */}
                            <div className="mt-2">
                                <div className="text-xl font-semibold text-black dark:text-white">
                                    {hasProfile ? profile.handle : sliceAddress(ADDRESS)}
                                </div>
                                <div className="text-base font-light w-fit bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80">
                                    {sliceAddress(ADDRESS)}
                                </div>
                            </div>

                            {/* Bio */}
                            {hasProfile && profile.bio && (
                                <div className="w-[30rem]">{profile.bio}</div>
                            )}

                            {/* Followers + Following */}
                            <div className="flex flex-row mb-1.5">
                                <div className="flex flex-col justify-center items-start">
                                    <div className="text-xl font-semibold text-black dark:text-white">
                                        {hasProfile ? profile.totalFollowing : 0}
                                    </div>
                                    <div className="text-base font-light">Following</div>
                                </div>
                                <div className="flex flex-col justify-center items-start ml-4">
                                    <div className="text-xl font-semibold text-black dark:text-white">
                                        {hasProfile ? profile.totalFollowers : 0}
                                    </div>

                                    <div className="text-base font-light">Followers</div>
                                </div>
                            </div>
                        </div>
                        {/* Follow Button */}
                        {hasProfile && (
                            <button
                                className="absolute flex flex-row justify-center items-center top-2 right-2
                    text-green-600 dark:text-green-400/80 bg-green-100/50 dark:bg-green-900/50 border rounded-md px-3 py-1.5 border-green-600 dark:border-green-400/80"
                            >
                                <UserPlusIcon className="w-5 h-5 mr-1 font-semibold" />{' '}
                                <span className="text-sm font-semibold">Follow</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Create Post */}
                <div className="h-52 mb-8 bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                    <form onSubmit={handleSubmit} className="">
                        <div className="flex flex-col justify-start items-start m-5">
                            <textarea
                                className="z-30 h-28 w-full text-start bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-lg"
                                style={{ resize: 'none' }}
                                name="content"
                                id="content"
                                placeholder="What's happening?"
                                required={true}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className="w-full mt-3 flex flex-row justify-between items-center">
                                <input
                                    className="z-30 text-sm"
                                    type="file"
                                    name="file"
                                    id="file"
                                    required={false}
                                    onChange={(e) => {
                                        setImage(e.target.files[0].name)
                                        console.log(e.target.files[0].name)
                                    }}
                                />
                                <div className=" z-30 flex flex-row justify-center items-center text-gray-850 dark:text-gray-200">
                                    <PhotoIcon className=" z-20 w-7 h-7" />
                                    <span className="text-xs font-semibold ml-1">
                                        Uploaded into IPFS
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="z-50 rounded-lg px-6 py-2 text-gray-100 dark:text-gray-850 font-light text-base text-center
                                        bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80"
                                >
                                    <div className=" flex flex-row justify-center items-center">
                                        <PencilSquareIcon className="w-5 h-5 mr-1" />
                                        <span>Post</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Timeline */}
                <div className="bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                    {timeline &&
                        timeline.map((post, n) => (
                            <div key={post.id}>
                                <div
                                    className={`relative flex justify-start items-start w-full ${
                                        n != timeline.length - 1
                                            ? ' border-b border-gray-350 dark:border-gray-750'
                                            : ''
                                    }`}
                                >
                                    {/* Profile Image */}
                                    <div className="h-12 w-12 mt-5 ml-5">
                                        <img
                                            src={getUrl(post.profile.picture.original.url)}
                                            className="rounded-full border border-gray-350 dark:border-gray-400"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                objectFit: 'cover',
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.src = '/logos/user_profile.png'
                                                e.currentTarget.onerror = null
                                            }}
                                        />
                                    </div>

                                    {/* Content Div */}
                                    <div className="w-full mt-5 ml-3 flex flex-col justify-start items-start">
                                        {/* Name + Handle */}
                                        <div className="h-12 w-full flex flex-col justify-start items-start">
                                            <div className="font-semibold text-lg text-black dark:text-white">
                                                {post.profile.name
                                                    ? post.profile.name
                                                    : post.profile.handle}
                                            </div>
                                            <div className="w-fit font-light text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 dark:from-purple-300/70 dark:via-pink-300/70 dark:to-yellow-300/70">
                                                {'@' + post.profile.handle}
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        {post.metadata.content && (
                                            <div className="mt-6 font-normal text-gray-700 dark:text-gray-300">
                                                {post.metadata.content}
                                            </div>
                                        )}

                                        {/* Media Content */}
                                        {post.metadata.media.length >= 1 && (
                                            <div className="w-full mt-6 rounded-xl">
                                                <img
                                                    src={
                                                        post.metadata.media[0].original.url
                                                            ? getUrl(
                                                                  post.metadata.media[0].original
                                                                      .url
                                                              )
                                                            : '/images/file_not_found.jpeg'
                                                    }
                                                    className="rounded-xl"
                                                    style={{
                                                        objectFit: 'cover',
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            '/images/file_not_found.jpeg'
                                                        e.currentTarget.onerror = null
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Top-Right-Corner TimeStamp */}
                                        <div className="absolute top-0 right-0 mt-5 mr-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
                                            {displayPostTime(post.createdAt)}
                                        </div>

                                        {/* Bottom Padding */}
                                        <div className="h-5"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
