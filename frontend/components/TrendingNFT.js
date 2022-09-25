export default function TrendingNFT({ name, address, symbol, totalSales, floor, volume }) {
    // const [imageUrl, setImageUrl] = useState(null)

    // async function fetchTokenData() {
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //         },
    //     }
    //     fetch(`https://api.coingecko.com/api/v3/coins/${ID}/contract/${address}`, options)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             if (data.market_data) {
    //                 setHide(false)
    //                 setPrice(data.market_data.current_price?.usd)
    //                 setUsdAmount(displayAmount(data.market_data.current_price?.usd * amount))
    //                 if (increaseTotalAmount)
    //                     increaseTotalAmount(data.market_data.current_price?.usd * amount)
    //                 if (data.image) setImageUrl(data.image.large)
    //                 else setImageUrl('/logos/btc_transparent.png')
    //             } else {
    //                 setPrice('N.A')
    //                 setUsdAmount('N.A')
    //                 setImageUrl('/logos/btc_transparent.png')
    //             }
    //         })
    //         .catch((err) => {
    //             setPrice('N.A')
    //             setUsdAmount('N.A')
    //             setImageUrl('/logos/btc_transparent.png')
    //             console.log(err)
    //         })
    //     setIsLoading(false)
    // }

    // useEffect(() => {
    //     fetchTokenData()
    // }, [])

    return (
        <tbody>
            <tr className="items-center justify-center border-b border-gray-400">
            <td scope="row" className="content-evenly py-2 px-6 font-medium text-gray-50 dark:text-gray-100">{name}</td>
            <td scope="row" className="justify-center py-2 px-36 font-medium text-gray-50 dark:text-gray-100">{symbol}</td>
            <td scope="row" className="content-center py-2 px-6 font-medium text-gray-50 dark:text-gray-100">{totalSales}</td>
            <td scope="row" className="content-center py-2 px-6 font-medium text-gray-50 dark:text-gray-100">{floor}</td>
            <td scope="row" className="content-center py-2 px-6 font-medium text-gray-50 dark:text-gray-100">{volume}</td>
            </tr>
        </tbody>
    )
}
