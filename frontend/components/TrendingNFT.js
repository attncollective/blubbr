export default function TrendingNFT({ name, address, symbol, totalSales, floor, volume }) {

    return (
        <tbody>
            <tr className="gray-500 border-b border-gray-400 w-40">
            <td scope="row" className="py-4 px-6 font-medium text-gray-50 dark:text-gray-100 w-40">{name}</td>
            <td scope="row" className="py-4 px-6 font-medium text-gray-50 dark:text-gray-100">{address}</td>
            <td scope="row" className="py-4 px-6 font-medium text-gray-50 dark:text-gray-100">{symbol}</td>
            <td scope="row" className="py-4 px-6 font-medium text-gray-50 dark:text-gray-100">{totalSales}</td>
            <td scope="row" className="py-4 px-6 font-medium text-gray-50 dark:text-gray-100">{floor}</td>
            <td scope="row" className="py-4 px-6 font-medium text-gray-50 dark:text-gray-100">{volume}</td>
            </tr>
        </tbody>
    )
}
