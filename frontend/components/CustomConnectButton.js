import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { WalletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useLensAuthentication from '../hooks/useLensAuthentication'
import useLensProfile from '../hooks/useLensProfile'

export default function CustomConnectButton() {
    // const { address, isConnected } = useAccount()
    // const { login, createPost, isLoggedIn, loadingLogin, hasProfile, loadingProfile, profile } =
    //     useLensAuth()
    const { loading: loadingLogin, isLoggedIn, login } = useLensAuthentication()
    const {
        loading: loadingProfile,
        hasProfile,
        profile,
        openCreateProfileModal,
    } = useLensProfile()

    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <div
                        {...(!mounted && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <button
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 font-light rounded-lg px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        <WalletIcon className="w-4 h-4" />
                                        <span className="ml-1.5">Connect</span>
                                    </button>
                                )
                            }
                            if (chain.unsupported) {
                                return (
                                    <button
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 font-light rounded-lg px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                        <span className="ml-1.5">Wrong Network</span>
                                    </button>
                                )
                            }

                            if (loadingLogin || loadingProfile) {
                                return <></>
                            }

                            if (!isLoggedIn) {
                                return (
                                    <button
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-yellow-500/90 dark:from-purple-300/90 dark:via-pink-300/90 dark:to-yellow-300/90 font-light rounded-lg px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={login}
                                        type="button"
                                    >
                                        <Image
                                            src="/logos/lens_logo.png"
                                            className="dark:invert-[85%]"
                                            layout="fixed"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span className="ml-1.5">Login</span>
                                    </button>
                                )
                            }

                            if (!hasProfile) {
                                return (
                                    <button
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-yellow-500/90 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 font-light rounded-lg px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={openCreateProfileModal}
                                        type="button"
                                    >
                                        <Image
                                            src="/logos/lens_logo.png"
                                            className="dark:invert-[85%]"
                                            layout="fixed"
                                            width={16}
                                            height={16}
                                            alt=""
                                        />
                                        <span className="ml-1.5">Create Profile</span>
                                    </button>
                                )
                            }

                            return (
                                <div className="flex flex-row gap-2 xs:gap-3 h-11">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex items-center bg-gray-100 dark:bg-gray-850 px-3 xs:px-6 py-2 text-xs xs:text-sm font-normal xs:font-medium rounded-md drop-shadow-md dark:drop-shadow-lg hover:scale-105"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <div className="filter grayscale dark:invert">
                                                        <Image
                                                            src={chain.iconUrl}
                                                            alt={chain.name ?? 'Chain icon'}
                                                            layout="fixed"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <span className="hidden xs:block xs:ml-2 text-gray-900 dark:text-gray-100">
                                            {chain.name}
                                        </span>
                                    </button>
                                    <button
                                        onClick={openAccountModal}
                                        className="h-11 flex flex-row justify-center items-center bg-gray-100 dark:bg-gray-850 rounded-md text-xs xs:text-sm font-normal md:font-medium drop-shadow-md dark:drop-shadow-lg hover:scale-105"
                                    >
                                        <div className="flex justify-center items-center h-full px-3 xs:px-5 text-gray-900 dark:text-gray-100">
                                            {profile.handle}
                                        </div>

                                        <div className="h-11 w-11 rounded-r-md filter brightness-110 dark:brightness-90">
                                            <img
                                                src={profile.imageUrl}
                                                className="rounded-r-md"
                                                style={{
                                                    width: 44,
                                                    height: 44,
                                                    objectFit: 'cover',
                                                }}
                                                alt=""
                                                onError={(e) => {
                                                    e.currentTarget.src = '/logos/user_profile.png'
                                                    e.currentTarget.onerror = null
                                                }}
                                            />
                                        </div>
                                    </button>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
}
