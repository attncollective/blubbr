import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import sliceAddress from '../utils/sliceAddress'
import {
    DocumentPlusIcon,
    GifIcon,
    GlobeAltIcon,
    PencilSquareIcon,
    PhotoIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline'
import useLensTimeline from '../hooks/useLensTimeline'
import useLensAuthentication from '../hooks/useLensAuthentication'
import useLensProfile from '../hooks/useLensProfile'
import useLensPublication from '../hooks/useLensPublication'
import { getExtension } from '../utils/handleExtension'

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
    const { address, isConnected, isConnecting } = useAccount()

    // Custom hooks
    const { loading: loadingLogin, isLoggedIn, login } = useLensAuthentication()
    const { loading: loadingProfile, hasProfile, profile } = useLensProfile()
    const { timeline, loading: loadingTimeline, error } = useLensTimeline()
    const { createPost } = useLensPublication()

    // Post Form
    const [content, setContent] = useState('')
    const [imageURL, setImageURL] = useState(null)
    const [imageBuffer, setImageBuffer] = useState(null)
    const [imageExtension, setImageExtension] = useState(null)

    const [mounted, setMounted] = useState(false)

    function captureFile(event) {
        if (event.target.files[0]) {
            event.preventDefault()

            // check the extension - only images allowed
            const fileExtension = getExtension(event.target.files[0].name)
            if (!['jpeg', 'png', 'webp', 'tiff'].includes(fileExtension)) {
                console.log('CaptureFile: File must be an image')
                return
            }

            // set the ImageURL to display the image
            setImageURL(URL.createObjectURL(event.target.files[0]))

            // set the Buffer to upload it to IPFS
            const reader = new FileReader()
            reader.readAsArrayBuffer(event.target.files[0])
            reader.addEventListener('load', () => {
                setImageBuffer(reader.result)
            })

            // set the imageExtension
            setImageExtension(fileExtension)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (content != '' && !imageURL) {
            // TEXT post
            createPost({ content: content })
            console.log('HanldeSubmit: TEXT post')
        } else if (content == '' && imageURL && imageBuffer && imageExtension) {
            // IMAGE post
            createPost({ imageBuffer: imageBuffer, imageExtension: imageExtension })
            console.log('HanldeSubmit: IMAGE post')
        } else if (content != '' && imageURL && imageBuffer && imageExtension) {
            // IMAGE + TEXT post
            createPost({
                content: content,
                imageBuffer: imageBuffer,
                imageExtension: imageExtension,
            })
            console.log('HanldeSubmit: IMAGE + TEXT post')
        } else {
            console.log('handleSubmit: You need at least one thing to post!')
            return
        }
    }

    useEffect(() => {
        if (timeline) console.log(timeline)
    }, [timeline])

    useEffect(() => {
        if (!mounted) setMounted(true)
    }, [mounted])

    if (!mounted || loadingLogin || loadingProfile || loadingTimeline || isConnecting) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Loading...
                </div>
            </div>
        )
    }

    if (!isConnected) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Connect your Wallet
                </div>
            </div>
        )
    }

    if (!isLoggedIn) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Login to Lens to interact with your Frens
                </div>
            </div>
        )
    }

    if (!hasProfile) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="z-20 text-xl font-light text-gray-800 dark:text-gray-100">
                    Create a profile to interact with your Frens
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
        <div className="w-full min-h-screen flex flex-col justify-start items-center py-8 p-16">
            <div className="w-full">
                {/* Profile */}
                <div className="mb-8 bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                    <div className="relative h-56 flex flex-row justify-start items-center">
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
                                    alt=""
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
                        {/* {hasProfile && (
                            <button
                                className="absolute flex flex-row justify-center items-center top-2 right-2
                    text-green-600 dark:text-green-400/80 bg-green-100/50 dark:bg-green-900/50 border rounded-md px-3 py-1.5 border-green-600 dark:border-green-400/80"
                            >
                                <UserPlusIcon className="w-5 h-5 mr-1 font-semibold" />{' '}
                                <span className="text-sm font-semibold">Follow</span>
                            </button>
                        )} */}
                    </div>
                </div>

                {/* Create Post */}
                <div className="min-h-52 mb-8 bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                    <form onSubmit={handleSubmit} className="">
                        <div className="flex flex-col justify-start items-start m-4">
                            {/* - Text Input - */}
                            <textarea
                                className="z-10 h-28 w-full text-start bg-white/50 dark:bg-black/30 border border-gray-350 dark:border-gray-750 rounded-lg"
                                style={{ resize: 'none' }}
                                name="content"
                                id="content"
                                placeholder="What's happening?"
                                required={false}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className="w-full mt-3 flex flex-row justify-between items-start">
                                <div className="flex flex-row justify-start items-start space-x-3">
                                    {/* - Image Input  - */}
                                    <div className="z-10">
                                        <label
                                            className={`cursor-pointer flex flex-row justify-center items-center hover:text-black hover:dark:text-white ${
                                                imageURL
                                                    ? 'text-black dark:text-white'
                                                    : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                        >
                                            <input
                                                className="hidden"
                                                type="file"
                                                name="file"
                                                id="file"
                                                required={false}
                                                onChange={captureFile}
                                            />
                                            <PhotoIcon className="w-7 h-7" />
                                            {imageURL && (
                                                <span className="text-xs font-semibold ml-1">
                                                    Image Selected
                                                </span>
                                            )}
                                        </label>
                                        {imageURL && (
                                            <img
                                                src={imageURL}
                                                alt=""
                                                className="max-h-[160px] max-w-[125px] h-auto w-auto mt-1 rounded-md"
                                            />
                                        )}
                                    </div>

                                    {/* - GIF Input  - */}
                                    <div className="z-10">
                                        <label className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-black hover:dark:text-white">
                                            <GifIcon className="w-7 h-7" />
                                        </label>
                                    </div>

                                    {/* - Generic Input  - */}
                                    <div className="z-10">
                                        <label className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-black hover:dark:text-white">
                                            <DocumentPlusIcon className="w-6 h-6" />
                                        </label>
                                    </div>

                                    {/* - Something else  - */}
                                    <div className="z-10">
                                        <label className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-black hover:dark:text-white">
                                            <GlobeAltIcon className="w-6 h-6" />
                                        </label>
                                    </div>
                                </div>

                                {/* - Post Button - */}
                                <button
                                    type="submit"
                                    className="z-10 rounded-lg px-6 py-2 text-gray-100 dark:text-gray-850 font-light text-base text-center
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

                {/* - User doesn't have content on Timeline - */}
                {timeline && timeline.length == 0 && (
                    <div className="z-20 w-full h-64 flex flex-col justify-center items-center text-xl font-light text-gray-800 dark:text-gray-100">
                        No Posts yet
                    </div>
                )}

                {/* - User have content on Timeline - */}
                {timeline && timeline.length > 0 && (
                    <div className="bg-gray-100 dark:bg-gray-850 border border-gray-350 dark:border-gray-750 rounded-xl shadow-lg dark:shadow-xl">
                        {timeline.map((post, n) => (
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
                                            alt=""
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
                                                    className="max-h-[512px] max-w-[1024px] h-auto w-auto rounded-xl"
                                                    alt=""
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
                )}
            </div>
        </div>
    )
}
