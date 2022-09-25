import { utils } from 'ethers'
import { useState, useEffect } from 'react'
import TokenCard from '../components/TokenCard'
import { useAccount } from 'wagmi'
import useLensAuth from '../hooks/useLensAuth'
import getRandomImage from '../utils/getRandomImage'
import sliceAddress from '../utils/sliceAddress'
import { PencilSquareIcon, PhotoIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { gql, useLazyQuery, useQuery } from '@apollo/client'

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
    const { address, isConnected } = useAccount()
    const [login, { loading, isLoggedIn, hasProfile, profile, timeline, timelineLoading }] =
        useLensAuth(address)

    const [content, setContent] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
    }

    if (!isLoggedIn) {
        return (
            <div className="w-full mt-40 ml-24 md:ml-64 xl:ml-80 mb-16">
                <div className="w-full h-full flex justify-center items-center">
                    Login to view the timeline
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mt-40 ml-24 md:ml-64 xl:ml-80 mb-16">
            <div className="w-full flex justify-center items-center px-16">
                <div className="w-full">
                    {/* Create Post */}
                    <div className="h-52 mb-8 bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                        <form onSubmit={handleSubmit} className="">
                            <div className="flex flex-col justify-start items-start m-5">
                                <textarea
                                    className=" h-28 w-full text-start bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-lg"
                                    style={{ resize: 'none' }}
                                    name="content"
                                    id="content"
                                    placeholder="What's happening?"
                                    required={true}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div className="w-full mt-3 flex flex-row justify-between items-start">
                                    <div>
                                        <PhotoIcon className="w-7 h-7" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="rounded-lg px-6 py-2 text-gray-100 dark:text-gray-850 font-light text-base text-center
                                        bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80"
                                    >
                                        <div className="flex flex-row justify-center items-center">
                                            <PencilSquareIcon className="w-5 h-5 mr-1" />
                                            <span clas>Post</span>
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
                                                                      post.metadata.media[0]
                                                                          .original.url
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
        </div>
    )
}
