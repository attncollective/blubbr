export default function TrendingNFT({
    name,
    address,
    symbol,
    totalSales,
    floor,
    volume,
    imageUrl,
}) {
    return (
        <div className="w-full h-14 grid grid-cols-6 font-light text-gray-700 dark:text-gray-300">
            <div className="col-span-2 flex justify-start items-center">
                <div className="h-[36px] w-[36px] mr-3">
                    <img
                        src={imageUrl}
                        className="rounded-full"
                        style={{
                            width: '36px',
                            height: '36px',
                            objectFit: 'cover',
                        }}
                        alt=""
                        onError={(e) => {
                            e.currentTarget.src = '/logos/user_profile.png'
                            e.currentTarget.onerror = null
                        }}
                    />
                </div>
                <div>{name}</div>
            </div>
            <div className="flex justify-start items-center uppercase">{symbol}</div>
            <div className="flex justify-start items-center">{totalSales}</div>
            <div className="flex justify-start items-center">{floor}</div>
            <div className="flex justify-start items-center">{volume}</div>
        </div>
    )
}
