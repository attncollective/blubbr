import { useEffect, useState } from 'react'

export default function useBlockvision(contractAddress) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 1,
                jsonrpc: '2.0',
                method: 'nft_collectionMarketInfo',
                params: {
                    contractAddress: contractAddress,
                    pageSize: 10,
                    pageIndex: 0,
                },
            }),
        }
        fetch(`https://api.blockvision.org/v1/2FzxL3Ege8cBfQqBEoHUtPBlBxP`, options)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => setError(err))
    }, [])

    return { error, loading, data }
}
