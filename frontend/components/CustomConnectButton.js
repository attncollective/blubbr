import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { verifyMessage } from 'ethers/lib/utils'
import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import useLensAuth from '../hooks/useLensAuth'
import { WalletIcon } from '@heroicons/react/24/outline'

export default function CustomConnectButton({ toggleCreateProfileModal }) {
    const { address, isConnected } = useAccount()
    const [login, createPost, { loading, isLoggedIn, hasProfile, profile }] = useLensAuth(address)

    if (loading) {
        return <></>
    }

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
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850 dark:focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
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
                                        className="text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850 dark:focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        Wrong network
                                    </button>
                                )
                            }

                            if (!isLoggedIn) {
                                return (
                                    <button
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850 dark:focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={login}
                                        type="button"
                                    >
                                        <Image
                                            src="/logos/lens_logo.png"
                                            className="dark:invert-[85%]"
                                            layout="fixed"
                                            width={16}
                                            height={16}
                                        />
                                        <span className="ml-1.5">Login</span>
                                    </button>
                                )
                            }

                            if (!hasProfile) {
                                return (
                                    <button
                                        className="flex justify-center items-center text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850 dark:focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={toggleCreateProfileModal}
                                        type="button"
                                    >
                                        <Image
                                            src="/logos/lens_logo.png"
                                            className="dark:invert-[85%]"
                                            layout="fixed"
                                            width={16}
                                            height={16}
                                        />
                                        <span className="ml-1.5">Create Profile</span>
                                    </button>
                                )
                            }

                            return (
                                <div className="flex gap-2 xs:gap-3 h-[44px]">
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
                                        className="static h-[44px] bg-gray-100 dark:bg-gray-850 text-xs xs:text-sm font-normal md:font-medium rounded-l-md drop-shadow-md dark:drop-shadow-lg hover:scale-105"
                                    >
                                        <div className="flex justify-center items-center h-full w-full pl-3 xs:pl-5 pr-6 xs:pr-8 text-gray-900 dark:text-gray-100">
                                            {profile.handle}
                                        </div>
                                        <div className="absolute top-[0px] right-[-22px] border-[3px] rounded-full border-gray-200 dark:border-gray-850">
                                            <div className="h-[38px] w-[38px] filter brightness-110 dark:brightness-90">
                                                <img
                                                    src={profile.imageUrl}
                                                    className="rounded-full"
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        objectFit: 'cover',
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            '/logos/user_profile.png'
                                                        e.currentTarget.onerror = null
                                                    }}
                                                />
                                            </div>
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
