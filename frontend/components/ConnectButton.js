import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export default function Connectbutton() {
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
                                        className="text-gray-200 dark:text-gray-750 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 hover:scale-105 xs:shadow-xl"
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
                                <div className="flex gap-2 md:gap-5 h-[44px]">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex items-center bg-gray-200 dark:bg-gray-850 text-black dark:text-white px-3 md:px-4 py-[9px] text-xs md:text-sm font-normal md:font-medium rounded-md drop-shadow-lg hover:scale-105"
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
                                                    <Image
                                                        src={chain.iconUrl}
                                                        alt={chain.name ?? 'Chain icon'}
                                                        layout="fixed"
                                                        width={24}
                                                        height={24}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <span className="hidden md:block md:ml-3">
                                            {chain.name}
                                        </span>
                                    </button>
                                    <div className="bg-gray-200 dark:bg-gray-850 text-black dark:text-white text-xs md:text-sm font-normal md:font-medium rounded-md drop-shadow-lg hover:scale-105">
                                        <button
                                            onClick={openAccountModal}
                                            className="md:px-3 px-4 py-[12px]"
                                        >
                                            {account.displayName + ' ' + account.displayBalance}
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
