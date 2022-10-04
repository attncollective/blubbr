import { createContext, useState, useContext } from 'react'
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
                <div style={{ zIndex: 50, position: 'relative' }}>
                    <div
                        style={{
                            zIndex: 50,
                            position: 'fixed',
                            top: '0px',
                            left: '0px',
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'rgb(0 0 0 / 0.5)',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <div
                            style={{
                                zIndex: 50,
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <CreateProfileModal
                                setShowCreateProfileModal={setShowCreateProfileModal}
                            />
                        </div>
                    </div>
                </div>
            )}
            {children}
        </LensContext.Provider>
    )
}

export const useLensContext = () => useContext(LensContext)
