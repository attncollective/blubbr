import { XMarkIcon } from '@heroicons/react/24/outline'
import { createContext, useState, useContext } from 'react'
import { Dialog } from '@headlessui/react'
import CreateProfileModal from '../components/CreateProfileModal'

const LensContext = createContext()

export default function LensProvider({ children }) {
    // Login
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)

    // Profile
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [hasProfile, setHasProfile] = useState(false)
    const [profile, setProfile] = useState({
        id: null,
        handle: null,
        name: null,
        bio: null,
        imageUrl: null,
        totalFollowers: null,
        totalFollowing: null,
    })
    const [showCreateProfileModal, setShowCreateProfileModal] = useState(false)
    function toggleCreateProfileModal() {
        setShowCreateProfileModal(!showCreateProfileModal)
    }

    // Timeline
    const [timeline, setTimeline] = useState(null)
    const [loadingTimeline, setLoadingTimeline] = useState(false)
    const [timelineError, setTimelineError] = useState(null)

    return (
        <LensContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                loginLoading,
                setLoginLoading,
                loadingProfile,
                setLoadingProfile,
                hasProfile,
                setHasProfile,
                profile,
                setProfile,
                showCreateProfileModal,
                setShowCreateProfileModal,
                loadingTimeline,
                setLoadingTimeline,
                timeline,
                setTimeline,
                timelineError,
                setTimelineError,
            }}
        >
            {showCreateProfileModal && (
                <div className="relative">
                    <div className="z-50 fixed top-0 left-0 h-full w-full">
                        <div className="w-full h-full flex justify-center items-center bg-black/50 dark:bg-black-70 backdrop-blur-sm">
                            <div className="w-full h-full flex justify-center items-center">
                                <CreateProfileModal
                                    setShowCreateProfileModal={setShowCreateProfileModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </LensContext.Provider>
    )
}

export const useLensContext = () => useContext(LensContext)
