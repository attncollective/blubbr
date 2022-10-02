import Image from 'next/image'
import CustomConnectButton from './CustomConnectButton'

export default function Navbar() {
    return (
        <nav className="px-4 sm:px-6 lg:px-8 xl:px-10 fixed w-full h-16 z-20 top-0 left-0 bg-gray-850 xs:bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-850 dark:to-gray-750 xs:shadow-none shadow-2xl">
            <div className="flex flex-no-wrap w-full h-full justify-between xs:justify-end items-center">
                <div className="flex xs:hidden invert-[80%] dark:invert-0">
                    <Image
                        src="/logos/attnmoney_bg.png"
                        alt="attn.money logo"
                        layout="intrinsic"
                        width="110"
                        height="76"
                    />
                </div>
                {/* <form onSubmit={''} className="z-30 rounded-lg shadow-lg dark:shadow-xl mr-[500px]">
                    <input
                        className="h-12 w-[490px] text-start bg-gray-100 dark:bg-gray-850 border-gray-100 dark:border-gray-850 rounded-lg"
                        name="address"
                        id="address"
                        type="text"
                        placeholder="Search Tokens, Addresses or NFTs"
                        required={true}
                        value={''}
                        onChange={(e) => {}}
                    />
                </form> */}
                <div className="flex xs:order-2">
                    <CustomConnectButton />
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg xs:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    )
}
