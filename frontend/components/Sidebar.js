import Image from 'next/image'
import {
    HomeIcon,
    UserIcon,
    FireIcon,
    HashtagIcon,
    BeakerIcon,
    CurrencyDollarIcon,
    CubeTransparentIcon,
    VideoCameraIcon,
} from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import Link from 'next/link'

export default function Sidebar() {
    const { address, isConnected } = useAccount()

    return (
        <aside
            className="hidden sm:flex w-20 md:w-60 xl:w-72 z-30 fixed top-0 left-0"
            aria-label="Sidebar"
        >
            <div className="h-screen bg-gray-100 dark:bg-gray-850 shadow-3xl-light dark:shadow-3xl-dark">
                <div className="pl-2 xl:pl-4 pr-3 xl:pr-6 h-full">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="my-2 mx-8 hidden md:flex opacity-[85%] dark:invert">
                                <Image
                                    src="/logos/blubbr_logo.png"
                                    alt="attn.money logo"
                                    layout="intrinsic"
                                    width="182"
                                    height="211"
                                />
                            </div>

                            <ul className="space-y-2">
                                <li className="mt-2 xl:mt-4">
                                    <Link href="/">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <HomeIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex ml-3">Home</span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/nftport/dashboard/">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <UserIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                My NftPort NFTs
                                            </span>
                                            {/* <span className="hidden md:inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-gray-200 dark:text-gray-850 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 dark:from-purple-300/80 dark:via-pink-300/80 dark:to-yellow-300/80 rounded-full">
                                            3
                                        </span> */}
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/quicknode/dashboard/">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <UserIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />

                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                My Quicknode NFTs
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tokens">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <UserIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                My Tokens
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                            <ul className="mt-5 xl:mt-8 space-y-2 border-gray-500 dark:border-gray-300">
                                <li className="mt-5 xl:mt-8">
                                    <Link href="/trending_nft">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <FireIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                Trending NFTs
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search_nfts">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <HashtagIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                Search NFTs
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search_tokens">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <CurrencyDollarIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                Search Tokens
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <BeakerIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                DeFi
                                            </span>
                                            <span className="hidden md:inline-flex justify-center items-center py-[2px] px-[6px] ml-3 text-xs font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                                Soon™
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <CubeTransparentIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                DAOs
                                            </span>
                                            <span className="hidden md:inline-flex justify-center items-center py-[2px] px-[6px] ml-3 text-xs font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                                Soon™
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#">
                                        <a className="flex justify-center md:justify-start items-center p-2 text-sm xl:text-base font-normal text-black rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <VideoCameraIcon className="flex-shrink-0 w-8 h-8 md:w-5 md:h-5 xl:w-6 xl:h-6 text-gray-700 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                                            <span className="hidden md:flex flex-1 ml-3 whitespace-nowrap">
                                                Creator
                                            </span>
                                            <span className="hidden md:inline-flex justify-center items-center py-[2px] px-[6px] ml-3 text-xs font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                                Soon™
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="mb-6"></div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
