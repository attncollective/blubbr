import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import useLensProfile from '../hooks/useLensProfile'
import Image from 'next/image'

export default function CreateProfileModal({ showCreateProfileModal, setShowCreateProfileModal }) {
    // Lens hooks
    const { createLensProfile } = useLensProfile()

    // Form
    const [handle, setHandle] = useState('')
    const [profilePictureUri, setProfilePictureUri] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        await createLensProfile()
    }

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

    return (
        <div className="w-96 relative bg-white dark:bg-modals-dark rounded-xl shadow drop-shadow-md dark:drop-shadow-lg modal-popup">
            <div className="">
                <div className="flex justify-between items-center mb-4 py-2 px-4 md:py-3.5 md:px-8 border-b border-gray-300 dark:border-gray-600">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        <Image
                            src="/logos/lens_logo.png"
                            className="invert dark:invert-0"
                            layout="fixed"
                            width={16}
                            height={16}
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

                <form onSubmit={handleSubmit} className="space-y-6 py-2 px-4 md:py-3 md:px-6 mb-2">
                    <div className="flex items-center">
                        <label
                            htmlFor="handle"
                            className=" w-28 block text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-300 dark:bg-modals-dark-3 p-2.5 rounded-l-lg border border-gray-300 dark:border-modals-dark-3"
                        >
                            Handle
                        </label>
                        <input
                            type="text"
                            name="handle"
                            id="handle"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-modals-dark-2 dark:border-modals-dark-3 dark:placeholder-gray-400 dark:text-white"
                            placeholder="handle.lens"
                            required={true}
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center">
                        <label
                            htmlFor="profilePictureUri"
                            className=" w-28 block text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-300 dark:bg-modals-dark-3 p-2.5 rounded-l-lg border border-gray-300 dark:border-modals-dark-3"
                        >
                            Profile
                        </label>
                        <input
                            type="url"
                            name="profilePictureUri"
                            id="profilePictureUri"
                            placeholder="ipfs://contentID"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-modals-dark-2 dark:border-modals-dark-3 dark:placeholder-gray-400 dark:text-white"
                            required={true}
                            value={profilePictureUri}
                            onChange={(e) => setProfilePictureUri(e.target.value)}
                        />
                    </div>
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
