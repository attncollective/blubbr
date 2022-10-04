import { AtSymbolIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CursorArrowRaysIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import useLensProfile from '../hooks/useLensProfile'
import Image from 'next/image'
import { getExtension } from '../utils/handleExtension'

export default function CreateProfileModal({ showCreateProfileModal, setShowCreateProfileModal }) {
    // Lens hooks
    const { createLensProfile } = useLensProfile()

    // Form
    const [handle, setHandle] = useState('')
    const [imageName, setImageName] = useState(null)
    const [imageURL, setImageURL] = useState(null)
    const [imageBuffer, setImageBuffer] = useState(null)
    const [imageExtension, setImageExtension] = useState(null)

    function parseApolloError() {
        if (error.graphQLErrors.length > 0) {
            return error.graphQLErrors[0]
        } else if (error.networkError.length > 0) {
            return error.networkError[0]
        } else if (error.clientErrors.length > 0) {
            return error.clientErrors[0]
        } else {
            return error.message
        }
    }

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

            // set the imageExtension and Name
            setImageExtension(fileExtension)
            setImageName(event.target.files[0].name)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        await createLensProfile(handle, imageBuffer)
    }

    return (
        <div className="w-96 bg-white dark:bg-modals-dark rounded-xl shadow drop-shadow-md dark:drop-shadow-lg modal-popup">
            <div className="flex flex-col">
                {/* - Top Bar - */}
                <div className="flex justify-between items-center mb-4 py-2 px-4 md:py-3.5 md:px-8 border-b border-gray-300 dark:border-gray-600">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        <Image
                            src="/logos/lens_logo.png"
                            className="invert dark:invert-0"
                            layout="fixed"
                            width={16}
                            height={16}
                            alt=""
                        />
                        <span className="ml-1">Create Profile</span>
                    </div>
                    <button
                        onClick={() => setShowCreateProfileModal(false)}
                        className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-transparent hover:bg-gray-200 dark:hover:bg-black/10 rounded-lg text-sm p-1 inline-flex items-center"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* - Form - */}
                <form
                    className="flex flex-col space-y-6 py-2 px-4 md:py-3 md:px-6 mb-2"
                    onSubmit={handleSubmit}
                >
                    {/* - Handle Input - */}
                    <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-200">
                            Choose your profile handle:
                        </div>
                        <div className="flex flex-row items-center mt-1.5">
                            <label
                                htmlFor="handle"
                                className="w-[46px] h-[42px] flex justify-center items-center text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-300 dark:bg-modals-dark-3 rounded-l-lg border border-gray-300 dark:border-modals-dark-3"
                            >
                                <AtSymbolIcon className="w-4 h-4" />
                            </label>
                            <input
                                type="text"
                                name="handle"
                                id="handle"
                                className="bg-gray-50 border-r border-y border-gray-300 text-gray-900 text-sm rounded-r-lg block w-full p-2.5 dark:bg-modals-dark-2 dark:border-modals-dark-3 dark:placeholder-gray-400 dark:text-white"
                                placeholder="handle.lens"
                                required={true}
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* - Avatar Input - */}
                    <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-200">
                            Choose your avatar image:
                        </div>
                        <div className="flex flex-row items-center mt-1.5">
                            <div
                                className={`w-[46px] h-[42px] flex justify-center items-center text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-300 dark:bg-modals-dark-3 rounded-l-lg ${
                                    !imageURL && 'border border-gray-300 dark:border-modals-dark-3'
                                }`}
                            >
                                {imageURL ? (
                                    <img
                                        src={imageURL}
                                        alt=""
                                        style={{
                                            width: 46,
                                            height: 42,
                                            objectFit: 'cover',
                                        }}
                                        className="rounded-l-lg"
                                    />
                                ) : (
                                    <UserCircleIcon className="w-5 h-5" />
                                )}
                            </div>
                            <label
                                htmlFor="avatarImage"
                                className="cursor-pointer block w-full p-2.5 bg-gray-50 border-r border-y border-gray-300 text-gray-900 text-sm rounded-r-lg dark:bg-modals-dark-2 dark:border-modals-dark-3 dark:placeholder-gray-400 dark:text-white"
                            >
                                {imageURL ? (
                                    <div className="flex flex-row justify-start items-center text-sm text-gray-600 dark:text-gray-200">
                                        {imageName}
                                    </div>
                                ) : (
                                    <div className="flex flex-row justify-start items-center text-sm text-gray-500 dark:text-gray-400">
                                        upload to IPFS{' '}
                                        <CursorArrowRaysIcon className="w-4 h-4 ml-1" />
                                    </div>
                                )}

                                <input
                                    className="hidden"
                                    type="file"
                                    name="avatarImage"
                                    id="avatarImage"
                                    required={false}
                                    onChange={captureFile}
                                />
                            </label>
                        </div>
                    </div>

                    {/* - Create Profile Button - */}
                    <button
                        type="submit"
                        className="w-full rounded-lg px-5 py-2.5 text-white dark:text-modals-dark font-light text-normal text-center
                                        bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-yellow-500/80 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80"
                    >
                        Create your profile
                    </button>
                </form>
            </div>
        </div>
    )
}
