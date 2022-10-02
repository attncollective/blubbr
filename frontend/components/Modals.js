import { XMarkIcon } from '@heroicons/react/24/outline'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import Alert from './Alert'

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

export default function Modals({ showCreateProfileModal, toggleCreateProfileModal }) {
    // form variables
    const [handle, setHandle] = useState('')
    const [profilePictureUri, setProfilePictureUri] = useState('')

    // lens hooks
    const [createProfile, { data, error }] = useMutation(gql(CREATE_PROFILE), {
        onCompleted(data) {},
        onError({ graphQLErrors, networkError, clientErrors, message }) {},
    })

    async function createProfileRequest() {
        let data
        try {
            data = await createProfile({
                variables: {
                    request: {
                        handle: handle,
                        profilePictureUri: profilePictureUri,
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
            console.log(data)
            return
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        await createProfileRequest()
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
        <div>
            {showCreateProfileModal && (
                <div
                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 z-50 w-full h-full min-h-full inset-0 justify-center items-center
                 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                >
                    {/* Unsuccess Alert messages */}
                    {error && (
                        <Alert
                            alertType={'failed'}
                            alertBody={'create profile error'}
                            triggerAlert={true}
                            color={'palevioletred'}
                        />
                    )}

                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-96 relative bg-white rounded-xl shadow dark:bg-modals-dark drop-shadow-md dark:drop-shadow-lg modal-popup">
                            <button
                                onClick={toggleCreateProfileModal}
                                className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-750 dark:hover:text-white"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <div className="py-4 px-4 lg:py-6 lg:px-6">
                                <div className="flex justify-center items-center mb-4">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Create Profile
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="w-full rounded-lg px-5 py-2.5 text-white font-medium text-sm text-center
                                        bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80"
                                    >
                                        Create your profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
