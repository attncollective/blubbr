import { useEffect, useState } from 'react'

export default function useQuery(url, query) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function refetch(query) {
        setLoading(true)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => setError(err))
    }

    useEffect(() => {
        setLoading(true)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => setError(err))
    }, [])

    return { error, loading, data, refetch }
}
