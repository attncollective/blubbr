export default function NftDetails() {
    const [nfts, setNfts] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(null)

    function excludeNull(nfts) {
        let newNfts = []
        for (const nft of nfts) {
            if (nft.file_url != null) {
                newNfts.push(nft)
            }
        }
        return newNfts
    }

    useEffect(() => {
        setLoading(true)
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY,
            },
        }
        const url = `https://api.nftport.xyz/v0/accounts/${CONTRACT_ADDRESS}?chain=${CHAIN}&include=metadata&page_size=20`

        fetch(url, options)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.response == 'OK') {
                    setNfts(excludeNull(data.nfts))
                    setContinuation(data.continuation)
                    setTotal(data.total)
                    console.log(data.nfts)
                } else {
                    setError('Error fetching the data')
                }
                setLoading(false)
            })
    }, [])

    if (error)
        return (
            <div className="mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
                <h1>{error}</h1>
            </div>
        )

    if (!loading && !nfts)
        return (
            <div className="mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
                <h1>No NFTs</h1>
            </div>
        )

    return (
        <div className="w-full mt-24 ml-24 md:ml-64 xl:ml-80 mb-16">
            <div className="space-y-12 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 md:gap-x-8 2xl:grid-cols-5">
                {/* - NFTPorts - */}
                {nfts &&
                    nfts.map((nft) => (
                        <div key={nft.contract_address + nft.token_id}>
                            <NftCard
                                name={nft.name}
                                tokenId={nft.token_id}
                                symbol={null}
                                rawUrl={nft.file_url}
                            />
                        </div>
                    ))}
            </div>
            {nfts && !loading && (
                <div className="flex flex-col items-center mt-10">
                    <span className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                        Showing{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {nfts.length}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{total}</span>{' '}
                        Entries
                    </span>

                    <div className="inline-flex mt-2 xs:mt-0 z-10">
                        <button
                            onClick={reFetch}
                            className="py-2 px-8 rounded
                        text-sm font-medium text-black dark:text-white
                        bg-black/[18%] dark:bg-white/[10%] hover:bg-black/[33%] dark:hover:bg-white/[25%]"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {loading && (
                <div className="flex flex-col items-center mt-10">
                    <h1>Loading...</h1>
                </div>
            )}
        </div>
    )
}
