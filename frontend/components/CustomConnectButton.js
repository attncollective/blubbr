import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export default function CustomConnectButton() {
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
                                        className="text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-gray-850 dark:focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 xs:mr-0 hover:scale-105 xs:shadow-xl"
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        Connect
                                    </button>
                                )
                            }
                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                )
                            }
                            return (
                                <div className="flex gap-2 xs:gap-5 h-[44px]">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex items-center bg-gray-200 dark:bg-gray-850 px-3 xs:px-6 py-2 text-xs xs:text-sm font-normal xs:font-medium rounded-md drop-shadow-md dark:drop-shadow-lg hover:scale-105"
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
                                    <div className="bg-gray-200 dark:bg-gray-850 text-xs xs:text-sm font-normal md:font-medium rounded-md drop-shadow-md dark:drop-shadow-lg hover:scale-105">
                                        <button
                                            onClick={openAccountModal}
                                            className="flex justify-center items-center h-full w-full px-3 xs:px-6 text-gray-900 dark:text-gray-100"
                                        >
                                            {account.displayName}
                                        </button>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
}
